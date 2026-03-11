import { redirect } from "next/navigation";
import { getUser } from "@/actions/auth";
import { prisma } from "@/lib/prisma";
import PartnerSidebar from "./partner-sidebar";

export default async function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user) {
    redirect("/login?redirect=/partner");
  }

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    select: { isPartner: true },
  });

  if (!profile?.isPartner) {
    redirect("/");
  }

  return <PartnerSidebar>{children}</PartnerSidebar>;
}
