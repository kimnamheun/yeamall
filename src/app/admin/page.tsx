import {
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

const stats = [
  {
    label: "오늘 매출",
    value: formatPrice(1250000),
    change: "+12.5%",
    up: true,
    icon: TrendingUp,
  },
  {
    label: "총 주문",
    value: "156건",
    change: "+8.2%",
    up: true,
    icon: ShoppingCart,
  },
  {
    label: "등록 상품",
    value: "48개",
    change: "+3",
    up: true,
    icon: Package,
  },
  {
    label: "가입 회원",
    value: "2,340명",
    change: "+24",
    up: true,
    icon: Users,
  },
];

const recentOrders = [
  { id: "YEA-20260305-0015", customer: "김**", amount: 89000, status: "결제완료", time: "10분 전" },
  { id: "YEA-20260305-0014", customer: "이**", amount: 45000, status: "상품준비", time: "25분 전" },
  { id: "YEA-20260305-0013", customer: "박**", amount: 127000, status: "배송중", time: "1시간 전" },
  { id: "YEA-20260305-0012", customer: "최**", amount: 32000, status: "결제대기", time: "2시간 전" },
  { id: "YEA-20260305-0011", customer: "정**", amount: 68000, status: "배송완료", time: "3시간 전" },
];

const statusColors: Record<string, string> = {
  결제대기: "bg-yellow-100 text-yellow-800",
  결제완료: "bg-blue-100 text-blue-800",
  상품준비: "bg-indigo-100 text-indigo-800",
  배송중: "bg-purple-100 text-purple-800",
  배송완료: "bg-green-100 text-green-800",
};

export default function AdminDashboard() {
  return (
    <div>
      <h2 className="text-xl font-bold text-foreground mb-6">대시보드</h2>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl bg-white border border-border p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{stat.label}</span>
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <stat.icon size={18} className="text-primary" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <div className="flex items-center gap-1 mt-1">
              {stat.up ? (
                <ArrowUpRight size={14} className="text-green-600" />
              ) : (
                <ArrowDownRight size={14} className="text-red-600" />
              )}
              <span
                className={`text-xs font-medium ${
                  stat.up ? "text-green-600" : "text-red-600"
                }`}
              >
                {stat.change}
              </span>
              <span className="text-xs text-muted-foreground">전일 대비</span>
            </div>
          </div>
        ))}
      </div>

      {/* 최근 주문 */}
      <div className="rounded-xl bg-white border border-border p-6">
        <h3 className="font-semibold text-foreground mb-4">최근 주문</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-3 font-medium text-muted-foreground">주문번호</th>
                <th className="pb-3 font-medium text-muted-foreground">고객</th>
                <th className="pb-3 font-medium text-muted-foreground">금액</th>
                <th className="pb-3 font-medium text-muted-foreground">상태</th>
                <th className="pb-3 font-medium text-muted-foreground">시간</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-border/50 last:border-0"
                >
                  <td className="py-3 font-medium">{order.id}</td>
                  <td className="py-3">{order.customer}</td>
                  <td className="py-3">{formatPrice(order.amount)}</td>
                  <td className="py-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        statusColors[order.status] || ""
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 text-muted-foreground">{order.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
