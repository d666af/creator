"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/feed", label: "Лента" },
  { href: "/specialists", label: "Специалисты" },
  { href: "/jobs", label: "Вакансии" },
  { href: "/hackathons", label: "Хакатоны" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-[#111111] rounded-[10px] flex items-center justify-center">
              <span className="text-white text-xs font-bold tracking-tight">CH</span>
            </div>
            <span
              className="font-bold text-[#111111] tracking-tight"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "15px" }}
            >
              Creators Hub
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3.5 py-2 rounded-[10px] text-sm font-medium transition-colors duration-150",
                  pathname === link.href
                    ? "bg-[#F3F4F6] text-[#111111]"
                    : "text-[#6B7280] hover:text-[#111111] hover:bg-[#F9F9FB]"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="hidden sm:flex">
            Разместить вакансию
          </Button>
          <Link href="/auth">
            <Button size="sm">Войти</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
