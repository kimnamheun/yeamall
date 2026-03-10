"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock } from "lucide-react";
import { useRecentlyViewed } from "@/stores/use-recently-viewed";
import { getProductsByIds } from "@/actions/curation";
import ProductGrid from "@/components/product/product-grid";
import type { Product } from "@/types/product";

export default function RecentlyViewedSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const items = useRecentlyViewed((s) => s.items);
  const productIds = useMemo(
    () => items.map((item) => item.productId),
    [items]
  );

  useEffect(() => {
    if (productIds.length === 0) {
      setIsLoading(false);
      return;
    }

    getProductsByIds(productIds).then((data) => {
      setProducts(data as Product[]);
      setIsLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productIds.length]);

  if (isLoading) {
    return (
      <section className="py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-6">
            <Clock size={20} className="text-muted-foreground" />
            <h3 className="text-xl sm:text-2xl font-bold text-foreground">
              최근 본 상품
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square rounded-lg bg-muted mb-3" />
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-6">
          <Clock size={20} className="text-muted-foreground" />
          <h3 className="text-xl sm:text-2xl font-bold text-foreground">
            최근 본 상품
          </h3>
          <span className="text-sm text-muted-foreground">
            ({products.length})
          </span>
        </div>
        <ProductGrid products={products} />
      </div>
    </section>
  );
}
