"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getUser } from "./auth";

export async function getWishlist() {
  const user = await getUser();
  if (!user) return [];

  return prisma.wishlist.findMany({
    where: { userId: user.id },
    include: {
      product: { include: { category: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getWishlistIds() {
  const user = await getUser();
  if (!user) return [];

  const wishlists = await prisma.wishlist.findMany({
    where: { userId: user.id },
    select: { productId: true },
  });

  return wishlists.map((w) => w.productId);
}

export async function toggleWishlist(productId: string) {
  const user = await getUser();
  if (!user) return { error: "로그인이 필요합니다.", wishlisted: false };

  const existing = await prisma.wishlist.findUnique({
    where: { userId_productId: { userId: user.id, productId } },
  });

  if (existing) {
    await prisma.wishlist.delete({
      where: { id: existing.id },
    });
    revalidatePath("/wishlist");
    return { success: true, wishlisted: false };
  } else {
    await prisma.wishlist.create({
      data: { userId: user.id, productId },
    });
    revalidatePath("/wishlist");
    return { success: true, wishlisted: true };
  }
}

export async function removeFromWishlist(productId: string) {
  const user = await getUser();
  if (!user) return { error: "로그인이 필요합니다." };

  await prisma.wishlist.deleteMany({
    where: { userId: user.id, productId },
  });

  revalidatePath("/wishlist");
  return { success: true };
}
