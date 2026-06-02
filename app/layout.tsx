import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "AI 리뷰 작성기",
  description: "간단한 내용으로 완성도 높은 리뷰를 작성하세요",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-background min-h-screen">
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
