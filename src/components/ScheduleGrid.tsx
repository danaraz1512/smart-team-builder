import { AlertTriangle, Check, Pencil, Sparkles, Users } from "lucide-react";
import { DAYS, LOCATIONS, byId, type EmpId, type Shift } from "@/data/demo";
import { cn } from "@/lib/utils";
import { Avatar, Badge, Button, Card } from "./ui-kit";

export type Highlight = { shiftId: string; employees: EmpId[] } | null;

function ShiftCard({
  shift,
  scheduled,
  highlight,
  onboardingShiftId,
  approved,
  onEdit,
}: {
  shift: Shift;
  scheduled: boolean;
  highlight: Highlight;
  onboardingShiftId: string;
  approved: boolean;
  onEdit: (shiftId: string) => void;
}) {
  const isOnboarding = shift.assigned.includes("noa") && shift.id === onboardingShiftId;
  const needsReview = scheduled && isOnboarding && !approved;
  const isHighlighted = highlight?.shiftId === shift.id;

  return (
    <div
      role={scheduled ? "button" : undefined}
      tabIndex={scheduled ? 0 : undefined}
      aria-label={scheduled ? `Edit shift ${shift.time}` : undefined}
      onClick={scheduled ? () => onEdit(shift.id) : undefined}
      onKeyDown={
        scheduled
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onEdit(shift.id);
              }
            }
          : undefined
      }
      className={cn(
        "flex h-full flex-col gap-1.5 rounded-[12px] border p-2 transition-all",
        !scheduled && "border-dashed border-border bg-ct-surface",
        scheduled && shift.peak && "border-ct-purple/30 bg-ct-purple-soft/60",
        scheduled && !shift.peak && "border-ct-blue/25 bg-ct-blue-soft/70",
        scheduled && isOnboarding && !needsReview && "border-ct-green/40 bg-ct-green-soft",
        needsReview && "border-ct-amber/50 bg-ct-amber-soft",
        isHighlighted && "ring-2 ring-ct-blue",
        scheduled && "cursor-pointer focus:outline-none focus:ring-2 focus:ring-ct-blue",
      )}
    >
      <div className="flex items-center justify-between gap-1">
        <span className="text-[12px] font-semibold">{shift.time}</span>
        {shift.peak ? (
          <Badge tone="purple">Peak</Badge>
        ) : (
          <span className="text-[11px] text-muted-foreground">Off-Peak</span>
        )}
      </div>

      <div className="flex flex-wrap gap-1">
        {shift.reqs.map((r) => (
          <Badge key={r} tone="gray" className="!text-[10px]">
            {r}
          </Badge>
        ))}
        {shift.onboardingSuitable && (
          <Badge tone="green" className="!text-[10px]">
            Onboarding OK
          </Badge>
        )}
      </div>

      {scheduled ? (
        <div className="mt-0.5 space-y-1">
          {shift.assigned.map((id) => {
            const e = byId(id);
            const ring = Boolean(isHighlighted && highlight?.employees.includes(id));
            return (
              <div
                key={id}
                className={cn(
                  "flex items-center gap-1.5 rounded-[8px] bg-card px-1.5 py-1",
                  ring && "ring-2 ring-ct-blue",
                )}
              >
                <Avatar id={id} size={20} />
                <span className="truncate text-[11.5px] font-medium">{e.short}</span>
                {e.isNew && (
                  <span className="ml-auto shrink-0 text-[9px] font-bold tracking-wide text-ct-green">
                    NEW
                  </span>
                )}
              </div>
            );
          })}
          {needsReview ? (
            <p className="flex items-center gap-1 text-[10.5px] font-semibold text-ct-amber-ink">
              <AlertTriangle className="h-3 w-3" /> Review recommended
            </p>
          ) : isOnboarding ? (
            <p className="flex items-center gap-1 text-[10.5px] font-semibold text-ct-green">
              <Check className="h-3 w-3" /> Onboarding approved
            </p>
          ) : null}
        </div>
      ) : (
        <div className="mt-auto flex items-center gap-1 text-[11px] text-muted-foreground">
          <Users className="h-3.5 w-3.5" /> Needs {shift.needs}{" "}
          {shift.needs === 1 ? "employee" : "employees"}
        </div>
      )}
      {scheduled && (
        <span className="mt-auto flex items-center gap-1 pt-1 text-[10px] font-semibold text-ct-link">
          <Pencil className="h-3 w-3" /> Edit shift
        </span>
      )}
    </div>
  );
}

export default function ScheduleGrid({
  shifts,
  scheduled,
  analyzing,
  highlight,
  onboardingShiftId,
  approved,
  onEditShift,
}: {
  shifts: Shift[];
  scheduled: boolean;
  analyzing: boolean;
  highlight: Highlight;
  onboardingShiftId: string;
  approved: boolean;
  onEditShift: (shiftId: string | null) => void;
}) {
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
        <h3 className="text-[16px] font-semibold">Weekly schedule</h3>
        <div className="flex flex-wrap items-center gap-2 text-[12px] text-muted-foreground">
          {analyzing && (
            <span className="flex items-center gap-1 font-semibold text-ct-purple">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" /> Smart Scheduler working…
            </span>
          )}
          <span>14 shifts · 2 locations</span>
          <Button variant="secondary" size="sm" onClick={() => onEditShift(null)}>
            <Pencil className="h-3.5 w-3.5" /> Edit manually
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-border bg-card px-4 py-2 text-[11.5px] text-muted-foreground">
        <span className="font-semibold text-foreground">Color key</span>
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-sm border border-ct-blue/30 bg-ct-blue-soft" /> Standard shift</span>
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-sm border border-ct-purple/30 bg-ct-purple-soft" /> Peak demand</span>
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-sm border border-ct-amber/40 bg-ct-amber-soft" /> Needs review</span>
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-sm border border-ct-green/40 bg-ct-green-soft" /> Approved onboarding</span>
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-sm border border-border bg-ct-surface" /> Not scheduled</span>
      </div>

      <div className={cn("min-w-0 overflow-x-auto", analyzing && "opacity-60")}>
        <div className="min-w-[820px]">
          <div className="grid grid-cols-[132px_repeat(7,minmax(0,1fr))] border-b border-border bg-ct-surface">
            <div className="px-3 py-2 text-[12px] font-semibold text-muted-foreground">Location</div>
            {DAYS.map((d, i) => (
              <div
                key={d.label}
                className={cn(
                  "border-l border-border px-2 py-2 text-[12px]",
                  (i === 4 || i === 5) && "bg-ct-purple-soft/40",
                )}
              >
                <div className="font-semibold">{d.label}</div>
                <div className="text-muted-foreground">{d.date}</div>
              </div>
            ))}
          </div>

          {LOCATIONS.map((loc) => (
            <div key={loc.id}>
              <div className="border-b border-border bg-card px-3 py-1.5 text-[12.5px] font-semibold text-ct-blue">
                {loc.name}
              </div>
              {(["morning", "evening"] as const).map((part) => (
                <div
                  key={part}
                  className="grid grid-cols-[132px_repeat(7,minmax(0,1fr))] border-b border-border"
                >
                  <div className="px-3 py-2 text-[12px] font-medium capitalize text-muted-foreground">
                    {part}
                  </div>
                  {DAYS.map((d, i) => {
                    const shift = shifts.find(
                      (s) => s.day === i && s.location === loc.id && s.part === part,
                    );
                    return (
                      <div key={d.label} className="border-l border-border p-1.5">
                        {shift ? (
                          <ShiftCard
                            shift={shift}
                            scheduled={scheduled}
                            highlight={highlight}
                            onboardingShiftId={onboardingShiftId}
                            approved={approved}
                             onEdit={onEditShift}
                          />
                        ) : (
                          <div className="h-full min-h-[52px] rounded-[10px] bg-ct-surface/60" />
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
