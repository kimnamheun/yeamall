import { formatPrice } from "@/lib/utils";

const orders = [
  { id: "YEA-20260305-0015", customer: "김철수", phone: "010-1234-****", amount: 89000, status: "PAID", items: 2, date: "2026-03-05 14:30" },
  { id: "YEA-20260305-0014", customer: "이영희", phone: "010-5678-****", amount: 45000, status: "PREPARING", items: 1, date: "2026-03-05 13:15" },
  { id: "YEA-20260305-0013", customer: "박민수", phone: "010-9012-****", amount: 127000, status: "SHIPPING", items: 3, date: "2026-03-05 10:22" },
  { id: "YEA-20260304-0012", customer: "최지은", phone: "010-3456-****", amount: 32000, status: "PENDING", items: 1, date: "2026-03-04 18:45" },
  { id: "YEA-20260304-0011", customer: "정하늘", phone: "010-7890-****", amount: 68000, status: "DELIVERED", items: 2, date: "2026-03-04 09:10" },
];

const statusLabels: Record<string, { label: string; color: string }> = {
  PENDING: { label: "결제대기", color: "bg-yellow-100 text-yellow-800" },
  PAID: { label: "결제완료", color: "bg-blue-100 text-blue-800" },
  PREPARING: { label: "상품준비", color: "bg-indigo-100 text-indigo-800" },
  SHIPPING: { label: "배송중", color: "bg-purple-100 text-purple-800" },
  DELIVERED: { label: "배송완료", color: "bg-green-100 text-green-800" },
  CANCELLED: { label: "취소", color: "bg-gray-100 text-gray-800" },
};

export default function AdminOrdersPage() {
  return (
    <div>
      <h2 className="text-xl font-bold text-foreground mb-6">주문 관리</h2>

      {/* 필터 탭 */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto">
        {["전체", "결제대기", "결제완료", "상품준비", "배송중", "배송완료"].map((tab) => (
          <button
            key={tab}
            className="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap bg-white border border-border hover:border-primary hover:text-primary transition-colors"
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 주문 테이블 */}
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
                <th className="text-center px-4 py-3 font-medium text-muted-foreground">관리</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const status = statusLabels[order.status];
                return (
                  <tr
                    key={order.id}
                    className="border-b border-border/50 last:border-0 hover:bg-muted/30"
                  >
                    <td className="px-4 py-3 font-medium">{order.id}</td>
                    <td className="px-4 py-3">
                      <div>
                        <p>{order.customer}</p>
                        <p className="text-xs text-muted-foreground">{order.phone}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">{order.items}건</td>
                    <td className="px-4 py-3 text-right font-medium">{formatPrice(order.amount)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${status?.color}`}>
                        {status?.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{order.date}</td>
                    <td className="px-4 py-3 text-center">
                      <select className="h-8 px-2 text-xs rounded border border-border focus:border-primary outline-none">
                        <option>상태변경</option>
                        <option>결제완료</option>
                        <option>상품준비</option>
                        <option>배송중</option>
                        <option>배송완료</option>
                        <option>취소</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
