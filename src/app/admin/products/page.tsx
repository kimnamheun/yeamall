import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { getAdminProducts } from "@/actions/admin";
import { formatPrice } from "@/lib/utils";
import AdminProductActions from "./product-actions";

type AdminProduct = Awaited<ReturnType<typeof getAdminProducts>>[number];

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  const totalCount = products.length;
  const activeCount = products.filter((p) => !p.isSoldOut).length;
  const soldOutCount = products.filter((p) => p.isSoldOut).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">상품 관리</h2>
          <p className="text-xs text-muted-foreground mt-1">
            전체 {totalCount}개 · 판매중 {activeCount}개 · 품절 {soldOutCount}개
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 h-9 px-4 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
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
                <th className="text-left px-4 py-3 font-medium text-muted-foreground w-12">이미지</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">상품명</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">카테고리</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">가격</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">할인가</th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">재고</th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground">상태</th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground">관리</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product: AdminProduct) => (
                <tr
                  key={product.id}
                  className="border-b border-border/50 last:border-0 hover:bg-muted/30"
                >
                  <td className="px-4 py-2">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-muted border border-border">
                      <Image
                        src={product.thumbnailUrl || "/images/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <span className="font-medium line-clamp-1 text-xs sm:text-sm">{product.name}</span>
                      <span className="text-[11px] text-muted-foreground sm:hidden block mt-0.5">
                        {product.category?.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs hidden sm:table-cell">
                    {product.category?.name}
                  </td>
                  <td className="px-4 py-3 text-right text-xs">{formatPrice(product.price)}</td>
                  <td className="px-4 py-3 text-right text-primary text-xs hidden md:table-cell">
                    {product.salePrice ? formatPrice(product.salePrice) : "-"}
                  </td>
                  <td className="px-4 py-3 text-center text-xs hidden sm:table-cell">
                    <span className={product.stock <= 5 ? "text-red-500 font-semibold" : ""}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        product.isSoldOut
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {product.isSoldOut ? "품절" : "판매중"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <AdminProductActions
                      productId={product.id}
                      productName={product.name}
                      isSoldOut={product.isSoldOut}
                    />
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
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
