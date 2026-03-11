import Link from "next/link";
import { getAdminOrders } from "@/actions/admin";
import { formatPrice } from "@/lib/utils";
import { ORDER_STATUS, getCarrierByCode } from "@/lib/constants";
import dayjs from "dayjs";
import OrderStatusSelect from "./order-status-select";

type AdminOrder = Awaited<ReturnType<typeof getAdminOrders>>[number];

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();

  const statusCounts = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-bold text-foreground">주문 관리</h2>
        <p className="text-xs text-muted-foreground mt-1">
          총 {orders.length}건
        </p>
      </div>

      {/* 상태별 카운트 */}
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.entries(ORDER_STATUS).map(([key, val]) => {
          const count = statusCounts[key] || 0;
          if (count === 0) return null;
          return (
            <span
              key={key}
              className={`px-2.5 py-1 rounded-full text-xs font-medium ${val.color}`}
            >
              {val.label} {count}
            </span>
          );
        })}
      </div>

      <div className="rounded-xl bg-white border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs">주문번호</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs">고객</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs hidden md:table-cell">상품</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground text-xs">금액</th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground text-xs">상태</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs hidden lg:table-cell">송장번호</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs hidden sm:table-cell">일시</th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground text-xs">변경</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order: AdminOrder) => {
                const status = ORDER_STATUS[order.status as keyof typeof ORDER_STATUS] || {
                  label: order.status,
                  color: "",
                };
                return (
                  <tr
                    key={order.id}
                    className="border-b border-border/50 last:border-0 hover:bg-muted/30"
                  >
                    <td className="px-4 py-3">
                      <span className="font-medium text-xs">{order.orderNumber}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-xs font-medium">{order.recipientName}</p>
                        <p className="text-[11px] text-muted-foreground">{order.recipientPhone}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {order.items[0]?.product?.name}
                        {order.items.length > 1 && ` 외 ${order.items.length - 1}건`}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-xs font-medium">{formatPrice(order.totalAmount)}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground hidden lg:table-cell">
                      {order.trackingNumber ? (
                        <span>
                          {getCarrierByCode(order.carrierCode ?? "")?.name}{" "}
                          {order.trackingNumber}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs hidden sm:table-cell">
                      {dayjs(order.createdAt).format("MM/DD HH:mm")}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                    </td>
                  </tr>
                );
              })}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                    주문이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
