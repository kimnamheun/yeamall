import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "YeAmall - 건어물 전문 쇼핑몰",
    template: "%s | YeAmall",
  },
  description:
    "신선한 건어물, 멸치, 오징어, 해산물을 합리적인 가격에 만나보세요. 7만원 이상 무료배송!",
  keywords: ["건어물", "멸치", "오징어", "해산물", "건어물 쇼핑몰", "YeAmall"],
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Quicksand:wght@600;700&display=swap"
          rel="stylesheet"
        />
        <script src="https://cdn.portone.io/v2/browser-sdk.js" defer />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
