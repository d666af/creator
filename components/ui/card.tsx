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
        "bg-[#1C1C1E] rounded-[20px] border border-white/[0.08] shadow-none",
        hover && "transition-all duration-200 hover:border-white/20 active:scale-[0.99] cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
