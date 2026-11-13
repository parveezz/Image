"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

export default function AdminAuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, loading } = useAuth();
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!loading && !isAuthenticated && !isLoginPage) {
      router.replace("/admin/login");
    }
  }, [loading, isAuthenticated, isLoginPage, router]);

  if (isLoginPage) {
    return children;
  }

  return (
    <>
      <div className={loading || !isAuthenticated ? "hidden" : "contents"}>
        {children}
      </div>
      {(loading || !isAuthenticated) && (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
          <Loader2 size={32} className="animate-spin text-pink-500" />
          <p className="text-sm font-medium text-gray-500 font-poppins">
            {loading ? "Verifying admin session..." : "Redirecting to admin sign in..."}
          </p>
        </div>
      )}
    </>
  );
}
