"use client";

import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockHackathons } from "@/lib/mock-data";
import { Trophy, Clock, Users, Award } from "lucide-react";

export default function HackathonsPage() {
  const active = mockHackathons.filter((h) => h.status === "active");
  const finished = mockHackathons.filter((h) => h.status === "finished");
  const featured = active[0];
  const rest = active.slice(1);

  return (
    <AppShell>
      <div className="px-4 pt-4">
        <h1 className="text-2xl font-extrabold text-white">Hackatonlar 🏆</h1>
        <p className="mt-1 text-sm text-[rgba(235,235,245,0.6)]">
          Иштирок этинг, ютинг ва портфолио тўпланг
        </p>

        {/* Featured hero */}
        {featured && (
          <div className="relative mt-4 overflow-hidden rounded-[24px] p-5"
            style={{ background: "linear-gradient(135deg, #2C2C2E 0%, #1C1C1E 100%)" }}
          >
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-[#FFD60A]/15 blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-2">
                <Badge variant="warning">
                  <Trophy size={11} /> Featured
                </Badge>
                <Badge variant="creator">{featured.category}</Badge>
              </div>
              <h2 className="mt-3 text-xl font-extrabold leading-tight text-white">{featured.title}</h2>
              <p className="mt-1.5 line-clamp-2 text-sm text-[rgba(235,235,245,0.6)]">{featured.brief}</p>

              <div className="mt-4 flex items-center gap-2">
                <Award size={28} className="text-[#FFD60A]" />
                <div>
                  <div className="text-[11px] text-[rgba(235,235,245,0.5)]">Совриндор фонди</div>
                  <div className="text-lg font-extrabold text-[#FFD60A]">{featured.prizeAmount}</div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-4 text-xs text-[rgba(235,235,245,0.6)]">
                <span className="flex items-center gap-1">
                  <Clock size={13} /> {featured.hoursLeft} соат қолди
                </span>
                <span className="flex items-center gap-1">
                  <Users size={13} /> {featured.participants} иштирокчи
                </span>
              </div>

              <Button variant="primary" size="md" className="mt-4 w-full">
                Иштирок этиш
              </Button>
            </div>
          </div>
        )}

        {/* Active */}
        <h2 className="mb-3 mt-7 text-[17px] font-bold text-white">Актив hackatonlar</h2>
        <div className="flex flex-col gap-3">
          {rest.map((h) => (
            <div key={h.id} className="rounded-2xl border border-white/[0.08] bg-[#1C1C1E] p-4">
              <div className="flex items-start gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-bold text-white"
                  style={{ backgroundColor: h.sponsorColor }}
                >
                  {h.sponsorInitials}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-[15px] font-semibold leading-snug text-white">{h.title}</h3>
                  <span className="text-xs text-[rgba(235,235,245,0.5)]">{h.sponsor}</span>
                </div>
                <Badge variant="creator">{h.category}</Badge>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-[rgba(235,235,245,0.5)]">Совриндор</div>
                  <div className="text-lg font-extrabold text-[#FFD60A]">{h.prizeAmount}</div>
                </div>
                <div className="text-right text-xs text-[rgba(235,235,245,0.6)]">
                  <div className="flex items-center justify-end gap-1">
                    <Clock size={12} /> {h.hoursLeft} соат
                  </div>
                  <div className="mt-1 flex items-center justify-end gap-1">
                    <Users size={12} /> {h.participants}
                  </div>
                </div>
              </div>

              <Button variant="accent-creator" size="sm" className="mt-3 w-full">
                Батафсил
              </Button>
            </div>
          ))}
        </div>

        {/* Finished */}
        {finished.length > 0 && (
          <>
            <h2 className="mb-3 mt-7 text-[17px] font-bold text-white">Тугаган</h2>
            <div className="flex flex-col gap-2.5">
              {finished.map((h) => (
                <div key={h.id} className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-[#1C1C1E] p-3 opacity-80">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-xs font-bold text-white"
                    style={{ backgroundColor: h.sponsorColor }}
                  >
                    {h.sponsorInitials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-white">{h.title}</div>
                    <div className="flex items-center gap-1 text-xs text-[#FFD60A]">
                      <Trophy size={11} /> Ғолиб: {h.winner}
                    </div>
                  </div>
                  <Badge variant="default">Тугади</Badge>
                </div>
              ))}
            </div>
          </>
        )}
        <div className="h-4" />
      </div>
    </AppShell>
  );
}
