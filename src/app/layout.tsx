import type { Metadata } from "next";
import { Inter, Noto_Sans_KR } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-noto-sans-kr",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "CalorieLens",
  description: "음식 칼로리 추적 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${inter.variable} ${notoSansKR.variable}`}>
      <body style={{ fontFamily: "var(--font-inter), var(--font-noto-sans-kr), sans-serif" }}>
        <AuthProvider>
          <Navbar />
          <main style={{ flex: 1 }}>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
