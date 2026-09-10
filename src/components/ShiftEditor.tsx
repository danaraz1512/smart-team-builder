import { useState } from "react";
import { AlertTriangle, Check, X } from "lucide-react";
import { DAYS, EMPLOYEES, LOCATIONS, byId, type EmpId, type Shift } from "@/data/demo";
import { cn } from "@/lib/utils";
import { Avatar, Badge, Button } from "./ui-kit";

function issuesFor(shift: Shift, assigned: EmpId[]) {
  const out: string[] = [];
  if (assigned.length < shift.needs)
    out.push(`Needs ${shift.needs} — ${assigned.length} assigned.`);
  assigned.forEach((id) => {
    const e = byId(id);
    if (e.pto?.includes(shift.day)) out.push(`${e.short} has approved time off that day.`);
    else if (!e.availability.includes(shift.day))
      out.push(`${e.short} is not available on ${DAYS[shift.day]?.label ?? "that day"}.`);
  });
  const hasNew = assigned.some((id) => byId(id).isNew);
  const hasExperienced = assigned.some((id) => !byId(id).isNew);
  if (hasNew && !hasExperienced)
    out.push("A new employee cannot work without an experienced teammate.");
  if (shift.peak && !assigned.some((id) => byId(id).role === "Shift Lead"))
    out.push("Peak shift without a shift lead.");
  return out;
}

export default function ShiftEditor({
  shift,
  onClose,
  onSave,
}: {
  shift: Shift;
  onClose: () => void;
  onSave: (assigned: EmpId[]) => void;
}) {
  const [assigned, setAssigned] = useState<EmpId[]>(shift.assigned);
  const issues = issuesFor(shift, assigned);
  const locName = LOCATIONS.find((l) => l.id === shift.location)!.name;

  const toggle = (id: EmpId) =>
    setAssigned((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#202A36]/30 p-4">
      <div className="max-h-[90vh] w-full max-w-[460px] overflow-y-auto rounded-[18px] border border-border bg-card p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-[18px] font-semibold">Edit shift manually</h2>
            <p className="mt-1 text-[12.5px] text-muted-foreground">
              {DAYS[shift.day]?.label}, {DAYS[shift.day]?.date} · {shift.time} · {locName}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {shift.peak ? <Badge tone="purple">Peak</Badge> : <Badge tone="gray">Off-Peak</Badge>}
              {shift.reqs.map((r) => (
                <Badge key={r} tone="gray">
                  {r}
                </Badge>
              ))}
              {shift.onboardingSuitable && <Badge tone="green">Onboarding OK</Badge>}
            </div>
          </div>
          <button
            aria-label="Close shift editor"
            onClick={onClose}
            className="rounded-[8px] p-1.5 text-muted-foreground hover:bg-ct-surface"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-1.5">
          {EMPLOYEES.map((e) => {
            const on = assigned.includes(e.id);
            const blocked = e.pto?.includes(shift.day);
            const unavailable = !blocked && !e.availability.includes(shift.day);
            return (
              <button
                key={e.id}
                onClick={() => toggle(e.id)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-[12px] border px-3 py-2 text-left transition-colors",
                  on ? "border-ct-blue bg-ct-blue-soft" : "border-border bg-card hover:bg-ct-surface",
                )}
              >
                <Avatar id={e.id} size={26} />
                <span className="min-w-0">
                  <span className="block truncate text-[13.5px] font-semibold">{e.name}</span>
                  <span className="block truncate text-[11.5px] text-muted-foreground">
                    {e.role} · {e.skills.join(", ")}
                  </span>
                </span>
                <span className="ml-auto flex shrink-0 items-center gap-1.5">
                  {blocked && <Badge tone="amber">Time off</Badge>}
                  {unavailable && <Badge tone="amber">Unavailable</Badge>}
                  {e.isNew && <Badge tone="green">New</Badge>}
                  {on && <Check className="h-4 w-4 text-ct-blue" />}
                </span>
              </button>
            );
          })}
        </div>

        <div
          className={cn(
            "mt-4 rounded-[12px] p-3 text-[12.5px]",
            issues.length ? "bg-ct-amber-soft" : "bg-ct-green-soft",
          )}
        >
          {issues.length ? (
            <ul className="space-y-1">
              {issues.map((i) => (
                <li key={i} className="flex items-start gap-1.5 font-medium text-ct-amber-ink">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  {i}
                </li>
              ))}
            </ul>
          ) : (
            <p className="flex items-center gap-1.5 font-medium text-ct-green">
              <Check className="h-3.5 w-3.5" /> This team meets all scheduling rules.
            </p>
          )}
          <p className="mt-2 text-muted-foreground">
            You can save anyway — manual changes always override the recommendation.
          </p>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={() => onSave(assigned)}>
            Save Shift
          </Button>
        </div>
      </div>
    </div>
  );
}
