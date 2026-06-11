"use client";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "accent-creator" | "accent-b2b";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-semibold transition-all duration-150 cursor-pointer select-none active:scale-[0.97]",
          "focus-visible:outline-none disabled:opacity-40 disabled:cursor-not-allowed",
          {
            "bg-white text-black hover:bg-white/90": variant === "primary",
            "bg-[#2C2C2E] text-white hover:bg-[#3A3A3C]": variant === "secondary",
            "bg-transparent text-white hover:bg-white/10": variant === "ghost",
            "bg-transparent border border-white/20 text-white hover:bg-white/[0.06]": variant === "outline",
            "bg-[#BF5AF2] text-white hover:bg-[#BF5AF2]/90": variant === "accent-creator",
            "bg-[#0A84FF] text-white hover:bg-[#0A84FF]/90": variant === "accent-b2b",
          },
          {
            "text-sm px-3.5 py-2 rounded-full gap-1.5": size === "sm",
            "text-sm px-5 py-2.5 rounded-full gap-2": size === "md",
            "text-base px-6 py-3.5 rounded-full gap-2.5": size === "lg",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
