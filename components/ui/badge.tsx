import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "creator" | "b2b" | "success" | "warning" | "error" | "pro";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full leading-none",
        {
          "bg-white/[0.08] text-[rgba(235,235,245,0.6)]": variant === "default",
          "bg-[#BF5AF2]/15 text-[#BF5AF2]": variant === "creator",
          "bg-[#0A84FF]/15 text-[#0A84FF]": variant === "b2b",
          "bg-[#30D158]/15 text-[#30D158]": variant === "success",
          "bg-[#FFD60A]/15 text-[#FFD60A]": variant === "warning",
          "bg-[#FF453A]/15 text-[#FF453A]": variant === "error",
          "bg-gradient-to-r from-[#BF5AF2] to-[#0A84FF] text-white": variant === "pro",
        },
        className
      )}
    >
      {children}
    </span>
  );
}
