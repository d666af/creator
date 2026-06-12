'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, Share2, Edit3, ChevronRight, Bell, Shield, HelpCircle, LogOut, Star, Eye, Briefcase, MapPin, Check } from 'lucide-react';
import { ALL_CASES, ytThumb } from '@/lib/data';
import { BottomNav } from '@/app/components/BottomNav';

// ── Profile data ───────────────────────────────────────────────────────────────

const PROFILE = {
  name: 'Алия Каримова',
  initials: 'AK',
  avatarColor: '#3A4A5C',
  spec: 'Мобилограф',
  city: 'Ташкент',
  isPro: true,
  rating: 4.9,
  totalViews: 892,
  bio: 'Снимаю на телефон так, как другие не снимут на камеру. Fashion и lifestyle контент для брендов Центральной Азии.',
  joinedAt: 'Апрель 2023',
  completedJobs: 34,
  cases: ALL_CASES.filter((_, i) => i % 2 === 0).slice(0, 8),
};

// ── Count-up hook ──────────────────────────────────────────────────────────────

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

// ── Work thumbnail ─────────────────────────────────────────────────────────────

function WorkCard({ c, onClick }: { c: typeof ALL_CASES[0]; onClick: () => void }) {
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
        transition: 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      {imgOk
        ? <img src={ytThumb(c.youtubeId)} alt={c.title} onError={() => setImgOk(false)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        : <div style={{ width: '100%', height: '100%', background: c.avatarColor + '44' }} />
      }
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 50%)' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '8px 10px' }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as React.CSSProperties}>
          {c.title}
        </div>
        <div style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.5)', marginTop: 2, fontWeight: 500 }}>{c.views}</div>
      </div>
    </div>
  );
}

// ── Settings row ───────────────────────────────────────────────────────────────

function SettingsRow({ icon, label, danger, onClick }: { icon: React.ReactNode; label: string; danger?: boolean; onClick?: () => void }) {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 14, width: '100%',
        padding: '14px 18px', background: pressed ? 'rgba(0,0,0,0.04)' : 'transparent',
        border: 'none', cursor: 'pointer', borderRadius: 0,
        transition: 'background 0.12s ease',
      }}
    >
      <div style={{ width: 34, height: 34, borderRadius: 10, background: danger ? 'rgba(220,38,38,0.08)' : 'rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <span style={{ color: danger ? '#DC2626' : '#555' }}>{icon}</span>
      </div>
      <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: danger ? '#DC2626' : '#111', letterSpacing: '-0.02em', textAlign: 'left' }}>{label}</span>
      {!danger && <ChevronRight size={15} color="rgba(0,0,0,0.25)" />}
    </button>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const router = useRouter();
  const [scrollY, setScrollY] = useState(0);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const [shared, setShared] = useState(false);

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

  const headerBlur = Math.min(scrollY / 60, 1);

  return (
    <div style={{ background: '#F5F5F3', minHeight: '100vh', paddingBottom: 100 }}>

      {/* ── Fixed header ── */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 20,
        background: `rgba(${scrollY > 40 ? '245,245,243' : '245,245,243'},${headerBlur * 0.94})`,
        backdropFilter: scrollY > 10 ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: scrollY > 10 ? 'blur(16px)' : 'none',
        borderBottom: scrollY > 40 ? '1px solid rgba(0,0,0,0.05)' : '1px solid transparent',
        transition: 'border-color 0.2s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px' }}>
          <span style={{ fontSize: 17, fontWeight: 900, color: scrollY > 40 ? '#111' : 'transparent', letterSpacing: '-0.035em', transition: 'color 0.2s ease' }}>
            {PROFILE.name.split(' ')[0]}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => { setShared(true); setTimeout(() => setShared(false), 2000); }}
              style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              {shared ? <Check size={15} color="#16A34A" strokeWidth={2.5} /> : <Share2 size={15} color="#444" />}
            </button>
            <button style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Settings size={15} color="#444" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Hero ── */}
      <div style={{ paddingTop: 64, padding: '64px 14px 0' }}>
        <div style={{
          borderRadius: 26, background: '#0D0D0D', padding: '28px 22px 24px',
          position: 'relative', overflow: 'hidden',
          boxShadow: '0 16px 56px rgba(0,0,0,0.22)',
        }}>
          {/* Color glow */}
          <div style={{ position: 'absolute', top: -60, right: -60, width: 280, height: 280, borderRadius: '50%', background: `radial-gradient(circle, ${PROFILE.avatarColor}60 0%, transparent 65%)`, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -80, left: -40, width: 220, height: 220, borderRadius: '50%', background: `radial-gradient(circle, ${PROFILE.avatarColor}25 0%, transparent 65%)`, pointerEvents: 'none' }} />

          {/* Avatar + edit */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                width: 80, height: 80, borderRadius: '50%', background: PROFILE.avatarColor,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em',
                boxShadow: `0 0 0 3px rgba(255,255,255,0.08), 0 8px 28px ${PROFILE.avatarColor}88`,
              }}>
                {PROFILE.initials}
              </div>
              {PROFILE.isPro && (
                <div style={{ position: 'absolute', bottom: 0, right: 0, background: '#fff', borderRadius: 100, padding: '2px 6px', fontSize: 7.5, fontWeight: 900, letterSpacing: '0.08em', color: '#111', border: '1.5px solid #0D0D0D' }}>PRO</div>
              )}
            </div>
            <button style={{ height: 34, padding: '0 14px', borderRadius: 100, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <Edit3 size={12} color="rgba(255,255,255,0.6)" />
              <span style={{ fontSize: 12.5, fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '-0.01em' }}>Редактировать</span>
            </button>
          </div>

          {/* Name + meta */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', marginBottom: 8 }}>{PROFILE.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.1)', borderRadius: 6, padding: '3px 8px' }}>{PROFILE.spec}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>
                <MapPin size={10} />{PROFILE.city}
              </span>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', fontWeight: 500 }}>с {PROFILE.joinedAt}</span>
            </div>
          </div>

          {/* Bio */}
          <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.5)', fontWeight: 500, lineHeight: 1.55, letterSpacing: '-0.01em', margin: 0 }}>
            {PROFILE.bio}
          </p>
        </div>
      </div>

      {/* ── Stats ── */}
      <div
        ref={statsRef}
        style={{ display: 'flex', alignItems: 'center', margin: '12px 14px 0', borderRadius: 20, background: '#fff', padding: '18px 10px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
      >
        <Stat value={PROFILE.totalViews} label="тыс. просмотров" suffix="K" trigger={statsVisible} />
        <div style={{ width: 1, height: 36, background: 'rgba(0,0,0,0.07)' }} />
        <Stat value={PROFILE.completedJobs} label="выполнено" trigger={statsVisible} />
        <div style={{ width: 1, height: 36, background: 'rgba(0,0,0,0.07)' }} />
        <Stat value={PROFILE.rating} label="рейтинг" suffix="★" decimals={1} trigger={statsVisible} />
      </div>

      {/* ── Portfolio ── */}
      <div style={{ padding: '22px 14px 0' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: 17, fontWeight: 900, color: '#111', letterSpacing: '-0.035em' }}>Портфолио</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(0,0,0,0.35)' }}>{PROFILE.cases.length} работ</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {PROFILE.cases.map(c => (
            <WorkCard key={c.id} c={c} onClick={() => router.push(`/case/${c.id}`)} />
          ))}
        </div>
      </div>

      {/* ── Account settings ── */}
      <div style={{ margin: '22px 14px 0', borderRadius: 20, background: '#fff', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <div style={{ padding: '14px 18px 10px' }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(0,0,0,0.35)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Аккаунт</span>
        </div>
        <div style={{ height: 1, background: 'rgba(0,0,0,0.05)', margin: '0 18px' }} />
        <SettingsRow icon={<Bell size={16} />} label="Уведомления" />
        <div style={{ height: 1, background: 'rgba(0,0,0,0.05)', margin: '0 18px' }} />
        <SettingsRow icon={<Shield size={16} />} label="Приватность" />
        <div style={{ height: 1, background: 'rgba(0,0,0,0.05)', margin: '0 18px' }} />
        <SettingsRow icon={<HelpCircle size={16} />} label="Помощь" />
        <div style={{ height: 1, background: 'rgba(0,0,0,0.05)', margin: '0 18px' }} />
        <SettingsRow icon={<LogOut size={16} />} label="Выйти" danger />
      </div>

      {/* ── PRO banner ── */}
      {!PROFILE.isPro && (
        <div style={{ margin: '12px 14px 0', borderRadius: 20, background: '#0D0D0D', padding: '20px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', marginBottom: 4 }}>Стать PRO-автором</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>Больше заданий и видимость</div>
          </div>
          <button style={{ height: 36, padding: '0 16px', borderRadius: 100, background: '#fff', border: 'none', fontSize: 12.5, fontWeight: 800, color: '#111', cursor: 'pointer', letterSpacing: '-0.02em' }}>Подробнее</button>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
