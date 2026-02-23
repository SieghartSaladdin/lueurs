import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { destination, weight, courier } = body;

    if (!destination || !weight || !courier) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Origin fallback can be overridden via env STORE_CITY_ID
    const origin = process.env.STORE_CITY_ID || "153";
    const apiKey = process.env.RAJAONGKIR_API_KEY_SHIPPING_COST;

    if (!apiKey) {
      return NextResponse.json({ message: "Shipping API key is not configured" }, { status: 500 });
    }

    const response = await fetch("https://rajaongkir.komerce.id/api/v1/calculate/domestic-cost", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        key: apiKey,
      },
      body: new URLSearchParams({
        origin,
        destination: destination.toString(),
        weight: weight.toString(),
        courier: courier.toLowerCase(),
      }),
    });

    const data = await response.json();

    if (data.meta?.code !== 200) {
      return NextResponse.json(
        { message: data.meta?.message || "Failed to calculate shipping cost" },
        { status: data.meta?.code || 500 }
      );
    }

    const rawData = Array.isArray(data.data) ? data.data : [];
    let costs: Array<{ service: string; description: string; cost: number }> = [];

    if (rawData.length > 0 && Array.isArray(rawData[0]?.costs)) {
      costs = rawData[0].costs
        .map((item: any) => ({
          service: item?.service || "",
          description: item?.description || "",
          cost: Number(item?.cost ?? 0),
        }))
        .filter((item: { service: string; description: string; cost: number }) => item.cost > 0);
    } else if (rawData.length > 0 && rawData[0]?.cost !== undefined) {
      costs = rawData
        .map((item: any) => ({
          service: item?.service || item?.code || courier.toUpperCase(),
          description: item?.description || "",
          cost: Number(item?.cost ?? 0),
        }))
        .filter((item: { service: string; description: string; cost: number }) => item.cost > 0);
    }

    if (costs.length === 0) {
      return NextResponse.json(
        { message: "Shipping cost not available for this destination" },
        { status: 404 }
      );
    }

    return NextResponse.json({ costs });
  } catch (error) {
    console.error("Error calculating shipping cost:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
