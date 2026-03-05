"use client";

import { useRouter } from "next/navigation";
import { updateOrderStatus } from "@/actions/admin";

interface Props {
  orderId: string;
  currentStatus: string;
}

export default function OrderStatusSelect({ orderId, currentStatus }: Props) {
  const router = useRouter();

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    if (!newStatus || newStatus === currentStatus) return;
    await updateOrderStatus(orderId, newStatus);
    router.refresh();
  };

  return (
    <select
      defaultValue=""
      onChange={handleChange}
      className="h-8 px-2 text-xs rounded border border-border focus:border-primary outline-none"
    >
      <option value="">상태변경</option>
      <option value="PAID">결제완료</option>
      <option value="PREPARING">상품준비</option>
      <option value="SHIPPING">배송중</option>
      <option value="DELIVERED">배송완료</option>
      <option value="CANCELLED">취소</option>
    </select>
  );
}
