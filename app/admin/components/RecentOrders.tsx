import { formatCurrency } from "@/app/lib/utils";
import { prisma } from "@/app/lib/prisma";
import Link from "next/link";

export default async function RecentOrders() {
  const orders = await prisma.order.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: { name: true },
      },
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "PROCESSING":
        return "bg-blue-100 text-blue-800";
      case "SHIPPED":
        return "bg-purple-100 text-purple-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-lg font-display font-medium text-gray-900">
          Recent Orders
        </h3>
        <Link href="/admin/orders" className="text-sm font-medium text-amber-700 hover:text-amber-900 transition-colors">
          View All
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-widest font-bold">
              <th className="px-6 py-4 border-b border-gray-100">Order ID</th>
              <th className="px-6 py-4 border-b border-gray-100">Customer</th>
              <th className="px-6 py-4 border-b border-gray-100">Date</th>
              <th className="px-6 py-4 border-b border-gray-100">Amount</th>
              <th className="px-6 py-4 border-b border-gray-100">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm font-light text-gray-700">
            {orders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
              >
                <td className="px-6 py-4 font-medium text-gray-900">
                  #{order.id.slice(-6).toUpperCase()}
                </td>
                <td className="px-6 py-4">{order.user.name || "Guest"}</td>
                <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  {formatCurrency(Number(order.totalAmount))}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No recent orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
