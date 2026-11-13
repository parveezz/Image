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

export default function AdminSidebar({ isOpen = false, onClose = () => {} }) {
      const pathname = usePathname();
      const router = useRouter();
      const { logout } = useAuth();
      const [loggingOut, setLoggingOut] = useState(false);

      const handleLogout = async () => {
            setLoggingOut(true);
            try {
                  await logout();
                  onClose();
                  router.push("/login");
            } catch (err) {
                  console.error("Logout error:", err);
            } finally {
                  setLoggingOut(false);
            }
      };

      return (
            <aside
                  className={`fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-gray-200 bg-white px-5 py-6 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
                        isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
                  }`}
            >
                  <div className="mb-10 flex items-center justify-between">
                        <Link
                              href="/admin"
                              onClick={onClose}
                              className="flex items-center gap-2"
                        >
                              <ImageIcon size={27} className="text-pink-500" />
                              <span className="text-2xl font-bold tracking-tight text-gray-900">
                                    Imagely<span className="text-pink-500">.</span>
                              </span>
                        </Link>

                        <button
                              type="button"
                              onClick={onClose}
                              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 lg:hidden"
                              aria-label="Close sidebar"
                        >
                              <X size={20} />
                        </button>
                  </div>

                  <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Workspace
                  </p>

                  <nav className="space-y-2">
                        {menuItems.map((item) => {
                              const Icon = item.icon;
                              const active =
                                    item.href === "/admin"
                                          ? pathname === "/admin"
                                          : pathname.startsWith(item.href);

                              return (
                                    <Link
                                          key={item.href}
                                          href={item.href}
                                          onClick={onClose}
                                          className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                                                active
                                                      ? "bg-pink-50 text-pink-600 font-semibold"
                                                      : "text-gray-600 hover:bg-gray-50 hover:text-black"
                                          }`}
                                    >
                                          <Icon size={19} />
                                          {item.name}
                                    </Link>
                              );
                        })}
                  </nav>

                  <div className="mt-auto space-y-2">
                        <Link
                              href="/"
                              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-600 hover:bg-gray-50"
                        >
                              <Globe size={19} />
                              View Website
                        </Link>

                        <button
                              type="button"
                              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer"
                        >
                              <Settings size={19} />
                              Settings
                        </button>

                        <button
                              type="button"
                              onClick={handleLogout}
                              disabled={loggingOut}
                              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                              {loggingOut ? (
                                    <>
                                          <Loader2 size={19} className="animate-spin text-red-500" />
                                          Logging out...
                                    </>
                              ) : (
                                    <>
                                          <LogOut size={19} />
                                          Logout
                                    </>
                              )}
                        </button>
                  </div>
            </aside>
      );
}
