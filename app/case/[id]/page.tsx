'use client';

import { use, useState, useEffect, useRef, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Share2, Play, Eye, Star, Send } from 'lucide-react';
import { type CaseItem, ALL_CASES, findCase, ytMaxThumb, ytPlayer, ytThumb } from '@/lib/data';

// ─── Scroll reveal ────────────────────────────────────────────────────────────

function useScrollReveal(threshold = 0.08) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Reveal({ children, label }: { children: ReactNode; label?: string }) {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(18px)',
        transition: 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      {label && (
        <div style={{
          fontSize: 10, fontWeight: 700, color: '#C0C0BC',
          textTransform: 'uppercase', letterSpacing: '0.09em',
          marginBottom: 14, padding: '0 20px',
        }}>
          {label}
        </div>
      )}
      {children}
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: '#F0F0EE', margin: '0 20px' }} />;
}

// ─── Mock comments ────────────────────────────────────────────────────────────

const COMMENTS = [
  { id: 1, initials: 'KY', color: '#4A3A5C', name: 'Камол Ёқубов', time: '2 ч назад', text: 'Крутая работа! На каком оборудовании снимали?' },
  { id: 2, initials: 'ZM', color: '#3A5C48', name: 'Зульфия М.', time: '5 ч назад', text: 'Вау, какой цвет! Это DaVinci?' },
];

// ─── Mini card for "more" section ────────────────────────────────────────────

function MiniCard({ item, onClick }: { item: CaseItem; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ flexShrink: 0, width: 160, cursor: 'pointer' }}
    >
      <div style={{
        width: '100%', aspectRatio: '16/9', borderRadius: 12,
        overflow: 'hidden', background: '#111', marginBottom: 8,
        transform: hovered ? 'scale(0.97)' : 'scale(1)',
        transition: 'transform 0.25s cubic-bezier(0.16,1,0.3,1)',
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ytThumb(item.youtubeId)}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#111', lineHeight: 1.35, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {item.title}
      </div>
      <div style={{ fontSize: 10.5, color: '#AAA', marginTop: 3, display: 'flex', alignItems: 'center', gap: 3 }}>
        <Eye size={9} /> {item.views}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CasePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const item = findCase(id);
  const [playing, setPlaying] = useState(false);
  const [comment, setComment] = useState('');

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    if (!item) router.replace('/');
  }, [item, router]);

  if (!item) return null;

  const moreItems = ALL_CASES
    .filter(c => c.creator === item.creator && c.id !== item.id)
    .slice(0, 5);

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({ title: item.title, url: window.location.href });
    }
  };

  return (
    <div style={{ background: '#F5F5F3', minHeight: '100vh', paddingBottom: 48 }}>

      {/* ── Floating controls ── */}
      <button
        onClick={() => router.back()}
        style={{
          position: 'fixed', top: 14, left: 14, zIndex: 60,
          width: 40, height: 40, borderRadius: '50%',
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}
      >
        <ArrowLeft size={17} color="#fff" />
      </button>
      <button
        onClick={handleShare}
        style={{
          position: 'fixed', top: 14, right: 14, zIndex: 60,
          width: 40, height: 40, borderRadius: '50%',
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}
      >
        <Share2 size={16} color="#fff" />
      </button>

      {/* ── Video ── */}
      <div style={{ width: '100%', aspectRatio: '16/9', position: 'relative', background: '#000' }}>
        {playing ? (
          <iframe
            src={ytPlayer(item.youtubeId)}
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
          />
        ) : (
          <div
            onClick={() => setPlaying(true)}
            style={{
              position: 'absolute', inset: 0, cursor: 'pointer',
              backgroundImage: `url(${ytMaxThumb(item.youtubeId)})`,
              backgroundSize: 'cover', backgroundPosition: 'center',
            }}
          >
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.28)' }} />
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{
                width: 68, height: 68, borderRadius: '50%',
                background: 'rgba(255,255,255,0.96)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 10px 40px rgba(0,0,0,0.35)',
              }}>
                <Play size={26} fill="#111" stroke="none" style={{ marginLeft: 4 }} />
              </div>
            </div>
            {item.duration && (
              <div style={{
                position: 'absolute', bottom: 12, right: 12,
                background: 'rgba(0,0,0,0.62)', color: '#fff',
                fontSize: 11, fontWeight: 500, padding: '3px 8px', borderRadius: 6,
              }}>
                {item.duration}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Content card (slides up from under video) ── */}
      <div style={{
        background: '#fff',
        borderRadius: '24px 24px 0 0',
        marginTop: -20,
        position: 'relative', zIndex: 1,
        paddingTop: 10,
        animation: 'slideUp 0.5s cubic-bezier(0.16,1,0.3,1)',
      }}>

        {/* Drag handle decoration */}
        <div style={{
          width: 36, height: 4, borderRadius: 2,
          background: '#E0E0DE', margin: '0 auto 22px',
        }} />

        {/* ── Author row ── */}
        <div style={{ padding: '0 20px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{
              width: 50, height: 50, borderRadius: '50%',
              background: item.avatarColor,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0,
            }}>
              {item.initials}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15.5, fontWeight: 700, color: '#111' }}>{item.creator}</div>
              <div style={{ fontSize: 12, color: '#AAA', marginTop: 2 }}>{item.spec} · {item.city}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {[1,2,3,4,5].map(i => (
                <Star
                  key={i}
                  size={11}
                  fill={i <= Math.round(item.rating) ? '#C8A96E' : 'none'}
                  stroke={i <= Math.round(item.rating) ? '#C8A96E' : '#DDD'}
                />
              ))}
              <span style={{ fontSize: 11.5, color: '#AAA', marginLeft: 4 }}>{item.rating}</span>
            </div>
          </div>

          <button style={{
            width: '100%', height: 50,
            background: '#0D0D0D', color: '#fff',
            border: 'none', borderRadius: 16,
            fontSize: 15, fontWeight: 600, cursor: 'pointer',
            letterSpacing: '-0.01em',
          }}>
            Написать автору
          </button>
        </div>

        <Divider />

        {/* ── Stats + story ── */}
        <Reveal>
          <div style={{ padding: '24px 20px 0' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 16 }}>
              <span style={{
                fontSize: 52, fontWeight: 900, letterSpacing: '-0.04em',
                lineHeight: 1, color: '#0D0D0D',
              }}>
                {item.views}
              </span>
              <span style={{ fontSize: 12, color: '#CCC', paddingBottom: 5 }}>просмотров</span>
            </div>

            <div style={{
              fontSize: 22, fontWeight: 800, color: '#0D0D0D',
              letterSpacing: '-0.03em', lineHeight: 1.25,
              marginBottom: 14,
            }}>
              {item.title}
            </div>

            <div style={{
              fontSize: 14.5, color: '#555', lineHeight: 1.75,
              marginBottom: 18,
            }}>
              {item.story}
            </div>

            {/* Result highlight */}
            <div style={{
              background: '#F5F5F3', borderRadius: 14,
              padding: '14px 16px',
              display: 'flex', alignItems: 'stretch', gap: 14,
              marginBottom: 24,
            }}>
              <div style={{ width: 3, background: '#0D0D0D', borderRadius: 2, flexShrink: 0 }} />
              <div>
                <div style={{
                  fontSize: 10, fontWeight: 700, color: '#BBBBBB',
                  textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 5,
                }}>
                  Результат
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#0D0D0D' }}>
                  {item.result}
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Divider />

        {/* ── Roles ── */}
        <div style={{ height: 24 }} />
        <Reveal label="Что сделал автор">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: '0 20px' }}>
            {item.roles.map(role => (
              <span key={role} style={{
                background: '#F5F5F3', color: '#333',
                borderRadius: 10, fontSize: 13, fontWeight: 500,
                padding: '9px 16px', border: '1px solid #E8E8E6',
              }}>
                {role}
              </span>
            ))}
          </div>
        </Reveal>
        <div style={{ height: 28 }} />

        <Divider />

        {/* ── Gallery ── */}
        {item.galleryIds.length > 0 && (
          <>
            <div style={{ height: 24 }} />
            <Reveal label="Медиа">
              <div
                style={{
                  display: 'flex', gap: 8, overflowX: 'auto',
                  paddingLeft: 20, paddingRight: 20, paddingBottom: 4,
                }}
                className="no-scrollbar"
              >
                {item.galleryIds.map((gid, i) => (
                  <div key={i} style={{
                    flexShrink: 0, width: 140, height: 79,
                    borderRadius: 11, overflow: 'hidden', background: '#111',
                  }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={ytThumb(gid)}
                      alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </div>
                ))}
              </div>
            </Reveal>
            <div style={{ height: 28 }} />
            <Divider />
          </>
        )}

        {/* ── Category + Tags ── */}
        <div style={{ height: 24 }} />
        <Reveal label="Категория и теги">
          <div style={{ padding: '0 20px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 10 }}>
              <span style={{
                background: '#0D0D0D', color: '#fff',
                borderRadius: 10, fontSize: 13, fontWeight: 600,
                padding: '8px 16px',
              }}>
                {item.category}
              </span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {item.tags.map(tag => (
                <span key={tag} style={{
                  background: '#F5F5F3', color: '#888',
                  borderRadius: 10, fontSize: 13, fontWeight: 500,
                  padding: '8px 14px', border: '1px solid #EAEAE8',
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
        <div style={{ height: 28 }} />

        <Divider />

        {/* ── Comments ── */}
        <div style={{ height: 24 }} />
        <Reveal label={`Комментарии (${COMMENTS.length})`}>
          <div style={{ padding: '0 20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 20 }}>
              {COMMENTS.map(c => (
                <div key={c.id} style={{ display: 'flex', gap: 10 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: '50%',
                    background: c.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 9, fontWeight: 700, color: '#fff', flexShrink: 0,
                  }}>
                    {c.initials}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: '#111' }}>{c.name}</span>
                      <span style={{ fontSize: 11, color: '#CCC' }}>{c.time}</span>
                    </div>
                    <div style={{ fontSize: 13.5, color: '#444', lineHeight: 1.55 }}>{c.text}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: '#F5F5F3', borderRadius: 14,
              padding: '10px 10px 10px 16px',
            }}>
              <input
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Написать комментарий..."
                style={{
                  flex: 1, background: 'none', border: 'none', outline: 'none',
                  fontSize: 13.5, color: '#111',
                }}
              />
              <button style={{
                width: 34, height: 34, borderRadius: '50%',
                background: comment.trim() ? '#0D0D0D' : '#E4E4E2',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, transition: 'background 0.2s ease',
              }}>
                <Send size={14} color={comment.trim() ? '#fff' : '#AAA'} />
              </button>
            </div>
          </div>
        </Reveal>

        {/* ── More from author ── */}
        {moreItems.length > 0 && (
          <>
            <div style={{ height: 28 }} />
            <Divider />
            <div style={{ height: 24 }} />
            <Reveal label={`Ещё от ${item.creator.split(' ')[0]}`}>
              <div
                style={{
                  display: 'flex', gap: 10, overflowX: 'auto',
                  paddingLeft: 20, paddingRight: 20, paddingBottom: 4,
                }}
                className="no-scrollbar"
              >
                {moreItems.map(c => (
                  <MiniCard
                    key={c.id}
                    item={c}
                    onClick={() => router.push('/case/' + c.id)}
                  />
                ))}
              </div>
            </Reveal>
          </>
        )}

        <div style={{ height: 64 }} />
      </div>
    </div>
  );
}
