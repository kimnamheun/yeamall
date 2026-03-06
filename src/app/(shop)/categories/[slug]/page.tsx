import { getCategories, getAllProducts } from "@/actions/products";
import { CATEGORIES } from "@/lib/constants";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CategoryPageClient from "../category-page-client";

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

export default async function CategorySlugPage({ params }: Props) {
  const { slug } = await params;
  const [categories, allProducts] = await Promise.all([
    getCategories(),
    getAllProducts(),
  ]);

  const catExists = categories.some((c) => c.slug === slug);
  if (!catExists) notFound();

  return (
    <CategoryPageClient
      categories={categories}
      allProducts={allProducts}
      initialSlug={slug}
    />
  );
}
