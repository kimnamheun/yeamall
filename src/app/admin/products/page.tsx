import Link from "next/link";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { sampleProducts } from "@/lib/sample-data";
import { formatPrice } from "@/lib/utils";

export default function AdminProductsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">상품 관리</h2>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 h-10 px-4 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus size={16} />
          상품 등록
        </Link>
      </div>

      {/* 검색/필터 */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="상품명 검색..."
            className="w-full h-10 pl-9 pr-4 rounded-lg border border-border focus:border-primary outline-none text-sm"
          />
        </div>
        <select className="h-10 px-3 rounded-lg border border-border text-sm focus:border-primary outline-none">
          <option value="">전체 카테고리</option>
          <option value="meolchi">멸치</option>
          <option value="ojingeo">오징어</option>
          <option value="myeongtae">명태/황태</option>
          <option value="saewoo">새우</option>
          <option value="seaweed">김/미역/다시마</option>
          <option value="nuts">견과류</option>
          <option value="gift-set">선물세트</option>
        </select>
      </div>

      {/* 상품 테이블 */}
      <div className="rounded-xl bg-white border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">상품명</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">카테고리</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">가격</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">할인가</th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground">재고</th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground">상태</th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground">관리</th>
              </tr>
            </thead>
            <tbody>
              {sampleProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-border/50 last:border-0 hover:bg-muted/30"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-muted flex-shrink-0" />
                      <span className="font-medium line-clamp-1">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {product.category?.name}
                  </td>
                  <td className="px-4 py-3 text-right">{formatPrice(product.price)}</td>
                  <td className="px-4 py-3 text-right text-primary">
                    {product.salePrice ? formatPrice(product.salePrice) : "-"}
                  </td>
                  <td className="px-4 py-3 text-center">{product.stock}</td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        product.isSoldOut
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {product.isSoldOut ? "품절" : "판매중"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button className="p-1.5 rounded hover:bg-muted transition-colors">
                        <Edit size={14} className="text-muted-foreground" />
                      </button>
                      <button className="p-1.5 rounded hover:bg-red-50 transition-colors">
                        <Trash2 size={14} className="text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
