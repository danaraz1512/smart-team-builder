import { X } from "lucide-react";
import { HARD_RULES, SOFT_RULES } from "@/data/demo";
import { Badge, Button } from "./ui-kit";

export default function RulesPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-[#202A36]/25" onClick={onClose}>
      <aside
        className="h-full w-full max-w-[420px] overflow-y-auto border-l border-border bg-card p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-[20px] font-semibold">Scheduling rules</h2>
            <p className="mt-1 text-[13px] text-muted-foreground">
              These rules shape every generated draft.
            </p>
          </div>
          <button
            aria-label="Close"
            onClick={onClose}
            className="rounded-[8px] p-1.5 text-muted-foreground hover:bg-ct-surface"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <section className="mt-6">
          <div className="flex items-center gap-2">
            <h3 className="text-[15px] font-semibold">Hard constraints</h3>
            <Badge tone="red">Never broken</Badge>
          </div>
          <ul className="mt-3 space-y-2">
            {HARD_RULES.map((r) => (
              <li
                key={r}
                className="rounded-[12px] border border-border bg-ct-surface px-3 py-2.5 text-[13px]"
              >
                {r}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-6">
          <div className="flex items-center gap-2">
            <h3 className="text-[15px] font-semibold">Soft preferences</h3>
            <Badge tone="amber">Optimized</Badge>
          </div>
          <ul className="mt-3 space-y-2">
            {SOFT_RULES.map((r) => (
              <li
                key={r}
                className="rounded-[12px] border border-border bg-card px-3 py-2.5 text-[13px]"
              >
                {r}
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-6 flex justify-end">
          <Button onClick={onClose}>Done</Button>
        </div>
      </aside>
    </div>
  );
}
