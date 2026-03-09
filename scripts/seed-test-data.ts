import { PrismaClient, OrderStatus } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";

// .env.local 수동 로드 (dotenv 의존성 없이)
function loadEnvFile(filePath: string) {
  try {
    const content = readFileSync(filePath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const value = trimmed.slice(eqIdx + 1).trim();
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch {
    // 파일이 없으면 무시
  }
}

loadEnvFile(resolve(process.cwd(), ".env.local"));

const prisma = new PrismaClient();

// ============================================================
// 환경변수 검증
// ============================================================
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ 환경변수가 설정되지 않았습니다.");
  console.error("");
  console.error("  .env.local 파일에 다음 값을 설정해주세요:");
  console.error("  NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co");
  console.error("  SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...");
  console.error("");
  console.error("  Service Role Key는 Supabase 대시보드에서 확인할 수 있습니다:");
  console.error("  Project Settings → API → Service Role Key (secret)");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ============================================================
// 테스트 사용자 데이터
// ============================================================
const TEST_USERS = [
  {
    email: "admin@test.com",
    password: "test1234!",
    name: "관리자",
    phone: "010-1234-5678",
    zipCode: "06164",
    address: "서울특별시 강남구 역삼대로 123",
    addressDetail: "테스트빌딩 5층",
    isAdmin: true,
  },
  {
    email: "user1@test.com",
    password: "test1234!",
    name: "김철수",
    phone: "010-2222-3333",
    zipCode: "04104",
    address: "서울특별시 마포구 양화로 45",
    addressDetail: "마포아파트 301호",
    isAdmin: false,
  },
  {
    email: "user2@test.com",
    password: "test1234!",
    name: "이영희",
    phone: "010-4444-5555",
    zipCode: "48094",
    address: "부산광역시 해운대구 해운대해변로 100",
    addressDetail: "해운대아파트 1502호",
    isAdmin: false,
  },
  {
    email: "user3@test.com",
    password: "test1234!",
    name: "박민수",
    phone: "010-6666-7777",
    zipCode: "35233",
    address: "대전광역시 서구 둔산로 50",
    addressDetail: "둔산빌라 201호",
    isAdmin: false,
  },
  {
    email: "user4@test.com",
    password: "test1234!",
    name: "최수진",
    phone: "010-8888-9999",
    zipCode: "63122",
    address: "제주특별자치도 제주시 중앙로 200",
    addressDetail: "제주아파트 802호",
    isAdmin: false,
  },
];

// ============================================================
// 리뷰 문구
// ============================================================
const REVIEW_CONTENTS = [
  { rating: 5, content: "품질이 정말 좋습니다! 남해산이라 그런지 맛이 다르네요. 재구매 의사 있습니다." },
  { rating: 5, content: "선물용으로 구매했는데 포장도 깔끔하고 받는 분이 매우 만족하셨어요." },
  { rating: 4, content: "맛은 좋은데 양이 생각보다 조금 적은 느낌이에요. 그래도 맛으로 커버합니다." },
  { rating: 5, content: "엄마가 너무 좋아하세요. 국물 맛이 시원하게 잘 우러나옵니다." },
  { rating: 4, content: "배송이 빨라서 좋았어요. 신선도도 유지되어 있고 맛도 좋습니다." },
  { rating: 3, content: "보통입니다. 다른 곳과 비교했을 때 크게 차이는 모르겠어요." },
  { rating: 5, content: "건어물은 여기서만 삽니다. 항상 신선하고 품질이 일정해요." },
  { rating: 4, content: "아이들 간식으로 딱이에요. 건강한 맛이라 안심하고 줄 수 있어요." },
  { rating: 5, content: "명절 선물세트로 구매했는데 구성이 알차고 포장이 고급스러워요." },
  { rating: 4, content: "쫄깃한 식감이 살아있어서 안주로 최고입니다. 추천합니다!" },
  { rating: 3, content: "가격 대비 괜찮습니다. 좀 더 큰 사이즈도 있으면 좋겠어요." },
  { rating: 5, content: "향이 좋고 육질이 두꺼워서 만족합니다. 볶음용으로 딱이에요." },
  { rating: 4, content: "포장이 꼼꼼해서 배송 중 파손 걱정 없었습니다. 맛도 좋아요." },
  { rating: 5, content: "국산이라 믿을 수 있어요. 맛도 확실히 수입산과 차이가 납니다." },
  { rating: 4, content: "반찬으로 만들어 먹었는데 온 가족이 좋아해요. 또 주문할게요." },
];

// ============================================================
// Q&A 문구
// ============================================================
const QNA_DATA = [
  {
    question: "이 상품 유통기한이 어떻게 되나요?",
    answer: "안녕하세요, YeAmall입니다. 해당 상품의 유통기한은 제조일로부터 12개월입니다. 서늘하고 건조한 곳에 보관하시면 됩니다. 감사합니다.",
    isPrivate: false,
  },
  {
    question: "제주도인데 배송비가 추가되나요?",
    answer: "안녕하세요. 제주/도서산간 지역은 기본 배송비에 추가 3,000원이 발생합니다. 7만원 이상 구매 시에도 추가 배송비는 별도입니다. 감사합니다.",
    isPrivate: false,
  },
  {
    question: "선물포장이 가능한가요? 명절 선물로 보내려고 합니다.",
    answer: "네, 선물포장 가능합니다! 주문 시 배송 메모에 '선물포장 요청'이라고 적어주시면 무료로 포장해 드립니다.",
    isPrivate: false,
  },
  {
    question: "알레르기가 있는데 성분표 확인할 수 있나요?",
    answer: "상세 성분표는 상품 포장지에 기재되어 있습니다. 특정 알레르기 성분이 걱정되신다면 고객센터(02-1234-5678)로 문의해주세요. 확인 후 안내드리겠습니다.",
    isPrivate: false,
  },
  {
    question: "대량 구매 시 할인이 되나요? 회사 행사용으로 30세트 정도 필요합니다.",
    answer: "대량 주문은 별도 할인이 가능합니다. 고객센터로 연락 주시면 수량에 맞는 견적을 안내드리겠습니다.",
    isPrivate: false,
  },
  {
    question: "주문한 지 3일 됐는데 아직 배송이 안 왔어요.",
    answer: null,
    isPrivate: false,
  },
  {
    question: "상품이 불량인 것 같은데 교환 가능한가요?",
    answer: null,
    isPrivate: false,
  },
  {
    question: "다음 주 화요일까지 받을 수 있을까요?",
    answer: null,
    isPrivate: false,
  },
  {
    question: "지난번에 구매한 상품과 맛이 다른 것 같아요. 확인 부탁드립니다.",
    answer: null,
    isPrivate: true,
  },
  {
    question: "결제 관련 문의입니다. 카드 승인은 됐는데 주문 확인이 안 돼요.",
    answer: null,
    isPrivate: true,
  },
];

// ============================================================
// 유틸리티
// ============================================================
function daysAgo(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(Math.floor(Math.random() * 14) + 8, Math.floor(Math.random() * 60), 0, 0);
  return d;
}

function randomPick<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function generateOrderNumber(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `YEA-${yyyy}${mm}${dd}-${rand}`;
}

// ============================================================
// MAIN
// ============================================================
async function main() {
  console.log("🌱 테스트 데이터 시드 시작...\n");

  // ─────────────────────────────────────────
  // 1. 기존 상품 조회
  // ─────────────────────────────────────────
  const products = await prisma.product.findMany({
    select: { id: true, name: true, price: true, salePrice: true },
  });

  if (products.length === 0) {
    console.error("❌ 상품이 없습니다. 먼저 pnpm db:seed 를 실행하세요.");
    process.exit(1);
  }
  console.log(`📦 기존 상품 ${products.length}개 확인\n`);

  // ─────────────────────────────────────────
  // 2. 테스트 사용자 생성
  // ─────────────────────────────────────────
  console.log("👤 테스트 사용자 생성 중...");
  const userIds: string[] = [];

  for (const userData of TEST_USERS) {
    // Supabase Auth에서 기존 사용자 확인
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find((u) => u.email === userData.email);

    let userId: string;

    if (existingUser) {
      userId = existingUser.id;
      console.log(`  ✓ ${userData.email} (${userData.name}) - 이미 존재 [${userId.slice(0, 8)}...]`);
    } else {
      const { data, error } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
        user_metadata: { name: userData.name, phone: userData.phone },
      });

      if (error) {
        console.error(`  ✗ ${userData.email} 생성 실패: ${error.message}`);
        continue;
      }
      userId = data.user.id;
      console.log(`  ✓ ${userData.email} (${userData.name}) - 생성 완료 [${userId.slice(0, 8)}...]`);
    }

    // Prisma Profile upsert
    await prisma.profile.upsert({
      where: { id: userId },
      update: {
        name: userData.name,
        phone: userData.phone,
        zipCode: userData.zipCode,
        address: userData.address,
        addressDetail: userData.addressDetail,
        isAdmin: userData.isAdmin,
      },
      create: {
        id: userId,
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        zipCode: userData.zipCode,
        address: userData.address,
        addressDetail: userData.addressDetail,
        isAdmin: userData.isAdmin,
      },
    });

    userIds.push(userId);
  }

  // 일반 회원 ID만 추출 (admin 제외)
  const regularUserIds = userIds.slice(1);
  console.log(`\n  총 ${userIds.length}명 생성/확인 완료\n`);

  if (regularUserIds.length === 0) {
    console.error("❌ 일반 회원이 없어 주문 데이터를 생성할 수 없습니다.");
    process.exit(1);
  }

  // ─────────────────────────────────────────
  // 3. 주문 데이터 생성 (20건)
  // ─────────────────────────────────────────
  console.log("🛒 주문 데이터 생성 중...");

  // 기존 테스트 주문이 있으면 건너뛰기
  const existingOrderCount = await prisma.order.count({
    where: { orderNumber: { startsWith: "YEA-" } },
  });

  if (existingOrderCount >= 20) {
    console.log(`  ⏭ 이미 ${existingOrderCount}건의 주문이 존재합니다. 건너뜁니다.\n`);
  } else {
    const orderStatuses: { status: OrderStatus; count: number; daysRange: [number, number] }[] = [
      { status: "DELIVERED", count: 6, daysRange: [15, 30] },
      { status: "PAID", count: 5, daysRange: [1, 7] },
      { status: "PREPARING", count: 3, daysRange: [1, 5] },
      { status: "SHIPPING", count: 3, daysRange: [3, 10] },
      { status: "CANCELLED", count: 2, daysRange: [5, 20] },
      { status: "RETURN_REQUESTED", count: 1, daysRange: [10, 15] },
    ];

    let orderCount = 0;
    const createdOrders: { id: string; userId: string; status: OrderStatus; productIds: string[] }[] = [];

    for (const { status, count, daysRange } of orderStatuses) {
      for (let i = 0; i < count; i++) {
        const userId = regularUserIds[orderCount % regularUserIds.length];
        const userInfo = TEST_USERS.find((u) => {
          // 인덱스 기반 매칭
          return TEST_USERS.indexOf(u) === (orderCount % regularUserIds.length) + 1;
        }) || TEST_USERS[1];

        const itemCount = Math.floor(Math.random() * 3) + 1;
        const selectedProducts = randomPick(products, itemCount);

        const items = selectedProducts.map((p) => ({
          productId: p.id,
          name: p.name,
          price: p.salePrice ?? p.price,
          quantity: Math.floor(Math.random() * 3) + 1,
        }));

        const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const shippingFee = subtotal >= 70000 ? 0 : 3000;
        const totalAmount = subtotal + shippingFee;

        const dayOffset = daysRange[0] + Math.floor(Math.random() * (daysRange[1] - daysRange[0]));
        const orderDate = daysAgo(dayOffset);
        const isPaid = !["PENDING", "CANCELLED"].includes(status);

        const order = await prisma.order.create({
          data: {
            orderNumber: generateOrderNumber(orderDate),
            userId,
            status,
            totalAmount,
            shippingFee,
            recipientName: userInfo.name,
            recipientPhone: userInfo.phone,
            zipCode: userInfo.zipCode,
            address: userInfo.address,
            addressDetail: userInfo.addressDetail,
            deliveryMemo: ["부재시 문 앞에 놓아주세요", "경비실에 맡겨주세요", "배송 전 연락 부탁드립니다", null][Math.floor(Math.random() * 4)],
            paymentMethod: "카드결제",
            paymentKey: isPaid ? `tgen_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}` : null,
            paidAt: isPaid ? orderDate : null,
            createdAt: orderDate,
            items: {
              create: items,
            },
          },
        });

        createdOrders.push({
          id: order.id,
          userId,
          status,
          productIds: selectedProducts.map((p) => p.id),
        });
        orderCount++;
      }
    }

    console.log(`  ✓ ${orderCount}건 주문 생성 완료`);
    console.log(`    - DELIVERED: 6건, PAID: 5건, PREPARING: 3건`);
    console.log(`    - SHIPPING: 3건, CANCELLED: 2건, RETURN_REQUESTED: 1건\n`);

    // ─────────────────────────────────────────
    // 4. 리뷰 데이터 생성 (15건)
    // ─────────────────────────────────────────
    console.log("⭐ 리뷰 데이터 생성 중...");

    // DELIVERED 주문에서 리뷰 대상 추출 (1인 1상품 중복 방지)
    const deliveredOrders = createdOrders.filter((o) => o.status === "DELIVERED");
    const reviewPairs = new Set<string>(); // userId-productId
    let reviewCount = 0;

    for (const order of deliveredOrders) {
      for (const productId of order.productIds) {
        const key = `${order.userId}-${productId}`;
        if (reviewPairs.has(key) || reviewCount >= 15) continue;
        reviewPairs.add(key);

        const reviewData = REVIEW_CONTENTS[reviewCount % REVIEW_CONTENTS.length];
        const reviewDate = daysAgo(Math.floor(Math.random() * 14) + 1);

        await prisma.review.create({
          data: {
            userId: order.userId,
            productId,
            rating: reviewData.rating,
            content: reviewData.content,
            images: [],
            createdAt: reviewDate,
          },
        });
        reviewCount++;
      }
    }

    console.log(`  ✓ ${reviewCount}건 리뷰 생성 완료\n`);

    // ─────────────────────────────────────────
    // 5. Q&A 데이터 생성 (10건)
    // ─────────────────────────────────────────
    console.log("❓ Q&A 데이터 생성 중...");

    let qnaCount = 0;
    for (const qna of QNA_DATA) {
      const userId = regularUserIds[qnaCount % regularUserIds.length];
      const product = products[qnaCount % products.length];
      const qnaDate = daysAgo(Math.floor(Math.random() * 25) + 1);

      await prisma.qna.create({
        data: {
          userId,
          productId: product.id,
          question: qna.question,
          answer: qna.answer,
          isPrivate: qna.isPrivate,
          createdAt: qnaDate,
        },
      });
      qnaCount++;
    }

    const answeredCount = QNA_DATA.filter((q) => q.answer).length;
    const privateCount = QNA_DATA.filter((q) => q.isPrivate).length;
    console.log(`  ✓ ${qnaCount}건 Q&A 생성 완료 (답변완료: ${answeredCount}건, 비밀글: ${privateCount}건)\n`);

    // ─────────────────────────────────────────
    // 6. 찜하기 데이터 생성 (8건)
    // ─────────────────────────────────────────
    console.log("💖 찜하기 데이터 생성 중...");

    let wishlistCount = 0;
    for (const userId of regularUserIds) {
      const wishProducts = randomPick(products, Math.floor(Math.random() * 3) + 1);
      for (const product of wishProducts) {
        try {
          await prisma.wishlist.create({
            data: { userId, productId: product.id },
          });
          wishlistCount++;
        } catch {
          // unique constraint 위반 시 무시
        }
      }
    }

    console.log(`  ✓ ${wishlistCount}건 찜하기 생성 완료\n`);
  }

  // ─────────────────────────────────────────
  // 결과 요약
  // ─────────────────────────────────────────
  const stats = await Promise.all([
    prisma.profile.count(),
    prisma.order.count(),
    prisma.review.count(),
    prisma.qna.count(),
    prisma.wishlist.count(),
  ]);

  console.log("═══════════════════════════════════════");
  console.log("📊 DB 현재 상태:");
  console.log(`   회원: ${stats[0]}명`);
  console.log(`   주문: ${stats[1]}건`);
  console.log(`   리뷰: ${stats[2]}건`);
  console.log(`   Q&A:  ${stats[3]}건`);
  console.log(`   찜:   ${stats[4]}건`);
  console.log("═══════════════════════════════════════");
  console.log("");
  console.log("🔑 테스트 계정 정보:");
  console.log("   관리자: admin@test.com / test1234!");
  console.log("   회원1:  user1@test.com / test1234!");
  console.log("   회원2:  user2@test.com / test1234!");
  console.log("   회원3:  user3@test.com / test1234!");
  console.log("   회원4:  user4@test.com / test1234!");
  console.log("");
  console.log("✅ 테스트 데이터 시드 완료!");
}

main()
  .catch((e) => {
    console.error("❌ 오류:", e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
