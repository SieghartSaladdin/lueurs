import { NextResponse } from "next/server";
import { getTrendingProducts } from "@/app/lib/data";

export async function GET() {
  try {
    const products = await getTrendingProducts();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch trending products" }, { status: 500 });
  }
}
