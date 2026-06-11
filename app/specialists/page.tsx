import { AppShell } from "@/components/layout/app-shell";
import { Search } from "lucide-react";

export default function SpecialistsPage() {
  return (
    <AppShell>
      <div className="flex flex-col items-center justify-center px-8 pt-24 gap-4">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-2xl"
          style={{ backgroundColor: "#EBF1FD" }}
        >
          <Search size={28} color="#2563EB" />
        </div>
        <p className="text-[17px] font-bold" style={{ color: "#1C1A17" }}>Мутахассислар</p>
        <p className="text-center text-[14px]" style={{ color: "#74706A" }}>
          Яқин орада
        </p>
      </div>
    </AppShell>
  );
}
