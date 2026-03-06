import Link from "next/link";
import Image from "next/image";
import ProductGrid from "@/components/product/product-grid";
import { searchProducts, getBestProducts } from "@/actions/products";
import { Search, TrendingUp, Heart } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "검색",
};

const POPULAR_KEYWORDS = [
  { rank: 1, keyword: "멸치", isHot: true },
  { rank: 2, keyword: "오징어", isHot: true },
  { rank: 3, keyword: "선물세트", isHot: false },
  { rank: 4, keyword: "견과류", isHot: false },
  { rank: 5, keyword: "다시마", isHot: false },
  { rank: 6, keyword: "새우", isHot: false },
  { rank: 7, keyword: "황태", isHot: false },
  { rank: 8, keyword: "김", isHot: false },
  { rank: 9, keyword: "아몬드", isHot: false },
  { rank: 10, keyword: "볶음멸치", isHot: false },
];

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
  const query = params.q?.trim() || "";
  const results = await searchProducts(query);
  const recommendedProducts = !query ? await getBestProducts(6) : [];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* 검색바 */}
      <form action="/search" method="GET" className="mb-6 sm:mb-8">
        <div className="relative max-w-2xl mx-auto">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="검색어를 입력하세요"
            className="w-full h-12 sm:h-14 pl-12 pr-20 sm:pr-24 rounded-2xl border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm sm:text-base"
            autoFocus
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 sm:h-10 px-4 sm:px-6 rounded-xl bg-primary text-white text-xs sm:text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            검색
          </button>
        </div>
      </form>

      {query ? (
        /* 검색 결과 */
        <>
          <div className="mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              &ldquo;{query}&rdquo; 검색 결과
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {results.length}개의 상품을 찾았습니다
            </p>
          </div>
          {results.length > 0 ? (
            <ProductGrid products={results} />
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <Search size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-base mb-2">검색 결과가 없습니다</p>
              <p className="text-sm">다른 검색어로 다시 시도해보세요</p>
            </div>
          )}
        </>
      ) : (
        /* 검색어 미입력 시: 인기검색어 + 추천 상품 */
        <>
          {/* 인기 검색어 */}
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={18} className="text-primary" />
              <h3 className="text-base font-bold text-foreground">인기 검색어</h3>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-0">
              {POPULAR_KEYWORDS.map((item) => (
                <Link
                  key={item.rank}
                  href={`/search?q=${item.keyword}`}
                  className="flex items-center gap-3 py-2.5 border-b border-border/50 hover:bg-muted/50 px-2 rounded transition-colors"
                >
                  <span
                    className={`w-5 text-center text-sm font-bold ${
                      item.rank <= 3 ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {item.rank}
                  </span>
                  <span className="text-sm text-foreground">{item.keyword}</span>
                  {item.isHot && (
                    <span className="text-[10px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded">
                      HOT
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </section>

          {/* 즐겨찾는 추천 상품 */}
          {recommendedProducts.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Heart size={18} className="text-primary" />
                <h3 className="text-base font-bold text-foreground">추천 상품</h3>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {recommendedProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="group block"
                  >
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-muted border border-border mb-2">
                      <Image
                        src={product.thumbnailUrl || "/images/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                        sizes="(max-width: 640px) 33vw, 16vw"
                      />
                      {product.salePrice && (
                        <span className="absolute top-1 left-1 rounded bg-red-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
                          SALE
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-foreground line-clamp-2 leading-tight mb-1 group-hover:text-primary transition-colors">
                      {product.name}
                    </p>
                    <p className="text-xs font-bold text-primary">
                      {formatPrice(product.salePrice ?? product.price)}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
