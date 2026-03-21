import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.envVar.deleteMany();
  await prisma.log.deleteMany();
  await prisma.metric.deleteMany();
  await prisma.scalingEvent.deleteMany();
  await prisma.service.deleteMany();
  await prisma.region.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  // Create Regions
  const hkg = await prisma.region.create({
    data: { name: "Hong Kong", country: "HK", icon: "🇭🇰", latency: 20 },
  });
  const tpe = await prisma.region.create({
    data: { name: "Taipei", country: "TW", icon: "🇹🇼", latency: 10 },
  });
  const sng = await prisma.region.create({
    data: { name: "Singapore", country: "SG", icon: "🇸🇬", latency: 45 },
  });

  // Create a Demo User
  const hashedPassword = await bcrypt.hash("password123", 12);
  const user = await prisma.user.create({
    data: {
      email: "demo@muchcloud.com",
      name: "MuchCloud Demo",
      password: hashedPassword,
    },
  });

  // Create Projects
  const project1 = await prisma.project.create({
    data: {
      userId: user.id,
      name: "My Awesome App",
      env: "Production",
      status: "success",
    },
  });

  // Create Services for Project 1
  const service1 = await prisma.service.create({
    data: {
      projectId: project1.id,
      name: "Frontend UI",
      type: "Web Service",
      status: "live",
      port: 3000,
      regionId: hkg.id,
      envVars: {
        create: [
          { key: "API_URL", value: "https://api.awesomeapp.com" },
          { key: "NODE_ENV", value: "production" },
          { key: "STRIPE_KEY", value: "sk_test_51Mz...", isSecret: true },
        ],
      },
    },
  });

  const service2 = await prisma.service.create({
    data: {
      projectId: project1.id,
      name: "API Gateway",
      type: "Backend",
      status: "live",
      port: 8080,
      regionId: hkg.id,
    },
  });

  // Create more data if needed...
  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
