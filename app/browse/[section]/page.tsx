'use client';

import { use, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, Eye } from 'lucide-react';
import {
  SECTIONS, getBrowseItems,
  ytThumb, ytPortraitThumb,
  type BrowseItem,
} from '@/lib/data';

// ── Category metadata ──────────────────────────────────────────────────────────

const CAT_META: Record<string, { emoji: string; bg: string; accent: string }> = {
  'Fashion':    { emoji: '👗', bg: 'linear-gradient(160deg,#FDE8EF 0%,#fff 100%)', accent: '#C8506A' },
  'Beauty':     { emoji: '💄', bg: 'linear-gradient(160deg,#EDE8FD 0%,#fff 100%)', accent: '#7850C8' },
  'Food':       { emoji: '🍽️', bg: 'linear-gradient(160deg,#FDF4E8 0%,#fff 100%)', accent: '#C87830' },
  'Lifestyle':  { emoji: '🌿', bg: 'linear-gradient(160deg,#E8FDF0 0%,#fff 100%)', accent: '#30A060' },
  'Tech':       { emoji: '💻', bg: 'linear-gradient(160deg,#E8EFFE 0%,#fff 100%)', accent: '#3060C8' },
  'E-commerce': { emoji: '🛍️', bg: 'linear-gradient(160deg,#FDE8E0 0%,#fff 100%)', accent: '#C86040' },
  'Реклама':    { emoji: '📢', bg: 'linear-gradient(160deg,#FDFCE0 0%,#fff 100%)', accent: '#A09020' },
  'Кино':       { emoji: '🎬', bg: 'linear-gradient(160deg,#E8E8FD 0%,#fff 100%)', accent: '#5050C8' },
  'Музыка':     { emoji: '🎵', bg: 'linear-gradient(160deg,#FDE8F5 0%,#fff 100%)', accent: '#C83098' },
  'Performance':{ emoji: '📊', bg: 'linear-gradient(160deg,#E0FDFD 0%,#fff 100%)', accent: '#30A0A0' },
  'Branding':   { emoji: '✦',  bg: 'linear-gradient(160deg,#F5F5E8 0%,#fff 100%)', accent: '#808050' },
  'Education':  { emoji: '📚', bg: 'linear-gradient(160deg,#E8F0FD 0%,#fff 100%)', accent: '#4060C8' },
};
const CAT_DEFAULT = { emoji: '▪', bg: '#F2F2F0', accent: '#888' };

const SPEC_COLOR: Record<string, string> = {
  'Мобилограф': '#E8643C',
  'Монтажёр':   '#3C76E8',
  'Сценарист':  '#8C3CE8',
  'Колорист':   '#3CB87C',
  'Продюсер':   '#E8B43C',
  'Таргетолог': '#3CB8C8',
};

// ── Filter card (category) ─────────────────────────────────────────────────────

function FilterCard({
  emoji, label, count, bg, accent, active, onClick,
}: {
  emoji: string; label: string; count: number;
  bg: string; accent: string; active: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flexShrink: 0, width: 90, padding: '14px 8px 12px',
        borderRadius: 20,
        border: `2px solid ${active ? accent : 'rgba(0,0,0,0.06)'}`,
        background: active ? bg : '#F2F2F0',
        cursor: 'pointer',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
        transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
        transform: active ? 'scale(1.05)' : 'scale(1)',
        boxShadow: active ? `0 4px 20px ${accent}28` : 'none',
        position: 'relative',
      }}
    >
      {active && (
        <div style={{
          position: 'absolute', top: 7, right: 7,
          width: 16, height: 16, borderRadius: '50%', background: accent,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Check size={9} color="#fff" strokeWidth={2.5} />
        </div>
      )}
      <span style={{ fontSize: 28, lineHeight: 1, filter: active ? 'none' : 'grayscale(20%)' }}>{emoji}</span>
      <span style={{
        fontSize: 10.5, fontWeight: 700, color: active ? accent : '#555',
        textAlign: 'center', lineHeight: 1.25, letterSpacing: '-0.01em',
      }}>{label}</span>
      <span style={{
        fontSize: 10, fontWeight: 500,
        color: active ? accent : '#BBB',
      }}>{count}</span>
    </button>
  );
}

// ── Pill chip (spec / city) ────────────────────────────────────────────────────

function PillChip({
  label, count, color, active, onClick,
}: {
  label: string; count: number; color: string; active: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flexShrink: 0, padding: '6px 14px',
        borderRadius: 100,
        border: `1.5px solid ${active ? color : 'rgba(0,0,0,0.08)'}`,
        background: active ? `${color}14` : '#F2F2F0',
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 6,
        transition: 'all 0.18s ease',
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0, opacity: active ? 1 : 0.4 }} />
      <span style={{ fontSize: 11.5, fontWeight: 600, color: active ? color : '#666', whiteSpace: 'nowrap' }}>{label}</span>
      <span style={{ fontSize: 10, color: active ? color : '#C0C0C0', fontWeight: 500 }}>{count}</span>
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
      <div style={{
        width: '100%',
        aspectRatio: isPortrait ? '9/16' : '16/9',
        borderRadius: 14,
        overflow: 'hidden',
        background: '#111',
        transform: hovered ? 'scale(0.97)' : 'scale(1)',
        transition: 'transform 0.25s cubic-bezier(0.16,1,0.3,1)',
        marginBottom: 8,
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumb}
          alt={item.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>
      <div style={{
        fontSize: 12.5, fontWeight: 600, color: '#111', lineHeight: 1.35,
        overflow: 'hidden', display: '-webkit-box',
        WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        marginBottom: 4,
      } as React.CSSProperties}>
        {item.title}
      </div>
      <div style={{ fontSize: 11, color: '#AAA', display: 'flex', alignItems: 'center', gap: 4 }}>
        <Eye size={9} />
        <span>{item.views}</span>
        <span style={{ color: '#DDD' }}>·</span>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.creator}</span>
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

  const filtered = useMemo(() => allItems.filter(item => {
    if (selCats.size   > 0 && !selCats.has(item.category)) return false;
    if (selSpecs.size  > 0 && !selSpecs.has(item.spec))    return false;
    if (selCities.size > 0 && !selCities.has(item.city))   return false;
    return true;
  }), [allItems, selCats, selSpecs, selCities]);

  const activeCount = selCats.size + selSpecs.size + selCities.size;

  if (!section) return null;

  return (
    <div style={{ background: '#F5F5F3', minHeight: '100vh', paddingBottom: 72 }}>

      {/* ── Sticky header ── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 20,
        background: 'rgba(245,245,243,0.92)', backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        paddingBottom: 2,
      }}>
        {/* Title row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px 0' }}>
          <button
            onClick={() => router.back()}
            style={{
              width: 36, height: 36, borderRadius: '50%',
              background: '#fff', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
            }}
          >
            <ArrowLeft size={16} color="#111" />
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: '#111', letterSpacing: '-0.02em' }}>
              {section.genre}
            </div>
            <div style={{ fontSize: 11.5, color: '#AAA', marginTop: 1 }}>
              {filtered.length} работ{activeCount > 0 ? <span style={{ color: '#C8506A' }}> · активны фильтры</span> : null}
            </div>
          </div>
          {activeCount > 0 && (
            <button
              onClick={() => { setSelCats(new Set()); setSelSpecs(new Set()); setSelCities(new Set()); }}
              style={{
                fontSize: 12, fontWeight: 600, color: '#C8506A',
                background: '#FDE8EF', border: 'none', cursor: 'pointer',
                padding: '5px 12px', borderRadius: 100,
              }}
            >
              Сброс
            </button>
          )}
        </div>

        {/* Category filter cards */}
        <div style={{ overflowX: 'auto', scrollbarWidth: 'none', paddingTop: 14 }}>
          <div style={{ display: 'flex', gap: 8, padding: '0 16px' }}>
            {categories.map(([cat, cnt]) => {
              const m = CAT_META[cat] ?? CAT_DEFAULT;
              return (
                <FilterCard
                  key={cat}
                  emoji={m.emoji} label={cat} count={cnt}
                  bg={m.bg} accent={m.accent}
                  active={selCats.has(cat)}
                  onClick={() => setSelCats(s => toggleSet(s, cat))}
                />
              );
            })}
          </div>
        </div>

        {/* Spec + city pill chips */}
        <div style={{ overflowX: 'auto', scrollbarWidth: 'none', padding: '10px 0 14px' }}>
          <div style={{ display: 'flex', gap: 6, padding: '0 16px' }}>
            {specs.map(([spec, cnt]) => (
              <PillChip
                key={spec} label={spec} count={cnt}
                color={SPEC_COLOR[spec] ?? '#888'}
                active={selSpecs.has(spec)}
                onClick={() => setSelSpecs(s => toggleSet(s, spec))}
              />
            ))}
            {cities.map(([city, cnt]) => (
              <PillChip
                key={city} label={city} count={cnt}
                color="#6B7280"
                active={selCities.has(city)}
                onClick={() => setSelCities(s => toggleSet(s, city))}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Grid ── */}
      <div style={{
        padding: '4px 14px 0',
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: isPortrait ? '14px 10px' : '12px',
      }}>
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
        <div style={{ textAlign: 'center', padding: '80px 20px', color: '#BBB', fontSize: 13 }}>
          Ничего не найдено
        </div>
      )}
    </div>
  );
}
