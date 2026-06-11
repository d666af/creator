"use client";

import { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { mockPosts } from "@/lib/mock-data";
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Play, Eye } from "lucide-react";

const TABS = ["Все", "Кейсы", "Вопросы", "Ревью"] as const;
type Tab = (typeof TABS)[number];

const TYPE_MAP: Record<string, { label: string; color: string; bg: string }> = {
  case:     { label: "Кейс",   color: "#AF52DE", bg: "rgba(175,82,222,0.1)"  },
  question: { label: "Вопрос", color: "#007AFF", bg: "rgba(0,122,255,0.1)"   },
  review:   { label: "Ревью",  color: "#FF3B30", bg: "rgba(255,59,48,0.1)"   },
};

export default function FeedPage() {
  const [tab, setTab]   = useState<Tab>("Все");
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const posts =
    tab === "Все"     ? mockPosts :
    tab === "Кейсы"   ? mockPosts.filter((p) => p.type === "case")     :
    tab === "Вопросы" ? mockPosts.filter((p) => p.type === "question") :
                        mockPosts.filter((p) => p.type === "review");

  return (
    <AppShell>
      {/* Filter tabs */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-3">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "8px 16px",
              borderRadius: 100,
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: "-0.01em",
              whiteSpace: "nowrap",
              flexShrink: 0,
              transition: "all 0.15s",
              backgroundColor: tab === t ? "#000" : "rgba(118,118,128,0.12)",
              color:           tab === t ? "#fff" : "rgba(60,60,67,0.65)",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Posts */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "0 16px 16px" }}>
        {posts.map((post, i) => (
          <PostCard
            key={post.id}
            post={post}
            delay={i * 50}
            isLiked={liked.has(post.id)}
            isSaved={saved.has(post.id)}
            onLike={() => setLiked((p) => toggle(p, post.id))}
            onSave={() => setSaved((p) => toggle(p, post.id))}
          />
        ))}
      </div>
    </AppShell>
  );
}

function toggle(s: Set<string>, id: string) {
  const n = new Set(s);
  n.has(id) ? n.delete(id) : n.add(id);
  return n;
}

/* ── Post card ── */

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
  const meta = TYPE_MAP[post.type];

  return (
    <article
      className="animate-fade-in"
      style={{
        backgroundColor: "#fff",
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 2px 12px rgba(0,0,0,0.07), 0 0 0 0.5px rgba(0,0,0,0.04)",
        animationDelay: `${delay}ms`,
      }}
    >
      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px 10px" }}>
        {/* Avatar */}
        <Link href="#" style={{ flexShrink: 0 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 700,
              color: post.author.color,
              backgroundColor: post.author.color + "1A",
            }}
          >
            {post.author.avatar}
          </div>
        </Link>

        {/* Name / meta */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#000", letterSpacing: "-0.01em" }}>
              {post.author.name}
            </span>
            {post.author.isPro && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#fff",
                  backgroundColor: "#AF52DE",
                  padding: "1px 6px",
                  borderRadius: 4,
                  letterSpacing: "0.01em",
                }}
              >
                PRO
              </span>
            )}
          </div>
          <div style={{ fontSize: 12, color: "rgba(60,60,67,0.55)", marginTop: 1, letterSpacing: "-0.01em" }}>
            {post.author.specialization} &middot; {post.postedAt}
          </div>
        </div>

        <button style={{ padding: 4, color: "rgba(60,60,67,0.4)" }}>
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* ── Body ── */}
      <div style={{ padding: "0 16px 12px" }}>
        {/* Type badge */}
        <span
          style={{
            display: "inline-block",
            fontSize: 12,
            fontWeight: 600,
            color: meta.color,
            backgroundColor: meta.bg,
            padding: "3px 10px",
            borderRadius: 6,
            marginBottom: 8,
            letterSpacing: "-0.01em",
          }}
        >
          {meta.label}
        </span>

        {/* Title */}
        <p style={{ fontSize: 16, fontWeight: 700, color: "#000", lineHeight: 1.3, letterSpacing: "-0.02em", margin: 0 }}>
          {post.title}
        </p>

        {/* Content */}
        <p
          style={{
            fontSize: 15,
            fontWeight: 400,
            color: "rgba(60,60,67,0.8)",
            lineHeight: 1.5,
            marginTop: 6,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {post.content}
        </p>
      </div>

      {/* ── Video preview ── */}
      {post.videoColor && (
        <div style={{ padding: "0 16px 12px" }}>
          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "16/9",
              borderRadius: 12,
              background: `linear-gradient(135deg, ${post.videoColor}18 0%, ${post.videoColor}38 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                backgroundColor: post.videoColor + "30",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Play size={20} color={post.videoColor} fill={post.videoColor} />
            </div>
            {post.videoAspect === "9:16" && (
              <span
                style={{
                  position: "absolute",
                  top: 10,
                  left: 10,
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#fff",
                  backgroundColor: "rgba(0,0,0,0.4)",
                  padding: "3px 8px",
                  borderRadius: 6,
                }}
              >
                Reels
              </span>
            )}
            {post.views && (
              <div
                style={{
                  position: "absolute",
                  bottom: 10,
                  right: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  backgroundColor: "rgba(0,0,0,0.4)",
                  padding: "3px 8px",
                  borderRadius: 6,
                }}
              >
                <Eye size={11} color="#fff" />
                <span style={{ fontSize: 11, fontWeight: 600, color: "#fff" }}>{post.views}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Review scores ── */}
      {post.reviewScores && (
        <div style={{ display: "flex", gap: 8, padding: "0 16px 12px" }}>
          {[
            { key: "Монтаж",   val: post.reviewScores.montage   },
            { key: "Нарратив", val: post.reviewScores.scenario  },
            { key: "Цвет",     val: post.reviewScores.color     },
          ].map(({ key, val }) => (
            <div
              key={key}
              style={{
                flex: 1,
                backgroundColor: "#F2F2F7",
                borderRadius: 10,
                padding: "8px 6px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 700, color: "#000" }}>{val}</div>
              <div style={{ fontSize: 11, color: "rgba(60,60,67,0.5)", marginTop: 1 }}>{key}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── Tags ── */}
      {post.tags && post.tags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "0 16px 12px" }}>
          {post.tags.map((tag: string) => (
            <span
              key={tag}
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "rgba(60,60,67,0.55)",
                backgroundColor: "rgba(118,118,128,0.1)",
                padding: "4px 10px",
                borderRadius: 6,
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* ── Actions ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 16px 14px",
          borderTop: "0.5px solid rgba(60,60,67,0.12)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <ActionBtn
            icon={<Heart size={18} fill={isLiked ? "#FF3B30" : "none"} strokeWidth={2} />}
            label={String(post.likes + (isLiked ? 1 : 0))}
            color={isLiked ? "#FF3B30" : "rgba(60,60,67,0.45)"}
            onClick={onLike}
          />
          <ActionBtn
            icon={<MessageCircle size={18} strokeWidth={2} />}
            label={String(post.comments)}
            color="rgba(60,60,67,0.45)"
          />
          <ActionBtn
            icon={<Share2 size={18} strokeWidth={2} />}
            color="rgba(60,60,67,0.45)"
          />
        </div>
        <button onClick={onSave} style={{ padding: 4, color: isSaved ? "#AF52DE" : "rgba(60,60,67,0.45)", transition: "color 0.15s" }}>
          <Bookmark size={18} fill={isSaved ? "#AF52DE" : "none"} strokeWidth={2} />
        </button>
      </div>
    </article>
  );
}

function ActionBtn({
  icon, label, color, onClick,
}: {
  icon: React.ReactNode;
  label?: string;
  color: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        color,
        fontSize: 14,
        fontWeight: 500,
        transition: "color 0.15s",
      }}
    >
      {icon}
      {label && <span>{label}</span>}
    </button>
  );
}
