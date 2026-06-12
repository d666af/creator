'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { Star, Eye, MapPin, Briefcase, X } from 'lucide-react';
import { getCreatorProfiles, ytThumb, type CreatorProfile, type CaseItem } from '@/lib/data';
import { BottomNav } from '@/app/components/BottomNav';

// ── Spec colors ────────────────────────────────────────────────────────────────

const SPEC_COLOR: Record<string, string> = {
  'Мобилограф': '#D4521E',
  'Монтажёр':   '#1E52D4',
  'Сценарист':  '#7B1ED4',
  'Колорист':   '#1EA86A',
  'Продюсер':   '#C49010',
  'Таргетолог': '#0AAAB8',
};

// ── Data ──────────────────────────────────────────────────────────────────────

const ALL_CREATORS = getCreatorProfiles();
const ALL_SPECS    = [...new Set(ALL_CREATORS.map(c => c.spec))];
const ALL_CITIES   = [...new Set(ALL_CREATORS.map(c => c.city))];
const TOTAL_VIEWS  = ALL_CREATORS.reduce((s, c) => s + c.totalViews, 0);

type SortKey = 'views' | 'rating' | 'cases';

// ── Hooks ──────────────────────────────────────────────────────────────────────

function useCountUp(target: number, trigger: boolean, duration = 1200) {
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

// ── Filter chip ────────────────────────────────────────────────────────────────

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{
        flexShrink: 0, height: 38, padding: '0 16px', borderRadius: 100, border: 'none',
        background: active ? '#111' : 'rgba(0,0,0,0.065)', cursor: 'pointer',
        display: 'flex', alignItems: 'center',
        transition: 'background 0.16s ease, transform 0.12s cubic-bezier(0.16,1,0.3,1), box-shadow 0.16s ease',
        transform: pressed ? 'scale(0.95)' : active ? 'scale(1.02)' : 'scale(1)',
        boxShadow: active ? '0 4px 12px rgba(0,0,0,0.18)' : 'none',
      }}
    >
      <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '-0.02em', color: active ? '#fff' : '#3A3A3A', transition: 'color 0.16s ease', whiteSpace: 'nowrap' }}>
        {label}
      </span>
    </button>
  );
}

// ── Sort button ────────────────────────────────────────────────────────────────

function SortBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        height: 32, padding: '0 14px', borderRadius: 100, border: 'none',
        background: active ? '#111' : 'rgba(0,0,0,0.055)', cursor: 'pointer',
        fontSize: 11.5, fontWeight: 700, letterSpacing: '-0.015em',
        color: active ? '#fff' : '#777',
        transition: 'background 0.15s ease, color 0.15s ease',
        flexShrink: 0,
      }}
    >
      {label}
    </button>
  );
}

// ── Spec badge ─────────────────────────────────────────────────────────────────

function SpecBadge({ spec }: { spec: string }) {
  const color = SPEC_COLOR[spec] ?? '#777';
  return (
    <span style={{
      fontSize: 9.5, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase',
      color, background: `${color}18`, borderRadius: 100, padding: '3px 9px',
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
        <div key={i} style={{ aspectRatio: '16/9', borderRadius: 8, overflow: 'hidden', background: '#1A1A1A' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ytThumb(c.youtubeId)} alt={c.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
      ))}
    </div>
  );
}

// ── Featured creator hero ──────────────────────────────────────────────────────

function FeaturedCard({ creator }: { creator: CreatorProfile }) {
  const { ref, visible } = useInView(0.01);
  const views = useCountUp(creator.totalViews, visible);

  return (
    <div
      ref={ref}
      style={{
        margin: '0 14px 6px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 0.55s ease, transform 0.55s cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      <div style={{
        borderRadius: 22, background: '#111', padding: '20px 20px 16px',
        boxShadow: '0 16px 48px rgba(0,0,0,0.22)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Subtle radial glow */}
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: `radial-gradient(circle, ${creator.avatarColor}22 0%, transparent 70%)`, pointerEvents: 'none' }} />

        {/* Top row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 58, height: 58, borderRadius: '50%', background: creator.avatarColor,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 17, fontWeight: 800, color: '#fff', flexShrink: 0,
              boxShadow: `0 6px 20px ${creator.avatarColor}55`,
            }}>
              {creator.initials}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
                <span style={{ fontSize: 17, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em' }}>{creator.name}</span>
                {creator.isPro && (
                  <span style={{ fontSize: 8, fontWeight: 800, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#111', background: '#fff', borderRadius: 100, padding: '2px 7px' }}>PRO</span>
                )}
              </div>
              <SpecBadge spec={creator.spec} />
            </div>
          </div>

          {/* Views counter */}
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 2 }}>
              ★ ТОП АВТОР
            </div>
            <div style={{ fontSize: 32, fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1 }}>
              {views}K
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>просмотров</div>
          </div>
        </div>

        {/* Thumbnails */}
        <ThumbStrip cases={creator.cases} />

        {/* Footer stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 13, flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: 'rgba(255,255,255,0.38)', fontWeight: 500 }}>
            <Briefcase size={10} />{creator.caseCount} {creator.caseCount === 1 ? 'работа' : 'работы'}
          </span>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>·</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: 'rgba(255,255,255,0.38)', fontWeight: 500 }}>
            <Star size={10} fill="rgba(255,255,255,0.38)" stroke="none" />{creator.rating.toFixed(1)}
          </span>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>·</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: 'rgba(255,255,255,0.38)', fontWeight: 500 }}>
            <MapPin size={10} />{creator.city}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Regular creator card ───────────────────────────────────────────────────────

function CreatorCard({ creator, index }: { creator: CreatorProfile; index: number }) {
  const { ref, visible } = useInView(0.04);
  const [hov, setHov] = useState(false);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: '#fff', borderRadius: 20, padding: '15px 13px 13px',
        boxShadow: hov ? '0 14px 40px rgba(0,0,0,0.13)' : '0 2px 10px rgba(0,0,0,0.07)',
        transform: `translateY(${visible ? (hov ? -3 : 0) : 16}px)`,
        opacity: visible ? 1 : 0,
        transition: `opacity 0.45s ease ${index * 60}ms, transform 0.45s cubic-bezier(0.16,1,0.3,1) ${index * 60}ms, box-shadow 0.22s ease`,
        cursor: 'default',
      }}
    >
      {/* Avatar + name row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 11 }}>
        <div style={{
          width: 44, height: 44, borderRadius: '50%', background: creator.avatarColor,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 800, color: '#fff', flexShrink: 0,
        }}>
          {creator.initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13.5, fontWeight: 800, color: '#111', letterSpacing: '-0.025em', lineHeight: 1.2 }}>
              {creator.name.split(' ')[0]}
            </span>
            {creator.isPro && (
              <span style={{ fontSize: 7.5, fontWeight: 800, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#fff', background: '#111', borderRadius: 100, padding: '2px 6px' }}>PRO</span>
            )}
          </div>
          <SpecBadge spec={creator.spec} />
        </div>
      </div>

      {/* Thumbnails */}
      <div style={{ marginBottom: 11 }}>
        <ThumbStrip cases={creator.cases} />
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10.5, color: '#999', fontWeight: 500 }}>
            <Eye size={9} color="#BBB" />{creator.totalViews}K
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10.5, color: '#999', fontWeight: 500 }}>
            <Star size={9} fill="#BBB" stroke="none" />{creator.rating.toFixed(1)}
          </span>
        </div>
        <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10.5, color: '#BBB', fontWeight: 500 }}>
          <MapPin size={9} color="#CCC" />{creator.city}
        </span>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function CreatorsPage() {
  const [selSpec,   setSelSpec]   = useState<string | null>(null);
  const [selCity,   setSelCity]   = useState<string | null>(null);
  const [sortKey,   setSortKey]   = useState<SortKey>('views');
  const [gridOpacity, setGridOpacity] = useState(1);
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeFilterCount = (selSpec ? 1 : 0) + (selCity ? 1 : 0);
  const resetFilters = () => { setSelSpec(null); setSelCity(null); };

  // Fade grid on filter/sort change
  useEffect(() => {
    setGridOpacity(0);
    if (fadeTimer.current) clearTimeout(fadeTimer.current);
    fadeTimer.current = setTimeout(() => setGridOpacity(1), 130);
    return () => { if (fadeTimer.current) clearTimeout(fadeTimer.current); };
  }, [selSpec, selCity, sortKey]);

  const filtered = useMemo(() => {
    let list = ALL_CREATORS.filter(c => {
      if (selSpec && c.spec !== selSpec) return false;
      if (selCity && c.city !== selCity) return false;
      return true;
    });
    if (sortKey === 'views')  list = [...list].sort((a, b) => b.totalViews - a.totalViews);
    if (sortKey === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);
    if (sortKey === 'cases')  list = [...list].sort((a, b) => b.caseCount - a.caseCount);
    return list;
  }, [selSpec, selCity, sortKey]);

  // Featured = top by views overall (not affected by filters)
  const featured = useMemo(() =>
    [...ALL_CREATORS].sort((a, b) => b.totalViews - a.totalViews)[0],
  []);

  // Regular grid = filtered list without featured (when unfiltered)
  const gridCreators = useMemo(() => {
    if (selSpec || selCity) return filtered;
    return filtered.filter(c => c.name !== featured.name);
  }, [filtered, featured, selSpec, selCity]);

  return (
    <div style={{ background: '#F5F5F3', minHeight: '100vh', paddingBottom: 100 }}>

      {/* ── Sticky header ── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 20,
        background: 'rgba(245,245,243,0.94)',
        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
      }}>
        {/* Title row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px 0' }}>
          <div>
            <span style={{ fontSize: 22, fontWeight: 900, color: '#111', letterSpacing: '-0.04em' }}>Авторы</span>
            <span style={{ fontSize: 12, color: '#AAA', marginLeft: 8, letterSpacing: '-0.01em' }}>{filtered.length}</span>
          </div>
          {activeFilterCount > 0 && (
            <button onClick={resetFilters} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11.5, fontWeight: 600, color: '#555', background: 'rgba(0,0,0,0.07)', border: 'none', cursor: 'pointer', padding: '5px 10px 5px 8px', borderRadius: 100 }}>
              <X size={11} strokeWidth={2.5} /> Сброс
            </button>
          )}
        </div>

        {/* Spec chips */}
        <div style={{ overflowX: 'auto', scrollbarWidth: 'none', padding: '10px 0 0' }}>
          <div style={{ display: 'flex', gap: 6, padding: '0 16px' }}>
            <FilterChip label="Все" active={!selSpec && !selCity} onClick={resetFilters} />
            {ALL_SPECS.map(spec => (
              <FilterChip key={spec} label={spec} active={selSpec === spec} onClick={() => setSelSpec(v => v === spec ? null : spec)} />
            ))}
          </div>
        </div>

        {/* City + sort row */}
        <div style={{ overflowX: 'auto', scrollbarWidth: 'none', padding: '7px 0 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '0 16px' }}>
            {ALL_CITIES.map(city => (
              <FilterChip key={city} label={city} active={selCity === city} onClick={() => setSelCity(v => v === city ? null : city)} />
            ))}
            <span style={{ width: 1, background: 'rgba(0,0,0,0.1)', margin: '4px 6px', flexShrink: 0, alignSelf: 'stretch' }} />
            <SortBtn label="Просмотры" active={sortKey === 'views'} onClick={() => setSortKey('views')} />
            <SortBtn label="Рейтинг"   active={sortKey === 'rating'} onClick={() => setSortKey('rating')} />
            <SortBtn label="Работы"    active={sortKey === 'cases'} onClick={() => setSortKey('cases')} />
          </div>
        </div>
      </div>

      {/* ── Platform stats ── */}
      <div style={{ overflowX: 'auto', scrollbarWidth: 'none', padding: '16px 0 6px' }}>
        <div style={{ display: 'flex', gap: 8, padding: '0 14px' }}>
          {[
            { label: 'авторов',         value: ALL_CREATORS.length.toString() },
            { label: 'просмотров',       value: `${(TOTAL_VIEWS / 1000).toFixed(1)}M` },
            { label: 'города',           value: ALL_CITIES.length.toString() },
            { label: 'специализаций',    value: ALL_SPECS.length.toString() },
          ].map(({ label, value }) => (
            <div key={label} style={{ flexShrink: 0, background: 'rgba(0,0,0,0.05)', borderRadius: 14, padding: '10px 16px', display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 18, fontWeight: 900, color: '#111', letterSpacing: '-0.04em', lineHeight: 1 }}>{value}</span>
              <span style={{ fontSize: 10, color: '#AAA', fontWeight: 500, whiteSpace: 'nowrap' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Featured creator ── */}
      {!selSpec && !selCity && <FeaturedCard creator={featured} />}

      {/* ── Grid ── */}
      <div
        style={{
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '10px', padding: '8px 14px 0',
          opacity: gridOpacity,
          transform: `translateY(${gridOpacity < 1 ? 6 : 0}px)`,
          transition: 'opacity 0.2s ease, transform 0.2s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {gridCreators.map((creator, i) => (
          <CreatorCard key={creator.name} creator={creator} index={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 20px', gap: 10 }}>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#DDD', letterSpacing: '-0.04em' }}>—</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#555', letterSpacing: '-0.02em' }}>Никого не найдено</div>
          <button onClick={resetFilters} style={{ fontSize: 12, color: '#888', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Сбросить фильтры</button>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
