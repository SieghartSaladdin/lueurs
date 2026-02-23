import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { Xendit } from "xendit-node";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { items, shippingAddress, shippingCost, courier } = body;

    if (!items || items.length === 0 || !shippingAddress || shippingCost === undefined) {
      return NextResponse.json({ message: "Invalid request data" }, { status: 400 });
    }

    // Calculate total amount from DB to prevent tampering
    let totalAmount = shippingCost;
    const orderItems = [];
    let totalWeight = 0;

    for (const item of items) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: item.variantId },
        include: { product: true },
      });

      if (!variant) {
        return NextResponse.json({ message: `Variant ${item.variantId} not found` }, { status: 404 });
      }

      const itemTotal = Number(variant.price) * item.quantity;
      totalAmount += itemTotal;
      totalWeight += variant.weight * item.quantity;

      orderItems.push({
        variantId: variant.id,
        quantity: item.quantity,
        price: variant.price,
        name: `${variant.product.name} - ${variant.volume}ml`,
      });
    }

    // Create Order in Database
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        status: "PENDING",
        paymentMethod: "XENDIT_INVOICE",
        shippingCost,
        courier,
        shippingAddress,
        totalAmount,
        items: {
          create: orderItems.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    // Initialize Xendit
    const xendit = new Xendit({
      secretKey: process.env.XENDIT_SECRET_KEY || "",
    });

    const invoiceData = {
      externalId: order.id,
      amount: totalAmount,
      payerEmail: session.user.email || "",
      description: `Order ${order.id} from Lueurs`,
      successRedirectUrl: `${process.env.NEXTAUTH_URL}/profile`,
      failureRedirectUrl: `${process.env.NEXTAUTH_URL}/checkout`,
      items: [
        ...orderItems.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: Number(item.price),
        })),
        {
          name: `Shipping (${courier.toUpperCase()})`,
          quantity: 1,
          price: shippingCost,
        },
      ],
    };

    const invoice = await xendit.Invoice.createInvoice({
      data: invoiceData,
    });

    // Update order with Xendit Invoice ID
    await prisma.order.update({
      where: { id: order.id },
      data: { xenditInvoiceId: invoice.id },
    });

    return NextResponse.json({
      invoiceUrl: invoice.invoiceUrl,
      orderId: order.id,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
