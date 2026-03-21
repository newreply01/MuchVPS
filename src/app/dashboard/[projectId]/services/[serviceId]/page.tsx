import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ServiceClient } from "@/components/dashboard/service-client";
import { redirect, notFound } from "next/navigation";

export default async function ServiceDetailPage({ params }: { params: Promise<{ projectId: string, serviceId: string }> }) {
  const session = await auth();
  const { projectId, serviceId } = await params;

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const service = await prisma.service.findUnique({
    where: {
      id: serviceId,
    },
    include: {
      region: true,
      envVars: true,
      project: true,
    },
  });

  if (!service || service.project.userId !== session.user.id) {
    notFound();
  }

  const metrics = await prisma.metric.findMany({
    where: { serviceId },
    orderBy: { timestamp: "asc" },
    take: 50,
  });

  const logs = await prisma.log.findMany({
    where: { serviceId },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <ServiceClient 
      projectId={projectId}
      service={service}
      initialMetrics={metrics}
      initialLogs={logs}
    />
  );
}
