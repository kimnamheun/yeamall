import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { getUser } from "@/actions/auth";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  const headerUser = user ? { email: user.email!, name: user.user_metadata?.name } : null;

  return (
    <div className="flex min-h-screen flex-col">
      <Header user={headerUser} />
      <main className="flex-1 bg-muted/30">{children}</main>
      <Footer />
    </div>
  );
}
