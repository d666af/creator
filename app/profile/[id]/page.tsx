"use client";

import { use } from "react";
import { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { mockCreators } from "@/lib/mock-data";
import { MapPin, MessageCircle, Star, Play, ChevronLeft, X, Award } from "lucide-react";

type Tab = "portfolio" | "about" | "reviews";
type Work = (typeof mockCreators)[number]["portfolio"][number];

export default function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [tab, setTab] = useState<Tab>("portfolio");
  const [work, setWork] = useState<Work | null>(null);

  const creator = mockCreators.find((c) => c.id === id) ?? mockCreators[0];

  const TABS: { id: Tab; label: string }[] = [
    { id: "portfolio", label: "Портфолио" },
    { id: "about",     label: "Хақида"    },
    { id: "reviews",   label: "Баҳолар"   },
  ];

  return (
    <AppShell>
      {/* Back */}
      <div className="flex items-center gap-2 px-4 pt-4 pb-2">
        <Link
          href="/"
          className="flex h-9 w-9 items-center justify-center rounded-full"
          style={{ backgroundColor: "#EDECE8" }}
        >
          <ChevronLeft size={18} color="#1C1A17" />
        </Link>
      </div>

      {/* Hero */}
      <div className="flex flex-col items-center px-4 pt-2 pb-6">
        <div
          className="h-[84px] w-[84px] rounded-full p-[3px]"
          style={{ background: "linear-gradient(135deg, #C4956A, #E8C99A, #A07850)" }}
        >
          <div
            className="flex h-full w-full items-center justify-center rounded-full text-2xl font-bold"
            style={{ backgroundColor: "#F5F4F0", border: "2px solid #F5F4F0", color: creator.avatarColor }}
          >
            {creator.avatar}
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <h1 className="text-[20px] font-extrabold" style={{ color: "#1C1A17" }}>
            {creator.name}
          </h1>
          {creator.isPro && (
            <span
              className="rounded-full px-2 py-0.5 text-[11px] font-bold"
              style={{ backgroundColor: "#A07850", color: "#FFFFFF" }}
            >
              PRO
            </span>
          )}
        </div>
        <p className="mt-0.5 text-[14px]" style={{ color: "#74706A" }}>
          {creator.specializations.join(" · ")}
        </p>
        <div className="mt-1 flex items-center gap-1 text-[13px]" style={{ color: "#A8A39B" }}>
          <MapPin size={13} /> {creator.city}
        </div>

        {/* Stats */}
        <div
          className="mt-5 flex w-full max-w-[300px] items-center justify-around rounded-2xl py-4"
          style={{ backgroundColor: "#FFFFFF", border: "1px solid rgba(0,0,0,0.06)" }}
        >
          <StatItem value={creator.portfolioCount} label="ишлар" />
          <div className="h-8 w-px" style={{ backgroundColor: "rgba(0,0,0,0.08)" }} />
          <StatItem value={creator.rating} label="рейтинг" accent />
          <div className="h-8 w-px" style={{ backgroundColor: "rgba(0,0,0,0.08)" }} />
          <StatItem value={creator.reviewsCount} label="баҳолар" />
        </div>

        {/* Actions */}
        <div className="mt-4 flex w-full max-w-[300px] gap-3">
          <button
            className="flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 text-[14px] font-semibold text-white"
            style={{ backgroundColor: "#A07850" }}
          >
            <MessageCircle size={16} /> Ёзиш
          </button>
          <button
            className="flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 text-[14px] font-semibold"
            style={{ backgroundColor: "#EDECE8", color: "#1C1A17", border: "1px solid rgba(0,0,0,0.08)" }}
          >
            <Star size={16} /> Баҳолаш
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4">
        <div
          className="flex rounded-full p-1"
          style={{ backgroundColor: "#EDECE8" }}
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex-1 rounded-full py-2 text-[13px] font-semibold transition-all duration-150"
              style={{
                backgroundColor: tab === t.id ? "#FFFFFF" : "transparent",
                color:           tab === t.id ? "#1C1A17" : "#74706A",
                boxShadow:       tab === t.id ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4">
        {tab === "portfolio" && (
          <div className="grid grid-cols-2 gap-3">
            {creator.portfolio.map((p) => (
              <button
                key={p.id}
                onClick={() => setWork(p)}
                className="relative overflow-hidden rounded-2xl"
                style={{ aspectRatio: p.aspect === "9:16" ? "9/16" : p.aspect === "1:1" ? "1/1" : "16/9",
                         background: `linear-gradient(135deg, ${p.thumbnail}33, ${p.thumbnail}66)` }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full"
                    style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
                  >
                    <Play size={16} color="white" fill="white" />
                  </div>
                </div>
                <span className="absolute bottom-2 left-2 right-2 truncate text-left text-[11px] font-semibold text-white drop-shadow">
                  {p.title}
                </span>
                <span
                  className="absolute right-2 top-2 rounded-md px-1.5 py-0.5 text-[10px] font-medium text-white"
                  style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
                >
                  {p.views}
                </span>
              </button>
            ))}
            {creator.portfolio.length === 0 && (
              <p className="col-span-2 py-10 text-center text-[14px]" style={{ color: "#A8A39B" }}>
                Ҳозирча ишлар йўқ
              </p>
            )}
          </div>
        )}

        {tab === "about" && (
          <div
            className="rounded-2xl p-4"
            style={{ backgroundColor: "#FFFFFF", border: "1px solid rgba(0,0,0,0.06)" }}
          >
            <p className="text-[14px] leading-relaxed" style={{ color: "#4A4640" }}>{creator.bio}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {creator.specializations.map((s) => (
                <span
                  key={s}
                  className="rounded-full px-3 py-1.5 text-[12px] font-semibold"
                  style={{ backgroundColor: "#F0E7D8", color: "#8C6437" }}
                >
                  {s}
                </span>
              ))}
            </div>
            <div className="mt-3">
              {creator.status === "free" ? (
                <span className="rounded-full px-3 py-1.5 text-[12px] font-semibold" style={{ backgroundColor: "#E6F9F0", color: "#1A7A4A" }}>
                  ● Ҳозир бўш
                </span>
              ) : (
                <span className="rounded-full px-3 py-1.5 text-[12px] font-semibold" style={{ backgroundColor: "#FFF5E0", color: "#8C5E00" }}>
                  ● {creator.busyUntil} гача банд
                </span>
              )}
            </div>
          </div>
        )}

        {tab === "reviews" && (
          <div className="flex flex-col gap-3">
            {creator.reviews.length === 0 && (
              <p className="py-10 text-center text-[14px]" style={{ color: "#A8A39B" }}>Ҳозирча баҳолар йўқ</p>
            )}
            {creator.reviews.map((r, i) => (
              <div
                key={i}
                className="rounded-2xl p-4"
                style={{ backgroundColor: "#FFFFFF", border: "1px solid rgba(0,0,0,0.06)" }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-semibold" style={{ color: "#1C1A17" }}>{r.author}</span>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: r.rating }).map((_, j) => (
                      <Star key={j} size={13} fill="#D4AA70" color="#D4AA70" />
                    ))}
                  </div>
                </div>
                <p className="mt-0.5 text-[12px]" style={{ color: "#A8A39B" }}>{r.company}</p>
                <p className="mt-2 text-[14px] leading-relaxed" style={{ color: "#4A4640" }}>{r.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Work bottom sheet */}
      {work && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center">
          <div
            className="absolute inset-0 animate-fade-in"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={() => setWork(null)}
          />
          <div
            className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto animate-slide-up"
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "28px 28px 0 0",
              borderTop: "1px solid rgba(0,0,0,0.07)",
            }}
          >
            <div className="sticky top-0 bg-white pt-3">
              <div className="mx-auto mb-2 h-1.5 w-10 rounded-full" style={{ backgroundColor: "rgba(0,0,0,0.12)" }} />
              <button
                onClick={() => setWork(null)}
                className="absolute right-4 top-3 flex h-8 w-8 items-center justify-center rounded-full"
                style={{ backgroundColor: "#F5F4F0" }}
              >
                <X size={16} color="#74706A" />
              </button>
            </div>
            <div
              className="relative flex items-center justify-center"
              style={{
                aspectRatio: "16/9",
                background: `linear-gradient(135deg, ${work.thumbnail}33, ${work.thumbnail}66)`,
              }}
            >
              <div
                className="flex h-14 w-14 items-center justify-center rounded-full"
                style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
              >
                <Play size={24} color="white" fill="white" />
              </div>
            </div>
            <div className="p-5 pb-10">
              <h3 className="text-[18px] font-bold" style={{ color: "#1C1A17" }}>{work.title}</h3>
              <div className="mt-1 flex items-center gap-1 text-[12px]" style={{ color: "#A8A39B" }}>
                <Award size={13} /> {work.views} кўрилди
              </div>
              <div className="mt-5 space-y-4">
                {[
                  { l: "Вазифа",      v: work.task   },
                  { l: "Иш жараёни", v: work.work   },
                  { l: "Натижа",     v: work.result },
                ].map((row) => (
                  <div key={row.l}>
                    <div className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "#A8A39B" }}>
                      {row.l}
                    </div>
                    <p className="mt-1 text-[14px] leading-relaxed" style={{ color: "#4A4640" }}>{row.v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

function StatItem({ value, label, accent }: { value: number | string; label: string; accent?: boolean }) {
  return (
    <div className="text-center">
      <div className="text-[18px] font-extrabold" style={{ color: accent ? "#A07850" : "#1C1A17" }}>
        {value}
      </div>
      <div className="text-[11px]" style={{ color: "#A8A39B" }}>{label}</div>
    </div>
  );
}
