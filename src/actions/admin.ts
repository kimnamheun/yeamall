"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-guard";
import dayjs from "dayjs";

// ============ 대시보드 통계 ============

export async function getDashboardStats() {
  await requireAdmin();

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
  await requireAdmin();

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
  await requireAdmin();

  return prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function createProduct(formData: FormData) {
  await requireAdmin();

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
  await requireAdmin();

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
  await requireAdmin();

  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
  return { success: true };
}

export async function toggleProductSoldOut(id: string, isSoldOut: boolean) {
  await requireAdmin();

  await prisma.product.update({
    where: { id },
    data: { isSoldOut },
  });
  revalidatePath("/admin/products");
  revalidatePath("/products");
  return { success: true };
}

// ============ 카테고리 관리 ============

export async function getAdminCategories() {
  await requireAdmin();

  return prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { sortOrder: "asc" },
  });
}

export async function createCategory(formData: FormData) {
  await requireAdmin();

  const name = formData.get("name") as string;
  const slug = (formData.get("slug") as string) ||
    name.toLowerCase().replace(/[^a-z0-9가-힣\s]/g, "").replace(/\s+/g, "-") + "-" + Date.now().toString(36);

  const maxOrder = await prisma.category.aggregate({ _max: { sortOrder: true } });
  const sortOrder = (maxOrder._max.sortOrder ?? 0) + 1;

  await prisma.category.create({
    data: {
      name,
      slug,
      imageUrl: (formData.get("imageUrl") as string) || null,
      sortOrder,
      isActive: formData.get("isActive") !== "off",
      parentId: (formData.get("parentId") as string) || null,
    },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/categories");
  revalidatePath("/");
  return { success: true };
}

export async function updateCategory(id: string, formData: FormData) {
  await requireAdmin();

  await prisma.category.update({
    where: { id },
    data: {
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      imageUrl: (formData.get("imageUrl") as string) || null,
      isActive: formData.get("isActive") !== "off",
      parentId: (formData.get("parentId") as string) || null,
    },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/categories");
  revalidatePath("/");
  return { success: true };
}

export async function deleteCategory(id: string) {
  await requireAdmin();

  const productCount = await prisma.product.count({ where: { categoryId: id } });
  if (productCount > 0) {
    return { success: false, error: `${productCount}개 상품이 등록된 카테고리입니다. 상품을 먼저 이동/삭제하세요.` };
  }
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
  revalidatePath("/categories");
  revalidatePath("/");
  return { success: true };
}

export async function reorderCategory(id: string, direction: "up" | "down") {
  await requireAdmin();

  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
  const idx = categories.findIndex((c) => c.id === id);
  if (idx === -1) return { success: false };

  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= categories.length) return { success: false };

  const current = categories[idx];
  const swap = categories[swapIdx];

  await Promise.all([
    prisma.category.update({ where: { id: current.id }, data: { sortOrder: swap.sortOrder } }),
    prisma.category.update({ where: { id: swap.id }, data: { sortOrder: current.sortOrder } }),
  ]);

  revalidatePath("/admin/categories");
  revalidatePath("/categories");
  return { success: true };
}

export async function toggleCategoryActive(id: string, isActive: boolean) {
  await requireAdmin();

  await prisma.category.update({
    where: { id },
    data: { isActive },
  });
  revalidatePath("/admin/categories");
  revalidatePath("/categories");
  return { success: true };
}

// ============ 주문 관리 ============

export async function getAdminOrders() {
  await requireAdmin();

  return prisma.order.findMany({
    include: {
      user: true,
      items: { include: { product: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateOrderStatus(orderId: string, status: string) {
  await requireAdmin();

  await prisma.order.update({
    where: { id: orderId },
    data: { status: status as never },
  });
  revalidatePath("/admin/orders");
  return { success: true };
}

// ============ 회원 관리 ============

export async function getAdminMembers() {
  await requireAdmin();

  return prisma.profile.findMany({
    include: {
      _count: { select: { orders: true, reviews: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function toggleMemberAdmin(id: string, isAdmin: boolean) {
  await requireAdmin();

  await prisma.profile.update({
    where: { id },
    data: { isAdmin },
  });
  revalidatePath("/admin/members");
  return { success: true };
}

// ============ 통계 ============

export async function getSalesByPeriod(days: number = 30) {
  await requireAdmin();

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: startDate },
      status: { notIn: ["CANCELLED", "RETURNED"] },
    },
    select: { totalAmount: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  const dailySales: Record<string, { date: string; amount: number; count: number }> = {};
  orders.forEach((order) => {
    const dateKey = dayjs(order.createdAt).format("YYYY-MM-DD");
    if (!dailySales[dateKey]) {
      dailySales[dateKey] = { date: dateKey, amount: 0, count: 0 };
    }
    dailySales[dateKey].amount += order.totalAmount;
    dailySales[dateKey].count += 1;
  });

  return Object.values(dailySales);
}

export async function getTopProducts(limit: number = 10) {
  await requireAdmin();

  const items = await prisma.orderItem.findMany({
    include: {
      product: { select: { id: true, name: true, thumbnailUrl: true } },
    },
  });

  const productMap: Record<string, { name: string; thumbnailUrl: string | null; totalQuantity: number; totalRevenue: number }> = {};
  items.forEach((item) => {
    const pid = item.productId;
    if (!productMap[pid]) {
      productMap[pid] = {
        name: item.product.name,
        thumbnailUrl: item.product.thumbnailUrl,
        totalQuantity: 0,
        totalRevenue: 0,
      };
    }
    productMap[pid].totalQuantity += item.quantity;
    productMap[pid].totalRevenue += item.price * item.quantity;
  });

  return Object.values(productMap)
    .sort((a, b) => b.totalQuantity - a.totalQuantity)
    .slice(0, limit);
}

export async function getSalesByCategory() {
  await requireAdmin();

  const items = await prisma.orderItem.findMany({
    include: {
      product: { select: { categoryId: true, category: { select: { name: true } } } },
    },
  });

  const categoryMap: Record<string, { name: string; revenue: number; count: number }> = {};
  items.forEach((item) => {
    const catId = item.product.categoryId;
    const catName = item.product.category?.name || "미분류";
    if (!categoryMap[catId]) {
      categoryMap[catId] = { name: catName, revenue: 0, count: 0 };
    }
    categoryMap[catId].revenue += item.price * item.quantity;
    categoryMap[catId].count += item.quantity;
  });

  return Object.values(categoryMap).sort((a, b) => b.revenue - a.revenue);
}

export async function getOrderStatusDistribution() {
  await requireAdmin();

  const result = await prisma.order.groupBy({
    by: ["status"],
    _count: true,
  });
  return result.map((r) => ({
    status: r.status,
    count: r._count,
  }));
}

export async function getRecentMembers(limit: number = 10) {
  await requireAdmin();

  return prisma.profile.findMany({
    select: { id: true, name: true, email: true, createdAt: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
