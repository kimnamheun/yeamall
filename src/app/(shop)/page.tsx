import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, Truck, Shield, RefreshCw, Headphones } from "lucide-react";
import ProductGrid from "@/components/product/product-grid";
import HeroBanner from "@/components/home/hero-banner";
import { getBestProducts, getNewProducts } from "@/actions/products";
import { CATEGORIES, SITE } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";

export default async function HomePage() {
  const [bestProducts, newProducts] = await Promise.all([
    getBestProducts(),
    getNewProducts(),
  ]);

  // 타임세일 상품 (할인가가 있는 상품 중 상위 4개)
  const saleProducts = bestProducts
    .filter((p) => p.salePrice && p.salePrice < p.price)
    .slice(0, 4);

  return (
    <div>
      {/* 히어로 배너 (슬라이드) */}
      <HeroBanner />

      {/* 카테고리 아이콘 */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 sm:gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="flex flex-col items-center gap-1.5 sm:gap-2 p-2 sm:p-3 rounded-xl hover:bg-muted transition-colors"
              >
                <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-primary/5">
                  <span className="text-2xl sm:text-3xl">{cat.icon}</span>
                </div>
                <span className="text-[11px] sm:text-xs font-medium text-foreground text-center leading-tight">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 타임세일 */}
      {saleProducts.length > 0 && (
        <section className="py-8 sm:py-10 bg-gradient-to-b from-red-50/50 to-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-5">
              <Clock size={20} className="text-red-500" />
              <h3 className="text-lg sm:text-xl font-bold text-foreground">
                오늘의 특가
              </h3>
              <span className="ml-auto text-xs sm:text-sm text-red-500 font-semibold">
                매일 갱신
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {saleProducts.map((product) => {
                const discountRate = Math.round(
                  ((product.price - (product.salePrice ?? product.price)) / product.price) * 100
                );
                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="group rounded-xl border border-border bg-white overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="relative aspect-square bg-muted">
                      <Image
                        src={product.thumbnailUrl || "/images/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                        sizes="(max-width: 640px) 50vw, 25vw"
                      />
                      <span className="absolute top-2 left-2 rounded-md bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                        {discountRate}% OFF
                      </span>
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium text-foreground line-clamp-1 mb-1">
                        {product.name}
                      </p>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-bold text-red-500">
                          {formatPrice(product.salePrice ?? product.price)}
                        </span>
                        <span className="text-xs text-muted-foreground line-through">
                          {formatPrice(product.price)}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 베스트 상품 */}
      <section className="py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground">베스트 상품</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                가장 많이 찾는 인기 건어물
              </p>
            </div>
            <Link
              href="/products?sort=best"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              더보기 <ArrowRight size={14} />
            </Link>
          </div>
          <ProductGrid products={bestProducts} />
        </div>
      </section>

      {/* 프로모션 배너 */}
      <section className="bg-primary/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="rounded-2xl bg-gradient-to-r from-primary to-primary/80 p-6 sm:p-10 text-center text-white">
            <h3 className="text-xl sm:text-2xl font-bold mb-2">
              신규회원 특별 혜택
            </h3>
            <p className="text-sm text-primary-foreground/80 mb-5">
              지금 가입하면 5,000원 할인쿠폰 + 첫 구매 무료배송!
            </p>
            <Link
              href="/register"
              className="inline-flex rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-primary hover:bg-gray-100 transition-colors"
            >
              회원가입 하기
            </Link>
          </div>
        </div>
      </section>

      {/* 신상품 */}
      <section className="py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground">신상품</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                새로 입고된 건어물을 만나보세요
              </p>
            </div>
            <Link
              href="/products?sort=new"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              더보기 <ArrowRight size={14} />
            </Link>
          </div>
          <ProductGrid products={newProducts} />
        </div>
      </section>

      {/* 안내 배너 */}
      <section className="border-t border-border bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: Truck, title: "무료배송", desc: "7만원 이상 구매 시" },
              { icon: Shield, title: "품질보증", desc: "100% 정품 보장" },
              { icon: RefreshCw, title: "교환/반품", desc: "수령 후 7일 이내" },
              { icon: Headphones, title: "고객센터", desc: SITE.cs.phone },
            ].map((item) => (
              <div key={item.title} className="flex flex-col items-center text-center gap-2 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <item.icon size={20} className="text-primary" />
                </div>
                <h4 className="font-semibold text-sm">{item.title}</h4>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
