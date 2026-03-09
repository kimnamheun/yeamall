import { getAdminQnas } from "@/actions/qna";
import dayjs from "dayjs";
import QnaAnswerForm from "./qna-answer-form";

export default async function AdminQnaPage() {
  const qnas = await getAdminQnas();
  const unanswered = qnas.filter((q) => !q.answer).length;

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-bold text-foreground">Q&A 관리</h2>
        <p className="text-xs text-muted-foreground mt-1">
          총 {qnas.length}건 · 미답변 {unanswered}건
        </p>
      </div>

      <div className="bg-background rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-muted/50 border-b border-border text-muted-foreground">
                <th className="px-3 py-2.5 text-left font-medium">상품</th>
                <th className="px-3 py-2.5 text-left font-medium">질문자</th>
                <th className="px-3 py-2.5 text-left font-medium">질문 내용</th>
                <th className="px-3 py-2.5 text-center font-medium hidden sm:table-cell">비밀</th>
                <th className="px-3 py-2.5 text-center font-medium">상태</th>
                <th className="px-3 py-2.5 text-left font-medium hidden md:table-cell">등록일</th>
                <th className="px-3 py-2.5 text-left font-medium min-w-[200px]">답변</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {qnas.map((qna) => (
                <tr key={qna.id} className="hover:bg-muted/30 transition-colors align-top">
                  <td className="px-3 py-2.5 font-medium text-foreground max-w-[120px] truncate">
                    {qna.product.name}
                  </td>
                  <td className="px-3 py-2.5 text-muted-foreground">
                    {qna.user.name || qna.user.email.split("@")[0]}
                  </td>
                  <td className="px-3 py-2.5 text-foreground max-w-[200px]">
                    <p className="line-clamp-2">{qna.question}</p>
                  </td>
                  <td className="px-3 py-2.5 text-center hidden sm:table-cell">
                    {qna.isPrivate ? (
                      <span className="text-[10px] text-orange-500">비밀</span>
                    ) : (
                      <span className="text-[10px] text-muted-foreground">공개</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    {qna.answer ? (
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-800">완료</span>
                    ) : (
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-yellow-100 text-yellow-800">대기</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-muted-foreground hidden md:table-cell">
                    {dayjs(qna.createdAt).format("YYYY.MM.DD")}
                  </td>
                  <td className="px-3 py-2.5">
                    <QnaAnswerForm qnaId={qna.id} currentAnswer={qna.answer} />
                  </td>
                </tr>
              ))}
              {qnas.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-muted-foreground">
                    등록된 Q&A가 없습니다.
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
