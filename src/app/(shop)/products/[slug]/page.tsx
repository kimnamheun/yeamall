import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/actions/products";
import { getProductReviews, getProductReviewStats } from "@/actions/review";
import { getProductQnas, getProductQnaCount } from "@/actions/qna";
import { getWishlistIds } from "@/actions/wishlist";
import { SITE } from "@/lib/constants";
import type { Metadata } from "next";
import ProductDetailClient from "./product-detail-client";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "상품 상세" };

  return {
    title: `${product.name} | ${SITE.name}`,
    description: product.description || `${product.name} - ${SITE.description}`,
    openGraph: {
      title: product.name,
      description: product.description || SITE.description,
      images: product.thumbnailUrl ? [product.thumbnailUrl] : [],
      type: "website",
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const [relatedProducts, reviews, reviewStats, wishlistIds, qnas, qnaCount] = await Promise.all([
    getRelatedProducts(product.categoryId, product.id),
    getProductReviews(product.id),
    getProductReviewStats(product.id),
    getWishlistIds(),
    getProductQnas(product.id),
    getProductQnaCount(product.id),
  ]);

  return (
    <ProductDetailClient
      product={product}
      relatedProducts={relatedProducts}
      reviews={reviews}
      reviewStats={reviewStats}
      isWishlisted={wishlistIds.includes(product.id)}
      qnas={qnas}
      qnaCount={qnaCount}
    />
  );
}
