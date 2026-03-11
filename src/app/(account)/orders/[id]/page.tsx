import Link from "next/link";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { ORDER_STATUS, getCarrierByCode } from "@/lib/constants";
import TrackingButton from "./tracking-button";
import { getUser } from "@/actions/auth";
import { getOrderDetail } from "@/actions/order";
import dayjs from "dayjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "주문 상세",
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function OrderDetailPage({ params }: Props) {
  const user = await getUser();
  if (!user) redirect("/login?redirect=/orders");

  const { id } = await params;
  const order = await getOrderDetail(id);
  if (!order) notFound();

  const statusInfo = ORDER_STATUS[order.status as keyof typeof ORDER_STATUS];
  const itemsTotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      {/* 브레드크럼 */}
      <div className="flex items-center gap-2 text-sm mb-6">
        <Link href="/mypage" className="text-muted-foreground hover:text-foreground">마이페이지</Link>
        <ChevronRight size={14} className="text-muted-foreground" />
        <Link href="/orders" className="text-muted-foreground hover:text-foreground">주문 내역</Link>
        <ChevronRight size={14} className="text-muted-foreground" />
        <span className="text-foreground font-medium">주문 상세</span>
      </div>

      {/* 주문 헤더 */}
      <div className="rounded-xl bg-white border border-border p-6 mb-4">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-lg font-bold text-foreground">{order.orderNumber}</h1>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo?.color || "bg-gray-100 text-gray-800"}`}>
            {statusInfo?.label || order.status}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          주문일시: {dayjs(order.createdAt).format("YYYY년 MM월 DD일 HH:mm")}
        </p>
      </div>

      {/* 주문 상품 */}
      <div className="rounded-xl bg-white border border-border overflow-hidden mb-4">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-semibold text-foreground">주문 상품</h2>
        </div>
        <div className="divide-y divide-border">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4 px-6">
              {item.product.thumbnailUrl ? (
                <Link href={`/products/${item.product.slug}`}>
                  <Image
                    src={item.product.thumbnailUrl}
                    alt={item.name}
                    width={64}
                    height={64}
                    className="rounded-lg object-cover w-16 h-16 bg-muted"
                  />
                </Link>
              ) : (
                <div className="w-16 h-16 rounded-lg bg-muted" />
              )}
              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.product.slug}`} className="text-sm font-medium text-foreground hover:text-primary truncate block">
                  {item.name}
                </Link>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatPrice(item.price)} × {item.quantity}개
                </p>
              </div>
              <p className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* 배송 정보 */}
        <div className="rounded-xl bg-white border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-semibold text-foreground">배송 정보</h2>
          </div>
          <div className="p-6 space-y-3 text-sm">
            <div className="flex">
              <span className="w-20 text-muted-foreground shrink-0">수령인</span>
              <span className="text-foreground">{order.recipientName}</span>
            </div>
            <div className="flex">
              <span className="w-20 text-muted-foreground shrink-0">연락처</span>
              <span className="text-foreground">{order.recipientPhone}</span>
            </div>
            <div className="flex">
              <span className="w-20 text-muted-foreground shrink-0">주소</span>
              <span className="text-foreground">
                [{order.zipCode}] {order.address}
                {order.addressDetail && ` ${order.addressDetail}`}
              </span>
            </div>
            {order.deliveryMemo && (
              <div className="flex">
                <span className="w-20 text-muted-foreground shrink-0">배송메모</span>
                <span className="text-foreground">{order.deliveryMemo}</span>
              </div>
            )}
            {/* 배송 추적 정보 */}
            {(order.status === "SHIPPING" || order.status === "DELIVERED") &&
              order.trackingNumber && (
                <div className="mt-4 pt-4 border-t border-border space-y-3">
                  <div className="flex">
                    <span className="w-20 text-muted-foreground shrink-0">
                      택배사
                    </span>
                    <span className="text-foreground">
                      {getCarrierByCode(order.carrierCode ?? "")?.name ??
                        order.carrierCode}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-20 text-muted-foreground shrink-0">
                      송장번호
                    </span>
                    <span className="text-foreground font-mono">
                      {order.trackingNumber}
                    </span>
                  </div>
                  {order.shippedAt && (
                    <div className="flex">
                      <span className="w-20 text-muted-foreground shrink-0">
                        발송일시
                      </span>
                      <span className="text-foreground">
                        {dayjs(order.shippedAt).format(
                          "YYYY년 MM월 DD일 HH:mm"
                        )}
                      </span>
                    </div>
                  )}
                  <TrackingButton
                    carrierCode={order.carrierCode!}
                    trackingNumber={order.trackingNumber}
                  />
                </div>
              )}
          </div>
        </div>

        {/* 결제 정보 */}
        <div className="rounded-xl bg-white border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-semibold text-foreground">결제 정보</h2>
          </div>
          <div className="p-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">결제방법</span>
              <span className="text-foreground">{order.paymentMethod || "-"}</span>
            </div>
            {order.paidAt && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">결제일시</span>
                <span className="text-foreground">{dayjs(order.paidAt).format("YYYY.MM.DD HH:mm")}</span>
              </div>
            )}
            <div className="border-t border-border my-2" />
            <div className="flex justify-between">
              <span className="text-muted-foreground">상품금액</span>
              <span className="text-foreground">{formatPrice(itemsTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">배송비</span>
              <span className="text-foreground">{order.shippingFee === 0 ? "무료" : formatPrice(order.shippingFee)}</span>
            </div>
            <div className="border-t border-border my-2" />
            <div className="flex justify-between font-semibold">
              <span className="text-foreground">총 결제금액</span>
              <span className="text-primary text-base">{formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-6">
        <Link href="/orders" className="text-sm text-muted-foreground hover:text-foreground">
          ← 주문 목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
