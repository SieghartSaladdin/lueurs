import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("=== TESTING BITESHIP ORDER CREATION ===");

    const biteshipPayload = {
      shipper_contact_name: "Lueurs Official",
      shipper_contact_phone: "081234567890",
      shipper_contact_email: "hello@lueurs.com",
      shipper_organization: "Lueurs",
      origin_contact_name: "Lueurs Official",
      origin_contact_phone: "081234567890",
      origin_address: "Jl. Toko Lueurs No. 1, Jakarta",
      origin_postal_code: 12345,
      origin_coordinate: {
        latitude: -6.200000,
        longitude: 106.816666
      },
      destination_contact_name: "Test Customer",
      destination_contact_phone: "081234567891",
      destination_contact_email: "test@example.com",
      destination_address: "Jl. Tujuan Test No. 2, Bandung",
      destination_postal_code: 40111,
      destination_coordinate: {
        latitude: -6.914744,
        longitude: 107.609810
      },
      destination_note: "Test order",
      courier_company: "jne",
      courier_type: "reg",
      delivery_type: "now",
      items: [
        {
          name: "Test Perfume - 50ml",
          description: "Perfume",
          value: 150000,
          quantity: 1,
          weight: 200
        }
      ]
    };

    console.log("Payload:", JSON.stringify(biteshipPayload, null, 2));

    const biteshipResponse = await fetch("https://api.biteship.com/v1/orders", {
      method: "POST",
      headers: {
        "Authorization": process.env.BITESHIP_API_KEY || "",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(biteshipPayload)
    });

    const biteshipData = await biteshipResponse.json();
    console.log("Biteship Response:", JSON.stringify(biteshipData, null, 2));

    if (biteshipResponse.ok && biteshipData.success) {
      const trackingNumber = biteshipData.courier?.waybill_id || biteshipData.id;
      return NextResponse.json({ 
        success: true, 
        message: "Successfully created Biteship order", 
        trackingNumber: trackingNumber,
        fullResponse: biteshipData
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: "Failed to create Biteship order", 
        error: biteshipData.error || biteshipData 
      }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Error testing Biteship:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Internal server error", 
      error: error.message 
    }, { status: 500 });
  }
}
