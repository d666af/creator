"use client";

import { Bell } from "lucide-react";
import { useRole } from "@/lib/role-context";
import { BottomNav } from "./bottom-nav";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { role, setRole, accent } = useRole();

  return (
    <div className="min-h-screen bg-black">
      {/* Top bar */}
      <header
        className="sticky top-0 z-40 glass bg-black/70 border-b border-white/[0.06]"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-2 px-4 py-3">
          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-xl text-sm font-extrabold text-white"
              style={{
                background:
                  role === "creator"
                    ? "linear-gradient(135deg, #BF5AF2, #FF2D55)"
                    : "linear-gradient(135deg, #0A84FF, #5E5CE6)",
              }}
            >
              CH
            </div>
            <span className="hidden text-[15px] font-bold text-white sm:block">
              Creators Hub
            </span>
          </div>

          {/* Role switcher */}
          <div className="flex items-center rounded-full bg-[#1C1C1E] p-0.5 border border-white/[0.06]">
            <button
              onClick={() => setRole("creator")}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-all",
                role === "creator" ? "text-white" : "text-[rgba(235,235,245,0.5)]"
              )}
              style={role === "creator" ? { backgroundColor: "#BF5AF2" } : undefined}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: role === "creator" ? "#fff" : "#BF5AF2" }}
              />
              Creator
            </button>
            <button
              onClick={() => setRole("b2b")}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-all",
                role === "b2b" ? "text-white" : "text-[rgba(235,235,245,0.5)]"
              )}
              style={role === "b2b" ? { backgroundColor: "#0A84FF" } : undefined}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: role === "b2b" ? "#fff" : "#0A84FF" }}
              />
              B2B
            </button>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2 shrink-0">
            <button className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#1C1C1E] border border-white/[0.06]">
              <Bell size={17} className="text-white" />
              <span
                className="absolute right-2 top-2 h-2 w-2 rounded-full"
                style={{ backgroundColor: accent }}
              />
            </button>
            <div
              className="h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{
                background:
                  role === "creator"
                    ? "linear-gradient(135deg, #BF5AF2, #FF2D55)"
                    : "linear-gradient(135deg, #0A84FF, #5E5CE6)",
              }}
            >
              {role === "creator" ? "JY" : "MU"}
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-2xl pb-safe animate-fade-in">{children}</main>

      <BottomNav />
    </div>
  );
}
