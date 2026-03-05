"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useCartStore } from "@/stores/use-cart-store";
import { formatPrice } from "@/lib/utils";
import { createOrder, confirmPayment } from "@/actions/order";

declare global {
  interface Window {
    PortOne?: {
      requestPayment: (options: Record<string, unknown>) => Promise<{
        code?: string;
        paymentId?: string;
        message?: string;
      }>;
    };
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, getShippingFee, clearCart } = useCartStore();
  const [form, setForm] = useState({
    recipientName: "",
    recipientPhone: "",
    zipCode: "",
    address: "",
    addressDetail: "",
    deliveryMemo: "",
    paymentMethod: "card",
  });
  const [loading, setLoading] = useState(false);

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

    setLoading(true);

    // 1. 주문 생성
    const orderResult = await createOrder({
      items: items.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.salePrice ?? item.price,
        quantity: item.quantity,
      })),
      totalAmount: grandTotal,
      shippingFee,
      recipientName: form.recipientName,
      recipientPhone: form.recipientPhone,
      zipCode: form.zipCode,
      address: form.address,
      addressDetail: form.addressDetail,
      deliveryMemo: form.deliveryMemo,
      paymentMethod: form.paymentMethod,
    });

    if (orderResult.error) {
      alert(orderResult.error);
      setLoading(false);
      return;
    }

    // 2. 포트원 결제
    const storeId = process.env.NEXT_PUBLIC_PORTONE_STORE_ID;
    if (!storeId || !window.PortOne) {
      // 포트원 미설정 시 바로 결제 완료 처리 (테스트)
      await confirmPayment(orderResult.orderId!, `test-${Date.now()}`);
      clearCart();
      alert("주문이 완료되었습니다!");
      router.push("/orders");
      return;
    }

    try {
      const paymentId = `payment-${orderResult.orderId}`;
      const response = await window.PortOne.requestPayment({
        storeId,
        paymentId,
        orderName: items.length === 1
          ? items[0].name
          : `${items[0].name} 외 ${items.length - 1}건`,
        totalAmount: grandTotal,
        currency: "CURRENCY_KRW",
        channelKey: "channel-key-placeholder",
        payMethod: form.paymentMethod === "card" ? "CARD" : "TRANSFER",
        customer: {
          fullName: form.recipientName,
          phoneNumber: form.recipientPhone,
        },
      });

      if (response.code) {
        alert(`결제 실패: ${response.message}`);
        setLoading(false);
        return;
      }

      // 3. 결제 확인
      await confirmPayment(orderResult.orderId!, response.paymentId || paymentId);
      clearCart();
      alert("결제가 완료되었습니다!");
      router.push("/orders");
    } catch {
      alert("결제 중 오류가 발생했습니다.");
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-lg text-muted-foreground mb-4">주문할 상품이 없습니다.</p>
        <Link href="/products" className="text-primary hover:underline">쇼핑하러 가기</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/cart" className="text-muted-foreground hover:text-foreground">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-2xl font-bold text-foreground">주문/결제</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                  <input type="text" value={form.zipCode} readOnly placeholder="우편번호" className="w-32 h-11 px-3 rounded-lg border border-border bg-muted/50 text-sm" />
                  <button className="h-11 px-4 rounded-lg border border-border text-sm hover:bg-muted transition-colors">주소 검색</button>
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
            <h2 className="font-semibold text-foreground mb-4">주문 상품 ({items.length})</h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center gap-3 py-2">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <Image src={item.thumbnailUrl || "/images/placeholder.svg"} alt={item.name} fill className="object-cover" sizes="64px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                    <p className="text-xs text-muted-foreground">수량: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold">{formatPrice((item.salePrice ?? item.price) * item.quantity)}</p>
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

        {/* 결제 요약 */}
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
              <div className="border-t border-border pt-3 flex justify-between">
                <span className="font-semibold">총 결제금액</span>
                <span className="text-xl font-bold text-primary">{formatPrice(grandTotal)}</span>
              </div>
            </div>
            <button
              onClick={handleOrder}
              disabled={loading}
              className="w-full mt-6 h-14 rounded-xl bg-primary text-white font-semibold text-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? "처리 중..." : `${formatPrice(grandTotal)} 결제하기`}
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
