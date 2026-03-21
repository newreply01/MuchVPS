"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function getBillingData() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Fetch all metrics for services owned by this user
  const metrics = await prisma.metric.findMany({
    where: {
      service: {
        project: {
          userId: session.user.id
        }
      }
    },
    include: {
      service: true
    },
    orderBy: {
      timestamp: 'desc'
    }
  });

  let totalCpuHours = 0;
  let totalRamGbHours = 0;

  metrics.forEach(m => {
    const service = (m as any).service;
    if (service) {
      totalCpuHours += (m.cpu / 100) * service.specCpu * (1/60);
      totalRamGbHours += (m.ram / 100) * service.specRam * (1/60);
    }
  });

  const cpuCost = totalCpuHours * 0.01;
  const ramCost = totalRamGbHours * 0.005;
  const totalCost = cpuCost + ramCost;

  return {
    balance: 0, // Mock balance for now
    estimatedMonthCost: totalCost * (30 * 24), // Extrapolate current run rate or just total accumulated
    accumulatedCost: totalCost,
    usage: {
      cpuHours: Math.round(totalCpuHours * 10) / 10,
      ramGbHours: Math.round(totalRamGbHours * 10) / 10,
      bandwidth: 0.5 // Mock for now
    }
  };
}
