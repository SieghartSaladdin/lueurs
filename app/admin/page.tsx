import StatCard from "./components/StatCard";
import RecentOrders from "./components/RecentOrders";
import AnalyticsChart from "./components/AnalyticsChart";
import { formatCurrency } from "@/app/lib/utils";
import { prisma } from "@/app/lib/prisma";

export default async function AdminPage() {
  // Fetch real data
  const [totalOrders, totalRevenueResult, activeCustomers, topProducts] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: {
        totalAmount: true,
      },
      where: {
        paymentStatus: "PAID",
      },
    }),
    prisma.user.count({
      where: {
        role: "CUSTOMER",
      },
    }),
    prisma.orderItem.groupBy({
      by: ['variantId'],
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: 4,
    }),
  ]);

  const totalRevenue = Number(totalRevenueResult._sum.totalAmount || 0);

  // Fetch product details for top products
  const topProductsDetails = await Promise.all(
    topProducts.map(async (tp) => {
      const variant = await prisma.productVariant.findUnique({
        where: { id: tp.variantId },
        include: { product: true },
      });
      return {
        name: `${variant?.product.name} (${variant?.volume}ml)`,
        sales: tp._sum.quantity || 0,
        price: formatCurrency(Number(variant?.price || 0)),
      };
    })
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-medium text-gray-900 mb-2">
            Dashboard Overview
          </h1>
          <p className="text-gray-500 font-light">
            Welcome back, Admin. Here's what's happening with your store today.
          </p>
        </div>
        <button className="bg-black text-white px-6 py-2.5 rounded-lg text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors shadow-md">
          <i className="fas fa-download mr-2"></i>
          Export Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          trend="+20.1%"
          isPositive={true}
          icon="fas fa-money-bill-wave"
        />
        <StatCard
          title="Total Orders"
          value={totalOrders.toString()}
          trend="+12.5%"
          isPositive={true}
          icon="fas fa-shopping-bag"
        />
        <StatCard
          title="Active Customers"
          value={activeCustomers.toString()}
          trend="+5.2%"
          isPositive={true}
          icon="fas fa-users"
        />
        <StatCard
          title="Conversion Rate"
          value="3.24%"
          trend="-1.1%"
          isPositive={false}
          icon="fas fa-chart-line"
        />
      </div>

      {/* Charts & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AnalyticsChart />
        </div>
        <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-display font-medium text-gray-900 mb-6">
            Top Selling Products
          </h3>
          <div className="space-y-6">
            {topProductsDetails.map((product, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-stone-100 rounded-lg flex items-center justify-center text-amber-700 font-bold">
                    #{i + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500 font-light">
                      {product.sales} sales
                    </p>
                  </div>
                </div>
                <span className="font-medium text-gray-900">{product.price}</span>
              </div>
            ))}
            {topProductsDetails.length === 0 && (
              <p className="text-gray-500 text-sm">No sales data available yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <RecentOrders />
    </div>
  );
}
