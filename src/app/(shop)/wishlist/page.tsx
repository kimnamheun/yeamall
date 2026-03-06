import { Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getWishlist } from "@/actions/wishlist";
import { formatPrice, getDiscountRate } from "@/lib/utils";
import { SITE } from "@/lib/constants";
import { getUser } from "@/actions/auth";
import WishlistRemoveButton from "./wishlist-remove-button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `좋아요 | ${SITE.name}`,
};

export default async function WishlistPage() {
  const user = await getUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
            <Heart className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">좋아요</h1>
          <p className="text-muted-foreground mb-4">로그인 후 관심 상품을 저장할 수 있습니다.</p>
          <Link
            href="/login"
            className="h-10 px-6 inline-flex items-center rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            로그인하기
          </Link>
        </div>
      </div>
    );
  }

  const wishlists = await getWishlist();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="flex items-center gap-2 mb-6">
        <Heart className="h-5 w-5 text-primary" />
        <h1 className="text-xl font-bold text-foreground">좋아요</h1>
        <span className="text-sm text-muted-foreground">({wishlists.length})</span>
      </div>

      {wishlists.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
            <Heart className="h-8 w-8 text-primary" />
          </div>
          <p className="text-muted-foreground mb-1">아직 찜한 상품이 없습니다.</p>
          <p className="text-sm text-muted-foreground mb-4">마음에 드는 상품에 하트를 눌러보세요!</p>
          <Link
            href="/products"
            className="h-10 px-6 inline-flex items-center rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            상품 둘러보기
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishlists.map((item) => {
            const product = item.product;
            return (
              <div key={item.id} className="relative group">
                <Link href={`/products/${product.slug}`} className="block">
                  <div className="relative overflow-hidden rounded-lg border border-border bg-white transition-shadow hover:shadow-md">
                    <div className="relative aspect-square overflow-hidden bg-muted">
                      <Image
                        src={product.thumbnailUrl || "/images/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                      {product.salePrice && (
                        <span className="absolute top-2 left-2 rounded bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
                          {getDiscountRate(product.price, product.salePrice)}%
                        </span>
                      )}
                      {product.isSoldOut && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                          <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-gray-800">일시품절</span>
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      {product.origin && (
                        <p className="text-xs text-muted-foreground mb-2">{product.origin}</p>
                      )}
                      <div className="flex items-end gap-2">
                        {product.salePrice ? (
                          <>
                            <span className="text-base font-bold text-primary">{formatPrice(product.salePrice)}</span>
                            <span className="text-xs text-muted-foreground line-through">{formatPrice(product.price)}</span>
                          </>
                        ) : (
                          <span className="text-base font-bold text-foreground">{formatPrice(product.price)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
                {/* 찜 해제 버튼 */}
                <WishlistRemoveButton productId={product.id} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
