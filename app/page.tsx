'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Settings, X, Play, Star, Eye, User } from 'lucide-react';
import { mockCreators } from '@/lib/mock-data';

// ─── Data construction ────────────────────────────────────────────────────────

const cases = mockCreators.flatMap((creator) =>
  creator.portfolio.map((p) => ({
    id: `${creator.id}-${p.id}`,
    creatorId: creator.id,
    creatorName: creator.name,
    creatorAvatar: creator.avatar,
    creatorCity: creator.city,
    creatorRating: creator.rating,
    creatorSpecialization: creator.specializations[0],
    isPro: creator.isPro,
    title: p.title,
    thumbnail: p.thumbnail,
    aspect: p.aspect,
    views: p.views,
    task: p.task,
    work: p.work,
    result: p.result,
    type: p.type,
    tags: creator.specializations,
  }))
);

// ─── Types ────────────────────────────────────────────────────────────────────

type Case = (typeof cases)[0];

// ─── Constants ────────────────────────────────────────────────────────────────

const NAV_ITEMS = ['Кейсы', 'Авторы', 'Хакатоны'] as const;

const TAGS = [
  'Все',
  'Reels / Shorts',
  'Кампейны / Фэшн',
  'YouTube-шоу',
  'Муз. клипы',
  'Сценарии',
  'Прогревы',
] as const;

const FILTER_SECTIONS = [
  { label: 'Город', chips: ['Ташкент', 'Самарканд', 'Онлайн'] },
  { label: 'Бюджет', chips: ['до 1М', '1–3М', '3М+'] },
  { label: 'Техника', chips: ['iPhone', 'Sony', 'RED'] },
  { label: 'Формат', chips: ['Reels', 'YouTube', 'Ивент'] },
] as const;

// ─── Helper: star rating ──────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <span style={{ display: 'inline-flex', gap: 2, alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={11}
          fill={i <= Math.round(rating) ? '#FFD60A' : 'none'}
          stroke={i <= Math.round(rating) ? '#FFD60A' : '#ccc'}
        />
      ))}
    </span>
  );
}

// ─── Case Card ────────────────────────────────────────────────────────────────

function CaseCard({
  item,
  onClick,
}: {
  item: Case;
  onClick: (c: Case) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const isPortrait = item.aspect === '9:16';
  const isText = item.type === 'photo' || !isPortrait;

  const cardBg = isText
    ? '#1C1C1A'
    : `linear-gradient(160deg, ${item.thumbnail}CC 0%, ${item.thumbnail}88 40%, #111 100%)`;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick(item)}
      onKeyDown={(e) => e.key === 'Enter' && onClick(item)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={() => setHovered(true)}
      onTouchEnd={() => setHovered(false)}
      style={{
        aspectRatio: '9/16',
        background: cardBg,
        borderRadius: 16,
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        outline: 'none',
      }}
    >
      {/* Shimmer overlay on hover */}
      {!isText && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            borderRadius: 'inherit',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '60%',
              height: '100%',
              background:
                'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%)',
              transform: hovered ? 'translateX(200%)' : 'translateX(-200%)',
              transition: hovered ? 'transform 0.7s ease' : 'none',
            }}
          />
        </div>
      )}

      {/* Play button on hover */}
      {!isText && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 3,
            pointerEvents: 'none',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.25s ease',
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.95)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: hovered ? 'scale(1)' : 'scale(0.7)',
              transition: 'transform 0.25s ease',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            }}
          >
            <Play size={20} fill="#111" stroke="none" style={{ marginLeft: 3 }} />
          </div>
        </div>
      )}

      {/* Bottom gradient */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '65%',
          background:
            'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)',
          zIndex: 1,
        }}
      />

      {/* Text/scriptwriter style: big quote */}
      {isText && (
        <div
          style={{
            position: 'absolute',
            top: 24,
            left: 20,
            right: 20,
            fontSize: 15,
            fontWeight: 600,
            color: '#fff',
            lineHeight: 1.5,
            zIndex: 2,
          }}
        >
          &ldquo;{item.title}&rdquo;
        </div>
      )}

      {/* Tags for text cards */}
      {isText && (
        <div
          style={{
            position: 'absolute',
            bottom: 64,
            left: 16,
            right: 16,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 6,
            zIndex: 4,
          }}
        >
          {item.tags.map((tag) => (
            <span
              key={tag}
              style={{
                background: '#333',
                color: '#888',
                borderRadius: 999,
                fontSize: 10,
                fontWeight: 500,
                padding: '3px 8px',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Bottom info overlay */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '0 14px 14px',
          zIndex: 4,
        }}
      >
        {/* Metrics pill */}
        <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              background: 'rgba(0,0,0,0.75)',
              color: '#fff',
              borderRadius: 999,
              fontSize: 11,
              fontWeight: 500,
              padding: '3px 8px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Eye size={10} /> {item.views}
          </span>
          {item.isPro && (
            <span
              style={{
                background: '#BF5AF2',
                color: '#fff',
                borderRadius: 999,
                fontSize: 10,
                fontWeight: 600,
                padding: '2px 7px',
              }}
            >
              PRO
            </span>
          )}
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: '#fff',
            lineHeight: 1.3,
            marginBottom: 4,
          }}
        >
          {item.title}
        </div>

        {/* Author row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: 'rgba(255,255,255,0.65)',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <span>{item.creatorName}</span>
            <span
              style={{
                background: 'rgba(255,255,255,0.15)',
                borderRadius: 4,
                padding: '1px 5px',
                fontSize: 10,
                fontWeight: 500,
              }}
            >
              {item.creatorSpecialization}
            </span>
          </div>

          {/* Avatar circle */}
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: item.thumbnail,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 10,
              fontWeight: 700,
              color: '#fff',
              flexShrink: 0,
              border: '1.5px solid rgba(255,255,255,0.3)',
            }}
          >
            {item.creatorAvatar}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Theater Modal ────────────────────────────────────────────────────────────

function TheaterModal({
  item,
  onClose,
}: {
  item: Case;
  onClose: () => void;
}) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const teamRoles = ['Сценарист', 'Оператор', 'Монтаж'];

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          zIndex: 100,
          animation: 'fadeIn 0.2s ease',
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          zIndex: 101,
          // Desktop: centered
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(900px, calc(100vw - 32px))',
          maxHeight: 'calc(100vh - 48px)',
          background: '#fff',
          borderRadius: 20,
          boxShadow: '0 24px 80px rgba(0,0,0,0.25)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'row',
          animation: 'slideUp 0.3s ease',
        }}
      >
        {/* Left: Video area — 58% */}
        <div
          style={{
            flex: '0 0 58%',
            background: `linear-gradient(160deg, ${item.thumbnail}CC 0%, ${item.thumbnail}66 40%, #111 100%)`,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 480,
          }}
        >
          {/* Play button */}
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.75)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
            }}
          >
            <Play size={24} fill="#fff" stroke="none" style={{ marginLeft: 3 }} />
          </div>

          {/* Title overlay bottom */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '60px 24px 24px',
              background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
            }}
          >
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: '#fff',
                lineHeight: 1.3,
              }}
            >
              {item.title}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>
              {item.creatorName} · {item.creatorCity}
            </div>
          </div>
        </div>

        {/* Right: Info panel — 42% */}
        <div
          style={{
            flex: '0 0 42%',
            padding: 32,
            overflowY: 'auto',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          {/* Close */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              width: 32,
              height: 32,
              borderRadius: '50%',
              border: '1px solid #E8E8E6',
              background: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#666',
            }}
          >
            <X size={14} />
          </button>

          {/* Type tag */}
          <div>
            <span
              style={{
                background: '#F0F0EE',
                color: '#666',
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 600,
                padding: '4px 10px',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              {item.type === 'video' ? 'КЕЙС' : 'РЕВЬЮ'}
            </span>
          </div>

          {/* Title */}
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: 22,
                fontWeight: 700,
                color: '#111',
                lineHeight: 1.3,
              }}
            >
              {item.title}
            </h2>
          </div>

          {/* Meta */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              fontSize: 13,
              color: '#555',
            }}
          >
            <div>
              <strong style={{ color: '#111' }}>Автор:</strong> {item.creatorName}
            </div>
            <div>
              <strong style={{ color: '#111' }}>Город:</strong> {item.creatorCity}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <StarRating rating={item.creatorRating} />
              <span style={{ fontSize: 12, color: '#888' }}>{item.creatorRating.toFixed(1)}</span>
            </div>
          </div>

          {/* Task & Result */}
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: '#888',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: 10,
              }}
            >
              Задача и результат
            </div>
            <div style={{ fontSize: 14, color: '#333', lineHeight: 1.6, marginBottom: 8 }}>
              <strong style={{ color: '#111' }}>Задача:</strong> {item.task}
            </div>
            <div style={{ fontSize: 14, color: '#333', lineHeight: 1.6 }}>
              <strong style={{ color: '#111' }}>Результат:</strong> {item.result}
            </div>
          </div>

          {/* Views metric */}
          <div
            style={{
              background: '#F5F5F3',
              borderRadius: 14,
              padding: '16px 20px',
            }}
          >
            <div
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: '#111',
                lineHeight: 1,
              }}
            >
              {item.views}
            </div>
            <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>просмотров</div>
          </div>

          {/* Team */}
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: '#888',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: 10,
              }}
            >
              Команда
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {teamRoles.map((role) => (
                <button
                  key={role}
                  style={{
                    background: '#F0F0EE',
                    border: 'none',
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 500,
                    color: '#333',
                    padding: '6px 14px',
                    cursor: 'pointer',
                  }}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{ marginTop: 'auto', paddingTop: 8 }}>
            <button
              style={{
                width: '100%',
                height: 52,
                background: '#111',
                color: '#fff',
                border: 'none',
                borderRadius: 999,
                fontSize: 16,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                letterSpacing: '-0.01em',
              }}
            >
              Нанять автора → Telegram
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Filter Sheet ─────────────────────────────────────────────────────────────

function FilterSheet({ onClose }: { onClose: () => void }) {
  const [selected, setSelected] = useState<Record<string, string>>({});

  const toggle = (section: string, chip: string) => {
    setSelected((prev) =>
      prev[section] === chip ? { ...prev, [section]: '' } : { ...prev, [section]: chip }
    );
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.4)',
          zIndex: 200,
          animation: 'fadeIn 0.2s ease',
        }}
      />

      {/* Sheet */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 201,
          background: '#fff',
          borderRadius: '24px 24px 0 0',
          padding: '0 20px 40px',
          animation: 'slideUp 0.3s ease',
        }}
      >
        {/* Drag handle */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            paddingTop: 12,
            paddingBottom: 20,
          }}
        >
          <div
            style={{
              width: 36,
              height: 4,
              borderRadius: 999,
              background: '#E0E0DC',
            }}
          />
        </div>

        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: '#111',
            marginBottom: 24,
          }}
        >
          Параметры
        </div>

        {/* Filter sections */}
        {FILTER_SECTIONS.map((section) => (
          <div key={section.label} style={{ marginBottom: 24 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: '#888',
                marginBottom: 12,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {section.label}
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {section.chips.map((chip) => {
                const isActive = selected[section.label] === chip;
                return (
                  <button
                    key={chip}
                    onClick={() => toggle(section.label, chip)}
                    style={{
                      background: isActive ? '#111' : 'transparent',
                      color: isActive ? '#fff' : '#444',
                      border: `1px solid ${isActive ? '#111' : '#E0E0DC'}`,
                      borderRadius: 999,
                      fontSize: 13,
                      fontWeight: 500,
                      padding: '7px 16px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {chip}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <button
            onClick={() => setSelected({})}
            style={{
              flex: 1,
              height: 48,
              background: 'transparent',
              color: '#333',
              border: '1px solid #E0E0DC',
              borderRadius: 999,
              fontSize: 15,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Сбросить
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 2,
              height: 48,
              background: '#111',
              color: '#fff',
              border: 'none',
              borderRadius: 999,
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Применить
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [activeNav, setActiveNav] = useState<string>('Кейсы');
  const [activeTag, setActiveTag] = useState<string>('Все');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll for frosted glass header
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Prevent body scroll when modal open
  useEffect(() => {
    if (selectedCase || showFilter) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedCase, showFilter]);

  // Filtered cases
  const filteredCases = cases.filter((c) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (
        !c.title.toLowerCase().includes(q) &&
        !c.creatorName.toLowerCase().includes(q) &&
        !c.creatorSpecialization.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    if (activeTag !== 'Все') {
      const tagMap: Record<string, string[]> = {
        'Reels / Shorts': ['Мобилограф', 'Reels'],
        'Кампейны / Фэшн': ['SMM', 'Таргетолог'],
        'YouTube-шоу': ['Продюсер'],
        'Муз. клипы': ['Монтажёр', 'Колорист'],
        Сценарии: ['Сценарист'],
        Прогревы: ['SMM'],
      };
      const allowedSpecs = tagMap[activeTag] ?? [];
      if (!c.tags.some((t) => allowedSpecs.includes(t))) {
        return false;
      }
    }
    return true;
  });

  return (
    <>
      {/* Blurred content backdrop when theater open */}
      <div
        style={{
          filter: selectedCase ? 'blur(4px)' : 'none',
          transition: 'filter 0.25s ease',
          pointerEvents: selectedCase ? 'none' : 'auto',
        }}
      >
        {/* ── HEADER ──────────────────────────────────────────────────────── */}
        <header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 50,
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            transition: 'background 0.25s ease, border-color 0.25s ease',
            backdropFilter: scrolled ? 'blur(20px)' : 'none',
            WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
            background: scrolled ? 'rgba(245,245,243,0.85)' : 'transparent',
            borderBottom: scrolled ? '1px solid rgba(0,0,0,0.08)' : '1px solid transparent',
          }}
        >
          {/* Logo */}
          <div
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: '#111',
              letterSpacing: '-0.06em',
              lineHeight: 1,
              flexShrink: 0,
            }}
          >
            CH
          </div>

          {/* Nav */}
          <nav
            style={{
              display: 'flex',
              gap: 4,
              alignItems: 'center',
            }}
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeNav === item;
              return (
                <button
                  key={item}
                  onClick={() => setActiveNav(item)}
                  style={{
                    background: isActive ? '#111' : 'transparent',
                    color: isActive ? '#fff' : '#888',
                    border: 'none',
                    borderRadius: 999,
                    fontSize: 13,
                    fontWeight: 500,
                    padding: '6px 14px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {item}
                </button>
              );
            })}
          </nav>

          {/* Right actions */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              flexShrink: 0,
            }}
          >
            <button
              style={{
                background: '#111',
                color: '#fff',
                border: 'none',
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 500,
                padding: '7px 16px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                letterSpacing: '-0.01em',
              }}
            >
              Разместить проект
            </button>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: '#F0F0F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <User size={15} color="#555" />
            </div>
          </div>
        </header>

        {/* ── SEARCH + TAGS BAR ────────────────────────────────────────────── */}
        <div
          style={{
            position: 'sticky',
            top: 56,
            zIndex: 40,
            background: '#fff',
            borderBottom: '1px solid #E8E8E6',
            padding: '12px 20px 0',
          }}
        >
          {/* Search input */}
          <div
            style={{
              position: 'relative',
              marginBottom: 12,
            }}
          >
            <Search
              size={15}
              color="#aaa"
              style={{
                position: 'absolute',
                left: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
              }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Найти: Монтажёр для Reels, Сценарист для бьюти, YouTube-режиссёр..."
              style={{
                width: '100%',
                height: 44,
                border: '1px solid #E0E0DC',
                borderRadius: 999,
                paddingLeft: 38,
                paddingRight: 16,
                fontSize: 13,
                color: '#111',
                background: '#fff',
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
          </div>

          {/* Tags row */}
          <div
            style={{
              display: 'flex',
              gap: 8,
              overflowX: 'auto',
              paddingBottom: 12,
              alignItems: 'center',
            }}
            className="no-scrollbar"
          >
            {TAGS.map((tag) => {
              const isActive = activeTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  style={{
                    background: isActive ? '#111' : 'transparent',
                    color: isActive ? '#fff' : '#666',
                    border: `1px solid ${isActive ? '#111' : '#E0E0DC'}`,
                    borderRadius: 999,
                    fontSize: 13,
                    fontWeight: 500,
                    padding: '6px 14px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    transition: 'all 0.15s ease',
                  }}
                >
                  {tag}
                </button>
              );
            })}

            {/* Spacer */}
            <div style={{ flex: 1, minWidth: 8 }} />

            {/* Параметры */}
            <button
              onClick={() => setShowFilter(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                background: 'transparent',
                color: '#444',
                border: '1px solid #E0E0DC',
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 500,
                padding: '6px 14px',
                cursor: 'pointer',
                flexShrink: 0,
                whiteSpace: 'nowrap',
              }}
            >
              <Settings size={13} />
              Параметры
            </button>
          </div>
        </div>

        {/* ── CASES GRID ──────────────────────────────────────────────────── */}
        <main
          style={{
            padding: '20px 16px 60px',
            maxWidth: 1200,
            margin: '0 auto',
          }}
        >
          {filteredCases.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '80px 0',
                color: '#888',
                fontSize: 15,
              }}
            >
              Ничего не найдено
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 12,
              }}
              className="cases-grid"
            >
              {filteredCases.map((item) => (
                <CaseCard key={item.id} item={item} onClick={setSelectedCase} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* ── THEATER MODAL ──────────────────────────────────────────────────── */}
      {selectedCase && (
        <TheaterModal item={selectedCase} onClose={() => setSelectedCase(null)} />
      )}

      {/* ── FILTER SHEET ───────────────────────────────────────────────────── */}
      {showFilter && <FilterSheet onClose={() => setShowFilter(false)} />}

      {/* Responsive grid: 3 columns on md+ */}
      <style>{`
        @media (min-width: 768px) {
          .cases-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .theater-modal {
            top: auto !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            transform: none !important;
            width: 100% !important;
            max-height: 95vh !important;
            border-radius: 20px 20px 0 0 !important;
            flex-direction: column !important;
          }
        }
      `}</style>
    </>
  );
}
