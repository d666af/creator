'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock, X, Eye } from 'lucide-react';
import Fuse from 'fuse.js';
import { ALL_CASES, SECTIONS, ytThumb, type CaseItem } from '@/lib/data';

// ── Constants ──────────────────────────────────────────────────────────────────

const PLACEHOLDERS = [
  'Reels для бренда...',
  'Монтаж в стиле кино...',
  'Мобилограф Москва...',
  'Колорист fashion...',
  'Сценарий для YouTube...',
];

const RECENT_KEY = 'ch_recent_searches';

// ── Derived filter options ─────────────────────────────────────────────────────

const ALL_SPECS   = [...new Set(ALL_CASES.map(c => c.spec))];
const ALL_CITIES  = [...new Set(ALL_CASES.map(c => c.city))];

// ── Filter chip ────────────────────────────────────────────────────────────────

function FilterChip({
  label, active, onClick,
}: { label: string; active: boolean; onClick: () => void }) {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{
        flexShrink: 0, height: 38, padding: '0 16px', borderRadius: 100, border: 'none',
        background: active ? '#111' : 'rgba(0,0,0,0.065)',
        cursor: 'pointer', display: 'flex', alignItems: 'center',
        transition: 'background 0.16s ease, transform 0.12s cubic-bezier(0.16,1,0.3,1), box-shadow 0.16s ease',
        transform: pressed ? 'scale(0.95)' : active ? 'scale(1.02)' : 'scale(1)',
        boxShadow: active ? '0 4px 12px rgba(0,0,0,0.18)' : 'none',
      }}
    >
      <span style={{
        fontSize: 13, fontWeight: 700, letterSpacing: '-0.02em',
        color: active ? '#fff' : '#3A3A3A',
        transition: 'color 0.16s ease',
        whiteSpace: 'nowrap',
      }}>
        {label}
      </span>
    </button>
  );
}

// ── Highlight matched text ─────────────────────────────────────────────────────

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const i = text.toLowerCase().indexOf(query.toLowerCase());
  if (i === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <span style={{ background: 'rgba(255,185,0,0.3)', borderRadius: 2, padding: '0 1px' }}>
        {text.slice(i, i + query.length)}
      </span>
      {text.slice(i + query.length)}
    </>
  );
}

// ── Hero result card ───────────────────────────────────────────────────────────

function HeroResult({ item, query, onClick }: { item: CaseItem; query: string; onClick: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ cursor: 'pointer', marginBottom: 10, animation: 'srFadeIn 0.32s cubic-bezier(0.16,1,0.3,1) both' }}>
      <div style={{
        width: '100%', aspectRatio: '16/9', borderRadius: 16, overflow: 'hidden',
        position: 'relative', background: '#1A1A1A',
        transform: hov ? 'scale(0.984)' : 'scale(1)',
        transition: 'transform 0.28s cubic-bezier(0.16,1,0.3,1)',
        boxShadow: hov ? '0 18px 50px rgba(0,0,0,0.22)' : '0 6px 20px rgba(0,0,0,0.12)',
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={ytThumb(item.youtubeId)} alt={item.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.08) 55%, transparent 100%)' }} />
        <div style={{ position: 'absolute', bottom: 14, left: 16, right: 16 }}>
          <div style={{
            display: 'inline-block', fontSize: 9, fontWeight: 700, letterSpacing: '0.07em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)',
            background: 'rgba(0,0,0,0.35)', padding: '2px 8px', borderRadius: 4,
            backdropFilter: 'blur(6px)', marginBottom: 8,
          }}>{item.spec}</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', lineHeight: 1.25, letterSpacing: '-0.025em' }}>
            <Highlight text={item.title} query={query} />
          </div>
        </div>
        <div style={{ position: 'absolute', top: 12, right: 12, fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 3 }}>
          <Eye size={9} />{item.views}
        </div>
      </div>
      <div style={{ padding: '8px 2px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 24, height: 24, borderRadius: '50%', background: item.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 7.5, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{item.initials}</div>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#444', letterSpacing: '-0.01em' }}>
          <Highlight text={item.creator} query={query} />
        </span>
        <span style={{ fontSize: 11, color: '#BBB' }}>·</span>
        <span style={{ fontSize: 11, color: '#AAA' }}>{item.city}</span>
      </div>
    </div>
  );
}

// ── Small grid card ────────────────────────────────────────────────────────────

function SmallResult({ item, query, onClick, delay }: { item: CaseItem; query: string; onClick: () => void; delay: number }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ cursor: 'pointer', animation: `srFadeIn 0.32s cubic-bezier(0.16,1,0.3,1) ${delay}ms both` }}>
      <div style={{
        width: '100%', aspectRatio: '4/3', borderRadius: 12, overflow: 'hidden',
        position: 'relative', background: '#1A1A1A', marginBottom: 7,
        transform: hov ? 'scale(0.965)' : 'scale(1)',
        transition: 'transform 0.28s cubic-bezier(0.16,1,0.3,1)',
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={ytThumb(item.youtubeId)} alt={item.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)' }} />
        <div style={{ position: 'absolute', bottom: 7, left: 8, fontSize: 8.5, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)', background: 'rgba(0,0,0,0.35)', padding: '2px 6px', borderRadius: 3, backdropFilter: 'blur(4px)' }}>{item.spec}</div>
      </div>
      <div style={{ fontSize: 12, fontWeight: 700, color: '#111', lineHeight: 1.3, letterSpacing: '-0.015em', marginBottom: 3, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' } as React.CSSProperties}>
        <Highlight text={item.title} query={query} />
      </div>
      <div style={{ fontSize: 10.5, color: '#9A9A9A' }}>
        <Highlight text={item.creator} query={query} />
      </div>
    </div>
  );
}

// ── SearchOverlay ──────────────────────────────────────────────────────────────

export function SearchOverlay({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);

  const [closing, setClosing] = useState(false);
  const [query, setQuery] = useState('');
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Active filters
  const [selSection, setSelSection] = useState<string | null>(null);
  const [selSpec,    setSelSpec]    = useState<string | null>(null);
  const [selCity,    setSelCity]    = useState<string | null>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 80);
    try { setRecentSearches(JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]')); } catch { /* ignore */ }
  }, []);

  // Cycling placeholder — only when input empty
  useEffect(() => {
    if (query) return;
    const t = setInterval(() => setPlaceholderIdx(i => (i + 1) % PLACEHOLDERS.length), 2800);
    return () => clearInterval(t);
  }, [query]);

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(onClose, 360);
  }, [onClose]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [handleClose]);

  const onTouchStart = (e: React.TouchEvent) => { touchStartY.current = e.touches[0].clientY; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (e.changedTouches[0].clientY - touchStartY.current > 90 && (scrollRef.current?.scrollTop ?? 0) === 0)
      handleClose();
  };

  // Fuse on full dataset
  const fuse = useMemo(() => new Fuse(ALL_CASES, {
    keys: [
      { name: 'title',    weight: 0.40 },
      { name: 'creator',  weight: 0.25 },
      { name: 'spec',     weight: 0.20 },
      { name: 'category', weight: 0.10 },
      { name: 'city',     weight: 0.05 },
    ],
    threshold: 0.38,
  }), []);

  // Section case ID sets for fast filtering
  const sectionCaseIds = useMemo(() => {
    if (!selSection) return null;
    return new Set(SECTIONS.find(s => s.id === selSection)?.cases.map(c => c.id) ?? []);
  }, [selSection]);

  const hasActivity = query.trim().length > 0 || selSection !== null || selSpec !== null || selCity !== null;

  const results = useMemo(() => {
    if (!hasActivity) return [];
    let base: CaseItem[];
    if (query.trim()) {
      base = fuse.search(query.trim()).map(r => r.item);
    } else {
      base = ALL_CASES;
    }
    if (sectionCaseIds) base = base.filter(c => sectionCaseIds.has(c.id));
    if (selSpec)  base = base.filter(c => c.spec === selSpec);
    if (selCity)  base = base.filter(c => c.city === selCity);
    return base;
  }, [query, sectionCaseIds, selSpec, selCity, fuse, hasActivity]);

  const saveRecent = (q: string) => {
    if (!q.trim()) return;
    const updated = [q, ...recentSearches.filter(s => s !== q)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  };

  const openCase = (item: CaseItem) => {
    if (query.trim()) saveRecent(query);
    handleClose();
    setTimeout(() => router.push(`/case/${item.id}`), 60);
  };

  const removeRecent = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentSearches.filter((_, i) => i !== idx);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  };

  const resetFilters = () => { setSelSection(null); setSelSpec(null); setSelCity(null); };
  const activeFilterCount = (selSection ? 1 : 0) + (selSpec ? 1 : 0) + (selCity ? 1 : 0);

  const [heroResult, ...restResults] = results;
  const sheetAnim    = closing ? 'srSheetOut' : 'srSheetIn';
  const backdropAnim = closing ? 'srFadeOut'  : 'srFadeIn2';

  return (
    <>
      <style>{`
        @keyframes srSheetIn  { from { transform:translateY(100%) } to { transform:translateY(0) } }
        @keyframes srSheetOut { from { transform:translateY(0) }    to { transform:translateY(100%) } }
        @keyframes srFadeIn2  { from { opacity:0 } to { opacity:1 } }
        @keyframes srFadeOut  { from { opacity:1 } to { opacity:0 } }
        @keyframes srFadeIn   { from { opacity:0; transform:translateY(14px) } to { opacity:1; transform:translateY(0) } }
        @keyframes srPHIn     { from { opacity:0; transform:translateY(5px)  } to { opacity:1; transform:translateY(0) } }
      `}</style>

      {/* Backdrop */}
      <div onClick={handleClose} style={{ position: 'fixed', inset: 0, zIndex: 98, background: 'rgba(0,0,0,0.18)', animation: `${backdropAnim} 0.3s ease forwards` }} />

      {/* Sheet */}
      <div
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{ position: 'fixed', inset: 0, zIndex: 99, background: '#F5F5F3', display: 'flex', flexDirection: 'column', animation: `${sheetAnim} 0.38s cubic-bezier(0.16,1,0.3,1) forwards` }}
      >

        {/* ── Input row ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px 12px', borderBottom: '1px solid rgba(0,0,0,0.06)', flexShrink: 0 }}>
          <button onClick={handleClose} style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.07)', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowLeft size={16} color="#111" />
          </button>

          <div style={{ flex: 1, position: 'relative', height: 46 }}>
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder=""
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', padding: '0 40px 0 16px', fontSize: 17, fontWeight: 700, letterSpacing: '-0.03em', color: '#111', background: 'rgba(0,0,0,0.065)', border: 'none', borderRadius: 14, outline: 'none', caretColor: '#111' }}
            />

            {/* Animated placeholder — flexbox wrapper prevents transform conflict */}
            {!query && (
              <div style={{ position: 'absolute', left: 16, right: 40, top: 0, bottom: 0, display: 'flex', alignItems: 'center', pointerEvents: 'none', overflow: 'hidden' }}>
                <span
                  key={placeholderIdx}
                  style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.03em', color: 'rgba(0,0,0,0.25)', whiteSpace: 'nowrap', animation: 'srPHIn 0.35s ease forwards' }}
                >
                  {PLACEHOLDERS[placeholderIdx]}
                </span>
              </div>
            )}

            {/* Clear */}
            {query && (
              <button onClick={() => { setQuery(''); inputRef.current?.focus(); }} style={{ position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)', width: 24, height: 24, borderRadius: '50%', background: 'rgba(0,0,0,0.14)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={11} color="#555" strokeWidth={2.5} />
              </button>
            )}
          </div>
        </div>

        {/* ── Filter rows (always visible) ── */}
        <div style={{ flexShrink: 0, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          {/* Section / genre row */}
          <div style={{ overflowX: 'auto', scrollbarWidth: 'none', padding: '10px 0 0' }}>
            <div style={{ display: 'flex', gap: 6, padding: '0 16px' }}>
              <FilterChip label="Все" active={selSection === null && selSpec === null && selCity === null && !query} onClick={() => { resetFilters(); setQuery(''); }} />
              {SECTIONS.map(s => (
                <FilterChip key={s.id} label={s.genre} active={selSection === s.id} onClick={() => setSelSection(v => v === s.id ? null : s.id)} />
              ))}
            </div>
          </div>

          {/* Spec + city row */}
          <div style={{ overflowX: 'auto', scrollbarWidth: 'none', padding: '7px 0 10px' }}>
            <div style={{ display: 'flex', gap: 5, padding: '0 16px' }}>
              {ALL_SPECS.map(spec => (
                <FilterChip key={spec} label={spec} active={selSpec === spec} onClick={() => setSelSpec(v => v === spec ? null : spec)} />
              ))}
              <span style={{ width: 1, background: 'rgba(0,0,0,0.1)', margin: '4px 4px', flexShrink: 0 }} />
              {ALL_CITIES.map(city => (
                <FilterChip key={city} label={city} active={selCity === city} onClick={() => setSelCity(v => v === city ? null : city)} />
              ))}
            </div>
          </div>
        </div>

        {/* ── Scrollable content ── */}
        <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 80px', scrollbarWidth: 'none' }}>

          {/* Active filters badge + reset */}
          {activeFilterCount > 0 && !query && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <span style={{ fontSize: 11, color: '#AAA', fontWeight: 600 }}>
                {results.length} {results.length === 1 ? 'результат' : results.length < 5 ? 'результата' : 'результатов'}
              </span>
              <button onClick={resetFilters} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11.5, fontWeight: 600, color: '#555', background: 'rgba(0,0,0,0.07)', border: 'none', cursor: 'pointer', padding: '5px 10px 5px 8px', borderRadius: 100 }}>
                <X size={11} strokeWidth={2.5} /> Сброс
              </button>
            </div>
          )}

          {/* Results */}
          {hasActivity && results.length > 0 && (
            <div>
              {query.trim() && (
                <div style={{ fontSize: 11, fontWeight: 600, color: '#AAA', letterSpacing: '-0.01em', marginBottom: 14 }}>
                  {results.length}&nbsp;{results.length === 1 ? 'результат' : results.length < 5 ? 'результата' : 'результатов'}
                </div>
              )}
              <HeroResult item={heroResult} query={query} onClick={() => openCase(heroResult)} />
              {restResults.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '14px 10px', marginTop: 6 }}>
                  {restResults.map((item, i) => (
                    <SmallResult key={item.id} item={item} query={query} onClick={() => openCase(item)} delay={i * 28} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* No results */}
          {hasActivity && results.length === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '72px 20px 0', gap: 8, animation: 'srFadeIn 0.28s ease both' }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#DDD', letterSpacing: '-0.04em' }}>—</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#555', letterSpacing: '-0.02em' }}>Ничего не найдено</div>
              <button onClick={() => { resetFilters(); setQuery(''); }} style={{ marginTop: 4, fontSize: 12, color: '#888', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Сбросить</button>
            </div>
          )}

          {/* Empty state — no query, no filters */}
          {!hasActivity && (
            <div>
              {recentSearches.length > 0 && (
                <div style={{ marginBottom: 30 }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#BBB', marginBottom: 10 }}>
                    Недавние
                  </div>
                  {recentSearches.map((s, i) => (
                    <div key={i} onClick={() => setQuery(s)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 2px', cursor: 'pointer', borderBottom: i < recentSearches.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none' }}>
                      <Clock size={13} color="#C8C8C8" style={{ flexShrink: 0 }} />
                      <span style={{ flex: 1, fontSize: 14.5, fontWeight: 650, color: '#222', letterSpacing: '-0.025em' } as React.CSSProperties}>{s}</span>
                      <button onClick={e => removeRecent(i, e)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}>
                        <X size={12} color="#CCC" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {recentSearches.length === 0 && (
                <div style={{ paddingTop: 48, textAlign: 'center' }}>
                  <div style={{ fontSize: 13, color: '#CCC', fontWeight: 500, letterSpacing: '-0.02em' }}>Выберите фильтр или введите запрос</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
