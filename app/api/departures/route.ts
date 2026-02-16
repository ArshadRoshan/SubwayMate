import { NextResponse } from "next/server";
import { getDepartures } from "@/lib/mta";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (!process.env.MTA_API_KEY) {
      return NextResponse.json(
        {
          stations: [],
          lastUpdated: Math.floor(Date.now() / 1000),
          error: "MTA_API_KEY is not configured. Get a free key at https://api.mta.info/#/AccessKey",
        },
        { status: 200 }
      );
    }

    const data = await getDepartures();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in departures API:", error);
    return NextResponse.json(
      {
        stations: [],
        lastUpdated: Math.floor(Date.now() / 1000),
        error: "Failed to fetch departure data",
      },
      { status: 500 }
    );
  }
}
