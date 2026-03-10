"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RecentlyViewedItem {
  productId: string;
  viewedAt: number;
}

interface RecentlyViewedState {
  items: RecentlyViewedItem[];
  addItem: (productId: string) => void;
  getProductIds: () => string[];
}

const MAX_ITEMS = 10;

export const useRecentlyViewed = create<RecentlyViewedState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (productId: string) =>
        set((state) => {
          const filtered = state.items.filter(
            (item) => item.productId !== productId
          );
          return {
            items: [
              { productId, viewedAt: Date.now() },
              ...filtered,
            ].slice(0, MAX_ITEMS),
          };
        }),
      getProductIds: () => get().items.map((item) => item.productId),
    }),
    { name: "yeamall-recently-viewed" }
  )
);
