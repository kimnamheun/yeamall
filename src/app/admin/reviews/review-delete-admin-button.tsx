"use client";

import { Trash2 } from "lucide-react";
import { deleteReviewAdmin } from "@/actions/review";
import { useRouter } from "next/navigation";

export default function ReviewDeleteAdminButton({
  reviewId,
}: {
  reviewId: string;
}) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("이 리뷰를 삭제하시겠습니까?")) return;
    const result = await deleteReviewAdmin(reviewId);
    if (result.error) {
      alert(result.error);
      return;
    }
    router.refresh();
  };

  return (
    <button
      onClick={handleDelete}
      className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors"
      title="삭제"
    >
      <Trash2 size={14} />
    </button>
  );
}
