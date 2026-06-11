"use client";

import { useRole } from "@/lib/role-context";
import { BottomNav } from "./bottom-nav";
import { Bell } from "lucide-react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { role, setRole } = useRole();

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5F4F0" }}>
      {/* Top bar */}
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-4"
        style={{
          height: "56px",
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid rgba(0,0,0,0.07)",
          paddingTop: "env(safe-area-inset-top)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-xl text-[13px] font-extrabold text-white"
            style={{ backgroundColor: "#1C1A17" }}
          >
            CH
          </div>
        </div>

        {/* Role switcher */}
        <div
          className="flex rounded-full p-[3px]"
          style={{ backgroundColor: "#EDECE8" }}
        >
          <button
            onClick={() => setRole("creator")}
            className="rounded-full px-4 py-[7px] text-[13px] font-semibold transition-all duration-200"
            style={{
              backgroundColor: role === "creator" ? "#A07850" : "transparent",
              color: role === "creator" ? "#FFFFFF" : "#74706A",
            }}
          >
            Creator
          </button>
          <button
            onClick={() => setRole("b2b")}
            className="rounded-full px-4 py-[7px] text-[13px] font-semibold transition-all duration-200"
            style={{
              backgroundColor: role === "b2b" ? "#2563EB" : "transparent",
              color: role === "b2b" ? "#FFFFFF" : "#74706A",
            }}
          >
            B2B
          </button>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2.5">
          <button
            className="relative flex h-9 w-9 items-center justify-center rounded-full"
            style={{ backgroundColor: "#F5F4F0" }}
          >
            <Bell size={18} color="#1C1A17" strokeWidth={1.8} />
            <span
              className="absolute right-2 top-2 h-[7px] w-[7px] rounded-full"
              style={{ backgroundColor: "#A07850" }}
            />
          </button>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full text-[12px] font-bold"
            style={{ backgroundColor: "#F0E6D8", color: "#A07850" }}
          >
            {role === "creator" ? "JY" : "MU"}
          </button>
        </div>
      </header>

      {/* Page content */}
      <main
        className="mx-auto max-w-2xl animate-fade-in"
        style={{ paddingBottom: "calc(68px + env(safe-area-inset-bottom))" }}
      >
        {children}
      </main>

      <BottomNav />
    </div>
  );
}
