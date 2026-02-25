import { prisma } from "@/app/lib/prisma";
import { notFound } from "next/navigation";
import OrderDetails from "../components/OrderDetails";

export default async function AdminOrderDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: {
        select: { name: true, email: true },
      },
      items: {
        include: {
          variant: {
            include: {
              product: {
                select: { name: true, images: true },
              },
            },
          },
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  // Convert Decimal to number for Client Component
  const formattedOrder = {
    ...order,
    shippingCost: Number(order.shippingCost),
    totalAmount: Number(order.totalAmount),
    items: order.items.map((item) => ({
      ...item,
      price: Number(item.price),
      variant: {
        ...item.variant,
        price: Number(item.variant.price),
      },
    })),
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-medium text-gray-900 mb-2">
          Order #{order.id.slice(-6).toUpperCase()}
        </h1>
        <p className="text-gray-500 font-light">
          Placed on {new Date(order.createdAt).toLocaleDateString()} at{" "}
          {new Date(order.createdAt).toLocaleTimeString()}
        </p>
      </div>

      <OrderDetails order={formattedOrder} />
    </div>
  );
}
