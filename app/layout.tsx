import type { Metadata } from "next";
import "./globals.css";
import { RoleProvider } from "@/lib/role-context";

export const metadata: Metadata = {
  title: "Creators Hub — Kontent platformasi",
  description: "Kontent yaratuvchilar va brendlar uchun platforma. Portfolio, vakansiyalar, hackatonlar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className="h-full">
      <body className="min-h-full bg-black text-white antialiased">
        <RoleProvider>{children}</RoleProvider>
      </body>
    </html>
  );
}
