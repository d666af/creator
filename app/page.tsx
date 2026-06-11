"use client";

import { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { mockCreators, mockPosts } from "@/lib/mock-data";
import {
  Plus, Heart, MessageCircle, Share2, Bookmark,
  MoreHorizontal, Eye, Play,
} from "lucide-react";
import { useRole } from "@/lib/role-context";

const TABS = ["Барчаси", "Кейслар", "Саволлар", "Ревьюлар"] as const;

const POST_TYPE_META = {
  case:     { label: "Кейс",  bg: "#F0E7D8", color: "#8C6437" },
  question: { label: "Савол", bg: "#EBF1FD", color: "#2557D6" },
  review:   { label: "Ревью", bg: "#FDE8EC", color: "#C8183B" },
};

export default function HomePage() {
  const { role } = useRole();
  const [tab, setTab] = useState(0);
  const [liked, setLiked]   = useState<Set<string>>(new Set());
  const [saved, setSaved]   = useState<Set<string>>(new Set());

  const posts =
    tab === 0 ? mockPosts :
    tab === 1 ? mockPosts.filter((p) => p.type === "case") :
    tab === 2 ? mockPosts.filter((p) => p.type === "question") :
                mockPosts.filter((p) => p.type === "review");

  const stories = [
    { id: "add",  isAdd: true  },
    ...mockCreators.slice(0, 7),
  ];

  return (
    <AppShell>
      {/* ── Stories ── */}
      <div className="pt-4">
        <div className="no-scrollbar flex gap-3.5 overflow-x-auto px-4 pb-4">
          {stories.map((s: any) => (
            <StoryBubble key={s.id} story={s} />
          ))}
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="mx-4" style={{ height: "1px", backgroundColor: "rgba(0,0,0,0.06)" }} />

      {/* ── Tabs ── */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-3">
        {TABS.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            className="shrink-0 rounded-full px-4 py-[9px] text-[13px] font-semibold whitespace-nowrap transition-all duration-150"
            style={{
              backgroundColor: tab === i ? "#1C1A17" : "rgba(0,0,0,0.05)",
              color:           tab === i ? "#FFFFFF"  : "#74706A",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ── Feed ── */}
      <div className="flex flex-col gap-3 px-4 pb-4">
        {posts.map((post, i) => (
          <PostCard
            key={post.id}
            post={post}
            delay={i * 55}
            isLiked={liked.has(post.id)}
            isSaved={saved.has(post.id)}
            onLike={() => setLiked((prev) => toggle(prev, post.id))}
            onSave={() => setSaved((prev) => toggle(prev, post.id))}
          />
        ))}
      </div>
    </AppShell>
  );
}

/* ──────────── helpers ──────────── */

function toggle(set: Set<string>, id: string): Set<string> {
  const next = new Set(set);
  next.has(id) ? next.delete(id) : next.add(id);
  return next;
}

/* ──────────── Story bubble ──────────── */

function StoryBubble({ story }: { story: any }) {
  if (story.isAdd) {
    return (
      <div className="flex shrink-0 flex-col items-center gap-1.5 cursor-pointer">
        <div
          className="flex h-[58px] w-[58px] items-center justify-center rounded-full"
          style={{ border: "2px dashed rgba(160,120,80,0.35)", backgroundColor: "#FDFCF9" }}
        >
          <Plus size={18} color="#A07850" />
        </div>
        <span className="text-[10px] font-medium" style={{ color: "#A8A39B" }}>
          Сторис
        </span>
      </div>
    );
  }

  return (
    <Link href={`/profile/${story.id}`} className="flex shrink-0 flex-col items-center gap-1.5">
      <div
        className="h-[58px] w-[58px] rounded-full p-[2.5px]"
        style={{ background: "linear-gradient(135deg, #C4956A 0%, #E8C99A 50%, #A07850 100%)" }}
      >
        <div
          className="flex h-full w-full items-center justify-center rounded-full text-[14px] font-bold"
          style={{ backgroundColor: "#FDFCF9", border: "2px solid #FDFCF9", color: story.avatarColor }}
        >
          {story.avatar}
        </div>
      </div>
      <span
        className="max-w-[58px] truncate text-center text-[10px] font-medium"
        style={{ color: "#74706A" }}
      >
        {story.name.split(" ")[0]}
      </span>
    </Link>
  );
}

/* ──────────── Post card ──────────── */

function PostCard({
  post, delay, isLiked, isSaved, onLike, onSave,
}: {
  post: (typeof mockPosts)[number];
  delay: number;
  isLiked: boolean;
  isSaved: boolean;
  onLike: () => void;
  onSave: () => void;
}) {
  const meta = POST_TYPE_META[post.type];

  return (
    <div
      className="overflow-hidden rounded-2xl animate-fade-in"
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid rgba(0,0,0,0.06)",
        animationDelay: `${delay}ms`,
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[13px] font-bold"
          style={{ backgroundColor: post.author.color + "22", color: post.author.color }}
        >
          {post.author.avatar}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-[14px] font-semibold" style={{ color: "#1C1A17" }}>
              {post.author.name}
            </span>
            {post.author.isPro && (
              <span
                className="shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold"
                style={{ backgroundColor: "#A07850", color: "#FFFFFF" }}
              >
                PRO
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[12px]" style={{ color: "#74706A" }}>
              {post.author.specialization}
            </span>
            <span style={{ color: "#C8C3BC" }}>·</span>
            <span className="text-[12px]" style={{ color: "#A8A39B" }}>
              {post.postedAt}
            </span>
          </div>
        </div>

        <button className="flex h-8 w-8 items-center justify-center rounded-full" style={{ color: "#B0A99F" }}>
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Type badge + title */}
      <div className="px-4 pb-2.5">
        <span
          className="inline-block rounded-full px-2.5 py-[5px] text-[11px] font-semibold"
          style={{ backgroundColor: meta.bg, color: meta.color }}
        >
          {meta.label}
        </span>
        <p className="mt-2 text-[15px] font-semibold leading-snug" style={{ color: "#1C1A17" }}>
          {post.title}
        </p>
      </div>

      {/* Body text */}
      <div className="px-4 pb-3">
        <p className="text-[14px] leading-relaxed" style={{ color: "#4A4640" }}>
          {post.content}
        </p>
      </div>

      {/* Video preview */}
      {post.videoColor && (
        <div className="px-4 pb-3">
          <div
            className="relative w-full overflow-hidden rounded-[14px]"
            style={{
              aspectRatio: "16/9",
              background: `linear-gradient(135deg, ${post.videoColor}1A, ${post.videoColor}40)`,
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-full"
                style={{ backgroundColor: post.videoColor + "33" }}
              >
                <Play size={22} color={post.videoColor} fill={post.videoColor} />
              </div>
            </div>
            {post.videoAspect === "9:16" && (
              <div
                className="absolute left-2.5 top-2.5 rounded-full px-2 py-1 text-[11px] font-semibold text-white"
                style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
              >
                Reels
              </div>
            )}
            {post.views && (
              <div
                className="absolute bottom-2.5 right-2.5 flex items-center gap-1 rounded-full px-2 py-1"
                style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
              >
                <Eye size={11} color="white" />
                <span className="text-[11px] font-semibold text-white">{post.views}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Review score pills */}
      {post.reviewScores && (
        <div className="flex gap-2 px-4 pb-3">
          {Object.entries(post.reviewScores).map(([key, val]) => (
            <div
              key={key}
              className="flex-1 rounded-xl px-2 py-2 text-center"
              style={{ backgroundColor: "#F8F6F2" }}
            >
              <div className="text-[14px] font-bold" style={{ color: "#1C1A17" }}>
                {val as number}
              </div>
              <div className="text-[10px]" style={{ color: "#74706A" }}>
                {key === "montage" ? "Монтаж" : key === "scenario" ? "Нарратив" : "Ранг"}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 px-4 pb-3">
          {post.tags.map((tag: string) => (
            <span
              key={tag}
              className="rounded-full px-2.5 py-[5px] text-[12px] font-medium"
              style={{ backgroundColor: "#F0E7D8", color: "#8C6437" }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Action bar */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}
      >
        <div className="flex items-center gap-5">
          <button
            onClick={onLike}
            className="flex items-center gap-1.5 transition-transform active:scale-90"
            style={{ color: isLiked ? "#C8183B" : "#B0A99F" }}
          >
            <Heart size={18} fill={isLiked ? "#C8183B" : "none"} strokeWidth={2} />
            <span className="text-[13px] font-medium">
              {post.likes + (isLiked ? 1 : 0)}
            </span>
          </button>

          <button className="flex items-center gap-1.5" style={{ color: "#B0A99F" }}>
            <MessageCircle size={18} strokeWidth={2} />
            <span className="text-[13px] font-medium">{post.comments}</span>
          </button>

          <button style={{ color: "#B0A99F" }}>
            <Share2 size={18} strokeWidth={2} />
          </button>
        </div>

        <button
          onClick={onSave}
          className="transition-transform active:scale-90"
          style={{ color: isSaved ? "#A07850" : "#B0A99F" }}
        >
          <Bookmark size={18} fill={isSaved ? "#A07850" : "none"} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
