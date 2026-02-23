import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(request: Request) {
  try {
    console.log("=== XENDIT WEBHOOK RECEIVED ===");
    
    // Verifikasi Token Xendit
    const xenditToken = request.headers.get("x-callback-token");
    console.log("Received Token:", xenditToken);
    const expectedToken = process.env.XENDIT_WEBHOOK_TOKEN;

    if (!expectedToken) {
      return NextResponse.json({ message: "Webhook token is not configured" }, { status: 500 });
    }

    if (xenditToken !== expectedToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    console.log("Webhook Payload:", JSON.stringify(body, null, 2));
    
    const event = String(body?.event || "").toLowerCase();
    const payload = body?.data ?? body;

    const invoiceId = payload?.id || body?.id;
    const externalId =
      payload?.external_id ||
      payload?.externalId ||
      payload?.reference_id ||
      payload?.referenceId ||
      payload?.metadata?.orderId ||
      body?.external_id ||
      body?.externalId;
      
    const status = String(payload?.status || body?.status || "").toUpperCase();

    // 1. PERBAIKAN: Ekstrak Payment Method dengan aman (mendukung String maupun Object)
    let rawPaymentMethod = "XENDIT_INVOICE";
    
    if (typeof payload?.payment_method === "string") {
        rawPaymentMethod = payload.payment_method;
    } else if (typeof payload?.payment_method === "object" && payload?.payment_method !== null) {
        // Ekstrak dari Object API v2 Xendit
        rawPaymentMethod = payload.payment_method.qr_code?.channel_code || payload.payment_method.type || "QRIS";
    } else if (payload?.payment_channel) {
        rawPaymentMethod = payload.payment_channel;
    } else if (payload?.channel_code) {
        rawPaymentMethod = payload.channel_code;
    } else if (event === "qr.payment") {
        rawPaymentMethod = "QRIS";
    }
    
    const paymentMethod = String(rawPaymentMethod).toUpperCase();

    // 2. PERBAIKAN: Tambahkan "COMPLETED" untuk mendeteksi pembayaran QRIS yang sukses
    let paymentStatus = "UNPAID";
    let orderStatus = "PENDING";

    if (["PAID", "SETTLED", "SUCCEEDED", "COMPLETED"].includes(status)) {
      paymentStatus = "PAID";
      orderStatus = "PROCESSING";
    } else if (["FAILED", "REFUNDED", "CANCELLED", "VOIDED", "EXPIRED"].includes(status)) {
      paymentStatus = status === "EXPIRED" ? "EXPIRED" : "FAILED";
      orderStatus = "CANCELLED";
    }

    // Resolve order berdasarkan external_id atau invoice id
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          externalId ? { id: String(externalId) } : undefined,
          invoiceId ? { xenditInvoiceId: String(invoiceId) } : undefined,
        ].filter(Boolean) as any,
      },
      select: { id: true },
    });

    if (!order) {
      console.error("Xendit webhook: order not found", { event, invoiceId, externalId, status });
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    // Update database
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: paymentStatus as any,
        status: orderStatus as any,
        paymentMethod: paymentMethod,
      },
    });

    return NextResponse.json({ message: "OK" });
  } catch (error) {
    console.error("Xendit webhook error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}