import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ProductGrid from "@/components/product/product-grid";
import { getProductsByCategory } from "@/actions/products";
import { CATEGORIES } from "@/lib/constants";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = CATEGORIES.find((c) => c.slug === slug);
  return {
    title: cat ? cat.name : "카테고리",
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const { category, products } = await getProductsByCategory(slug);
  const catInfo = CATEGORIES.find((c) => c.slug === slug);

  if (!category) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">홈</Link>
        <ChevronRight size={14} />
        <Link href="/products" className="hover:text-foreground">전체상품</Link>
        <ChevronRight size={14} />
        <span className="text-foreground">{category.name}</span>
      </nav>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          {catInfo && <span className="text-3xl">{catInfo.icon}</span>}
          {category.name}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          총 {products.length}개의 상품
        </p>
      </div>

      <ProductGrid products={products} />
    </div>
  );
}
