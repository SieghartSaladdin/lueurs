import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://rajaongkir.komerce.id/api/v1/destination/province", {
      headers: {
        key: process.env.RAJAONGKIR_API_KEY_SHIPPING_COST || "",
      },
    });

    const data = await response.json();

    if (data.meta?.code !== 200) {
      return NextResponse.json(
        { message: data.meta?.message || "Failed to fetch provinces" },
        { status: data.meta?.code || 500 }
      );
    }

    return NextResponse.json(data.data);
  } catch (error) {
    console.error("Error fetching provinces:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
