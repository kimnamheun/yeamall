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
| 이미지 | Supabase Storage + next/image | AVIF/WebP 자동 최적화 |
| 패키지 | pnpm | |
| 배포 | Vercel | |

## 프로젝트 구조

```
src/
├── app/
│   ├── (shop)/            # 쇼핑 영역 (홈, 상품, 카테고리, 장바구니, 검색, 찜)
│   ├── (auth)/            # 로그인 / 회원가입
│   ├── (account)/         # 마이페이지, 주문내역, 결제
│   ├── admin/             # 관리자 (대시보드, 상품/주문/카테고리 관리)
│   ├── api/               # API 라우트 (검색 자동완성)
│   ├── auth/callback/     # OAuth 콜백
│   ├── sitemap.ts         # SEO 사이트맵
│   └── robots.ts          # SEO 로봇 설정
├── actions/               # Server Actions (products, auth, admin, order, review, wishlist)
├── components/
│   ├── ui/                # shadcn/ui 컴포넌트
│   ├── layout/            # Header, Footer, CategoryNav, MobileBottomNav
│   ├── product/           # ProductCard, ProductGrid, ProductFilter
│   ├── home/              # HeroBanner (슬라이더)
│   ├── shared/            # SearchAutocomplete, PriceDisplay
│   └── cart/              # CartItem, CartSummary
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
- `reviews` - 상품 후기 (별점 1-5, 이미지)
- `qna` - Q&A (비밀글 지원)
- `wishlists` - 찜하기/좋아요

## 주요 기능

### 쇼핑 프론트엔드
- **홈페이지**: 히어로 배너 슬라이더, 베스트 상품, 신상품, 오늘의 특가, 카테고리 추천
- **카테고리 페이지**: 좌측 카테고리 사이드바 + 우측 상품 그리드
- **검색**: 인기 검색어 TOP 10, 추천 상품, **실시간 자동완성 드롭다운**
- **상품 상세**: 이미지, 옵션 선택, **상품 후기 시스템 (별점/리뷰)**, Q&A 탭
- **찜하기(좋아요)**: 상품 하트 토글, 찜 목록 페이지
- **장바구니 + 결제**: 포트원 V2 토스페이먼츠 연동

### 모바일 UX
- **하단 네비게이션**: 카테고리, MY쿠레이션, 홈(원형 버튼), 좋아요, 마이페이지
- **햄버거 메뉴**: 반화면 슬라이드 패널, 상단 로그인 영역, 카테고리 리스트
- **반응형 그리드**: 모바일 2열 / 태블릿 3열 / 데스크탑 4열

### 관리자 대시보드 (`/admin`)
- **대시보드**: 오늘 매출, 총 매출, 등록 상품, 처리대기 (실시간 DB 통계)
- **상품 관리**: 등록/수정/삭제, 원클릭 품절 토글, 저재고 경고
- **주문 관리**: 상태별 필터, 상태 변경
- **카테고리 관리**: CRUD, 순서 변경(위/아래), 활성화/비활성화 토글

### SEO & 성능
- **sitemap.xml**: 동적 생성 (상품/카테고리 포함)
- **robots.txt**: 크롤러 제어
- **Open Graph 메타데이터**: 상품별 OG 태그
- **이미지 최적화**: AVIF/WebP 자동 변환, 24시간 캐시
- **패키지 최적화**: lucide-react, dayjs 트리셰이킹

## 개발 완료 항목

### Phase 1 - 상품 카탈로그 MVP ✅
- [x] 레이아웃 (Header, CategoryNav, Footer)
- [x] 홈페이지 (HeroBanner 슬라이더, 베스트상품, 신상품, 오늘의 특가)
- [x] 상품 목록 페이지 (필터/정렬/페이지네이션)
- [x] 상품 상세 페이지 (이미지갤러리, 옵션선택, 탭)
- [x] 카테고리 페이지 (좌측 사이드바 + 우측 그리드)
- [x] 검색 페이지 (인기 검색어 + 자동완성)
- [x] 모바일 반응형 (하단 네비, 햄버거 메뉴, 그리드)

### Phase 2 - 인증 + 장바구니 + 결제 ✅
- [x] Supabase Auth 설정 (이메일 로그인/회원가입)
- [x] 카카오/구글 소셜 로그인 (Supabase OAuth)
- [x] 미들웨어 (세션 갱신, 인증 가드)
- [x] Zustand 장바구니 (비회원: localStorage)
- [x] 장바구니 페이지
- [x] 주문/결제 페이지 (포트원 V2 연동)
- [x] 마이페이지 / 주문 내역

### Phase 3 - 관리자 대시보드 ✅
- [x] 관리자 레이아웃 (사이드바)
- [x] 대시보드 (실시간 DB 통계)
- [x] 상품 관리 (등록/수정/삭제 + 품절 토글)
- [x] 주문 관리 (상태별 카운트 + 상태 변경)
- [x] 카테고리 관리 (CRUD + 순서변경 + 활성화토글)

### Phase 4 - 커뮤니티 + 검색 + 마무리 ✅
- [x] 상품 후기 시스템 (별점 1-5, 리뷰 작성/삭제, 통계 차트)
- [x] 찜하기/좋아요 (DB 저장, 하트 토글, 찜 목록)
- [x] 검색 자동완성 (API + 실시간 드롭다운)
- [x] SEO 최적화 (sitemap.xml, robots.txt, Open Graph)
- [x] 성능 최적화 (이미지 AVIF/WebP, 패키지 트리셰이킹)
- [ ] Q&A 게시판 (게시판 답변 기능)

## 변경 이력

### 2025-03-06 (2차) - Phase 3~4 완료

#### 관리자 카테고리 관리
- 카테고리 CRUD (추가/수정/삭제)
- 순서 변경 (위/아래 이동)
- 활성화/비활성화 토글
- 상품수 표시, 삭제 방지 (상품이 있는 카테고리)

#### 상품 후기 시스템
- 별점 1~5 리뷰 작성/삭제
- 리뷰 통계 (평균 점수, 별점 분포 차트)
- 상품 상세 페이지 리뷰 탭 연동
- 중복 리뷰 방지

#### 찜하기(좋아요)
- Prisma Wishlist 모델 추가
- 상품 상세 하트 토글 (로그인 필수)
- 찜 목록 페이지 (/wishlist)
- 비로그인 시 로그인 유도

#### 검색 자동완성
- `/api/search` API 라우트
- 300ms 디바운스 실시간 검색
- 썸네일 + 가격 드롭다운 결과
- 헤더 검색바 자동완성 교체

#### SEO 최적화
- `sitemap.ts`: 동적 사이트맵 (상품/카테고리)
- `robots.ts`: 크롤러 규칙
- Open Graph 메타데이터 (상품별)
- metadataBase 설정

#### 성능 최적화
- 이미지: AVIF/WebP 자동 변환, 24시간 캐시
- 패키지: lucide-react, dayjs 트리셰이킹

### 2025-03-06 (1차) - 전체 고도화 + 관리자 기능 강화
- 구조 개선: `SITE` 상수 중앙화, `ORDER_STATUS` 통합
- 모바일 UX: 하단 네비 리뉴얼, 햄버거 메뉴 리디자인
- 홈페이지: 히어로 배너 슬라이더, 오늘의 특가
- 관리자: 실시간 DB 대시보드, 품절 토글, 저재고 경고

## 환경 설정

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
