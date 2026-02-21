export default function StatCard({
  title,
  value,
  trend,
  isPositive,
  icon,
}: {
  title: string;
  value: string;
  trend: string;
  isPositive: boolean;
  icon: string;
}) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">
            {title}
          </p>
          <h3 className="text-3xl font-display font-medium text-gray-900">
            {value}
          </h3>
        </div>
        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
          <i className={`${icon} text-xl`}></i>
        </div>
      </div>
      <div className="flex items-center text-sm">
        <span
          className={`font-medium flex items-center ${
            isPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          <i
            className={`fas ${
              isPositive ? "fa-arrow-up" : "fa-arrow-down"
            } mr-1 text-xs`}
          ></i>
          {trend}
        </span>
        <span className="text-gray-400 ml-2 font-light">vs last month</span>
      </div>
    </div>
  );
}
