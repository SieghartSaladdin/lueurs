"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";

export default function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: "fas fa-chart-line" },
    { name: "Products", href: "/admin/products", icon: "fas fa-box-open" },
    { name: "Categories", href: "/admin/categories", icon: "fas fa-tags" },
    { name: "Orders", href: "/admin/orders", icon: "fas fa-shopping-cart" },
    { name: "Customers", href: "/admin/customers", icon: "fas fa-users" },
    { name: "Reviews", href: "/admin/reviews", icon: "fas fa-star" },
    { name: "Analytics", href: "/admin/analytics", icon: "fas fa-chart-pie" },
    { name: "Settings", href: "/admin/settings", icon: "fas fa-cog" },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col">
      <div className="h-20 flex items-center px-8 border-b border-gray-100">
        <Link
          href="/"
          className="text-2xl font-display font-bold tracking-widest text-black hover:opacity-70 transition-opacity"
        >
          LUEURS
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 px-4">
          Admin Menu
        </p>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? "bg-gray-100 text-black"
                    : "text-gray-500 hover:bg-gray-50 hover:text-black"
                }`}
              >
                <i className={`${item.icon} w-5 text-center mr-3`}></i>
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={async () => {
            await signOut({ redirect: false });
            toast.success("Signed out successfully");
            window.location.href = "/";
          }}
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <i className="fas fa-sign-out-alt w-5 text-center mr-3"></i>
          Logout
        </button>
      </div>
    </aside>
  );
}
