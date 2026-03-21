"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { generateMockLog, generateMockMetrics } from "@/lib/log-generator";

export async function updateEnvVars(serviceId: string, envVars: { key: string; value: string; isSecret: boolean }[]) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Verify ownership of the service via project
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    include: { project: true },
  });

  if (!service || service.project.userId !== session.user.id) {
    throw new Error("Unauthorized or Service not found");
  }

  // Transaction to delete and recreate env vars
  await prisma.$transaction([
    prisma.envVar.deleteMany({
      where: { serviceId },
    }),
    prisma.envVar.createMany({
      data: envVars.map((ev) => ({
        serviceId,
        key: ev.key,
        value: ev.value,
        isSecret: ev.isSecret,
      })),
    }),
  ]);

  revalidatePath(`/dashboard/${service.projectId}/services/${serviceId}`);
  return { success: true };
}

export async function simulateActivity(serviceId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Verify ownership
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    include: { project: true },
  });

  if (!service || service.project.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  await generateMockLog(serviceId);
  await generateMockMetrics(serviceId);

  revalidatePath(`/dashboard/${service.projectId}/services/${serviceId}`);
  return { success: true };
}

export async function startService(serviceId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    include: { project: true },
  });

  if (!service || service.project.userId !== session.user.id) throw new Error("Unauthorized");

  await prisma.service.update({
    where: { id: serviceId },
    data: { status: "live" },
  });

  revalidatePath(`/dashboard/${service.projectId}/services/${serviceId}`);
  return { success: true };
}

export async function stopService(serviceId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    include: { project: true },
  });

  if (!service || service.project.userId !== session.user.id) throw new Error("Unauthorized");

  await prisma.service.update({
    where: { id: serviceId },
    data: { status: "stopped" },
  });

  revalidatePath(`/dashboard/${service.projectId}/services/${serviceId}`);
  return { success: true };
}

export async function restartService(serviceId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    include: { project: true },
  });

  if (!service || service.project.userId !== session.user.id) throw new Error("Unauthorized");

  await prisma.service.update({
    where: { id: serviceId },
    data: { status: "stopped" },
  });

  // Brief delay to simulate restart
  await new Promise((resolve) => setTimeout(resolve, 500));

  await prisma.service.update({
    where: { id: serviceId },
    data: { status: "live" },
  });

  revalidatePath(`/dashboard/${service.projectId}/services/${serviceId}`);
  return { success: true };
}

export async function rebuildService(serviceId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    include: { project: true },
  });

  if (!service || service.project.userId !== session.user.id) throw new Error("Unauthorized");

  await prisma.service.update({
    where: { id: serviceId },
    data: { status: "building" },
  });

  revalidatePath(`/dashboard/${service.projectId}/services/${serviceId}`);

  // Simulate long-running build in the background (simplified for demo)
  // In a real app, this would be a trigger to a worker/CI/CD
  setTimeout(async () => {
    try {
      await prisma.service.update({
        where: { id: serviceId },
        data: { status: "live" },
      });
      // Note: revalidatePath might not work as expected from a late setTimeout in a server action 
      // but for this demo, the client polling or user refresh will see it.
    } catch (e) {
      console.error("Delayed build failed", e);
    }
  }, 3000);

  return { success: true, message: "Build started" };
}

export async function deleteService(serviceId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    include: { project: true },
  });

  if (!service || service.project.userId !== session.user.id) throw new Error("Unauthorized");

  const projectId = service.projectId;

  await prisma.service.delete({
    where: { id: serviceId },
  });

  revalidatePath(`/dashboard/${projectId}`);
  return { success: true, redirect: `/dashboard/${projectId}` };
}

export async function updateServiceResources(
  serviceId: string, 
  resources: { specCpu: number; specRam: number; specDisk: number }
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    include: { project: true },
  });

  if (!service || service.project.userId !== session.user.id) throw new Error("Unauthorized");

  await prisma.service.update({
    where: { id: serviceId },
    data: {
      specCpu: resources.specCpu,
      specRam: resources.specRam,
      specDisk: resources.specDisk,
    },
  });

  revalidatePath(`/dashboard/${service.projectId}/services/${serviceId}`);
  return { success: true };
}
