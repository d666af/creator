"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRole } from "@/lib/role-context";
import { Home, Briefcase, Plus, ShoppingBag, User } from "lucide-react";

const tabs = [
  { href: "/",                     label: "Лента",   icon: Home        },
  { href: "/jobs",                  label: "Биржа",   icon: Briefcase   },
  { href: "/new",                   label: "",        icon: Plus,        center: true },
  { href: "/hackathons",            label: "Маркет",  icon: ShoppingBag },
  { href: "/profile/jasur-yusupov", label: "Профиль", icon: User        },
];

export function BottomNav() {
  const pathname = usePathname();
  const { role } = useRole();
  const accent = role === "b2b" ? "#2563EB" : "#C4975A";

  return (
    <nav style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
      background: "#fff",
      borderTop: "1px solid #E8E5DF",
      paddingBottom: "env(safe-area-inset-bottom)",
    }}>
      <div style={{
        maxWidth: 640, margin: "0 auto",
        display: "flex", alignItems: "center",
        justifyContent: "space-around", height: 54, padding: "0 8px",
      }}>
        {tabs.map((tab, i) => {
          const active = pathname === tab.href;
          const Icon = tab.icon;
          if ((tab as any).center) return (
            <Link key={i} href={tab.href} style={{ display: "flex" }}>
              <div style={{
                width: 42, height: 42, borderRadius: "50%",
                background: "#1A1A18", marginTop: -14,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon size={19} color="#fff" strokeWidth={2.5} />
              </div>
            </Link>
          );
          return (
            <Link key={i} href={tab.href} style={{
              display: "flex", flexDirection: "column",
              alignItems: "center", gap: 3, minWidth: 50, padding: "4px 0",
            }}>
              <Icon size={21} color={active ? accent : "#B8B4AE"} strokeWidth={active ? 2.3 : 1.8} />
              <span style={{ fontSize: 10, fontWeight: active ? 600 : 400, color: active ? accent : "#B8B4AE" }}>
                {(tab as any).label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
