"use client";

import { useRole } from "@/lib/role-context";
import { BottomNav } from "./bottom-nav";
import { Bell } from "lucide-react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { role, setRole } = useRole();

  return (
    <div style={{ minHeight: "100svh", background: "#F7F6F2" }}>
      <header style={{
        position: "sticky", top: 0, zIndex: 40,
        background: "#FFFFFF",
        borderBottom: "1px solid #E8E5DF",
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px", height: 52,
      }}>
        <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.02em", color: "#1A1A18" }}>
          Creators Hub
        </span>

        <div style={{ display: "flex", gap: 4, background: "#F0EDE8", borderRadius: 8, padding: 3 }}>
          {(["creator", "b2b"] as const).map((r) => (
            <button key={r} onClick={() => setRole(r)} style={{
              padding: "5px 14px", borderRadius: 6, fontSize: 13, fontWeight: 600,
              background: role === r ? "#fff" : "transparent",
              color: role === r ? "#1A1A18" : "#9A9590",
              boxShadow: role === r ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              border: "none", cursor: "pointer",
              transition: "all 0.15s",
            }}>
              {r === "creator" ? "Creator" : "B2B"}
            </button>
          ))}
        </div>

        <button style={{
          width: 34, height: 34, borderRadius: "50%",
          background: "#F0EDE8", border: "none",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", position: "relative",
        }}>
          <Bell size={16} color="#1A1A18" strokeWidth={1.8} />
          <span style={{
            position: "absolute", top: 7, right: 7,
            width: 6, height: 6, borderRadius: "50%",
            background: "#C4975A", border: "2px solid #fff",
          }} />
        </button>
      </header>

      <main style={{
        maxWidth: 640, margin: "0 auto",
        paddingBottom: "calc(60px + env(safe-area-inset-bottom))",
      }}>
        {children}
      </main>

      <BottomNav />
    </div>
  );
}
