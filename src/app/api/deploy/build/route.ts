import { NextResponse } from "next/server";
import { BuildService } from "@/lib/builder";

export async function POST(request: Request) {
  const body = await request.json();
  const { repoUrl, projectId } = body;

  const builder = new BuildService(projectId);

  // 1. Clone Phase
  const cloneStatus = await builder.clone(repoUrl);
  
  // 2. Build Phase (Simulated async stream)
  const buildLogs = await builder.build();

  // 3. Deployment Phase
  const deployStatus = await builder.deployToNode("node-hkg-001");

  return NextResponse.json({
    success: true,
    workflow: [
      { step: "Clone Repo", detail: cloneStatus, timestamp: new Date().toISOString() },
      { step: "Automated Build", detail: buildLogs, timestamp: new Date().toISOString() },
      { step: "Edge Deployment", detail: deployStatus, timestamp: new Date().toISOString() }
    ]
  });
}
