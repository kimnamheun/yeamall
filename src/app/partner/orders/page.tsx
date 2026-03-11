import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { ORDER_STATUS, getCarrierByCode } from "@/lib/constants";
import { getPartnerOrders } from "@/actions/partner";
import ShipOrderButton from "./ship-order-button";
import dayjs from "dayjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "주문/배송 관리 | YeAmall Partner",
};

type Props = {
  searchParams: Promise<{ status?: string }>;
};

const STATUS_TABS = [
  { key: "", label: "전체" },
  { key: "PAID", label: "결제완료" },
  { key: "PREPARING", label: "상품준비중" },
  { key: "SHIPPING", label: "배송중" },
  { key: "DELIVERED", label: "배송완료" },
];

export default async function PartnerOrdersPage({ searchParams }: Props) {
  const { status: statusFilter } = await searchParams;
  const orders = await getPartnerOrders(statusFilter);

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-6">
        주문/배송 관리
      </h2>

      {/* 상태 필터 탭 */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {STATUS_TABS.map((tab) => (
          <Link
            key={tab.key}
            href={
              tab.key
                ? `/partner/orders?status=${tab.key}`
                : "/partner/orders"
            }
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              (statusFilter || "") === tab.key
                ? "bg-primary text-white"
                : "bg-white border border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* 주문 테이블 */}
      <div className="rounded-xl bg-white border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs">
                  주문번호
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs hidden md:table-cell">
                  수령인
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs hidden lg:table-cell">
                  상품
                </th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground text-xs hidden sm:table-cell">
                  금액
                </th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground text-xs">
                  상태
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs hidden md:table-cell">
                  송장정보
                </th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground text-xs">
                  발송처리
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-muted-foreground text-sm"
                  >
                    주문이 없습니다.
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const statusInfo =
                    ORDER_STATUS[
                      order.status as keyof typeof ORDER_STATUS
                    ];
                  const firstItem = order.items[0];
                  const carrier = order.carrierCode
                    ? getCarrierByCode(order.carrierCode)
                    : null;

                  return (
                    <tr key={order.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-foreground">
                          {order.orderNumber}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {dayjs(order.createdAt).format("MM/DD HH:mm")}
                        </p>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <p className="text-sm text-foreground">
                          {order.recipientName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {order.recipientPhone}
                        </p>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        {firstItem && (
                          <div className="flex items-center gap-2">
                            {firstItem.product.thumbnailUrl ? (
                              <Image
                                src={firstItem.product.thumbnailUrl}
                                alt={firstItem.name}
                                width={36}
                                height={36}
                                className="rounded object-cover w-9 h-9 bg-muted"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded bg-muted" />
                            )}
                            <div className="min-w-0">
                              <p className="text-xs text-foreground truncate max-w-[160px]">
                                {firstItem.name}
                              </p>
                              {order.items.length > 1 && (
                                <p className="text-[10px] text-muted-foreground">
                                  외 {order.items.length - 1}건
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right hidden sm:table-cell">
                        <span className="text-sm font-medium">
                          {formatPrice(order.totalAmount)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-medium ${
                            statusInfo?.color ||
                            "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {statusInfo?.label || order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        {order.trackingNumber ? (
                          <div>
                            <p className="text-xs text-foreground">
                              {carrier?.name || order.carrierCode}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {order.trackingNumber}
                            </p>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            -
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <ShipOrderButton
                          orderId={order.id}
                          currentStatus={order.status}
                          carrierCode={order.carrierCode}
                          trackingNumber={order.trackingNumber}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
