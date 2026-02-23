import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const provinceId = searchParams.get("province");

    if (!provinceId) {
      return NextResponse.json({ message: "Province ID is required" }, { status: 400 });
    }

    const response = await fetch(`https://rajaongkir.komerce.id/api/v1/destination/city/${provinceId}`, {
      headers: {
        key: process.env.RAJAONGKIR_API_KEY_SHIPPING_COST || "",
      },
    });

    const data = await response.json();

    if (data.meta?.code !== 200) {
      return NextResponse.json(
        { message: data.meta?.message || "Failed to fetch cities" },
        { status: data.meta?.code || 500 }
      );
    }

    return NextResponse.json(data.data);
  } catch (error) {
    console.error("Error fetching cities:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
