"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // On dedicated admin login page, render clean standalone layout
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/25 backdrop-blur-xs lg:hidden"
        />
      )}

      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 min-h-screen flex flex-col lg:pl-64 w-full transition-all">
        <AdminHeader onMenuClick={() => setSidebarOpen((prev) => !prev)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <AdminAuthGuard>
            {children}
          </AdminAuthGuard>
        </main>
      </div>
    </div>
  );
}
