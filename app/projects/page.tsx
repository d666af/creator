'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, MapPin, Clock, Users, ChevronRight, Zap } from 'lucide-react';
import { ALL_CASES, JOB_POSTINGS, ytThumb, type JobPosting } from '@/lib/data';
import { BottomNav } from '@/app/components/BottomNav';

// ── Showcase data (top cases from each section) ────────────────────────────────

const SHOWCASE = ALL_CASES.filter((_, i) => i % 3 === 0).slice(0, 14);

// ── Filter chip ────────────────────────────────────────────────────────────────

const JOB_TYPES = ['Все', ...Array.from(new Set(JOB_POSTINGS.map(j => j.type)))];

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{
        flexShrink: 0, height: 34, padding: '0 14px', borderRadius: 100, border: 'none',
        background: active ? '#111' : 'rgba(0,0,0,0.065)', cursor: 'pointer',
        display: 'flex', alignItems: 'center',
        transition: 'background 0.16s ease, transform 0.12s cubic-bezier(0.16,1,0.3,1)',
        transform: pressed ? 'scale(0.95)' : active ? 'scale(1.02)' : 'scale(1)',
      }}
    >
      <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '-0.02em', color: active ? '#fff' : '#3A3A3A', whiteSpace: 'nowrap' }}>
        {label}
      </span>
    </button>
  );
}

// ── Showcase card (horizontal) ─────────────────────────────────────────────────

function ShowcaseCard({ c, onClick }: { c: typeof ALL_CASES[0]; onClick: () => void }) {
  const [imgOk, setImgOk] = useState(true);
  return (
    <div
      onClick={onClick}
      style={{ flexShrink: 0, width: 190, borderRadius: 18, overflow: 'hidden', background: '#1A1A1A', cursor: 'pointer', position: 'relative' }}
    >
      <div style={{ aspectRatio: '16/9', position: 'relative', overflow: 'hidden' }}>
        {imgOk
          ? <img src={ytThumb(c.youtubeId)} alt={c.title} onError={() => setImgOk(false)}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          : <div style={{ width: '100%', height: '100%', background: c.avatarColor + '33' }} />
        }
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 55%)' }} />
        <div style={{ position: 'absolute', bottom: 8, left: 10, right: 10 }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.25 }}
            className="line-clamp-2">{c.title}</div>
        </div>
      </div>
      <div style={{ padding: '9px 10px 11px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 20, height: 20, borderRadius: '50%', background: c.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 7, fontWeight: 800, color: '#fff' }}>{c.initials}</div>
          <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.6)', letterSpacing: '-0.01em' }}>{c.creator.split(' ')[0]}</span>
        </div>
        <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.35)' }}>{c.views}</span>
      </div>
    </div>
  );
}

// ── Job card (vertical) ────────────────────────────────────────────────────────

function JobCard({ job, index }: { job: JobPosting; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [applying, setApplying] = useState(false);

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
      style={{
        borderRadius: 20, background: '#111', padding: '18px 18px 16px',
        boxShadow: '0 8px 28px rgba(0,0,0,0.14)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(18px)',
        transition: `opacity 0.45s ease ${index * 70}ms, transform 0.45s cubic-bezier(0.16,1,0.3,1) ${index * 70}ms`,
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* background glow */}
      <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: `radial-gradient(circle, ${job.brandColor}40 0%, transparent 70%)`, pointerEvents: 'none' }} />

      {/* top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 13, marginBottom: 14, position: 'relative' }}>
        <div style={{ width: 46, height: 46, borderRadius: 14, background: job.brandColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff', flexShrink: 0, letterSpacing: '-0.02em' }}>
          {job.brandInitials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5, flexWrap: 'wrap' }}>
            {job.isNew && (
              <span style={{ fontSize: 8.5, fontWeight: 800, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#fff', background: '#16A34A', borderRadius: 100, padding: '2px 7px' }}>Новое</span>
            )}
            {job.isUrgent && (
              <span style={{ fontSize: 8.5, fontWeight: 800, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#fff', background: '#DC2626', borderRadius: 100, padding: '2px 7px', display: 'flex', alignItems: 'center', gap: 3 }}>
                <Zap size={7} fill="#fff" stroke="none" />Срочно
              </span>
            )}
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: job.typeColor, background: job.typeColor + '22', borderRadius: 100, padding: '2px 8px' }}>{job.type}</span>
          </div>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.25 }}>{job.title}</div>
          <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.38)', fontWeight: 500, marginTop: 4 }}>{job.brand}</div>
        </div>
      </div>

      {/* meta row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14, position: 'relative' }}>
        <span style={{ fontSize: 18, fontWeight: 900, color: '#fff', letterSpacing: '-0.04em' }}>{job.budget}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11.5, color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>
          <Clock size={10} />{job.deadline}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11.5, color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>
          <MapPin size={10} />{job.city}
        </span>
      </div>

      {/* footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'rgba(255,255,255,0.25)', fontWeight: 500 }}>
          <Users size={10} />{job.applicants} откликов · {job.postedAt}
        </span>
        <button
          onClick={() => setApplying(true)}
          style={{
            height: 34, padding: '0 16px', borderRadius: 100, border: 'none', cursor: 'pointer',
            background: applying ? 'rgba(255,255,255,0.12)' : '#fff',
            display: 'flex', alignItems: 'center', gap: 5,
            transition: 'background 0.2s ease, transform 0.15s cubic-bezier(0.16,1,0.3,1)',
            transform: applying ? 'scale(0.97)' : 'scale(1)',
          }}
        >
          <span style={{ fontSize: 12.5, fontWeight: 800, color: applying ? 'rgba(255,255,255,0.5)' : '#111', letterSpacing: '-0.02em' }}>
            {applying ? 'Отправлено' : 'Откликнуться'}
          </span>
          {!applying && <ChevronRight size={13} color="#111" strokeWidth={2.5} />}
        </button>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function ProjectsPage() {
  const router = useRouter();
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerH, setHeaderH] = useState(0);
  const [selType, setSelType] = useState('Все');

  useEffect(() => {
    const measure = () => { if (headerRef.current) setHeaderH(headerRef.current.offsetHeight); };
    measure();
    const ro = new ResizeObserver(measure);
    if (headerRef.current) ro.observe(headerRef.current);
    return () => ro.disconnect();
  }, []);

  const filteredJobs = selType === 'Все' ? JOB_POSTINGS : JOB_POSTINGS.filter(j => j.type === selType);

  return (
    <div style={{ background: '#F5F5F3', minHeight: '100vh', paddingBottom: 100, paddingTop: headerH }}>

      {/* ── Fixed app bar ── */}
      <div ref={headerRef} style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 20,
        background: 'rgba(245,245,243,0.94)',
        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px 14px' }}>
          <span style={{ fontSize: 22, fontWeight: 900, color: '#111', letterSpacing: '-0.04em' }}>Проекты</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
              <Bell size={16} color="#444" />
              <div style={{ position: 'absolute', top: 8, right: 8, width: 6, height: 6, borderRadius: '50%', background: '#0D0D0D', border: '1.5px solid #F5F5F3' }} />
            </button>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#3A4A5C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>AK</div>
          </div>
        </div>
      </div>

      {/* ── Витрина ── */}
      <div style={{ padding: '16px 0 0' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, padding: '0 16px 12px' }}>
          <span style={{ fontSize: 17, fontWeight: 900, color: '#111', letterSpacing: '-0.035em' }}>Витрина</span>
          <span style={{ fontSize: 11.5, fontWeight: 600, color: 'rgba(0,0,0,0.3)' }}>{SHOWCASE.length} проектов</span>
        </div>
        <div style={{ overflowX: 'auto', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
          <div style={{ display: 'flex', gap: 10, padding: '0 16px 4px' }}>
            {SHOWCASE.map(c => (
              <ShowcaseCard key={c.id} c={c} onClick={() => router.push(`/case/${c.id}`)} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Задания ── */}
      <div style={{ padding: '22px 0 0' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, padding: '0 16px 12px' }}>
          <span style={{ fontSize: 17, fontWeight: 900, color: '#111', letterSpacing: '-0.035em' }}>Задания</span>
          <span style={{ fontSize: 11.5, fontWeight: 600, color: 'rgba(0,0,0,0.3)' }}>{filteredJobs.length} открытых</span>
        </div>

        {/* Type filter chips */}
        <div style={{ overflowX: 'auto', scrollbarWidth: 'none', marginBottom: 12 }}>
          <div style={{ display: 'flex', gap: 6, padding: '0 16px' }}>
            {JOB_TYPES.map(t => (
              <FilterChip key={t} label={t} active={selType === t} onClick={() => setSelType(t)} />
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '0 14px' }}>
          {filteredJobs.map((job, i) => (
            <JobCard key={job.id} job={job} index={i} />
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
