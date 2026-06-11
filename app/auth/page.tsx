"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/lib/role-context";
import { Camera, Building2, ChevronLeft, Send, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Step = 1 | 2;
type Choice = "creator" | "b2b" | null;

const specs = ["Мобилограф", "Монтажёр", "Сценарист", "SMM", "Таргетолог", "Продюсер", "Колорист", "Reels-мейкер"];

export default function AuthPage() {
  const router = useRouter();
  const { setRole } = useRole();
  const [step, setStep] = useState<Step>(1);
  const [choice, setChoice] = useState<Choice>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [brief, setBrief] = useState("");

  const pick = (c: "creator" | "b2b") => {
    setChoice(c);
    setRole(c);
    setStep(2);
  };

  const toggleSpec = (s: string) =>
    setSelected((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const accent = choice === "b2b" ? "#0A84FF" : "#BF5AF2";

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-black px-6">
      {/* Animated blobs */}
      <div className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-[#BF5AF2]/30 blur-3xl animate-blob" />
      <div className="pointer-events-none absolute -right-16 top-40 h-72 w-72 rounded-full bg-[#0A84FF]/30 blur-3xl animate-blob" style={{ animationDelay: "3s" }} />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-[#FF2D55]/20 blur-3xl animate-blob" style={{ animationDelay: "6s" }} />

      <div className="relative z-10 flex flex-1 flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pt-12">
          {step === 2 ? (
            <button onClick={() => setStep(1)} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white">
              <ChevronLeft size={20} />
            </button>
          ) : (
            <div className="h-9 w-9" />
          )}
          {/* Step dots */}
          <div className="flex gap-2">
            {[1, 2].map((s) => (
              <span
                key={s}
                className="h-2 rounded-full transition-all"
                style={{
                  width: step === s ? 24 : 8,
                  backgroundColor: step === s ? accent : "rgba(255,255,255,0.25)",
                }}
              />
            ))}
          </div>
          <div className="h-9 w-9" />
        </div>

        {step === 1 && (
          <div className="flex flex-1 flex-col justify-center">
            <div className="mb-10 text-center">
              <div
                className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[20px] text-2xl font-extrabold text-white"
                style={{ background: "linear-gradient(135deg, #BF5AF2, #0A84FF)" }}
              >
                CH
              </div>
              <h1 className="text-3xl font-extrabold text-white">Creators Hub</h1>
              <p className="mx-auto mt-2 max-w-xs text-sm text-[rgba(235,235,245,0.6)]">
                Kontent yaratuvchilar va brendlar uchun platforma
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <RoleCard
                onClick={() => pick("creator")}
                gradient="linear-gradient(135deg, #BF5AF2, #FF2D55)"
                icon={<Camera size={26} className="text-white" />}
                title="Men kreatorman"
                subtitle="Kontent yarataman"
              />
              <RoleCard
                onClick={() => pick("b2b")}
                gradient="linear-gradient(135deg, #0A84FF, #5E5CE6)"
                icon={<Building2 size={26} className="text-white" />}
                title="Men buyurtmachiman"
                subtitle="Jamoa izlayman"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-1 flex-col pt-8">
            <h2 className="text-2xl font-extrabold text-white">
              {choice === "creator" ? "Йўналишингиз?" : "Қисқача бриф"}
            </h2>
            <p className="mt-1 text-sm text-[rgba(235,235,245,0.6)]">
              {choice === "creator"
                ? "Бир ёки бир нечта мутахассислик танланг"
                : "Қандай жамоа изляпсиз?"}
            </p>

            <div className="mt-6 flex-1">
              {choice === "creator" ? (
                <div className="flex flex-wrap gap-2.5">
                  {specs.map((s) => {
                    const on = selected.includes(s);
                    return (
                      <button
                        key={s}
                        onClick={() => toggleSpec(s)}
                        className={cn(
                          "flex items-center gap-1.5 rounded-full border px-4 py-2.5 text-sm font-semibold transition-all",
                          on ? "border-transparent text-white" : "border-white/15 text-[rgba(235,235,245,0.7)]"
                        )}
                        style={on ? { backgroundColor: accent } : undefined}
                      >
                        {on && <Check size={14} />}
                        {s}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <textarea
                  value={brief}
                  onChange={(e) => setBrief(e.target.value)}
                  rows={6}
                  placeholder="Масалан: Fashion бренд учун доимий мобилограф излаймиз..."
                  className="w-full resize-none rounded-2xl border border-white/[0.1] bg-white/[0.04] p-4 text-sm text-white outline-none placeholder:text-[rgba(235,235,245,0.4)]"
                />
              )}
            </div>

            <button
              onClick={() => router.push("/")}
              className="mb-10 flex w-full items-center justify-center gap-2 rounded-full py-4 text-base font-bold text-white"
              style={{ background: "linear-gradient(135deg, #229ED9, #2AABEE)" }}
            >
              <Send size={18} /> Telegram орқали кириш
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function RoleCard({
  onClick,
  gradient,
  icon,
  title,
  subtitle,
}: {
  onClick: () => void;
  gradient: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-[24px] p-[1.5px] text-left transition-transform active:scale-[0.98]"
      style={{ background: gradient }}
    >
      <div className="flex items-center gap-4 rounded-[23px] bg-black/85 p-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: gradient }}>
          {icon}
        </div>
        <div>
          <div className="text-lg font-bold text-white">{title}</div>
          <div className="text-sm text-[rgba(235,235,245,0.6)]">{subtitle}</div>
        </div>
      </div>
    </button>
  );
}
