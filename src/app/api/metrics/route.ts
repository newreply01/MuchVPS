import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const serviceId = searchParams.get("serviceId");

  // In a real app, we would query Prisma:
  // const metrics = await prisma.metric.findMany({ where: { serviceId }, orderBy: { timestamp: 'asc' }, take: 20 });
  
  // Mocking 20 historical data points for the last 2 hours
  const now = new Date();
  const metrics = Array.from({ length: 20 }).map((_, i) => {
    const time = new Date(now.getTime() - (19 - i) * 600000); // 10 mins apart
    return {
      id: `m-${i}`,
      timestamp: time.toISOString(),
      cpu: 20 + Math.random() * 40 + (i > 15 ? 30 : 0), // Simulate a spike at the end
      ram: 40 + Math.random() * 20,
      requests: Math.floor(500 + Math.random() * 500 + (i > 15 ? 1000 : 0)),
      latency: 20 + Math.random() * 10
    };
  });

  return NextResponse.json(metrics);
}
