import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useEffect, useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * Global Zustand Store for Imagely.
 * Manages theme, utility bar filters, active tabs, shuffle actions, and global search state.
 */
export const useAppStore = create(
  persist(
    (set, get) => ({
      // 1. Theme State
      isDarkMode: false,
      toggleTheme: () => {
        const next = !get().isDarkMode;
        set({ isDarkMode: next });
        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle("dark", next);
        }
      },
      setTheme: (dark) => {
        const next = Boolean(dark);
        set({ isDarkMode: next });
        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle("dark", next);
        }
      },

      // 2. Utility Bar Filters & Navigation
      selectedPicType: "Pics",
      setPicType: (picType) => set({ selectedPicType: picType }),

      selectedCategory: "Category",
      setCategory: (category) => set({ selectedCategory: category }),

      activeTab: null,
      setActiveTab: (tabId) =>
        set((state) => ({
          activeTab: state.activeTab === tabId ? null : tabId,
        })),

      // 3. Global Shuffle Action
      isShuffling: false,
      shuffleCount: 0,
      triggerShuffle: () => {
        set((state) => ({
          isShuffling: true,
          shuffleCount: state.shuffleCount + 1,
        }));
        setTimeout(() => {
          set({ isShuffling: false });
        }, 600);
      },

      // 4. Search Query State
      searchQuery: "",
      setSearchQuery: (query) => set({ searchQuery: query }),

      // 5. Reset All Filters
      resetFilters: () =>
        set({
          selectedPicType: "Pics",
          selectedCategory: "Category",
          activeTab: null,
          searchQuery: "",
        }),
    }),
    {
      name: "imagely_app_state",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : undefined
      ),
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
        selectedPicType: state.selectedPicType,
        selectedCategory: state.selectedCategory,
      }),
      onRehydrateStorage: () => (state) => {
        if (state && typeof document !== "undefined") {
          document.documentElement.classList.toggle("dark", Boolean(state.isDarkMode));
        }
      },
    }
  )
);

/**
 * Hook for consuming UtilityBar filter states and actions.
 */
export function useUtilityStore() {
  const selectedPicType = useAppStore((state) => state.selectedPicType);
  const setPicType = useAppStore((state) => state.setPicType);
  const selectedCategory = useAppStore((state) => state.selectedCategory);
  const setCategory = useAppStore((state) => state.setCategory);
  const activeTab = useAppStore((state) => state.activeTab);
  const setActiveTab = useAppStore((state) => state.setActiveTab);
  const isShuffling = useAppStore((state) => state.isShuffling);
  const shuffleCount = useAppStore((state) => state.shuffleCount);
  const triggerShuffle = useAppStore((state) => state.triggerShuffle);
  const resetFilters = useAppStore((state) => state.resetFilters);

  return {
    selectedPicType,
    setPicType,
    selectedCategory,
    setCategory,
    activeTab,
    setActiveTab,
    isShuffling,
    shuffleCount,
    triggerShuffle,
    resetFilters,
  };
}

/**
 * Hydration-safe hook for consuming and toggling the Dark/Light theme.
 */
export function useThemeStore() {
  const isDarkMode = useAppStore((state) => state.isDarkMode);
  const toggleTheme = useAppStore((state) => state.toggleTheme);
  const setTheme = useAppStore((state) => state.setTheme);

  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", isDarkMode);
    }
  }, [isDarkMode]);

  return {
    isDarkMode: isClient ? isDarkMode : false,
    toggleTheme,
    setTheme,
    isMounted: isClient,
  };
}
