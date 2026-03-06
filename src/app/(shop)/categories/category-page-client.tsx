"use client";

import { useState } from "react";
import ProductCard from "@/components/product/product-card";
import { CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Product, Category } from "@/types/product";

interface Props {
  categories: Category[];
  allProducts: Product[];
  initialSlug?: string;
}

export default function CategoryPageClient({ categories, allProducts, initialSlug }: Props) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(initialSlug ?? null);

  const filteredProducts = selectedSlug
    ? allProducts.filter((p) => p.category?.slug === selectedSlug)
    : allProducts;

  const selectedCategory = selectedSlug
    ? categories.find((c) => c.slug === selectedSlug)
    : null;

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex min-h-[calc(100vh-8rem)]">
        {/* 왼쪽 카테고리 사이드바 */}
        <aside className="w-[90px] sm:w-[140px] lg:w-[180px] shrink-0 border-r border-border bg-gray-50/80 overflow-y-auto">
          <button
            onClick={() => setSelectedSlug(null)}
            className={cn(
              "w-full text-left px-3 py-3.5 sm:py-4 text-xs sm:text-sm font-medium border-b border-border transition-colors",
              !selectedSlug
                ? "bg-white text-primary border-l-[3px] border-l-primary"
                : "text-muted-foreground hover:bg-white hover:text-foreground"
            )}
          >
            <span className="block text-center sm:text-left">
              <span className="block sm:hidden text-lg mb-0.5">🛒</span>
              전체상품
            </span>
          </button>
          {categories.map((cat) => {
            const catInfo = CATEGORIES.find((c) => c.slug === cat.slug);
            const isActive = selectedSlug === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedSlug(cat.slug)}
                className={cn(
                  "w-full text-left px-3 py-3.5 sm:py-4 text-xs sm:text-sm font-medium border-b border-border transition-colors",
                  isActive
                    ? "bg-white text-primary border-l-[3px] border-l-primary"
                    : "text-muted-foreground hover:bg-white hover:text-foreground"
                )}
              >
                <span className="block text-center sm:text-left">
                  {catInfo && (
                    <span className="block sm:inline sm:mr-1.5 text-lg sm:text-base mb-0.5 sm:mb-0">
                      {catInfo.icon}
                    </span>
                  )}
                  <span className="block sm:inline leading-tight">{cat.name}</span>
                </span>
              </button>
            );
          })}
        </aside>

        {/* 오른쪽 상품 리스트 */}
        <main className="flex-1 min-w-0">
          {/* 상단 헤더 */}
          <div className="sticky top-0 z-10 bg-white border-b border-border px-3 sm:px-4 py-3 flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-semibold text-foreground">
              {selectedCategory ? (
                <>
                  {CATEGORIES.find((c) => c.slug === selectedSlug)?.icon}{" "}
                  {selectedCategory.name}
                </>
              ) : (
                "전체상품"
              )}
            </h2>
            <span className="text-xs sm:text-sm text-muted-foreground">
              {filteredProducts.length}개
            </span>
          </div>

          {/* 상품 그리드 */}
          <div className="p-3 sm:p-4">
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <p className="text-lg">상품이 없습니다.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
