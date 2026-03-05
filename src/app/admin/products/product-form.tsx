"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createProduct, updateProduct } from "@/actions/admin";
import type { Category } from "@/types/product";

interface Props {
  categories: Category[];
  product?: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    salePrice: number | null;
    categoryId: string;
    stock: number;
    weight: string | null;
    origin: string | null;
    unit: string | null;
    isNew: boolean;
    isRecommended: boolean;
    isSoldOut: boolean;
    shippingInfo: string | null;
  };
}

export default function ProductForm({ categories, product }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isEdit = !!product;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    try {
      if (isEdit) {
        await updateProduct(product.id, formData);
      } else {
        await createProduct(formData);
      }
      router.push("/admin/products");
      router.refresh();
    } catch {
      setError("저장 중 오류가 발생했습니다.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>
      )}

      <div className="space-y-6">
        <div className="rounded-xl bg-white border border-border p-6 space-y-4">
          <h3 className="font-semibold text-foreground">기본 정보</h3>

          <div>
            <label className="block text-sm font-medium mb-1">상품명 *</label>
            <input
              name="name"
              required
              defaultValue={product?.name}
              className="w-full h-11 px-3 rounded-lg border border-border focus:border-primary outline-none text-sm"
              placeholder="프리미엄 국내산 볶음멸치 500g"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">카테고리 *</label>
            <select
              name="categoryId"
              required
              defaultValue={product?.categoryId}
              className="w-full h-11 px-3 rounded-lg border border-border focus:border-primary outline-none text-sm"
            >
              <option value="">카테고리 선택</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">상품 설명</label>
            <textarea
              name="description"
              rows={3}
              defaultValue={product?.description || ""}
              className="w-full px-3 py-2 rounded-lg border border-border focus:border-primary outline-none text-sm resize-none"
              placeholder="상품에 대한 상세 설명을 입력하세요"
            />
          </div>
        </div>

        <div className="rounded-xl bg-white border border-border p-6 space-y-4">
          <h3 className="font-semibold text-foreground">가격/재고</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">정가 (원) *</label>
              <input
                name="price"
                type="number"
                required
                defaultValue={product?.price}
                className="w-full h-11 px-3 rounded-lg border border-border focus:border-primary outline-none text-sm"
                placeholder="25000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">할인가 (원)</label>
              <input
                name="salePrice"
                type="number"
                defaultValue={product?.salePrice || ""}
                className="w-full h-11 px-3 rounded-lg border border-border focus:border-primary outline-none text-sm"
                placeholder="19800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">재고 *</label>
              <input
                name="stock"
                type="number"
                required
                defaultValue={product?.stock ?? 0}
                className="w-full h-11 px-3 rounded-lg border border-border focus:border-primary outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">단위</label>
              <input
                name="unit"
                defaultValue={product?.unit || ""}
                className="w-full h-11 px-3 rounded-lg border border-border focus:border-primary outline-none text-sm"
                placeholder="1팩"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white border border-border p-6 space-y-4">
          <h3 className="font-semibold text-foreground">상세 정보</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">중량</label>
              <input
                name="weight"
                defaultValue={product?.weight || ""}
                className="w-full h-11 px-3 rounded-lg border border-border focus:border-primary outline-none text-sm"
                placeholder="500g"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">원산지</label>
              <input
                name="origin"
                defaultValue={product?.origin || ""}
                className="w-full h-11 px-3 rounded-lg border border-border focus:border-primary outline-none text-sm"
                placeholder="국내산 (남해)"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">배송비 안내</label>
            <input
              name="shippingInfo"
              defaultValue={product?.shippingInfo || "7만원 이상 무료배송"}
              className="w-full h-11 px-3 rounded-lg border border-border focus:border-primary outline-none text-sm"
            />
          </div>

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="isNew" defaultChecked={product?.isNew} className="rounded" />
              <span className="text-sm">신상품</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="isRecommended" defaultChecked={product?.isRecommended} className="rounded" />
              <span className="text-sm">추천상품</span>
            </label>
            {isEdit && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="isSoldOut" defaultChecked={product?.isSoldOut} className="rounded" />
                <span className="text-sm">품절</span>
              </label>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-6">
        <button
          type="submit"
          disabled={loading}
          className="h-11 px-8 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {loading ? "저장 중..." : isEdit ? "수정하기" : "등록하기"}
        </button>
        <Link
          href="/admin/products"
          className="h-11 px-8 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors flex items-center"
        >
          취소
        </Link>
      </div>
    </form>
  );
}
