'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Bell, Star, Eye, MapPin, Briefcase } from 'lucide-react';
import { getCreatorProfiles, ytThumb, type CreatorProfile, type CaseItem } from '@/lib/data';
import { BottomNav } from '@/app/components/BottomNav';
import { SearchOverlay } from '@/app/components/SearchOverlay';

// ── Spec colors ────────────────────────────────────────────────────────────────

const SPEC_COLOR: Record<string, string> = {
  'Мобилограф': '#FF6B3D',
  'Монтажёр':   '#4D8EFF',
  'Сценарист':  '#A855F7',
  'Колорист':   '#22C97A',
  'Продюсер':   '#F5A623',
  'Таргетолог': '#0DD8E8',
};

// ── Data ──────────────────────────────────────────────────────────────────────

const CREATORS = getCreatorProfiles()
  .sort((a, b) => b.totalViews - a.totalViews);

// ── Hooks ──────────────────────────────────────────────────────────────────────

function useCountUp(target: number, trigger: boolean, duration = 1100) {
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

function useInView(threshold = 0.08) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

// ── Spec badge ─────────────────────────────────────────────────────────────────

function SpecBadge({ spec }: { spec: string }) {
  const color = SPEC_COLOR[spec] ?? '#888';
  return (
    <span style={{
      fontSize: 9, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase',
      color: '#fff', background: color,
      borderRadius: 6, padding: '3px 8px',
      whiteSpace: 'nowrap',
    }}>
      {spec}
    </span>
  );
}

// ── Thumbnail strip ────────────────────────────────────────────────────────────

function ThumbStrip({ cases }: { cases: CaseItem[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 5 }}>
      {cases.slice(0, 3).map((c, i) => (
        <div key={i} style={{ aspectRatio: '16/9', borderRadius: 9, overflow: 'hidden', background: '#222' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ytThumb(c.youtubeId)} alt={c.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
      ))}
    </div>
  );
}

// ── Creator card ───────────────────────────────────────────────────────────────

function CreatorCard({ creator, index }: { creator: CreatorProfile; index: number }) {
  const { ref, visible } = useInView(0.04);
  const views = useCountUp(creator.totalViews, visible);

  return (
    <div
      ref={ref}
      style={{
        borderRadius: 22, background: '#111', padding: '20px 20px 17px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        position: 'relative', overflow: 'hidden',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(22px)',
        transition: `opacity 0.5s ease ${index * 80}ms, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${index * 80}ms`,
      }}
    >
      {/* Glow */}
      <div style={{
        position: 'absolute', top: -50, right: -50, width: 220, height: 220,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${creator.avatarColor}28 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 17, position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
          <div style={{
            width: 54, height: 54, borderRadius: '50%', background: creator.avatarColor,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 15, fontWeight: 800, color: '#fff', flexShrink: 0,
            boxShadow: `0 4px 16px ${creator.avatarColor}55`,
          }}>
            {creator.initials}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7 }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em' }}>
                {creator.name}
              </span>
              {creator.isPro && (
                <span style={{ fontSize: 8, fontWeight: 800, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#111', background: '#fff', borderRadius: 100, padding: '2px 7px' }}>
                  PRO
                </span>
              )}
            </div>
            <SpecBadge spec={creator.spec} />
          </div>
        </div>

        {/* Views counter */}
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1 }}>
            {views}K
          </div>
          <div style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.3)', fontWeight: 500, marginTop: 2 }}>
            просмотров
          </div>
        </div>
      </div>

      {/* Thumbnails */}
      <ThumbStrip cases={creator.cases} />

      {/* Footer stats */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 13, flexWrap: 'wrap' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>
          <Briefcase size={10} />{creator.caseCount} {creator.caseCount < 5 ? 'работы' : 'работ'}
        </span>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.18)' }}>·</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>
          <Star size={10} fill="rgba(255,255,255,0.35)" stroke="none" />{creator.rating.toFixed(1)}
        </span>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.18)' }}>·</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>
          <MapPin size={10} />{creator.city}
        </span>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function CreatorsPage() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <>
      <div style={{
        transform: searchOpen ? 'scale(0.93)' : 'scale(1)',
        filter: searchOpen ? 'blur(3px) brightness(0.62)' : 'none',
        transformOrigin: 'top center',
        transition: 'transform 0.38s cubic-bezier(0.16,1,0.3,1), filter 0.38s ease',
        pointerEvents: searchOpen ? 'none' : 'auto',
      }}>
        <div style={{ background: '#F5F5F3', minHeight: '100vh', paddingBottom: 100 }}>

          {/* ── Header ── */}
          <header style={{
            position: 'sticky', top: 0, zIndex: 50, height: 56,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 16px',
            background: scrolled ? 'rgba(245,245,243,0.9)' : '#F5F5F3',
            backdropFilter: scrolled ? 'blur(20px)' : 'none',
            WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
            boxShadow: scrolled ? '0 1px 0 rgba(0,0,0,0.05)' : 'none',
            transition: 'background 0.2s ease, box-shadow 0.2s ease',
          }}>
            <span style={{ fontSize: 21, fontWeight: 900, color: '#0D0D0D', letterSpacing: '-0.07em' }}>CH</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                onClick={() => setSearchOpen(true)}
                style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <Search size={16} color="#444" />
              </button>
              <button style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
                <Bell size={16} color="#444" />
                <div style={{ position: 'absolute', top: 8, right: 8, width: 6, height: 6, borderRadius: '50%', background: '#0D0D0D', border: '1.5px solid #F5F5F3' }} />
              </button>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#3A4A5C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>AK</div>
            </div>
          </header>

          {/* ── Title ── */}
          <div style={{ padding: '18px 16px 14px' }}>
            <span style={{ fontSize: 28, fontWeight: 900, color: '#111', letterSpacing: '-0.04em' }}>Авторы</span>
            <span style={{ fontSize: 13, color: '#AAA', marginLeft: 10, letterSpacing: '-0.01em' }}>{CREATORS.length}</span>
          </div>

          {/* ── Cards ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '0 14px' }}>
            {CREATORS.map((creator, i) => (
              <CreatorCard key={creator.name} creator={creator} index={i} />
            ))}
          </div>

        </div>
      </div>

      <BottomNav />
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </>
  );
}
