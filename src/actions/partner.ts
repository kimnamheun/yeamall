"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requirePartner } from "@/lib/auth-guard";

// ============ 파트너 대시보드 통계 ============

export async function getPartnerDashboardStats() {
  await requirePartner();

  const orders = await prisma.order.findMany({
    where: {
      status: { in: ["PAID", "PREPARING", "SHIPPING", "DELIVERED"] },
    },
    select: { status: true },
  });

  const statusCounts: Record<string, number> = {};
  orders.forEach((o) => {
    statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
  });

  return {
    total: orders.length,
    paid: statusCounts["PAID"] || 0,
    preparing: statusCounts["PREPARING"] || 0,
    shipping: statusCounts["SHIPPING"] || 0,
    delivered: statusCounts["DELIVERED"] || 0,
  };
}

// ============ 파트너 주문 목록 ============

export async function getPartnerOrders(statusFilter?: string) {
  await requirePartner();

  const validStatuses = ["PAID", "PREPARING", "SHIPPING", "DELIVERED"];

  const where: Record<string, unknown> = {
    status: { in: validStatuses },
  };

  if (statusFilter && validStatuses.includes(statusFilter)) {
    where.status = statusFilter;
  }

  return prisma.order.findMany({
    where,
    include: {
      items: {
        include: {
          product: {
            select: { id: true, name: true, thumbnailUrl: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

// ============ 파트너 주문 상세 ============

export async function getPartnerOrderDetail(orderId: string) {
  await requirePartner();

  return prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: { select: { name: true, email: true } },
      items: {
        include: {
          product: {
            select: { id: true, name: true, thumbnailUrl: true, slug: true },
          },
        },
      },
    },
  });
}

// ============ 발송 처리 (핵심 기능) ============

export async function shipOrder(
  orderId: string,
  carrierCode: string,
  trackingNumber: string
) {
  await requirePartner();

  if (!carrierCode || !trackingNumber.trim()) {
    return { error: "택배사와 송장번호를 입력해주세요." };
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { status: true },
  });

  if (!order) {
    return { error: "주문을 찾을 수 없습니다." };
  }

  if (!["PAID", "PREPARING"].includes(order.status)) {
    return { error: "발송처리가 불가능한 주문 상태입니다." };
  }

  await prisma.order.update({
    where: { id: orderId },
    data: {
      status: "SHIPPING",
      carrierCode,
      trackingNumber: trackingNumber.trim(),
      shippedAt: new Date(),
    },
  });

  revalidatePath("/partner/orders");
  revalidatePath("/admin/orders");
  return { success: true };
}

// ============ 송장번호 수정 ============

export async function updateTracking(
  orderId: string,
  carrierCode: string,
  trackingNumber: string
) {
  await requirePartner();

  if (!carrierCode || !trackingNumber.trim()) {
    return { error: "택배사와 송장번호를 입력해주세요." };
  }

  await prisma.order.update({
    where: { id: orderId },
    data: {
      carrierCode,
      trackingNumber: trackingNumber.trim(),
    },
  });

  revalidatePath("/partner/orders");
  return { success: true };
}
