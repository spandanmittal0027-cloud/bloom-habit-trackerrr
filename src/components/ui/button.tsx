import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-blush-deep text-ink hover:bg-blush shadow-[0_8px_20px_-8px_rgba(92,75,82,0.45)]",
  secondary:
    "bg-lavender-deep text-ink hover:bg-lavender shadow-[0_8px_20px_-8px_rgba(92,75,82,0.35)]",
  outline:
    "bg-transparent border border-ink/15 text-ink hover:bg-warm-white/70",
  ghost: "bg-transparent text-ink-soft hover:bg-warm-white/60",
};

const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "text-sm px-4 py-2",
  md: "text-[0.95rem] px-5 py-2.5",
  lg: "text-base px-6 py-3.5",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide",
          "transition-all duration-200 ease-out active:scale-[0.97]",
          "disabled:opacity-50 disabled:pointer-events-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blush-deep focus-visible:ring-offset-2 focus-visible:ring-offset-cream",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
