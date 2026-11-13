
"use client";

import { create } from "zustand";
import {
  persist,
  createJSONStorage,
} from "zustand/middleware";
import { useEffect, useState } from "react";

/**
 * Global Zustand Store for Imagely.
 *
 * Manages:
 * - Theme
 * - Utility bar filters
 * - Active tabs
 * - Shuffle actions
 * - Global search
 */

let shuffleTimeout;

/**
 * Apply theme to the document.
 */
function applyTheme(dark) {
  if (typeof document === "undefined") return;

  document.documentElement.classList.toggle("dark", Boolean(dark));
}

export const useAppStore = create(
  persist(
    (set, get) => ({
      // 1. Theme State
      isDarkMode: false,

      toggleTheme: () => {
        const next = !get().isDarkMode;

        set({ isDarkMode: next });
        applyTheme(next);
      },

      setTheme: (dark) => {
        const next = Boolean(dark);

        set({ isDarkMode: next });
        applyTheme(next);
      },

      // 2. Utility Bar Filters & Navigation
      selectedPicType: "Pics",

      setPicType: (picType) =>
        set({ selectedPicType: picType }),

      selectedCategory: "Category",

      setCategory: (category) =>
        set({ selectedCategory: category }),

      activeTab: null,

      setActiveTab: (tabId) =>
        set((state) => ({
          activeTab:
            state.activeTab === tabId ? null : tabId,
        })),

      // 3. Global Shuffle Action
      isShuffling: false,
      shuffleCount: 0,

      triggerShuffle: () => {
        if (shuffleTimeout) {
          clearTimeout(shuffleTimeout);
        }

        set((state) => ({
          isShuffling: true,
          shuffleCount: state.shuffleCount + 1,
        }));

        shuffleTimeout = setTimeout(() => {
          set({ isShuffling: false });
          shuffleTimeout = undefined;
        }, 600);
      },

      // 4. Search Query State
      searchQuery: "",

      setSearchQuery: (query) =>
        set({ searchQuery: query }),

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

      storage: createJSONStorage(() => localStorage),

      // Only persist user preferences.
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
        selectedPicType: state.selectedPicType,
        selectedCategory: state.selectedCategory,
      }),

      // Prevent automatic hydration during SSR.
      skipHydration: true,

      onRehydrateStorage: () => (state) => {
        if (state) {
          applyTheme(state.isDarkMode);
        }
      },
    }
  )
);

/**
 * Manually hydrate persisted Zustand state.
 */
export function useStoreHydration() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let mounted = true;

    const hydrate = async () => {
      await useAppStore.persist.rehydrate();

      if (mounted) {
        setIsHydrated(true);
      }
    };

    hydrate();

    return () => {
      mounted = false;
    };
  }, []);

  return isHydrated;
}

/**
 * Hook for UtilityBar filter states and actions.
 */
export function useUtilityStore() {
  const selectedPicType = useAppStore(
    (state) => state.selectedPicType
  );

  const setPicType = useAppStore(
    (state) => state.setPicType
  );

  const selectedCategory = useAppStore(
    (state) => state.selectedCategory
  );

  const setCategory = useAppStore(
    (state) => state.setCategory
  );

  const activeTab = useAppStore(
    (state) => state.activeTab
  );

  const setActiveTab = useAppStore(
    (state) => state.setActiveTab
  );

  const isShuffling = useAppStore(
    (state) => state.isShuffling
  );

  const shuffleCount = useAppStore(
    (state) => state.shuffleCount
  );

  const triggerShuffle = useAppStore(
    (state) => state.triggerShuffle
  );

  const resetFilters = useAppStore(
    (state) => state.resetFilters
  );

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
 * Hydration-safe theme hook.
 */
export function useThemeStore() {
  const isDarkMode = useAppStore(
    (state) => state.isDarkMode
  );

  const toggleTheme = useAppStore(
    (state) => state.toggleTheme
  );

  const setTheme = useAppStore(
    (state) => state.setTheme
  );

  const isMounted = useStoreHydration();

  useEffect(() => {
    if (isMounted) {
      applyTheme(isDarkMode);
    }
  }, [isDarkMode, isMounted]);

  return {
    isDarkMode: isMounted ? isDarkMode : false,
    toggleTheme,
    setTheme,
    isMounted,
  };
}
