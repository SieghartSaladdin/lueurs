"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

export default function LoginToast() {
  const { data: session, status } = useSession();

  useEffect(() => {
    // Cek apakah user baru saja login (session ada) dan belum pernah dikasih toast
    if (status === "authenticated" && session?.user) {
      const hasShownToast = sessionStorage.getItem("loginToastShown");
      
      if (!hasShownToast) {
        toast.success(`Welcome back, ${session.user.name || "User"}!`, {
          duration: 4000,
          icon: '👋',
        });
        sessionStorage.setItem("loginToastShown", "true");
      }
    }
    
    // Reset status toast jika user logout
    if (status === "unauthenticated") {
      sessionStorage.removeItem("loginToastShown");
    }
  }, [status, session]);

  return null;
}
