"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { cn, formatPrice, getDiscountRate } from "@/lib/utils";
import { useCartStore } from "@/stores/use-cart-store";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.isSoldOut) return;
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      salePrice: product.salePrice,
      thumbnailUrl: product.thumbnailUrl,
      weight: product.weight,
    });
  };

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-lg border border-border bg-white transition-shadow hover:shadow-md">
        {/* 이미지 */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={product.thumbnailUrl || "/images/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* 배지 */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isNew && (
              <span className="rounded bg-accent px-2 py-0.5 text-[10px] font-bold text-white">
                NEW
              </span>
            )}
            {product.isRecommended && (
              <span className="rounded bg-primary px-2 py-0.5 text-[10px] font-bold text-white">
                추천
              </span>
            )}
            {product.salePrice && (
              <span className="rounded bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
                {getDiscountRate(product.price, product.salePrice)}%
              </span>
            )}
          </div>

          {/* 품절 오버레이 */}
          {product.isSoldOut && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-gray-800">
                일시품절
              </span>
            </div>
          )}

          {/* 장바구니 버튼 */}
          {!product.isSoldOut && (
            <button
              onClick={handleAddToCart}
              className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-white"
              aria-label="장바구니 담기"
            >
              <ShoppingCart size={16} />
            </button>
          )}
        </div>

        {/* 상품 정보 */}
        <div className="p-3">
          <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {product.origin && (
            <p className="text-xs text-muted-foreground mb-2">
              {product.origin}
            </p>
          )}

          <div className="flex items-end gap-2">
            {product.salePrice ? (
              <>
                <span className="text-base font-bold text-primary">
                  {formatPrice(product.salePrice)}
                </span>
                <span className="text-xs text-muted-foreground line-through">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="text-base font-bold text-foreground">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {product.shippingInfo && (
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              {product.shippingInfo}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
