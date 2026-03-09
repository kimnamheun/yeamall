"use server";

import { prisma } from "@/lib/prisma";
import { getUser } from "./auth";
import dayjs from "dayjs";

export async function createOrder(data: {
  items: { productId: string; name: string; price: number; quantity: number }[];
  totalAmount: number;
  shippingFee: number;
  recipientName: string;
  recipientPhone: string;
  zipCode: string;
  address: string;
  addressDetail?: string;
  deliveryMemo?: string;
  paymentMethod: string;
}) {
  const user = await getUser();
  if (!user) return { error: "로그인이 필요합니다." };

  // Profile 확인/생성
  await prisma.profile.upsert({
    where: { id: user.id },
    update: {},
    create: {
      id: user.id,
      email: user.email!,
      name: user.user_metadata?.name || null,
    },
  });

  const orderNumber = `YEA-${dayjs().format("YYYYMMDD")}-${Date.now().toString(36).toUpperCase()}`;

  const order = await prisma.order.create({
    data: {
      orderNumber,
      userId: user.id,
      status: "PENDING",
      totalAmount: data.totalAmount,
      shippingFee: data.shippingFee,
      recipientName: data.recipientName,
      recipientPhone: data.recipientPhone,
      zipCode: data.zipCode,
      address: data.address,
      addressDetail: data.addressDetail || null,
      deliveryMemo: data.deliveryMemo || null,
      paymentMethod: data.paymentMethod,
      items: {
        create: data.items.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      },
    },
  });

  return { success: true, orderId: order.id, orderNumber: order.orderNumber };
}

export async function confirmPayment(orderId: string, paymentKey: string) {
  await prisma.order.update({
    where: { id: orderId },
    data: {
      status: "PAID",
      paymentKey,
      paidAt: new Date(),
    },
  });

  return { success: true };
}

// ============ 내 주문 조회 ============

export async function getMyOrders() {
  const user = await getUser();
  if (!user) return [];

  return prisma.order.findMany({
    where: { userId: user.id },
    include: {
      items: {
        include: {
          product: { select: { id: true, slug: true, thumbnailUrl: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getMyOrderCounts() {
  const user = await getUser();
  if (!user) return { PENDING: 0, PAID: 0, PREPARING: 0, SHIPPING: 0, DELIVERED: 0 };

  const result = await prisma.order.groupBy({
    by: ["status"],
    where: { userId: user.id },
    _count: true,
  });

  const counts: Record<string, number> = {};
  result.forEach((r) => {
    counts[r.status] = r._count;
  });
  return counts;
}

export async function getOrderDetail(orderId: string) {
  const user = await getUser();
  if (!user) return null;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: { select: { id: true, slug: true, thumbnailUrl: true } },
        },
      },
    },
  });

  if (!order || order.userId !== user.id) return null;
  return order;
}
