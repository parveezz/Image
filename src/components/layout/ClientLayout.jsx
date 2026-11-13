
"use client";

import { usePathname } from "next/navigation";

import Navbar from "@/layout/Navbar";
import Footer from "@/layout/Footer";

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  const isAdmin =
    pathname === "/admin" ||
    pathname?.startsWith("/admin/");

  // Admin pages use their own layout.
  if (isAdmin) {
    return <>{children}</>;
  }

  // Public website layout.
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <div className="flex-1">
        {children}
      </div>

      <Footer />
    </div>
  );
}
