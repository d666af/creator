"use client";

import Link from "next/link";
import { useRole } from "@/lib/role-context";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockCreators, mockPosts, mockJobs } from "@/lib/mock-data";
import { Play, Heart, MessageCircle, Eye, Share2, Star, Plus, ChevronRight } from "lucide-react";

export default function HomePage() {
  const { role } = useRole();
  return <AppShell>{role === "creator" ? <CreatorHome /> : <B2BHome />}</AppShell>;
}

function CreatorHome() {
  return (
    <div className="pt-2">
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

      {/* Feed */}
      <div className="flex flex-col gap-3 px-3 pt-1">
        {mockPosts.map((post) => (
          <FeedPost key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

function FeedPost({ post }: { post: (typeof mockPosts)[number] }) {
  const typeLabel: Record<string, string> = { case: "Кейс", question: "Савол", review: "Ревью" };
  return (
    <Card className="overflow-hidden">
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
          <span className="text-xs text-[rgba(235,235,245,0.5)]">
            {post.author.specialization} • {post.postedAt}
          </span>
        </div>
        <Badge variant="creator">{typeLabel[post.type]}</Badge>
      </div>

      {post.videoColor && (
        <div
          className={`relative flex items-center justify-center ${
            post.videoAspect === "9:16" ? "aspect-[9/16] max-h-96" : "aspect-video"
          }`}
          style={{ background: `linear-gradient(135deg, ${post.videoColor}, ${post.videoColor}55)` }}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/40 glass">
            <Play size={24} className="ml-1 text-white" fill="white" />
          </div>
          <span className="absolute bottom-3 right-3 rounded-md bg-black/50 px-1.5 py-0.5 text-[11px] font-medium text-white">
            {post.views}
          </span>
        </div>
      )}

      <div className="p-3.5">
        <h3 className="text-[15px] font-semibold leading-snug text-white">{post.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-[rgba(235,235,245,0.6)]">{post.content}</p>

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
}

function B2BHome() {
  const topCreators = mockCreators.filter((c) => c.isPro).slice(0, 6);
  return (
    <div className="px-4 pt-4">
      <h1 className="text-2xl font-extrabold text-white">Xush kelibsiz 👋</h1>
      <p className="mt-1 text-sm text-[rgba(235,235,245,0.6)]">
        Bugun jamoangizga kim kerak?
      </p>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-3 gap-2.5">
        {[
          { n: "5", l: "вакансия" },
          { n: "23", l: "отклик" },
          { n: "2", l: "янги" },
        ].map((s) => (
          <div key={s.l} className="rounded-2xl border border-white/[0.08] bg-[#1C1C1E] p-3.5 text-center">
            <div className="text-xl font-extrabold text-white">{s.n}</div>
            <div className="text-[11px] text-[rgba(235,235,245,0.5)]">{s.l}</div>
          </div>
        ))}
      </div>

      {/* Recommended */}
      <SectionHeader title="Тавсия этилган мутахассислар" href="/specialists" />
      <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
        {topCreators.map((c) => (
          <Link
            key={c.id}
            href={`/profile/${c.id}`}
            className="w-40 shrink-0 rounded-2xl border border-white/[0.08] bg-[#1C1C1E] p-4"
          >
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white"
              style={{ backgroundColor: c.avatarColor }}
            >
              {c.avatar}
            </div>
            <div className="mt-2.5 truncate text-sm font-semibold text-white">{c.name}</div>
            <div className="truncate text-xs text-[rgba(235,235,245,0.5)]">
              {c.specializations[0]} • {c.city}
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs text-[#FFD60A]">
              <Star size={12} fill="#FFD60A" /> {c.rating}
            </div>
          </Link>
        ))}
      </div>

      {/* Active jobs */}
      <SectionHeader title="Активные вакансии" href="/jobs" />
      <div className="flex flex-col gap-2.5">
        {mockJobs.slice(0, 3).map((j) => (
          <Link
            key={j.id}
            href="/jobs"
            className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-[#1C1C1E] p-3.5"
          >
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl text-xs font-bold text-white"
              style={{ backgroundColor: j.companyColor }}
            >
              {j.companyInitials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-white">{j.title}</div>
              <div className="text-xs text-[rgba(235,235,245,0.5)]">{j.budget}</div>
            </div>
            <Badge variant="b2b">{j.applicationsCount} отклик</Badge>
          </Link>
        ))}
      </div>

      {/* Top creators */}
      <SectionHeader title="Топ креаторлар" href="/specialists" />
      <div className="flex flex-col gap-2.5">
        {mockCreators.slice(0, 4).map((c) => (
          <Link
            key={c.id}
            href={`/profile/${c.id}`}
            className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-[#1C1C1E] p-3"
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: c.avatarColor }}
            >
              {c.avatar}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-white">{c.name}</div>
              <div className="truncate text-xs text-[rgba(235,235,245,0.5)]">
                {c.specializations.join(" • ")}
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-[#FFD60A]">
              <Star size={12} fill="#FFD60A" /> {c.rating}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="mb-3 mt-7 flex items-center justify-between">
      <h2 className="text-[17px] font-bold text-white">{title}</h2>
      <Link href={href} className="flex items-center text-xs font-medium text-[#0A84FF]">
        Барчаси <ChevronRight size={14} />
      </Link>
    </div>
  );
}
