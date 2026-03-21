"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function createProject(name: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const project = await prisma.project.create({
    data: {
      name,
      userId: session.user.id,
      env: "Production",
    },
  });

  revalidatePath("/dashboard");
  return project;
}

export async function createService(projectId: string, data: {
  name: string;
  type: string;
  regionId: string;
  specCpu: number;
  specRam: number;
  specDisk: number; // Added
}) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Verify project ownership
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project || project.userId !== session.user.id) {
    throw new Error("Unauthorized or Project not found");
  }

  // Generate a subdomain based on service name
  const sanitizedName = data.name.toLowerCase().replace(/[^a-z0-0]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  const randomSuffix = Math.random().toString(36).substring(2, 6);
  const subdomain = `${sanitizedName}-${randomSuffix}`;

  const service = await prisma.service.create({
    data: {
      name: data.name,
      type: data.type,
      projectId,
      regionId: data.regionId,
      specCpu: data.specCpu,
      specRam: data.specRam,
      specDisk: data.specDisk,
      subdomain: subdomain,
      status: "live",
    },
  });

  revalidatePath(`/dashboard/${projectId}`);
  return service;
}

export async function updateProject(projectId: string, data: { name?: string; env?: string }) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project || project.userId !== session.user.id) throw new Error("Unauthorized");

  const updatedProject = await prisma.project.update({
    where: { id: projectId },
    data,
  });

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/${projectId}`);
  return updatedProject;
}

export async function deleteProject(projectId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project || project.userId !== session.user.id) throw new Error("Unauthorized");

  await prisma.project.delete({
    where: { id: projectId },
  });

  revalidatePath("/dashboard");
  return { success: true, redirect: "/dashboard" };
}
