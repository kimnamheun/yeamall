import {
  getSalesByPeriod,
  getTopProducts,
  getSalesByCategory,
  getOrderStatusDistribution,
  getRecentMembers,
} from "@/actions/admin";
import { formatPrice } from "@/lib/utils";
import { ORDER_STATUS } from "@/lib/constants";
import dayjs from "dayjs";

export default async function AdminStatsPage() {
  const [dailySales, topProducts, categorySales, statusDist, recentMembers] =
    await Promise.all([
      getSalesByPeriod(30),
      getTopProducts(10),
      getSalesByCategory(),
      getOrderStatusDistribution(),
      getRecentMembers(10),
    ]);

  const totalRevenue = dailySales.reduce((s, d) => s + d.amount, 0);
  const totalOrders = dailySales.reduce((s, d) => s + d.count, 0);
  const avgDaily = dailySales.length > 0 ? Math.round(totalRevenue / dailySales.length) : 0;
  const maxCategoryRevenue = categorySales.length > 0 ? categorySales[0].revenue : 1;
  const totalCategoryRevenue = categorySales.reduce((s, c) => s + c.revenue, 0);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground">통계</h2>
        <p className="text-xs text-muted-foreground mt-1">최근 30일 기준 데이터</p>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-background rounded-xl border border-border p-5">
          <p className="text-xs text-muted-foreground mb-1">30일 총 매출</p>
          <p className="text-2xl font-bold text-foreground">{formatPrice(totalRevenue)}</p>
        </div>
        <div className="bg-background rounded-xl border border-border p-5">
          <p className="text-xs text-muted-foreground mb-1">30일 총 주문</p>
          <p className="text-2xl font-bold text-foreground">{totalOrders}건</p>
        </div>
        <div className="bg-background rounded-xl border border-border p-5">
          <p className="text-xs text-muted-foreground mb-1">일평균 매출</p>
          <p className="text-2xl font-bold text-foreground">{formatPrice(avgDaily)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* 베스트셀러 TOP 10 */}
        <div className="bg-background rounded-xl border border-border overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="text-sm font-bold text-foreground">베스트셀러 TOP 10</h3>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-muted/50 border-b border-border text-muted-foreground">
                <th className="px-3 py-2 text-center font-medium w-10">#</th>
                <th className="px-3 py-2 text-left font-medium">상품명</th>
                <th className="px-3 py-2 text-right font-medium">판매수</th>
                <th className="px-3 py-2 text-right font-medium">매출액</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {topProducts.map((item, i) => (
                <tr key={i} className="hover:bg-muted/30">
                  <td className="px-3 py-2 text-center font-bold text-muted-foreground">{i + 1}</td>
                  <td className="px-3 py-2 text-foreground truncate max-w-[180px]">{item.name}</td>
                  <td className="px-3 py-2 text-right">{item.totalQuantity}개</td>
                  <td className="px-3 py-2 text-right font-medium">{formatPrice(item.totalRevenue)}</td>
                </tr>
              ))}
              {topProducts.length === 0 && (
                <tr><td colSpan={4} className="px-3 py-6 text-center text-muted-foreground">데이터가 없습니다.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 카테고리별 매출 */}
        <div className="bg-background rounded-xl border border-border overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="text-sm font-bold text-foreground">카테고리별 매출</h3>
          </div>
          <div className="p-4 space-y-3">
            {categorySales.map((cat) => {
              const pct = totalCategoryRevenue > 0 ? Math.round((cat.revenue / totalCategoryRevenue) * 100) : 0;
              return (
                <div key={cat.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-foreground">{cat.name}</span>
                    <span className="text-xs text-muted-foreground">{formatPrice(cat.revenue)} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${maxCategoryRevenue > 0 ? (cat.revenue / maxCategoryRevenue) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {categorySales.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-4">데이터가 없습니다.</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* 주문 상태별 분포 */}
        <div className="bg-background rounded-xl border border-border overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="text-sm font-bold text-foreground">주문 상태별 분포</h3>
          </div>
          <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {statusDist.map((s) => {
              const info = ORDER_STATUS[s.status as keyof typeof ORDER_STATUS];
              return (
                <div key={s.status} className="text-center p-3 rounded-lg bg-muted/50">
                  <p className="text-lg font-bold text-foreground">{s.count}</p>
                  <p className={`text-[10px] font-medium mt-1 inline-block px-2 py-0.5 rounded-full ${info?.color || "bg-gray-100 text-gray-600"}`}>
                    {info?.label || s.status}
                  </p>
                </div>
              );
            })}
            {statusDist.length === 0 && (
              <p className="col-span-4 text-xs text-muted-foreground text-center py-4">데이터가 없습니다.</p>
            )}
          </div>
        </div>

        {/* 최근 가입 회원 */}
        <div className="bg-background rounded-xl border border-border overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="text-sm font-bold text-foreground">최근 가입 회원</h3>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-muted/50 border-b border-border text-muted-foreground">
                <th className="px-3 py-2 text-left font-medium">이름</th>
                <th className="px-3 py-2 text-left font-medium">이메일</th>
                <th className="px-3 py-2 text-left font-medium">가입일</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentMembers.map((m) => (
                <tr key={m.id} className="hover:bg-muted/30">
                  <td className="px-3 py-2 font-medium text-foreground">{m.name || "-"}</td>
                  <td className="px-3 py-2 text-muted-foreground">{m.email}</td>
                  <td className="px-3 py-2 text-muted-foreground">{dayjs(m.createdAt).format("YYYY.MM.DD")}</td>
                </tr>
              ))}
              {recentMembers.length === 0 && (
                <tr><td colSpan={3} className="px-3 py-6 text-center text-muted-foreground">데이터가 없습니다.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 일별 매출 상세 */}
      <div className="bg-background rounded-xl border border-border overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-sm font-bold text-foreground">일별 매출 현황 (최근 30일)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-muted/50 border-b border-border text-muted-foreground">
                <th className="px-3 py-2 text-left font-medium">날짜</th>
                <th className="px-3 py-2 text-right font-medium">주문수</th>
                <th className="px-3 py-2 text-right font-medium">매출액</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[...dailySales].reverse().map((day) => (
                <tr key={day.date} className="hover:bg-muted/30">
                  <td className="px-3 py-2 text-foreground">{day.date}</td>
                  <td className="px-3 py-2 text-right">{day.count}건</td>
                  <td className="px-3 py-2 text-right font-medium">{formatPrice(day.amount)}</td>
                </tr>
              ))}
              {dailySales.length === 0 && (
                <tr><td colSpan={3} className="px-3 py-6 text-center text-muted-foreground">데이터가 없습니다.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
