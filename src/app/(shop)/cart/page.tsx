"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/stores/use-cart-store";
import { formatPrice } from "@/lib/utils";
import { SHIPPING } from "@/lib/constants";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice, getShippingFee } =
    useCartStore();

  const totalPrice = getTotalPrice();
  const shippingFee = getShippingFee();
  const grandTotal = totalPrice + shippingFee;
  const remainingForFreeShipping = SHIPPING.FREE_THRESHOLD - totalPrice;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col items-center justify-center text-center">
          <ShoppingBag size={64} className="text-muted-foreground/30 mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            장바구니가 비어있습니다
          </h2>
          <p className="text-muted-foreground mb-6">
            맛있는 건어물을 담아보세요!
          </p>
          <Link
            href="/products"
            className="inline-flex rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
          >
            쇼핑하러 가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        장바구니 ({items.length})
      </h2>

      {/* 무료배송 안내 */}
      {remainingForFreeShipping > 0 && (
        <div className="mb-6 rounded-lg bg-accent/5 border border-accent/20 p-4 text-sm text-accent">
          <strong>{formatPrice(remainingForFreeShipping)}</strong>만 더 구매하시면{" "}
          <strong>무료배송</strong>됩니다!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 장바구니 목록 */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex gap-4 p-4 rounded-lg border border-border bg-white"
            >
              <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                <Image
                  src={item.thumbnailUrl || "/images/placeholder.svg"}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-foreground line-clamp-1">
                  {item.name}
                </h3>
                {item.weight && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.weight}
                  </p>
                )}

                <div className="mt-2 flex items-center gap-2">
                  {item.salePrice ? (
                    <>
                      <span className="font-bold text-primary">
                        {formatPrice(item.salePrice)}
                      </span>
                      <span className="text-xs text-muted-foreground line-through">
                        {formatPrice(item.price)}
                      </span>
                    </>
                  ) : (
                    <span className="font-bold text-foreground">
                      {formatPrice(item.price)}
                    </span>
                  )}
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center border border-border rounded">
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity - 1)
                      }
                      className="w-8 h-8 flex items-center justify-center hover:bg-muted"
                      aria-label="수량 감소"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-10 h-8 flex items-center justify-center text-sm border-x border-border">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                      className="w-8 h-8 flex items-center justify-center hover:bg-muted"
                      aria-label="수량 증가"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.productId)}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                    aria-label="삭제"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={clearCart}
            className="text-sm text-muted-foreground hover:text-destructive transition-colors"
          >
            장바구니 비우기
          </button>
        </div>

        {/* 주문 요약 */}
        <div className="lg:col-span-1">
          <div className="sticky top-40 rounded-xl border border-border bg-white p-6">
            <h3 className="font-semibold text-foreground mb-4">주문 요약</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">상품금액</span>
                <span className="font-medium">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">배송비</span>
                <span className={`font-medium ${shippingFee === 0 ? "text-green-600" : ""}`}>
                  {shippingFee === 0 ? "무료" : formatPrice(shippingFee)}
                </span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between">
                <span className="font-semibold text-foreground">총 결제금액</span>
                <span className="text-xl font-bold text-primary">
                  {formatPrice(grandTotal)}
                </span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="flex items-center justify-center w-full mt-6 h-14 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
            >
              주문하기
            </Link>

            <Link
              href="/products"
              className="block mt-3 text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              쇼핑 계속하기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
