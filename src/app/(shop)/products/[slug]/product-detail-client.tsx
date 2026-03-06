"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { ShoppingCart, Minus, Plus, ChevronRight, Heart, Star, Trash2 } from "lucide-react";
import { useCartStore } from "@/stores/use-cart-store";
import { formatPrice, getDiscountRate } from "@/lib/utils";
import { createReview, deleteReview } from "@/actions/review";
import { toggleWishlist } from "@/actions/wishlist";
import ProductGrid from "@/components/product/product-grid";
import type { Product } from "@/types/product";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";

dayjs.extend(relativeTime);
dayjs.locale("ko");

interface ReviewUser {
  id: string;
  name: string | null;
  email: string;
}

interface ReviewItem {
  id: string;
  rating: number;
  content: string;
  images: string[];
  createdAt: Date;
  user: ReviewUser;
}

interface ReviewStats {
  count: number;
  average: number;
  distribution: number[];
}

interface Props {
  product: Product;
  relatedProducts: Product[];
  reviews: ReviewItem[];
  reviewStats: ReviewStats;
  isWishlisted: boolean;
}

export default function ProductDetailClient({
  product,
  relatedProducts,
  reviews,
  reviewStats,
  isWishlisted: initialWishlisted,
}: Props) {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"detail" | "review" | "qna">("detail");
  const [wishlisted, setWishlisted] = useState(initialWishlisted);
  const [isPending, startTransition] = useTransition();
  const addItem = useCartStore((s) => s.addItem);

  // Review form state
  const [rating, setRating] = useState(5);
  const [reviewContent, setReviewContent] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);

  const handleAddToCart = () => {
    addItem(
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        salePrice: product.salePrice ?? undefined,
        thumbnailUrl: product.thumbnailUrl ?? undefined,
        weight: product.weight ?? undefined,
      },
      quantity
    );
    alert(`${product.name} ${quantity}개가 장바구니에 담겼습니다.`);
  };

  const handleToggleWishlist = () => {
    startTransition(async () => {
      const result = await toggleWishlist(product.id);
      if (result.error) {
        alert(result.error);
        return;
      }
      setWishlisted(result.wishlisted);
    });
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError("");

    const formData = new FormData();
    formData.set("productId", product.id);
    formData.set("rating", String(rating));
    formData.set("content", reviewContent);

    const result = await createReview(formData);
    if (result.error) {
      setReviewError(result.error);
      return;
    }

    setReviewContent("");
    setRating(5);
    setShowReviewForm(false);
    window.location.reload();
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("리뷰를 삭제하시겠습니까?")) return;
    await deleteReview(reviewId);
    window.location.reload();
  };

  const effectivePrice = product.salePrice ?? product.price;
  const totalPrice = effectivePrice * quantity;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* 브레드크럼 */}
      <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">홈</Link>
        <ChevronRight size={14} />
        <Link href="/products" className="hover:text-foreground">전체상품</Link>
        {product.category && (
          <>
            <ChevronRight size={14} />
            <Link href={`/categories/${product.category.slug}`} className="hover:text-foreground">
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight size={14} />
        <span className="text-foreground">{product.name}</span>
      </nav>

      {/* 상품 정보 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        {/* 이미지 */}
        <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
          <Image
            src={product.thumbnailUrl || "/images/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.isNew && (
              <span className="rounded-md bg-accent px-3 py-1 text-xs font-bold text-white">NEW</span>
            )}
            {product.isRecommended && (
              <span className="rounded-md bg-primary px-3 py-1 text-xs font-bold text-white">추천</span>
            )}
          </div>
          <button
            onClick={handleToggleWishlist}
            disabled={isPending}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center shadow-md hover:bg-white transition-colors"
          >
            <Heart size={20} className={wishlisted ? "fill-red-500 text-red-500" : "text-gray-400"} />
          </button>
        </div>

        {/* 상품 정보 패널 */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-foreground mb-2">{product.name}</h1>
          {product.description && (
            <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
          )}

          {reviewStats.count > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={14} className={star <= Math.round(reviewStats.average) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
                ))}
              </div>
              <span className="text-sm font-medium">{reviewStats.average}</span>
              <span className="text-sm text-muted-foreground">({reviewStats.count}개 리뷰)</span>
            </div>
          )}

          <div className="mb-6 pb-6 border-b border-border">
            {product.salePrice ? (
              <div className="flex items-end gap-3">
                <span className="text-red-500 text-lg font-bold">{getDiscountRate(product.price, product.salePrice)}%</span>
                <span className="text-3xl font-bold text-foreground">{formatPrice(product.salePrice)}</span>
                <span className="text-base text-muted-foreground line-through">{formatPrice(product.price)}</span>
              </div>
            ) : (
              <span className="text-3xl font-bold text-foreground">{formatPrice(product.price)}</span>
            )}
          </div>

          <div className="space-y-3 mb-6 text-sm">
            {product.origin && (<div className="flex"><span className="w-24 text-muted-foreground">원산지</span><span>{product.origin}</span></div>)}
            {product.weight && (<div className="flex"><span className="w-24 text-muted-foreground">중량/수량</span><span>{product.weight}</span></div>)}
            <div className="flex"><span className="w-24 text-muted-foreground">배송비</span><span>{product.shippingInfo || "3,000원 (7만원 이상 무료)"}</span></div>
            <div className="flex"><span className="w-24 text-muted-foreground">재고</span><span className={product.stock > 0 ? "text-green-600" : "text-red-500"}>{product.stock > 0 ? `${product.stock}개 남음` : "품절"}</span></div>
          </div>

          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
            <span className="text-sm text-muted-foreground w-24">수량</span>
            <div className="flex items-center border border-border rounded-lg">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-muted rounded-l-lg"><Minus size={16} /></button>
              <span className="w-12 h-10 flex items-center justify-center text-sm font-medium border-x border-border">{quantity}</span>
              <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="w-10 h-10 flex items-center justify-center hover:bg-muted rounded-r-lg"><Plus size={16} /></button>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <span className="text-sm font-medium text-muted-foreground">총 상품금액</span>
            <span className="text-2xl font-bold text-primary">{formatPrice(totalPrice)}</span>
          </div>

          <div className="flex gap-3">
            <button onClick={handleToggleWishlist} disabled={isPending} className="flex items-center justify-center w-14 h-14 rounded-xl border-2 border-border hover:border-red-300 hover:bg-red-50 transition-colors">
              <Heart size={22} className={wishlisted ? "fill-red-500 text-red-500" : "text-gray-400"} />
            </button>
            <button onClick={handleAddToCart} disabled={product.isSoldOut} className="flex-1 flex items-center justify-center gap-2 h-14 rounded-xl border-2 border-primary text-primary font-semibold hover:bg-primary/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <ShoppingCart size={20} /> 장바구니
            </button>
            <button disabled={product.isSoldOut} className="flex-1 h-14 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {product.isSoldOut ? "품절" : "바로구매"}
            </button>
          </div>
        </div>
      </div>

      {/* 탭 */}
      <div className="border-b border-border mb-8">
        <div className="flex">
          {(["detail", "review", "qna"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              {tab === "detail" && "상품상세"}
              {tab === "review" && `상품후기 (${reviewStats.count})`}
              {tab === "qna" && "Q&A (0)"}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-16">
        {activeTab === "detail" && (
          <div className="prose max-w-none">
            <div className="bg-muted/50 rounded-xl p-8 text-center text-muted-foreground">
              <p className="text-lg">{product.description}</p>
              <p className="mt-4 text-sm">상세 이미지는 준비 중입니다.</p>
            </div>
          </div>
        )}

        {activeTab === "review" && (
          <div>
            {reviewStats.count > 0 && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 mb-8 p-6 bg-muted/50 rounded-xl">
                <div className="text-center min-w-[80px]">
                  <div className="text-4xl font-bold text-foreground">{reviewStats.average}</div>
                  <div className="flex items-center justify-center mt-1">
                    {[1, 2, 3, 4, 5].map((s) => (<Star key={s} size={16} className={s <= Math.round(reviewStats.average) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />))}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{reviewStats.count}개 리뷰</div>
                </div>
                <div className="flex-1 space-y-1 w-full">
                  {[5, 4, 3, 2, 1].map((s) => (
                    <div key={s} className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-4">{s}</span>
                      <Star size={12} className="fill-yellow-400 text-yellow-400" />
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-400 rounded-full" style={{ width: reviewStats.count ? `${(reviewStats.distribution[s - 1] / reviewStats.count) * 100}%` : "0%" }} />
                      </div>
                      <span className="text-xs text-muted-foreground w-6 text-right">{reviewStats.distribution[s - 1]}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end mb-6">
              <button onClick={() => setShowReviewForm(!showReviewForm)} className="h-9 px-4 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90">
                {showReviewForm ? "취소" : "리뷰 작성"}
              </button>
            </div>

            {showReviewForm && (
              <form onSubmit={handleSubmitReview} className="mb-8 p-6 border border-border rounded-xl space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">별점</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button key={s} type="button" onClick={() => setRating(s)} className="p-0.5">
                        <Star size={24} className={s <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200 hover:text-yellow-300"} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">내용</label>
                  <textarea value={reviewContent} onChange={(e) => setReviewContent(e.target.value)} placeholder="상품에 대한 솔직한 리뷰를 작성해주세요" className="w-full h-28 px-4 py-3 rounded-lg border border-border text-sm resize-none focus:border-primary focus:ring-1 focus:ring-primary outline-none" required />
                </div>
                {reviewError && <p className="text-sm text-red-500">{reviewError}</p>}
                <button type="submit" className="h-10 px-6 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90">리뷰 등록</button>
              </form>
            )}

            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="p-5 border border-border rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex">{[1, 2, 3, 4, 5].map((s) => (<Star key={s} size={14} className={s <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />))}</div>
                        <span className="text-sm font-medium">{review.user.name || review.user.email.split("@")[0]}</span>
                        <span className="text-xs text-muted-foreground">{dayjs(review.createdAt).fromNow()}</span>
                      </div>
                      <button onClick={() => handleDeleteReview(review.id)} className="p-1 rounded hover:bg-red-50 text-muted-foreground hover:text-red-500" title="삭제"><Trash2 size={14} /></button>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">{review.content}</p>
                  </div>
                ))}
              </div>
            ) : !showReviewForm && (
              <div className="text-center py-16 text-muted-foreground">
                <p>아직 작성된 후기가 없습니다.</p>
                <p className="text-sm mt-2">첫 번째 후기를 작성해주세요!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "qna" && (
          <div className="text-center py-16 text-muted-foreground">
            <p>등록된 질문이 없습니다.</p>
            <p className="text-sm mt-2">궁금한 점을 질문해주세요!</p>
          </div>
        )}
      </div>

      {relatedProducts.length > 0 && (
        <section>
          <h3 className="text-xl font-bold text-foreground mb-6">관련 상품</h3>
          <ProductGrid products={relatedProducts} />
        </section>
      )}
    </div>
  );
}
