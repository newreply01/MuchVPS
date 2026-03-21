import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ProjectClient } from "@/components/dashboard/project-client";
import { redirect, notFound } from "next/navigation";

export default async function ProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const session = await auth();
  const { projectId } = await params;

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
      userId: session.user.id,
    },
    include: {
      services: {
        include: {
          region: true,
          metrics: {
            orderBy: { timestamp: "desc" },
            take: 1,
          },
        },
      },
    },
  });

  if (!project) {
    notFound();
  }

  const regionName = project.services[0]?.region?.name || "Global";

  const services = project.services.map((s) => {
    const latestMetric = s.metrics[0];
    return {
      id: s.id,
      name: s.name,
      type: s.type,
      status: s.status === "live" ? "Running" : "Stopped",
      cpu: latestMetric ? `${latestMetric.cpu.toFixed(1)}%` : "0.0%",
      memory: latestMetric ? `${(latestMetric.ram * 1024).toFixed(0)}MB` : "0MB",
      domain: `${s.name.toLowerCase().replace(/\s+/g, "-")}.muchvps.app`, // Mock domain for now
    };
  });

  return (
    <ProjectClient 
      projectId={projectId}
      projectName={project.name}
      services={services}
      regionName={regionName}
    />
  );
}
