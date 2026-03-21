import { prisma } from "./prisma";
import { dockerManager } from "./docker-manager";
import Docker from "dockerode";

const docker = new Docker({ socketPath: "/var/run/docker.sock" });

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

async function startMetricsHarvester() {
  console.log("Starting Metrics Harvester (Interval: 1m)...");
  setInterval(async () => {
    try {
      const containers = await docker.listContainers();
      const munchContainers = containers.filter(c => c.Names[0].startsWith("/muchvps-"));

      for (const c of munchContainers) {
        const serviceId = c.Names[0].replace("/muchvps-", "");
        const stats = await dockerManager.getStats(c.Names[0].replace("/", ""));
        
        await prisma.metric.create({
          data: {
            serviceId,
            cpu: stats.cpu,
            ram: stats.ram,
            requests: 0, // In real world, parse access logs
            latency: 0,
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
