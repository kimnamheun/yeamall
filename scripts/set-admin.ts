import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];

  if (!email) {
    console.log("사용법: pnpm set-admin <이메일>");
    console.log("예시:  pnpm set-admin admin@example.com");
    process.exit(1);
  }

  const profile = await prisma.profile.findUnique({
    where: { email },
  });

  if (!profile) {
    console.log(`회원을 찾을 수 없습니다: ${email}`);
    console.log("\n등록된 회원 목록:");
    const members = await prisma.profile.findMany({
      select: { email: true, name: true, isAdmin: true },
    });
    members.forEach((m) => {
      const role = m.isAdmin ? "[관리자]" : "[일반]";
      console.log(`  ${role} ${m.email} (${m.name || "이름없음"})`);
    });
    process.exit(1);
  }

  if (profile.isAdmin) {
    console.log(`${email} 은(는) 이미 관리자입니다.`);
    process.exit(0);
  }

  await prisma.profile.update({
    where: { email },
    data: { isAdmin: true },
  });

  console.log(`관리자 권한 부여 완료: ${email} (${profile.name || "이름없음"})`);
}

main()
  .catch((e) => {
    console.error("오류:", e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
