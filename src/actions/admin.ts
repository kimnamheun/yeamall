"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ============ 대시보드 통계 ============

export async function getDashboardStats() {
  const [totalProducts, activeProducts, totalOrders, orders] =
    await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { isActive: true, isSoldOut: false } }),
      prisma.order.count(),
      prisma.order.findMany({
        select: { totalAmount: true, status: true, createdAt: true },
      }),
    ]);

  const totalRevenue = orders
    .filter((o) => o.status !== "CANCELLED" && o.status !== "RETURNED")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayOrders = orders.filter((o) => new Date(o.createdAt) >= today);
  const todayRevenue = todayOrders
    .filter((o) => o.status !== "CANCELLED" && o.status !== "RETURNED")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingOrders = orders.filter((o) => o.status === "PENDING" || o.status === "PAID").length;
  const shippingOrders = orders.filter((o) => o.status === "SHIPPING").length;

  return {
    totalProducts,
    activeProducts,
    totalOrders,
    todayOrderCount: todayOrders.length,
    totalRevenue,
    todayRevenue,
    pendingOrders,
    shippingOrders,
  };
}

export async function getRecentOrders(take = 10) {
  return prisma.order.findMany({
    include: {
      user: true,
      items: { include: { product: true } },
    },
    orderBy: { createdAt: "desc" },
    take,
  });
}

// ============ 상품 관리 ============

export async function getAdminProducts() {
  return prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    + "-" + Date.now().toString(36);

  await prisma.product.create({
    data: {
      name,
      slug,
      description: formData.get("description") as string || null,
      price: parseInt(formData.get("price") as string),
      salePrice: formData.get("salePrice") ? parseInt(formData.get("salePrice") as string) : null,
      categoryId: formData.get("categoryId") as string,
      images: ["/images/placeholder.svg"],
      thumbnailUrl: "/images/placeholder.svg",
      stock: parseInt(formData.get("stock") as string) || 0,
      weight: formData.get("weight") as string || null,
      origin: formData.get("origin") as string || null,
      unit: formData.get("unit") as string || null,
      isNew: formData.get("isNew") === "on",
      isRecommended: formData.get("isRecommended") === "on",
      isSoldOut: false,
      shippingInfo: formData.get("shippingInfo") as string || "7만원 이상 무료배송",
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
  return { success: true };
}

export async function updateProduct(id: string, formData: FormData) {
  await prisma.product.update({
    where: { id },
    data: {
      name: formData.get("name") as string,
      description: formData.get("description") as string || null,
      price: parseInt(formData.get("price") as string),
      salePrice: formData.get("salePrice") ? parseInt(formData.get("salePrice") as string) : null,
      categoryId: formData.get("categoryId") as string,
      stock: parseInt(formData.get("stock") as string) || 0,
      weight: formData.get("weight") as string || null,
      origin: formData.get("origin") as string || null,
      unit: formData.get("unit") as string || null,
      isNew: formData.get("isNew") === "on",
      isRecommended: formData.get("isRecommended") === "on",
      isSoldOut: formData.get("isSoldOut") === "on",
      shippingInfo: formData.get("shippingInfo") as string || null,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
  return { success: true };
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
  return { success: true };
}

export async function toggleProductSoldOut(id: string, isSoldOut: boolean) {
  await prisma.product.update({
    where: { id },
    data: { isSoldOut },
  });
  revalidatePath("/admin/products");
  revalidatePath("/products");
  return { success: true };
}

// ============ 주문 관리 ============

export async function getAdminOrders() {
  return prisma.order.findMany({
    include: {
      user: true,
      items: { include: { product: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateOrderStatus(orderId: string, status: string) {
  await prisma.order.update({
    where: { id: orderId },
    data: { status: status as never },
  });
  revalidatePath("/admin/orders");
  return { success: true };
}
