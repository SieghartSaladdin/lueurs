import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(request: Request) {
  try {
    console.log("=== XENDIT WEBHOOK RECEIVED ===");
    
    // ----------------------------------------------------------------
    // 1. VERIFIKASI KEAMANAN (TOKEN)
    // ----------------------------------------------------------------
    const xenditToken = request.headers.get("x-callback-token");
    const expectedToken = process.env.XENDIT_WEBHOOK_TOKEN;

    if (!expectedToken) {
      console.error("Missing XENDIT_WEBHOOK_TOKEN in .env");
      return NextResponse.json({ message: "Server misconfiguration" }, { status: 500 });
    }

    if (xenditToken !== expectedToken) {
      console.warn("Unauthorized webhook attempt");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // ----------------------------------------------------------------
    // 2. PARSE DATA DARI XENDIT
    // ----------------------------------------------------------------
    const body = await request.json();
    // console.log("Raw Webhook Body:", JSON.stringify(body).substring(0, 200) + "..."); 

    const event = String(body?.event || "").toLowerCase();
    const payload = body?.data ?? body;

    // Identifikasi ID Order
    const invoiceId = payload?.id || body?.id;
    const externalId =
      payload?.external_id ||
      payload?.externalId ||
      payload?.reference_id ||
      payload?.metadata?.orderId ||
      body?.external_id;
      
    const status = String(payload?.status || body?.status || "").toUpperCase();

    // Identifikasi Payment Method (Support String & Object)
    let rawPaymentMethod = "XENDIT_INVOICE";
    if (typeof payload?.payment_method === "string") {
        rawPaymentMethod = payload.payment_method;
    } else if (payload?.payment_method?.type) {
        rawPaymentMethod = payload.payment_method.type; // API v2
    } else if (payload?.payment_channel) {
        rawPaymentMethod = payload.payment_channel;
    } else if (payload?.channel_code) {
        rawPaymentMethod = payload.channel_code;
    }
    
    const paymentMethod = String(rawPaymentMethod).toUpperCase();

    // Tentukan Status untuk Database Kita
    let paymentStatus = "UNPAID";
    let orderStatus = "PENDING";

    if (["PAID", "SETTLED", "SUCCEEDED", "COMPLETED"].includes(status)) {
      paymentStatus = "PAID";
      orderStatus = "PROCESSING";
    } else if (["FAILED", "REFUNDED", "CANCELLED", "VOIDED", "EXPIRED"].includes(status)) {
      paymentStatus = status === "EXPIRED" ? "EXPIRED" : "FAILED";
      orderStatus = "CANCELLED";
    }

    // ----------------------------------------------------------------
    // 3. CARI ORDER DI DATABASE
    // ----------------------------------------------------------------
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          externalId ? { id: String(externalId) } : undefined,
          invoiceId ? { xenditInvoiceId: String(invoiceId) } : undefined,
        ].filter(Boolean) as any,
      },
      include: {
        user: true,
        items: {
          include: {
            variant: { include: { product: true } }
          }
        }
      }
    });

    if (!order) {
      console.error("Order not found for:", { invoiceId, externalId });
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    // Ambil tracking number yang sudah ada (jika ada)
    let trackingNumber = order.trackingNumber;

    // ----------------------------------------------------------------
    // 4. INTEGRASI BITESHIP (BUAT RESI OTOMATIS)
    // ----------------------------------------------------------------
    // Hanya jalan jika status PAID dan belum ada resi
    if (paymentStatus === "PAID" && !trackingNumber) {
      try {
        console.log(`[Biteship] Attempting creation for Order: ${order.id}`);
        
        const shippingAddress = typeof order.shippingAddress === 'string' 
          ? JSON.parse(order.shippingAddress) 
          : order.shippingAddress;

        // --- A. COURIER MAPPING (THE FIX) ---
        // Menggunakan data langsung dari order (yang sudah diset saat checkout)
        
        let courierCompany = order.courier || "jne"; // Default fallback
        let courierType = order.shippingService || "reg"; // Default fallback
        
        // Jika formatnya masih "company - type" (legacy support)
        if (courierCompany.includes("-")) {
            const parts = courierCompany.split("-");
            courierCompany = parts[0].trim();
            if (parts.length > 1 && !order.shippingService) {
                courierType = parts[1].trim(); 
            }
        }

        // --- B. ITEM FORMATTING ---
        const biteshipItems = order.items.map(item => ({
            name: `${item.variant.product.name} - ${item.variant.volume || ''}ml`,
            description: "Perfume", // Mandatory field
            value: Number(item.price || 0), // Convert Decimal to Number
            quantity: item.quantity,
            weight: item.variant.weight ? Number(item.variant.weight) : 200 // Default 200g
        }));

        // --- C. COORDINATE VALIDATION ---
        const destLat = shippingAddress.latitude ? parseFloat(shippingAddress.latitude) : null;
        const destLong = shippingAddress.longitude ? parseFloat(shippingAddress.longitude) : null;

        // --- D. BUILD PAYLOAD ---
        const biteshipPayload: any = {
          shipper_contact_name: "Lueurs Official",
          shipper_contact_phone: "081234567890",
          shipper_contact_email: "hello@lueurs.com",
          shipper_organization: "Lueurs",
          origin_contact_name: "Lueurs Official",
          origin_contact_phone: "081234567890",
          origin_address: "Jl. Toko Lueurs No. 1, Jakarta",
          origin_postal_code: 12345, // Pastikan sesuai koordinat toko
          origin_coordinate: {
            latitude: -6.200000,
            longitude: 106.816666
          },
          destination_contact_name: order.user.name || "Customer",
          destination_contact_phone: shippingAddress.phone || "081234567891",
          destination_contact_email: order.user.email || "customer@example.com",
          destination_address: shippingAddress.street || shippingAddress.address || "Alamat detail",
          destination_postal_code: parseInt(shippingAddress.postalCode) || 0,
          destination_note: shippingAddress.note || "Order from Lueurs",
          courier_company: courierCompany,
          courier_type: courierType, // Menggunakan hasil mapping
          delivery_type: "now",
          items: biteshipItems
        };

        // Inject coordinate hanya jika valid
        if (destLat && destLong) {
            biteshipPayload.destination_coordinate = {
                latitude: destLat,
                longitude: destLong
            };
        }

        console.log(`[Biteship] Sending payload with courier: ${courierCompany} (${courierType})`);

        // --- E. SEND REQUEST ---
        const biteshipResponse = await fetch("https://api.biteship.com/v1/orders", {
          method: "POST",
          headers: {
            "Authorization": process.env.BITESHIP_API_KEY || "",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(biteshipPayload)
        });

        const biteshipData = await biteshipResponse.json();

        if (biteshipResponse.ok && biteshipData.success) {
          trackingNumber = biteshipData.courier?.waybill_id || biteshipData.id;
          console.log(">>> SUCCESS: Biteship Order Created:", trackingNumber);
        } else {
          console.error(">>> FAILED: Biteship Error:", JSON.stringify(biteshipData));
          // Note: Kita TIDAK throw error agar status di DB tetap terupdate jadi PAID
        }
      } catch (biteshipError) {
        console.error(">>> ERROR: Exception in Biteship Logic:", biteshipError);
      }
    }

    // ----------------------------------------------------------------
    // 5. UPDATE DATABASE FINAL
    // ----------------------------------------------------------------
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: paymentStatus as any,
        status: orderStatus as any,
        paymentMethod: paymentMethod,
        trackingNumber: trackingNumber // Null jika gagal, Terisi jika sukses
      },
    });

    return NextResponse.json({ message: "OK", tracking: trackingNumber });

  } catch (error: any) {
    console.error("Xendit webhook critical error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}