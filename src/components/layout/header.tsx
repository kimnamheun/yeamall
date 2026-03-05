"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ShoppingCart, User, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
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
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white">
      <div className="bg-primary text-primary-foreground text-center text-sm py-1.5 px-4">
        7만원 이상 구매 시 <strong>무료배송</strong> | 신규회원 가입 시 <strong>5,000원 할인쿠폰</strong> 즉시 지급!
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <button
            className="lg:hidden p-2 -ml-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="메뉴"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
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
            <button className="sm:hidden p-2" aria-label="검색">
              <Search size={22} />
            </button>

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

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-white">
          <div className="px-4 py-3">
            <input
              type="text"
              placeholder="건어물 검색..."
              className="w-full h-10 px-4 rounded-lg border border-border focus:border-primary outline-none text-sm"
            />
          </div>
          <nav className="px-4 pb-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="flex items-center gap-3 py-3 border-b border-border/50 text-sm hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="text-lg">{cat.icon}</span>
                <span>{cat.name}</span>
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  href="/mypage"
                  className="flex items-center gap-3 py-3 border-b border-border/50 text-sm hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User size={18} />
                  <span>마이페이지</span>
                </Link>
                <button
                  onClick={() => { setMobileMenuOpen(false); handleSignOut(); }}
                  className="flex items-center gap-3 py-3 text-sm hover:text-primary transition-colors w-full"
                >
                  <LogOut size={18} />
                  <span>로그아웃</span>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-3 py-3 text-sm hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User size={18} />
                <span>로그인 / 회원가입</span>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
