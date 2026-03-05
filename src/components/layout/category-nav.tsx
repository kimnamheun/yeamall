import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";

export default function CategoryNav() {
  return (
    <nav className="hidden lg:block border-b border-border bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ul className="flex items-center justify-center gap-1">
          <li>
            <Link
              href="/products"
              className="flex items-center px-4 py-3 text-sm font-semibold text-foreground hover:text-primary transition-colors"
            >
              전체상품
            </Link>
          </li>
          {CATEGORIES.map((cat) => (
            <li key={cat.slug}>
              <Link
                href={`/categories/${cat.slug}`}
                className="flex items-center gap-1.5 px-3 py-3 text-sm text-foreground hover:text-primary transition-colors"
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
