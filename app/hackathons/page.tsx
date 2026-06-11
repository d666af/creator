"use client";
import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { mockHackathons } from "@/lib/mock-data";
import { Trophy, Clock, Users, CheckCircle, X, Check, ChevronRight, Flame } from "lucide-react";

export default function HackathonsPage() {
  const [selectedHack, setSelectedHack] = useState(mockHackathons[0]);
  const [showModal, setShowModal] = useState(false);
  const [joined, setJoined] = useState(false);

  const activeHacks = mockHackathons.filter((h) => h.status === "active");
  const finishedHacks = mockHackathons.filter((h) => h.status === "finished");

  const handleJoin = () => {
    setJoined(true);
    setTimeout(() => {
      setShowModal(false);
      setJoined(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F9F9FB]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <Trophy size={22} className="text-amber-400" />
              <h1
                className="text-2xl font-bold text-[#111111]"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Хакатоны и челленджи
              </h1>
            </div>
            <p className="text-sm text-[#6B7280]">
              {activeHacks.length} активных · Призы до 50 000 ₽ + контракты с брендами
            </p>
          </div>
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-[12px] px-4 py-2.5">
            <Flame size={15} className="text-amber-500" />
            <span className="text-sm font-medium text-amber-700">Следующий старт через 48 часов</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: hackathon list */}
          <div className="lg:w-[400px] flex-shrink-0 space-y-4">
            {activeHacks.length > 0 && (
              <>
                <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider px-1">Активные</p>
                {activeHacks.map((hack) => (
                  <Card
                    key={hack.id}
                    hover
                    onClick={() => setSelectedHack(hack)}
                    className={`p-4 transition-all duration-200 ${
                      selectedHack.id === hack.id ? "border-[#111111]" : ""
                    }`}
                  >
                    <div className="flex gap-3">
                      <div
                        className="w-11 h-11 rounded-[12px] flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                        style={{ backgroundColor: hack.sponsorColor }}
                      >
                        {hack.sponsorInitials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-[#111111] mb-1 leading-snug">
                          {hack.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-[#6B7280]">
                          <span className="flex items-center gap-1">
                            <Clock size={11} /> {hack.hoursLeft}ч осталось
                          </span>
                          <span className="flex items-center gap-1">
                            <Users size={11} /> {hack.participants} участников
                          </span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="text-sm font-bold text-[#111111]">
                          {hack.prizeAmount.toLocaleString("ru")} ₽
                        </p>
                        <Badge variant="success" className="text-[10px]">Активен</Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </>
            )}

            {finishedHacks.length > 0 && (
              <>
                <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider px-1 mt-4">Завершённые</p>
                {finishedHacks.map((hack) => (
                  <Card
                    key={hack.id}
                    hover
                    onClick={() => setSelectedHack(hack)}
                    className="p-4 opacity-70"
                  >
                    <div className="flex gap-3">
                      <div
                        className="w-11 h-11 rounded-[12px] flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                        style={{ backgroundColor: hack.sponsorColor }}
                      >
                        {hack.sponsorInitials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-[#111111] mb-1 leading-snug">
                          {hack.title}
                        </h3>
                        <p className="text-xs text-[#6B7280]">{hack.participants} участников</p>
                      </div>
                      <Badge variant="default" className="text-[10px] self-start">Завершён</Badge>
                    </div>
                  </Card>
                ))}
              </>
            )}
          </div>

          {/* Detail */}
          <div className="flex-1 min-w-0">
            <Card className="p-7 sticky top-24">
              {/* Header */}
              <div className="flex items-start gap-4 mb-5">
                <div
                  className="w-14 h-14 rounded-[14px] flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                  style={{ backgroundColor: selectedHack.sponsorColor }}
                >
                  {selectedHack.sponsorInitials}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h2
                      className="text-xl font-bold text-[#111111]"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      {selectedHack.title}
                    </h2>
                    {selectedHack.status === "active" ? (
                      <Badge variant="success">Активен</Badge>
                    ) : (
                      <Badge variant="default">Завершён</Badge>
                    )}
                  </div>
                  <p className="text-sm text-[#6B7280]">Спонсор: {selectedHack.sponsor}</p>
                </div>
              </div>

              {/* Prize + meta */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-amber-50 rounded-[12px] p-3.5 text-center">
                  <Trophy size={16} className="text-amber-500 mx-auto mb-1" />
                  <p className="text-xs font-bold text-[#111111]">{selectedHack.prizeAmount.toLocaleString("ru")} ₽</p>
                  <p className="text-[10px] text-[#6B7280]">Приз</p>
                </div>
                <div className="bg-[#F9F9FB] rounded-[12px] p-3.5 text-center">
                  <Users size={16} className="text-[#6B7280] mx-auto mb-1" />
                  <p className="text-xs font-bold text-[#111111]">{selectedHack.participants}</p>
                  <p className="text-[10px] text-[#6B7280]">Участников</p>
                </div>
                <div className="bg-[#F9F9FB] rounded-[12px] p-3.5 text-center">
                  <Clock size={16} className="text-[#6B7280] mx-auto mb-1" />
                  <p className="text-xs font-bold text-[#111111]">
                    {selectedHack.status === "active" ? `${selectedHack.hoursLeft}ч` : "—"}
                  </p>
                  <p className="text-[10px] text-[#6B7280]">
                    {selectedHack.status === "active" ? "Осталось" : "Завершён"}
                  </p>
                </div>
              </div>

              {/* Full prize */}
              <div className="bg-[#F9F9FB] rounded-[12px] p-4 mb-5">
                <p className="text-xs font-semibold text-[#6B7280] mb-1 uppercase tracking-wide">Приз победителя</p>
                <p className="text-sm font-semibold text-[#111111]">{selectedHack.prize}</p>
              </div>

              {/* Brief */}
              <div className="mb-5">
                <h3
                  className="font-semibold text-[#111111] mb-2 text-sm"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Задание
                </h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">{selectedHack.brief}</p>
              </div>

              {/* Requirements */}
              {selectedHack.requirements.length > 0 && (
                <div className="mb-5">
                  <h3
                    className="font-semibold text-[#111111] mb-2 text-sm"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    Требования к работе
                  </h3>
                  <ul className="space-y-1.5">
                    {selectedHack.requirements.map((req) => (
                      <li key={req} className="flex items-start gap-2 text-sm text-[#6B7280]">
                        <ChevronRight size={13} className="text-[#9CA3AF] mt-0.5 flex-shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Stages */}
              {selectedHack.stages.length > 0 && (
                <div className="mb-6">
                  <h3
                    className="font-semibold text-[#111111] mb-3 text-sm"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    Этапы
                  </h3>
                  <div className="space-y-2">
                    {selectedHack.stages.map((stage, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                          i === 0 ? "bg-[#111111] text-white" : "bg-[#F3F4F6] text-[#6B7280]"
                        }`}>
                          {i + 1}
                        </div>
                        <p className="text-sm text-[#6B7280]">{stage}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Winner */}
              {selectedHack.status === "finished" && "winner" in selectedHack && selectedHack.winner && (
                <div className="bg-amber-50 border border-amber-100 rounded-[12px] p-4 mb-5 flex items-center gap-3">
                  <Trophy size={18} className="text-amber-500 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-amber-700">Победитель</p>
                    <p className="text-sm font-bold text-[#111111]">{selectedHack.winner}</p>
                  </div>
                </div>
              )}

              {selectedHack.status === "active" ? (
                <Button size="lg" className="w-full" onClick={() => setShowModal(true)}>
                  Участвовать в хакатоне
                </Button>
              ) : (
                <Button size="lg" variant="secondary" className="w-full" disabled>
                  Приём работ завершён
                </Button>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Join modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => !joined && setShowModal(false)}
        >
          <div
            className="bg-white rounded-[20px] max-w-md w-full p-6 shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {joined ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy size={28} className="text-amber-500" />
                </div>
                <h3
                  className="text-xl font-bold text-[#111111] mb-2"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Вы участвуете!
                </h3>
                <p className="text-[#6B7280] text-sm">ТЗ и материалы отправлены на вашу почту</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <h3
                      className="text-lg font-bold text-[#111111] mb-1"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      Подтвердите участие
                    </h3>
                    <p className="text-sm text-[#6B7280]">{selectedHack.title}</p>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="w-8 h-8 rounded-full bg-[#F3F4F6] flex items-center justify-center hover:bg-[#E5E7EB] transition-colors cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>

                <div className="space-y-3 mb-6">
                  {[
                    `Дедлайн: ${selectedHack.deadline}`,
                    `Категория: ${selectedHack.category}`,
                    `Приз: ${selectedHack.prize}`,
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2.5 text-sm text-[#6B7280]">
                      <CheckCircle size={14} className="text-[#4F46E5] flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>

                <div className="bg-[#F9F9FB] rounded-[12px] p-4 mb-6">
                  <p className="text-xs text-[#6B7280] leading-relaxed">
                    После подтверждения вы получите полное ТЗ и ссылку на исходные материалы.
                    Работу нужно сдать до закрытия дедлайна.
                  </p>
                </div>

                <Button size="lg" className="w-full" onClick={handleJoin}>
                  Подтвердить участие
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
