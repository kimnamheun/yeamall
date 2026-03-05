import Link from "next/link";
import { ChevronRight, Package } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { ORDER_STATUS_LABELS } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "주문 내역",
};

// TODO: Supabase 연동 후 실제 주문 데이터
const sampleOrders = [
  {
    id: "ord-1",
    orderNumber: "YEA-20260305-0001",
    status: "DELIVERED",
    totalAmount: 67800,
    shippingFee: 0,
    items: [
      { name: "프리미엄 국내산 볶음멸치 500g", quantity: 2, price: 19800 },
      { name: "해풍건조 오징어 10마리", quantity: 1, price: 38000 },
    ],
    createdAt: "2026-03-01",
  },
  {
    id: "ord-2",
    orderNumber: "YEA-20260304-0002",
    status: "PREPARING",
    totalAmount: 45000,
    shippingFee: 3000,
    items: [
      { name: "프리미엄 견과류 선물세트", quantity: 1, price: 45000 },
    ],
    createdAt: "2026-03-04",
  },
];

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-blue-100 text-blue-800",
  PREPARING: "bg-indigo-100 text-indigo-800",
  SHIPPING: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-gray-100 text-gray-800",
  RETURN_REQUESTED: "bg-orange-100 text-orange-800",
  RETURNED: "bg-red-100 text-red-800",
};

export default function OrdersPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/mypage" className="text-muted-foreground hover:text-foreground">
          마이페이지
        </Link>
        <ChevronRight size={14} className="text-muted-foreground" />
        <h1 className="text-2xl font-bold text-foreground">주문 내역</h1>
      </div>

      {sampleOrders.length === 0 ? (
        <div className="text-center py-20">
          <Package size={48} className="mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">주문 내역이 없습니다.</p>
          <Link href="/products" className="mt-4 inline-block text-primary hover:underline">
            쇼핑하러 가기
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {sampleOrders.map((order) => (
            <div
              key={order.id}
              className="rounded-xl bg-white border border-border p-6 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-muted-foreground">{order.createdAt}</p>
                  <p className="text-sm font-medium text-foreground">
                    {order.orderNumber}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    statusColors[order.status] || "bg-gray-100 text-gray-800"
                  }`}
                >
                  {ORDER_STATUS_LABELS[order.status]}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.name} x {item.quantity}
                    </span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="text-sm font-semibold">
                  총 {formatPrice(order.totalAmount + order.shippingFee)}
                </span>
                <Link
                  href={`/orders/${order.id}`}
                  className="text-sm text-accent hover:underline flex items-center gap-1"
                >
                  상세보기 <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
