import { formatCurrency } from "@/app/lib/utils";
import { prisma } from "@/app/lib/prisma";

export default async function AnalyticsChart() {
  // Get sales data for the last 7 days
  const today = new Date();
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    return d;
  }).reverse();

  const salesData = await Promise.all(
    last7Days.map(async (date) => {
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      const result = await prisma.order.aggregate({
        _sum: {
          totalAmount: true,
        },
        where: {
          paymentStatus: "PAID",
          createdAt: {
            gte: date,
            lt: nextDay,
          },
        },
      });

      return {
        date,
        amount: Number(result._sum.totalAmount || 0),
      };
    })
  );

  const maxAmount = Math.max(...salesData.map(d => d.amount), 1); // Avoid division by zero

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-display font-medium text-gray-900">
            Sales Overview
          </h3>
          <p className="text-sm text-gray-500 font-light">
            Revenue from the last 7 days
          </p>
        </div>
      </div>

      {/* Chart Area */}
      <div className="flex-1 relative w-full min-h-[250px] bg-gray-50 rounded-lg border border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 flex items-end justify-between px-4 pt-10 pb-8">
          {salesData.map((data, i) => {
            const heightPercentage = (data.amount / maxAmount) * 100;
            const dayName = data.date.toLocaleDateString('en-US', { weekday: 'short' });

            return (
              <div key={i} className="w-1/12 flex flex-col items-center group">
                <div
                  className="w-full bg-amber-700/20 group-hover:bg-amber-700/40 rounded-t-sm transition-all duration-300 relative"
                  style={{ height: `${Math.max(heightPercentage, 5)}%` }} // Minimum height for visibility
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    {formatCurrency(data.amount)}
                  </div>
                </div>
                <span className="text-xs text-gray-400 mt-2 font-medium">
                  {dayName}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
