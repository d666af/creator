import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, hover, onClick }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-[14px] border border-[#E5E7EB]",
        "shadow-[0_4px_20px_rgba(0,0,0,0.04)]",
        hover && "transition-all duration-200 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
