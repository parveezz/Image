"use client";

import { Bell, Search, Menu } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AdminHeader({ onMenuClick = () => {} }) {
      const { user } = useAuth();

      // Display authenticated admin info with graceful fallbacks
      const displayName =
            user?.name ||
            user?.username ||
            (user?.email ? user.email.split("@")[0] : null) ||
            "Administrator";

      const displayRole = user?.role || user?.email || "Admin";
      const initial = (displayName.charAt(0) || "A").toUpperCase();

      return (
            <header className="flex h-20 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-8">
                  <div className="flex items-center gap-3">
                        <button
                              type="button"
                              onClick={onMenuClick}
                              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-black lg:hidden cursor-pointer"
                              aria-label="Toggle navigation menu"
                        >
                              <Menu size={22} />
                        </button>

                        <div>
                              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                                    Admin Dashboard
                              </h1>
                              <p className="hidden text-xs sm:block sm:text-sm text-gray-500">
                                    Manage your Imagely website content
                              </p>
                        </div>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-5">
                        <div className="hidden items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 md:flex">
                              <Search size={17} className="text-gray-400" />
                              <input
                                    type="search"
                                    placeholder="Search..."
                                    className="w-36 lg:w-44 bg-transparent text-sm outline-none"
                              />
                        </div>

                        <button
                              aria-label="Notifications"
                              className="relative rounded-full p-2 text-gray-600 hover:bg-gray-100 cursor-pointer"
                        >
                              <Bell size={20} />
                              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-pink-500" />
                        </button>

                        <div className="flex items-center gap-2.5 sm:gap-3">
                              <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-pink-100 font-semibold text-pink-600 text-sm">
                                    {initial}
                              </div>
                              <div className="hidden sm:block">
                                    <p className="text-sm font-semibold text-gray-800 leading-tight">
                                          {displayName}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate max-w-[140px]">
                                          {displayRole}
                                    </p>
                              </div>
                        </div>
                  </div>
            </header>
      );
}
