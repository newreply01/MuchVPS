import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { serviceId: string } }
) {
  const { serviceId } = params;
  const body = await request.json();
  const { newSpec, reason } = body;

  console.log(`[Scaling] Service ${serviceId} scaling to ${newSpec}. Reason: ${reason}`);

  // In a real app:
  // await prisma.service.update({ where: { id: serviceId }, data: { specCpu: ..., specRam: ... } });
  // await prisma.scalingEvent.create({ data: { serviceId, oldSpec: "Starter", newSpec, reason } });

  return NextResponse.json({ 
    success: true, 
    message: `Service ${serviceId} is successfully scaling to ${newSpec}.`,
    timestamp: new Date().toISOString()
  });
}
