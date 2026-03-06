import { getAdminCategories } from "@/actions/admin";
import CategoryManageClient from "./category-manage-client";

type AdminCategory = Awaited<ReturnType<typeof getAdminCategories>>[number];

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();

  const activeCount = categories.filter((c) => c.isActive).length;
  const totalProducts = categories.reduce((sum, c) => sum + c._count.products, 0);

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-bold text-foreground">카테고리 관리</h2>
        <p className="text-xs text-muted-foreground mt-1">
          총 {categories.length}개 · 활성 {activeCount}개 · 등록상품 {totalProducts}개
        </p>
      </div>

      <CategoryManageClient categories={categories as AdminCategory[]} />
    </div>
  );
}
