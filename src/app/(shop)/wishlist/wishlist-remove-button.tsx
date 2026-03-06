"use client";

import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { removeFromWishlist } from "@/actions/wishlist";

interface Props {
  productId: string;
}

export default function WishlistRemoveButton({ productId }: Props) {
  const router = useRouter();

  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await removeFromWishlist(productId);
    router.refresh();
  };

  return (
    <button
      onClick={handleRemove}
      className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-white transition-colors"
      title="찜 해제"
    >
      <Heart size={16} className="fill-red-500 text-red-500" />
    </button>
  );
}
