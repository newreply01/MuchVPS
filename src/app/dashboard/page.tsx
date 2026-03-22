import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const projectsFromDb = await prisma.project.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      services: {
        include: {
          region: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Fetch recent activity across all projects
  const recentLogs = await prisma.log.findMany({
    where: {
      service: {
        project: {
          userId: session.user.id,
        },
      },
    },
    include: {
      service: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  // Fetch aggregate metrics for all user services
  const latestMetrics = await Promise.all(
    projectsFromDb.flatMap(p => p.services).map(async (s) => {
      const m = await prisma.metric.findFirst({
        where: { serviceId: s.id },
        orderBy: { timestamp: "desc" }
      });
      return m;
    })
  );

  const globalStats = {
    totalCpu: latestMetrics.reduce((acc, m) => acc + (m?.cpu || 0), 0) / (latestMetrics.length || 1),
    totalRam: latestMetrics.reduce((acc, m) => acc + (m?.ram || 0), 0) / (latestMetrics.length || 1),
    totalRequests: latestMetrics.reduce((acc, m) => acc + (m?.requests || 0), 0),
    avgLatency: latestMetrics.reduce((acc, m) => acc + (m?.latency || 0), 0) / (latestMetrics.filter(m => m?.latency).length || 1)
  };

  // Fetch aggregate history (last 20 data points)
  const allHistory = await prisma.metric.findMany({
    where: {
      service: {
        project: { userId: session.user.id }
      }
    },
    orderBy: { timestamp: "desc" },
    take: 100 // Take 100 and we'll group them
  });

  // Group by timestamp or just take chunks of latest per service
  // For a dash, we'll just show the last 20 global averages
  const historicalMetrics = Array.from({ length: 20 }).map((_, i) => {
    const slice = allHistory.slice(i * 5, (i + 1) * 5);
    if (!slice.length) return { timestamp: new Date().toISOString(), cpu: 0, ram: 0, requests: 0, latency: 0 };
    return {
      timestamp: slice[0].timestamp.toISOString(),
      cpu: slice.reduce((acc, m) => acc + m.cpu, 0) / slice.length,
      ram: slice.reduce((acc, m) => acc + m.ram, 0) / slice.length,
      requests: slice.reduce((acc, m) => acc + m.requests, 0) / slice.length,
      latency: slice.reduce((acc, m) => acc + m.latency, 0) / slice.length,
    };
  }).reverse();

  const projects = projectsFromDb.map((p) => {
    const region = p.services[0]?.region?.name || "Global";
    const lastDeploy = "Just now";

    return {
      id: p.id,
      name: p.name,
      env: p.env,
      status: p.status,
      servicesCount: p.services.length,
      region: region,
      lastDeploy: lastDeploy,
    };
  });

  return <DashboardClient initialProjects={projects} recentLogs={recentLogs} globalStats={globalStats} historicalMetrics={historicalMetrics} />;
}
