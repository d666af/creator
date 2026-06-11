"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Check, Camera, Scissors, FileText, BarChart2, Users, User } from "lucide-react";

type Step = "login" | "role" | "specs" | "done";
type Role = "creator" | "client";

const specializations = [
  { id: "mobilographer", label: "Мобилограф", icon: Camera },
  { id: "editor", label: "Монтажёр", icon: Scissors },
  { id: "scriptwriter", label: "Сценарист", icon: FileText },
  { id: "producer", label: "Продюсер", icon: Users },
  { id: "smm", label: "SMM-специалист", icon: BarChart2 },
];

export default function AuthPage() {
  const [step, setStep] = useState<Step>("login");
  const [role, setRole] = useState<Role | null>(null);
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>([]);
  const [city, setCity] = useState("");

  const toggleSpec = (id: string) => {
    setSelectedSpecs((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-[#F9F9FB] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-10">
          <div className="w-9 h-9 bg-[#111111] rounded-[12px] flex items-center justify-center">
            <span className="text-white text-sm font-bold">CH</span>
          </div>
          <span
            className="text-lg font-bold text-[#111111]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Creators Hub
          </span>
        </div>

        <div className="bg-white rounded-[20px] border border-[#E5E7EB] shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-8 animate-scale-in">
          {step === "login" && (
            <div>
              <h1
                className="text-2xl font-bold text-[#111111] mb-2"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Добро пожаловать
              </h1>
              <p className="text-[#6B7280] text-sm mb-8">
                Войдите, чтобы начать работу на платформе
              </p>

              <button
                onClick={() => setStep("role")}
                className="w-full flex items-center gap-4 bg-[#F9F9FB] hover:bg-[#F3F4F6] border border-[#E5E7EB] rounded-[14px] px-5 py-4 transition-all duration-150 cursor-pointer group"
              >
                <div className="w-10 h-10 bg-[#2AABEE] rounded-[10px] flex items-center justify-center flex-shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.247l-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.932z" />
                  </svg>
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-[#111111] text-sm">Войти через Telegram</p>
                  <p className="text-xs text-[#6B7280]">Быстро и безопасно</p>
                </div>
                <ArrowRight size={16} className="text-[#6B7280] group-hover:text-[#111111] transition-colors" />
              </button>

              <div className="mt-6 pt-6 border-t border-[#F3F4F6]">
                <p className="text-xs text-center text-[#6B7280]">
                  Регистрируясь, вы принимаете{" "}
                  <a href="#" className="text-[#4F46E5] hover:underline">условия использования</a>
                </p>
              </div>
            </div>
          )}

          {step === "role" && (
            <div>
              <button
                onClick={() => setStep("login")}
                className="flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#111111] mb-6 transition-colors cursor-pointer"
              >
                <ArrowLeft size={14} /> Назад
              </button>

              <h1
                className="text-2xl font-bold text-[#111111] mb-2"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Кто вы на платформе?
              </h1>
              <p className="text-[#6B7280] text-sm mb-6">
                Выберите роль — это поможет нам настроить интерфейс
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => { setRole("creator"); setStep("specs"); }}
                  className={`w-full flex items-start gap-4 border rounded-[14px] px-5 py-4 transition-all duration-150 cursor-pointer text-left ${
                    role === "creator"
                      ? "border-[#111111] bg-[#F9F9FB]"
                      : "border-[#E5E7EB] hover:border-[#D1D5DB]"
                  }`}
                >
                  <div className="w-10 h-10 bg-[#EEF2FF] rounded-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Camera size={18} className="text-[#4F46E5]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#111111] text-sm">Я исполнитель</p>
                    <p className="text-xs text-[#6B7280] mt-0.5">Создаю контент, ищу заказы, развиваю портфолио</p>
                  </div>
                </button>

                <button
                  onClick={() => { setRole("client"); setStep("done"); }}
                  className={`w-full flex items-start gap-4 border rounded-[14px] px-5 py-4 transition-all duration-150 cursor-pointer text-left ${
                    role === "client"
                      ? "border-[#111111] bg-[#F9F9FB]"
                      : "border-[#E5E7EB] hover:border-[#D1D5DB]"
                  }`}
                >
                  <div className="w-10 h-10 bg-[#ECFDF5] rounded-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User size={18} className="text-[#059669]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#111111] text-sm">Я заказчик</p>
                    <p className="text-xs text-[#6B7280] mt-0.5">Ищу специалистов, публикую вакансии, нахожу команду</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {step === "specs" && (
            <div>
              <button
                onClick={() => setStep("role")}
                className="flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#111111] mb-6 transition-colors cursor-pointer"
              >
                <ArrowLeft size={14} /> Назад
              </button>

              <h1
                className="text-2xl font-bold text-[#111111] mb-2"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Ваша специализация
              </h1>
              <p className="text-[#6B7280] text-sm mb-6">
                Выберите одну или несколько — можно изменить позже
              </p>

              <div className="grid grid-cols-2 gap-2 mb-6">
                {specializations.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => toggleSpec(id)}
                    className={`flex items-center gap-2.5 px-3.5 py-3 rounded-[12px] border text-sm font-medium transition-all duration-150 cursor-pointer ${
                      selectedSpecs.includes(id)
                        ? "border-[#111111] bg-[#111111] text-white"
                        : "border-[#E5E7EB] text-[#6B7280] hover:border-[#D1D5DB] hover:text-[#111111]"
                    }`}
                  >
                    <Icon size={15} />
                    {label}
                    {selectedSpecs.includes(id) && <Check size={13} className="ml-auto" />}
                  </button>
                ))}
              </div>

              <div className="mb-6">
                <label className="text-sm font-medium text-[#111111] block mb-2">Город работы</label>
                <input
                  type="text"
                  placeholder="Например: Москва"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-3 rounded-[12px] border border-[#E5E7EB] text-sm text-[#111111] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#111111] transition-colors"
                />
              </div>

              <Button
                size="lg"
                className="w-full"
                disabled={selectedSpecs.length === 0}
                onClick={() => setStep("done")}
              >
                Продолжить
                <ArrowRight size={18} />
              </Button>
            </div>
          )}

          {step === "done" && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-[#ECFDF5] rounded-full flex items-center justify-center mx-auto mb-5">
                <Check size={28} className="text-[#059669]" />
              </div>
              <h1
                className="text-2xl font-bold text-[#111111] mb-2"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Всё готово!
              </h1>
              <p className="text-[#6B7280] text-sm mb-8">
                Ваш профиль создан. Начните исследовать платформу.
              </p>
              <div className="space-y-3">
                <Link href="/feed" className="block">
                  <Button size="lg" className="w-full">Перейти в ленту</Button>
                </Link>
                <Link href="/profile/nikita-ivanov" className="block">
                  <Button size="lg" variant="outline" className="w-full">Настроить профиль</Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Step indicator */}
        {step !== "done" && (
          <div className="flex justify-center gap-2 mt-6">
            {(["login", "role", "specs"] as Step[]).map((s, i) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === step ? "w-6 bg-[#111111]" : "w-1.5 bg-[#E5E7EB]"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
