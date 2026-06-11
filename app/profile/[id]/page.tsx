"use client";

import { useState, use } from "react";
import { useRole } from "@/lib/role-context";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockCreators } from "@/lib/mock-data";
import { Star, MapPin, Play, X, MessageCircle, Award } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "portfolio" | "about" | "reviews";
type Work = (typeof mockCreators)[number]["portfolio"][number];

export default function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { role } = useRole();
  const [tab, setTab] = useState<Tab>("portfolio");
  const [work, setWork] = useState<Work | null>(null);

  const creator = mockCreators.find((c) => c.id === id) ?? mockCreators[0];
  const accentVariant = role === "b2b" ? "accent-b2b" : "accent-creator";

  const tabs: { id: Tab; label: string }[] = [
    { id: "portfolio", label: "Портфолио" },
    { id: "about", label: "Хақида" },
    { id: "reviews", label: "Баҳолар" },
  ];

  return (
    <AppShell>
      {/* Hero */}
      <div className="relative">
        <div
          className="absolute inset-0 h-44 opacity-50 blur-2xl"
          style={{ background: `linear-gradient(135deg, ${creator.avatarColor}, transparent)` }}
        />
        <div className="relative flex flex-col items-center px-4 pt-8">
          <div className="rounded-full bg-gradient-to-tr from-[#BF5AF2] to-[#0A84FF] p-[3px]">
            <div
              className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-black text-2xl font-bold text-white"
              style={{ backgroundColor: creator.avatarColor }}
            >
              {creator.avatar}
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-white">{creator.name}</h1>
            {creator.isPro && <Badge variant="pro">PRO</Badge>}
          </div>
          <div className="mt-1 text-sm text-[rgba(235,235,245,0.6)]">
            {creator.specializations.join(" • ")}
          </div>
          <div className="mt-1 flex items-center gap-1 text-sm text-[rgba(235,235,245,0.5)]">
            <MapPin size={13} /> {creator.city}
          </div>

          {/* Stats */}
          <div className="mt-5 flex w-full max-w-xs items-center justify-around rounded-2xl border border-white/[0.08] bg-[#1C1C1E] py-3">
            <Stat value={creator.portfolioCount} label="ишлар" />
            <div className="h-8 w-px bg-white/[0.08]" />
            <Stat value={creator.rating} label="рейтинг" gold />
            <div className="h-8 w-px bg-white/[0.08]" />
            <Stat value={creator.reviewsCount} label="баҳолар" />
          </div>

          {/* Buttons */}
          <div className="mt-4 flex w-full max-w-xs gap-2.5">
            <Button variant={accentVariant} size="md" className="flex-1">
              <MessageCircle size={16} /> Ёзиш
            </Button>
            <Button variant="outline" size="md" className="flex-1">
              <Star size={16} /> Баҳолаш
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 px-4">
        <div className="flex rounded-full bg-[#1C1C1E] p-1 border border-white/[0.06]">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex-1 rounded-full py-2 text-[13px] font-semibold transition-all",
                tab === t.id ? "bg-[#3A3A3C] text-white" : "text-[rgba(235,235,245,0.5)]"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4">
        {tab === "portfolio" && (
          <div className="grid grid-cols-2 gap-3">
            {creator.portfolio.map((p) => (
              <button
                key={p.id}
                onClick={() => setWork(p)}
                className={cn(
                  "relative flex items-center justify-center overflow-hidden rounded-2xl",
                  p.aspect === "9:16" ? "aspect-[9/16]" : p.aspect === "1:1" ? "aspect-square" : "aspect-video"
                )}
                style={{ background: `linear-gradient(135deg, ${p.thumbnail}, ${p.thumbnail}55)` }}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black/40 glass">
                  <Play size={18} className="ml-0.5 text-white" fill="white" />
                </div>
                <span className="absolute bottom-2 left-2 right-2 truncate text-left text-[11px] font-medium text-white">
                  {p.title}
                </span>
                <span className="absolute right-2 top-2 rounded-md bg-black/50 px-1.5 py-0.5 text-[10px] text-white">
                  {p.views}
                </span>
              </button>
            ))}
            {creator.portfolio.length === 0 && (
              <p className="col-span-2 py-8 text-center text-sm text-[rgba(235,235,245,0.5)]">
                Ҳозирча ишлар йўқ
              </p>
            )}
          </div>
        )}

        {tab === "about" && (
          <div className="rounded-2xl border border-white/[0.08] bg-[#1C1C1E] p-4">
            <h3 className="text-sm font-bold text-white">Хақида</h3>
            <p className="mt-2 text-sm leading-relaxed text-[rgba(235,235,245,0.7)]">{creator.bio}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {creator.specializations.map((s) => (
                <Badge key={s} variant="creator">
                  {s}
                </Badge>
              ))}
            </div>
            <div className="mt-4">
              {creator.status === "free" ? (
                <Badge variant="success">● Ҳозир бўш</Badge>
              ) : (
                <Badge variant="warning">● {creator.busyUntil} гача банд</Badge>
              )}
            </div>
          </div>
        )}

        {tab === "reviews" && (
          <div className="flex flex-col gap-3">
            {creator.reviews.length === 0 && (
              <p className="py-8 text-center text-sm text-[rgba(235,235,245,0.5)]">Ҳозирча баҳолар йўқ</p>
            )}
            {creator.reviews.map((r, i) => (
              <div key={i} className="rounded-2xl border border-white/[0.08] bg-[#1C1C1E] p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-white">{r.author}</div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: r.rating }).map((_, j) => (
                      <Star key={j} size={13} fill="#FFD60A" className="text-[#FFD60A]" />
                    ))}
                  </div>
                </div>
                <div className="text-xs text-[rgba(235,235,245,0.5)]">{r.company}</div>
                <p className="mt-2 text-sm text-[rgba(235,235,245,0.7)]">{r.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Work bottom sheet */}
      {work && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/60 animate-fade-in" onClick={() => setWork(null)} />
          <div className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-t-[28px] border-t border-white/[0.08] bg-[#1C1C1E] pb-10 animate-sheet">
            <div className="sticky top-0 z-10 bg-[#1C1C1E] pt-2.5">
              <div className="mx-auto mb-1 h-1.5 w-10 rounded-full bg-white/20" />
              <button onClick={() => setWork(null)} className="absolute right-4 top-3 text-[rgba(235,235,245,0.5)]">
                <X size={22} />
              </button>
            </div>
            <div
              className={cn(
                "relative flex items-center justify-center",
                work.aspect === "9:16" ? "aspect-[9/16] max-h-72" : "aspect-video"
              )}
              style={{ background: `linear-gradient(135deg, ${work.thumbnail}, ${work.thumbnail}55)` }}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/40 glass">
                <Play size={24} className="ml-1 text-white" fill="white" />
              </div>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-bold text-white">{work.title}</h3>
              <div className="mt-1 flex items-center gap-1 text-xs text-[rgba(235,235,245,0.5)]">
                <Award size={13} /> {work.views} кўрилди
              </div>
              <div className="mt-4 space-y-3.5">
                {[
                  { l: "Вазифа", v: work.task },
                  { l: "Иш жараёни", v: work.work },
                  { l: "Натижа", v: work.result },
                ].map((row) => (
                  <div key={row.l}>
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-[rgba(235,235,245,0.4)]">
                      {row.l}
                    </div>
                    <p className="mt-1 text-sm text-[rgba(235,235,245,0.75)]">{row.v}</p>
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

function Stat({ value, label, gold }: { value: number | string; label: string; gold?: boolean }) {
  return (
    <div className="text-center">
      <div className={cn("text-lg font-extrabold", gold ? "text-[#FFD60A]" : "text-white")}>{value}</div>
      <div className="text-[11px] text-[rgba(235,235,245,0.5)]">{label}</div>
    </div>
  );
}
