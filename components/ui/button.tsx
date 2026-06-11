"use client";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "accent";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-150 cursor-pointer select-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          {
            "bg-[#111111] text-white hover:bg-[#2a2a2a] focus-visible:ring-[#111111]": variant === "primary",
            "bg-[#F3F4F6] text-[#111111] hover:bg-[#E5E7EB] focus-visible:ring-[#E5E7EB]": variant === "secondary",
            "bg-transparent text-[#111111] hover:bg-[#F3F4F6] focus-visible:ring-[#E5E7EB]": variant === "ghost",
            "bg-transparent border border-[#E5E7EB] text-[#111111] hover:border-[#111111] focus-visible:ring-[#111111]": variant === "outline",
            "bg-[#4F46E5] text-white hover:bg-[#4338CA] focus-visible:ring-[#4F46E5]": variant === "accent",
          },
          {
            "text-sm px-3 py-1.5 rounded-[10px] gap-1.5": size === "sm",
            "text-sm px-4 py-2.5 rounded-[12px] gap-2": size === "md",
            "text-base px-6 py-3 rounded-[14px] gap-2.5": size === "lg",
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
