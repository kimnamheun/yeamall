"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { answerQna } from "@/actions/qna";
import { Edit, Check } from "lucide-react";

interface Props {
  qnaId: string;
  currentAnswer: string | null;
}

export default function QnaAnswerForm({ qnaId, currentAnswer }: Props) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [answer, setAnswer] = useState(currentAnswer || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    setLoading(true);
    await answerQna(qnaId, answer);
    setIsEditing(false);
    setLoading(false);
    router.refresh();
  };

  if (!isEditing) {
    return (
      <div className="flex items-start gap-2">
        {currentAnswer ? (
          <>
            <p className="text-xs text-foreground flex-1 line-clamp-2">{currentAnswer}</p>
            <button
              onClick={() => setIsEditing(true)}
              className="shrink-0 p-1 rounded hover:bg-muted transition-colors"
              title="답변 수정"
            >
              <Edit size={12} className="text-muted-foreground" />
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="h-7 px-3 rounded-md bg-primary text-white text-[11px] font-medium hover:bg-primary/90"
          >
            답변 작성
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="답변을 입력하세요"
        className="w-full h-20 px-2 py-1.5 rounded-md border border-border text-xs resize-none focus:border-primary focus:ring-1 focus:ring-primary outline-none"
        autoFocus
      />
      <div className="flex gap-1">
        <button
          onClick={handleSubmit}
          disabled={loading || !answer.trim()}
          className="h-6 px-2 rounded bg-primary text-white text-[10px] font-medium hover:bg-primary/90 disabled:opacity-50 flex items-center gap-1"
        >
          <Check size={10} />
          {loading ? "저장 중..." : currentAnswer ? "수정" : "등록"}
        </button>
        <button
          onClick={() => { setIsEditing(false); setAnswer(currentAnswer || ""); }}
          className="h-6 px-2 rounded border border-border text-[10px] hover:bg-muted"
        >
          취소
        </button>
      </div>
    </div>
  );
}
