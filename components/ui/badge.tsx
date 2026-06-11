import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "accent" | "success" | "warning" | "pro";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-[8px]",
        {
          "bg-[#F3F4F6] text-[#6B7280]": variant === "default",
          "bg-[#EEF2FF] text-[#4F46E5]": variant === "accent",
          "bg-[#ECFDF5] text-[#059669]": variant === "success",
          "bg-[#FFFBEB] text-[#D97706]": variant === "warning",
          "bg-[#111111] text-white": variant === "pro",
        },
        className
      )}
    >
      {children}
    </span>
  );
}
