"use client";
import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { mockCreators } from "@/lib/mock-data";
import { Search, MapPin, Star, Filter, Lock } from "lucide-react";

type StatusFilter = "all" | "free" | "busy";

const categories = ["Все", "Мобилография", "Монтаж", "Сценарий", "SMM", "Продюсер"];

export default function SpecialistsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Все");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [showProFilter, setShowProFilter] = useState(false);

  const filtered = mockCreators.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.specializations.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    const matchCat = activeCategory === "Все" || c.specializations.some((s) =>
      s.toLowerCase().includes(activeCategory.toLowerCase())
    );
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchCat && matchStatus;
  });

  return (
    <div className="min-h-screen bg-[#F9F9FB]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1
              className="text-2xl font-bold text-[#111111]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Специалисты
            </h1>
            <p className="text-sm text-[#6B7280] mt-0.5">{filtered.length} из {mockCreators.length} профессионалов</p>
          </div>
        </div>

        {/* Search + filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Поиск по имени или специализации..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-[#E5E7EB] rounded-[14px] text-sm text-[#111111] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#111111] transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.03)]"
            />
          </div>
          <div className="flex gap-2">
            {(["all", "free", "busy"] as StatusFilter[]).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3.5 py-2.5 rounded-[12px] text-sm font-medium transition-all duration-150 cursor-pointer border whitespace-nowrap ${
                  statusFilter === s
                    ? "bg-[#111111] text-white border-[#111111]"
                    : "bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#D1D5DB]"
                }`}
              >
                {s === "all" ? "Все" : s === "free" ? "🟢 Свободны" : "🟡 Заняты"}
              </button>
            ))}
          </div>
        </div>

        {/* Category filters */}
        <div className="flex gap-2 flex-wrap mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-2 rounded-[10px] text-sm font-medium transition-all duration-150 cursor-pointer border ${
                activeCategory === cat
                  ? "bg-[#111111] text-white border-[#111111]"
                  : "bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#D1D5DB]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Advanced filters (B2B) */}
        <div className="bg-white border border-[#E5E7EB] rounded-[14px] p-4 mb-6 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter size={15} className="text-[#6B7280]" />
              <span className="text-sm font-medium text-[#6B7280]">Расширенные фильтры</span>
              <Badge variant="pro" className="text-[10px]">B2B</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Lock size={13} className="text-[#9CA3AF]" />
              <span className="text-xs text-[#9CA3AF]">Доступно по подписке</span>
              <Button size="sm" variant="accent">Подключить B2B</Button>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 opacity-40 pointer-events-none select-none">
            {[
              "Наличие камеры Sony FX",
              "Опыт в нише Авто",
              "Свободны прямо сейчас",
              "Проекты от 100K просмотров",
              "Работа с брендами",
            ].map((filter) => (
              <span key={filter} className="px-3 py-1.5 bg-[#F3F4F6] text-[#6B7280] rounded-[8px] text-xs">
                {filter}
              </span>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((creator) => (
            <Link key={creator.id} href={`/profile/${creator.id}`}>
              <Card hover className="p-5">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                      style={{ backgroundColor: creator.avatarColor }}
                    >
                      {creator.avatar}
                    </div>
                    {creator.status === "free" ? (
                      <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-green-500 rounded-full border-2 border-white" />
                    ) : (
                      <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-amber-400 rounded-full border-2 border-white" />
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 mb-1">
                    <p
                      className="font-bold text-[#111111]"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      {creator.name}
                    </p>
                    {creator.isPro && (
                      <span className="text-[10px] bg-[#111111] text-white px-1.5 py-0.5 rounded-[5px] font-bold">PRO</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-xs text-[#6B7280] mb-3">
                    <MapPin size={10} />
                    {creator.city}
                  </div>

                  <div className="flex flex-wrap justify-center gap-1.5 mb-4">
                    {creator.specializations.map((s) => (
                      <Badge key={s} variant="accent" className="text-[11px]">{s}</Badge>
                    ))}
                  </div>

                  <div className="w-full border-t border-[#F3F4F6] pt-3 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star size={12} className="text-amber-400 fill-amber-400" />
                      <span className="text-xs font-semibold text-[#111111]">{creator.rating}</span>
                      <span className="text-xs text-[#6B7280]">({creator.reviewsCount})</span>
                    </div>
                    <div className="text-xs text-[#6B7280]">
                      {creator.portfolioCount} работ
                    </div>
                  </div>

                  <div className="w-full mt-3">
                    {creator.status === "free" ? (
                      <span className="text-xs text-green-600 font-medium">● Свободен для проектов</span>
                    ) : (
                      <span className="text-xs text-amber-600 font-medium">● Занят до {creator.busyUntil}</span>
                    )}
                  </div>
                </div>
              </Card>
            </Link>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full text-center py-16">
              <p className="text-[#6B7280]">Специалистов не найдено. Попробуйте другие фильтры.</p>
            </div>
          )}
        </div>

        {/* PRO upgrade banner */}
        <div className="mt-10 bg-[#111111] rounded-[20px] p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-1/2 w-96 h-96 rounded-full bg-white -translate-x-1/2 -translate-y-32" />
          </div>
          <div className="relative">
            <Badge variant="pro" className="mb-3 text-xs">PRO-подписка</Badge>
            <h2
              className="text-2xl font-bold text-white mb-2"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Безлимитное портфолио и приоритетные отклики
            </h2>
            <p className="text-white/60 text-sm mb-5 max-w-md mx-auto">
              Загружайте неограниченное количество работ, получайте приоритет в выдаче и значок верификации.
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>990 ₽</p>
                <p className="text-xs text-white/50">в месяц</p>
              </div>
              <Button size="lg" variant="secondary">Подключить PRO</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
