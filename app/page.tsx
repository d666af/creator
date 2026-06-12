'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Play, Eye, Search, Bell, Home, Users, Briefcase, User } from 'lucide-react';
import {
  type CaseItem, type Section,
  SECTIONS, HERO_ITEMS, TICKER_ITEMS,
  ytThumb, ytMaxThumb,
} from '@/lib/data';

// ─── YouTube URLs ─────────────────────────────────────────────────────────────

const ytPreview = (id: string) =>
  `https://www.youtube.com/embed/${id}?enablejsapi=1&autoplay=1&mute=1&controls=0&loop=1&playlist=${id}&playsinline=1&rel=0&modestbranding=1&disablekb=1&iv_load_policy=3`;

// For Shorts: clip the 16:9 player to show only the center 9:16 strip (no black bars)
// The iframe is made 177.78% wide (= 16/9) in the 9:16 card, then centred — shows exact portrait crop
const ytShortsPreview = (id: string) =>
  `https://www.youtube.com/embed/${id}?enablejsapi=1&autoplay=1&mute=1&controls=0&loop=1&playlist=${id}&playsinline=1&rel=0&modestbranding=1&disablekb=1&iv_load_policy=3`;

// ─── Hooks ────────────────────────────────────────────────────────────────────

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

// Combined card interactions: 3D tilt + iframe pre-load + hover preview
function useCardInteractions(intensity = 10) {
  const ref = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  const [inView, setInView] = useState(false);
  const [preview, setPreview] = useState(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Pre-load iframe when card enters viewport
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold: 0.05 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => () => { if (hoverTimer.current) clearTimeout(hoverTimer.current); }, []);

  const sendCmd = (fn: string) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func: fn, args: [] }), '*',
    );
  };

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setTilt({ x: ((e.clientY - r.top) / r.height - 0.5) * -intensity, y: ((e.clientX - r.left) / r.width - 0.5) * intensity });
    setActive(true);
  }, [intensity]);

  const onMouseEnter = () => {
    hoverTimer.current = setTimeout(() => {
      setPreview(true);
      sendCmd('playVideo');
    }, 200);
  };

  const onMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setActive(false);
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setPreview(false);
    sendCmd('pauseVideo');
  };

  const onIframeLoad = () => {
    if (preview) sendCmd('playVideo');
  };

  return { ref, iframeRef, tilt, active, inView, preview, onMouseMove, onMouseEnter, onMouseLeave, onIframeLoad };
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
    <div onClick={() => onClick(item)} style={{ position: 'relative', width: '100%', aspectRatio: '16/9', cursor: 'pointer', background: '#000', animation: 'heroFade 0.45s cubic-bezier(0.16,1,0.3,1) forwards' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(170deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.9) 100%), url(${ytMaxThumb(item.youtubeId)})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      {item.duration && <div style={{ position: 'absolute', top: 16, right: 16, color: 'rgba(255,255,255,0.55)', fontSize: 11, fontWeight: 500, letterSpacing: '0.02em', zIndex: 1 }}>{item.duration}</div>}
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
      <div style={{ borderRadius: 22, overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.26)', position: 'relative' }} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onTouchStart={(e) => { touchX.current = e.targetTouches[0].clientX; setPaused(true); }} onTouchEnd={(e) => { const d = touchX.current - e.changedTouches[0].clientX; if (d > 40) go(1); else if (d < -40) go(-1); setPaused(false); }}>
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

// ─── Portrait Card ────────────────────────────────────────────────────────────

function PortraitCard({ item, onClick }: { item: CaseItem; onClick: (c: CaseItem) => void }) {
  const { ref, iframeRef, tilt, active, inView, preview, onMouseMove, onMouseEnter, onMouseLeave, onIframeLoad } = useCardInteractions(12);

  return (
    <div
      ref={ref}
      onClick={() => onClick(item)}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        flexShrink: 0, width: 155, height: 276, borderRadius: 18,
        overflow: 'hidden', cursor: 'pointer', position: 'relative', background: '#111',
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${active ? 1.03 : 1})`,
        transition: active ? 'transform 0.08s ease, box-shadow 0.15s ease' : 'transform 0.55s cubic-bezier(0.23,1,0.32,1), box-shadow 0.4s ease',
        boxShadow: active ? '0 24px 48px rgba(0,0,0,0.38)' : '0 6px 20px rgba(0,0,0,0.18)',
        willChange: 'transform',
      }}
    >
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url(${ytThumb(item.youtubeId)})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        transition: 'opacity 0.4s ease',
        opacity: preview ? 0 : 1,
      }} />

      {/* Pre-rendered iframe — Shorts: content is the center 56.25% strip of the 16:9 frame.
          We set iframe width = 177.78% (= 100% / 0.5625) so that center 9:16 strip fills card exactly. */}
      {inView && (
        <div style={{
          position: 'absolute', inset: 0, overflow: 'hidden',
          opacity: preview ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}>
          <iframe
            ref={iframeRef}
            src={ytShortsPreview(item.youtubeId)}
            allow="autoplay; encrypted-media"
            onLoad={onIframeLoad}
            style={{
              position: 'absolute', top: 0, left: '50%',
              width: '177.78%', height: '100%',
              transform: 'translateX(-50%)',
              border: 'none', pointerEvents: 'none',
            }}
          />
        </div>
      )}

      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(to bottom, rgba(0,0,0,0.04) 30%, rgba(0,0,0,0.8) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(circle at ${50 + tilt.y * 2.5}% ${50 - tilt.x * 2.5}%, rgba(255,255,255,0.07) 0%, transparent 65%)`, transition: 'background 0.08s ease' }} />

      {item.duration && <div style={{ position: 'absolute', top: 12, right: 12, color: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: 500, zIndex: 2 }}>{item.duration}</div>}

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

// ─── Landscape Card ───────────────────────────────────────────────────────────

function LandscapeCard({ item, onClick, dark }: { item: CaseItem; onClick: (c: CaseItem) => void; dark?: boolean }) {
  const { ref, iframeRef, tilt, active, inView, preview, onMouseMove, onMouseEnter, onMouseLeave, onIframeLoad } = useCardInteractions(6);

  return (
    <div
      ref={ref}
      onClick={() => onClick(item)}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        flexShrink: 0, width: 292, borderRadius: 18, overflow: 'hidden', cursor: 'pointer',
        transform: `perspective(900px) rotateX(${tilt.x * 0.55}deg) rotateY(${tilt.y * 0.55}deg) scale(${active ? 1.025 : 1})`,
        transition: active ? 'transform 0.08s ease, box-shadow 0.15s ease' : 'transform 0.55s cubic-bezier(0.23,1,0.32,1), box-shadow 0.4s ease',
        boxShadow: active ? `0 20px 48px rgba(0,0,0,${dark ? 0.6 : 0.28})` : `0 6px 20px rgba(0,0,0,${dark ? 0.4 : 0.14})`,
        willChange: 'transform',
      }}
    >
      <div style={{ width: '100%', aspectRatio: '16/9', position: 'relative', overflow: 'hidden', background: '#111' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${ytThumb(item.youtubeId)})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          transition: 'opacity 0.4s ease', opacity: preview ? 0 : 1,
        }} />

        {inView && (
          <div style={{ position: 'absolute', inset: 0, opacity: preview ? 1 : 0, transition: 'opacity 0.4s ease' }}>
            <iframe
              ref={iframeRef}
              src={ytPreview(item.youtubeId)}
              allow="autoplay; encrypted-media"
              onLoad={onIframeLoad}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none', pointerEvents: 'none' }}
            />
          </div>
        )}

        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.72) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(circle at ${50 + tilt.y * 4}% ${50 - tilt.x * 4}%, rgba(255,255,255,0.09) 0%, transparent 65%)`, transition: 'background 0.08s ease' }} />
        {item.duration && <div style={{ position: 'absolute', bottom: 10, right: 10, color: 'rgba(255,255,255,0.55)', fontSize: 10, fontWeight: 500 }}>{item.duration}</div>}
        <div style={{ position: 'absolute', bottom: 10, left: 10, color: 'rgba(255,255,255,0.35)', fontSize: 9, display: 'flex', alignItems: 'center', gap: 3 }}><Eye size={9} /> {item.views}</div>
      </div>

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

// ─── Bento Card ───────────────────────────────────────────────────────────────

function BentoCard({ item, onClick }: { item: CaseItem; onClick: (c: CaseItem) => void }) {
  const { ref, iframeRef, tilt, active, inView, preview, onMouseMove, onMouseEnter, onMouseLeave, onIframeLoad } = useCardInteractions(7);

  return (
    <div
      ref={ref}
      onClick={() => onClick(item)}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        width: '100%', height: '100%', borderRadius: 18,
        overflow: 'hidden', cursor: 'pointer', position: 'relative', background: '#111',
        transform: `perspective(800px) rotateX(${tilt.x * 0.7}deg) rotateY(${tilt.y * 0.7}deg) scale(${active ? 1.02 : 1})`,
        transition: active ? 'transform 0.08s ease, box-shadow 0.15s ease' : 'transform 0.55s cubic-bezier(0.23,1,0.32,1), box-shadow 0.4s ease',
        boxShadow: active ? '0 18px 40px rgba(0,0,0,0.32)' : '0 6px 20px rgba(0,0,0,0.16)',
        willChange: 'transform',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${ytThumb(item.youtubeId)})`, backgroundSize: 'cover', backgroundPosition: 'center', transition: 'opacity 0.4s ease', opacity: preview ? 0 : 1 }} />

      {inView && (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', opacity: preview ? 1 : 0, transition: 'opacity 0.4s ease' }}>
          <iframe
            ref={iframeRef}
            src={ytPreview(item.youtubeId)}
            allow="autoplay; encrypted-media"
            onLoad={onIframeLoad}
            style={{ position: 'absolute', top: '50%', left: '50%', width: '177.8%', height: '177.8%', transform: 'translate(-50%,-50%)', border: 'none', pointerEvents: 'none' }}
          />
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
  const router = useRouter();
  const [a, b, c] = section.cases;
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(28px)', transition: 'opacity 0.55s ease, transform 0.55s cubic-bezier(0.16,1,0.3,1)' }}>
      <div style={{ padding: '0 16px', marginBottom: 16, position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <span style={{ position: 'absolute', left: 12, bottom: -6, fontSize: 88, fontWeight: 900, lineHeight: 1, letterSpacing: '-0.04em', userSelect: 'none', pointerEvents: 'none', color: 'rgba(0,0,0,0.04)' }}>{section.num}</span>
        <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.03em', color: '#0D0D0D', position: 'relative' }}>{section.genre}</span>
        <button
          onClick={() => router.push(`/browse/${section.id}`)}
          style={{ position: 'relative', zIndex: 1, fontSize: 12, fontWeight: 600, color: '#0D0D0D', background: 'rgba(0,0,0,0.06)', border: 'none', cursor: 'pointer', padding: '5px 12px', borderRadius: 100, letterSpacing: '-0.01em' }}
        >
          Все →
        </button>
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
  const router = useRouter();
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(28px)', transition: 'opacity 0.55s ease, transform 0.55s cubic-bezier(0.16,1,0.3,1)', paddingTop: section.dark ? 28 : 0, paddingBottom: section.dark ? 28 : 0, background: section.dark ? '#0D0D0D' : 'transparent' }}>
      <div style={{ padding: '0 16px', marginBottom: 16, position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <span style={{ position: 'absolute', left: 12, bottom: -6, fontSize: 88, fontWeight: 900, lineHeight: 1, letterSpacing: '-0.04em', userSelect: 'none', pointerEvents: 'none', color: section.dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)' }}>{section.num}</span>
        <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.03em', color: section.dark ? '#fff' : '#0D0D0D', position: 'relative' }}>{section.genre}</span>
        <button
          onClick={() => router.push(`/browse/${section.id}`)}
          style={{ position: 'relative', zIndex: 1, fontSize: 12, fontWeight: 600, color: section.dark ? 'rgba(255,255,255,0.7)' : '#0D0D0D', background: section.dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', border: 'none', cursor: 'pointer', padding: '5px 12px', borderRadius: 100, letterSpacing: '-0.01em' }}
        >
          Все →
        </button>
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

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function HomePage() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState('feed');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  const openCase = useCallback((item: CaseItem) => {
    router.push('/case/' + item.id);
  }, [router]);

  return (
    <>
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
          <HeroCarousel items={HERO_ITEMS} onCaseClick={openCase} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 34 }}>
          {SECTIONS.map((section, i) => (
            <>
              {i === 2 && <Ticker key="ticker" />}
              {section.layout === 'bento'
                ? <BentoSection key={section.id} section={section} onCaseClick={openCase} />
                : <SectionRow key={section.id} section={section} onCaseClick={openCase} />
              }
            </>
          ))}
        </div>
      </main>

      <BottomNav active={activeNav} onChange={setActiveNav} />
    </>
  );
}
