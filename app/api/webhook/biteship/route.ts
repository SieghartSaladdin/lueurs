import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Biteship webhook payload structure
    // https://biteship.com/docs/api/webhooks
    const { event, order_id, status, waybill_id, courier_tracking_id } = body;

    if (event === "order.status.updated") {
      // Find the order in our database using the Biteship order_id
      // Assuming we saved the Biteship order_id in a field like `trackingNumber` or a new field
      // For now, we'll assume `trackingNumber` holds the Biteship order_id or waybill_id
      
      // You might need to adjust this based on how you store the Biteship order ID
      const order = await prisma.order.findFirst({
        where: {
          trackingNumber: waybill_id || courier_tracking_id,
        },
      });

      if (order) {
        let newStatus = order.status;

        // Map Biteship status to our OrderStatus enum
        switch (status) {
          case "allocated":
          case "picking_up":
          case "picked":
            newStatus = "PROCESSING";
            break;
          case "dropping_off":
            newStatus = "SHIPPED";
            break;
          case "delivered":
            newStatus = "DELIVERED";
            break;
          case "cancelled":
          case "rejected":
            newStatus = "CANCELLED";
            break;
        }

        if (newStatus !== order.status) {
          await prisma.order.update({
            where: { id: order.id },
            data: { status: newStatus as any },
          });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Biteship webhook error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
