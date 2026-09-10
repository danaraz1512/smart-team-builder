import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { byId, type EmpId } from "@/data/demo";

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("rounded-[18px] border border-border bg-card", className)}>{children}</div>
  );
}

type Tone = "blue" | "purple" | "green" | "amber" | "red" | "gray" | "periwinkle";

const toneMap: Record<Tone, string> = {
  blue: "bg-ct-blue-soft text-ct-blue border-ct-blue/20",
  purple: "bg-ct-purple-soft text-ct-purple border-ct-purple/20",
  green: "bg-ct-green-soft text-ct-green border-ct-green/25",
  amber: "bg-ct-amber-soft text-ct-amber-ink border-ct-amber/30",
  red: "bg-ct-red-soft text-ct-red border-ct-red/25",
  gray: "bg-ct-surface text-muted-foreground border-border",
  periwinkle: "bg-ct-peri-soft text-ct-peri border-ct-peri/25",
};

export function Badge({
  tone = "gray",
  children,
  className,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-[2px] text-[11px] font-semibold leading-4",
        toneMap[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "success";
  size?: "sm" | "md";
}) {
  return (
    <button
      {...rest}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[10px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-55",
        size === "sm" ? "px-3 py-1.5 text-[13px]" : "px-4 py-2.5 text-[14px]",
        variant === "primary" && "bg-ct-blue text-white hover:bg-[#1E86EC]",
        variant === "secondary" &&
          "border border-border bg-card text-foreground hover:bg-ct-surface",
        variant === "ghost" && "text-ct-link hover:bg-ct-blue-soft",
        variant === "success" && "bg-ct-green text-white hover:bg-[#2FA671]",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Avatar({
  id,
  size = 28,
  ring,
}: {
  id: EmpId;
  size?: number;
  ring?: boolean;
}) {
  const e = byId(id);
  const isNew = e.isNew;
  return (
    <span
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white",
        isNew ? "bg-ct-green" : "bg-ct-peri",
        ring && "ring-2 ring-ct-blue ring-offset-1 ring-offset-white",
      )}
      title={e.name}
    >
      {e.initials}
    </span>
  );
}

export function Sparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("h-4 w-4", className)} fill="currentColor">
      <path d="M12 2.5l1.7 4.9 4.9 1.7-4.9 1.7L12 15.7l-1.7-4.9L5.4 9.1l4.9-1.7L12 2.5zM18.6 14.4l.9 2.4 2.4.9-2.4.9-.9 2.4-.9-2.4-2.4-.9 2.4-.9.9-2.4zM5.4 14.9l.7 1.9 1.9.7-1.9.7-.7 1.9-.7-1.9L2.8 17.5l1.9-.7.7-1.9z" />
    </svg>
  );
}
