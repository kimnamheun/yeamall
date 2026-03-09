import { getAdminReviews } from "@/actions/review";
import dayjs from "dayjs";
import { Star } from "lucide-react";
import Link from "next/link";
import ReviewDeleteAdminButton from "./review-delete-admin-button";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "리뷰 관리 - 관리자",
};

export default async function AdminReviewsPage() {
  const reviews = await getAdminReviews();

  const avgRating =
    reviews.length > 0
      ? Math.round(
          (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10
        ) / 10
      : 0;

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-bold text-foreground">리뷰 관리</h2>
        <p className="text-xs text-muted-foreground mt-1">
          총 {reviews.length}건 · 평균 별점 {avgRating}점
        </p>
      </div>

      <div className="bg-background rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-muted/50 border-b border-border text-muted-foreground">
                <th className="px-3 py-2.5 text-left font-medium">상품</th>
                <th className="px-3 py-2.5 text-left font-medium">작성자</th>
                <th className="px-3 py-2.5 text-center font-medium">별점</th>
                <th className="px-3 py-2.5 text-left font-medium">내용</th>
                <th className="px-3 py-2.5 text-left font-medium hidden md:table-cell">
                  작성일
                </th>
                <th className="px-3 py-2.5 text-center font-medium">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {reviews.map((review) => (
                <tr
                  key={review.id}
                  className="hover:bg-muted/30 transition-colors align-top"
                >
                  <td className="px-3 py-2.5 font-medium text-foreground max-w-[120px] truncate">
                    <Link
                      href={`/products/${review.product.slug}`}
                      className="hover:text-primary hover:underline"
                    >
                      {review.product.name}
                    </Link>
                  </td>
                  <td className="px-3 py-2.5 text-muted-foreground">
                    {review.user.name || review.user.email.split("@")[0]}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center justify-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={12}
                          className={
                            s <= review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-200"
                          }
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-foreground max-w-[300px]">
                    <p className="line-clamp-2">{review.content}</p>
                  </td>
                  <td className="px-3 py-2.5 text-muted-foreground hidden md:table-cell">
                    {dayjs(review.createdAt).format("YYYY.MM.DD")}
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <ReviewDeleteAdminButton reviewId={review.id} />
                  </td>
                </tr>
              ))}
              {reviews.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-3 py-8 text-center text-muted-foreground"
                  >
                    등록된 리뷰가 없습니다.
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
