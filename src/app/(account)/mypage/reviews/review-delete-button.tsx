"use client";

import { Trash2 } from "lucide-react";
import { deleteReview } from "@/actions/review";
import { useRouter } from "next/navigation";

export default function ReviewDeleteButton({ reviewId }: { reviewId: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("후기를 삭제하시겠습니까?")) return;
    const result = await deleteReview(reviewId);
    if (result.error) {
      alert(result.error);
      return;
    }
    router.refresh();
  };

  return (
    <button
      onClick={handleDelete}
      className="shrink-0 p-2 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors"
      title="삭제"
    >
      <Trash2 size={16} />
    </button>
  );
}
