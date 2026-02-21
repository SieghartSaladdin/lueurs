"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import toast from "react-hot-toast";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (!isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  };

  return (
    <>
      <nav
        className={`sticky top-0 z-50 px-4 md:px-12 h-20 flex items-center justify-between border-b border-gray-100 transition-all duration-300 ${
          isScrolled ? "shadow-md bg-white/95 backdrop-blur-sm" : "bg-white/95 backdrop-blur-sm"
        }`}
      >
        {/* Logo */}
        <Link
          href="/"
          className="text-3xl font-display font-bold tracking-widest text-black hover:opacity-70 transition-opacity"
        >
          LUEURS
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 font-medium text-xs uppercase tracking-widest text-gray-500">
          <Link href="#" className="hover:text-black transition-colors">
            New Arrivals
          </Link>
          <Link href="#" className="hover:text-black transition-colors">
            Women
          </Link>
          <Link href="#" className="hover:text-black transition-colors">
            Men
          </Link>
          <Link href="#" className="hover:text-black transition-colors">
            Home Scents
          </Link>
          <Link
            href="#"
            className="text-amber-700 hover:text-amber-900 transition-colors border-b border-transparent hover:border-amber-700"
          >
            Gifts
          </Link>
        </div>

        {/* Right Icons */}
        <div className="flex items-center space-x-6">
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search..."
              className="bg-gray-50 border border-transparent focus:border-gray-200 rounded-full py-2 px-4 pl-10 w-44 focus:w-64 transition-all duration-300 outline-none text-sm font-light"
            />
            <i className="fas fa-search absolute left-3 top-3 text-gray-300 text-sm"></i>
          </div>
          <button className="hover:text-amber-700 transition-colors">
            <i className="far fa-heart text-xl"></i>
          </button>
          <button className="hover:text-amber-700 transition-colors relative">
            <i className="fas fa-shopping-bag text-xl"></i>
            <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full">
              1
            </span>
          </button>
          
          {/* User Profile Menu */}
          <div className="relative">
            {session ? (
              <button 
                className="hover:text-amber-700 transition-colors flex items-center"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              >
                {session.user?.image ? (
                  <img src={session.user.image} alt="Profile" className="w-6 h-6 rounded-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <i className="far fa-user text-xl"></i>
                )}
              </button>
            ) : (
              <Link href="/login" className="hover:text-amber-700 transition-colors">
                <i className="far fa-user text-xl"></i>
              </Link>
            )}

            {/* Dropdown */}
            {isProfileMenuOpen && session && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900 truncate">{session.user?.name}</p>
                  <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
                </div>
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  My Profile
                </Link>
                {session.user?.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={async () => {
                    setIsProfileMenuOpen(false);
                    await signOut({ redirect: false });
                    toast.success("Signed out successfully");
                    window.location.href = "/";
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>

          <button
            className="md:hidden hover:bg-gray-100 p-2 rounded-full"
            onClick={toggleMobileMenu}
          >
            <i className="fas fa-bars text-lg"></i>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-white z-40 transform transition-transform duration-300 flex flex-col pt-20 px-6 overflow-y-auto ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          onClick={toggleMobileMenu}
          className="absolute top-4 right-4 p-2 text-2xl"
        >
          <i className="fas fa-times"></i>
        </button>
        <div className="flex flex-col space-y-8 text-2xl font-display font-bold">
          <Link href="#" className="flex justify-between items-center group">
            New Arrivals{" "}
            <i className="fas fa-arrow-right text-lg text-gray-300 group-hover:text-black transition-colors opacity-0 group-hover:opacity-100"></i>
          </Link>
          <Link href="#" className="flex justify-between items-center group">
            Women{" "}
            <i className="fas fa-arrow-right text-lg text-gray-300 group-hover:text-black transition-colors opacity-0 group-hover:opacity-100"></i>
          </Link>
          <Link href="#" className="flex justify-between items-center group">
            Men{" "}
            <i className="fas fa-arrow-right text-lg text-gray-300 group-hover:text-black transition-colors opacity-0 group-hover:opacity-100"></i>
          </Link>
          <Link href="#" className="flex justify-between items-center group">
            Home Scents{" "}
            <i className="fas fa-arrow-right text-lg text-gray-300 group-hover:text-black transition-colors opacity-0 group-hover:opacity-100"></i>
          </Link>
          <Link href="#" className="flex justify-between items-center text-amber-700">
            Gifts
          </Link>
        </div>
      </div>
    </>
  );
}
