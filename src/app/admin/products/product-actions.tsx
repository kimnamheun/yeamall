"use client";

import Link from "next/link";
import { Edit, Trash2 } from "lucide-react";
import { deleteProduct } from "@/actions/admin";
import { useRouter } from "next/navigation";

interface Props {
  productId: string;
  productName: string;
}

export default function AdminProductActions({ productId, productName }: Props) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`"${productName}" 상품을 삭제하시겠습니까?`)) return;
    await deleteProduct(productId);
    router.refresh();
  };

  return (
    <div className="flex items-center justify-center gap-1">
      <Link
        href={`/admin/products/${productId}/edit`}
        className="p-1.5 rounded hover:bg-muted transition-colors"
      >
        <Edit size={14} className="text-muted-foreground" />
      </Link>
      <button
        onClick={handleDelete}
        className="p-1.5 rounded hover:bg-red-50 transition-colors"
      >
        <Trash2 size={14} className="text-red-400" />
      </button>
    </div>
  );
}
