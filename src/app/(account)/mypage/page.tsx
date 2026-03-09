import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Package,
  Heart,
  Star,
  MessageSquare,
  User,
  ChevronRight,
  Truck,
  CheckCircle,
  CreditCard,
} from "lucide-react";
import { getUserProfile } from "@/actions/auth";
import { getMyOrderCounts } from "@/actions/order";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "마이페이지",
};

export default async function MyPage() {
  const profile = await getUserProfile();
  if (!profile) redirect("/login?redirect=/mypage");

  const orderCounts = await getMyOrderCounts();

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-foreground mb-6">마이페이지</h1>

      {/* 회원 정보 카드 */}
      <div className="rounded-xl bg-white border border-border p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary">
              <User size={24} />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">
                {profile.name || "회원"}님 환영합니다!
              </h2>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">
              {profile.isAdmin ? "관리자" : "일반회원"}
            </p>
            <p className="text-sm font-semibold text-primary">
              포인트: {profile.points.toLocaleString()}P
            </p>
          </div>
        </div>
      </div>

      {/* 주문 현황 */}
      <div className="rounded-xl bg-white border border-border p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">주문 현황</h3>
          <Link
            href="/orders"
            className="text-sm text-accent hover:underline flex items-center gap-1"
          >
            전체보기 <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-4 text-center">
          <Link href="/orders" className="group">
            <div className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-muted transition-colors">
              <CreditCard size={24} className="text-muted-foreground group-hover:text-primary" />
              <span className="text-2xl font-bold text-foreground">{(orderCounts["PENDING"] || 0) + (orderCounts["PAID"] || 0)}</span>
              <span className="text-xs text-muted-foreground">결제완료</span>
            </div>
          </Link>
          <Link href="/orders" className="group">
            <div className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-muted transition-colors">
              <Package size={24} className="text-muted-foreground group-hover:text-primary" />
              <span className="text-2xl font-bold text-foreground">{orderCounts["PREPARING"] || 0}</span>
              <span className="text-xs text-muted-foreground">상품준비</span>
            </div>
          </Link>
          <Link href="/orders" className="group">
            <div className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-muted transition-colors">
              <Truck size={24} className="text-muted-foreground group-hover:text-primary" />
              <span className="text-2xl font-bold text-foreground">{orderCounts["SHIPPING"] || 0}</span>
              <span className="text-xs text-muted-foreground">배송중</span>
            </div>
          </Link>
          <Link href="/orders" className="group">
            <div className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-muted transition-colors">
              <CheckCircle size={24} className="text-muted-foreground group-hover:text-primary" />
              <span className="text-2xl font-bold text-foreground">{orderCounts["DELIVERED"] || 0}</span>
              <span className="text-xs text-muted-foreground">배송완료</span>
            </div>
          </Link>
        </div>
      </div>

      {/* 메뉴 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { href: "/orders", icon: Package, label: "주문 내역", desc: "주문/배송 조회" },
          { href: "/mypage/profile", icon: User, label: "회원 정보 수정", desc: "개인정보 · 배송지 변경" },
          { href: "/mypage/reviews", icon: Star, label: "나의 후기", desc: "작성한 후기 관리" },
          { href: "/wishlist", icon: Heart, label: "찜한 상품", desc: "관심 상품 목록" },
          { href: "/mypage/qna", icon: MessageSquare, label: "나의 문의", desc: "문의 내역 확인" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-4 p-4 rounded-xl bg-white border border-border hover:border-primary/30 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted text-muted-foreground">
              <item.icon size={20} />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
            <ChevronRight size={16} className="text-muted-foreground" />
          </Link>
        ))}
      </div>
    </div>
  );
}
