"use client";

import Link from "next/link";
import { Edit, Trash2, Ban, CheckCircle } from "lucide-react";
import { deleteProduct, toggleProductSoldOut } from "@/actions/admin";
import { useRouter } from "next/navigation";

interface Props {
  productId: string;
  productName: string;
  isSoldOut: boolean;
}

export default function AdminProductActions({ productId, productName, isSoldOut }: Props) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`"${productName}" 상품을 삭제하시겠습니까?`)) return;
    await deleteProduct(productId);
    router.refresh();
  };

  const handleToggleSoldOut = async () => {
    await toggleProductSoldOut(productId, !isSoldOut);
    router.refresh();
  };

  return (
    <div className="flex items-center justify-center gap-0.5">
      <button
        onClick={handleToggleSoldOut}
        className="p-1.5 rounded hover:bg-muted transition-colors"
        title={isSoldOut ? "판매재개" : "품절처리"}
      >
        {isSoldOut ? (
          <CheckCircle size={14} className="text-green-500" />
        ) : (
          <Ban size={14} className="text-orange-400" />
        )}
      </button>
      <Link
        href={`/admin/products/${productId}/edit`}
        className="p-1.5 rounded hover:bg-muted transition-colors"
        title="수정"
      >
        <Edit size={14} className="text-muted-foreground" />
      </Link>
      <button
        onClick={handleDelete}
        className="p-1.5 rounded hover:bg-red-50 transition-colors"
        title="삭제"
      >
        <Trash2 size={14} className="text-red-400" />
      </button>
    </div>
  );
}
