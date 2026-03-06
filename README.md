# YeAmall - 건어물 전문 쇼핑몰

건어물 판매 전문 쇼핑몰. PC/모바일 반응형 지원.

**Live**: [https://yeamall.vercel.app](https://yeamall.vercel.app)

## Tech Stack

| 항목 | 기술 | 비고 |
|------|------|------|
| Framework | Next.js 16 (App Router, RSC, Server Actions) | React 19, TypeScript |
| UI | Tailwind CSS v4 + shadcn/ui | Pretendard + Quicksand 폰트 |
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
│   ├── layout/            # Header, Footer, CategoryNav, MobileBottomNav
│   ├── product/           # ProductCard, ProductGrid, ProductFilter
│   ├── home/              # HeroBanner (슬라이더)
│   ├── cart/              # CartItem, CartSummary
│   └── shared/            # PriceDisplay, Badge 등
├── lib/                   # Supabase client, Prisma, utils, constants
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

## 주요 기능

### 쇼핑 프론트엔드
- **홈페이지**: 히어로 배너 슬라이더 (자동 전환 5초), 베스트 상품, 신상품, 오늘의 특가, 카테고리 추천
- **카테고리 페이지**: 좌측 카테고리 사이드바 + 우측 상품 그리드 (danble.co.kr 스타일)
- **검색 페이지**: 인기 검색어 TOP 10 랭킹 + 추천 상품 리스트
- **상품 상세**: 이미지 갤러리, 옵션 선택, 탭 (상세/후기/Q&A)
- **장바구니 + 결제**: 포트원 V2 토스페이먼츠 연동

### 모바일 UX
- **하단 네비게이션**: 카테고리, MY쿠레이션, 홈(원형 버튼), 좋아요, 마이페이지
- **햄버거 메뉴**: 반화면 슬라이드 패널, 상단 로그인 영역, 카테고리 리스트
- **반응형 그리드**: 모바일 2열 / 태블릿 3열 / 데스크탑 4열

### 관리자 대시보드 (`/admin`)
- **대시보드**: 오늘 매출, 총 매출, 등록 상품, 처리대기 (실시간 DB 통계)
- **주문 현황**: 처리대기/배송중 카운트, 최근 주문 목록
- **상품 관리**: 등록/수정/삭제, 원클릭 품절 토글, 저재고 경고 (5개 이하)
- **주문 관리**: 상태별 필터, 상태 변경 (입금대기 → 결제완료 → 배송중 → 배송완료)

### 설계 패턴
- **`SITE` 상수 중앙화**: 사이트명, 회사정보, CS정보 등 단일 소스 (`lib/constants.ts`)
- **`ORDER_STATUS` 통합**: 주문 상태별 label/color/icon 일괄 관리
- **Server Actions**: 관리자 CRUD (createProduct, updateProduct, deleteProduct 등)
- **Quicksand 로고 폰트**: Google Fonts 적용

## 개발 완료 항목

### Phase 1 - 상품 카탈로그 MVP
- [x] 레이아웃 (Header, CategoryNav, Footer)
- [x] 홈페이지 (HeroBanner 슬라이더, 베스트상품, 신상품, 오늘의 특가)
- [x] 상품 목록 페이지 (필터/정렬/페이지네이션)
- [x] 상품 상세 페이지 (이미지갤러리, 옵션선택, 탭)
- [x] 카테고리 페이지 (좌측 사이드바 + 우측 그리드)
- [x] 검색 페이지 (인기 검색어 + 추천 상품)
- [x] 모바일 반응형 (하단 네비, 햄버거 메뉴, 그리드)

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
- [x] 대시보드 (실시간 DB 통계 - 매출, 주문, 상품 현황)
- [x] 상품 관리 (등록/수정/삭제 + 품절 토글)
- [x] 주문 관리 (상태별 카운트 + 상태 변경)
- [ ] 카테고리 관리
- [ ] 회원 관리

### Phase 4 - 커뮤니티 + 검색 + 마무리 (미착수)
- [ ] 상품 후기 시스템 (별점 + 이미지)
- [ ] Q&A 게시판
- [ ] 검색 자동완성
- [ ] SEO 최적화 (sitemap, metadata)
- [ ] 성능 최적화 (ISR, 이미지)

## 변경 이력

### 2025-03-06 - 전체 고도화 + 관리자 기능 강화

#### 구조 개선
- `SITE` 상수 중앙화 (`lib/constants.ts`) - 사이트명, 회사정보, CS정보 단일 소스 관리
- `ORDER_STATUS` 통합 - label/color/icon 일괄 관리, 중복 제거
- 타이틀 "YeAmall"로 통일 + Quicksand 로고 폰트 적용 (Google Fonts)

#### 모바일 UX 개선
- 하단 네비게이션 리뉴얼: 카테고리, MY쿠레이션, 홈(원형), 좋아요, 마이페이지
- 햄버거 메뉴 리디자인: 반화면 슬라이드 패널, 로그인 영역 상단 배치
- 검색 버튼 동작 수정 (`<button>` → `<Link href="/search">`)

#### 검색 + 카테고리
- 검색 페이지: 인기 검색어 TOP 10 랭킹 + 추천 상품 리스트 추가
- 카테고리 페이지: 좌측 사이드바 + 우측 상품 그리드 레이아웃 (danble.co.kr 벤치마킹)

#### 홈페이지
- 히어로 배너 슬라이더 (3슬라이드, 자동 전환 5초, 좌우 화살표, 인디케이터)
- "오늘의 특가" 섹션 추가 (할인율 배지 표시)
- 카테고리 아이콘 원형 배경 디자인

#### 관리자 기능 강화
- 대시보드: 더미 데이터 → 실시간 DB 통계 (오늘 매출, 총 매출, 등록 상품, 처리대기)
- 최근 주문 목록: 상품명, 상대시간 표시 (dayjs fromNow)
- 상품 관리: 원클릭 품절 토글, 저재고 경고 (5개 이하 빨간색)
- 주문 관리: 상태별 카운트 배지, 상태 변경 기능

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
