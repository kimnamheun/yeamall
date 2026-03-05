import { getAdminOrders } from "@/actions/admin";
import { formatPrice } from "@/lib/utils";
import dayjs from "dayjs";
import OrderStatusSelect from "./order-status-select";

type AdminOrder = Awaited<ReturnType<typeof getAdminOrders>>[number];

const statusLabels: Record<string, { label: string; color: string }> = {
  PENDING: { label: "결제대기", color: "bg-yellow-100 text-yellow-800" },
  PAID: { label: "결제완료", color: "bg-blue-100 text-blue-800" },
  PREPARING: { label: "상품준비", color: "bg-indigo-100 text-indigo-800" },
  SHIPPING: { label: "배송중", color: "bg-purple-100 text-purple-800" },
  DELIVERED: { label: "배송완료", color: "bg-green-100 text-green-800" },
  CANCELLED: { label: "취소", color: "bg-gray-100 text-gray-800" },
  RETURN_REQUESTED: { label: "반품요청", color: "bg-orange-100 text-orange-800" },
  RETURNED: { label: "반품완료", color: "bg-gray-100 text-gray-800" },
};

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();

  return (
    <div>
      <h2 className="text-xl font-bold text-foreground mb-6">주문 관리</h2>

      <div className="rounded-xl bg-white border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">주문번호</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">고객</th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground">상품수</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">금액</th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground">상태</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">주문일시</th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground">상태변경</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order: AdminOrder) => {
                const status = statusLabels[order.status] || { label: order.status, color: "" };
                return (
                  <tr
                    key={order.id}
                    className="border-b border-border/50 last:border-0 hover:bg-muted/30"
                  >
                    <td className="px-4 py-3 font-medium">{order.orderNumber}</td>
                    <td className="px-4 py-3">
                      <div>
                        <p>{order.recipientName}</p>
                        <p className="text-xs text-muted-foreground">{order.recipientPhone}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">{order.items.length}건</td>
                    <td className="px-4 py-3 text-right font-medium">
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {dayjs(order.createdAt).format("YYYY-MM-DD HH:mm")}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                    </td>
                  </tr>
                );
              })}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
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
