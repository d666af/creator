"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRole } from "@/lib/role-context";
import {
  Home,
  Compass,
  PlusCircle,
  Trophy,
  User,
  BarChart2,
  Search,
  FileText,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const creatorTabs = [
  { href: "/", label: "Asosiy", icon: Home },
  { href: "/specialists", label: "Kashf", icon: Compass },
  { href: "/feed", label: "Post", icon: PlusCircle, center: true },
  { href: "/hackathons", label: "Challenge", icon: Trophy },
  { href: "/profile/jasur-yusupov", label: "Profil", icon: User },
];

const b2bTabs = [
  { href: "/", label: "Umumiy", icon: BarChart2 },
  { href: "/specialists", label: "Qidiruv", icon: Search },
  { href: "/jobs", label: "Vakansiya", icon: PlusCircle, center: true },
  { href: "/jobs", label: "Otkliklar", icon: FileText },
  { href: "/profile/company", label: "Kompaniya", icon: Building2 },
];

export function BottomNav() {
  const { role, accent } = useRole();
  const pathname = usePathname();
  const tabs = role === "creator" ? creatorTabs : b2bTabs;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass bg-black/80 border-t border-white/[0.08]">
      <div
        className="mx-auto flex max-w-2xl items-center justify-around px-2 pt-2"
        style={{ paddingBottom: "calc(8px + env(safe-area-inset-bottom))" }}
      >
        {tabs.map((tab, i) => {
          const Icon = tab.icon;
          const active = pathname === tab.href;

          if (tab.center) {
            return (
              <Link
                key={i}
                href={tab.href}
                aria-label={tab.label}
                className="-mt-6 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform active:scale-90"
                style={{
                  background:
                    role === "creator"
                      ? "linear-gradient(135deg, #BF5AF2, #FF2D55)"
                      : "linear-gradient(135deg, #0A84FF, #5E5CE6)",
                }}
              >
                <Icon size={28} className="text-white" strokeWidth={2} />
              </Link>
            );
          }

          return (
            <Link
              key={i}
              href={tab.href}
              className="flex flex-1 flex-col items-center gap-1 py-1"
            >
              <Icon
                size={24}
                strokeWidth={active ? 2.4 : 2}
                style={{ color: active ? accent : "rgba(235,235,245,0.4)" }}
              />
              <span
                className={cn("text-[10px] font-medium")}
                style={{ color: active ? accent : "rgba(235,235,245,0.4)" }}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
