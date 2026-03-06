import { getCategories, getAllProducts } from "@/actions/products";
import type { Metadata } from "next";
import CategoryPageClient from "./category-page-client";

export const metadata: Metadata = {
  title: "카테고리",
};

export default async function CategoriesPage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getAllProducts(),
  ]);

  return <CategoryPageClient categories={categories} allProducts={products} />;
}
