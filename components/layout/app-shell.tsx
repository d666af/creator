"use client";

import { useRole } from "@/lib/role-context";
import { BottomNav } from "./bottom-nav";
import { Bell } from "lucide-react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { role, setRole } = useRole();

  return (
    <div style={{ minHeight: "100svh", backgroundColor: "#F2F2F7" }}>
      {/* Nav bar */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          height: 52,
          paddingTop: "env(safe-area-inset-top)",
          backgroundColor: "rgba(242,242,247,0.92)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          borderBottom: "0.5px solid rgba(60,60,67,0.18)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          gap: 12,
        }}
      >
        {/* Logo */}
        <span style={{ fontSize: 17, fontWeight: 700, color: "#000", letterSpacing: "-0.03em", minWidth: 28 }}>
          CH
        </span>

        {/* iOS-style segmented control */}
        <div
          style={{
            display: "flex",
            backgroundColor: "rgba(118,118,128,0.12)",
            borderRadius: 9,
            padding: 2,
            gap: 2,
          }}
        >
          {(["creator", "b2b"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              style={{
                padding: "5px 16px",
                borderRadius: 7,
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "-0.01em",
                transition: "all 0.2s",
                backgroundColor: role === r ? "#fff" : "transparent",
                color: role === r ? "#000" : "rgba(60,60,67,0.6)",
                boxShadow: role === r ? "0 1px 4px rgba(0,0,0,0.12), 0 0 0 0.5px rgba(0,0,0,0.04)" : "none",
              }}
            >
              {r === "creator" ? "Creator" : "B2B"}
            </button>
          ))}
        </div>

        {/* Bell */}
        <button
          style={{
            position: "relative",
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            backgroundColor: "rgba(118,118,128,0.12)",
          }}
        >
          <Bell size={17} color="#000" strokeWidth={1.8} />
          <span
            style={{
              position: "absolute",
              top: 6,
              right: 6,
              width: 7,
              height: 7,
              borderRadius: "50%",
              backgroundColor: role === "creator" ? "#AF52DE" : "#007AFF",
              border: "1.5px solid rgba(242,242,247,0.9)",
            }}
          />
        </button>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-2xl animate-fade-in" style={{ paddingBottom: "calc(62px + env(safe-area-inset-bottom))" }}>
        {children}
      </main>

      <BottomNav />
    </div>
  );
}
