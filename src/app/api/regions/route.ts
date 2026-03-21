import { NextResponse } from "next/server";

const REGIONS = [
  { id: "nrt", name: "Tokyo", country: "Japan", icon: "🇯🇵", latency: 24 },
  { id: "sfo", name: "San Francisco", country: "USA", icon: "🇺🇸", latency: 45 },
  { id: "fra", name: "Frankfurt", country: "Germany", icon: "🇩🇪", latency: 82 },
  { id: "hkg", name: "Hong Kong", country: "HK", icon: "🇭🇰", latency: 12 },
  { id: "sin", name: "Singapore", country: "Singapore", icon: "🇸🇬", latency: 38 },
];

export async function GET() {
  return NextResponse.json(REGIONS);
}
