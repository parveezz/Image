
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
    if (loading) return;

    // Authenticated admins should not remain on the login page.
    if (isLoginPage && isAuthenticated) {
      router.replace("/admin");
      return;
    }

    // Redirect unauthenticated visitors to admin login.
    if (!isLoginPage && !isAuthenticated) {
      router.replace("/admin/login");
    }
  }, [loading, isAuthenticated, isLoginPage, router]);

  // Verify the session before rendering protected content.
  if (loading) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center gap-3"
        role="status"
        aria-live="polite"
      >
        <Loader2
          size={32}
          className="animate-spin text-pink-500"
          aria-hidden="true"
        />

        <p className="font-poppins text-sm font-medium text-gray-500">
          Verifying admin session...
        </p>
      </div>
    );
  }

  // Prevent authenticated users from seeing the login page.
  if (isLoginPage && isAuthenticated) {
    return null;
  }

  // Prevent unauthenticated visitors from seeing protected content.
  if (!isLoginPage && !isAuthenticated) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center gap-3"
        role="status"
        aria-live="polite"
      >
        <Loader2
          size={32}
          className="animate-spin text-pink-500"
          aria-hidden="true"
        />

        <p className="font-poppins text-sm font-medium text-gray-500">
          Redirecting to admin sign in...
        </p>
      </div>
    );
  }

  return children;
}
