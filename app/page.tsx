'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Eye, X, Search, Bell, Home, Users, Briefcase, User, ChevronRight, Star } from 'lucide-react';

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
  seed: string;
  accent: string;
  gradient: string;
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
  accentColor: string;
  layout: 'portrait' | 'landscape';
  dark?: boolean;
  cases: CaseItem[];
};

// ─── Data ────────────────────────────────────────────────────────────────────

const SECTIONS: Section[] = [
  {
    id: 'reels',
    num: '01',
    genre: 'Reels & Shorts',
    accentColor: '#FF2D55',
    layout: 'portrait',
    cases: [
      { id: 'r1', title: 'Fashion Reels для ModaUz', creator: 'Nilufar Rashidova', initials: 'NR', avatarColor: '#FF2D55', spec: 'Мобилограф', views: '142K', viewsNum: 142, seed: 'fashion-model-runway', accent: '#FF2D55', gradient: 'linear-gradient(160deg,#FF2D5566 0%,#FF9F0A44 50%,#0D0D0D 100%)', isPro: true, duration: '0:28', task: 'Вирусные Reels для кийим бренди', result: '+800 подписчиков за 2 дня', city: 'Самарканд', rating: 4.8 },
      { id: 'r2', title: 'Вирал Shorts +2K продаж', creator: 'Azizbek Karimov', initials: 'AK', avatarColor: '#0A84FF', spec: 'Сценарист', views: '540K', viewsNum: 540, seed: 'beauty-cosmetics-glam', accent: '#0A84FF', gradient: 'linear-gradient(160deg,#0A84FF55 0%,#5E5CE655 50%,#0D0D0D 100%)', isPro: false, duration: '0:35', task: 'Вирал контент beauty бренда', result: '+2000 продаж в первую неделю', city: 'Ташкент', rating: 5.0 },
      { id: 'r3', title: 'Food Reels ресторан', creator: 'Feruza Nazarova', initials: 'FN', avatarColor: '#30D158', spec: 'Мобилограф', views: '230K', viewsNum: 230, seed: 'gourmet-food-restaurant', accent: '#30D158', gradient: 'linear-gradient(160deg,#30D15855 0%,#0A84FF33 50%,#0D0D0D 100%)', isPro: true, duration: '0:22', task: 'Таом съёмкаси', result: '+1200 подписчиков', city: 'Ташкент', rating: 4.9 },
      { id: 'r4', title: 'Beauty контент — серия', creator: 'Nilufar Rashidova', initials: 'NR', avatarColor: '#BF5AF2', spec: 'Мобилограф', views: '89K', viewsNum: 89, seed: 'makeup-beauty-skincare', accent: '#BF5AF2', gradient: 'linear-gradient(160deg,#BF5AF255 0%,#FF2D5533 50%,#0D0D0D 100%)', isPro: true, duration: '0:31', task: '5 роликов beauty серии', result: '3 ролика попали в топ', city: 'Самарканд', rating: 4.8 },
      { id: 'r5', title: 'Кафе атмосфера — промо', creator: 'Feruza Nazarova', initials: 'FN', avatarColor: '#FF9F0A', spec: 'Мобилограф', views: '88K', viewsNum: 88, seed: 'cozy-coffee-morning', accent: '#FF9F0A', gradient: 'linear-gradient(160deg,#FF9F0A55 0%,#FF2D5533 50%,#0D0D0D 100%)', isPro: true, duration: '0:19', task: 'Кафе промо', result: '88K просмотров', city: 'Ташкент', rating: 4.9 },
    ],
  },
  {
    id: 'youtube',
    num: '02',
    genre: 'YouTube-шоу',
    accentColor: '#FF453A',
    layout: 'landscape',
    cases: [
      { id: 'y1', title: 'Рекламный промо — рекорд канала', creator: 'Jasur Yusupov', initials: 'JY', avatarColor: '#BF5AF2', spec: 'Монтажёр', views: '320K', viewsNum: 320, seed: 'video-studio-production', accent: '#BF5AF2', gradient: 'linear-gradient(180deg,#BF5AF244 0%,#0D0D0D 100%)', isPro: true, duration: '1:45', task: 'Бренд рекламавий ролик', result: 'Рекорд канала 320K', city: 'Ташкент', rating: 4.9 },
      { id: 'y2', title: 'Tech обзор ноутбука 12 мин', creator: 'Jasur Yusupov', initials: 'JY', avatarColor: '#0A84FF', spec: 'Монтажёр', views: '180K', viewsNum: 180, seed: 'laptop-desk-technology', accent: '#0A84FF', gradient: 'linear-gradient(180deg,#0A84FF44 0%,#0D0D0D 100%)', isPro: true, duration: '12:30', task: 'Tech обзор монтажи', result: '180K просмотров', city: 'Ташкент', rating: 4.9 },
      { id: 'y3', title: 'Сценарий YouTube — разбор кейса', creator: 'Azizbek Karimov', initials: 'AK', avatarColor: '#5E5CE6', spec: 'Сценарист', views: '120K', viewsNum: 120, seed: 'typewriter-writing-script', accent: '#5E5CE6', gradient: 'linear-gradient(180deg,#5E5CE644 0%,#0D0D0D 100%)', isPro: false, duration: '8:15', task: 'Обзор сценарийи', result: '120K просмотров', city: 'Ташкент', rating: 5.0 },
      { id: 'y4', title: 'E-commerce продакшн', creator: 'Doniyor Toshmatov', initials: 'DT', avatarColor: '#5E5CE6', spec: 'Продюсер', views: '45K', viewsNum: 45, seed: 'product-photography-studio', accent: '#5E5CE6', gradient: 'linear-gradient(180deg,#5E5CE644 0%,#0D0D0D 100%)', isPro: false, duration: '2:40', task: 'Предметли съёмка', result: 'Конверсия +25%', city: 'Бухара', rating: 4.6 },
    ],
  },
  {
    id: 'music',
    num: '03',
    genre: 'Муз. клипы',
    accentColor: '#BF5AF2',
    layout: 'landscape',
    dark: true,
    cases: [
      { id: 'm1', title: 'Клип для местного артиста', creator: 'Jasur Yusupov', initials: 'JY', avatarColor: '#FF9F0A', spec: 'Монтажёр', views: '210K', viewsNum: 210, seed: 'concert-stage-lights', accent: '#FF9F0A', gradient: 'linear-gradient(180deg,#FF9F0A33 0%,#000 100%)', isPro: true, duration: '3:22', task: 'Локал артист клип', result: '210K просмотров', city: 'Ташкент', rating: 4.9 },
      { id: 'm2', title: 'Кино-стиль монтаж', creator: 'Otabek Xoliqov', initials: 'OX', avatarColor: '#64D2FF', spec: 'Колорист', views: '150K', viewsNum: 150, seed: 'film-cinema-noir', accent: '#64D2FF', gradient: 'linear-gradient(180deg,#64D2FF33 0%,#000 100%)', isPro: false, duration: '4:10', task: 'Короткометраж монтаж', result: 'Фестивальный победитель', city: 'Ташкент', rating: 4.8 },
      { id: 'm3', title: 'Цветокоррекция — реклама', creator: 'Otabek Xoliqov', initials: 'OX', avatarColor: '#0A84FF', spec: 'Монтажёр', views: '92K', viewsNum: 92, seed: 'color-grading-edit', accent: '#0A84FF', gradient: 'linear-gradient(180deg,#0A84FF33 0%,#000 100%)', isPro: false, duration: '2:55', task: 'Реклама колоринг', result: '92K просмотров', city: 'Ташкент', rating: 4.8 },
    ],
  },
  {
    id: 'campaigns',
    num: '04',
    genre: 'Кампейны',
    accentColor: '#FF9F0A',
    layout: 'portrait',
    cases: [
      { id: 'c1', title: 'Таргет ROAS x4.2 за 2 месяца', creator: 'Shahlo Mirzayeva', initials: 'SM', avatarColor: '#FF9F0A', spec: 'Таргетолог', views: '32K', viewsNum: 32, seed: 'analytics-dashboard-growth', accent: '#FF9F0A', gradient: 'linear-gradient(160deg,#FF9F0A55 0%,#FF453A33 50%,#0D0D0D 100%)', isPro: true, duration: null, task: 'Магазин таргет', result: 'ROAS 4.2', city: 'Ташкент', rating: 4.7 },
      { id: 'c2', title: 'Бренд-видео для имиджа', creator: 'Doniyor Toshmatov', initials: 'DT', avatarColor: '#BF5AF2', spec: 'Продюсер', views: '67K', viewsNum: 67, seed: 'brand-identity-logo', accent: '#BF5AF2', gradient: 'linear-gradient(160deg,#BF5AF255 0%,#5E5CE633 50%,#0D0D0D 100%)', isPro: false, duration: '1:30', task: 'Имидж видео', result: '67K просмотров', city: 'Бухара', rating: 4.6 },
      { id: 'c3', title: 'Лайфстайл серия — 5 роликов', creator: 'Feruza Nazarova', initials: 'FN', avatarColor: '#FF9F0A', spec: 'Мобилограф', views: '110K', viewsNum: 110, seed: 'lifestyle-urban-portrait', accent: '#FF9F0A', gradient: 'linear-gradient(160deg,#FF9F0A55 0%,#30D15833 50%,#0D0D0D 100%)', isPro: true, duration: '0:45', task: 'Лайфстайл серия', result: '110K просмотров', city: 'Ташкент', rating: 4.9 },
      { id: 'c4', title: 'SMM beauty — +5K за 2 месяца', creator: 'Shahlo Mirzayeva', initials: 'SM', avatarColor: '#FF2D55', spec: 'SMM', views: '18K', viewsNum: 18, seed: 'social-influencer-phone', accent: '#FF2D55', gradient: 'linear-gradient(160deg,#FF2D5555 0%,#FF9F0A33 50%,#0D0D0D 100%)', isPro: true, duration: null, task: 'Beauty аккаунт', result: '+5000 подписчиков', city: 'Ташкент', rating: 4.7 },
    ],
  },
];

const HERO = SECTIONS[0].cases[1];

// ─── Hooks ────────────────────────────────────────────────────────────────────

function use3DTilt(intensity = 12) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glowing, setGlowing] = useState(false);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;
    setTilt({ x: (ny - 0.5) * -intensity, y: (nx - 0.5) * intensity });
    setGlowing(true);
  }, [intensity]);

  const onMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setGlowing(false);
  }, []);

  return { ref, tilt, glowing, onMouseMove, onMouseLeave };
}

function useScrollReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
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
      const eased = 1 - Math.pow(1 - p, 4);
      setVal(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, trigger, duration]);

  return val;
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
    <nav
      style={{
        position: 'fixed',
        bottom: 14,
        left: 12,
        right: 12,
        zIndex: 60,
        background: 'rgba(18,18,18,0.88)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        borderRadius: 28,
        padding: '6px 6px',
        display: 'flex',
        boxShadow: '0 12px 40px rgba(0,0,0,0.28), 0 0 0 0.5px rgba(255,255,255,0.08)',
      }}
    >
      {NAV.map(({ id, label, Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              border: 'none',
              background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
              borderRadius: 22,
              padding: '8px 0',
              cursor: 'pointer',
              transition: 'background 0.2s ease',
            }}
          >
            <Icon size={21} color={isActive ? '#fff' : 'rgba(255,255,255,0.35)'} strokeWidth={isActive ? 2.2 : 1.6} />
            <span style={{ fontSize: 9.5, fontWeight: isActive ? 600 : 400, color: isActive ? '#fff' : 'rgba(255,255,255,0.35)', letterSpacing: '0.01em' }}>
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

// ─── Hero Card ────────────────────────────────────────────────────────────────

function HeroCard({ item, onClick }: { item: CaseItem; onClick: (c: CaseItem) => void }) {
  const { ref, visible } = useScrollReveal(0.01);
  const count = useCountUp(item.viewsNum, visible);

  return (
    <div
      ref={ref}
      onClick={() => onClick(item)}
      style={{
        margin: '0 14px',
        borderRadius: 24,
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative',
        aspectRatio: '16/9',
        backgroundImage: `
          linear-gradient(160deg, ${item.accent}44 0%, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.88) 100%),
          url(https://picsum.photos/seed/${item.seed}/900/506)
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
        boxShadow: `0 24px 60px rgba(0,0,0,0.22), 0 0 0 0.5px ${item.accent}44`,
      }}
    >
      {/* Keis badge */}
      <div style={{
        position: 'absolute', top: 16, left: 16,
        background: item.accent, color: '#fff',
        fontSize: 10, fontWeight: 800, padding: '5px 11px',
        borderRadius: 10, letterSpacing: '0.06em', textTransform: 'uppercase',
      }}>
        Кейс недели
      </div>

      {/* Duration */}
      {item.duration && (
        <div style={{
          position: 'absolute', top: 16, right: 16,
          background: 'rgba(0,0,0,0.68)', color: '#fff',
          fontSize: 11, fontWeight: 600, padding: '4px 9px', borderRadius: 7,
        }}>
          {item.duration}
        </div>
      )}

      {/* Animated play button */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
          border: '1.5px solid rgba(255,255,255,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 0 0 12px rgba(255,255,255,0.04), 0 0 0 24px rgba(255,255,255,0.02)`,
        }}>
          <Play size={24} fill="#fff" stroke="none" style={{ marginLeft: 3 }} />
        </div>
      </div>

      {/* Bottom overlay */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '0 20px 20px',
        background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
      }}>
        {/* Animated views number */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 48, fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1 }}>
            {count}K
          </span>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: 500, paddingBottom: 4 }}>
            просмотров
          </span>
        </div>
        <div style={{ fontSize: 17, fontWeight: 700, color: '#fff', lineHeight: 1.3, marginBottom: 10 }}>
          {item.title}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 30, height: 30, borderRadius: '50%',
            background: item.avatarColor,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, fontWeight: 800, color: '#fff', flexShrink: 0,
            border: '2px solid rgba(255,255,255,0.2)',
          }}>
            {item.initials}
          </div>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>
            {item.creator}
          </span>
          <span style={{
            background: 'rgba(255,255,255,0.12)',
            color: 'rgba(255,255,255,0.65)',
            borderRadius: 7, fontSize: 10, fontWeight: 600,
            padding: '3px 8px', backdropFilter: 'blur(4px)',
          }}>
            {item.spec}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Portrait Card (9:16) with 3D tilt ────────────────────────────────────────

function PortraitCard({ item, onClick }: { item: CaseItem; onClick: (c: CaseItem) => void }) {
  const { ref, tilt, glowing, onMouseMove, onMouseLeave } = use3DTilt(14);

  return (
    <div
      ref={ref}
      onClick={() => onClick(item)}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        flexShrink: 0,
        width: 155,
        height: 276,
        borderRadius: 18,
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative',
        backgroundImage: `
          ${item.gradient},
          url(https://picsum.photos/seed/${item.seed}/310/552)
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${glowing ? 1.03 : 1})`,
        transition: glowing
          ? 'transform 0.1s ease, box-shadow 0.2s ease'
          : 'transform 0.5s cubic-bezier(0.23,1,0.32,1), box-shadow 0.4s ease',
        boxShadow: glowing
          ? `0 20px 40px rgba(0,0,0,0.3), 0 0 28px ${item.accent}55`
          : '0 8px 24px rgba(0,0,0,0.18)',
        willChange: 'transform',
      }}
    >
      {/* Noise texture overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'200\' height=\'200\' filter=\'url(%23n)\' opacity=\'0.04\'/%3E%3C/svg%3E")',
        backgroundRepeat: 'repeat',
        backgroundSize: '200px 200px',
        opacity: 0.6,
        mixBlendMode: 'overlay',
      }} />

      {/* Accent strip */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: 3, height: '100%',
        background: `linear-gradient(to bottom, ${item.accent}, transparent)`,
        zIndex: 2,
      }} />

      {/* Duration */}
      {item.duration && (
        <div style={{
          position: 'absolute', top: 11, right: 11, zIndex: 3,
          background: 'rgba(0,0,0,0.75)', color: '#fff',
          fontSize: 9, fontWeight: 700, padding: '3px 7px', borderRadius: 6,
          backdropFilter: 'blur(4px)',
        }}>
          {item.duration}
        </div>
      )}

      {/* PRO */}
      {item.isPro && (
        <div style={{
          position: 'absolute', top: 11, left: 12, zIndex: 3,
          background: 'linear-gradient(135deg,#BF5AF2,#9A44D9)',
          color: '#fff', fontSize: 8, fontWeight: 800,
          padding: '3px 7px', borderRadius: 5, letterSpacing: '0.04em',
        }}>
          PRO
        </div>
      )}

      {/* Glow shine effect */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
        background: `radial-gradient(circle at ${50 + tilt.y * 2}% ${50 - tilt.x * 2}%, rgba(255,255,255,0.1) 0%, transparent 60%)`,
        transition: 'background 0.1s ease',
      }} />

      {/* Bottom */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '0 13px 13px', zIndex: 4,
        background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
      }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: '#fff', lineHeight: 1.35, marginBottom: 8 }}>
          {item.title}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{
              width: 20, height: 20, borderRadius: '50%',
              background: item.avatarColor,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 7, fontWeight: 800, color: '#fff', flexShrink: 0,
            }}>
              {item.initials}
            </div>
            <span style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.65)' }}>
              {item.creator.split(' ')[0]}
            </span>
          </div>
          <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', gap: 3 }}>
            <Eye size={8} /> {item.views}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Landscape Card (16:9) with 3D tilt ──────────────────────────────────────

function LandscapeCard({ item, onClick, dark }: { item: CaseItem; onClick: (c: CaseItem) => void; dark?: boolean }) {
  const { ref, tilt, glowing, onMouseMove, onMouseLeave } = use3DTilt(8);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      onClick={() => onClick(item)}
      onMouseMove={onMouseMove}
      onMouseLeave={(e) => { onMouseLeave(); setHovered(false); }}
      onMouseEnter={() => setHovered(true)}
      style={{
        flexShrink: 0,
        width: 290,
        borderRadius: 18,
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative',
        transform: `perspective(900px) rotateX(${tilt.x * 0.6}deg) rotateY(${tilt.y * 0.6}deg) scale(${glowing ? 1.025 : 1})`,
        transition: glowing
          ? 'transform 0.1s ease, box-shadow 0.2s ease'
          : 'transform 0.5s cubic-bezier(0.23,1,0.32,1), box-shadow 0.4s ease',
        boxShadow: glowing
          ? `0 16px 40px rgba(0,0,0,${dark ? '0.5' : '0.25'}), 0 0 24px ${item.accent}44`
          : `0 6px 20px rgba(0,0,0,${dark ? '0.4' : '0.14'})`,
        willChange: 'transform',
      }}
    >
      {/* Thumbnail */}
      <div style={{
        width: '100%', aspectRatio: '16/9',
        backgroundImage: `
          ${item.gradient},
          url(https://picsum.photos/seed/${item.seed}/580/326)
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Shine */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `radial-gradient(circle at ${50 + tilt.y * 3}% ${50 - tilt.x * 3}%, rgba(255,255,255,0.12) 0%, transparent 65%)`,
          transition: 'background 0.1s ease',
        }} />

        {/* Duration */}
        {item.duration && (
          <div style={{
            position: 'absolute', bottom: 9, right: 9,
            background: 'rgba(0,0,0,0.8)', color: '#fff',
            fontSize: 10, fontWeight: 700, padding: '3px 7px', borderRadius: 6,
          }}>
            {item.duration}
          </div>
        )}

        {/* Views */}
        <div style={{
          position: 'absolute', bottom: 9, left: 9,
          color: 'rgba(255,255,255,0.65)', fontSize: 10,
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          <Eye size={10} /> {item.views}
        </div>

        {/* Hover play overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: hovered ? 1 : 0, transition: 'opacity 0.2s ease',
          pointerEvents: 'none',
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: 'rgba(255,255,255,0.88)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transform: hovered ? 'scale(1)' : 'scale(0.75)',
            transition: 'transform 0.2s ease',
          }}>
            <Play size={18} fill="#111" stroke="none" style={{ marginLeft: 2 }} />
          </div>
        </div>
      </div>

      {/* Info row */}
      <div style={{
        padding: '11px 13px 12px',
        background: dark ? '#1A1A1A' : '#fff',
        display: 'flex', gap: 10, alignItems: 'flex-start',
      }}>
        <div style={{
          width: 33, height: 33, borderRadius: '50%',
          background: item.avatarColor,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10, fontWeight: 800, color: '#fff', flexShrink: 0,
        }}>
          {item.initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 12, fontWeight: 700,
            color: dark ? '#fff' : '#111',
            lineHeight: 1.35, marginBottom: 3,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {item.title}
          </div>
          <div style={{ fontSize: 10, color: dark ? 'rgba(255,255,255,0.4)' : '#999' }}>
            {item.creator.split(' ')[0]} · {item.spec}
          </div>
        </div>
        {item.isPro && (
          <span style={{
            background: dark ? 'rgba(191,90,242,0.25)' : '#F0E8FF',
            color: '#BF5AF2',
            fontSize: 9, fontWeight: 800, padding: '3px 7px', borderRadius: 5, flexShrink: 0,
          }}>
            PRO
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Section Row ──────────────────────────────────────────────────────────────

function SectionRow({ section, onCaseClick }: { section: Section; onCaseClick: (c: CaseItem) => void }) {
  const { ref, visible } = useScrollReveal(0.05);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.16,1,0.3,1)',
        paddingTop: section.dark ? 28 : 0,
        paddingBottom: section.dark ? 28 : 0,
        background: section.dark ? '#0D0D0D' : 'transparent',
      }}
    >
      {/* Section header */}
      <div style={{
        padding: '0 16px',
        marginBottom: 14,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Large section number (decorative) */}
        <span style={{
          position: 'absolute',
          left: 10,
          bottom: -8,
          fontSize: 80,
          fontWeight: 900,
          color: section.dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
          lineHeight: 1,
          letterSpacing: '-0.04em',
          userSelect: 'none',
          pointerEvents: 'none',
        }}>
          {section.num}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative' }}>
          <div style={{
            width: 4, height: 22,
            background: `linear-gradient(to bottom, ${section.accentColor}, ${section.accentColor}88)`,
            borderRadius: 2, flexShrink: 0,
          }} />
          <span style={{
            fontSize: 19, fontWeight: 800,
            color: section.dark ? '#fff' : '#0D0D0D',
            letterSpacing: '-0.025em',
          }}>
            {section.genre}
          </span>
        </div>

        <button style={{
          border: 'none', background: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 2,
          color: section.accentColor, fontSize: 12, fontWeight: 600,
          padding: 0, position: 'relative',
        }}>
          Все <ChevronRight size={14} />
        </button>
      </div>

      {/* Cards */}
      <div
        style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingLeft: 16, paddingRight: 16, paddingBottom: 6 }}
        className="no-scrollbar"
      >
        {section.cases.map((item) =>
          section.layout === 'portrait' ? (
            <PortraitCard key={item.id} item={item} onClick={onCaseClick} />
          ) : (
            <LandscapeCard key={item.id} item={item} onClick={onCaseClick} dark={section.dark} />
          )
        )}
      </div>
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

function Modal({ item, onClose }: { item: CaseItem; onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
          animation: 'fadeIn 0.2s ease',
        }}
      />
      <div
        className="modal-inner"
        style={{
          position: 'fixed', zIndex: 101,
          top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: 'min(880px,calc(100vw - 28px))',
          maxHeight: 'calc(100vh - 40px)',
          background: '#fff', borderRadius: 26,
          boxShadow: `0 40px 100px rgba(0,0,0,0.35), 0 0 0 1px ${item.accent}22`,
          overflow: 'hidden', display: 'flex',
          animation: 'slideUp 0.32s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {/* Left: media */}
        <div style={{
          flex: '0 0 52%',
          backgroundImage: `
            linear-gradient(160deg,${item.accent}44 0%,rgba(0,0,0,0.85) 100%),
            url(https://picsum.photos/seed/${item.seed}/700/800)
          `,
          backgroundSize: 'cover', backgroundPosition: 'center',
          position: 'relative', minHeight: 500,
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: 68, height: 68, borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
              border: '1.5px solid rgba(255,255,255,0.28)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: `0 0 0 16px rgba(255,255,255,0.04), 0 0 0 32px rgba(255,255,255,0.02)`,
            }}>
              <Play size={26} fill="#fff" stroke="none" style={{ marginLeft: 4 }} />
            </div>
          </div>

          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: '60px 24px 24px',
            background: 'linear-gradient(to top,rgba(0,0,0,0.8) 0%,transparent 100%)',
          }}>
            <div style={{ fontSize: 19, fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>
              {item.title}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 5 }}>
              {item.creator} · {item.city}
            </div>
          </div>
        </div>

        {/* Right: info */}
        <div style={{
          flex: 1, padding: 30, overflowY: 'auto',
          display: 'flex', flexDirection: 'column', gap: 22,
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: 16, right: 16,
              width: 34, height: 34, borderRadius: '50%',
              border: '1px solid #E8E8E6', background: '#fff',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#666', zIndex: 10,
            }}
          >
            <X size={14} />
          </button>

          {/* Spec */}
          <div>
            <span style={{
              background: `${item.accent}18`, color: item.accent,
              borderRadius: 9, fontSize: 11, fontWeight: 800,
              padding: '5px 12px', textTransform: 'uppercase', letterSpacing: '0.05em',
            }}>
              {item.spec}
            </span>
          </div>

          {/* Views */}
          <div>
            <div style={{ fontSize: 48, fontWeight: 900, color: '#0D0D0D', letterSpacing: '-0.04em', lineHeight: 1 }}>
              {item.views}
            </div>
            <div style={{ fontSize: 12, color: '#AAA', marginTop: 2 }}>просмотров</div>
          </div>

          {/* Author */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: `linear-gradient(135deg, ${item.avatarColor}, ${item.avatarColor}cc)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 800, color: '#fff', flexShrink: 0,
              boxShadow: `0 4px 14px ${item.avatarColor}55`,
            }}>
              {item.initials}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#111' }}>{item.creator}</div>
              <div style={{ fontSize: 11, color: '#999', marginTop: 1 }}>{item.city}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={11} fill={i <= Math.round(item.rating) ? '#FFD60A' : 'none'} stroke={i <= Math.round(item.rating) ? '#FFD60A' : '#ddd'} />
              ))}
              <span style={{ fontSize: 12, color: '#888', marginLeft: 3 }}>{item.rating}</span>
            </div>
          </div>

          {/* Task & Result */}
          <div style={{ background: '#F6F6F4', borderRadius: 16, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <div style={{ fontSize: 9, fontWeight: 800, color: '#BBB', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5 }}>Задача</div>
              <div style={{ fontSize: 13, color: '#333', lineHeight: 1.55 }}>{item.task}</div>
            </div>
            <div style={{ height: 1, background: '#E8E8E6' }} />
            <div>
              <div style={{ fontSize: 9, fontWeight: 800, color: '#BBB', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5 }}>Результат</div>
              <div style={{ fontSize: 13, color: '#333', lineHeight: 1.55, fontWeight: 600 }}>{item.result}</div>
            </div>
          </div>

          {/* Team */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#CCC', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>
              Команда
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['Сценарист', 'Оператор', 'Монтаж'].map((role) => (
                <span key={role} style={{
                  background: '#F0F0EE', color: '#555',
                  borderRadius: 9, fontSize: 12, fontWeight: 500,
                  padding: '6px 13px',
                }}>
                  {role}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{ marginTop: 'auto', paddingTop: 4 }}>
            <button style={{
              width: '100%', height: 52,
              background: `linear-gradient(135deg, #111 0%, #333 100%)`,
              color: '#fff', border: 'none', borderRadius: 16,
              fontSize: 15, fontWeight: 700, cursor: 'pointer',
              letterSpacing: '-0.01em',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            }}>
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
      <div style={{
        filter: selectedCase ? 'blur(3px) saturate(0.5)' : 'none',
        transition: 'filter 0.25s ease',
        pointerEvents: selectedCase ? 'none' : 'auto',
      }}>
        {/* ── HEADER ────────────────────────────────────────────────────── */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 50,
          height: 56, display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '0 16px',
          transition: 'background 0.2s ease, box-shadow 0.2s ease',
          background: scrolled ? 'rgba(245,245,243,0.88)' : '#F5F5F3',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
          boxShadow: scrolled ? '0 1px 0 rgba(0,0,0,0.05)' : 'none',
        }}>
          <div style={{ fontSize: 21, fontWeight: 900, color: '#0D0D0D', letterSpacing: '-0.07em', lineHeight: 1 }}>
            CH
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button style={{
              width: 36, height: 36, borderRadius: '50%',
              border: 'none', background: 'rgba(0,0,0,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}>
              <Search size={16} color="#444" />
            </button>
            <button style={{
              width: 36, height: 36, borderRadius: '50%',
              border: 'none', background: 'rgba(0,0,0,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', position: 'relative',
            }}>
              <Bell size={16} color="#444" />
              <div style={{
                position: 'absolute', top: 7, right: 7,
                width: 7, height: 7, borderRadius: '50%',
                background: '#FF453A', border: '1.5px solid #F5F5F3',
              }} />
            </button>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg,#BF5AF2,#9A44D9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 800, color: '#fff', cursor: 'pointer',
              boxShadow: '0 3px 10px rgba(191,90,242,0.4)',
            }}>
              AK
            </div>
          </div>
        </header>

        {/* ── CONTENT ───────────────────────────────────────────────────── */}
        <main style={{ paddingBottom: 110 }}>
          <div style={{ padding: '14px 0 28px' }}>
            <HeroCard item={HERO} onClick={setSelectedCase} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {SECTIONS.map((section) => (
              <SectionRow key={section.id} section={section} onCaseClick={setSelectedCase} />
            ))}
          </div>
        </main>
      </div>

      {selectedCase && <Modal item={selectedCase} onClose={() => setSelectedCase(null)} />}
      <BottomNav active={activeNav} onChange={setActiveNav} />

      <style>{`
        @media (max-width: 640px) {
          .modal-inner {
            flex-direction: column !important;
            top: auto !important; left: 0 !important;
            right: 0 !important; bottom: 0 !important;
            transform: none !important;
            width: 100% !important; max-height: 93vh !important;
            border-radius: 24px 24px 0 0 !important;
          }
          .modal-inner > div:first-child {
            flex: 0 0 auto !important;
            min-height: unset !important;
            aspect-ratio: 16/9 !important;
          }
        }
      `}</style>
    </>
  );
}
