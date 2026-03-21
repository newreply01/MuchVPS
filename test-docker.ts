import { prisma } from "./src/lib/prisma";
import { dockerManager } from "./src/lib/docker-manager";

async function test() {
  const service = await prisma.service.findFirst({
    include: { envVars: true }
  });
  
  if (!service) {
    console.error("No service found in DB");
    return;
  }
  
  console.log(`Starting test for service: ${service.name}`);
  
  try {
    await dockerManager.createAndStart({
      name: `test-muchvps-${service.id}`,
      image: "nginx:alpine",
      subdomain: "test-sub",
      cpuLimit: 0.5,
      memoryLimit: 1,
      envVars: {}
    });
    console.log("Container started successfully!");
    
    const containers = await dockerManager.listContainers();
    console.log("Current containers:", containers.map(c => c.Names));
    
    // Clean up
    await dockerManager.stopAndRemove(`test-muchvps-${service.id}`);
    console.log("Test cleanup complete.");
  } catch (e) {
    console.error("Test failed:", e);
  }
}

test();
