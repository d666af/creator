"use client";

import { useState } from "react";
import { useRole } from "@/lib/role-context";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockJobs } from "@/lib/mock-data";
import { MapPin, Clock, Plus, X, Flame, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const filters = ["Барчаси", "Reels", "Монтаж", "SMM", "Сценарий", "Продюсер"];

export default function JobsPage() {
  const { role } = useRole();
  const [filter, setFilter] = useState("Барчаси");
  const [applyJob, setApplyJob] = useState<(typeof mockJobs)[number] | null>(null);

  const filtered = mockJobs.filter(
    (j) => filter === "Барчаси" || j.tags.some((t) => t.includes(filter))
  );

  return (
    <AppShell>
      <div className="px-4 pt-4">
        {role === "b2b" && (
          <button
            className="mb-4 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold text-white"
            style={{ background: "linear-gradient(135deg, #0A84FF, #5E5CE6)" }}
          >
            <Plus size={18} /> Вакансия эълон қилиш
          </button>
        )}

        <h1 className="text-2xl font-extrabold text-white">
          {role === "b2b" ? "Менинг вакансияларим" : "Вакансиялар"}
        </h1>

        {/* Filters */}
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "shrink-0 rounded-full px-4 py-1.5 text-[13px] font-semibold transition-colors",
                filter === f ? "bg-white text-black" : "bg-[#1C1C1E] text-[rgba(235,235,245,0.6)] border border-white/[0.08]"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs */}
      <div className="mt-4 flex flex-col gap-3 px-4">
        {filtered.map((job) => (
          <div key={job.id} className="rounded-2xl border border-white/[0.08] bg-[#1C1C1E] p-4">
            <div className="flex items-start gap-3">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl text-xs font-bold text-white"
                style={{ backgroundColor: job.companyColor }}
              >
                {job.companyInitials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">{job.company}</span>
                  {job.isHot && (
                    <Badge variant="error">
                      <Flame size={10} /> Hot
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-[rgba(235,235,245,0.5)]">{job.postedAt}</span>
              </div>
            </div>

            <h3 className="mt-3 text-[15px] font-semibold leading-snug text-white">{job.title}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-[rgba(235,235,245,0.6)]">{job.description}</p>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[rgba(235,235,245,0.5)]">
              <span className="flex items-center gap-1">
                <MapPin size={13} /> {job.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={13} /> {job.schedule}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {job.tags.map((t) => (
                <span key={t} className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[11px] text-[rgba(235,235,245,0.55)]">
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3">
              <div>
                <div className="text-base font-extrabold text-white">{job.budget}</div>
                {role === "b2b" && (
                  <div className="flex items-center gap-1 text-xs text-[#0A84FF]">
                    <Users size={12} /> {job.applicationsCount} отклик
                  </div>
                )}
              </div>
              {role === "creator" ? (
                <Button variant="accent-creator" size="sm" onClick={() => setApplyJob(job)}>
                  Откликнуться
                </Button>
              ) : (
                <Button variant="outline" size="sm">
                  Отклики
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="h-4" />

      {/* Apply bottom sheet */}
      {applyJob && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/60 animate-fade-in" onClick={() => setApplyJob(null)} />
          <div className="relative w-full max-w-2xl rounded-t-[28px] border-t border-white/[0.08] bg-[#1C1C1E] p-5 pb-10 animate-sheet">
            <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-white/20" />
            <button onClick={() => setApplyJob(null)} className="absolute right-4 top-4 text-[rgba(235,235,245,0.5)]">
              <X size={22} />
            </button>
            <h3 className="text-lg font-bold text-white">Откликнуться</h3>
            <p className="mt-0.5 text-sm text-[rgba(235,235,245,0.6)]">{applyJob.title}</p>

            <textarea
              rows={4}
              placeholder="Сопроводительное письмо..."
              className="mt-4 w-full resize-none rounded-2xl border border-white/[0.08] bg-[#2C2C2E] p-3.5 text-sm text-white outline-none placeholder:text-[rgba(235,235,245,0.4)]"
            />
            <div className="mt-2 flex items-center justify-between rounded-2xl border border-white/[0.08] bg-[#2C2C2E] px-4 py-3">
              <span className="text-sm text-[rgba(235,235,245,0.6)]">Портфолио бириктириш</span>
              <Plus size={18} className="text-[#BF5AF2]" />
            </div>
            <Button variant="accent-creator" size="lg" className="mt-4 w-full" onClick={() => setApplyJob(null)}>
              Юбориш
            </Button>
          </div>
        </div>
      )}
    </AppShell>
  );
}
