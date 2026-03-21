import { prisma } from "./prisma";

const LOG_LEVELS = ["INFO", "WARN", "ERROR"];
const MESSAGES = [
  "Incoming GET /api/v1/users",
  "Cache hit for user:123",
  "Successfully processed payment",
  "Background job: clean-temp-files started",
  "Metric updated: cpu_usage=14.5%",
  "Database connection pool size: 8",
  "SSL certificate validated",
  "New websocket connection established",
];

export async function generateMockLog(serviceId: string) {
  const level = LOG_LEVELS[Math.floor(Math.random() * LOG_LEVELS.length)];
  const content = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];

  return await prisma.log.create({
    data: {
      serviceId,
      level,
      content,
    },
  });
}

export async function generateMockMetrics(serviceId: string) {
  const cpu = Math.random() * 100;
  const ram = Math.random() * 100;
  const requests = Math.floor(Math.random() * 1000);
  const latency = Math.floor(Math.random() * 100);

  return await prisma.metric.create({
    data: {
      serviceId,
      cpu,
      ram,
      requests,
      latency,
    },
  });
}
