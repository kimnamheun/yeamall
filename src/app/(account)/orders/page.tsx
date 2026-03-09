import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { ChevronRight, Package } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { ORDER_STATUS } from "@/lib/constants";
import { getUser } from "@/actions/auth";
import { getMyOrders } from "@/actions/order";
import dayjs from "dayjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "주문 내역",
};

export default async function OrdersPage() {
  const user = await getUser();
  if (!user) redirect("/login?redirect=/orders");

  const orders = await getMyOrders();

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/mypage" className="text-muted-foreground hover:text-foreground">
          마이페이지
        </Link>
        <ChevronRight size={14} className="text-muted-foreground" />
        <h1 className="text-2xl font-bold text-foreground">주문 내역</h1>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <Package size={48} className="mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">주문 내역이 없습니다.</p>
          <Link href="/products" className="mt-4 inline-block text-primary hover:underline">
            쇼핑하러 가기
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusInfo = ORDER_STATUS[order.status as keyof typeof ORDER_STATUS];
            return (
              <div
                key={order.id}
                className="rounded-xl bg-white border border-border p-6 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground">{dayjs(order.createdAt).format("YYYY.MM.DD")}</p>
                    <p className="text-sm font-medium text-foreground">{order.orderNumber}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo?.color || "bg-gray-100 text-gray-800"}`}>
                    {statusInfo?.label || order.status}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      {item.product.thumbnailUrl && (
                        <Image
                          src={item.product.thumbnailUrl}
                          alt={item.name}
                          width={48}
                          height={48}
                          className="rounded-lg object-cover w-12 h-12 bg-muted"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.quantity}개 · {formatPrice(item.price)}</p>
                      </div>
                      <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-sm font-semibold">
                    총 {formatPrice(order.totalAmount)}
                  </span>
                  <Link
                    href={`/orders/${order.id}`}
                    className="text-sm text-accent hover:underline flex items-center gap-1"
                  >
                    상세보기 <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
