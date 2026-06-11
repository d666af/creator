"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRole } from "@/lib/role-context";
import {
  Home,
  Briefcase,
  Plus,
  ShoppingBag,
  User,
  BarChart2,
  Search,
  FileText,
  Building2,
} from "lucide-react";

const creatorTabs = [
  { href: "/",                         label: "Лента",   icon: Home        },
  { href: "/jobs",                     label: "Биржа",   icon: Briefcase   },
  { href: "/new",                      label: "",        icon: Plus, center: true },
  { href: "/hackathons",               label: "Маркет",  icon: ShoppingBag },
  { href: "/profile/jasur-yusupov",    label: "Профиль", icon: User        },
];

const b2bTabs = [
  { href: "/",           label: "Главная",  icon: BarChart2  },
  { href: "/specialists",label: "Поиск",    icon: Search     },
  { href: "/new",        label: "",         icon: Plus, center: true },
  { href: "/jobs",       label: "Вакансии", icon: FileText   },
  { href: "/profile/company", label: "Компания", icon: Building2 },
];

export function BottomNav() {
  const { role } = useRole();
  const pathname = usePathname();
  const tabs = role === "creator" ? creatorTabs : b2bTabs;
  const accent = role === "creator" ? "#A07850" : "#2563EB";

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        backgroundColor: "rgba(255,255,255,0.94)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        borderTop: "1px solid rgba(0,0,0,0.07)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="mx-auto flex max-w-2xl items-center justify-around px-2 h-[56px]">
        {tabs.map((tab, i) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;

          if ((tab as any).center) {
            return (
              <Link key={i} href={tab.href} className="flex items-center justify-center">
                <div
                  className="-mt-5 flex h-[50px] w-[50px] items-center justify-center rounded-full shadow-lg transition-transform active:scale-90"
                  style={{ backgroundColor: accent }}
                >
                  <Icon size={22} color="#FFFFFF" strokeWidth={2.5} />
                </div>
              </Link>
            );
          }

          return (
            <Link
              key={i}
              href={tab.href}
              className="flex min-w-[52px] flex-col items-center gap-[3px] py-1"
            >
              <Icon
                size={22}
                color={isActive ? accent : "#B0A99F"}
                strokeWidth={isActive ? 2.5 : 1.8}
              />
              <span
                className="text-[10px] font-medium"
                style={{ color: isActive ? accent : "#B0A99F" }}
              >
                {(tab as any).label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
