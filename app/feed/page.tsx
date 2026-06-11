"use client";
import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { mockPosts, mockCreators } from "@/lib/mock-data";
import { Heart, MessageCircle, Eye, Plus, Flame, Clock, TrendingUp, Star } from "lucide-react";

type FeedTab = "new" | "hot" | "top";

const typeLabels = {
  case: { label: "Кейс", color: "accent" as const },
  question: { label: "Вопрос", color: "warning" as const },
  review: { label: "Ревью", color: "success" as const },
};

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState<FeedTab>("new");
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  const toggleLike = (id: string) => {
    setLikedPosts((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const sortedPosts = [...mockPosts].sort(() => (activeTab === "top" ? -0.5 : 0.5));

  return (
    <div className="min-h-screen bg-[#F9F9FB]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main feed */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1
                  className="text-2xl font-bold text-[#111111]"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Лента сообщества
                </h1>
                <p className="text-sm text-[#6B7280] mt-0.5">Кейсы, вопросы и ревью профессионалов</p>
              </div>
              <Button size="sm">
                <Plus size={15} />
                Создать пост
              </Button>
            </div>

            {/* Feed tabs */}
            <div className="flex gap-1 bg-white border border-[#E5E7EB] rounded-[14px] p-1 mb-6 w-fit shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
              {[
                { id: "new", label: "Новое", icon: Clock },
                { id: "hot", label: "Обсуждаемое", icon: Flame },
                { id: "top", label: "Топ рейтинг", icon: TrendingUp },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as FeedTab)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-[10px] text-sm font-medium transition-all duration-150 cursor-pointer ${
                    activeTab === id
                      ? "bg-[#111111] text-white"
                      : "text-[#6B7280] hover:text-[#111111]"
                  }`}
                >
                  <Icon size={13} />
                  {label}
                </button>
              ))}
            </div>

            {/* Posts */}
            <div className="space-y-4">
              {sortedPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden">
                  <div className="p-5">
                    <div className="flex items-start gap-3 mb-4">
                      <Link href={`/profile/${post.author.name.toLowerCase().replace(" ", "-")}`}>
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
                          style={{ backgroundColor: post.author.color }}
                        >
                          {post.author.avatar}
                        </div>
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-0.5">
                          <Link href={`/profile/${post.author.name.toLowerCase().replace(" ", "-")}`}>
                            <span className="font-semibold text-sm text-[#111111] hover:underline cursor-pointer">
                              {post.author.name}
                            </span>
                          </Link>
                          {post.author.isPro && (
                            <span className="text-[10px] bg-[#111111] text-white px-1.5 py-0.5 rounded-[5px] font-medium">PRO</span>
                          )}
                          <Badge variant={typeLabels[post.type].color} className="text-[10px]">
                            {typeLabels[post.type].label}
                          </Badge>
                        </div>
                        <p className="text-xs text-[#6B7280]">
                          {post.author.specialization} · {post.postedAt}
                        </p>
                      </div>
                    </div>

                    <h3
                      className="text-base font-bold text-[#111111] mb-2 leading-snug"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      {post.title}
                    </h3>
                    <p className="text-sm text-[#6B7280] leading-relaxed mb-4">
                      {post.content}
                    </p>

                    {post.videoColor && (
                      <div
                        className={`relative rounded-[12px] overflow-hidden mb-4 cursor-pointer group ${
                          post.videoAspect === "9:16" ? "max-w-[200px] aspect-[9/16]" : "aspect-video"
                        }`}
                        style={{
                          background: `linear-gradient(135deg, ${post.videoColor}22, ${post.videoColor}44)`,
                        }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-150"
                            style={{ backgroundColor: post.videoColor }}
                          >
                            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                              <path d="M6 4l9 5-9 5V4z" fill="white" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}

                    {post.type === "review" && "reviewScores" in post && post.reviewScores && (
                      <div className="bg-[#F9F9FB] rounded-[12px] p-4 mb-4">
                        <p className="text-xs font-semibold text-[#6B7280] mb-3 uppercase tracking-wide">
                          Оценки сообщества
                        </p>
                        <div className="grid grid-cols-3 gap-4">
                          {[
                            { key: "montage", label: "Монтаж", score: post.reviewScores.montage },
                            { key: "scenario", label: "Сценарий", score: post.reviewScores.scenario },
                            { key: "color", label: "Цвет", score: post.reviewScores.color },
                          ].map((item) => (
                            <div key={item.key} className="text-center">
                              <div className="flex items-center justify-center gap-1 mb-1">
                                <Star size={11} className="text-amber-400 fill-amber-400" />
                                <span className="text-sm font-bold text-[#111111]">{item.score}</span>
                              </div>
                              <p className="text-xs text-[#6B7280]">{item.label}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {post.tags.map((tag) => (
                        <Badge key={tag}>#{tag}</Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#F3F4F6]">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => toggleLike(post.id)}
                          className={`flex items-center gap-1.5 text-sm transition-colors cursor-pointer ${
                            likedPosts.has(post.id) ? "text-red-500" : "text-[#6B7280] hover:text-red-500"
                          }`}
                        >
                          <Heart
                            size={15}
                            className={likedPosts.has(post.id) ? "fill-red-500" : ""}
                          />
                          {post.likes + (likedPosts.has(post.id) ? 1 : 0)}
                        </button>
                        <button className="flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#111111] transition-colors cursor-pointer">
                          <MessageCircle size={15} />
                          {post.comments}
                        </button>
                        <span className="flex items-center gap-1.5 text-sm text-[#6B7280]">
                          <Eye size={15} />
                          {post.views}
                        </span>
                      </div>
                      <Button variant="ghost" size="sm">Читать далее</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-72 space-y-4 flex-shrink-0">
            {/* Trending creators */}
            <Card className="p-5">
              <h3
                className="font-bold text-[#111111] mb-4 text-sm"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Активные в сообществе
              </h3>
              <div className="space-y-3">
                {mockCreators.slice(0, 4).map((creator) => (
                  <Link key={creator.id} href={`/profile/${creator.id}`}>
                    <div className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
                      <div className="relative flex-shrink-0">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold"
                          style={{ backgroundColor: creator.avatarColor }}
                        >
                          {creator.avatar}
                        </div>
                        {creator.status === "free" && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#111111] truncate">{creator.name}</p>
                        <p className="text-xs text-[#6B7280] truncate">{creator.specializations[0]}</p>
                      </div>
                      <div className="flex items-center gap-0.5 flex-shrink-0">
                        <Star size={10} className="text-amber-400 fill-amber-400" />
                        <span className="text-xs text-[#6B7280]">{creator.rating}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>

            {/* Post types guide */}
            <Card className="p-5">
              <h3
                className="font-bold text-[#111111] mb-3 text-sm"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Форматы постов
              </h3>
              <div className="space-y-2.5">
                {[
                  { type: "Кейс", desc: "Поделитесь успешным проектом", color: "#4F46E5" },
                  { type: "Вопрос / Совет", desc: "Спросите у коллег", color: "#D97706" },
                  { type: "Ревью работы", desc: "Получите оценку профи", color: "#059669" },
                ].map((item) => (
                  <div key={item.type} className="flex items-start gap-2.5">
                    <div
                      className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <div>
                      <p className="text-xs font-semibold text-[#111111]">{item.type}</p>
                      <p className="text-xs text-[#6B7280]">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
