import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-2xl border border-ink/10 bg-warm-white/80 px-4 py-3 text-[0.95rem] text-ink placeholder:text-ink-faint",
        "outline-none transition-shadow duration-150",
        "focus:ring-2 focus:ring-blush-deep/70 focus:border-transparent",
        className
      )}
      {...props}
    />
  );
});
Input.displayName = "Input";
