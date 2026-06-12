'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { Bell, X, Star, Eye, MapPin, Briefcase, Search } from 'lucide-react';
import Fuse from 'fuse.js';
import { getCreatorProfiles, ytThumb, type CreatorProfile, type CaseItem } from '@/lib/data';
import { BottomNav } from '@/app/components/BottomNav';

// ── Data ──────────────────────────────────────────────────────────────────────

const ALL_CREATORS = getCreatorProfiles().sort((a, b) => b.totalViews - a.totalViews);
const ALL_SPECS    = [...new Set(ALL_CREATORS.map(c => c.spec))];
const ALL_CITIES   = [...new Set(ALL_CREATORS.map(c => c.city))];

const PLACEHOLDERS = [
  'Имя автора...',
  'Мобилограф в Ташкенте...',
  'Монтажёр для рекламы...',
  'Фрилансер из Самарканда...',
  'Колорист fashion...',
  'Сценарист YouTube...',
];

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
        flexShrink: 0, height: 36, padding: '0 15px', borderRadius: 100, border: 'none',
        background: active ? '#111' : 'rgba(0,0,0,0.065)', cursor: 'pointer',
        display: 'flex', alignItems: 'center',
        transition: 'background 0.16s ease, transform 0.12s cubic-bezier(0.16,1,0.3,1), box-shadow 0.16s ease',
        transform: pressed ? 'scale(0.95)' : active ? 'scale(1.02)' : 'scale(1)',
        boxShadow: active ? '0 4px 12px rgba(0,0,0,0.18)' : 'none',
      }}
    >
      <span style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: '-0.02em', color: active ? '#fff' : '#3A3A3A', transition: 'color 0.16s ease', whiteSpace: 'nowrap' }}>
        {label}
      </span>
    </button>
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
      <div style={{ position: 'absolute', top: -50, right: -50, width: 220, height: 220, borderRadius: '50%', background: `radial-gradient(circle, ${creator.avatarColor}28 0%, transparent 70%)`, pointerEvents: 'none' }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 17, position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
          <div style={{ width: 58, height: 58, borderRadius: '50%', background: creator.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 800, color: '#fff', flexShrink: 0, boxShadow: `0 4px 16px ${creator.avatarColor}55` }}>
            {creator.initials}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7 }}>
              <span style={{ fontSize: 17, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em' }}>{creator.name}</span>
              {creator.isPro && <span style={{ fontSize: 8, fontWeight: 800, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#111', background: '#fff', borderRadius: 100, padding: '2px 7px' }}>PRO</span>}
            </div>
            <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.1)', borderRadius: 6, padding: '3px 8px', whiteSpace: 'nowrap' }}>
              {creator.spec}
            </span>
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1 }}>{views}K</div>
          <div style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.3)', fontWeight: 500, marginTop: 2 }}>просмотров</div>
        </div>
      </div>

      <ThumbStrip cases={creator.cases} />

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
  const inputRef = useRef<HTMLInputElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerH, setHeaderH]       = useState(0);
  const [query, setQuery]           = useState('');
  const [placeholderIdx, setPHIdx]  = useState(0);
  const [selSpec, setSelSpec]       = useState<string | null>(null);
  const [selCity, setSelCity]       = useState<string | null>(null);
  const [gridOpacity, setGridOpacity] = useState(1);
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const measure = () => {
      if (headerRef.current) setHeaderH(headerRef.current.offsetHeight);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (headerRef.current) ro.observe(headerRef.current);
    return () => ro.disconnect();
  }, []);

  // Cycling placeholder when input empty
  useEffect(() => {
    if (query) return;
    const t = setInterval(() => setPHIdx(i => (i + 1) % PLACEHOLDERS.length), 2800);
    return () => clearInterval(t);
  }, [query]);

  // Fade grid on filter change
  useEffect(() => {
    setGridOpacity(0);
    if (fadeTimer.current) clearTimeout(fadeTimer.current);
    fadeTimer.current = setTimeout(() => setGridOpacity(1), 130);
    return () => { if (fadeTimer.current) clearTimeout(fadeTimer.current); };
  }, [query, selSpec, selCity]);

  const fuse = useMemo(() => new Fuse(ALL_CREATORS, {
    keys: [
      { name: 'name', weight: 0.55 },
      { name: 'spec', weight: 0.30 },
      { name: 'city', weight: 0.15 },
    ],
    threshold: 0.40,
  }), []);

  const filtered = useMemo(() => {
    let list: CreatorProfile[];
    if (query.trim()) {
      list = fuse.search(query.trim()).map(r => r.item);
    } else {
      list = [...ALL_CREATORS];
    }
    if (selSpec) list = list.filter(c => c.spec === selSpec);
    if (selCity) list = list.filter(c => c.city === selCity);
    return list;
  }, [query, selSpec, selCity, fuse]);

  const activeCount = (selSpec ? 1 : 0) + (selCity ? 1 : 0);
  const resetAll = () => { setSelSpec(null); setSelCity(null); setQuery(''); };

  return (
    <div style={{ background: '#F5F5F3', minHeight: '100vh', paddingBottom: 100, paddingTop: headerH }}>

      {/* ── Fixed search + filters ── */}
      <div ref={headerRef} style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 20,
        background: 'rgba(245,245,243,0.94)',
        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
      }}>
        {/* Search input */}
        <div style={{ padding: '12px 16px 10px' }}>
          <div style={{ position: 'relative', height: 46 }}>
            <Search size={15} color="rgba(0,0,0,0.3)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder=""
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', padding: '0 40px 0 38px', fontSize: 14, fontWeight: 600, letterSpacing: '-0.02em', color: '#111', background: 'rgba(0,0,0,0.065)', border: 'none', borderRadius: 14, outline: 'none', caretColor: '#111' }}
            />
            {/* Animated placeholder */}
            {!query && (
              <div style={{ position: 'absolute', left: 38, right: 40, top: 0, bottom: 0, display: 'flex', alignItems: 'center', pointerEvents: 'none', overflow: 'hidden' }}>
                <style>{`@keyframes crPHIn { from { opacity:0; transform:translateY(5px) } to { opacity:1; transform:translateY(0) } }`}</style>
                <span key={placeholderIdx} style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.02em', color: 'rgba(0,0,0,0.25)', whiteSpace: 'nowrap', animation: 'crPHIn 0.3s ease forwards' }}>
                  {PLACEHOLDERS[placeholderIdx]}
                </span>
              </div>
            )}
            {query && (
              <button onClick={() => { setQuery(''); inputRef.current?.focus(); }} style={{ position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)', width: 24, height: 24, borderRadius: '50%', background: 'rgba(0,0,0,0.12)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={11} color="#555" strokeWidth={2.5} />
              </button>
            )}
          </div>
        </div>

        {/* Spec chips */}
        <div style={{ overflowX: 'auto', scrollbarWidth: 'none' }}>
          <div style={{ display: 'flex', gap: 6, padding: '0 16px' }}>
            <FilterChip label="Все" active={!selSpec && !selCity} onClick={() => { setSelSpec(null); setSelCity(null); }} />
            {ALL_SPECS.map(spec => (
              <FilterChip key={spec} label={spec} active={selSpec === spec} onClick={() => setSelSpec(v => v === spec ? null : spec)} />
            ))}
          </div>
        </div>

        {/* City chips */}
        <div style={{ overflowX: 'auto', scrollbarWidth: 'none', padding: '7px 0 12px' }}>
          <div style={{ display: 'flex', gap: 5, padding: '0 16px' }}>
            {ALL_CITIES.map(city => (
              <FilterChip key={city} label={city} active={selCity === city} onClick={() => setSelCity(v => v === city ? null : city)} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Scrollable header (title + actions) ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px 10px' }}>
        <span style={{ fontSize: 22, fontWeight: 900, color: '#111', letterSpacing: '-0.04em' }}>Авторы</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {(activeCount > 0 || query) && (
            <button onClick={resetAll} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11.5, fontWeight: 600, color: '#555', background: 'rgba(0,0,0,0.07)', border: 'none', cursor: 'pointer', padding: '5px 10px 5px 8px', borderRadius: 100 }}>
              <X size={11} strokeWidth={2.5} /> Сброс
            </button>
          )}
          <button style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
            <Bell size={16} color="#444" />
            <div style={{ position: 'absolute', top: 8, right: 8, width: 6, height: 6, borderRadius: '50%', background: '#0D0D0D', border: '1.5px solid #F5F5F3' }} />
          </button>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#3A4A5C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>AK</div>
        </div>
      </div>

      {/* ── Cards ── */}
      <div
        style={{
          display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 14px 0',
          opacity: gridOpacity,
          transform: `translateY(${gridOpacity < 1 ? 6 : 0}px)`,
          transition: 'opacity 0.2s ease, transform 0.2s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {filtered.map((creator, i) => (
          <CreatorCard key={creator.name} creator={creator} index={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 20px', gap: 10 }}>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#DDD', letterSpacing: '-0.04em' }}>—</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#555', letterSpacing: '-0.02em' }}>Никого не найдено</div>
          <button onClick={resetAll} style={{ fontSize: 12, color: '#888', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Сбросить</button>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
