
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

import {
      LayoutDashboard,
      FileText,
      Globe,
      Settings,
      LogOut,
      Image as ImageIcon,
      X,
      Loader2,
} from "lucide-react";

const menuItems = [
      {
            name: "Dashboard",
            href: "/admin",
            icon: LayoutDashboard,
      },
      {
            name: "Footer Pages",
            href: "/admin/footer-pages",
            icon: FileText,
      },
];

export default function AdminSidebar({
      isOpen = false,
      onClose = () => { },
}) {
      const pathname = usePathname();
      const router = useRouter();
      const { logout } = useAuth();

      const [loggingOut, setLoggingOut] = useState(false);

      // Handle admin logout
      const handleLogout = async () => {
            if (loggingOut) return;

            setLoggingOut(true);

            try {
                  await logout();
                  onClose();
                  router.replace("/admin/login");
            } catch (error) {
                  console.error("Logout error:", error);
                  setLoggingOut(false);
            }
      };

      // Check active navigation item
      const isActiveRoute = (href) => {
            if (href === "/admin") {
                  return pathname === "/admin";
            }

            return pathname === href || pathname.startsWith(`${href}/`);
      };

      return (
            <aside
                  id="admin-sidebar"
                  aria-label="Admin sidebar"
                  className={`fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-gray-200 bg-white px-5 py-6 transition-transform duration-200 ease-in-out lg:translate-x-0 ${isOpen
                        ? "translate-x-0 shadow-2xl"
                        : "-translate-x-full"
                        }`}
            >
                  {/* Brand */}
                  <div className="mb-10 flex items-center justify-between">
                        <Link
                              href="/admin"
                              onClick={onClose}
                              aria-label="Imagely admin dashboard"
                              className="flex items-center gap-2"
                        >
                              <ImageIcon
                                    size={27}
                                    className="text-pink-500"
                                    aria-hidden="true"
                              />

                              <span className="text-2xl font-bold tracking-tight text-gray-900">
                                    Imagely<span className="text-pink-500">.</span>
                              </span>
                        </Link>

                        {/* Mobile close button */}
                        <button
                              type="button"
                              onClick={onClose}
                              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 lg:hidden"
                              aria-label="Close sidebar"
                        >
                              <X size={20} aria-hidden="true" />
                        </button>
                  </div>

                  {/* Navigation */}
                  <div>
                        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
                              Workspace
                        </p>

                        <nav aria-label="Admin navigation" className="space-y-2">
                              {menuItems.map((item) => {
                                    const Icon = item.icon;
                                    const active = isActiveRoute(item.href);

                                    return (
                                          <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={onClose}
                                                aria-current={active ? "page" : undefined}
                                                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${active
                                                      ? "bg-pink-50 font-semibold text-pink-600"
                                                      : "text-gray-600 hover:bg-gray-50 hover:text-black"
                                                      }`}
                                          >
                                                <Icon size={19} aria-hidden="true" />
                                                <span>{item.name}</span>
                                          </Link>
                                    );
                              })}
                        </nav>
                  </div>

                  {/* Bottom actions */}
                  <div className="mt-auto space-y-2">
                        <Link
                              href="/"
                              onClick={onClose}
                              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-600 hover:bg-gray-50"
                        >
                              <Globe size={19} aria-hidden="true" />
                              <span>View Website</span>
                        </Link>

                        <button
                              type="button"
                              disabled
                              aria-disabled="true"
                              className="flex w-full cursor-not-allowed items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-400"
                              title="Settings coming soon"
                        >
                              <Settings size={19} aria-hidden="true" />
                              <span>Settings</span>
                        </button>

                        <button
                              type="button"
                              onClick={handleLogout}
                              disabled={loggingOut}
                              className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-sm text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                              {loggingOut ? (
                                    <>
                                          <Loader2
                                                size={19}
                                                className="animate-spin"
                                                aria-hidden="true"
                                          />
                                          <span>Logging out...</span>
                                    </>
                              ) : (
                                    <>
                                          <LogOut size={19} aria-hidden="true" />
                                          <span>Logout</span>
                                    </>
                              )}
                        </button>
                  </div>
            </aside>
      );
}
