import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "YeAMall - 건어물 전문 쇼핑몰",
    template: "%s | YeAMall",
  },
  description:
    "신선한 건어물, 멸치, 오징어, 해산물을 합리적인 가격에 만나보세요. 7만원 이상 무료배송!",
  keywords: ["건어물", "멸치", "오징어", "해산물", "건어물 쇼핑몰", "YeAMall"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        <script src="https://cdn.portone.io/v2/browser-sdk.js" defer />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
