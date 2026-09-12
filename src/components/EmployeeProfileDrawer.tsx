import { useMemo, useState } from "react";
import {
  Check,
  Info,
  MapPin,
  Sparkles,
  X,
} from "lucide-react";
import {
  DAYS,
  HOLIDAY_WEEK,
  LOCATIONS,
  POSITIONS,
  byId,
  presetLevel,
  presetReadiness,
  type Employee,
  type ExperienceProfile,
  type Familiarity,
  type Level,
  type Readiness,
} from "@/data/demo";
import { cn } from "@/lib/utils";
import { Avatar, Badge, Button } from "./ui-kit";

type Tab = "work" | "availability" | "timeoff";

const FAMILIARITY: Familiarity[] = ["New", "Familiar", "Experienced", "Not assigned"];

const PRESETS: {
  value: ExperienceProfile;
  blurb: string;
}[] = [
  {
    value: "New to the role",
    blurb: "Needs training and support while building role proficiency.",
  },
  {
    value: "Experienced, new to this business",
    blurb: "Can perform the role independently but may need location and process onboarding.",
  },
  {
    value: "Fully qualified for this role",
    blurb: "Can perform the role independently across standard operating conditions.",
  },
];

const CAPABILITIES: {
  key: keyof Readiness;
  label: string;
  explanation: string;
  options: string[];
}[] = [
  {
    key: "independentWork",
    label: "Independent Work",
    explanation: "Determines whether the employee can be assigned without an experienced teammate.",
    options: ["Requires support", "Ready"],
  },
  {
    key: "peakShifts",
    label: "Peak Shifts",
    explanation: "Used when building teams for high-demand shifts.",
    options: ["Requires support", "Ready"],
  },
  {
    key: "opening",
    label: "Opening",
    explanation: "Used for shifts that require an opener.",
    options: ["Not qualified", "Qualified"],
  },
  {
    key: "closing",
    label: "Closing",
    explanation: "Used for shifts that require a closer.",
    options: ["Not qualified", "Qualified"],
  },
  {
    key: "shiftLead",
    label: "Shift Lead",
    explanation: "Used for shifts that require a designated shift lead.",
    options: ["Not qualified", "Qualified"],
  },
  {
    key: "mentoring",
    label: "Mentoring",
    explanation: "Determines whether the employee can support a teammate in training.",
    options: ["Not eligible", "Eligible"],
  },
];

const selectCls =
  "w-full rounded-[10px] border border-border bg-card px-3 py-2 text-[13.5px] outline-none focus:border-ct-blue";
const labelCls = "block text-[12px] font-semibold text-muted-foreground";

function readyTone(v: string) {
  if (v === "Ready" || v === "Qualified" || v === "Eligible") return "green" as const;
  if (v === "Requires support") return "amber" as const;
  return "gray" as const;
}

export default function EmployeeProfileDrawer({
  employee,
  scheduledHours,
  onClose,
  onSave,
}: {
  employee: Employee;
  scheduledHours: number;
  onClose: () => void;
  onSave: (e: Employee) => void;
}) {
  const [draft, setDraft] = useState<Employee>(() => ({
    ...employee,
    skills: [...employee.skills],
    availability: [...employee.availability],
    pto: employee.pto ? [...employee.pto] : undefined,
    readiness: { ...employee.readiness },
    locationFamiliarity: { ...employee.locationFamiliarity },
    onboarding: { ...employee.onboarding },
  }));
  const [tab, setTab] = useState<Tab>("work");
  const [presetMsg, setPresetMsg] = useState(false);

  const dirty = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify({ ...employee, skills: [...employee.skills] }),
    [draft, employee],
  );

  const set = <K extends keyof Employee>(k: K, v: Employee[K]) =>
    setDraft((d) => ({ ...d, [k]: v }));
  const setReady = (k: keyof Readiness, v: string) =>
    setDraft((d) => ({ ...d, readiness: { ...d.readiness, [k]: v } }));
  const setFam = (loc: "main" | "river", v: Familiarity) =>
    setDraft((d) => ({
      ...d,
      locationFamiliarity: { ...d.locationFamiliarity, [loc]: v },
    }));

  const applyPreset = (p: ExperienceProfile) => {
    const base = presetReadiness(p);
    const level = presetLevel(p);
    setDraft((d) => ({
      ...d,
      experienceProfile: p,
      level,
      // For "Fully qualified" the spec leaves mentoring as "Not assigned" —
      // keep the manager's existing mentoring choice rather than overriding.
      readiness: {
        ...base,
        mentoring:
          p === "Fully qualified for this role" ? d.readiness.mentoring : base.mentoring,
      },
    }));
    setPresetMsg(true);
    window.setTimeout(() => setPresetMsg(false), 3000);
  };

  const isNoa = employee.id === "noa";
  const onboardingDone =
    employee.onboarding.status === "Completed" || employee.onboarding.status === "Location onboarding completed";

  return (
    <div
      className="absolute inset-0 z-50 flex justify-end bg-[#202A36]/25"
      onClick={onClose}
    >
      <aside
        className="flex h-full w-full max-w-[620px] flex-col border-l border-border bg-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-border p-5">
          <div className="flex items-start gap-3">
            <Avatar id={employee.id} size={48} />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[20px] font-semibold">{employee.name}</h2>
                <Badge tone="green">Active</Badge>
              </div>
              <p className="mt-0.5 text-[13px] text-muted-foreground">
                {employee.role} · {employee.locations}
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {isNoa ? (
                  <>
                    <Badge tone="green">NEW · WEEK 1</Badge>
                    <Badge tone="amber">Onboarding in progress</Badge>
                  </>
                ) : (
                  <Badge tone="blue">Onboarding completed</Badge>
                )}
              </div>
            </div>
          </div>
          <button
            aria-label="Close profile"
            onClick={onClose}
            className="rounded-[8px] p-1.5 text-muted-foreground hover:bg-ct-surface"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-border px-5">
          {(
            [
              ["work", "Work Profile"],
              ["availability", "Availability"],
              ["timeoff", "Time Off"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={cn(
                "relative px-3 py-2.5 text-[13.5px] font-semibold",
                tab === id ? "text-ct-blue" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {label}
              {tab === id && (
                <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-ct-blue" />
              )}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {tab === "work" && (
            <div className="grid gap-5 md:grid-cols-[1fr_220px]">
              {/* Main content column */}
              <div className="min-w-0 space-y-5">
                {/* Employment Details */}
                <section className="rounded-[14px] border border-border p-4">
                  <h3 className="text-[15px] font-semibold">Employment Details</h3>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    {[
                      ["Employment type", employee.employmentType],
                      ["Wage type", employee.wageType],
                      [
                        "Overtime eligibility",
                        employee.overtimeEligible ? "Eligible" : "Not Eligible",
                      ],
                      ["Weekly hour limit", `${draft.weeklyLimit}h`],
                      ["Current scheduled hours", `${scheduledHours}h`],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <p className={labelCls}>{k}</p>
                        <p className="mt-0.5 text-[13px] font-medium">{v}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Skills & Shift Readiness */}
                <section className="rounded-[14px] border border-border p-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-ct-purple" />
                    <h3 className="text-[15px] font-semibold">Skills & Shift Readiness</h3>
                  </div>
                  <p className="mt-1 text-[12.5px] text-muted-foreground">
                    Used by Smart Scheduler to match this employee with the right shifts and teammates.
                  </p>

                  {/* Experience Profile presets */}
                  <div className="mt-4">
                    <p className="text-[13px] font-semibold">What best describes this employee?</p>
                    <div className="mt-2 space-y-2">
                      {PRESETS.map((p) => {
                        const selected = draft.experienceProfile === p.value;
                        return (
                          <button
                            key={p.value}
                            onClick={() => applyPreset(p.value)}
                            className={cn(
                              "w-full rounded-[12px] border p-3 text-left transition-colors",
                              selected
                                ? "border-ct-blue bg-ct-blue-soft"
                                : "border-border hover:bg-ct-surface",
                            )}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[13.5px] font-semibold">{p.value}</span>
                              {selected && <Check className="h-4 w-4 text-ct-blue" />}
                            </div>
                            <p className="mt-0.5 text-[12px] text-muted-foreground">{p.blurb}</p>
                          </button>
                        );
                      })}
                    </div>
                    {presetMsg && (
                      <p className="mt-2 flex items-center gap-1.5 text-[12px] font-medium text-ct-blue">
                        <Info className="h-3.5 w-3.5" />
                        Recommended readiness settings applied. You can adjust them below.
                      </p>
                    )}
                    <p className="mt-2 text-[12px] text-muted-foreground">
                      Current level: <span className="font-semibold text-foreground">{draft.level}</span>
                    </p>
                  </div>

                  {/* Readiness capabilities */}
                  <div className="mt-4">
                    <p className="text-[13px] font-semibold">Readiness capabilities</p>
                    <div className="mt-2 divide-y divide-border rounded-[12px] border border-border">
                      {CAPABILITIES.map((c) => (
                        <div key={c.key} className="grid grid-cols-[1fr_150px] items-center gap-3 px-3 py-2.5">
                          <div>
                            <p className="text-[12.5px] font-semibold">{c.label}</p>
                            <p className="text-[11.5px] text-muted-foreground">{c.explanation}</p>
                          </div>
                          <div className="flex items-center justify-end gap-2">
                            <Badge tone={readyTone(draft.readiness[c.key])}>
                              {draft.readiness[c.key]}
                            </Badge>
                            <select
                              className="rounded-[8px] border border-border bg-card px-2 py-1 text-[12px] outline-none focus:border-ct-blue"
                              value={draft.readiness[c.key]}
                              onChange={(e) => setReady(c.key, e.target.value)}
                            >
                              {c.options.map((o) => (
                                <option key={o} value={o}>
                                  {o}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Location familiarity */}
                  <div className="mt-4">
                    <p className="text-[13px] font-semibold">Location Familiarity</p>
                    <p className="text-[11.5px] text-muted-foreground">
                      Used as a soft scheduling preference, not a hard constraint.
                    </p>
                    <div className="mt-2 space-y-2">
                      {LOCATIONS.map((l) => (
                        <div key={l.id} className="flex items-center justify-between gap-3">
                          <span className="flex items-center gap-1.5 text-[12.5px] font-medium">
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground" /> {l.name}
                          </span>
                          <select
                            className="w-[150px] rounded-[8px] border border-border bg-card px-2 py-1 text-[12px] outline-none focus:border-ct-blue"
                            value={draft.locationFamiliarity[l.id]}
                            onChange={(e) => setFam(l.id, e.target.value as Familiarity)}
                          >
                            {FAMILIARITY.map((f) => (
                              <option key={f} value={f}>
                                {f}
                              </option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Onboarding progress */}
                  <div className="mt-4">
                    <p className="text-[13px] font-semibold">Onboarding Progress</p>
                    {onboardingDone ? (
                      <div className="mt-2 rounded-[10px] bg-ct-green-soft px-3 py-2 text-[12.5px] font-medium text-ct-green">
                        Onboarding completed
                      </div>
                    ) : (
                      <div className="mt-2 space-y-1.5 rounded-[12px] border border-border p-3 text-[12.5px]">
                        <Row k="Onboarding pack" v={employee.onboarding.pack ?? "—"} />
                        <Row
                          k="Completion"
                          v={`${employee.onboarding.progressPct ?? 0}%`}
                        />
                        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-ct-surface">
                          <div
                            className="h-1.5 rounded-full bg-ct-blue"
                            style={{ width: `${employee.onboarding.progressPct ?? 0}%` }}
                          />
                        </div>
                        <Row
                          k="Supported shifts"
                          v={`${employee.onboarding.supportedShiftsDone ?? 0} of ${employee.onboarding.supportedShiftsTarget ?? 0} completed`}
                        />
                        <Row
                          k="Next readiness review"
                          v={employee.onboarding.nextReview ?? "—"}
                        />
                      </div>
                    )}
                  </div>
                </section>
              </div>

              {/* Right summary column */}
              <div className="space-y-3 rounded-[14px] border border-border bg-ct-surface/50 p-4">
                <div>
                  <label className={labelCls}>Position</label>
                  <select
                    className={selectCls}
                    value={draft.role}
                    onChange={(e) => set("role", e.target.value)}
                  >
                    {POSITIONS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Employment Start Date</label>
                  <p className="mt-1 text-[13px] font-medium">{employee.startDate}</p>
                </div>
                <div>
                  <label className={labelCls}>Direct Manager</label>
                  <p className="mt-1 text-[13px] font-medium">{employee.directManager}</p>
                </div>
                <div>
                  <label className={labelCls}>Primary Location</label>
                  <select
                    className={selectCls}
                    value={draft.primaryLocation}
                    onChange={(e) => set("primaryLocation", e.target.value as Employee["primaryLocation"])}
                  >
                    <option value="main">Main Café</option>
                    <option value="river">Riverside Coffee Cart</option>
                    <option value="both">Both Locations</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Weekly Hour Limit</label>
                  <input
                    type="number"
                    min={0}
                    className={selectCls}
                    value={draft.weeklyLimit}
                    onChange={(e) => set("weeklyLimit", Number(e.target.value))}
                  />
                </div>
                <div className="border-t border-border pt-2">
                  <label className={labelCls}>Overtime eligibility</label>
                  <select
                    className={selectCls}
                    value={draft.overtimeEligible ? "yes" : "no"}
                    onChange={(e) => set("overtimeEligible", e.target.value === "yes")}
                  >
                    <option value="yes">Eligible</option>
                    <option value="no">Not Eligible</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {tab === "availability" && (
            <div className="space-y-4">
              <h3 className="text-[15px] font-semibold">Weekly availability</h3>
              <p className="text-[12.5px] text-muted-foreground">
                Employees manage availability from the mobile app.
              </p>
              <div className="rounded-[12px] border border-ct-amber/40 bg-ct-amber-soft/60 p-3 text-[12.5px]">
                <p className="font-semibold">
                  {HOLIDAY_WEEK.name} week — wider availability requested
                </p>
                <p className="mt-0.5 text-muted-foreground">
                  {HOLIDAY_WEEK.demandNote} {HOLIDAY_WEEK.earlyCloseNote}
                </p>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {DAYS.map((d, i) => {
                  const avail = employee.availability.includes(i);
                  const pto = employee.pto?.includes(i);
                  return (
                    <div
                      key={d.label}
                      className={cn(
                        "rounded-[10px] border p-2 text-center text-[12px]",
                        pto
                          ? "border-ct-amber/40 bg-ct-amber-soft"
                          : avail
                            ? "border-ct-green/30 bg-ct-green-soft"
                            : "border-border bg-ct-surface",
                      )}
                    >
                      <div className="font-semibold">{d.label}</div>
                      <div className="text-muted-foreground">{d.date}</div>
                      <div className="mt-1 font-semibold">
                        {pto ? "PTO" : avail ? "Available" : "Not available"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {tab === "timeoff" && (
            <div className="space-y-4">
              <h3 className="text-[15px] font-semibold">Time off</h3>
              {(employee.pto?.length ?? 0) > 0 ? (
                <div className="rounded-[12px] border border-border p-3">
                  <p className="text-[13px] font-semibold">Approved time off</p>
                  <ul className="mt-1.5 space-y-1 text-[12.5px]">
                    {employee.pto!.map((d) => (
                      <li key={d} className="flex items-center gap-2">
                        <Check className="h-3.5 w-3.5 text-ct-green" />
                        {DAYS[d]!.label}, {DAYS[d]!.date}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="rounded-[12px] border border-dashed border-border p-4 text-[12.5px] text-muted-foreground">
                  No approved time off.
                </div>
              )}
              <div className="rounded-[12px] border border-dashed border-border p-4 text-[12.5px] text-muted-foreground">
                No pending requests.
              </div>
              <p className="text-[12px] text-muted-foreground">
                No upcoming requests. Sick leave is treated as an unexpected operational event and is
                outside the scope of this prototype.
              </p>
            </div>
          )}
        </div>

        {/* Sticky footer */}
        <div className="flex items-center justify-between gap-3 border-t border-border p-4">
          {dirty ? (
            <span className="flex items-center gap-1.5 text-[12.5px] font-semibold text-ct-amber">
              <span className="h-2 w-2 rounded-full bg-ct-amber" /> Unsaved changes
            </span>
          ) : (
            <span className="text-[12.5px] text-muted-foreground">All changes saved</span>
          )}
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={!dirty}
              onClick={() => onSave(draft)}
            >
              <Check className="h-4 w-4" /> Save Work Profile
            </Button>
          </div>
        </div>
      </aside>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-medium">{v}</span>
    </div>
  );
}
