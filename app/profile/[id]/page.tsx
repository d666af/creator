"use client";
import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { mockCreators } from "@/lib/mock-data";
import { ArrowLeft, Star, MapPin, MessageCircle, ExternalLink, Play, X } from "lucide-react";
import { use } from "react";

type Tab = "portfolio" | "about" | "reviews";

export default function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState<Tab>("portfolio");
  const [selectedWork, setSelectedWork] = useState<(typeof mockCreators)[0]["portfolio"][0] | null>(null);

  const creator = mockCreators.find((c) => c.id === id) ?? mockCreators[0];

  return (
    <div className="min-h-screen bg-[#F9F9FB]">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-8">
        <Link
          href="/specialists"
          className="inline-flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#111111] mb-8 transition-colors"
        >
          <ArrowLeft size={14} /> Все специалисты
        </Link>

        {/* Profile Header */}
        <Card className="p-8 mb-6">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="relative flex-shrink-0">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-bold"
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

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1
                  className="text-2xl font-bold text-[#111111]"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {creator.name}
                </h1>
                {creator.isPro && (
                  <span className="text-xs bg-[#111111] text-white px-2 py-1 rounded-[8px] font-semibold">
                    PRO ✓
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {creator.specializations.map((s) => (
                  <Badge key={s} variant="accent">{s}</Badge>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-[#6B7280] mb-4">
                <span className="flex items-center gap-1.5">
                  <MapPin size={13} />
                  {creator.city}
                </span>
                <span className="flex items-center gap-1.5">
                  <Star size={13} className="text-amber-400 fill-amber-400" />
                  {creator.rating} ({creator.reviewsCount} отзывов)
                </span>
                {creator.status === "free" ? (
                  <span className="flex items-center gap-1.5 text-green-600 font-medium">
                    <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                    Свободен для проектов
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-amber-600 font-medium">
                    <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                    Занят до {creator.busyUntil}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <Button>
                  <MessageCircle size={16} />
                  Написать
                </Button>
                <Button variant="outline">
                  <ExternalLink size={16} />
                  Поделиться
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-3 text-center sm:text-right">
              <div>
                <p className="text-2xl font-bold text-[#111111]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {creator.portfolioCount}
                </p>
                <p className="text-xs text-[#6B7280]">работ в портфолио</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-[#E5E7EB] rounded-[14px] p-1 mb-6 w-fit shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
          {([
            { id: "portfolio", label: "Портфолио" },
            { id: "about", label: "О себе и опыт" },
            { id: "reviews", label: `Отзывы (${creator.reviews.length})` },
          ] as { id: Tab; label: string }[]).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-[10px] text-sm font-medium transition-all duration-150 cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[#111111] text-white"
                  : "text-[#6B7280] hover:text-[#111111]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Portfolio Tab */}
        {activeTab === "portfolio" && (
          <div className="animate-fade-in">
            {creator.portfolio.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-[#6B7280]">Пока нет работ в портфолио</p>
              </Card>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {creator.portfolio.map((work) => (
                  <div
                    key={work.id}
                    onClick={() => setSelectedWork(work)}
                    className={`relative rounded-[14px] overflow-hidden cursor-pointer group border border-[#E5E7EB] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-all duration-200 hover:-translate-y-0.5 ${
                      work.aspect === "9:16" ? "aspect-[9/16]" : "aspect-video"
                    }`}
                    style={{
                      background: `linear-gradient(135deg, ${work.thumbnail}22, ${work.thumbnail}55)`,
                    }}
                  >
                    <div
                      className="absolute inset-0"
                      style={{ backgroundColor: `${work.thumbnail}18` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                        style={{ backgroundColor: work.thumbnail }}
                      >
                        <Play size={18} fill="white" className="text-white ml-0.5" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                      <p className="text-white text-xs font-semibold leading-tight">{work.title}</p>
                      <p className="text-white/70 text-[10px] mt-0.5">{work.views} просмотров</p>
                    </div>
                    {work.type === "video" && (
                      <div className="absolute top-2.5 right-2.5">
                        <span className="text-[10px] bg-black/50 text-white px-1.5 py-0.5 rounded-full backdrop-blur-sm font-medium">
                          {work.aspect}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* About Tab */}
        {activeTab === "about" && (
          <div className="animate-fade-in space-y-4">
            <Card className="p-6">
              <h3
                className="font-bold text-[#111111] mb-3"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                О себе
              </h3>
              <p className="text-[#6B7280] text-sm leading-relaxed">{creator.bio}</p>
            </Card>

            <Card className="p-6">
              <h3
                className="font-bold text-[#111111] mb-4"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Специализации
              </h3>
              <div className="flex flex-wrap gap-2">
                {creator.specializations.map((s) => (
                  <Badge key={s} variant="accent" className="text-sm px-3 py-1.5">
                    {s}
                  </Badge>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3
                className="font-bold text-[#111111] mb-4"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Тарифы
              </h3>
              <div className="space-y-3">
                {[
                  { name: "Один Reels / Short", price: "от 5 000 ₽" },
                  { name: "Пакет: 10 Reels в месяц", price: "от 35 000 ₽" },
                  { name: "Полное ведение Instagram (съёмка + монтаж)", price: "от 80 000 ₽/мес" },
                ].map((tariff) => (
                  <div key={tariff.name} className="flex justify-between items-center py-2.5 border-b border-[#F3F4F6] last:border-0">
                    <span className="text-sm text-[#111111]">{tariff.name}</span>
                    <span className="text-sm font-semibold text-[#111111]">{tariff.price}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <div className="animate-fade-in space-y-4">
            {creator.reviews.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-[#6B7280]">Пока нет отзывов</p>
              </Card>
            ) : (
              creator.reviews.map((review, i) => (
                <Card key={i} className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold text-[#111111] text-sm">{review.author}</p>
                      <p className="text-xs text-[#6B7280]">{review.company}</p>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star
                          key={j}
                          size={14}
                          className={j < review.rating ? "text-amber-400 fill-amber-400" : "text-[#E5E7EB] fill-[#E5E7EB]"}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-[#6B7280] leading-relaxed">{review.text}</p>
                </Card>
              ))
            )}
          </div>
        )}
      </div>

      {/* Work detail modal */}
      {selectedWork && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedWork(null)}
        >
          <div
            className="bg-white rounded-[20px] max-w-lg w-full p-6 shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-5">
              <h3
                className="text-xl font-bold text-[#111111]"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {selectedWork.title}
              </h3>
              <button
                onClick={() => setSelectedWork(null)}
                className="w-8 h-8 rounded-full bg-[#F3F4F6] flex items-center justify-center hover:bg-[#E5E7EB] transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            <div
              className={`rounded-[14px] mb-5 flex items-center justify-center ${
                selectedWork.aspect === "9:16" ? "aspect-[9/16] max-h-64" : "aspect-video"
              }`}
              style={{
                background: `linear-gradient(135deg, ${selectedWork.thumbnail}22, ${selectedWork.thumbnail}55)`,
              }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
                style={{ backgroundColor: selectedWork.thumbnail }}
              >
                <Play size={22} fill="white" className="text-white ml-0.5" />
              </div>
            </div>

            <div className="space-y-3">
              {[
                { label: "Задача", value: selectedWork.task },
                { label: "Что сделано", value: selectedWork.work },
                { label: "Результат", value: selectedWork.result },
              ].map((item) => (
                <div key={item.label} className="p-3.5 bg-[#F9F9FB] rounded-[12px]">
                  <p className="text-xs font-semibold text-[#6B7280] mb-1 uppercase tracking-wide">{item.label}</p>
                  <p className="text-sm text-[#111111]">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-sm text-[#6B7280]">
                <Star size={13} className="text-amber-400 fill-amber-400" />
                {selectedWork.views} просмотров
              </div>
              <Button size="sm">Обсудить проект</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
