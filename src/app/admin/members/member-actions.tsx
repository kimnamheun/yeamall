"use client";

import { Shield, ShieldOff } from "lucide-react";
import { toggleMemberAdmin } from "@/actions/admin";
import { useRouter } from "next/navigation";

interface Props {
  memberId: string;
  memberName: string;
  isAdmin: boolean;
  isSelf: boolean;
}

export default function MemberAdminToggle({ memberId, memberName, isAdmin, isSelf }: Props) {
  const router = useRouter();

  const handleToggle = async () => {
    if (isSelf) return;

    const action = isAdmin ? "해제" : "부여";
    if (!confirm(`"${memberName}" 회원의 관리자 권한을 ${action}하시겠습니까?`)) return;

    await toggleMemberAdmin(memberId, !isAdmin);
    router.refresh();
  };

  if (isSelf) {
    return (
      <span className="text-[10px] text-muted-foreground">본인</span>
    );
  }

  return (
    <button
      onClick={handleToggle}
      className="p-1.5 rounded hover:bg-muted transition-colors"
      title={isAdmin ? "관리자 해제" : "관리자 부여"}
    >
      {isAdmin ? (
        <ShieldOff size={14} className="text-red-400" />
      ) : (
        <Shield size={14} className="text-muted-foreground" />
      )}
    </button>
  );
}
