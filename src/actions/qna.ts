"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getUser } from "./auth";
import { requireAdmin } from "@/lib/auth-guard";

// ============ 상품 Q&A 조회 ============

export async function getProductQnas(productId: string) {
  const user = await getUser();

  let isAdmin = false;
  if (user) {
    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
      select: { isAdmin: true },
    });
    isAdmin = profile?.isAdmin ?? false;
  }

  const qnas = await prisma.qna.findMany({
    where: { productId },
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  return qnas.map((qna) => {
    const isOwner = user?.id === qna.userId;
    const isMasked = qna.isPrivate && !isOwner && !isAdmin;

    return {
      id: qna.id,
      question: isMasked ? "비밀글입니다." : qna.question,
      answer: isMasked ? null : qna.answer,
      isPrivate: qna.isPrivate,
      isMasked,
      createdAt: qna.createdAt,
      userId: qna.userId,
      user: {
        id: qna.user.id,
        name: isMasked ? "***" : qna.user.name,
        email: qna.user.email,
      },
    };
  });
}

export async function getProductQnaCount(productId: string) {
  return prisma.qna.count({ where: { productId } });
}

// ============ 질문 등록 ============

export async function createQna(formData: FormData) {
  const user = await getUser();
  if (!user) return { error: "로그인이 필요합니다." };

  const productId = formData.get("productId") as string;
  const question = formData.get("question") as string;
  const isPrivate = formData.get("isPrivate") === "on";

  if (!productId || !question?.trim()) {
    return { error: "질문 내용을 입력해주세요." };
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { slug: true },
  });

  await prisma.qna.create({
    data: {
      userId: user.id,
      productId,
      question: question.trim(),
      isPrivate,
    },
  });

  if (product) {
    revalidatePath(`/products/${product.slug}`);
  }
  return { success: true };
}

// ============ 질문 삭제 ============

export async function deleteQna(id: string) {
  const user = await getUser();
  if (!user) return { error: "로그인이 필요합니다." };

  const qna = await prisma.qna.findUnique({
    where: { id },
    include: { product: { select: { slug: true } } },
  });

  if (!qna) return { error: "문의를 찾을 수 없습니다." };

  // 본인 또는 관리자만 삭제 가능
  if (qna.userId !== user.id) {
    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
      select: { isAdmin: true },
    });
    if (!profile?.isAdmin) {
      return { error: "본인의 문의만 삭제할 수 있습니다." };
    }
  }

  await prisma.qna.delete({ where: { id } });

  revalidatePath(`/products/${qna.product.slug}`);
  revalidatePath("/admin/qna");
  return { success: true };
}

// ============ 관리자 답변 ============

export async function answerQna(qnaId: string, answer: string) {
  await requireAdmin();

  if (!answer?.trim()) {
    return { error: "답변 내용을 입력해주세요." };
  }

  const qna = await prisma.qna.findUnique({
    where: { id: qnaId },
    include: { product: { select: { slug: true } } },
  });

  if (!qna) return { error: "문의를 찾을 수 없습니다." };

  await prisma.qna.update({
    where: { id: qnaId },
    data: { answer: answer.trim() },
  });

  revalidatePath(`/products/${qna.product.slug}`);
  revalidatePath("/admin/qna");
  return { success: true };
}

// ============ 내 문의 목록 ============

export async function getMyQnas() {
  const user = await getUser();
  if (!user) return [];

  return prisma.qna.findMany({
    where: { userId: user.id },
    include: {
      product: { select: { id: true, name: true, slug: true, thumbnailUrl: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

// ============ 관리자 전체 Q&A ============

export async function getAdminQnas() {
  await requireAdmin();

  return prisma.qna.findMany({
    include: {
      user: { select: { id: true, name: true, email: true } },
      product: { select: { id: true, name: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}
