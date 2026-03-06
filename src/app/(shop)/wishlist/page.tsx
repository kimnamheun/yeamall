import { Heart } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "좋아요",
};

export default function WishlistPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
          <Heart className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">좋아요</h1>
        <p className="text-muted-foreground mb-1">관심 상품을 모아볼 수 있는 기능을 준비 중입니다.</p>
        <p className="text-sm text-muted-foreground">곧 만나보실 수 있어요!</p>
      </div>
    </div>
  );
}
