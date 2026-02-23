import { formatCurrency } from "@/app/lib/utils";

export default function AnalyticsChart() {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-display font-medium text-gray-900">
            Sales Overview
          </h3>
          <p className="text-sm text-gray-500 font-light">
            Revenue from all channels
          </p>
        </div>
        <select className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 block p-2.5 outline-none">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>This year</option>
        </select>
      </div>

      {/* Dummy Chart Area */}
      <div className="flex-1 relative w-full min-h-[250px] bg-gray-50 rounded-lg border border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 flex items-end justify-between px-4 pt-10 pb-8">
          {/* Dummy Bars */}
          {[40, 70, 45, 90, 65, 85, 100].map((height, i) => (
            <div key={i} className="w-1/12 flex flex-col items-center group">
              <div
                className="w-full bg-amber-700/20 group-hover:bg-amber-700/40 rounded-t-sm transition-all duration-300 relative"
                style={{ height: `${height}%` }}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {formatCurrency(height * 120)}
                </div>
              </div>
              <span className="text-xs text-gray-400 mt-2 font-medium">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
