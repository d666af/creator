import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Creators Hub — Платформа для создателей контента",
  description: "Профессиональная платформа для мобилографов, монтажёров, сценаристов и брендов. Портфолио, биржа вакансий, хакатоны.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
