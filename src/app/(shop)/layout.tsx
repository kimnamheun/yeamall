import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import CategoryNav from "@/components/layout/category-nav";
import MobileBottomNav from "@/components/layout/mobile-bottom-nav";
import { getUser } from "@/actions/auth";

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  const headerUser = user ? { email: user.email!, name: user.user_metadata?.name } : null;

  return (
    <div className="flex min-h-screen flex-col">
      <Header user={headerUser} />
      <CategoryNav />
      <main className="flex-1 pb-14 sm:pb-0">{children}</main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
