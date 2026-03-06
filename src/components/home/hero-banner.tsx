"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const slides = [
  {
    title: "신선한 건어물을\n합리적인 가격에",
    subtitle: "산지에서 직접 공수한 프리미엄 건어물",
    cta: { label: "전체상품 보기", href: "/products" },
    bg: "from-blue-50 via-white to-sky-50",
    accent: "text-primary",
  },
  {
    title: "봄맞이\n선물세트 특가",
    subtitle: "소중한 분께 건강한 선물을 전하세요",
    cta: { label: "선물세트 보기", href: "/categories/gift-set" },
    bg: "from-amber-50 via-white to-orange-50",
    accent: "text-amber-600",
  },
  {
    title: "7만원 이상\n무료배송",
    subtitle: "신규회원 가입 시 5,000원 할인쿠폰 즉시 지급!",
    cta: { label: "회원가입 하기", href: "/register" },
    bg: "from-green-50 via-white to-emerald-50",
    accent: "text-emerald-600",
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="relative overflow-hidden">
      <div
        className={cn(
          "bg-gradient-to-br transition-colors duration-700",
          slide.bg
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="text-center">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4 whitespace-pre-line leading-tight">
              {slide.title.split("\n").map((line, i) => (
                <span key={i}>
                  {i === 0 ? (
                    <>
                      {line.slice(0, 3)}
                      <span className={slide.accent}>{line.slice(3)}</span>
                    </>
                  ) : (
                    line
                  )}
                  {i < slide.title.split("\n").length - 1 && <br />}
                </span>
              ))}
            </h2>
            <p className="text-sm sm:text-lg text-muted-foreground mb-6 sm:mb-8">
              {slide.subtitle}
            </p>
            <Link
              href={slide.cta.href}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 sm:px-8 py-2.5 sm:py-3 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
            >
              {slide.cta.label}
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* 좌우 화살표 */}
      <button
        onClick={prev}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/80 shadow flex items-center justify-center hover:bg-white transition-colors"
        aria-label="이전"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={next}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/80 shadow flex items-center justify-center hover:bg-white transition-colors"
        aria-label="다음"
      >
        <ChevronRight size={18} />
      </button>

      {/* 인디케이터 */}
      <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === current ? "w-6 bg-primary" : "w-1.5 bg-gray-300"
            )}
            aria-label={`배너 ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
