import Link from "next/link";
import { SITE } from "@/lib/constants";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <header className="border-b border-border bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-14 items-center">
          <Link href="/" className="text-xl text-primary logo-text">
            {SITE.name}
          </Link>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        {children}
      </main>
    </div>
  );
}
