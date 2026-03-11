"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Send, Pencil, X, Check } from "lucide-react";
import { CARRIERS, getCarrierByCode } from "@/lib/constants";
import { shipOrder, updateTracking } from "@/actions/partner";

interface Props {
  orderId: string;
  currentStatus: string;
  carrierCode: string | null;
  trackingNumber: string | null;
}

export default function ShipOrderButton({
  orderId,
  currentStatus,
  carrierCode,
  trackingNumber,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCarrier, setSelectedCarrier] = useState(carrierCode || "cj");
  const [inputTracking, setInputTracking] = useState(trackingNumber || "");
  const [error, setError] = useState("");

  const isShippable = ["PAID", "PREPARING"].includes(currentStatus);
  const isShipped = currentStatus === "SHIPPING";
  const isDelivered = currentStatus === "DELIVERED";

  const handleSubmit = () => {
    setError("");
    startTransition(async () => {
      const result = isShippable
        ? await shipOrder(orderId, selectedCarrier, inputTracking)
        : await updateTracking(orderId, selectedCarrier, inputTracking);

      if ("error" in result && result.error) {
        setError(result.error);
      } else {
        setIsOpen(false);
        router.refresh();
      }
    });
  };

  // 배송완료 상태: 송장 정보만 표시
  if (isDelivered) {
    const carrier = getCarrierByCode(carrierCode || "");
    return (
      <span className="text-xs text-muted-foreground">
        {carrier?.name} {trackingNumber}
      </span>
    );
  }

  // 인라인 폼 열림
  if (isOpen) {
    return (
      <div className="flex flex-col gap-2 min-w-[200px]">
        <select
          value={selectedCarrier}
          onChange={(e) => setSelectedCarrier(e.target.value)}
          className="w-full px-2 py-1.5 text-xs border border-border rounded-md bg-white"
          disabled={isPending}
        >
          {CARRIERS.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={inputTracking}
          onChange={(e) => setInputTracking(e.target.value)}
          placeholder="송장번호 입력"
          className="w-full px-2 py-1.5 text-xs border border-border rounded-md"
          disabled={isPending}
        />
        {error && <p className="text-[10px] text-red-500">{error}</p>}
        <div className="flex gap-1">
          <button
            onClick={handleSubmit}
            disabled={isPending || !inputTracking.trim()}
            className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-medium text-white bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            <Check size={12} />
            {isPending ? "처리중..." : isShippable ? "발송처리" : "수정"}
          </button>
          <button
            onClick={() => {
              setIsOpen(false);
              setError("");
            }}
            className="px-2 py-1.5 text-xs text-muted-foreground border border-border rounded-md hover:bg-muted transition-colors"
            disabled={isPending}
          >
            <X size={12} />
          </button>
        </div>
      </div>
    );
  }

  // 발송 가능 상태: 버튼 표시
  if (isShippable) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-primary rounded-md hover:bg-primary/90 transition-colors"
      >
        <Send size={12} />
        발송처리
      </button>
    );
  }

  // 배송중: 수정 버튼
  if (isShipped) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-muted-foreground border border-border rounded-md hover:bg-muted transition-colors"
      >
        <Pencil size={12} />
        수정
      </button>
    );
  }

  return null;
}
