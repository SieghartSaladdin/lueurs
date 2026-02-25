import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import { formatCurrency } from "@/app/lib/utils";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      user: {
        select: { name: true, email: true },
      },
      items: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "PROCESSING":
        return "bg-blue-100 text-blue-800";
      case "SHIPPED":
        return "bg-purple-100 text-purple-800";
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800";
      case "UNPAID":
        return "bg-yellow-100 text-yellow-800";
      case "FAILED":
      case "EXPIRED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-medium text-gray-900 mb-2">
          Orders
        </h1>
        <p className="text-gray-500 font-light">
          Manage customer orders, update status, and add tracking numbers.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-gray-500">
                  Order ID
                </th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-gray-500">
                  Customer
                </th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-gray-500">
                  Date
                </th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-gray-500">
                  Total
                </th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-gray-500">
                  Payment
                </th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-gray-500">
                  Status
                </th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-gray-500 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 font-medium text-gray-900">
                    #{order.id.slice(-6).toUpperCase()}
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-medium text-gray-900">
                      {order.user.name || "Guest"}
                    </p>
                    <p className="text-xs text-gray-500">{order.user.email}</p>
                  </td>
                  <td className="py-4 px-6 text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 font-medium text-gray-900">
                    {formatCurrency(Number(order.totalAmount))}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(
                        order.paymentStatus
                      )}`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-black hover:underline text-sm font-medium"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
