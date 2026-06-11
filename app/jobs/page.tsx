"use client";
import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { mockJobs, mockCreators } from "@/lib/mock-data";
import { Search, MapPin, Clock, Plus, X, Check, ChevronRight, Briefcase, Star } from "lucide-react";

type FilterType = "all" | "Мобилография" | "Монтаж" | "Сценарий" | "SMM" | "Продюсер";

export default function JobsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [selectedJob, setSelectedJob] = useState(mockJobs[0]);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedWorks, setSelectedWorks] = useState<string[]>([]);
  const [coverLetter, setCoverLetter] = useState("");
  const [applied, setApplied] = useState(false);

  const filters: FilterType[] = ["all", "Мобилография", "Монтаж", "Сценарий", "SMM", "Продюсер"];
  const filterLabels: Record<FilterType, string> = {
    all: "Все направления",
    Мобилография: "Мобилография",
    Монтаж: "Монтаж",
    Сценарий: "Сценарий",
    SMM: "SMM",
    Продюсер: "Продюсер",
  };

  const filteredJobs = activeFilter === "all"
    ? mockJobs
    : mockJobs.filter((j) => j.tags.some((t) => t.toLowerCase().includes(activeFilter.toLowerCase())));

  const portfolioItems = mockCreators[0].portfolio;

  const handleApply = () => {
    setApplied(true);
    setTimeout(() => {
      setShowApplyModal(false);
      setApplied(false);
      setSelectedWorks([]);
      setCoverLetter("");
    }, 1500);
  };

  const toggleWork = (id: string) => {
    setSelectedWorks((prev) =>
      prev.includes(id) ? prev.filter((w) => w !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  return (
    <div className="min-h-screen bg-[#F9F9FB]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="text-2xl font-bold text-[#111111]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Биржа вакансий
            </h1>
            <p className="text-sm text-[#6B7280] mt-0.5">{mockJobs.length} активных вакансий</p>
          </div>
          <Button size="sm">
            <Plus size={15} />
            Разместить вакансию
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Поиск по вакансиям..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-[#E5E7EB] rounded-[14px] text-sm text-[#111111] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#111111] transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.03)]"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap mb-6">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-[10px] text-sm font-medium transition-all duration-150 cursor-pointer border ${
                activeFilter === f
                  ? "bg-[#111111] text-white border-[#111111]"
                  : "bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#D1D5DB] hover:text-[#111111]"
              }`}
            >
              {filterLabels[f]}
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-5">
          {/* Job list */}
          <div className="lg:w-[420px] flex-shrink-0 space-y-3">
            {filteredJobs.map((job) => (
              <Card
                key={job.id}
                hover
                onClick={() => setSelectedJob(job)}
                className={`p-4 transition-all duration-200 ${
                  selectedJob.id === job.id ? "border-[#111111] shadow-[0_4px_16px_rgba(0,0,0,0.08)]" : ""
                }`}
              >
                <div className="flex gap-3">
                  <div
                    className="w-10 h-10 rounded-[11px] flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{ backgroundColor: job.companyColor }}
                  >
                    {job.companyInitials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-[#111111] leading-snug flex-1">
                        {job.title}
                      </h3>
                      {job.isHot && (
                        <Badge variant="accent" className="flex-shrink-0 text-[10px]">Горячая</Badge>
                      )}
                    </div>
                    <p className="text-xs text-[#6B7280] mb-2">{job.company} · {job.postedAt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1 flex-wrap">
                        {job.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} className="text-[10px]">#{tag}</Badge>
                        ))}
                      </div>
                      <span className="text-sm font-bold text-[#111111] flex-shrink-0">{job.budget}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Job detail */}
          <div className="flex-1 min-w-0">
            <Card className="p-7 sticky top-24">
              <div className="flex items-start gap-4 mb-5">
                <div
                  className="w-12 h-12 rounded-[13px] flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: selectedJob.companyColor }}
                >
                  {selectedJob.companyInitials}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h2
                      className="text-xl font-bold text-[#111111]"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      {selectedJob.title}
                    </h2>
                    {selectedJob.isHot && <Badge variant="accent">Горячая</Badge>}
                  </div>
                  <p className="text-sm text-[#6B7280]">{selectedJob.company}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p
                    className="text-xl font-bold text-[#111111]"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {selectedJob.budget}
                  </p>
                  <p className="text-xs text-[#6B7280]">{selectedJob.postedAt}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-[#6B7280] mb-5 pb-5 border-b border-[#F3F4F6]">
                <span className="flex items-center gap-1.5">
                  <MapPin size={13} /> {selectedJob.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={13} /> {selectedJob.schedule}
                </span>
                <span className="flex items-center gap-1.5">
                  <Briefcase size={13} /> {selectedJob.experience}
                </span>
              </div>

              <div className="mb-5">
                <h3
                  className="font-semibold text-[#111111] mb-2 text-sm"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Описание
                </h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">{selectedJob.description}</p>
              </div>

              <div className="mb-5">
                <h3
                  className="font-semibold text-[#111111] mb-2 text-sm"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Требования
                </h3>
                <ul className="space-y-1.5">
                  {selectedJob.requirements.map((req) => (
                    <li key={req} className="flex items-start gap-2 text-sm text-[#6B7280]">
                      <ChevronRight size={13} className="text-[#9CA3AF] mt-0.5 flex-shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-6">
                {selectedJob.tags.map((tag) => (
                  <Badge key={tag} variant="accent">#{tag}</Badge>
                ))}
              </div>

              <Button size="lg" className="w-full" onClick={() => setShowApplyModal(true)}>
                Откликнуться на вакансию
              </Button>
            </Card>
          </div>
        </div>
      </div>

      {/* Apply modal */}
      {showApplyModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => !applied && setShowApplyModal(false)}
        >
          <div
            className="bg-white rounded-[20px] max-w-lg w-full p-6 shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {applied ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-[#ECFDF5] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={28} className="text-[#059669]" />
                </div>
                <h3
                  className="text-xl font-bold text-[#111111] mb-2"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Отклик отправлен!
                </h3>
                <p className="text-[#6B7280] text-sm">Заказчик получит уведомление</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start mb-5">
                  <h3
                    className="text-lg font-bold text-[#111111]"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    Откликнуться
                  </h3>
                  <button
                    onClick={() => setShowApplyModal(false)}
                    className="w-8 h-8 rounded-full bg-[#F3F4F6] flex items-center justify-center hover:bg-[#E5E7EB] transition-colors cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>

                <p className="text-sm text-[#6B7280] mb-5">
                  Прикрепите 2–3 релевантные работы и напишите сопроводительное письмо
                </p>

                <div className="mb-5">
                  <p className="text-sm font-semibold text-[#111111] mb-3">
                    Выберите работы из портфолио ({selectedWorks.length}/3)
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {portfolioItems.map((work) => (
                      <button
                        key={work.id}
                        onClick={() => toggleWork(work.id)}
                        className={`relative aspect-video rounded-[10px] overflow-hidden cursor-pointer border-2 transition-all duration-150 ${
                          selectedWorks.includes(work.id)
                            ? "border-[#111111] shadow-[0_0_0_1px_#111111]"
                            : "border-transparent"
                        }`}
                        style={{
                          background: `linear-gradient(135deg, ${work.thumbnail}33, ${work.thumbnail}55)`,
                        }}
                      >
                        {selectedWorks.includes(work.id) && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-[#111111] rounded-full flex items-center justify-center">
                            <Check size={10} className="text-white" />
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-gradient-to-t from-black/50 to-transparent">
                          <p className="text-[9px] text-white font-medium truncate">{work.title}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-5">
                  <label className="text-sm font-semibold text-[#111111] block mb-2">
                    Сопроводительное письмо
                  </label>
                  <textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Расскажите, почему вы подходите для этого проекта..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-[12px] border border-[#E5E7EB] text-sm text-[#111111] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#111111] transition-colors resize-none"
                  />
                </div>

                <Button
                  size="lg"
                  className="w-full"
                  disabled={selectedWorks.length === 0 || !coverLetter.trim()}
                  onClick={handleApply}
                >
                  Отправить отклик
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
