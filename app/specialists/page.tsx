"use client";

import { useState } from "react";
import Link from "next/link";
import { useRole } from "@/lib/role-context";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockCreators } from "@/lib/mock-data";
import { Search, Star, SlidersHorizontal, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = ["Барчаси", "Мобилограф", "Монтажёр", "Сценарист", "SMM", "Продюсер", "Колорист"];

export default function SpecialistsPage() {
  const { role } = useRole();
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("Барчаси");

  const filtered = mockCreators.filter((c) => {
    const matchQuery =
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.specializations.some((s) => s.toLowerCase().includes(query.toLowerCase()));
    const matchCat = cat === "Барчаси" || c.specializations.some((s) => s.includes(cat));
    return matchQuery && matchCat;
  });

  const pros = mockCreators.filter((c) => c.isPro);

  return (
    <AppShell>
      <div className="px-4 pt-4">
        {/* Search */}
        <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-[#1C1C1E] px-4 py-2.5">
          <Search size={18} className="text-[rgba(235,235,245,0.4)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Мутахассис қидириш..."
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-[rgba(235,235,245,0.4)]"
          />
        </div>

        {role === "b2b" && (
          <div
            className="mt-3 flex items-center justify-between rounded-2xl p-4"
            style={{ background: "linear-gradient(135deg, #0A84FF, #5E5CE6)" }}
          >
            <div>
              <div className="text-sm font-bold text-white">Расширенный поиск</div>
              <div className="text-xs text-white/80">Фильтр бўйича энг яхши мутахассислар</div>
            </div>
            <Button variant="primary" size="sm">
              <SlidersHorizontal size={14} /> Фильтр
            </Button>
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto px-4">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={cn(
              "shrink-0 rounded-full px-4 py-1.5 text-[13px] font-semibold transition-colors",
              cat === c ? "bg-white text-black" : "bg-[#1C1C1E] text-[rgba(235,235,245,0.6)] border border-white/[0.08]"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {/* PRO row */}
      <div className="mb-2 mt-6 px-4">
        <h2 className="text-[17px] font-bold text-white">PRO Специалисты</h2>
      </div>
      <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-1">
        {pros.map((c) => (
          <Link key={c.id} href={`/profile/${c.id}`} className="flex w-[120px] shrink-0 flex-col items-center rounded-2xl border border-white/[0.08] bg-[#1C1C1E] p-3 text-center">
            <div className="rounded-full bg-gradient-to-tr from-[#BF5AF2] to-[#0A84FF] p-[2px]">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-full text-base font-bold text-white"
                style={{ backgroundColor: c.avatarColor }}
              >
                {c.avatar}
              </div>
            </div>
            <div className="mt-2 truncate w-full text-[13px] font-semibold text-white">{c.name.split(" ")[0]}</div>
            <div className="truncate w-full text-[11px] text-[rgba(235,235,245,0.5)]">{c.specializations[0]}</div>
            <div className="mt-1 flex items-center gap-1 text-[11px] text-[#FFD60A]">
              <Star size={11} fill="#FFD60A" /> {c.rating}
            </div>
          </Link>
        ))}
      </div>

      {/* Grid */}
      <div className="mb-2 mt-6 px-4">
        <h2 className="text-[17px] font-bold text-white">Барча мутахассислар</h2>
      </div>
      <div className="grid grid-cols-2 gap-3 px-4">
        {filtered.map((c) => (
          <div key={c.id} className="flex flex-col rounded-2xl border border-white/[0.08] bg-[#1C1C1E] p-4">
            <div className="flex items-start justify-between">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ backgroundColor: c.avatarColor }}
              >
                {c.avatar}
              </div>
              {c.isPro && <Badge variant="pro">PRO</Badge>}
            </div>
            <Link href={`/profile/${c.id}`} className="mt-2.5 truncate text-sm font-semibold text-white">
              {c.name}
            </Link>
            <div className="truncate text-xs text-[rgba(235,235,245,0.5)]">{c.specializations.join(" • ")}</div>
            <div className="mt-1.5 flex items-center gap-2 text-xs">
              <span className="text-[rgba(235,235,245,0.5)]">{c.city}</span>
              <span className="flex items-center gap-1 text-[#FFD60A]">
                <Star size={11} fill="#FFD60A" /> {c.rating}
              </span>
            </div>
            <div className="mt-1.5">
              {c.status === "free" ? (
                <Badge variant="success">● Бўш</Badge>
              ) : (
                <Badge variant="warning">● {c.busyUntil} гача</Badge>
              )}
            </div>
            <Button variant={role === "b2b" ? "accent-b2b" : "accent-creator"} size="sm" className="mt-3 w-full">
              <MessageCircle size={14} /> Ёзиш
            </Button>
          </div>
        ))}
      </div>
      <div className="h-4" />
    </AppShell>
  );
}
