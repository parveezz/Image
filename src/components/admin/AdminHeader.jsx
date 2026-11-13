
"use client";

import { Bell, Search, Menu } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AdminHeader({
      onMenuClick = () => { },
      isMenuOpen = false,
}) {
      const { user } = useAuth();

      // Authenticated admin information
      const displayName =
            user?.name ||
            user?.username ||
            user?.email?.split("@")[0] ||
            "Administrator";

      const displayRole = user?.role || "Admin";
      const initial = displayName.charAt(0).toUpperCase() || "A";

      return (
            <header className="flex h-20 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-8">
                  {/* Left section */}
                  <div className="flex items-center gap-3">
                        <button
                              type="button"
                              onClick={onMenuClick}
                              className="cursor-pointer rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-black lg:hidden"
                              aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                              aria-expanded={isMenuOpen}
                              aria-controls="admin-sidebar"
                        >
                              <Menu size={22} aria-hidden="true" />
                        </button>

                        <div>
                              <p className="text-lg font-semibold text-gray-900 sm:text-xl">
                                    Admin Dashboard
                              </p>

                              <p className="hidden text-xs text-gray-500 sm:block sm:text-sm">
                                    Manage your Imagely website content
                              </p>
                        </div>
                  </div>

                  {/* Right section */}
                  <div className="flex items-center gap-3 sm:gap-5">
                        {/* Dashboard search */}
                        <div className="hidden items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 md:flex">
                              <Search
                                    size={17}
                                    className="text-gray-400"
                                    aria-hidden="true"
                              />

                              <input
                                    type="search"
                                    aria-label="Search dashboard"
                                    placeholder="Search..."
                                    className="w-36 bg-transparent text-sm outline-none lg:w-44"
                              />
                        </div>

                        {/* Notifications */}
                        <button
                              type="button"
                              aria-label="Notifications"
                              className="relative cursor-pointer rounded-full p-2 text-gray-600 hover:bg-gray-100"
                        >
                              <Bell size={20} aria-hidden="true" />

                              <span
                                    className="absolute right-1 top-1 h-2 w-2 rounded-full bg-pink-500"
                                    aria-hidden="true"
                              />
                        </button>

                        {/* Admin profile */}
                        <div className="flex items-center gap-2.5 sm:gap-3">
                              <div
                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-100 text-sm font-semibold text-pink-600 sm:h-10 sm:w-10"
                                    aria-hidden="true"
                              >
                                    {initial}
                              </div>

                              <div className="hidden sm:block">
                                    <p className="text-sm font-semibold leading-tight text-gray-800">
                                          {displayName}
                                    </p>

                                    <p className="max-w-[140px] truncate text-xs text-gray-500">
                                          {displayRole}
                                    </p>
                              </div>
                        </div>
                  </div>
            </header>
      );
}
