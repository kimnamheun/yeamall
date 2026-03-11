import Link from "next/link";
import { Package, Truck, CheckCircle, CreditCard, ArrowRight } from "lucide-react";
import { getPartnerDashboardStats } from "@/actions/partner";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "파트너 대시보드 | YeAmall",
};

export default async function PartnerDashboardPage() {
  const stats = await getPartnerDashboardStats();

  const cards = [
    {
      label: "결제완료",
      count: stats.paid,
      icon: CreditCard,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      label: "상품준비중",
      count: stats.preparing,
      icon: Package,
      color: "text-indigo-500",
      bgColor: "bg-indigo-50",
    },
    {
      label: "배송중",
      count: stats.shipping,
      icon: Truck,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
    {
      label: "배송완료",
      count: stats.delivered,
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-6">대시보드</h2>

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl bg-white border border-border p-4 sm:p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.bgColor}`}
              >
                <card.icon size={20} className={card.color} />
              </div>
              <span className="text-sm text-muted-foreground">{card.label}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{card.count}</p>
          </div>
        ))}
      </div>

      {/* 빠른 액션 */}
      <div className="rounded-xl bg-white border border-border p-6">
        <h3 className="font-semibold text-foreground mb-4">빠른 액션</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href="/partner/orders"
            className="flex items-center justify-between p-4 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Truck size={20} className="text-primary" />
              <div>
                <p className="font-medium text-foreground">주문/배송 관리</p>
                <p className="text-xs text-muted-foreground">
                  발송 대기 {stats.paid + stats.preparing}건
                </p>
              </div>
            </div>
            <ArrowRight size={16} className="text-muted-foreground" />
          </Link>
          <Link
            href="/partner/orders?status=SHIPPING"
            className="flex items-center justify-between p-4 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Package size={20} className="text-purple-500" />
              <div>
                <p className="font-medium text-foreground">배송중 주문</p>
                <p className="text-xs text-muted-foreground">
                  {stats.shipping}건 배송중
                </p>
              </div>
            </div>
            <ArrowRight size={16} className="text-muted-foreground" />
          </Link>
        </div>
      </div>
    </div>
  );
}
