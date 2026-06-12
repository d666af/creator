'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Eye, X, Search, Bell, Home, Users, Briefcase, User, Star } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type CaseItem = {
  id: string;
  title: string;
  creator: string;
  initials: string;
  avatarColor: string;
  spec: string;
  views: string;
  viewsNum: number;
  youtubeId: string;
  isPro: boolean;
  duration: string | null;
  task: string;
  result: string;
  city: string;
  rating: number;
};

type Section = {
  id: string;
  num: string;
  genre: string;
  layout: 'portrait' | 'landscape' | 'bento';
  dark?: boolean;
  cases: CaseItem[];
};

// ─── YouTube helpers ──────────────────────────────────────────────────────────

const ytThumb = (id: string) =>
  `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

const ytMaxThumb = (id: string) =>
  `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;

// muted loop preview for card hover
const ytPreview = (id: string) =>
  `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${id}&playsinline=1&rel=0&modestbranding=1&disablekb=1`;

// full player for modal (with sound, user-initiated)
const ytPlayer = (id: string) =>
  `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;

// ─── Data ────────────────────────────────────────────────────────────────────

const SECTIONS: Section[] = [
  {
    id: 'reels', num: '01', genre: 'Reels & Shorts', layout: 'portrait',
    cases: [
      { id: 'r1', title: 'Fashion Reels для ModaUz', creator: 'Nilufar Rashidova', initials: 'NR', avatarColor: '#5C4A3A', spec: 'Мобилограф', views: '142K', viewsNum: 142, youtubeId: 'JGwWNGJdvx8', isPro: true, duration: '0:28', task: 'Вирусные Reels для кийим бренди', result: '+800 подписчиков за 2 дня', city: 'Самарканд', rating: 4.8 },
      { id: 'r2', title: 'Вирал Shorts +2K продаж', creator: 'Azizbek Karimov', initials: 'AK', avatarColor: '#3A4A5C', spec: 'Сценарист', views: '540K', viewsNum: 540, youtubeId: '9bZkp7q19f0', isPro: false, duration: '0:35', task: 'Вирал контент beauty бренда', result: '+2000 продаж в первую неделю', city: 'Ташкент', rating: 5.0 },
      { id: 'r3', title: 'Food Reels ресторан', creator: 'Feruza Nazarova', initials: 'FN', avatarColor: '#3A5C48', spec: 'Мобилограф', views: '230K', viewsNum: 230, youtubeId: 'OPf0YbXqDm0', isPro: true, duration: '0:22', task: 'Таом съёмкаси', result: '+1200 подписчиков', city: 'Ташкент', rating: 4.9 },
      { id: 'r4', title: 'Beauty контент — серия', creator: 'Nilufar Rashidova', initials: 'NR', avatarColor: '#5C4A3A', spec: 'Мобилограф', views: '89K', viewsNum: 89, youtubeId: 'fRh_vgS2dFE', isPro: true, duration: '0:31', task: '5 роликов beauty серии', result: '3 ролика попали в топ', city: 'Самарканд', rating: 4.8 },
      { id: 'r5', title: 'Кафе атмосфера — промо', creator: 'Feruza Nazarova', initials: 'FN', avatarColor: '#3A5C48', spec: 'Мобилограф', views: '88K', viewsNum: 88, youtubeId: 'kJQP7kiw5Fk', isPro: true, duration: '0:19', task: 'Кафе промо', result: '88K просмотров', city: 'Ташкент', rating: 4.9 },
    ],
  },
  {
    id: 'youtube', num: '02', genre: 'YouTube-шоу', layout: 'landscape',
    cases: [
      { id: 'y1', title: 'Рекламный промо — рекорд канала', creator: 'Jasur Yusupov', initials: 'JY', avatarColor: '#4A3A5C', spec: 'Монтажёр', views: '320K', viewsNum: 320, youtubeId: 'RgKAFK5djSk', isPro: true, duration: '1:45', task: 'Бренд рекламавий ролик', result: 'Рекорд канала 320K', city: 'Ташкент', rating: 4.9 },
      { id: 'y2', title: 'Tech обзор ноутбука — 12 мин', creator: 'Jasur Yusupov', initials: 'JY', avatarColor: '#4A3A5C', spec: 'Монтажёр', views: '180K', viewsNum: 180, youtubeId: 'dQw4w9WgXcQ', isPro: true, duration: '12:30', task: 'Tech обзор монтажи', result: '180K просмотров', city: 'Ташкент', rating: 4.9 },
      { id: 'y3', title: 'Сценарий YouTube — разбор', creator: 'Azizbek Karimov', initials: 'AK', avatarColor: '#3A4A5C', spec: 'Сценарист', views: '120K', viewsNum: 120, youtubeId: 'hT_nvWreIhg', isPro: false, duration: '8:15', task: 'Обзор сценарийи', result: '120K просмотров', city: 'Ташкент', rating: 5.0 },
      { id: 'y4', title: 'E-commerce продакшн', creator: 'Doniyor Toshmatov', initials: 'DT', avatarColor: '#5C4A3A', spec: 'Продюсер', views: '45K', viewsNum: 45, youtubeId: 'YQHsXMglC9A', isPro: false, duration: '2:40', task: 'Предметли съёмка', result: 'Конверсия +25%', city: 'Бухара', rating: 4.6 },
    ],
  },
  {
    id: 'music', num: '03', genre: 'Муз. клипы', layout: 'landscape', dark: true,
    cases: [
      { id: 'm1', title: 'Клип для местного артиста', creator: 'Jasur Yusupov', initials: 'JY', avatarColor: '#6B5B3A', spec: 'Монтажёр', views: '210K', viewsNum: 210, youtubeId: 'kJQP7kiw5Fk', isPro: true, duration: '3:22', task: 'Локал артист клип', result: '210K просмотров', city: 'Ташкент', rating: 4.9 },
      { id: 'm2', title: 'Кино-стиль монтаж', creator: 'Otabek Xoliqov', initials: 'OX', avatarColor: '#3A5B6B', spec: 'Колорист', views: '150K', viewsNum: 150, youtubeId: 'RgKAFK5djSk', isPro: false, duration: '4:10', task: 'Короткометраж монтаж', result: 'Фестивальный победитель', city: 'Ташкент', rating: 4.8 },
      { id: 'm3', title: 'Цветокоррекция — реклама', creator: 'Otabek Xoliqov', initials: 'OX', avatarColor: '#3A5B6B', spec: 'Монтажёр', views: '92K', viewsNum: 92, youtubeId: 'OPf0YbXqDm0', isPro: false, duration: '2:55', task: 'Реклама колоринг', result: '92K просмотров', city: 'Ташкент', rating: 4.8 },
    ],
  },
  {
    id: 'campaigns', num: '04', genre: 'Кампейны', layout: 'bento',
    cases: [
      { id: 'c1', title: 'Таргет ROAS x4.2 за 2 месяца', creator: 'Shahlo Mirzayeva', initials: 'SM', avatarColor: '#5C3A4A', spec: 'Таргетолог', views: '32K', viewsNum: 32, youtubeId: 'JGwWNGJdvx8', isPro: true, duration: null, task: 'Магазин таргет', result: 'ROAS 4.2', city: 'Ташкент', rating: 4.7 },
      { id: 'c2', title: 'Бренд-видео для имиджа', creator: 'Doniyor Toshmatov', initials: 'DT', avatarColor: '#5C4A3A', spec: 'Продюсер', views: '67K', viewsNum: 67, youtubeId: '9bZkp7q19f0', isPro: false, duration: '1:30', task: 'Имидж видео', result: '67K просмотров', city: 'Бухара', rating: 4.6 },
      { id: 'c3', title: 'Лайфстайл серия — 5 роликов', creator: 'Feruza Nazarova', initials: 'FN', avatarColor: '#3A5C48', spec: 'Мобилограф', views: '110K', viewsNum: 110, youtubeId: 'fRh_vgS2dFE', isPro: true, duration: '0:45', task: 'Лайфстайл серия', result: '110K просмотров', city: 'Ташкент', rating: 4.9 },
    ],
  },
];

const HERO_ITEMS = [
  SECTIONS[0].cases[1], // 540K Viral Shorts
  SECTIONS[1].cases[0], // 320K Promo
  SECTIONS[2].cases[0], // 210K Clip
];

const TICKER_ITEMS = [
  '540K просмотров за 3 дня',
  '12 новых кейсов сегодня',
  'Хакатон завершается через 3 дня',
  '8 авторов онлайн прямо сейчас',
  'Fashion кейс набрал 142K за 24ч',
  'Новый автор из Бухары',
  'ROAS x4.2 — кейс недели',
];

// ─── Hooks ────────────────────────────────────────────────────────────────────

function use3DTilt(intensity = 10) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setTilt({ x: ((e.clientY - r.top) / r.height - 0.5) * -intensity, y: ((e.clientX - r.left) / r.width - 0.5) * intensity });
    setActive(true);
  }, [intensity]);
  const onMouseLeave = useCallback(() => { setTilt({ x: 0, y: 0 }); setActive(false); }, []);
  return { ref, tilt, active, onMouseMove, onMouseLeave };
}

function useScrollReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function useCountUp(target: number, trigger: boolean, duration = 1400) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setVal(Math.round(target * (1 - Math.pow(1 - p, 4))));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, trigger, duration]);
  return val;
}

// ─── YouTube preview hook for cards ──────────────────────────────────────────

function useCardPreview() {
  const [preview, setPreview] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const onMouseEnter = () => { timer.current = setTimeout(() => setPreview(true), 250); };
  const onMouseLeave = () => { if (timer.current) clearTimeout(timer.current); setPreview(false); };
  return { preview, onMouseEnter, onMouseLeave };
}

// ─── Bottom Nav ───────────────────────────────────────────────────────────────

const NAV = [
  { id: 'feed', label: 'Лента', Icon: Home },
  { id: 'creators', label: 'Авторы', Icon: Users },
  { id: 'projects', label: 'Проекты', Icon: Briefcase },
  { id: 'profile', label: 'Профиль', Icon: User },
] as const;

function BottomNav({ active, onChange }: { active: string; onChange: (s: string) => void }) {
  return (
    <nav style={{ position: 'fixed', bottom: 14, left: 12, right: 12, zIndex: 60, background: 'rgba(14,14,14,0.9)', backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)', borderRadius: 28, padding: '6px 6px', display: 'flex', boxShadow: '0 12px 48px rgba(0,0,0,0.4), inset 0 0.5px 0 rgba(255,255,255,0.07)' }}>
      {NAV.map(({ id, label, Icon }) => {
        const on = active === id;
        return (
          <button key={id} onClick={() => onChange(id)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, border: 'none', background: on ? 'rgba(255,255,255,0.08)' : 'transparent', borderRadius: 22, padding: '8px 0', cursor: 'pointer', transition: 'background 0.2s ease' }}>
            <Icon size={21} color={on ? '#fff' : 'rgba(255,255,255,0.3)'} strokeWidth={on ? 2 : 1.5} />
            <span style={{ fontSize: 9.5, fontWeight: on ? 600 : 400, color: on ? '#fff' : 'rgba(255,255,255,0.3)' }}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}

// ─── Ticker ───────────────────────────────────────────────────────────────────

function Ticker() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div style={{ overflow: 'hidden', height: 34, background: '#0D0D0D', display: 'flex', alignItems: 'center' }}>
      <div style={{ display: 'flex', animation: 'ticker 24s linear infinite', willChange: 'transform' }}>
        {doubled.map((item, i) => (
          <span key={i} style={{ whiteSpace: 'nowrap', padding: '0 32px', fontSize: 10.5, color: 'rgba(255,255,255,0.32)', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            {item}<span style={{ marginLeft: 32, color: 'rgba(255,255,255,0.1)' }}>—</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Hero Slide ───────────────────────────────────────────────────────────────

function HeroSlide({ item, onClick }: { item: CaseItem; onClick: (c: CaseItem) => void }) {
  const count = useCountUp(item.viewsNum, true);
  return (
    <div
      onClick={() => onClick(item)}
      style={{
        position: 'relative', width: '100%', aspectRatio: '16/9', cursor: 'pointer',
        background: '#000',
        animation: 'heroFade 0.45s cubic-bezier(0.16,1,0.3,1) forwards',
      }}
    >
      {/* Thumbnail */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `linear-gradient(170deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.9) 100%), url(${ytMaxThumb(item.youtubeId)})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
      }} />
      {item.duration && (
        <div style={{ position: 'absolute', top: 16, right: 16, color: 'rgba(255,255,255,0.55)', fontSize: 11, fontWeight: 500, letterSpacing: '0.02em', zIndex: 1 }}>
          {item.duration}
        </div>
      )}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Play size={20} fill="#fff" stroke="none" style={{ marginLeft: 3 }} />
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 22px 22px', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 10 }}>
          <span style={{ fontSize: 50, fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1 }}>{count}K</span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', fontWeight: 400, paddingBottom: 4 }}>просмотров</span>
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', lineHeight: 1.3, marginBottom: 12 }}>{item.title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 26, height: 26, borderRadius: '50%', background: item.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{item.initials}</div>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{item.creator}</span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>{item.spec}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Hero Carousel ────────────────────────────────────────────────────────────

function HeroCarousel({ items, onCaseClick }: { items: CaseItem[]; onCaseClick: (c: CaseItem) => void }) {
  const { ref, visible } = useScrollReveal(0.01);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef(0);
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % items.length), 5000);
    return () => clearInterval(t);
  }, [paused, items.length]);
  const go = (dir: 1 | -1) => setIndex((i) => (i + dir + items.length) % items.length);
  return (
    <div ref={ref} style={{ margin: '0 14px', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)', transition: 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.16,1,0.3,1)' }}>
      <div
        style={{ borderRadius: 22, overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.26)', position: 'relative' }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={(e) => { touchX.current = e.targetTouches[0].clientX; setPaused(true); }}
        onTouchEnd={(e) => { const d = touchX.current - e.changedTouches[0].clientX; if (d > 40) go(1); else if (d < -40) go(-1); setPaused(false); }}
      >
        <HeroSlide key={items[index].id} item={items[index]} onClick={onCaseClick} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 14 }}>
        {items.map((_, i) => (
          <button key={i} onClick={() => setIndex(i)} style={{ width: i === index ? 22 : 6, height: 6, borderRadius: 3, border: 'none', background: i === index ? '#0D0D0D' : '#D8D8D4', cursor: 'pointer', padding: 0, transition: 'width 0.35s cubic-bezier(0.16,1,0.3,1), background 0.25s ease' }} />
        ))}
      </div>
    </div>
  );
}

// ─── Portrait Card with hover video preview ───────────────────────────────────

function PortraitCard({ item, onClick }: { item: CaseItem; onClick: (c: CaseItem) => void }) {
  const { ref, tilt, active, onMouseMove, onMouseLeave: tiltLeave } = use3DTilt(12);
  const { preview, onMouseEnter, onMouseLeave: previewLeave } = useCardPreview();

  const handleLeave = () => { tiltLeave(); previewLeave(); };

  return (
    <div
      ref={ref}
      onClick={() => onClick(item)}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={handleLeave}
      style={{
        flexShrink: 0, width: 155, height: 276, borderRadius: 18,
        overflow: 'hidden', cursor: 'pointer', position: 'relative', background: '#111',
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${active ? 1.03 : 1})`,
        transition: active ? 'transform 0.08s ease, box-shadow 0.15s ease' : 'transform 0.55s cubic-bezier(0.23,1,0.32,1), box-shadow 0.4s ease',
        boxShadow: active ? '0 24px 48px rgba(0,0,0,0.38)' : '0 6px 20px rgba(0,0,0,0.18)',
        willChange: 'transform',
      }}
    >
      {/* Static thumbnail */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url(${ytThumb(item.youtubeId)})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        transition: 'opacity 0.3s ease',
        opacity: preview ? 0 : 1,
      }} />

      {/* Muted video preview on hover — scaled 16:9 → fills 9:16 container */}
      {preview && (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', animation: 'fadeIn 0.3s ease' }}>
          <iframe
            src={ytPreview(item.youtubeId)}
            allow="autoplay; encrypted-media"
            style={{
              position: 'absolute', top: 0, left: '50%',
              width: '320%', height: '100%',
              transform: 'translateX(-50%)',
              border: 'none', pointerEvents: 'none',
            }}
          />
        </div>
      )}

      {/* Dark gradient overlay — always on top of video */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.04) 30%, rgba(0,0,0,0.8) 100%)',
      }} />

      {/* Specular light on tilt */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(circle at ${50 + tilt.y * 2.5}% ${50 - tilt.x * 2.5}%, rgba(255,255,255,0.07) 0%, transparent 65%)`,
        transition: 'background 0.08s ease',
      }} />

      {item.duration && (
        <div style={{ position: 'absolute', top: 12, right: 12, color: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: 500, zIndex: 2 }}>
          {item.duration}
        </div>
      )}

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 14px 14px', zIndex: 2 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', lineHeight: 1.4, marginBottom: 10 }}>{item.title}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: item.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 7, fontWeight: 700, color: '#fff' }}>{item.initials}</div>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)' }}>{item.creator.split(' ')[0]}</span>
          </div>
          <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', gap: 3 }}><Eye size={8} /> {item.views}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Landscape Card with hover video preview ──────────────────────────────────

function LandscapeCard({ item, onClick, dark }: { item: CaseItem; onClick: (c: CaseItem) => void; dark?: boolean }) {
  const { ref, tilt, active, onMouseMove, onMouseLeave: tiltLeave } = use3DTilt(6);
  const { preview, onMouseEnter, onMouseLeave: previewLeave } = useCardPreview();

  const handleLeave = () => { tiltLeave(); previewLeave(); };

  return (
    <div
      ref={ref}
      onClick={() => onClick(item)}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={handleLeave}
      style={{
        flexShrink: 0, width: 292, borderRadius: 18, overflow: 'hidden', cursor: 'pointer',
        transform: `perspective(900px) rotateX(${tilt.x * 0.55}deg) rotateY(${tilt.y * 0.55}deg) scale(${active ? 1.025 : 1})`,
        transition: active ? 'transform 0.08s ease, box-shadow 0.15s ease' : 'transform 0.55s cubic-bezier(0.23,1,0.32,1), box-shadow 0.4s ease',
        boxShadow: active ? `0 20px 48px rgba(0,0,0,${dark ? 0.6 : 0.28})` : `0 6px 20px rgba(0,0,0,${dark ? 0.4 : 0.14})`,
        willChange: 'transform',
      }}
    >
      {/* Thumbnail area */}
      <div style={{ width: '100%', aspectRatio: '16/9', position: 'relative', overflow: 'hidden', background: '#111' }}>
        {/* Static thumbnail */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${ytThumb(item.youtubeId)})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          transition: 'opacity 0.3s ease', opacity: preview ? 0 : 1,
        }} />

        {/* Muted video preview — fits 16:9 naturally */}
        {preview && (
          <div style={{ position: 'absolute', inset: 0, animation: 'fadeIn 0.3s ease' }}>
            <iframe
              src={ytPreview(item.youtubeId)}
              allow="autoplay; encrypted-media"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none', pointerEvents: 'none' }}
            />
          </div>
        )}

        {/* Gradient */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.72) 100%)' }} />

        {/* Specular */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(circle at ${50 + tilt.y * 4}% ${50 - tilt.x * 4}%, rgba(255,255,255,0.09) 0%, transparent 65%)`, transition: 'background 0.08s ease' }} />

        {item.duration && <div style={{ position: 'absolute', bottom: 10, right: 10, color: 'rgba(255,255,255,0.55)', fontSize: 10, fontWeight: 500 }}>{item.duration}</div>}
        <div style={{ position: 'absolute', bottom: 10, left: 10, color: 'rgba(255,255,255,0.35)', fontSize: 9, display: 'flex', alignItems: 'center', gap: 3 }}><Eye size={9} /> {item.views}</div>
      </div>

      {/* Info row */}
      <div style={{ padding: '11px 14px 13px', background: dark ? '#161616' : '#fff', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <div style={{ width: 33, height: 33, borderRadius: '50%', background: item.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{item.initials}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: dark ? '#fff' : '#111', lineHeight: 1.35, marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</div>
          <div style={{ fontSize: 10.5, color: dark ? 'rgba(255,255,255,0.32)' : '#999' }}>{item.creator.split(' ')[0]} · {item.spec}</div>
        </div>
      </div>
    </div>
  );
}

// ─── Bento Card with hover video preview ─────────────────────────────────────

function BentoCard({ item, onClick }: { item: CaseItem; onClick: (c: CaseItem) => void }) {
  const { ref, tilt, active, onMouseMove, onMouseLeave: tiltLeave } = use3DTilt(7);
  const { preview, onMouseEnter, onMouseLeave: previewLeave } = useCardPreview();
  const handleLeave = () => { tiltLeave(); previewLeave(); };

  return (
    <div
      ref={ref}
      onClick={() => onClick(item)}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={handleLeave}
      style={{
        width: '100%', height: '100%', borderRadius: 18,
        overflow: 'hidden', cursor: 'pointer', position: 'relative', background: '#111',
        transform: `perspective(800px) rotateX(${tilt.x * 0.7}deg) rotateY(${tilt.y * 0.7}deg) scale(${active ? 1.02 : 1})`,
        transition: active ? 'transform 0.08s ease, box-shadow 0.15s ease' : 'transform 0.55s cubic-bezier(0.23,1,0.32,1), box-shadow 0.4s ease',
        boxShadow: active ? '0 18px 40px rgba(0,0,0,0.32)' : '0 6px 20px rgba(0,0,0,0.16)',
        willChange: 'transform',
      }}
    >
      {/* Static thumbnail */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${ytThumb(item.youtubeId)})`, backgroundSize: 'cover', backgroundPosition: 'center', transition: 'opacity 0.3s ease', opacity: preview ? 0 : 1 }} />

      {/* Muted preview */}
      {preview && (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', animation: 'fadeIn 0.3s ease' }}>
          <iframe src={ytPreview(item.youtubeId)} allow="autoplay; encrypted-media" style={{ position: 'absolute', top: '50%', left: '50%', width: '177.8%', height: '177.8%', transform: 'translate(-50%,-50%)', border: 'none', pointerEvents: 'none' }} />
        </div>
      )}

      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(to bottom, rgba(0,0,0,0.04) 20%, rgba(0,0,0,0.82) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(circle at ${50 + tilt.y * 3}% ${50 - tilt.x * 3}%, rgba(255,255,255,0.07) 0%, transparent 65%)`, transition: 'background 0.08s ease' }} />

      {item.duration && <div style={{ position: 'absolute', top: 12, right: 12, color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 500 }}>{item.duration}</div>}

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 14px 14px' }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: '#fff', lineHeight: 1.4, marginBottom: 8 }}>{item.title}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 18, height: 18, borderRadius: '50%', background: item.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 6, fontWeight: 700, color: '#fff' }}>{item.initials}</div>
            <span style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.5)' }}>{item.creator.split(' ')[0]}</span>
          </div>
          <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.32)', display: 'flex', alignItems: 'center', gap: 3 }}><Eye size={8} /> {item.views}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Bento Section ────────────────────────────────────────────────────────────

function BentoSection({ section, onCaseClick }: { section: Section; onCaseClick: (c: CaseItem) => void }) {
  const { ref, visible } = useScrollReveal(0.05);
  const [a, b, c] = section.cases;
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(28px)', transition: 'opacity 0.55s ease, transform 0.55s cubic-bezier(0.16,1,0.3,1)' }}>
      <div style={{ padding: '0 16px', marginBottom: 16, position: 'relative' }}>
        <span style={{ position: 'absolute', left: 12, bottom: -6, fontSize: 88, fontWeight: 900, lineHeight: 1, letterSpacing: '-0.04em', userSelect: 'none', pointerEvents: 'none', color: 'rgba(0,0,0,0.04)' }}>{section.num}</span>
        <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.03em', color: '#0D0D0D', position: 'relative' }}>{section.genre}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10, padding: '0 16px' }}>
        <div style={{ aspectRatio: '4/3' }}><BentoCard item={a} onClick={onCaseClick} /></div>
        <div style={{ gridRow: '1 / span 2' }}><BentoCard item={b} onClick={onCaseClick} /></div>
        <div style={{ aspectRatio: '4/3' }}><BentoCard item={c} onClick={onCaseClick} /></div>
      </div>
    </div>
  );
}

// ─── Section Row ──────────────────────────────────────────────────────────────

function SectionRow({ section, onCaseClick }: { section: Section; onCaseClick: (c: CaseItem) => void }) {
  const { ref, visible } = useScrollReveal(0.05);
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(28px)', transition: 'opacity 0.55s ease, transform 0.55s cubic-bezier(0.16,1,0.3,1)', paddingTop: section.dark ? 28 : 0, paddingBottom: section.dark ? 28 : 0, background: section.dark ? '#0D0D0D' : 'transparent' }}>
      <div style={{ padding: '0 16px', marginBottom: 16, position: 'relative' }}>
        <span style={{ position: 'absolute', left: 12, bottom: -6, fontSize: 88, fontWeight: 900, lineHeight: 1, letterSpacing: '-0.04em', userSelect: 'none', pointerEvents: 'none', color: section.dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)' }}>{section.num}</span>
        <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.03em', color: section.dark ? '#fff' : '#0D0D0D', position: 'relative' }}>{section.genre}</span>
      </div>
      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingLeft: 16, paddingRight: 16, paddingBottom: 6 }} className="no-scrollbar">
        {section.cases.map((item) =>
          section.layout === 'portrait'
            ? <PortraitCard key={item.id} item={item} onClick={onCaseClick} />
            : <LandscapeCard key={item.id} item={item} onClick={onCaseClick} dark={section.dark} />
        )}
      </div>
    </div>
  );
}

// ─── Modal with click-to-play YouTube player ──────────────────────────────────

function Modal({ item, onClose }: { item: CaseItem; onClose: () => void }) {
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', animation: 'fadeIn 0.2s ease' }} />
      <div className="modal-inner" style={{ position: 'fixed', zIndex: 101, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 'min(880px,calc(100vw - 28px))', maxHeight: 'calc(100vh - 40px)', background: '#fff', borderRadius: 26, boxShadow: '0 48px 100px rgba(0,0,0,0.45)', overflow: 'hidden', display: 'flex', animation: 'slideUp 0.32s cubic-bezier(0.16,1,0.3,1)' }}>

        {/* ── VIDEO PANEL ─────────────────────────────────────────── */}
        <div style={{ flex: '0 0 52%', position: 'relative', background: '#000', overflow: 'hidden', minHeight: 500 }}>
          {playing ? (
            /* Full player with sound */
            <iframe
              src={ytPlayer(item.youtubeId)}
              allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
              allowFullScreen
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
            />
          ) : (
            /* Click-to-play thumbnail */
            <div
              onClick={() => setPlaying(true)}
              style={{
                position: 'absolute', inset: 0, cursor: 'pointer',
                backgroundImage: `url(${ytMaxThumb(item.youtubeId)})`,
                backgroundSize: 'cover', backgroundPosition: 'center',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {/* Overlay */}
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.38)' }} />

              {/* Play CTA */}
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 76, height: 76, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 40px rgba(0,0,0,0.4)', transition: 'transform 0.2s ease' }}>
                  <Play size={30} fill="#111" stroke="none" style={{ marginLeft: 5 }} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.9)', letterSpacing: '-0.01em' }}>
                  Смотреть видео
                </span>
              </div>

              {/* Title at bottom */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '60px 26px 26px', background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, transparent 100%)' }}>
                <div style={{ fontSize: 19, fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>{item.title}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 6 }}>{item.creator} · {item.city}</div>
              </div>
            </div>
          )}
        </div>

        {/* ── INFO PANEL ──────────────────────────────────────────── */}
        <div style={{ flex: 1, padding: 32, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
          <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, width: 34, height: 34, borderRadius: '50%', border: '1px solid #E8E8E6', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', zIndex: 10 }}>
            <X size={14} />
          </button>

          <div>
            <div style={{ fontSize: 50, fontWeight: 900, color: '#0D0D0D', letterSpacing: '-0.04em', lineHeight: 1 }}>{item.views}</div>
            <div style={{ fontSize: 12, color: '#CCC', marginTop: 3 }}>просмотров</div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 46, height: 46, borderRadius: '50%', background: item.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{item.initials}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#111' }}>{item.creator}</div>
              <div style={{ fontSize: 12, color: '#AAA', marginTop: 2 }}>{item.spec} · {item.city}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              {[1,2,3,4,5].map((i) => <Star key={i} size={11} fill={i <= Math.round(item.rating) ? '#C8A96E' : 'none'} stroke={i <= Math.round(item.rating) ? '#C8A96E' : '#DDD'} />)}
              <span style={{ fontSize: 11.5, color: '#AAA', marginLeft: 4 }}>{item.rating}</span>
            </div>
          </div>

          <div style={{ height: 1, background: '#F0F0EE' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#CCC', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 6 }}>Задача</div>
              <div style={{ fontSize: 14, color: '#444', lineHeight: 1.6 }}>{item.task}</div>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#CCC', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 6 }}>Результат</div>
              <div style={{ fontSize: 14, color: '#111', lineHeight: 1.6, fontWeight: 600 }}>{item.result}</div>
            </div>
          </div>

          <div style={{ height: 1, background: '#F0F0EE' }} />

          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#CCC', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 12 }}>Команда</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['Сценарист', 'Оператор', 'Монтаж'].map((role) => (
                <span key={role} style={{ background: '#F5F5F3', color: '#555', borderRadius: 9, fontSize: 12, fontWeight: 500, padding: '6px 14px', border: '1px solid #EEEEED' }}>{role}</span>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 'auto', paddingTop: 4 }}>
            <button style={{ width: '100%', height: 52, background: '#0D0D0D', color: '#fff', border: 'none', borderRadius: 16, fontSize: 15, fontWeight: 700, cursor: 'pointer', letterSpacing: '-0.01em' }}>
              Нанять автора → Telegram
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [activeNav, setActiveNav] = useState('feed');
  const [selectedCase, setSelectedCase] = useState<CaseItem | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => {
    document.body.style.overflow = selectedCase ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedCase]);

  return (
    <>
      <div style={{ filter: selectedCase ? 'blur(4px) saturate(0.4)' : 'none', transition: 'filter 0.25s ease', pointerEvents: selectedCase ? 'none' : 'auto' }}>
        <header style={{ position: 'sticky', top: 0, zIndex: 50, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', background: scrolled ? 'rgba(245,245,243,0.9)' : '#F5F5F3', backdropFilter: scrolled ? 'blur(20px)' : 'none', WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none', boxShadow: scrolled ? '0 1px 0 rgba(0,0,0,0.05)' : 'none', transition: 'background 0.2s ease, box-shadow 0.2s ease' }}>
          <span style={{ fontSize: 21, fontWeight: 900, color: '#0D0D0D', letterSpacing: '-0.07em' }}>CH</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Search size={16} color="#444" /></button>
            <button style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
              <Bell size={16} color="#444" />
              <div style={{ position: 'absolute', top: 8, right: 8, width: 6, height: 6, borderRadius: '50%', background: '#0D0D0D', border: '1.5px solid #F5F5F3' }} />
            </button>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#3A4A5C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>AK</div>
          </div>
        </header>

        <main style={{ paddingBottom: 110 }}>
          <div style={{ padding: '14px 0 30px' }}>
            <HeroCarousel items={HERO_ITEMS} onCaseClick={setSelectedCase} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 34 }}>
            {SECTIONS.map((section, i) => (
              <>
                {i === 2 && <Ticker key="ticker" />}
                {section.layout === 'bento'
                  ? <BentoSection key={section.id} section={section} onCaseClick={setSelectedCase} />
                  : <SectionRow key={section.id} section={section} onCaseClick={setSelectedCase} />
                }
              </>
            ))}
          </div>
        </main>
      </div>

      {selectedCase && <Modal item={selectedCase} onClose={() => setSelectedCase(null)} />}
      <BottomNav active={activeNav} onChange={setActiveNav} />

      <style>{`
        @media (max-width: 640px) {
          .modal-inner { flex-direction: column !important; top: auto !important; left: 0 !important; right: 0 !important; bottom: 0 !important; transform: none !important; width: 100% !important; max-height: 93vh !important; border-radius: 24px 24px 0 0 !important; }
          .modal-inner > div:first-child { flex: 0 0 auto !important; min-height: unset !important; aspect-ratio: 16/9 !important; }
        }
      `}</style>
    </>
  );
}
