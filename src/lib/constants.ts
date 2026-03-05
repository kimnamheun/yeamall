export const SHIPPING = {
  FREE_THRESHOLD: 70_000,
  BASE_FEE: 3_000,
  JEJU_EXTRA: 3_000,
  ISLAND_EXTRA: 5_000,
} as const;

export const CATEGORIES = [
  { name: "멸치", slug: "meolchi", icon: "🐟" },
  { name: "오징어", slug: "ojingeo", icon: "🦑" },
  { name: "명태/황태", slug: "myeongtae", icon: "🐠" },
  { name: "새우", slug: "saewoo", icon: "🦐" },
  { name: "김/미역/다시마", slug: "seaweed", icon: "🌿" },
  { name: "견과류", slug: "nuts", icon: "🥜" },
  { name: "선물세트", slug: "gift-set", icon: "🎁" },
  { name: "기타 건어물", slug: "others", icon: "🐡" },
] as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: "결제대기",
  PAID: "결제완료",
  PREPARING: "상품준비중",
  SHIPPING: "배송중",
  DELIVERED: "배송완료",
  CANCELLED: "취소",
  RETURN_REQUESTED: "반품요청",
  RETURNED: "반품완료",
};
