import { Users, X } from "lucide-react";
import type { Employee } from "@/data/demo";
import { cn } from "@/lib/utils";
import { Avatar, Badge } from "./ui-kit";

function readyTone(v: string) {
  if (v === "Ready") return "green" as const;
  if (v === "Requires support") return "amber" as const;
  return "gray" as const;
}

function primaryLocName(e: Employee) {
  if (e.primaryLocation === "both") return "Main Café · Riverside";
  return e.primaryLocation === "main" ? "Main Café" : "Riverside Coffee Cart";
}

export default function EmployeeListPanel({
  employees,
  onPick,
  onClose,
}: {
  employees: Employee[];
  onPick: (id: Employee["id"]) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#202A36]/25" onClick={onClose}>
      <aside
        className="h-full w-full max-w-[560px] overflow-y-auto border-l border-border bg-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border p-5">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-ct-blue" />
            <h2 className="text-[18px] font-semibold">Employee Profiles</h2>
          </div>
          <button
            aria-label="Close list"
            onClick={onClose}
            className="rounded-[8px] p-1.5 text-muted-foreground hover:bg-ct-surface"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <ul className="divide-y divide-border">
          {employees.map((e) => (
            <li key={e.id}>
              <button
                onClick={() => onPick(e.id)}
                className="flex w-full items-center gap-3 px-5 py-3.5 text-left hover:bg-ct-surface"
              >
                <Avatar id={e.id} size={40} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-semibold">{e.name}</span>
                    {e.isNew && <Badge tone="green">NEW · WEEK 1</Badge>}
                  </div>
                  <p className="text-[12.5px] text-muted-foreground">
                    {e.role} · {e.experienceProfile}
                  </p>
                </div>
                <div className="hidden flex-col items-end gap-1 sm:flex">
                  <Badge tone={readyTone(e.readiness.peakShifts)}>
                    Peak: {e.readiness.peakShifts}
                  </Badge>
                  <span className="text-[11.5px] text-muted-foreground">{primaryLocName(e)}</span>
                  <span className="text-[11.5px] text-muted-foreground">{e.onboarding.status}</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
