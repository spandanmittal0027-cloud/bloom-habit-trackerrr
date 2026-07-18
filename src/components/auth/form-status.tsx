import { cn } from "@/lib/utils";

export function FormStatus({
  message,
  variant = "error",
}: {
  message: string;
  variant?: "error" | "success";
}) {
  return (
    <p
      role="status"
      className={cn(
        "mb-4 rounded-xl px-4 py-2.5 text-sm leading-snug",
        variant === "error"
          ? "bg-blush/80 text-ink"
          : "bg-sage/80 text-ink"
      )}
    >
      {message}
    </p>
  );
}
