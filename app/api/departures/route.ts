import { NextResponse } from "next/server";
import { getDepartures } from "@/lib/mta";
import { generateMockData } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export async function GET() {
  const now = Math.floor(Date.now() / 1000);

  // If no API key, return realistic mock data for demo/prototyping
  if (!process.env.MTA_API_KEY) {
    return NextResponse.json(generateMockData(now));
  }

  try {
    const data = await getDepartures();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in departures API:", error);
    return NextResponse.json(
      {
        stations: [],
        lastUpdated: now,
        error: "Failed to fetch departure data",
      },
      { status: 500 }
    );
  }
}
