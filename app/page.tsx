"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { mockPosts } from "@/lib/mock-data";
import { Heart, MessageCircle, Share2, Bookmark, Play } from "lucide-react";

const TABS = ["Все", "Кейсы", "Вопросы", "Ревью"] as const;

const TYPE = {
  case:     { label: "КЕЙС",   color: "#C4975A" },
  question: { label: "ВОПРОС", color: "#4A7BC4" },
  review:   { label: "РЕВЬЮ",  color: "#B04040" },
};

export default function Page() {
  const [tab, setTab]   = useState<(typeof TABS)[number]>("Все");
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const posts =
    tab === "Кейсы"   ? mockPosts.filter(p => p.type === "case")     :
    tab === "Вопросы" ? mockPosts.filter(p => p.type === "question") :
    tab === "Ревью"   ? mockPosts.filter(p => p.type === "review")   :
    mockPosts;

  const toggle = (set: Set<string>, id: string) => {
    const n = new Set(set); n.has(id) ? n.delete(id) : n.add(id); return n;
  };

  return (
    <AppShell>
      {/* Tabs */}
      <div style={{
        display: "flex", gap: 0,
        borderBottom: "1px solid #E8E5DF",
        padding: "0 20px",
        background: "#fff",
      }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "13px 16px 12px",
            fontSize: 14, fontWeight: tab === t ? 600 : 400,
            color: tab === t ? "#1A1A18" : "#9A9590",
            background: "none", border: "none", cursor: "pointer",
            borderBottom: tab === t ? "2px solid #1A1A18" : "2px solid transparent",
            marginBottom: -1, whiteSpace: "nowrap",
          }}>
            {t}
          </button>
        ))}
      </div>

      {/* Posts */}
      <div style={{ background: "#F7F6F2" }}>
        {posts.map((post, i) => {
          const meta = TYPE[post.type as keyof typeof TYPE];
          const isLiked = liked.has(post.id);
          const isSaved = saved.has(post.id);
          return (
            <article key={post.id} style={{
              background: i % 2 === 0 ? "#FFFFFF" : "#FAFAF8",
              borderBottom: "1px solid #E8E5DF",
              padding: "20px 20px 16px",
            }}>
              {/* Type + meta */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: "0.06em",
                  color: meta.color,
                }}>
                  {meta.label}
                </span>
                <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#C8C4BE" }} />
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: "50%",
                    background: post.author.color + "25",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 9, fontWeight: 700, color: post.author.color,
                  }}>
                    {post.author.avatar}
                  </div>
                  <span style={{ fontSize: 13, color: "#5A5750" }}>
                    {post.author.name}
                  </span>
                  {post.author.isPro && (
                    <span style={{
                      fontSize: 9, fontWeight: 700, color: "#fff",
                      background: "#C4975A", padding: "1px 5px", borderRadius: 3,
                      letterSpacing: "0.04em",
                    }}>PRO</span>
                  )}
                </div>
                <span style={{ fontSize: 12, color: "#B0ABA5", marginLeft: "auto" }}>
                  {post.postedAt}
                </span>
              </div>

              {/* Title */}
              <h2 style={{
                fontSize: 17, fontWeight: 700,
                letterSpacing: "-0.025em", lineHeight: 1.3,
                color: "#1A1A18", margin: "0 0 8px",
              }}>
                {post.title}
              </h2>

              {/* Body */}
              <p style={{
                fontSize: 14, lineHeight: 1.55,
                color: "#5A5750", margin: "0 0 12px",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}>
                {post.content}
              </p>

              {/* Video */}
              {post.videoColor && (
                <div style={{
                  position: "relative", width: "100%", aspectRatio: "16/9",
                  borderRadius: 8, marginBottom: 12, overflow: "hidden",
                  background: `linear-gradient(135deg, ${post.videoColor}15, ${post.videoColor}35)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%",
                    background: "rgba(26,26,24,0.12)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Play size={18} color="#1A1A18" fill="#1A1A18" />
                  </div>
                  {post.videoAspect === "9:16" && (
                    <span style={{
                      position: "absolute", top: 8, left: 8,
                      fontSize: 10, fontWeight: 600, color: "#5A5750",
                      background: "rgba(247,246,242,0.85)",
                      padding: "2px 7px", borderRadius: 4,
                    }}>Reels</span>
                  )}
                  <span style={{
                    position: "absolute", bottom: 8, right: 8,
                    fontSize: 11, color: "#5A5750",
                    background: "rgba(247,246,242,0.85)",
                    padding: "2px 7px", borderRadius: 4,
                  }}>{post.views}</span>
                </div>
              )}

              {/* Review scores */}
              {post.reviewScores && (
                <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                  {[
                    ["Монтаж",   post.reviewScores.montage  ],
                    ["Нарратив", post.reviewScores.scenario ],
                    ["Цвет",     post.reviewScores.color    ],
                  ].map(([k, v]) => (
                    <div key={String(k)} style={{
                      flex: 1, background: "#F0EDE8", borderRadius: 6,
                      padding: "7px 4px", textAlign: "center",
                    }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: "#1A1A18" }}>{v}</div>
                      <div style={{ fontSize: 10, color: "#9A9590", marginTop: 1 }}>{k}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tags */}
              {post.tags?.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                  {post.tags.map((tag: string) => (
                    <span key={tag} style={{
                      fontSize: 12, color: "#8A8580",
                      background: "#EDEBE6",
                      padding: "3px 9px", borderRadius: 4,
                    }}>#{tag}</span>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div style={{ display: "flex", alignItems: "center", gap: 20, paddingTop: 4 }}>
                <button onClick={() => setLiked(p => toggle(p, post.id))} style={{
                  display: "flex", alignItems: "center", gap: 5, background: "none",
                  border: "none", cursor: "pointer", padding: 0,
                  fontSize: 13, color: isLiked ? "#C4975A" : "#9A9590",
                }}>
                  <Heart size={16} fill={isLiked ? "#C4975A" : "none"} strokeWidth={1.8} />
                  {post.likes + (isLiked ? 1 : 0)}
                </button>
                <button style={{
                  display: "flex", alignItems: "center", gap: 5, background: "none",
                  border: "none", cursor: "pointer", padding: 0,
                  fontSize: 13, color: "#9A9590",
                }}>
                  <MessageCircle size={16} strokeWidth={1.8} />
                  {post.comments}
                </button>
                <button style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "#9A9590" }}>
                  <Share2 size={16} strokeWidth={1.8} />
                </button>
                <button onClick={() => setSaved(p => toggle(p, post.id))} style={{
                  background: "none", border: "none", cursor: "pointer",
                  padding: 0, marginLeft: "auto",
                  color: isSaved ? "#C4975A" : "#9A9590",
                }}>
                  <Bookmark size={16} fill={isSaved ? "#C4975A" : "none"} strokeWidth={1.8} />
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </AppShell>
  );
}
