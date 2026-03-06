// ==============================
// 사이트 설정 (한 곳에서 관리)
// ==============================
export const SITE = {
  name: "YeAmall",
  title: "YeAmall - 건어물 전문 쇼핑몰",
  description: "신선한 건어물, 멸치, 오징어, 해산물을 합리적인 가격에 만나보세요. 7만원 이상 무료배송!",
  keywords: ["건어물", "멸치", "오징어", "해산물", "건어물 쇼핑몰", "YeAmall"],
  company: {
    name: "YeAmall",
    ceo: "홍길동",
    bizNo: "123-45-67890",
    salesNo: "제2024-서울강남-0001호",
    address: "서울특별시 강남구 테헤란로 123",
    phone: "02-1234-5678",
    email: "info@yeamall.co.kr",
  },
  cs: {
    phone: "02-1234-5678",
    hours: "평일 09:00 ~ 18:00",
    lunch: "점심시간 12:00 ~ 13:00",
    holiday: "토/일/공휴일 휴무",
  },
} as const;

// ==============================
// 배송
// ==============================
export const SHIPPING = {
  FREE_THRESHOLD: 70_000,
  BASE_FEE: 3_000,
  JEJU_EXTRA: 3_000,
  ISLAND_EXTRA: 5_000,
} as const;

// ==============================
// 카테고리
// ==============================
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

// ==============================
// 주문 상태
// ==============================
export const ORDER_STATUS = {
  PENDING: { label: "결제대기", color: "bg-yellow-100 text-yellow-800", icon: "⏳" },
  PAID: { label: "결제완료", color: "bg-blue-100 text-blue-800", icon: "✅" },
  PREPARING: { label: "상품준비중", color: "bg-indigo-100 text-indigo-800", icon: "📦" },
  SHIPPING: { label: "배송중", color: "bg-purple-100 text-purple-800", icon: "🚚" },
  DELIVERED: { label: "배송완료", color: "bg-green-100 text-green-800", icon: "✔️" },
  CANCELLED: { label: "취소", color: "bg-gray-100 text-gray-800", icon: "❌" },
  RETURN_REQUESTED: { label: "반품요청", color: "bg-orange-100 text-orange-800", icon: "🔄" },
  RETURNED: { label: "반품완료", color: "bg-gray-100 text-gray-800", icon: "↩️" },
} as const;

// 하위 호환
export const ORDER_STATUS_LABELS: Record<string, string> = Object.fromEntries(
  Object.entries(ORDER_STATUS).map(([k, v]) => [k, v.label])
);
