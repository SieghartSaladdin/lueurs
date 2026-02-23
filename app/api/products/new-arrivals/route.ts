import { NextResponse } from "next/server";
import { getNewArrivals } from "@/app/lib/data";

export async function GET() {
  try {
    const products = await getNewArrivals();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch new arrivals" }, { status: 500 });
  }
}
