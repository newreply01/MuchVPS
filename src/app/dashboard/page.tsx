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

  const projects = projectsFromDb.map((p) => {
    // Determine a representative region from services or default
    const region = p.services[0]?.region?.name || "Global";
    
    // Calculate last deploy relative time (simple mock for now)
    const lastDeploy = "Just now"; // In a real app, you'd calculate this from service status/updates

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

  return <DashboardClient initialProjects={projects} recentLogs={recentLogs} />;
}
