import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getUserProfile } from "@/actions/auth";
import ProfileForm from "./profile-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "회원 정보 수정",
};

export default async function ProfileEditPage() {
  const profile = await getUserProfile();
  if (!profile) redirect("/login?redirect=/mypage/profile");

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/mypage" className="text-muted-foreground hover:text-foreground">마이페이지</Link>
        <ChevronRight size={14} className="text-muted-foreground" />
        <h1 className="text-2xl font-bold text-foreground">회원 정보 수정</h1>
      </div>

      <ProfileForm profile={profile} />
    </div>
  );
}
