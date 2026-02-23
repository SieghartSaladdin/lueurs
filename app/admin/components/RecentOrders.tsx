import { formatCurrency } from "@/app/lib/utils";

export default function RecentOrders() {
  const orders = [
    {
      id: "#ORD-001",
      customer: "Eleanor Vance",
      date: "Oct 24, 2023",
      amount: formatCurrency(320.00),
      status: "Completed",
    },
    {
      id: "#ORD-002",
      customer: "Liam Gallagher",
      date: "Oct 23, 2023",
      amount: formatCurrency(185.00),
      status: "Processing",
    },
    {
      id: "#ORD-003",
      customer: "Sophia Loren",
      date: "Oct 22, 2023",
      amount: formatCurrency(450.00),
      status: "Shipped",
    },
    {
      id: "#ORD-004",
      customer: "James Dean",
      date: "Oct 21, 2023",
      amount: formatCurrency(120.00),
      status: "Completed",
    },
    {
      id: "#ORD-005",
      customer: "Audrey Hepburn",
      date: "Oct 20, 2023",
      amount: formatCurrency(210.00),
      status: "Pending",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Processing":
        return "bg-blue-100 text-blue-800";
      case "Shipped":
        return "bg-purple-100 text-purple-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
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
        <button className="text-sm font-medium text-amber-700 hover:text-amber-900 transition-colors">
          View All
        </button>
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
                  {order.id}
                </td>
                <td className="px-6 py-4">{order.customer}</td>
                <td className="px-6 py-4">{order.date}</td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  {order.amount}
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
          </tbody>
        </table>
      </div>
    </div>
  );
}
