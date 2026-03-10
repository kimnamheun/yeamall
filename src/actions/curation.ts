"use server";

import { prisma } from "@/lib/prisma";
import { getUser } from "./auth";

/**
 * 개인화 추천 상품 조회
 * - 비로그인/활동 없음: isRecommended 인기 상품 반환
 * - 로그인: 주문(3x)/찜(2x)/리뷰(1x) 카테고리 가중치 기반 추천
 */
export async function getCurationProducts(take = 8) {
  const user = await getUser();

  // 비로그인 → 인기 상품
  if (!user) {
    return {
      products: await prisma.product.findMany({
        where: { isActive: true, isRecommended: true },
        include: { category: true },
        take,
        orderBy: { createdAt: "desc" },
      }),
      isPersonalized: false,
    };
  }

  // 사용자 활동 데이터 병렬 조회
  const [orderItems, wishlists, reviews] = await Promise.all([
    prisma.orderItem.findMany({
      where: { order: { userId: user.id } },
      select: { productId: true, product: { select: { categoryId: true } } },
    }),
    prisma.wishlist.findMany({
      where: { userId: user.id },
      select: { productId: true, product: { select: { categoryId: true } } },
    }),
    prisma.review.findMany({
      where: { userId: user.id },
      select: { productId: true, product: { select: { categoryId: true } } },
    }),
  ]);

  // 카테고리 가중치 맵 생성
  const categoryFreq = new Map<string, number>();

  for (const item of orderItems) {
    const catId = item.product.categoryId;
    categoryFreq.set(catId, (categoryFreq.get(catId) || 0) + 3);
  }
  for (const item of wishlists) {
    const catId = item.product.categoryId;
    categoryFreq.set(catId, (categoryFreq.get(catId) || 0) + 2);
  }
  for (const item of reviews) {
    const catId = item.product.categoryId;
    categoryFreq.set(catId, (categoryFreq.get(catId) || 0) + 1);
  }

  // 활동 없는 사용자 → 인기 상품 폴백
  if (categoryFreq.size === 0) {
    return {
      products: await prisma.product.findMany({
        where: { isActive: true, isRecommended: true },
        include: { category: true },
        take,
        orderBy: { createdAt: "desc" },
      }),
      isPersonalized: false,
    };
  }

  // 카테고리 빈도순 정렬
  const rankedCategoryIds = [...categoryFreq.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([catId]) => catId);

  // 이미 구매한 상품 ID
  const purchasedProductIds = orderItems.map((item) => item.productId);

  // 선호 카테고리 상품 조회 (구매 상품 제외)
  const where: Record<string, unknown> = {
    isActive: true,
    isSoldOut: false,
    categoryId: { in: rankedCategoryIds },
  };
  if (purchasedProductIds.length > 0) {
    where.id = { notIn: purchasedProductIds };
  }

  let products = await prisma.product.findMany({
    where,
    include: { category: true },
    take: take * 2,
    orderBy: [{ isRecommended: "desc" }, { createdAt: "desc" }],
  });

  // 카테고리 랭크 기반 정렬
  products.sort((a, b) => {
    const rankA = rankedCategoryIds.indexOf(a.categoryId);
    const rankB = rankedCategoryIds.indexOf(b.categoryId);
    return rankA - rankB;
  });

  products = products.slice(0, take);

  // 부족하면 추천 상품으로 백필
  if (products.length < take) {
    const existingIds = products.map((p) => p.id);
    const backfill = await prisma.product.findMany({
      where: {
        isActive: true,
        isRecommended: true,
        id: { notIn: [...existingIds, ...purchasedProductIds] },
      },
      include: { category: true },
      take: take - products.length,
      orderBy: { createdAt: "desc" },
    });
    products = [...products, ...backfill];
  }

  return { products, isPersonalized: true };
}

/**
 * 인기 급상승 상품 (최근 7일 주문/찜 기반)
 */
export async function getTrendingProducts(take = 8) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [orderCounts, wishlistCounts] = await Promise.all([
    prisma.orderItem.groupBy({
      by: ["productId"],
      where: { order: { createdAt: { gte: sevenDaysAgo } } },
      _sum: { quantity: true },
    }),
    prisma.wishlist.groupBy({
      by: ["productId"],
      where: { createdAt: { gte: sevenDaysAgo } },
      _count: true,
    }),
  ]);

  // 점수 합산: 주문 2x, 찜 1x
  const scoreMap = new Map<string, number>();
  for (const item of orderCounts) {
    scoreMap.set(
      item.productId,
      (scoreMap.get(item.productId) || 0) + (item._sum.quantity || 0) * 2
    );
  }
  for (const item of wishlistCounts) {
    scoreMap.set(
      item.productId,
      (scoreMap.get(item.productId) || 0) + item._count
    );
  }

  const rankedProductIds = [...scoreMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, take)
    .map(([productId]) => productId);

  // 트렌딩 데이터 없으면 추천 상품 폴백
  if (rankedProductIds.length === 0) {
    return prisma.product.findMany({
      where: { isActive: true, isRecommended: true },
      include: { category: true },
      take,
      orderBy: { createdAt: "desc" },
    });
  }

  const products = await prisma.product.findMany({
    where: { id: { in: rankedProductIds }, isActive: true },
    include: { category: true },
  });

  // 점수순 재정렬
  products.sort((a, b) => {
    return (scoreMap.get(b.id) || 0) - (scoreMap.get(a.id) || 0);
  });

  return products;
}

/**
 * ID 배열로 상품 조회 (최근 본 상품용, 순서 유지)
 */
export async function getProductsByIds(ids: string[]) {
  if (ids.length === 0) return [];

  const products = await prisma.product.findMany({
    where: { id: { in: ids }, isActive: true },
    include: { category: true },
  });

  const productMap = new Map(products.map((p) => [p.id, p]));
  return ids.map((id) => productMap.get(id)).filter(Boolean);
}
