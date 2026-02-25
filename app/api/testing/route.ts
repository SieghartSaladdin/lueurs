import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("=== CHECKING BITESHIP COURIER LIST ===");

    // 1. Hit Endpoint Biteship untuk dapat list kurir
    const response = await fetch("https://api.biteship.com/v1/couriers", {
      method: "GET",
      headers: {
        "Authorization": process.env.BITESHIP_API_KEY || "",
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();

    // 2. Log hasilnya di terminal server biar enak dibaca
    // (Data ini biasanya panjang banget)
    // console.log("Courier List Response:", JSON.stringify(data, null, 2));

    if (response.ok && data.success) {
      // Kita return datanya ke browser
      return NextResponse.json({ 
        success: true, 
        message: "Successfully fetched courier list", 
        // Data kurir ada di sini
        couriers: data.couriers 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: "Failed to fetch couriers", 
        error: data.error || data 
      }, { status: 400 });
    }

  } catch (error: any) {
    console.error("Error fetching couriers:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Internal server error", 
      error: error.message 
    }, { status: 500 });
  }
}