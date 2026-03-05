import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductGrid from "@/components/product/product-grid";
import { getBestProducts, getNewProducts } from "@/actions/products";
import { CATEGORIES } from "@/lib/constants";

export default async function HomePage() {
  const bestProducts = await getBestProducts();
  const newProducts = await getNewProducts();

  return (
    <div>
      {/* 히어로 배너 */}
      <section className="relative bg-gradient-to-br from-primary/5 via-white to-accent/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <h2 className="text-3xl sm:text-5xl font-bold text-foreground mb-4">
              신선한 <span className="text-primary">건어물</span>을
              <br />
              합리적인 가격에
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              산지에서 직접 공수한 프리미엄 건어물을 만나보세요.
              <br />
              7만원 이상 구매 시 무료배송!
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
              >
                전체상품 보기
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/categories/gift-set"
                className="inline-flex items-center gap-2 rounded-full border-2 border-primary px-8 py-3 text-sm font-semibold text-primary hover:bg-primary hover:text-white transition-colors"
              >
                선물세트
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 카테고리 아이콘 */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-muted transition-colors"
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className="text-xs font-medium text-foreground">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 베스트 상품 */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-foreground">베스트 상품</h3>
              <p className="text-sm text-muted-foreground mt-1">
                가장 많이 찾는 인기 건어물
              </p>
            </div>
            <Link
              href="/products?sort=best"
              className="text-sm text-accent hover:underline flex items-center gap-1"
            >
              더보기 <ArrowRight size={14} />
            </Link>
          </div>
          <ProductGrid products={bestProducts} />
        </div>
      </section>

      {/* 프로모션 배너 */}
      <section className="bg-primary/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="rounded-2xl bg-gradient-to-r from-primary to-primary/80 p-8 sm:p-12 text-center text-white">
            <h3 className="text-2xl sm:text-3xl font-bold mb-3">
              신규회원 특별 혜택
            </h3>
            <p className="text-primary-foreground/80 mb-6">
              지금 가입하면 5,000원 할인쿠폰 + 첫 구매 무료배송!
            </p>
            <Link
              href="/register"
              className="inline-flex rounded-full bg-white px-8 py-3 text-sm font-semibold text-primary hover:bg-gray-100 transition-colors"
            >
              회원가입 하기
            </Link>
          </div>
        </div>
      </section>

      {/* 신상품 */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-foreground">신상품</h3>
              <p className="text-sm text-muted-foreground mt-1">
                새로 입고된 건어물을 만나보세요
              </p>
            </div>
            <Link
              href="/products?sort=new"
              className="text-sm text-accent hover:underline flex items-center gap-1"
            >
              더보기 <ArrowRight size={14} />
            </Link>
          </div>
          <ProductGrid products={newProducts} />
        </div>
      </section>

      {/* 안내 배너 */}
      <section className="border-t border-border bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div className="space-y-2">
              <div className="text-3xl">🚚</div>
              <h4 className="font-semibold text-sm">무료배송</h4>
              <p className="text-xs text-muted-foreground">7만원 이상 구매 시</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl">🏅</div>
              <h4 className="font-semibold text-sm">품질보증</h4>
              <p className="text-xs text-muted-foreground">100% 정품 보장</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl">🔄</div>
              <h4 className="font-semibold text-sm">교환/반품</h4>
              <p className="text-xs text-muted-foreground">수령 후 7일 이내</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl">📞</div>
              <h4 className="font-semibold text-sm">고객센터</h4>
              <p className="text-xs text-muted-foreground">02-1234-5678</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
