import { getCategories } from "@/actions/products";
import ProductForm from "../product-form";

export default async function NewProductPage() {
  const categories = await getCategories();
  return (
    <div>
      <h2 className="text-xl font-bold text-foreground mb-6">상품 등록</h2>
      <ProductForm categories={categories} />
    </div>
  );
}
