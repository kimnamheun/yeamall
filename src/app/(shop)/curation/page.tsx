import Link from "next/link";
import { Sparkles, TrendingUp, ArrowRight } from "lucide-react";
import ProductGrid from "@/components/product/product-grid";
import { getCurationProducts, getTrendingProducts } from "@/actions/curation";
import { SITE } from "@/lib/constants";
import RecentlyViewedSection from "./recently-viewed-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `MY큐레이션 | ${SITE.name}`,
  description: "나만의 맞춤 추천 상품을 만나보세요",
};

export default async function CurationPage() {
  const [curationResult, trendingProducts] = await Promise.all([
    getCurationProducts(8),
    getTrendingProducts(8),
  ]);

  const { products: curationProducts, isPersonalized } = curationResult;

  return (
    <div>
      {/* 페이지 헤더 */}
      <section className="bg-gradient-to-b from-primary/5 to-transparent py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              MY큐레이션
            </h1>
          </div>
          <p className="text-sm text-muted-foreground ml-[52px]">
            {isPersonalized
              ? "회원님의 관심사를 기반으로 추천드려요"
              : "인기 상품을 추천드려요. 로그인하면 맞춤 추천을 받을 수 있어요!"}
          </p>
        </div>
      </section>

      {/* 섹션 1: 맞춤 추천 / 인기 추천 상품 */}
      <section className="py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                {isPersonalized ? "맞춤 추천 상품" : "인기 추천 상품"}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                {isPersonalized
                  ? "회원님이 관심있는 카테고리의 상품이에요"
                  : "많은 분들이 찾고 있는 인기 상품이에요"}
              </p>
            </div>
            <Link
              href="/products"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              전체보기 <ArrowRight size={14} />
            </Link>
          </div>
          <ProductGrid products={curationProducts} />
        </div>
      </section>

      {/* 섹션 2: 최근 본 상품 (클라이언트 컴포넌트) */}
      <div className="border-t border-border">
        <RecentlyViewedSection />
      </div>

      {/* 섹션 3: 인기 급상승 */}
      <section className="py-10 sm:py-12 border-t border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp size={20} className="text-red-500" />
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                  인기 급상승
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  최근 7일간 주문/찜이 가장 많은 상품
                </p>
              </div>
            </div>
          </div>
          <ProductGrid products={trendingProducts} />
        </div>
      </section>
    </div>
  );
}
