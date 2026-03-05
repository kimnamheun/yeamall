import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCategories } from "@/actions/products";
import ProductForm from "../../product-form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    getCategories(),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h2 className="text-xl font-bold text-foreground mb-6">상품 수정</h2>
      <ProductForm categories={categories} product={product} />
    </div>
  );
}
