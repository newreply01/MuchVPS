import { prisma } from "./prisma";
import { dockerManager } from "./docker-manager";
import Docker from "dockerode";
import fs from "fs";
import path from "path";
import axios from "axios";

const docker = new Docker({ socketPath: "/var/run/docker.sock" });
const ACCESS_LOG = "/home/xg/czb/logs/access.log";

async function getTraefikMetrics(serviceId: string) {
  try {
    if (!fs.existsSync(ACCESS_LOG)) return { requests: 0, latency: 0 };
    const content = fs.readFileSync(ACCESS_LOG, "utf8");
    const lines = content.trim().split("\n");
    
    // Filter lines for this service in the last minute (rough estimate by taking end of log)
    const recentLines = lines.slice(-200).filter(l => l.includes(`muchvps-${serviceId}`));
    
    const latencies = recentLines.map(l => {
      const match = l.match(/(\d+)ms$/);
      return match ? parseInt(match[1]) : 0;
    }).filter(v => v > 0);

    return {
      requests: recentLines.length,
      latency: latencies.length > 0 ? latencies.reduce((a, b) => a + b, 0) / latencies.length : 0
    };
  } catch (e) {
    console.error("Log parse error", e);
    return { requests: 0, latency: 0 };
  }
}

async function performHealthChecks() {
  const services = await prisma.service.findMany({
    where: { status: { in: ["live", "unhealthy"] } }
  });

  for (const service of services) {
    if (!service.subdomain) continue;
    
    try {
      // Ping the internal traefik route or external if possible
      // In this dev env, we'll try to reach it via localhost:80 with Host header
      const url = `http://localhost`;
      const response = await axios.get(url, {
        headers: { Host: `${service.subdomain}.muchvps.cloud` },
        timeout: 5000,
        validateStatus: () => true // Accept any status to confirm server is up
      });

      const newStatus = response.status >= 200 && response.status < 500 ? "live" : "unhealthy";
      
      if (service.status !== newStatus) {
        await prisma.service.update({
          where: { id: service.id },
          data: { status: newStatus }
        });
      }
    } catch (e) {
      if (service.status !== "unhealthy") {
        await prisma.service.update({
          where: { id: service.id },
          data: { status: "unhealthy" }
        });
      }
    }
  }
}

async function startEventMonitor() {
  console.log("Starting Docker Event Monitor...");
  const stream = await docker.getEvents({
    filters: { type: ["container"] }
  });

  stream.on("data", async (chunk) => {
    try {
      const event = JSON.parse(chunk.toString());
      const containerName = event.Actor.Attributes.name;
      
      if (containerName?.startsWith("muchvps-")) {
        const serviceId = containerName.replace("muchvps-", "");
        const status = event.status; // start, stop, die, etc.
        
        console.log(`Event detected: ${status} for ${serviceId}`);

        await prisma.log.create({
          data: {
            serviceId,
            content: `Docker Event: Container ${status} (${event.from})`,
            level: status === "die" ? "ERROR" : "INFO",
          }
        });

        // Sync DB status if needed
        if (status === "start") {
          await prisma.service.update({ where: { id: serviceId }, data: { status: "live" } });
        } else if (status === "stop" || status === "die") {
          await prisma.service.update({ where: { id: serviceId }, data: { status: "stopped" } });
        }
      }
    } catch (e) {
      console.error("Event processing error:", e);
    }
  });
}

export function startMetricsHarvester() {
  console.log("🚀 Powering up MuchVPS Metrics Harvester...");
  
  setInterval(async () => {
    try {
      await performHealthChecks();
      
      const services = await prisma.service.findMany({
        where: { status: "live" }
      });
      const containers = await docker.listContainers();
      const munchContainers = containers.filter(c => c.Names[0].startsWith("/muchvps-"));

      for (const c of munchContainers) {
        const serviceId = c.Names[0].replace("/muchvps-", "");
        const stats = await dockerManager.getStats(c.Names[0].replace("/", ""));
        const traffic = await getTraefikMetrics(serviceId);
        
        await prisma.metric.create({
          data: {
            serviceId,
            cpu: stats.cpu,
            ram: stats.ram,
            requests: traffic.requests,
            latency: Math.round(traffic.latency),
          }
        });
      }
    } catch (e) {
      console.error("Harvester error:", e);
    }
  }, 60000);
}

async function main() {
  await startEventMonitor();
  await startMetricsHarvester();
}

main().catch(console.error);
