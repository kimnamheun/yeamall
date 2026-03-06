"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getUser } from "./auth";

export async function getProductReviews(productId: string) {
  return prisma.review.findMany({
    where: { productId },
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getProductReviewStats(productId: string) {
  const reviews = await prisma.review.findMany({
    where: { productId },
    select: { rating: true },
  });

  if (reviews.length === 0) {
    return { count: 0, average: 0, distribution: [0, 0, 0, 0, 0] };
  }

  const total = reviews.reduce((sum, r) => sum + r.rating, 0);
  const distribution = [0, 0, 0, 0, 0];
  reviews.forEach((r) => {
    distribution[r.rating - 1]++;
  });

  return {
    count: reviews.length,
    average: Math.round((total / reviews.length) * 10) / 10,
    distribution,
  };
}

export async function createReview(formData: FormData) {
  const user = await getUser();
  if (!user) return { error: "로그인이 필요합니다." };

  const productId = formData.get("productId") as string;
  const rating = parseInt(formData.get("rating") as string);
  const content = formData.get("content") as string;

  if (!productId || !rating || !content) {
    return { error: "모든 필드를 입력해주세요." };
  }

  if (rating < 1 || rating > 5) {
    return { error: "별점은 1~5 사이로 입력해주세요." };
  }

  // 이미 리뷰를 작성했는지 확인
  const existing = await prisma.review.findFirst({
    where: { userId: user.id, productId },
  });
  if (existing) {
    return { error: "이미 리뷰를 작성했습니다." };
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { slug: true },
  });

  await prisma.review.create({
    data: {
      userId: user.id,
      productId,
      rating,
      content,
      images: [],
    },
  });

  if (product) {
    revalidatePath(`/products/${product.slug}`);
  }
  return { success: true };
}

export async function deleteReview(reviewId: string) {
  const user = await getUser();
  if (!user) return { error: "로그인이 필요합니다." };

  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    include: { product: { select: { slug: true } } },
  });

  if (!review) return { error: "리뷰를 찾을 수 없습니다." };
  if (review.userId !== user.id) return { error: "본인의 리뷰만 삭제할 수 있습니다." };

  await prisma.review.delete({ where: { id: reviewId } });

  revalidatePath(`/products/${review.product.slug}`);
  return { success: true };
}

// ============ 관리자용 ============

export async function getAdminReviews() {
  return prisma.review.findMany({
    include: {
      user: { select: { id: true, name: true, email: true } },
      product: { select: { id: true, name: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function deleteReviewAdmin(reviewId: string) {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    include: { product: { select: { slug: true } } },
  });
  if (!review) return { error: "리뷰를 찾을 수 없습니다." };

  await prisma.review.delete({ where: { id: reviewId } });
  revalidatePath(`/products/${review.product.slug}`);
  revalidatePath("/admin/reviews");
  return { success: true };
}
