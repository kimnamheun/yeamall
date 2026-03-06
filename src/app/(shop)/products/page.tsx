import ProductGrid from "@/components/product/product-grid";
import { getAllProducts } from "@/actions/products";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "전체상품",
  description: "YeAmall의 모든 건어물 상품을 만나보세요. 멸치, 오징어, 새우, 명태 등 신선한 건어물을 합리적인 가격에!",
  openGraph: {
    title: "전체상품 | YeAmall",
    description: "YeAmall의 모든 건어물 상품을 만나보세요.",
  },
};

interface Props {
  searchParams: Promise<{ sort?: string; page?: string }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const products = await getAllProducts(params.sort);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">전체상품</h2>
        <p className="text-sm text-muted-foreground mt-1">
          총 {products.length}개의 상품
        </p>
      </div>

      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
        <div className="flex items-center gap-2 text-sm">
          <SortLink href="/products" label="전체" active={!params.sort} />
          <span className="text-border">|</span>
          <SortLink href="/products?sort=best" label="인기순" active={params.sort === "best"} />
          <span className="text-border">|</span>
          <SortLink href="/products?sort=new" label="신상품순" active={params.sort === "new"} />
          <span className="text-border">|</span>
          <SortLink href="/products?sort=price_asc" label="낮은가격순" active={params.sort === "price_asc"} />
          <span className="text-border">|</span>
          <SortLink href="/products?sort=price_desc" label="높은가격순" active={params.sort === "price_desc"} />
        </div>
      </div>

      <ProductGrid products={products} />
    </div>
  );
}

function SortLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <a
      href={href}
      className={`transition-colors ${
        active ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
    </a>
  );
}
