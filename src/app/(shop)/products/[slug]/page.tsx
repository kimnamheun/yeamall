import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/actions/products";
import type { Metadata } from "next";
import ProductDetailClient from "./product-detail-client";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return {
    title: product?.name ?? "상품 상세",
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const relatedProducts = await getRelatedProducts(product.categoryId, product.id);

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}
