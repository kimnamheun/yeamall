import { getAdminMembers } from "@/actions/admin";
import { getUser } from "@/actions/auth";
import dayjs from "dayjs";
import MemberAdminToggle from "./member-actions";

export default async function AdminMembersPage() {
  const [members, currentUser] = await Promise.all([
    getAdminMembers(),
    getUser(),
  ]);

  const adminCount = members.filter((m) => m.isAdmin).length;

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-bold text-foreground">회원 관리</h2>
        <p className="text-xs text-muted-foreground mt-1">
          총 {members.length}명 · 관리자 {adminCount}명
        </p>
      </div>

      <div className="bg-background rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-muted/50 border-b border-border text-muted-foreground">
                <th className="px-3 py-2.5 text-left font-medium">이름</th>
                <th className="px-3 py-2.5 text-left font-medium">이메일</th>
                <th className="px-3 py-2.5 text-left font-medium hidden md:table-cell">연락처</th>
                <th className="px-3 py-2.5 text-center font-medium hidden sm:table-cell">주문</th>
                <th className="px-3 py-2.5 text-center font-medium hidden sm:table-cell">리뷰</th>
                <th className="px-3 py-2.5 text-center font-medium">역할</th>
                <th className="px-3 py-2.5 text-left font-medium hidden lg:table-cell">가입일</th>
                <th className="px-3 py-2.5 text-center font-medium">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-3 py-2.5 font-medium text-foreground">
                    {member.name || "-"}
                  </td>
                  <td className="px-3 py-2.5 text-muted-foreground">
                    {member.email}
                  </td>
                  <td className="px-3 py-2.5 text-muted-foreground hidden md:table-cell">
                    {member.phone || "-"}
                  </td>
                  <td className="px-3 py-2.5 text-center hidden sm:table-cell">
                    {member._count.orders}
                  </td>
                  <td className="px-3 py-2.5 text-center hidden sm:table-cell">
                    {member._count.reviews}
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    {member.isAdmin ? (
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-100 text-purple-800">
                        관리자
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-600">
                        일반
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-muted-foreground hidden lg:table-cell">
                    {dayjs(member.createdAt).format("YYYY.MM.DD")}
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <MemberAdminToggle
                      memberId={member.id}
                      memberName={member.name || member.email}
                      isAdmin={member.isAdmin}
                      isSelf={member.id === currentUser?.id}
                    />
                  </td>
                </tr>
              ))}
              {members.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-3 py-8 text-center text-muted-foreground">
                    등록된 회원이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
