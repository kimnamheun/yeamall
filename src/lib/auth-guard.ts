import { getUser } from "@/actions/auth";
import { prisma } from "@/lib/prisma";

export async function requireAdmin() {
  const user = await getUser();
  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    select: { isAdmin: true },
  });

  if (!profile?.isAdmin) {
    throw new Error("관리자 권한이 필요합니다.");
  }

  return user;
}

export async function requireUser() {
  const user = await getUser();
  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }
  return user;
}
