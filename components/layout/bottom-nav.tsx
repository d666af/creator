"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRole } from "@/lib/role-context";
import { Home, Briefcase, Plus, ShoppingBag, User, BarChart2, Search, FileText, Building2 } from "lucide-react";

const creatorTabs = [
  { href: "/",                      label: "Лента",   icon: Home        },
  { href: "/jobs",                   label: "Биржа",   icon: Briefcase   },
  { href: "/new",                    label: "",        icon: Plus,        center: true },
  { href: "/hackathons",             label: "Маркет",  icon: ShoppingBag },
  { href: "/profile/jasur-yusupov",  label: "Профиль", icon: User        },
];

const b2bTabs = [
  { href: "/",            label: "Главная",  icon: BarChart2  },
  { href: "/specialists", label: "Поиск",    icon: Search     },
  { href: "/new",         label: "",         icon: Plus,       center: true },
  { href: "/jobs",        label: "Вакансии", icon: FileText   },
  { href: "/profile/company", label: "Профиль", icon: Building2 },
];

export function BottomNav() {
  const { role } = useRole();
  const pathname = usePathname();
  const tabs = role === "creator" ? creatorTabs : b2bTabs;
  const accent = role === "creator" ? "#AF52DE" : "#007AFF";

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: "rgba(249,249,249,0.94)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        borderTop: "0.5px solid rgba(60,60,67,0.18)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div
        style={{
          maxWidth: 672,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          height: 50,
          padding: "0 8px",
        }}
      >
        {tabs.map((tab, i) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;

          if ((tab as any).center) {
            return (
              <Link key={i} href={tab.href} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    backgroundColor: accent,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: -16,
                    boxShadow: `0 4px 14px ${accent}55`,
                  }}
                >
                  <Icon size={20} color="#fff" strokeWidth={2.5} />
                </div>
              </Link>
            );
          }

          return (
            <Link
              key={i}
              href={tab.href}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, minWidth: 52, padding: "4px 0" }}
            >
              <Icon
                size={22}
                color={isActive ? accent : "rgba(60,60,67,0.35)"}
                strokeWidth={isActive ? 2.5 : 1.8}
              />
              <span style={{ fontSize: 10, fontWeight: isActive ? 600 : 400, color: isActive ? accent : "rgba(60,60,67,0.35)" }}>
                {(tab as any).label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
