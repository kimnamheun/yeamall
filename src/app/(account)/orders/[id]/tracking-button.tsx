"use client";

import { Truck } from "lucide-react";
import { getGoodsflowTrackingUrl } from "@/lib/constants";

interface Props {
  carrierCode: string;
  trackingNumber: string;
}

export default function TrackingButton({
  carrierCode,
  trackingNumber,
}: Props) {
  const handleClick = () => {
    const url = getGoodsflowTrackingUrl(carrierCode, trackingNumber);
    if (!url) return;
    window.open(
      url,
      "tracking_popup",
      "width=600,height=800,scrollbars=yes,resizable=yes"
    );
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
    >
      <Truck size={16} />
      배송조회
    </button>
  );
}
