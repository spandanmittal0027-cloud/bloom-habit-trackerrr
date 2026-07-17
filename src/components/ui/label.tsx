import * as React from "react";
import { cn } from "@/lib/utils";

export const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={cn(
        "block text-xs font-medium uppercase tracking-[0.08em] text-ink-soft mb-1.5",
        className
      )}
      {...props}
    />
  );
});
Label.displayName = "Label";
