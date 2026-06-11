import { AppShell } from "@/components/layout/app-shell";
import { PenLine } from "lucide-react";

export default function NewPostPage() {
  return (
    <AppShell>
      <div className="flex flex-col items-center justify-center px-8 pt-24 gap-4">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-2xl"
          style={{ backgroundColor: "#F0E7D8" }}
        >
          <PenLine size={28} color="#A07850" />
        </div>
        <p className="text-[17px] font-bold" style={{ color: "#1C1A17" }}>Пост яратиш</p>
        <p className="text-center text-[14px]" style={{ color: "#74706A" }}>
          Яқин орада
        </p>
      </div>
    </AppShell>
  );
}
