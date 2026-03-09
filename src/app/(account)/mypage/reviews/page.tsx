import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { ChevronRight, Star } from "lucide-react";
import { getUser } from "@/actions/auth";
import { getMyReviews } from "@/actions/review";
import dayjs from "dayjs";
import type { Metadata } from "next";
import ReviewDeleteButton from "./review-delete-button";

export const metadata: Metadata = {
  title: "나의 후기",
};

export default async function MyReviewsPage() {
  const user = await getUser();
  if (!user) redirect("/login?redirect=/mypage/reviews");

  const reviews = await getMyReviews();

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/mypage" className="text-muted-foreground hover:text-foreground">마이페이지</Link>
        <ChevronRight size={14} className="text-muted-foreground" />
        <h1 className="text-2xl font-bold text-foreground">나의 후기</h1>
        <span className="text-sm text-muted-foreground">({reviews.length})</span>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-20">
          <Star size={48} className="mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">작성한 후기가 없습니다.</p>
          <Link href="/products" className="mt-4 inline-block text-primary hover:underline">
            상품 보러 가기
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="rounded-xl bg-white border border-border p-5">
              <div className="flex gap-4">
                {review.product.thumbnailUrl && (
                  <Link href={`/products/${review.product.slug}`} className="shrink-0">
                    <Image
                      src={review.product.thumbnailUrl}
                      alt={review.product.name}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover w-20 h-20 bg-muted"
                    />
                  </Link>
                )}
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${review.product.slug}`} className="text-sm font-medium text-foreground hover:text-primary">
                    {review.product.name}
                  </Link>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={14} className={s <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">{dayjs(review.createdAt).format("YYYY.MM.DD")}</span>
                  </div>
                  <p className="text-sm text-foreground mt-2 leading-relaxed">{review.content}</p>
                </div>
                <ReviewDeleteButton reviewId={review.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
