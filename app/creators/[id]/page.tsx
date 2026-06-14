'use client';

import { use, useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Share2, MapPin, Star, Eye, Briefcase, Check } from 'lucide-react';
import { getCreatorProfiles, ytThumb } from '@/lib/data';

// ── Count-up hook ──────────────────────────────────────────────────────────────

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

// ── Stat block ─────────────────────────────────────────────────────────────────

function Stat({ value, label, suffix = '', decimals = 0, trigger }: {
  value: number; label: string; suffix?: string; decimals?: number; trigger: boolean;
}) {
  const count = useCountUp(value * (decimals > 0 ? 10 : 1), trigger, 1100);
  const display = decimals > 0 ? (count / 10).toFixed(1) : count;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
      <span style={{ fontSize: 26, fontWeight: 900, color: '#111', letterSpacing: '-0.04em', lineHeight: 1 }}>
        {display}{suffix}
      </span>
      <span style={{ fontSize: 10.5, fontWeight: 600, color: 'rgba(0,0,0,0.38)', letterSpacing: '-0.01em' }}>{label}</span>
    </div>
  );
}

// ── Work card ──────────────────────────────────────────────────────────────────

function WorkCard({ c, index, onClick }: { c: ReturnType<typeof getCreatorProfiles>[0]['cases'][0]; index: number; onClick: () => void }) {
  const [imgOk, setImgOk] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      onClick={onClick}
      style={{
        borderRadius: 14, overflow: 'hidden', background: '#E8E8E6', cursor: 'pointer',
        aspectRatio: '16/9', position: 'relative',
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.96)',
        transition: `opacity 0.4s ease ${index * 60}ms, transform 0.4s cubic-bezier(0.16,1,0.3,1) ${index * 60}ms`,
      }}
    >
      {imgOk
        ? <img src={ytThumb(c.youtubeId)} alt={c.title} onError={() => setImgOk(false)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        : <div style={{ width: '100%', height: '100%', background: '#333' }} />
      }
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '8px 10px' }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as React.CSSProperties}>
          {c.title}
        </div>
        <div style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.5)', marginTop: 2, fontWeight: 500 }}>{c.views}</div>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function CreatorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const name = decodeURIComponent(id);

  const creator = getCreatorProfiles().find(c => c.name === name);

  const [scrollY, setScrollY] = useState(0);
  const [statsVisible, setStatsVisible] = useState(false);
  const [shared, setShared] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setStatsVisible(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  if (!creator) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#F5F5F3' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#DDD', letterSpacing: '-0.04em' }}>—</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#555', marginTop: 8 }}>Автор не найден</div>
          <button onClick={() => router.back()} style={{ marginTop: 12, fontSize: 13, color: '#888', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Назад</button>
        </div>
      </div>
    );
  }

  const headerVisible = scrollY > 40;

  return (
    <div style={{ background: '#F5F5F3', minHeight: '100vh', paddingBottom: 40 }}>

      {/* ── Fixed header ── */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 20,
        background: headerVisible ? 'rgba(245,245,243,0.94)' : 'transparent',
        backdropFilter: headerVisible ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: headerVisible ? 'blur(16px)' : 'none',
        borderBottom: headerVisible ? '1px solid rgba(0,0,0,0.05)' : '1px solid transparent',
        transition: 'background 0.25s ease, border-color 0.25s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px' }}>
          <button
            onClick={() => router.back()}
            style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', background: headerVisible ? 'rgba(0,0,0,0.06)' : 'rgba(0,0,0,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.2s ease' }}
          >
            <ArrowLeft size={17} color="#fff" />
          </button>
          <span style={{ fontSize: 15, fontWeight: 800, color: headerVisible ? '#111' : 'transparent', letterSpacing: '-0.03em', transition: 'color 0.25s ease' }}>
            {creator.name.split(' ')[0]}
          </span>
          <button
            onClick={() => { setShared(true); setTimeout(() => setShared(false), 2000); }}
            style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', background: headerVisible ? 'rgba(0,0,0,0.06)' : 'rgba(0,0,0,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.2s ease' }}
          >
            {shared ? <Check size={15} color="#16A34A" strokeWidth={2.5} /> : <Share2 size={15} color={headerVisible ? '#444' : '#fff'} />}
          </button>
        </div>
      </div>

      {/* ── Hero ── */}
      <div style={{ padding: '64px 14px 0' }}>
        <div style={{
          borderRadius: 26, background: '#0D0D0D', padding: '28px 22px 24px',
          position: 'relative', overflow: 'hidden',
          boxShadow: '0 16px 56px rgba(0,0,0,0.22)',
        }}>
          <div style={{ position: 'absolute', top: -60, right: -60, width: 280, height: 280, borderRadius: '50%', background: `radial-gradient(circle, ${creator.avatarColor}60 0%, transparent 65%)`, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -80, left: -40, width: 220, height: 220, borderRadius: '50%', background: `radial-gradient(circle, ${creator.avatarColor}25 0%, transparent 65%)`, pointerEvents: 'none' }} />

          {/* Avatar */}
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: 18 }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%', background: creator.avatarColor,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em',
              boxShadow: `0 0 0 3px rgba(255,255,255,0.08), 0 8px 28px ${creator.avatarColor}88`,
            }}>
              {creator.initials}
            </div>
            {creator.isPro && (
              <div style={{ position: 'absolute', bottom: 0, right: 0, background: '#fff', borderRadius: 100, padding: '2px 6px', fontSize: 7.5, fontWeight: 900, letterSpacing: '0.08em', color: '#111', border: '1.5px solid #0D0D0D' }}>PRO</div>
            )}
          </div>

          {/* Name + meta */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', marginBottom: 8 }}>{creator.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.1)', borderRadius: 6, padding: '3px 8px' }}>{creator.spec}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>
                <MapPin size={10} />{creator.city}
              </span>
            </div>
          </div>

          {/* Mini stats inside hero */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>
              <Eye size={11} />{creator.totalViews}K просмотров
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>
              <Briefcase size={11} />{creator.caseCount} работ
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>
              <Star size={11} fill="rgba(255,255,255,0.4)" stroke="none" />{creator.rating.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div
        ref={statsRef}
        style={{ display: 'flex', alignItems: 'center', margin: '12px 14px 0', borderRadius: 20, background: '#fff', padding: '18px 10px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
      >
        <Stat value={creator.totalViews} label="тыс. просмотров" suffix="K" trigger={statsVisible} />
        <div style={{ width: 1, height: 36, background: 'rgba(0,0,0,0.07)' }} />
        <Stat value={creator.caseCount} label="работ" trigger={statsVisible} />
        <div style={{ width: 1, height: 36, background: 'rgba(0,0,0,0.07)' }} />
        <Stat value={creator.rating} label="рейтинг" suffix="★" decimals={1} trigger={statsVisible} />
      </div>

      {/* ── Portfolio ── */}
      <div style={{ padding: '22px 14px 0' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: 17, fontWeight: 900, color: '#111', letterSpacing: '-0.035em' }}>Работы</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(0,0,0,0.35)' }}>{creator.cases.length} видео</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {creator.cases.map((c, i) => (
            <WorkCard key={c.id} c={c} index={i} onClick={() => router.push(`/case/${c.id}`)} />
          ))}
        </div>
      </div>

    </div>
  );
}
