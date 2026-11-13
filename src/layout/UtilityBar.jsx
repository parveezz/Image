"use client";

import { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  Shuffle,
  Sun,
  Moon,
  Tag,
  User,
  Video,
  Tv,
  Image as ImageIcon,
  Check,
  Sparkles,
} from "lucide-react";
import { useUtilityStore, useThemeStore } from "@/store/useAppStore";

export default function UtilityBar() {
  // Global Zustand Stores
  const {
    selectedPicType,
    setPicType,
    selectedCategory,
    setCategory,
    activeTab,
    setActiveTab,
    isShuffling,
    triggerShuffle,
  } = useUtilityStore();

  const { isDarkMode, toggleTheme } = useThemeStore();

  // Local Dropdown UI State
  const [openDropdown, setOpenDropdown] = useState(null);
  const containerRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpenDropdown(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Image type options
  const picOptions = [
    { label: "All Pics", value: "Pics" },
    { label: "Photos", value: "Photos" },
    { label: "Illustrations", value: "Illustrations" },
    { label: "AI Generated", value: "AI Art" },
    { label: "Vectors", value: "Vectors" },
    { label: "Wallpapers", value: "Wallpapers" },
  ];

  // Category options
  const categoryOptions = [
    { label: "All Categories", value: "Category" },
    { label: "Architecture", value: "Architecture" },
    { label: "Nature & Animals", value: "Nature" },
    { label: "Fashion & Style", value: "Fashion" },
    { label: "Portraits & People", value: "Portraits" },
    { label: "Technology", value: "Technology" },
    { label: "3D Art & CGI", value: "3D Art" },
    { label: "Minimalist", value: "Minimalist" },
    { label: "Travel & Places", value: "Travel" },
  ];

  // Utility tabs
  const tabs = [
    { id: "tags", label: "Tags", icon: Tag },
    { id: "creator", label: "Creator", icon: User },
    { id: "video", label: "Video", icon: Video },
    { id: "channel", label: "Channel", icon: Tv },
  ];

  const filterButtonBase =
    "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm leading-5 font-medium transition-colors cursor-pointer select-none whitespace-nowrap";

  const dropdownOptionBase =
    "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm leading-5 font-normal transition-colors cursor-pointer";

  return (
    <div
      ref={containerRef}
      className="relative z-30 w-full border-b border-gray-100 bg-white transition-colors dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="mx-auto flex w-[80%] items-center justify-between gap-3 py-2 font-poppins text-sm">

        {/* Left Side */}
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">

          {/* Pics Dropdown */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpenDropdown((prev) => (prev === "pics" ? null : "pics"));
              }}
              aria-expanded={openDropdown === "pics"}
              className={`${filterButtonBase} ${
                openDropdown === "pics" || selectedPicType !== "Pics"
                  ? "bg-pink-50 font-semibold text-pink-600 dark:bg-pink-950/40 dark:text-pink-400"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
            >
              <ImageIcon
                size={15}
                className="shrink-0 text-gray-500 dark:text-gray-400"
              />

              <span>{selectedPicType}</span>

              <ChevronDown
                size={14}
                className={`shrink-0 transition-transform duration-200 ${
                  openDropdown === "pics"
                    ? "rotate-180 text-pink-500"
                    : "text-gray-400"
                }`}
              />
            </button>

            {openDropdown === "pics" && (
              <div className="absolute left-0 top-full z-50 mt-1.5 w-48 rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl dark:border-gray-700 dark:bg-gray-900">
                {picOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setPicType(opt.value);
                      setOpenDropdown(null);
                    }}
                    className={`${dropdownOptionBase} ${
                      selectedPicType === opt.value
                        ? "bg-pink-50 font-semibold text-pink-600 dark:bg-pink-950/40 dark:text-pink-400"
                        : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800/60"
                    }`}
                  >
                    <span>{opt.label}</span>

                    {selectedPicType === opt.value && (
                      <Check size={15} className="text-pink-600" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpenDropdown((prev) => (prev === "category" ? null : "category"));
              }}
              aria-expanded={openDropdown === "category"}
              className={`${filterButtonBase} ${
                openDropdown === "category" ||
                selectedCategory !== "Category"
                  ? "bg-pink-50 font-semibold text-pink-600 dark:bg-pink-950/40 dark:text-pink-400"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
            >
              <Sparkles
                size={15}
                className="shrink-0 text-gray-500 dark:text-gray-400"
              />

              <span>{selectedCategory}</span>

              <ChevronDown
                size={14}
                className={`shrink-0 transition-transform duration-200 ${
                  openDropdown === "category"
                    ? "rotate-180 text-pink-500"
                    : "text-gray-400"
                }`}
              />
            </button>

            {openDropdown === "category" && (
              <div className="absolute left-0 top-full z-50 mt-1.5 w-52 rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl dark:border-gray-700 dark:bg-gray-900">
                {categoryOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setCategory(opt.value);
                      setOpenDropdown(null);
                    }}
                    className={`${dropdownOptionBase} ${
                      selectedCategory === opt.value
                        ? "bg-pink-50 font-semibold text-pink-600 dark:bg-pink-950/40 dark:text-pink-400"
                        : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800/60"
                    }`}
                  >
                    <span>{opt.label}</span>

                    {selectedCategory === opt.value && (
                      <Check size={15} className="text-pink-600" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Vertical Divider */}
          <div className="mx-1 hidden h-5 w-px shrink-0 bg-gray-200 dark:bg-gray-800 sm:block" />

          {/* Tab buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 sm:gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`${filterButtonBase} shrink-0 ${
                    isActive
                      ? "bg-gray-900 font-semibold text-white dark:bg-white dark:text-gray-900"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  }`}
                >
                  <Icon
                    size={15}
                    className={
                      isActive ? "text-pink-400" : "text-gray-400"
                    }
                  />

                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">

          {/* Shuffle */}
          <button
            type="button"
            onClick={triggerShuffle}
            title="Shuffle content"
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium leading-5 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 cursor-pointer"
          >
            <Shuffle
              size={15}
              className={`transition-transform duration-500 ${
                isShuffling
                  ? "rotate-180 text-pink-500"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            />

            <span className="hidden sm:inline">Shuffle</span>
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            aria-label="Toggle theme"
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-2 text-xs font-medium leading-4 text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 cursor-pointer"
          >
            {isDarkMode ? (
              <>
                <Sun size={14} className="text-yellow-400" />
                <span className="hidden md:inline">Light</span>
              </>
            ) : (
              <>
                <Moon size={14} className="text-gray-500" />
                <span className="hidden md:inline">Dark</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
