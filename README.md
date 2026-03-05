# YeAMall - 건어물 전문 쇼핑몰

건어물 판매 전문 쇼핑몰. PC/모바일 반응형 지원.

## Tech Stack

| 항목 | 기술 | 비고 |
|------|------|------|
| Framework | Next.js 16 (App Router, RSC, Server Actions) | React 19, TypeScript |
| UI | Tailwind CSS v4 + shadcn/ui | Pretendard 폰트 |
| DB | Supabase (PostgreSQL) | 무료 티어 |
| ORM | Prisma v6 | Type-safe DB 접근 |
| Auth | Supabase Auth | 이메일 + 카카오/구글 소셜로그인 |
| 결제 | PortOne V2 SDK | 토스페이먼츠 연동 |
| 상태관리 | Zustand v5 | 장바구니 (localStorage persist) |
| 이미지 | Supabase Storage + next/image | |
| 패키지 | pnpm | |
| 배포 | Vercel | |

## 프로젝트 구조

```
src/
├── app/
│   ├── (shop)/            # 쇼핑 영역 (홈, 상품, 카테고리, 장바구니, 검색)
│   ├── (auth)/            # 로그인 / 회원가입
│   ├── (account)/         # 마이페이지, 주문내역, 결제
│   ├── admin/             # 관리자 (대시보드, 상품/주문/카테고리/회원 관리)
│   ├── auth/callback/     # OAuth 콜백
│   └── api/               # API 라우트
├── actions/               # Server Actions (products, auth, admin, order)
├── components/
│   ├── ui/                # shadcn/ui 컴포넌트
│   ├── layout/            # Header, Footer, CategoryNav
│   ├── product/           # ProductCard, ProductGrid, ProductFilter
│   ├── cart/              # CartItem, CartSummary
│   └── shared/            # PriceDisplay, Badge 등
├── lib/                   # Supabase client, Prisma, utils
├── stores/                # Zustand (장바구니)
└── types/                 # TypeScript 타입
```

## DB 스키마

- `categories` - 계층형 카테고리 (parent_id)
- `products` - 상품 (가격, 할인가, 재고, 배지, 이미지 배열)
- `profiles` - 회원 프로필 (Supabase Auth 연동)
- `orders` / `order_items` - 주문
- `cart_items` - 장바구니 (로그인 유저)
- `reviews` - 상품 후기 (별점 1-5)
- `qna` - Q&A (비밀글 지원)

## 개발 완료 항목

### Phase 1 - 상품 카탈로그 MVP
- [x] 레이아웃 (Header, CategoryNav, Footer)
- [x] 홈페이지 (HeroBanner, 베스트상품, 신상품, 카테고리 추천)
- [x] 상품 목록 페이지 (필터/정렬/페이지네이션)
- [x] 상품 상세 페이지 (이미지갤러리, 옵션선택, 탭)
- [x] 카테고리별 상품 페이지
- [x] 검색 페이지
- [x] 모바일 반응형 (햄버거 메뉴, 그리드)

### Phase 2 - 인증 + 장바구니 + 결제
- [x] Supabase Auth 설정 (이메일 로그인/회원가입)
- [x] 카카오/구글 소셜 로그인 (Supabase OAuth)
- [x] 미들웨어 (세션 갱신, 인증 가드)
- [x] Zustand 장바구니 (비회원: localStorage)
- [x] 장바구니 페이지
- [x] 주문/결제 페이지 (포트원 V2 연동)
- [x] 마이페이지 / 주문 내역

### Phase 3 - 관리자 대시보드
- [x] 관리자 레이아웃 (사이드바)
- [x] 상품 관리 (등록/수정/삭제)
- [x] 주문 관리 (상태 변경)
- [ ] 카테고리 관리
- [ ] 회원 관리

### Phase 4 - 커뮤니티 + 검색 + 마무리 (미착수)
- [ ] 상품 후기 시스템 (별점 + 이미지)
- [ ] Q&A 게시판
- [ ] 검색 자동완성
- [ ] SEO 최적화 (sitemap, metadata)
- [ ] 성능 최적화 (ISR, 이미지)

## 환경 설정 필요 항목

소셜 로그인과 결제를 실제 사용하려면 아래 설정이 필요합니다.

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
DIRECT_URL=
NEXT_PUBLIC_PORTONE_STORE_ID=
PORTONE_API_SECRET=
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

- **소셜 로그인**: Supabase 대시보드 > Authentication > Providers에서 카카오/구글 OAuth 크레덴셜 등록
- **결제**: 포트원 대시보드에서 Store ID, API Secret 발급 후 `.env.local`에 설정

## 실행 방법

```bash
pnpm install
pnpm dev        # 개발 서버 (localhost:3000)
pnpm build      # 프로덕션 빌드
pnpm db:studio  # Prisma Studio (DB 관리)
```

## 배송비 정책

- 7만원 이상: 무료배송
- 7만원 미만: 3,000원
- 제주/도서산간: 추가 3,000~5,000원
