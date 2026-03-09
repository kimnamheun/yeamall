import { getMyQnas } from "@/actions/qna";
import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "나의 문의" };

export default async function MyQnaPage() {
  const qnas = await getMyQnas();

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-foreground mb-6">나의 문의</h1>

      {qnas.length > 0 ? (
        <div className="space-y-4">
          {qnas.map((qna) => (
            <div key={qna.id} className="p-5 border border-border rounded-xl bg-background">
              <div className="flex gap-4">
                <Link href={`/products/${qna.product.slug}`} className="shrink-0">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={qna.product.thumbnailUrl || "/images/placeholder.svg"}
                      alt={qna.product.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Link href={`/products/${qna.product.slug}`} className="text-sm font-medium text-foreground hover:text-primary truncate">
                      {qna.product.name}
                    </Link>
                    {qna.answer ? (
                      <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-800">답변완료</span>
                    ) : (
                      <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium bg-yellow-100 text-yellow-800">답변대기</span>
                    )}
                  </div>
                  <p className="text-sm text-foreground mb-1">{qna.question}</p>
                  <span className="text-xs text-muted-foreground">{dayjs(qna.createdAt).format("YYYY.MM.DD")}</span>

                  {qna.answer && (
                    <div className="mt-3 p-3 bg-muted/50 rounded-lg border-l-4 border-primary">
                      <p className="text-xs font-medium text-primary mb-1">판매자 답변</p>
                      <p className="text-sm text-foreground leading-relaxed">{qna.answer}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          <p>등록된 문의가 없습니다.</p>
          <p className="text-sm mt-2">
            <Link href="/products" className="text-primary hover:underline">상품</Link>을 둘러보고 궁금한 점을 질문해보세요!
          </p>
        </div>
      )}
    </div>
  );
}
