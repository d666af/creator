import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { mockJobs, mockCreators, mockPosts } from "@/lib/mock-data";
import { ArrowRight, Zap, Search, Trophy, Star } from "lucide-react";

export default function HomePage() {
  const featuredJobs = mockJobs.slice(0, 3);
  const featuredCreators = mockCreators.slice(0, 4);
  const featuredPosts = mockPosts.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F9F9FB]">
      <Navbar />

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16">
        <div className="max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-full px-4 py-2 mb-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <Zap size={14} className="text-[#4F46E5]" />
            <span className="text-sm text-[#6B7280]">
              <span className="font-semibold text-[#111111]">1 240+</span> креаторов уже на платформе
            </span>
          </div>

          <h1
            className="text-5xl font-bold text-[#111111] leading-[1.15] mb-6"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.03em" }}
          >
            Платформа для
            <br />
            <span className="text-[#4F46E5]">создателей контента</span>
            <br />
            и брендов
          </h1>

          <p className="text-lg text-[#6B7280] mb-10 max-w-xl leading-relaxed">
            Чистый инструмент для поиска команды, оценки работ и профессионального роста.
            Биржа вакансий, галерея портфолио, хакатоны.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link href="/jobs">
              <Button size="lg">
                Найти заказы
                <ArrowRight size={18} />
              </Button>
            </Link>
            <Link href="/specialists">
              <Button size="lg" variant="outline">
                <Search size={18} />
                Найти специалиста
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20">
          {[
            { value: "1 240+", label: "Активных креаторов" },
            { value: "380+", label: "Успешных проектов" },
            { value: "94", label: "Активных вакансий" },
            { value: "4.8", label: "Средний рейтинг" },
          ].map((stat) => (
            <Card key={stat.label} className="p-5 text-center">
              <p
                className="text-3xl font-bold text-[#111111] mb-1"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {stat.value}
              </p>
              <p className="text-sm text-[#6B7280]">{stat.label}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Jobs section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2
              className="text-2xl font-bold text-[#111111]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Актуальные вакансии
            </h2>
            <p className="text-[#6B7280] text-sm mt-1">94 открытые позиции прямо сейчас</p>
          </div>
          <div className="flex items-center gap-3">
            <select className="text-sm text-[#6B7280] bg-white border border-[#E5E7EB] rounded-[10px] px-3 py-2 focus:outline-none focus:border-[#111111]">
              <option>Все направления</option>
              <option>Мобилография</option>
              <option>Монтаж</option>
              <option>Сценарий</option>
              <option>SMM</option>
            </select>
            <Link href="/jobs">
              <Button variant="ghost" size="sm">
                Все вакансии <ArrowRight size={14} />
              </Button>
            </Link>
          </div>
        </div>

        <div className="space-y-3">
          {featuredJobs.map((job) => (
            <Link key={job.id} href={`/jobs`}>
              <Card hover className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div
                      className="w-11 h-11 rounded-[12px] flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                      style={{ backgroundColor: job.companyColor }}
                    >
                      {job.companyInitials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="text-[15px] font-semibold text-[#111111] leading-tight">
                          {job.title}
                        </h3>
                        {job.isHot && <Badge variant="accent">Горячая</Badge>}
                      </div>
                      <p className="text-sm text-[#6B7280] mb-3">
                        {job.location} · {job.schedule} · {job.experience}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {job.tags.map((tag) => (
                          <Badge key={tag}>#{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3 flex-shrink-0">
                    <span
                      className="text-base font-bold text-[#111111] whitespace-nowrap"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      {job.budget}
                    </span>
                    <Button size="sm">Откликнуться</Button>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Community section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2
              className="text-2xl font-bold text-[#111111]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Новые работы в сообществе
            </h2>
            <p className="text-[#6B7280] text-sm mt-1">Свежие кейсы и работы от профессионалов</p>
          </div>
          <Link href="/feed">
            <Button variant="ghost" size="sm">
              Вся лента <ArrowRight size={14} />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featuredPosts.map((post) => (
            <Link key={post.id} href="/feed">
              <Card hover className="overflow-hidden">
                {post.videoColor && (
                  <div
                    className={`relative overflow-hidden ${
                      post.videoAspect === "9:16" ? "aspect-[9/16] max-h-80" : "aspect-video"
                    }`}
                    style={{
                      background: `linear-gradient(135deg, ${post.videoColor}22, ${post.videoColor}44)`,
                    }}
                  >
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ background: `${post.videoColor}15` }}
                    >
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: post.videoColor }}
                      >
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <path d="M6 4l9 5-9 5V4z" fill="white" />
                        </svg>
                      </div>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex gap-1.5 flex-wrap">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-0.5 rounded-full text-white font-medium"
                            style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div className="p-4">
                  <p className="text-sm font-semibold text-[#111111] mb-2 line-clamp-2">{post.title}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: post.author.color }}
                      >
                        {post.author.avatar.charAt(0)}
                      </div>
                      <span className="text-xs text-[#6B7280]">{post.author.name}</span>
                      {post.author.isPro && (
                        <span className="text-xs bg-[#111111] text-white px-1.5 py-0.5 rounded-[5px] font-medium">PRO</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {post.author.specialization === "Мобилограф" || post.author.specialization === "Продюсер" ? (
                        <span className="text-[10px] text-green-500 font-medium">● Свободен</span>
                      ) : (
                        <span className="text-[10px] text-amber-500 font-medium">● Занят</span>
                      )}
                    </div>
                  </div>
                  {"reviewScores" in post && post.reviewScores && (
                    <div className="mt-3 pt-3 border-t border-[#F3F4F6] grid grid-cols-3 gap-2">
                      {Object.entries(post.reviewScores).map(([key, val]) => (
                        <div key={key} className="text-center">
                          <p className="text-xs font-semibold text-[#111111]">{val}</p>
                          <p className="text-[10px] text-[#6B7280] capitalize">{key === "montage" ? "Монтаж" : key === "scenario" ? "Сценарий" : "Цвет"}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Specialists preview */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2
              className="text-2xl font-bold text-[#111111]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Специалисты платформы
            </h2>
            <p className="text-[#6B7280] text-sm mt-1">Проверенные профессионалы, готовые к работе</p>
          </div>
          <Link href="/specialists">
            <Button variant="ghost" size="sm">
              Все специалисты <ArrowRight size={14} />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredCreators.map((creator) => (
            <Link key={creator.id} href={`/profile/${creator.id}`}>
              <Card hover className="p-5">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-3">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold"
                      style={{ backgroundColor: creator.avatarColor }}
                    >
                      {creator.avatar}
                    </div>
                    {creator.status === "free" ? (
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                    ) : (
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-amber-400 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <p className="font-semibold text-[#111111] text-sm">{creator.name}</p>
                    {creator.isPro && (
                      <span className="text-[10px] bg-[#111111] text-white px-1.5 py-0.5 rounded-[5px] font-medium">PRO</span>
                    )}
                  </div>
                  <p className="text-xs text-[#6B7280] mb-3">{creator.city}</p>
                  <div className="flex flex-wrap justify-center gap-1 mb-3">
                    {creator.specializations.map((s) => (
                      <Badge key={s} variant="accent" className="text-[10px] px-2 py-0.5">
                        {s}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={12} className="text-amber-400 fill-amber-400" />
                    <span className="text-xs font-semibold text-[#111111]">{creator.rating}</span>
                    <span className="text-xs text-[#6B7280]">({creator.reviewsCount})</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Hackathons promo */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <Card className="p-8 md:p-12 bg-[#111111] border-0 overflow-hidden relative">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white translate-x-32 -translate-y-32" />
          </div>
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Trophy size={20} className="text-amber-400" />
                <span className="text-amber-400 text-sm font-semibold">3 активных хакатона</span>
              </div>
              <h2
                className="text-3xl font-bold text-white mb-3"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Участвуй в хакатонах
              </h2>
              <p className="text-white/60 max-w-md text-sm leading-relaxed">
                Выигрывай призы до 50 000 ₽ и долгосрочные контракты с брендами.
                Голосование комьюнити + экспертное жюри.
              </p>
            </div>
            <Link href="/hackathons">
              <Button size="lg" variant="secondary" className="whitespace-nowrap">
                Смотреть хакатоны
                <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E5E7EB] mt-8">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-[#111111] rounded-[8px] flex items-center justify-center">
              <span className="text-white text-xs font-bold">CH</span>
            </div>
            <span
              className="text-sm font-semibold text-[#111111]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Creators Hub
            </span>
          </div>
          <p className="text-sm text-[#6B7280]">© 2026 Creators Hub. Все права защищены.</p>
          <div className="flex gap-6">
            {["Условия", "Конфиденциальность", "Поддержка"].map((item) => (
              <a key={item} href="#" className="text-sm text-[#6B7280] hover:text-[#111111] transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
