"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Sparkles, Home, Heart, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/categories", icon: LayoutGrid, label: "카테고리" },
  { href: "/curation", icon: Sparkles, label: "MY쿠레이션" },
  { href: "/", icon: Home, label: "홈", isHome: true },
  { href: "/wishlist", icon: Heart, label: "좋아요" },
  { href: "/mypage", icon: User, label: "마이" },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border sm:hidden">
      <div className="flex items-center justify-around h-14">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 w-full h-full text-[10px] transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <div className="relative">
                {item.isHome ? (
                  <div
                    className={cn(
                      "flex items-center justify-center w-10 h-10 -mt-5 rounded-full border-2 shadow-md",
                      isActive
                        ? "bg-primary border-primary text-white"
                        : "bg-white border-border text-muted-foreground"
                    )}
                  >
                    <item.icon size={22} />
                  </div>
                ) : (
                  <item.icon size={20} />
                )}
              </div>
              <span className={item.isHome ? "-mt-0.5" : ""}>{item.label}</span>
            </Link>
          );
        })}
      </div>
      {/* Safe area for notch devices */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
