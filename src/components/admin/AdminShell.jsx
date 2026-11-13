
"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  const handleMenuToggle = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  // Login page uses a standalone layout without dashboard navigation.
  if (isLoginPage) {
    return (
      <AdminAuthGuard>
        {children}
      </AdminAuthGuard>
    );
  }

  return (
    <AdminAuthGuard>
      <div className="flex min-h-screen bg-gray-50">

        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={handleSidebarClose}
            className="fixed inset-0 z-30 cursor-default bg-black/25 backdrop-blur-xs lg:hidden"
          />
        )}

        {/* Admin sidebar */}
        <AdminSidebar
          isOpen={sidebarOpen}
          onClose={handleSidebarClose}
        />

        {/* Dashboard content */}
        <div className="flex min-h-screen w-full flex-1 flex-col transition-all lg:pl-64">

          {/* Dashboard header */}
          <AdminHeader
            onMenuClick={handleMenuToggle}
            isMenuOpen={sidebarOpen}
          />

          {/* Main content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {children}
          </main>

        </div>
      </div>
    </AdminAuthGuard>
  );
}
