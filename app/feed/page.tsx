"use client";

import { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockCreators, mockPosts } from "@/lib/mock-data";
import { Play, Heart, MessageCircle, Eye, Share2, MoreHorizontal, Plus, Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "lenta" | "trends" | "discuss";

export default function FeedPage() {
  const [tab, setTab] = useState<Tab>("lenta");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const tabs: { id: Tab; label: string }[] = [
    { id: "lenta", label: "Лента" },
    { id: "trends", label: "Трендлар" },
    { id: "discuss", label: "Обсуждение" },
  ];

  const typeLabel: Record<string, string> = { case: "Кейс", question: "Савол", review: "Ревью" };

  return (
    <AppShell>
      {/* Stories */}
      <div className="no-scrollbar flex gap-4 overflow-x-auto px-4 py-3">
        <div className="flex flex-col items-center gap-1.5 shrink-0">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-white/20">
            <Plus size={22} className="text-white/60" />
          </div>
          <span className="text-[11px] text-[rgba(235,235,245,0.6)]">Siz</span>
        </div>
        {mockCreators.map((c) => (
          <Link key={c.id} href={`/profile/${c.id}`} className="flex flex-col items-center gap-1.5 shrink-0">
            <div className="rounded-full bg-gradient-to-tr from-[#BF5AF2] to-[#FF2D55] p-[2.5px]">
              <div className="rounded-full border-2 border-black p-[2px]">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: c.avatarColor }}
                >
                  {c.avatar}
                </div>
              </div>
            </div>
            <span className="max-w-16 truncate text-[11px] text-[rgba(235,235,245,0.6)]">
              {c.name.split(" ")[0]}
            </span>
          </Link>
        ))}
      </div>

      {/* Tabs */}
      <div className="sticky top-[60px] z-30 flex gap-6 border-b border-white/[0.08] bg-black/80 px-5 glass">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "relative py-3 text-sm font-semibold transition-colors",
              tab === t.id ? "text-white" : "text-[rgba(235,235,245,0.45)]"
            )}
          >
            {t.label}
            {tab === t.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#BF5AF2]" />
            )}
          </button>
        ))}
      </div>

      {/* Posts */}
      <div className="flex flex-col gap-3 px-3 py-3">
        {mockPosts.map((post) => {
          const isExp = expanded[post.id];
          return (
            <Card key={post.id} className="overflow-hidden">
              <div className="flex items-center gap-3 p-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: post.author.color }}
                >
                  {post.author.avatar}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate text-sm font-semibold text-white">{post.author.name}</span>
                    {post.author.isPro && <Badge variant="pro">PRO</Badge>}
                  </div>
                  <span className="text-xs text-[rgba(235,235,245,0.5)]">{post.author.specialization}</span>
                </div>
                <Badge variant="creator">{typeLabel[post.type]}</Badge>
                <button className="text-[rgba(235,235,245,0.5)]">
                  <MoreHorizontal size={18} />
                </button>
              </div>

              {post.videoColor && (
                <div
                  className={cn(
                    "relative flex items-center justify-center",
                    post.videoAspect === "9:16" ? "aspect-[9/16] max-h-72" : "aspect-video"
                  )}
                  style={{ background: `linear-gradient(135deg, ${post.videoColor}, ${post.videoColor}55)` }}
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/40 glass">
                    <Play size={24} className="ml-1 text-white" fill="white" />
                  </div>
                </div>
              )}

              {post.type === "review" && "reviewScores" in post && post.reviewScores && (
                <div className="flex flex-wrap gap-2 px-3.5 pt-3">
                  {[
                    { l: "Монтаж", v: post.reviewScores.montage },
                    { l: "Сценарий", v: post.reviewScores.scenario },
                    { l: "Цвет", v: post.reviewScores.color },
                  ].map((s) => (
                    <span
                      key={s.l}
                      className="flex items-center gap-1 rounded-full bg-white/[0.08] px-2.5 py-1 text-[11px] font-semibold text-white"
                    >
                      {s.l}: {s.v} <Star size={10} fill="#FFD60A" className="text-[#FFD60A]" />
                    </span>
                  ))}
                </div>
              )}

              <div className="p-3.5">
                <h3 className="text-[15px] font-semibold leading-snug text-white">{post.title}</h3>
                <p className={cn("mt-1 text-sm text-[rgba(235,235,245,0.6)]", !isExp && "line-clamp-2")}>
                  {post.content}
                </p>
                {!isExp && (
                  <button
                    onClick={() => setExpanded((e) => ({ ...e, [post.id]: true }))}
                    className="mt-0.5 text-sm font-medium text-[rgba(235,235,245,0.4)]"
                  >
                    ещё
                  </button>
                )}

                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {post.tags.map((t) => (
                    <span key={t} className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[11px] text-[rgba(235,235,245,0.55)]">
                      #{t}
                    </span>
                  ))}
                </div>

                <div className="mt-3 flex items-center gap-5 text-[rgba(235,235,245,0.6)]">
                  <button className="flex items-center gap-1.5 text-sm">
                    <Heart size={18} /> {post.likes}
                  </button>
                  <button className="flex items-center gap-1.5 text-sm">
                    <MessageCircle size={18} /> {post.comments}
                  </button>
                  <span className="flex items-center gap-1.5 text-sm">
                    <Eye size={18} /> {post.views}
                  </span>
                  <button className="ml-auto">
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </AppShell>
  );
}
