import { Sparkles } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MY쿠레이션",
};

export default function CurationPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">MY쿠레이션</h1>
        <p className="text-muted-foreground mb-1">나만의 맞춤 추천 상품을 준비 중입니다.</p>
        <p className="text-sm text-muted-foreground">곧 만나보실 수 있어요!</p>
      </div>
    </div>
  );
}
