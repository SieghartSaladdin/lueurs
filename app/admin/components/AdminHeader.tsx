"use client";

import { useSession } from "next-auth/react";

export default function AdminHeader() {
  const { data: session } = useSession();

  return (
    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Search admin..."
            className="bg-gray-50 border border-transparent focus:border-gray-200 rounded-full py-2 px-4 pl-10 w-64 focus:w-80 transition-all duration-300 outline-none text-sm font-light"
          />
          <i className="fas fa-search absolute left-3 top-3 text-gray-400 text-sm"></i>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <button className="text-gray-400 hover:text-black transition-colors relative">
          <i className="far fa-bell text-xl"></i>
          <span className="absolute -top-1 -right-1 bg-amber-700 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full">
            3
          </span>
        </button>
        <div className="flex items-center space-x-3 border-l border-gray-200 pl-6">
          {session?.user?.image ? (
            <img src={session.user.image} alt="Admin" className="w-8 h-8 rounded-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {session?.user?.name?.charAt(0).toUpperCase() || "A"}
            </div>
          )}
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-900">{session?.user?.name || "Admin User"}</p>
            <p className="text-xs text-gray-500">{session?.user?.email || "admin@lueurs.com"}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
