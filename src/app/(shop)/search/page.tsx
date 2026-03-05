import ProductGrid from "@/components/product/product-grid";
import { searchProducts } from "@/actions/products";
import { Search } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "검색",
};

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
  const query = params.q?.trim() || "";
  const results = await searchProducts(query);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <form action="/search" method="GET" className="mb-8">
        <div className="relative max-w-2xl mx-auto">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="검색어를 입력하세요 (예: 멸치, 오징어, 선물세트)"
            className="w-full h-14 pl-12 pr-24 rounded-2xl border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base"
            autoFocus
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-6 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            검색
          </button>
        </div>
      </form>

      {query ? (
        <>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-foreground">
              &ldquo;{query}&rdquo; 검색 결과
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {results.length}개의 상품을 찾았습니다
            </p>
          </div>
          <ProductGrid products={results} />
        </>
      ) : (
        <div className="text-center py-20 text-muted-foreground">
          <Search size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg">검색어를 입력해주세요</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {["멸치", "오징어", "선물세트", "견과류", "다시마", "새우"].map(
              (keyword) => (
                <a
                  key={keyword}
                  href={`/search?q=${keyword}`}
                  className="px-4 py-2 rounded-full border border-border text-sm hover:bg-primary hover:text-white hover:border-primary transition-colors"
                >
                  {keyword}
                </a>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
