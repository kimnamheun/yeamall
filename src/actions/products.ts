"use server";

import { prisma } from "@/lib/prisma";

export async function getCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getBestProducts(take = 8) {
  return prisma.product.findMany({
    where: { isActive: true, isRecommended: true },
    include: { category: true },
    take,
    orderBy: { createdAt: "desc" },
  });
}

export async function getNewProducts(take = 8) {
  return prisma.product.findMany({
    where: { isActive: true, isNew: true },
    include: { category: true },
    take,
    orderBy: { createdAt: "desc" },
  });
}

export async function getAllProducts(sort?: string) {
  const where = { isActive: true } as Record<string, unknown>;
  let orderBy: Record<string, string> = { createdAt: "desc" };

  switch (sort) {
    case "price_asc":
      orderBy = { price: "asc" };
      break;
    case "price_desc":
      orderBy = { price: "desc" };
      break;
    case "new":
      where.isNew = true;
      break;
    case "best":
      where.isRecommended = true;
      break;
  }

  return prisma.product.findMany({
    where,
    include: { category: true },
    orderBy,
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });
}

export async function getProductsByCategory(categorySlug: string) {
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
  });
  if (!category) return { category: null, products: [] };

  const products = await prisma.product.findMany({
    where: { categoryId: category.id, isActive: true },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return { category, products };
}

export async function getRelatedProducts(categoryId: string, excludeId: string, take = 4) {
  return prisma.product.findMany({
    where: { categoryId, isActive: true, id: { not: excludeId } },
    include: { category: true },
    take,
    orderBy: { createdAt: "desc" },
  });
}

export async function searchProducts(query: string) {
  if (!query.trim()) return [];
  return prisma.product.findMany({
    where: {
      isActive: true,
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { origin: { contains: query, mode: "insensitive" } },
      ],
    },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
}
