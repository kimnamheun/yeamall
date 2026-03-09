import { redirect } from "next/navigation";
import { getUser } from "@/actions/auth";
import { prisma } from "@/lib/prisma";
import AdminSidebar from "./admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 관리자 권한 확인 (Prisma로 직접 DB 조회 — RLS 영향 없음)
  const user = await getUser();

  if (!user) {
    redirect("/login?redirect=/admin");
  }

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    select: { isAdmin: true },
  });

  if (!profile?.isAdmin) {
    redirect("/");
  }

  return <AdminSidebar>{children}</AdminSidebar>;
}
