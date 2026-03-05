"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Minus, Plus, ChevronRight } from "lucide-react";
import { useCartStore } from "@/stores/use-cart-store";
import { formatPrice, getDiscountRate } from "@/lib/utils";
import ProductGrid from "@/components/product/product-grid";
import type { Product } from "@/types/product";

interface Props {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({ product, relatedProducts }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"detail" | "review" | "qna">("detail");
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = () => {
    addItem(
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        salePrice: product.salePrice ?? undefined,
        thumbnailUrl: product.thumbnailUrl ?? undefined,
        weight: product.weight ?? undefined,
      },
      quantity
    );
    alert(`${product.name} ${quantity}개가 장바구니에 담겼습니다.`);
  };

  const effectivePrice = product.salePrice ?? product.price;
  const totalPrice = effectivePrice * quantity;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* 브레드크럼 */}
      <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">홈</Link>
        <ChevronRight size={14} />
        <Link href="/products" className="hover:text-foreground">전체상품</Link>
        {product.category && (
          <>
            <ChevronRight size={14} />
            <Link
              href={`/categories/${product.category.slug}`}
              className="hover:text-foreground"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight size={14} />
        <span className="text-foreground">{product.name}</span>
      </nav>

      {/* 상품 정보 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        {/* 이미지 */}
        <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
          <Image
            src={product.thumbnailUrl || "/images/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.isNew && (
              <span className="rounded-md bg-accent px-3 py-1 text-xs font-bold text-white">NEW</span>
            )}
            {product.isRecommended && (
              <span className="rounded-md bg-primary px-3 py-1 text-xs font-bold text-white">추천</span>
            )}
          </div>
        </div>

        {/* 상품 정보 패널 */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-foreground mb-2">{product.name}</h1>
          {product.description && (
            <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
          )}

          <div className="mb-6 pb-6 border-b border-border">
            {product.salePrice ? (
              <div className="flex items-end gap-3">
                <span className="text-red-500 text-lg font-bold">
                  {getDiscountRate(product.price, product.salePrice)}%
                </span>
                <span className="text-3xl font-bold text-foreground">
                  {formatPrice(product.salePrice)}
                </span>
                <span className="text-base text-muted-foreground line-through">
                  {formatPrice(product.price)}
                </span>
              </div>
            ) : (
              <span className="text-3xl font-bold text-foreground">{formatPrice(product.price)}</span>
            )}
          </div>

          <div className="space-y-3 mb-6 text-sm">
            {product.origin && (
              <div className="flex">
                <span className="w-24 text-muted-foreground">원산지</span>
                <span className="text-foreground">{product.origin}</span>
              </div>
            )}
            {product.weight && (
              <div className="flex">
                <span className="w-24 text-muted-foreground">중량/수량</span>
                <span className="text-foreground">{product.weight}</span>
              </div>
            )}
            <div className="flex">
              <span className="w-24 text-muted-foreground">배송비</span>
              <span className="text-foreground">
                {product.shippingInfo || "3,000원 (7만원 이상 무료)"}
              </span>
            </div>
            <div className="flex">
              <span className="w-24 text-muted-foreground">재고</span>
              <span className={product.stock > 0 ? "text-green-600" : "text-red-500"}>
                {product.stock > 0 ? `${product.stock}개 남음` : "품절"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
            <span className="text-sm text-muted-foreground w-24">수량</span>
            <div className="flex items-center border border-border rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors rounded-l-lg"
              >
                <Minus size={16} />
              </button>
              <span className="w-12 h-10 flex items-center justify-center text-sm font-medium border-x border-border">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors rounded-r-lg"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <span className="text-sm font-medium text-muted-foreground">총 상품금액</span>
            <span className="text-2xl font-bold text-primary">{formatPrice(totalPrice)}</span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={product.isSoldOut}
              className="flex-1 flex items-center justify-center gap-2 h-14 rounded-xl border-2 border-primary text-primary font-semibold hover:bg-primary/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={20} />
              장바구니
            </button>
            <button
              disabled={product.isSoldOut}
              className="flex-1 h-14 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {product.isSoldOut ? "품절" : "바로구매"}
            </button>
          </div>
        </div>
      </div>

      {/* 탭 */}
      <div className="border-b border-border mb-8">
        <div className="flex">
          {(["detail", "review", "qna"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "detail" && "상품상세"}
              {tab === "review" && "상품후기 (0)"}
              {tab === "qna" && "Q&A (0)"}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-16">
        {activeTab === "detail" && (
          <div className="prose max-w-none">
            <div className="bg-muted/50 rounded-xl p-8 text-center text-muted-foreground">
              <p className="text-lg">{product.description}</p>
              <p className="mt-4 text-sm">상세 이미지는 준비 중입니다.</p>
            </div>
          </div>
        )}
        {activeTab === "review" && (
          <div className="text-center py-16 text-muted-foreground">
            <p>아직 작성된 후기가 없습니다.</p>
            <p className="text-sm mt-2">첫 번째 후기를 작성해주세요!</p>
          </div>
        )}
        {activeTab === "qna" && (
          <div className="text-center py-16 text-muted-foreground">
            <p>등록된 질문이 없습니다.</p>
            <p className="text-sm mt-2">궁금한 점을 질문해주세요!</p>
          </div>
        )}
      </div>

      {relatedProducts.length > 0 && (
        <section>
          <h3 className="text-xl font-bold text-foreground mb-6">관련 상품</h3>
          <ProductGrid products={relatedProducts} />
        </section>
      )}
    </div>
  );
}
