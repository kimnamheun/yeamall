import Link from "next/link";
import { Plus } from "lucide-react";
import { getAdminProducts } from "@/actions/admin";
import { getCategories } from "@/actions/products";
import { formatPrice } from "@/lib/utils";
import AdminProductActions from "./product-actions";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    getAdminProducts(),
    getCategories(),
  ]);

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
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-border/50 last:border-0 hover:bg-muted/30"
                >
                  <td className="px-4 py-3">
                    <span className="font-medium line-clamp-1">{product.name}</span>
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
                    <AdminProductActions productId={product.id} productName={product.name} />
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                    등록된 상품이 없습니다.
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
