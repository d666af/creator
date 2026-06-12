'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Home, Users, Briefcase, User } from 'lucide-react';

const NAV = [
  { id: 'feed',     label: 'Лента',   Icon: Home,      href: '/' },
  { id: 'creators', label: 'Авторы',  Icon: Users,     href: '/creators' },
  { id: 'projects', label: 'Проекты', Icon: Briefcase, href: '/projects' },
  { id: 'profile',  label: 'Профиль', Icon: User,      href: '/profile' },
] as const;

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const activeId = NAV.find(n => n.href === pathname)?.id ?? 'feed';

  return (
    <nav style={{
      position: 'fixed', bottom: 14, left: 12, right: 12, zIndex: 100,
      background: 'rgba(14,14,14,0.9)', backdropFilter: 'blur(28px)',
      WebkitBackdropFilter: 'blur(28px)', borderRadius: 28, padding: '6px 6px',
      display: 'flex',
      boxShadow: '0 12px 48px rgba(0,0,0,0.4), inset 0 0.5px 0 rgba(255,255,255,0.07)',
    }}>
      {NAV.map(({ id, label, Icon, href }) => {
        const on = activeId === id;
        return (
          <button
            key={id}
            onClick={() => router.push(href)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              border: 'none', background: on ? 'rgba(255,255,255,0.08)' : 'transparent',
              borderRadius: 22, padding: '8px 0', cursor: 'pointer',
              transition: 'background 0.2s ease',
            }}
          >
            <Icon size={21} color={on ? '#fff' : 'rgba(255,255,255,0.3)'} strokeWidth={on ? 2 : 1.5} />
            <span style={{ fontSize: 9.5, fontWeight: on ? 600 : 400, color: on ? '#fff' : 'rgba(255,255,255,0.3)' }}>
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
