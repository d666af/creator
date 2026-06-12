'use client';

import { use, useState, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Eye, X } from 'lucide-react';
import {
  SECTIONS, getBrowseItems,
  ytThumb, ytPortraitThumb,
  type BrowseItem,
} from '@/lib/data';

// ── Category chip ──────────────────────────────────────────────────────────────

function CatChip({
  label, count, active, onClick,
}: {
  label: string; count: number; active: boolean; onClick: () => void;
}) {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{
        flexShrink: 0,
        height: 42,
        padding: '0 20px',
        borderRadius: 100,
        border: 'none',
        background: active ? '#111' : 'rgba(0,0,0,0.065)',
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 8,
        transition: 'background 0.16s ease, transform 0.12s cubic-bezier(0.16,1,0.3,1), box-shadow 0.16s ease',
        transform: pressed ? 'scale(0.95)' : active ? 'scale(1.02)' : 'scale(1)',
        boxShadow: active ? '0 4px 14px rgba(0,0,0,0.18)' : 'none',
      }}
    >
      <span style={{
        fontSize: 13.5, fontWeight: 700, letterSpacing: '-0.025em',
        color: active ? '#fff' : '#3A3A3A',
        transition: 'color 0.16s ease',
      }}>
        {label}
      </span>
      <span style={{
        fontSize: 11, fontWeight: 500,
        color: active ? 'rgba(255,255,255,0.38)' : 'rgba(0,0,0,0.22)',
        transition: 'color 0.16s ease',
        lineHeight: 1,
      }}>
        {count}
      </span>
    </button>
  );
}

// ── Role / city chip ───────────────────────────────────────────────────────────

function RoleChip({
  label, count, active, onClick,
}: {
  label: string; count: number; active: boolean; onClick: () => void;
}) {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{
        flexShrink: 0,
        height: 42,
        padding: '0 20px',
        borderRadius: 100,
        border: 'none',
        background: active ? '#111' : 'rgba(0,0,0,0.065)',
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 8,
        transition: 'background 0.16s ease, transform 0.12s cubic-bezier(0.16,1,0.3,1), box-shadow 0.16s ease',
        transform: pressed ? 'scale(0.95)' : active ? 'scale(1.02)' : 'scale(1)',
        boxShadow: active ? '0 4px 14px rgba(0,0,0,0.18)' : 'none',
      }}
    >
      <span style={{
        fontSize: 13.5, fontWeight: 700, letterSpacing: '-0.025em',
        color: active ? '#fff' : '#3A3A3A',
        transition: 'color 0.16s ease',
      }}>
        {label}
      </span>
      <span style={{
        fontSize: 11, fontWeight: 500,
        color: active ? 'rgba(255,255,255,0.38)' : 'rgba(0,0,0,0.22)',
        transition: 'color 0.16s ease',
        lineHeight: 1,
      }}>
        {count}
      </span>
    </button>
  );
}

// ── Browse card ────────────────────────────────────────────────────────────────

function BrowseCard({
  item, isPortrait, onClick,
}: {
  item: BrowseItem; isPortrait: boolean; onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const thumb = isPortrait ? ytPortraitThumb(item.thumbId) : ytThumb(item.thumbId);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: 'pointer' }}
    >
      {/* Thumbnail */}
      <div style={{
        width: '100%',
        aspectRatio: isPortrait ? '9/16' : '16/9',
        borderRadius: 12,
        overflow: 'hidden',
        background: '#1A1A1A',
        marginBottom: 9,
        position: 'relative',
        transform: hovered ? 'scale(0.965)' : 'scale(1)',
        transition: 'transform 0.28s cubic-bezier(0.16,1,0.3,1)',
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumb}
          alt={item.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        {/* Bottom gradient + views */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 45%)',
          opacity: hovered ? 1 : 0.65,
          transition: 'opacity 0.25s ease',
        }} />
        <div style={{
          position: 'absolute', bottom: 8, left: 8, right: 8,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        }}>
          <span style={{
            fontSize: 9, fontWeight: 700, letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.6)',
            background: 'rgba(0,0,0,0.35)',
            padding: '2px 6px', borderRadius: 4,
            backdropFilter: 'blur(4px)',
          }}>
            {item.spec}
          </span>
          <span style={{
            fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.85)',
            display: 'flex', alignItems: 'center', gap: 3,
          }}>
            <Eye size={8} color="rgba(255,255,255,0.7)" />
            {item.views}
          </span>
        </div>
      </div>

      {/* Info */}
      <div style={{
        fontSize: 12.5, fontWeight: 650, color: '#111', lineHeight: 1.3,
        letterSpacing: '-0.015em',
        overflow: 'hidden', display: '-webkit-box',
        WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        marginBottom: 4,
      } as React.CSSProperties}>
        {item.title}
      </div>
      <div style={{
        fontSize: 11, color: '#9A9A9A', letterSpacing: '-0.01em',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {item.creator} · {item.city}
      </div>
    </div>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function toCounts<T extends string>(items: T[]): [T, number][] {
  const m = new Map<T, number>();
  items.forEach(v => m.set(v, (m.get(v) ?? 0) + 1));
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

function toggleSet(s: Set<string>, v: string): Set<string> {
  const n = new Set(s);
  n.has(v) ? n.delete(v) : n.add(v);
  return n;
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function BrowsePage({ params }: { params: Promise<{ section: string }> }) {
  const { section: sectionId } = use(params);
  const router = useRouter();

  const section = SECTIONS.find(s => s.id === sectionId);
  const isPortrait = section?.layout === 'portrait';

  const allItems = useMemo(() => getBrowseItems(sectionId, 24), [sectionId]);
  const categories = useMemo(() => toCounts(allItems.map(i => i.category)), [allItems]);
  const specs      = useMemo(() => toCounts(allItems.map(i => i.spec)),     [allItems]);
  const cities     = useMemo(() => toCounts(allItems.map(i => i.city)),     [allItems]);

  const [selCats,   setSelCats]   = useState<Set<string>>(new Set());
  const [selSpecs,  setSelSpecs]  = useState<Set<string>>(new Set());
  const [selCities, setSelCities] = useState<Set<string>>(new Set());

  // Fade grid on filter change
  const [gridOpacity, setGridOpacity] = useState(1);
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    setGridOpacity(0);
    if (fadeTimer.current) clearTimeout(fadeTimer.current);
    fadeTimer.current = setTimeout(() => setGridOpacity(1), 140);
    return () => { if (fadeTimer.current) clearTimeout(fadeTimer.current); };
  }, [selCats, selSpecs, selCities]);

  const filtered = useMemo(() => allItems.filter(item => {
    if (selCats.size   > 0 && !selCats.has(item.category)) return false;
    if (selSpecs.size  > 0 && !selSpecs.has(item.spec))    return false;
    if (selCities.size > 0 && !selCities.has(item.city))   return false;
    return true;
  }), [allItems, selCats, selSpecs, selCities]);

  const activeCount = selCats.size + selSpecs.size + selCities.size;
  const resetAll = () => { setSelCats(new Set()); setSelSpecs(new Set()); setSelCities(new Set()); };

  if (!section) return null;

  return (
    <div style={{ background: '#F5F5F3', minHeight: '100vh', paddingBottom: 72 }}>

      {/* ── Sticky filter bar ── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 20,
        background: 'rgba(245,245,243,0.94)',
        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
      }}>

        {/* Title row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px 0' }}>
          <button
            onClick={() => router.back()}
            style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'rgba(0,0,0,0.07)', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}
          >
            <ArrowLeft size={15} color="#111" />
          </button>

          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: '#111', letterSpacing: '-0.03em' }}>
              {section.genre}
            </span>
            <span style={{ fontSize: 11.5, color: '#AAA', marginLeft: 8, letterSpacing: '-0.01em' }}>
              {filtered.length}
            </span>
          </div>

          {activeCount > 0 && (
            <button
              onClick={resetAll}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                fontSize: 11.5, fontWeight: 600, color: '#555',
                background: 'rgba(0,0,0,0.07)', border: 'none', cursor: 'pointer',
                padding: '5px 10px 5px 8px', borderRadius: 100,
                transition: 'background 0.15s ease',
              }}
            >
              <X size={11} strokeWidth={2.5} />
              Сброс
            </button>
          )}
        </div>

        {/* Category chips */}
        <div style={{ overflowX: 'auto', scrollbarWidth: 'none', padding: '12px 0 0' }}>
          <div style={{ display: 'flex', gap: 6, padding: '0 16px' }}>
            {/* "Все" chip */}
            <CatChip
              label="Все"
              count={allItems.length}
              active={selCats.size === 0}
              onClick={resetAll}
            />
            {categories.map(([cat, cnt]) => (
              <CatChip
                key={cat} label={cat} count={cnt}
                active={selCats.has(cat)}
                onClick={() => setSelCats(s => toggleSet(s, cat))}
              />
            ))}
          </div>
        </div>

        {/* Role + city chips */}
        <div style={{ overflowX: 'auto', scrollbarWidth: 'none', padding: '8px 0 12px' }}>
          <div style={{ display: 'flex', gap: 5, padding: '0 16px' }}>
            {specs.map(([spec, cnt]) => (
              <RoleChip
                key={spec} label={spec} count={cnt}
                active={selSpecs.has(spec)}
                onClick={() => setSelSpecs(s => toggleSet(s, spec))}
              />
            ))}
            <span style={{ width: 1, background: 'rgba(0,0,0,0.1)', margin: '6px 4px', flexShrink: 0 }} />
            {cities.map(([city, cnt]) => (
              <RoleChip
                key={city} label={city} count={cnt}
                active={selCities.has(city)}
                onClick={() => setSelCities(s => toggleSet(s, city))}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Grid ── */}
      <div
        style={{
          padding: '14px 14px 0',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: isPortrait ? '18px 10px' : '14px',
          opacity: gridOpacity,
          transform: `translateY(${gridOpacity < 1 ? 6 : 0}px)`,
          transition: 'opacity 0.22s ease, transform 0.22s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {filtered.map(item => (
          <BrowseCard
            key={item.browseKey}
            item={item}
            isPortrait={!!isPortrait}
            onClick={() => router.push(`/case/${item.id}`)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '80px 20px', gap: 10,
        }}>
          <div style={{ fontSize: 32 }}>—</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#444', letterSpacing: '-0.02em' }}>Ничего не найдено</div>
          <button onClick={resetAll} style={{ fontSize: 12, color: '#888', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
            Сбросить фильтры
          </button>
        </div>
      )}
    </div>
  );
}
