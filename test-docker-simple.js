const Docker = require('dockerode');
const docker = new Docker({ socketPath: '/var/run/docker.sock' });

async function test() {
  try {
    const info = await docker.info();
    console.log('Docker Info:', info.Name, info.ServerVersion);
    const containers = await docker.listContainers();
    console.log('Running Containers:', containers.map(c => c.Names));
  } catch (e) {
    console.error('Docker Access Failed:', e.message);
  }
}

test();
