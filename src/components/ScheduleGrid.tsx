import { AlertTriangle, Check, Pencil, Sparkles, Users } from "lucide-react";
import { DAYS, LOCATIONS, byId, type EmpId, type LocationId, type Shift } from "@/data/demo";
import { cn } from "@/lib/utils";
import { Avatar, Badge, Card } from "./ui-kit";

export type Highlight = { shiftId: string; employees: EmpId[] } | null;

const LEGEND = [
  { label: "Off-peak shift", swatch: "border-ct-blue/25 bg-ct-blue-soft" },
  { label: "Peak demand shift", swatch: "border-ct-purple/30 bg-ct-purple-soft" },
  { label: "Onboarding approved", swatch: "border-ct-green/40 bg-ct-green-soft" },
  { label: "Review recommended", swatch: "border-ct-amber/50 bg-ct-amber-soft" },
  { label: "Manually edited", swatch: "border-ct-peri/40 bg-ct-peri-soft" },
  { label: "Not staffed yet", swatch: "border-dashed border-border bg-ct-surface" },
];

function ShiftCard({
  shift,
  scheduled,
  highlight,
  onboardingShiftId,
  approved,
  edited,
  onEdit,
}: {
  shift: Shift;
  scheduled: boolean;
  highlight: Highlight;
  onboardingShiftId: string;
  approved: boolean;
  edited: boolean;
  onEdit?: (() => void) | undefined;
}) {
  const isOnboarding = shift.assigned.includes("noa") && shift.id === onboardingShiftId;
  const needsReview = scheduled && isOnboarding && !approved;
  const isHighlighted = highlight?.shiftId === shift.id;
  const clickable = scheduled && !!onEdit;

  return (
    <div
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={clickable ? onEdit : undefined}
      onKeyDown={
        clickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onEdit?.();
              }
            }
          : undefined
      }
      title={clickable ? "Click to change this shift manually" : undefined}
      className={cn(
        "group flex h-full flex-col gap-1.5 rounded-[12px] border p-2 transition-all",
        !scheduled && "border-dashed border-border bg-ct-surface",
        scheduled && shift.peak && "border-ct-purple/30 bg-ct-purple-soft/60",
        scheduled && !shift.peak && "border-ct-blue/25 bg-ct-blue-soft/70",
        scheduled && isOnboarding && !needsReview && "border-ct-green/40 bg-ct-green-soft",
        needsReview && "border-ct-amber/50 bg-ct-amber-soft",
        scheduled && edited && "border-ct-peri/40 bg-ct-peri-soft",
        isHighlighted && "ring-2 ring-ct-blue",
        clickable && "cursor-pointer hover:border-ct-blue hover:shadow-[0_4px_14px_rgba(32,42,54,0.10)]",
      )}
    >
      <div className="flex items-center justify-between gap-1">
        <span className="text-[12px] font-semibold">{shift.time}</span>
        <span className="flex items-center gap-1">
          {clickable && (
            <Pencil className="h-3 w-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          )}
          {shift.peak ? (
            <Badge tone="purple">Peak</Badge>
          ) : (
            <span className="text-[11px] text-muted-foreground">Off-Peak</span>
          )}
        </span>
      </div>

      <div className="flex flex-wrap gap-1">
        {shift.reqs.map((r) => (
          <Badge key={r} tone="gray" className="!text-[10px]">
            {r}
          </Badge>
        ))}
        {shift.onboardingSuitable && (
          <Badge tone="green" className="!text-[10px]">
            Onboarding Suitable
          </Badge>
        )}
        {scheduled && edited && (
          <Badge tone="periwinkle" className="!text-[10px]">
            Edited
          </Badge>
        )}
      </div>

      {scheduled ? (
        <div className="mt-0.5 space-y-1">
          {shift.assigned.map((id) => {
            const e = byId(id);
            const ring = isHighlighted && highlight!.employees.includes(id);
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
          {shift.assigned.length < shift.needs && (
            <p className="flex items-center gap-1 text-[10.5px] font-semibold text-ct-amber-ink">
              <AlertTriangle className="h-3 w-3" /> {shift.needs - shift.assigned.length} spot
              {shift.needs - shift.assigned.length === 1 ? "" : "s"} open
            </p>
          )}
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
  editedIds = [],
  onEditShift,
  locationFilter = "all",
}: {
  shifts: Shift[];
  scheduled: boolean;
  analyzing: boolean;
  highlight: Highlight;
  onboardingShiftId: string;
  approved: boolean;
  editedIds?: string[];
  onEditShift?: ((shift: Shift) => void) | undefined;
  locationFilter?: LocationId | "all";
}) {
  const locations = LOCATIONS.filter(
    (l) => locationFilter === "all" || l.id === locationFilter,
  );
  const visible = shifts.filter(
    (s) => locationFilter === "all" || s.location === locationFilter,
  );
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
        <h3 className="text-[16px] font-semibold">Weekly schedule</h3>
        <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
          {analyzing && (
            <span className="flex items-center gap-1 font-semibold text-ct-purple">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" /> Smart Scheduler working…
            </span>
          )}
          {scheduled && !analyzing && (
            <span className="flex items-center gap-1 font-medium">
              <Pencil className="h-3.5 w-3.5" /> Click any shift to change it manually
            </span>
          )}
          <span>
            {visible.length} shifts · {locations.length}{" "}
            {locations.length === 1 ? "location" : "locations"}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-b border-border bg-ct-surface/60 px-4 py-2">
        <span className="text-[11.5px] font-semibold uppercase tracking-wide text-muted-foreground">
          Color key
        </span>
        {LEGEND.map((l) => (
          <span key={l.label} className="flex items-center gap-1.5 text-[12px]">
            <span className={cn("h-3 w-3 rounded-[4px] border", l.swatch)} />
            {l.label}
          </span>
        ))}
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
                            edited={editedIds.includes(shift.id)}
                            onEdit={onEditShift ? () => onEditShift(shift) : undefined}
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
