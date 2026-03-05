"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { useCartStore } from "@/stores/use-cart-store";
import { formatPrice } from "@/lib/utils";
import { SHIPPING } from "@/lib/constants";

export default function CheckoutPage() {
  const { items, getTotalPrice, getShippingFee } = useCartStore();
  const [form, setForm] = useState({
    recipientName: "",
    recipientPhone: "",
    zipCode: "",
    address: "",
    addressDetail: "",
    deliveryMemo: "",
    paymentMethod: "card",
  });

  const totalPrice = getTotalPrice();
  const shippingFee = getShippingFee();
  const grandTotal = totalPrice + shippingFee;

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleOrder = async () => {
    if (!form.recipientName || !form.recipientPhone || !form.address) {
      alert("배송 정보를 모두 입력해주세요.");
      return;
    }
    // TODO: 포트원 결제 연동
    alert("포트원(PortOne) 연동 후 결제가 가능합니다.");
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-lg text-muted-foreground mb-4">
          주문할 상품이 없습니다.
        </p>
        <Link href="/products" className="text-primary hover:underline">
          쇼핑하러 가기
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      {/* 헤더 */}
      <div className="flex items-center gap-3 mb-8">
        <Link href="/cart" className="text-muted-foreground hover:text-foreground">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-2xl font-bold text-foreground">주문/결제</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 왼쪽: 폼 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 배송 정보 */}
          <div className="rounded-xl bg-white border border-border p-6">
            <h2 className="font-semibold text-foreground mb-4">배송 정보</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">받는 분</label>
                  <input
                    type="text"
                    value={form.recipientName}
                    onChange={(e) => updateField("recipientName", e.target.value)}
                    placeholder="홍길동"
                    className="w-full h-11 px-3 rounded-lg border border-border focus:border-primary outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">연락처</label>
                  <input
                    type="tel"
                    value={form.recipientPhone}
                    onChange={(e) => updateField("recipientPhone", e.target.value)}
                    placeholder="010-1234-5678"
                    className="w-full h-11 px-3 rounded-lg border border-border focus:border-primary outline-none text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">주소</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={form.zipCode}
                    readOnly
                    placeholder="우편번호"
                    className="w-32 h-11 px-3 rounded-lg border border-border bg-muted/50 text-sm"
                  />
                  <button className="h-11 px-4 rounded-lg border border-border text-sm hover:bg-muted transition-colors">
                    주소 검색
                  </button>
                </div>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  placeholder="기본 주소"
                  className="w-full h-11 px-3 rounded-lg border border-border focus:border-primary outline-none text-sm mb-2"
                />
                <input
                  type="text"
                  value={form.addressDetail}
                  onChange={(e) => updateField("addressDetail", e.target.value)}
                  placeholder="상세 주소 (동/호수)"
                  className="w-full h-11 px-3 rounded-lg border border-border focus:border-primary outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">배송 메모</label>
                <select
                  value={form.deliveryMemo}
                  onChange={(e) => updateField("deliveryMemo", e.target.value)}
                  className="w-full h-11 px-3 rounded-lg border border-border focus:border-primary outline-none text-sm"
                >
                  <option value="">배송 메모를 선택해주세요</option>
                  <option value="문 앞에 놓아주세요">문 앞에 놓아주세요</option>
                  <option value="경비실에 맡겨주세요">경비실에 맡겨주세요</option>
                  <option value="택배함에 넣어주세요">택배함에 넣어주세요</option>
                  <option value="배송 전 연락 바랍니다">배송 전 연락 바랍니다</option>
                </select>
              </div>
            </div>
          </div>

          {/* 주문 상품 */}
          <div className="rounded-xl bg-white border border-border p-6">
            <h2 className="font-semibold text-foreground mb-4">
              주문 상품 ({items.length})
            </h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center gap-3 py-2">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <Image
                      src={item.thumbnailUrl || "/images/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                    <p className="text-xs text-muted-foreground">수량: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold">
                    {formatPrice((item.salePrice ?? item.price) * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 결제 수단 */}
          <div className="rounded-xl bg-white border border-border p-6">
            <h2 className="font-semibold text-foreground mb-4">결제 수단</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { value: "card", label: "신용카드" },
                { value: "transfer", label: "계좌이체" },
                { value: "phone", label: "휴대폰결제" },
                { value: "virtual", label: "가상계좌" },
              ].map((method) => (
                <button
                  key={method.value}
                  onClick={() => updateField("paymentMethod", method.value)}
                  className={`h-12 rounded-lg border text-sm font-medium transition-colors ${
                    form.paymentMethod === method.value
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border text-muted-foreground hover:border-foreground"
                  }`}
                >
                  {method.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 오른쪽: 결제 요약 */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl bg-white border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">결제 금액</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">상품금액</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">배송비</span>
                <span className={shippingFee === 0 ? "text-green-600" : ""}>
                  {shippingFee === 0 ? "무료" : formatPrice(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">할인</span>
                <span>0원</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between">
                <span className="font-semibold">총 결제금액</span>
                <span className="text-xl font-bold text-primary">
                  {formatPrice(grandTotal)}
                </span>
              </div>
            </div>

            <button
              onClick={handleOrder}
              className="w-full mt-6 h-14 rounded-xl bg-primary text-white font-semibold text-lg hover:bg-primary/90 transition-colors"
            >
              {formatPrice(grandTotal)} 결제하기
            </button>

            <p className="mt-3 text-xs text-center text-muted-foreground">
              주문 내용을 확인하였으며 결제에 동의합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
