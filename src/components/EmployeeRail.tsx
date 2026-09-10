import { EMPLOYEES, weeklyHours, type Shift } from "@/data/demo";
import { Avatar, Badge, Card } from "./ui-kit";

export default function EmployeeRail({
  shifts,
  scheduled,
}: {
  shifts: Shift[];
  scheduled: boolean;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[16px] font-semibold">Team · Bean &amp; Bloom</h3>
        <span className="text-[12px] text-muted-foreground">6 of 24 shown</span>
      </div>
      <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
        {EMPLOYEES.map((e) => {
          const hours = scheduled ? weeklyHours(shifts, e.id) : 0;
          return (
            <div key={e.id} className="rounded-[12px] border border-border p-3">
              <div className="flex items-start gap-2.5">
                <Avatar id={e.id} size={32} />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[14px] font-semibold">{e.name}</span>
                    {e.isNew && <Badge tone="green">NEW · WEEK 1</Badge>}
                  </div>
                  <p className="text-[12px] text-muted-foreground">
                    {e.role} · {e.experience}
                  </p>
                </div>
              </div>
              <p className="mt-2 text-[12px] text-muted-foreground">{e.locations}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {e.skills.map((s) => (
                  <Badge key={s} tone={s === "Mentor Eligible" ? "periwinkle" : "blue"}>
                    {s}
                  </Badge>
                ))}
                {e.pto?.length ? <Badge tone="amber">PTO approved</Badge> : null}
              </div>
              <div className="mt-2.5 border-t border-border pt-2 text-[12px] text-muted-foreground">
                {scheduled ? (
                  <span>
                    <span className="font-semibold text-foreground">{hours}h</span> /{" "}
                    {e.weeklyLimit}h weekly limit
                  </span>
                ) : (
                  <span>Limit {e.weeklyLimit}h · not yet scheduled</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
