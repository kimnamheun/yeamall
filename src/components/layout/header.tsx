"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ShoppingCart, User, Menu, X, LogOut, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useCartStore } from "@/stores/use-cart-store";
import { CATEGORIES } from "@/lib/constants";
import { signOut } from "@/actions/auth";

interface HeaderProps {
  user?: { email: string; name?: string } | null;
}

export default function Header({ user }: HeaderProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const totalItems = useCartStore((s) => s.getTotalItems());

  // 메뉴 열릴 때 body 스크롤 방지
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.refresh();
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-white">
        <div className="bg-primary text-primary-foreground text-center text-sm py-1.5 px-4">
          7만원 이상 구매 시 <strong>무료배송</strong> | 신규회원 가입 시 <strong>5,000원 할인쿠폰</strong> 즉시 지급!
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            <button
              className="lg:hidden p-2 -ml-2"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="메뉴"
            >
              <Menu size={24} />
            </button>

            <Link href="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-primary">YeAMall</h1>
            </Link>

            <form onSubmit={handleSearch} className="hidden sm:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="건어물 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-4 pr-10 rounded-full border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 h-10 w-10 flex items-center justify-center rounded-r-full bg-primary text-white hover:bg-primary/90 transition-colors"
                  aria-label="검색"
                >
                  <Search size={18} />
                </button>
              </div>
            </form>

            <div className="flex items-center gap-2">
              <Link href="/search" className="sm:hidden p-2" aria-label="검색">
                <Search size={22} />
              </Link>

              <Link href="/cart" className="relative p-2 hover:text-primary transition-colors">
                <ShoppingCart size={22} />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="hidden sm:flex items-center gap-2">
                  <Link
                    href="/mypage"
                    className="flex items-center gap-1.5 px-3 py-2 text-sm hover:text-primary transition-colors"
                  >
                    <User size={18} />
                    <span>{user.name || "마이페이지"}</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="p-2 text-muted-foreground hover:text-primary transition-colors"
                    aria-label="로그아웃"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm hover:text-primary transition-colors"
                >
                  <User size={18} />
                  <span>로그인</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 모바일 사이드 메뉴 오버레이 */}
      <div
        className={`fixed inset-0 z-[100] bg-black/40 lg:hidden transition-opacity duration-300 ${
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* 모바일 사이드 메뉴 (왼쪽 슬라이드, 화면 약 65%) */}
      <div
        className={`fixed top-0 left-0 z-[110] h-full w-[65vw] max-w-[280px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* 닫기 버튼 */}
        <button
          className="absolute top-3 right-3 p-1.5 text-white/80 hover:text-white z-10"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="닫기"
        >
          <X size={20} />
        </button>

        {/* 로그인 영역 */}
        <div className="bg-gradient-to-br from-primary to-primary/80 text-white p-5 pt-6 pb-5">
          {user ? (
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20">
                  <User size={20} />
                </div>
                <div>
                  <p className="font-semibold text-sm">{user.name || user.email}</p>
                  <p className="text-[11px] text-white/70">반갑습니다!</p>
                </div>
              </div>
              <div className="flex gap-2 text-xs">
                <Link
                  href="/mypage"
                  className="flex-1 text-center py-2 rounded-md bg-white/20 hover:bg-white/30 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  마이페이지
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleSignOut();
                  }}
                  className="flex-1 text-center py-2 rounded-md bg-white/20 hover:bg-white/30 transition-colors"
                >
                  로그아웃
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="font-semibold text-sm mb-1">로그인 해주세요</p>
              <p className="text-[11px] text-white/70 mb-3">
                회원 혜택을 누려보세요
              </p>
              <div className="flex gap-2 text-xs">
                <Link
                  href="/login"
                  className="flex-1 text-center py-2 rounded-md bg-white text-primary font-semibold hover:bg-gray-100 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  로그인
                </Link>
                <Link
                  href="/register"
                  className="flex-1 text-center py-2 rounded-md border border-white/50 hover:bg-white/20 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  회원가입
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* 메뉴 리스트 */}
        <nav className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 170px)" }}>
          <div className="px-4 pt-4 pb-1">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              카테고리
            </p>
          </div>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="flex items-center justify-between px-4 py-3 text-sm hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="flex items-center gap-2.5">
                <span className="text-lg">{cat.icon}</span>
                <span>{cat.name}</span>
              </span>
              <ChevronRight size={14} className="text-muted-foreground" />
            </Link>
          ))}

          <div className="border-t border-border mt-2 pt-2">
            <Link
              href="/products"
              className="flex items-center justify-between px-4 py-3 text-sm hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>전체상품 보기</span>
              <ChevronRight size={14} className="text-muted-foreground" />
            </Link>
            <Link
              href="/cart"
              className="flex items-center justify-between px-4 py-3 text-sm hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="flex items-center gap-2">
                장바구니
                {totalItems > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white px-1">
                    {totalItems}
                  </span>
                )}
              </span>
              <ChevronRight size={14} className="text-muted-foreground" />
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
