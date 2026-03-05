import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 카테고리 생성
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "meolchi" },
      update: {},
      create: { name: "멸치", slug: "meolchi", sortOrder: 1 },
    }),
    prisma.category.upsert({
      where: { slug: "ojingeo" },
      update: {},
      create: { name: "오징어", slug: "ojingeo", sortOrder: 2 },
    }),
    prisma.category.upsert({
      where: { slug: "myeongtae" },
      update: {},
      create: { name: "명태/황태", slug: "myeongtae", sortOrder: 3 },
    }),
    prisma.category.upsert({
      where: { slug: "saewoo" },
      update: {},
      create: { name: "새우", slug: "saewoo", sortOrder: 4 },
    }),
    prisma.category.upsert({
      where: { slug: "seaweed" },
      update: {},
      create: { name: "김/미역/다시마", slug: "seaweed", sortOrder: 5 },
    }),
    prisma.category.upsert({
      where: { slug: "nuts" },
      update: {},
      create: { name: "견과류", slug: "nuts", sortOrder: 6 },
    }),
    prisma.category.upsert({
      where: { slug: "gift-set" },
      update: {},
      create: { name: "선물세트", slug: "gift-set", sortOrder: 7 },
    }),
    prisma.category.upsert({
      where: { slug: "others" },
      update: {},
      create: { name: "기타 건어물", slug: "others", sortOrder: 8 },
    }),
  ]);

  console.log(`${categories.length} categories created`);

  const catMap: Record<string, string> = {};
  for (const c of categories) {
    catMap[c.slug] = c.id;
  }

  // 상품 생성
  const products = [
    {
      name: "프리미엄 국내산 볶음멸치 500g",
      slug: "premium-roasted-anchovy-500g",
      description: "남해안에서 직접 잡은 신선한 멸치를 전통 방식으로 볶아낸 프리미엄 볶음멸치입니다.",
      price: 25000,
      salePrice: 19800,
      categoryId: catMap["meolchi"],
      images: ["/images/products/anchovy-roasted.svg"],
      thumbnailUrl: "/images/products/anchovy-roasted.svg",
      stock: 100,
      weight: "500g",
      origin: "국내산 (남해)",
      unit: "1팩",
      isNew: true,
      isRecommended: true,
      shippingInfo: "7만원 이상 무료배송",
    },
    {
      name: "국물용 대멸 1kg",
      slug: "soup-large-anchovy-1kg",
      description: "시원한 국물 맛을 내는 데 최적화된 대멸입니다. 깊은 감칠맛이 일품입니다.",
      price: 32000,
      salePrice: 27900,
      categoryId: catMap["meolchi"],
      images: ["/images/products/anchovy-soup.svg"],
      thumbnailUrl: "/images/products/anchovy-soup.svg",
      stock: 50,
      weight: "1kg",
      origin: "국내산 (통영)",
      unit: "1팩",
      isRecommended: true,
      shippingInfo: "7만원 이상 무료배송",
    },
    {
      name: "해풍건조 오징어 10마리",
      slug: "wind-dried-squid-10",
      description: "동해안 해풍에 자연건조한 오징어입니다. 쫄깃한 식감이 살아있습니다.",
      price: 45000,
      salePrice: 38000,
      categoryId: catMap["ojingeo"],
      images: ["/images/products/squid-dried.svg"],
      thumbnailUrl: "/images/products/squid-dried.svg",
      stock: 30,
      weight: "약 1.2kg",
      origin: "국내산 (울릉도)",
      unit: "10마리",
      isNew: true,
      isRecommended: true,
      shippingInfo: "7만원 이상 무료배송",
    },
    {
      name: "찢어먹는 황태채 300g",
      slug: "shredded-hwangtae-300g",
      description: "덕장에서 오랜 시간 건조시킨 황태를 채로 만들어 부드럽고 담백합니다.",
      price: 18000,
      salePrice: 14500,
      categoryId: catMap["myeongtae"],
      images: ["/images/products/hwangtae.svg"],
      thumbnailUrl: "/images/products/hwangtae.svg",
      stock: 80,
      weight: "300g",
      origin: "국내산 (인제)",
      unit: "1팩",
      isRecommended: true,
      shippingInfo: "7만원 이상 무료배송",
    },
    {
      name: "건새우 500g (요리용)",
      slug: "dried-shrimp-500g",
      description: "국물 맛을 풍부하게 해주는 건새우입니다. 찌개, 볶음 등 다양한 요리에 활용하세요.",
      price: 22000,
      categoryId: catMap["saewoo"],
      images: ["/images/products/shrimp-dried.svg"],
      thumbnailUrl: "/images/products/shrimp-dried.svg",
      stock: 60,
      weight: "500g",
      origin: "국내산",
      unit: "1팩",
      shippingInfo: "7만원 이상 무료배송",
    },
    {
      name: "완도 전통 재래김 100장",
      slug: "wando-traditional-seaweed-100",
      description: "완도 청정 해역에서 수확한 재래김을 전통 방식으로 가공했습니다.",
      price: 28000,
      salePrice: 23000,
      categoryId: catMap["seaweed"],
      images: ["/images/products/seaweed-kim.svg"],
      thumbnailUrl: "/images/products/seaweed-kim.svg",
      stock: 120,
      weight: "100장",
      origin: "국내산 (완도)",
      unit: "1묶음",
      isNew: true,
      shippingInfo: "7만원 이상 무료배송",
    },
    {
      name: "자연산 다시마 1kg",
      slug: "natural-kelp-1kg",
      description: "깊은 바다에서 채취한 자연산 다시마입니다. 국물용으로 최고입니다.",
      price: 15000,
      categoryId: catMap["seaweed"],
      images: ["/images/products/kelp.svg"],
      thumbnailUrl: "/images/products/kelp.svg",
      stock: 90,
      weight: "1kg",
      origin: "국내산 (기장)",
      unit: "1팩",
      shippingInfo: "7만원 이상 무료배송",
    },
    {
      name: "프리미엄 견과류 선물세트",
      slug: "premium-nuts-gift-set",
      description: "아몬드, 호두, 캐슈넛, 마카다미아 등 엄선된 견과류 선물세트입니다.",
      price: 55000,
      salePrice: 45000,
      categoryId: catMap["gift-set"],
      images: ["/images/products/nuts-gift.svg"],
      thumbnailUrl: "/images/products/nuts-gift.svg",
      stock: 40,
      weight: "1.2kg",
      origin: "수입산",
      unit: "1세트",
      isNew: true,
      isRecommended: true,
      shippingInfo: "무료배송",
    },
    {
      name: "잔멸치 1kg (반찬용)",
      slug: "small-anchovy-1kg",
      description: "잔멸치볶음, 주먹밥 등 반찬용으로 딱 좋은 잔멸치입니다.",
      price: 28000,
      salePrice: 24000,
      categoryId: catMap["meolchi"],
      images: ["/images/products/anchovy-small.svg"],
      thumbnailUrl: "/images/products/anchovy-small.svg",
      stock: 70,
      weight: "1kg",
      origin: "국내산 (남해)",
      unit: "1팩",
      isRecommended: true,
      shippingInfo: "7만원 이상 무료배송",
    },
    {
      name: "구운 오징어다리 300g",
      slug: "grilled-squid-legs-300g",
      description: "바삭하게 구운 오징어다리 간식. 맥주 안주로 최고입니다.",
      price: 16000,
      salePrice: 12800,
      categoryId: catMap["ojingeo"],
      images: ["/images/products/squid-legs.svg"],
      thumbnailUrl: "/images/products/squid-legs.svg",
      stock: 55,
      weight: "300g",
      origin: "국내산",
      unit: "1팩",
      shippingInfo: "7만원 이상 무료배송",
    },
    {
      name: "무염 아몬드 1kg",
      slug: "unsalted-almonds-1kg",
      description: "소금을 넣지 않고 자연 그대로 구운 무염 아몬드입니다.",
      price: 19000,
      salePrice: 15900,
      categoryId: catMap["nuts"],
      images: ["/images/products/almonds.svg"],
      thumbnailUrl: "/images/products/almonds.svg",
      stock: 100,
      weight: "1kg",
      origin: "미국산",
      unit: "1팩",
      isRecommended: true,
      shippingInfo: "7만원 이상 무료배송",
    },
    {
      name: "건어물 종합 선물세트 (대)",
      slug: "dried-fish-gift-set-large",
      description: "멸치, 오징어, 새우, 다시마 등 건어물 베스트 상품을 한 세트로 구성했습니다.",
      price: 89000,
      salePrice: 75000,
      categoryId: catMap["gift-set"],
      images: ["/images/products/gift-set-large.svg"],
      thumbnailUrl: "/images/products/gift-set-large.svg",
      stock: 20,
      weight: "3kg",
      origin: "국내산",
      unit: "1세트",
      isNew: true,
      isRecommended: true,
      shippingInfo: "무료배송",
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  console.log(`${products.length} products created`);
  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
