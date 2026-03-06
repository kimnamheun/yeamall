import Link from "next/link";
import {
  Package,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  Clock,
  Truck,
  Eye,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { getDashboardStats, getRecentOrders } from "@/actions/admin";
import { ORDER_STATUS } from "@/lib/constants";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";

dayjs.extend(relativeTime);
dayjs.locale("ko");

type RecentOrder = Awaited<ReturnType<typeof getRecentOrders>>[number];

export default async function AdminDashboard() {
  const [stats, recentOrders] = await Promise.all([
    getDashboardStats(),
    getRecentOrders(8),
  ]);

  const statCards = [
    {
      label: "오늘 매출",
      value: formatPrice(stats.todayRevenue),
      sub: `오늘 ${stats.todayOrderCount}건`,
      icon: DollarSign,
      color: "bg-blue-500",
    },
    {
      label: "총 매출",
      value: formatPrice(stats.totalRevenue),
      sub: `총 ${stats.totalOrders}건`,
      icon: TrendingUp,
      color: "bg-green-500",
    },
    {
      label: "등록 상품",
      value: `${stats.totalProducts}개`,
      sub: `판매중 ${stats.activeProducts}개`,
      icon: Package,
      color: "bg-purple-500",
    },
    {
      label: "처리대기",
      value: `${stats.pendingOrders}건`,
      sub: `배송중 ${stats.shippingOrders}건`,
      icon: Clock,
      color: "bg-amber-500",
    },
  ];

  const quickStats = [
    { label: "처리대기", value: stats.pendingOrders, icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50" },
    { label: "배송중", value: stats.shippingOrders, icon: Truck, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold text-foreground mb-6">대시보드</h2>

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl bg-white border border-border p-4 sm:p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs sm:text-sm text-muted-foreground">{stat.label}</span>
              <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg ${stat.color} flex items-center justify-center`}>
                <stat.icon size={16} className="text-white" />
              </div>
            </div>
            <p className="text-lg sm:text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-[11px] sm:text-xs text-muted-foreground mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* 빠른 상태 + 최근 주문 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* 빠른 상태 */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="font-semibold text-foreground text-sm">주문 현황</h3>
          {quickStats.map((qs) => (
            <div
              key={qs.label}
              className={`rounded-xl ${qs.bg} border border-border p-4 flex items-center gap-3`}
            >
              <qs.icon size={20} className={qs.color} />
              <div>
                <p className="text-xs text-muted-foreground">{qs.label}</p>
                <p className={`text-xl font-bold ${qs.color}`}>{qs.value}건</p>
              </div>
            </div>
          ))}
          <div className="space-y-2 pt-2">
            <Link
              href="/admin/orders"
              className="block w-full text-center py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              주문 관리
            </Link>
            <Link
              href="/admin/products"
              className="block w-full text-center py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
            >
              상품 관리
            </Link>
          </div>
        </div>

        {/* 최근 주문 */}
        <div className="lg:col-span-3 rounded-xl bg-white border border-border p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground text-sm">최근 주문</h3>
            <Link
              href="/admin/orders"
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              전체보기 <Eye size={12} />
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              아직 주문이 없습니다.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-2 font-medium text-muted-foreground text-xs">주문번호</th>
                    <th className="pb-2 font-medium text-muted-foreground text-xs">고객</th>
                    <th className="pb-2 font-medium text-muted-foreground text-xs hidden sm:table-cell">상품</th>
                    <th className="pb-2 font-medium text-muted-foreground text-xs text-right">금액</th>
                    <th className="pb-2 font-medium text-muted-foreground text-xs text-center">상태</th>
                    <th className="pb-2 font-medium text-muted-foreground text-xs text-right hidden sm:table-cell">시간</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order: RecentOrder) => {
                    const status = ORDER_STATUS[order.status as keyof typeof ORDER_STATUS] || {
                      label: order.status,
                      color: "",
                    };
                    return (
                      <tr
                        key={order.id}
                        className="border-b border-border/50 last:border-0"
                      >
                        <td className="py-2.5 font-medium text-xs">{order.orderNumber}</td>
                        <td className="py-2.5 text-xs">{order.recipientName}</td>
                        <td className="py-2.5 text-xs text-muted-foreground hidden sm:table-cell">
                          {order.items[0]?.product?.name?.slice(0, 15)}
                          {order.items.length > 1 && ` 외 ${order.items.length - 1}건`}
                        </td>
                        <td className="py-2.5 text-xs text-right font-medium">
                          {formatPrice(order.totalAmount)}
                        </td>
                        <td className="py-2.5 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${status.color}`}
                          >
                            {status.label}
                          </span>
                        </td>
                        <td className="py-2.5 text-xs text-right text-muted-foreground hidden sm:table-cell">
                          {dayjs(order.createdAt).fromNow()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
