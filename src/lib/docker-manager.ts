import Docker from "dockerode";

const docker = new Docker({ socketPath: "/var/run/docker.sock" });

export interface ContainerConfig {
  name: string;
  image: string;
  subdomain: string;
  cpuLimit: number; // in cores
  memoryLimit: number; // in GB
  envVars?: Record<string, string>;
}

export const dockerManager = {
  async listContainers() {
    return await docker.listContainers({ all: true });
  },

  async createAndStart(config: ContainerConfig) {
    const { name, image, subdomain, cpuLimit, memoryLimit, envVars } = config;

    // Convert core limit to CpuQuota (assuming default period of 100000)
    const cpuQuota = Math.floor(cpuLimit * 100000);
    const memoryBytes = Math.floor(memoryLimit * 1024 * 1024 * 1024);

    const container = await docker.createContainer({
      Image: image,
      name: name,
      Env: Object.entries(envVars || {}).map(([k, v]) => `${k}=${v}`),
      Labels: {
        "traefik.enable": "true",
        [`traefik.http.routers.${name}.rule`]: `Host(\`${subdomain}.muchcloud.me\`)`,
        [`traefik.http.routers.${name}.entrypoints`]: "web",
        [`traefik.http.services.${name}.loadbalancer.server.port`]: "80", // Default for nginx:alpine
      },
      HostConfig: {
        CpuPeriod: 100000,
        CpuQuota: cpuQuota,
        Memory: memoryBytes,
        RestartPolicy: { Name: "always" },
        NetworkMode: "muchvps_network", // Custom network for Traefik access
      },
    });

    await container.start();
    return container;
  },

  async stopAndRemove(name: string) {
    try {
      const container = docker.getContainer(name);
      await container.stop();
      await container.remove();
    } catch (e) {
      console.error(`Failed to stop/remove container ${name}:`, e);
    }
  },

  async getLogs(name: string) {
    try {
      const container = docker.getContainer(name);
      const logs = await container.logs({
        stdout: true,
        stderr: true,
        tail: 50,
        follow: false,
      });
      return logs.toString("utf8").replace(/[\x00-\x1F\x7F-\x9F]/g, ""); // Clean non-printable chars
    } catch (e) {
      return "No logs available or container not running.";
    }
  },

  async getStats(name: string) {
    try {
      const container = docker.getContainer(name);
      const stats = await container.stats({ stream: false });
      
      // Calculate CPU percentage
      const cpuDelta = stats.cpu_stats.cpu_usage.total_usage - stats.precpu_stats.cpu_usage.total_usage;
      const systemDelta = stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage;
      const cpuPercent = (cpuDelta / systemDelta) * stats.cpu_stats.online_cpus * 100;
      
      // Memory
      const memUsage = stats.memory_stats.usage;
      const memLimit = stats.memory_stats.limit;
      const memPercent = (memUsage / memLimit) * 100;

      return {
        cpu: isNaN(cpuPercent) ? 0 : cpuPercent,
        ram: isNaN(memPercent) ? 0 : memPercent,
        memoryUsage: memUsage,
        memoryLimit: memLimit
      };
    } catch (e) {
      return { cpu: 0, ram: 0 };
    }
  },

  async inspect(name: string) {
    const container = docker.getContainer(name);
    return await container.inspect();
  },

  async execute(name: string, command: string) {
    try {
      const container = docker.getContainer(name);
      const exec = await container.exec({
        Cmd: ["/bin/sh", "-c", command],
        AttachStdout: true,
        AttachStderr: true,
      });
      const stream = await (exec.start({ hijack: true, Detach: false }) as Promise<any>);
      
      return await new Promise<string>((resolve, reject) => {
        let output = "";
        stream.on("data", (chunk: Buffer) => {
          output += chunk.toString("utf8");
        });
        stream.on("end", () => resolve(output.replace(/[\x00-\x1F\x7F-\x9F]/g, "")));
        stream.on("error", reject);
        
        // Timeout after 10 seconds for long running commands
        setTimeout(() => resolve(output + "\n[Execution Timeout]"), 10000);
      });
    } catch (e: any) {
      return `Error: ${e.message}`;
    }
  },

  async createSnapshot(name: string, snapshotImageName: string) {
    try {
      const container = docker.getContainer(name);
      // Pause to ensure consistent state
      await container.pause();
      await container.commit({ repo: snapshotImageName });
      await container.unpause();
      return true;
    } catch (e) {
      console.error("Snapshot error:", e);
      return false;
    }
  }
};
