import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  MapPin,
  RotateCcw,
  Sparkles,
  UserPlus,
  Users,
} from "lucide-react";
import {
  ANALYSIS_STEPS,
  ONBOARDING,
  shiftsFor,
  type OnboardingChoice,
} from "@/data/demo";
import { Badge, Button, Card, Sparkle } from "@/components/ui-kit";
import TopNav from "@/components/TopNav";
import RulesPanel from "@/components/RulesPanel";
import EmployeeRail from "@/components/EmployeeRail";
import ScheduleGrid, { type Highlight } from "@/components/ScheduleGrid";
import DecisionPanel from "@/components/DecisionPanel";
import EditModal from "@/components/EditModal";
import MobileSim from "@/components/MobileSim";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Smart Team Scheduler — Bean & Bloom Weekly Schedule" },
      {
        name: "description",
        content:
          "Connecteam Smart Team Scheduler prototype: build an explainable weekly café schedule that balances availability, skills, peak demand, and new-employee onboarding.",
      },
      { property: "og:title", content: "Connecteam Smart Team Scheduler" },
      {
        property: "og:description",
        content:
          "Build the right team for every shift — an explainable weekly schedule draft with the manager always in control.",
      },
    ],
  }),
  component: Index,
});

type Phase = "initial" | "analyzing" | "draft" | "published";

const inputs = [
  { icon: Calendar, label: "14 shifts need staffing" },
  { icon: Clock, label: "5 availability constraints" },
  { icon: Users, label: "2 approved PTO requests" },
  { icon: AlertTriangle, label: "2 peak-demand shifts" },
  { icon: UserPlus, label: "1 new employee in onboarding" },
  { icon: MapPin, label: "2 business locations" },
];

const metrics = [
  { label: "14 of 14 shifts covered", tone: "green" as const },
  { label: "5 availability constraints respected", tone: "green" as const },
  { label: "2 PTO requests respected", tone: "green" as const },
  { label: "2 peak shifts properly staffed", tone: "purple" as const },
  { label: "1 onboarding shift created", tone: "green" as const },
  { label: "0 hard conflicts", tone: "green" as const },
  { label: "1 decision recommended for review", tone: "amber" as const },
];

function Index() {
  const [phase, setPhase] = useState<Phase>("initial");
  const [step, setStep] = useState(0);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [decisionsOpen, setDecisionsOpen] = useState(false);
  const [showAlternative, setShowAlternative] = useState(false);
  const [choice, setChoice] = useState<OnboardingChoice>("recommended");
  const [approved, setApproved] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  const [highlight, setHighlight] = useState<Highlight>(null);
  const [toast, setToast] = useState<string | null>(null);
  const timers = useRef<number[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const showToast = (msg: string) => {
    setToast(msg);
    timers.current.push(
      window.setTimeout(() => setToast(null), 3600),
    );
  };

  const generate = () => {
    setPhase("analyzing");
    setStep(0);
    ANALYSIS_STEPS.forEach((_, i) => {
      if (i === 0) return;
      timers.current.push(window.setTimeout(() => setStep(i), i * 500));
    });
    timers.current.push(
      window.setTimeout(() => {
        setPhase("draft");
        showToast("Schedule draft generated. 0 hard conflicts found.");
      }, 2000),
    );
  };

  const reset = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setPhase("initial");
    setStep(0);
    setRulesOpen(false);
    setDecisionsOpen(false);
    setShowAlternative(false);
    setChoice("recommended");
    setApproved(false);
    setEditOpen(false);
    setAcknowledged(false);
    setHighlight(null);
    setToast(null);
  };

  const publish = () => {
    setPhase("published");
    setDecisionsOpen(false);
    showToast("Schedule published. Employees have been notified.");
  };

  const scheduled = phase === "draft" || phase === "published";
  const shifts = shiftsFor(choice);
  const onboardingShiftId = ONBOARDING[choice].shiftId;

  const viewTeam = () => {
    setHighlight({ shiftId: "m-thu", employees: ["dana", "eli", "tom"] });
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    timers.current.push(window.setTimeout(() => setHighlight(null), 4000));
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      <TopNav />

      <div className="flex flex-col gap-5 p-5 xl:flex-row">
        {/* LEFT: web admin */}
        <main className="relative min-w-0 flex-1 xl:basis-[68%]">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[12.5px] text-muted-foreground">Operations / Job Scheduler</p>
              <h1 className="mt-1 text-[30px] font-semibold leading-tight">
                Bean &amp; Bloom Schedule
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-[13px]">
                <span className="rounded-[8px] border border-border bg-card px-2.5 py-1 font-medium">
                  Sep 13–Sep 19, 2026
                </span>
                <span className="rounded-[8px] border border-border bg-card px-2.5 py-1 font-medium">
                  All Locations
                </span>
                {phase === "published" ? (
                  <Badge tone="green">Published</Badge>
                ) : (
                  <Badge tone="gray">Draft</Badge>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button variant="secondary" onClick={reset}>
                <RotateCcw className="h-4 w-4" /> Reset Demo
              </Button>
              <Button
                onClick={generate}
                disabled={phase === "analyzing" || phase === "published"}
                title={
                  phase === "published"
                    ? "Schedule is published — reset the demo to generate again"
                    : undefined
                }
              >
                <Sparkle className="text-white" />
                {phase === "analyzing" ? "Analyzing…" : "Generate Smart Schedule"}
              </Button>
            </div>
          </div>

          <div className="mt-4">
            <div className="min-w-0 space-y-4">
              {/* State 1 overview */}
              {phase === "initial" && (
                <Card className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-[18px] font-semibold">
                        Ready to build next week’s schedule
                      </h2>
                      <p className="mt-1 max-w-[62ch] text-[13px] text-muted-foreground">
                        The scheduler will consider availability, skills, experience, location,
                        weekly hours, demand, and team composition.
                      </p>
                    </div>
                    <button
                      onClick={() => setRulesOpen(true)}
                      className="shrink-0 text-[13px] font-semibold text-ct-link hover:underline"
                    >
                      Review scheduling rules
                    </button>
                  </div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {inputs.map((i) => {
                      const Icon = i.icon;
                      return (
                        <div
                          key={i.label}
                          className="flex items-center gap-2 rounded-[12px] border border-border bg-ct-surface px-3 py-2.5 text-[13px] font-medium"
                        >
                          <Icon className="h-4 w-4 text-ct-blue" />
                          {i.label}
                        </div>
                      );
                    })}
                  </div>
                </Card>
              )}

              {/* State 2 analysis */}
              {phase === "analyzing" && (
                <Card className="p-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-ct-purple" />
                    <h2 className="text-[16px] font-semibold">Smart Scheduler analysis</h2>
                    <span className="ml-auto text-[12.5px] text-muted-foreground">
                      Step {step + 1} of {ANALYSIS_STEPS.length}
                    </span>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ct-surface">
                    <div
                      className="h-1.5 rounded-full bg-ct-blue transition-all duration-500"
                      style={{ width: `${((step + 1) / ANALYSIS_STEPS.length) * 100}%` }}
                    />
                  </div>
                  <ul className="mt-3 space-y-1.5">
                    {ANALYSIS_STEPS.map((s, i) => (
                      <li
                        key={s}
                        className={
                          i <= step
                            ? "flex items-center gap-2 text-[13px] font-medium"
                            : "flex items-center gap-2 text-[13px] text-muted-foreground/70"
                        }
                      >
                        {i < step ? (
                          <CheckCircle2 className="h-4 w-4 text-ct-green" />
                        ) : (
                          <span
                            className={
                              i === step
                                ? "h-3.5 w-3.5 animate-pulse rounded-full border-2 border-ct-blue"
                                : "h-3.5 w-3.5 rounded-full border-2 border-border"
                            }
                          />
                        )}
                        {s}
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {/* State 3 summary */}
              {scheduled && (
                <Card className="p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-ct-purple" />
                        <h2 className="text-[18px] font-semibold">
                          {phase === "published" ? "Schedule published" : "Schedule draft ready"}
                        </h2>
                      </div>
                      <p className="mt-1 text-[13px] text-muted-foreground">
                        {phase === "published"
                          ? "Your team has been notified in the Connecteam app."
                          : "Review the key decisions before publishing — you keep the final call."}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => setDecisionsOpen(true)}
                        disabled={phase === "published"}
                      >
                        Review Key Decisions <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button onClick={publish} disabled={phase === "published"}>
                        {phase === "published" ? "Published" : "Publish Schedule"}
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {metrics.map((m) => (
                      <Badge key={m.label} tone={m.tone} className="!px-2.5 !py-1 !text-[12px]">
                        {m.label}
                      </Badge>
                    ))}
                  </div>
                </Card>
              )}

              <div ref={gridRef}>
                <ScheduleGrid
                  shifts={shifts}
                  scheduled={scheduled}
                  analyzing={phase === "analyzing"}
                  highlight={highlight}
                  onboardingShiftId={onboardingShiftId}
                  approved={approved}
                />
              </div>

              <EmployeeRail shifts={shifts} scheduled={scheduled} />
            </div>

            {/* State 4 decision panel — overlays the dashboard column only */}
            {decisionsOpen && scheduled && (
              <div className="pointer-events-none absolute inset-y-0 right-0 z-30 flex w-full max-w-[410px] justify-end p-1">
                <div className="pointer-events-auto sticky top-20 flex max-h-[calc(100vh-6rem)] w-full overflow-hidden rounded-[18px] shadow-[0_12px_40px_rgba(32,42,54,0.16)]">
                  <DecisionPanel
                    onClose={() => setDecisionsOpen(false)}
                    onViewTeam={viewTeam}
                    showAlternative={showAlternative}
                    onToggleAlternative={() => setShowAlternative((v) => !v)}
                    choice={choice}
                    onChoose={(c) => {
                      setChoice(c);
                      showToast(
                        c === "recommended"
                          ? "Recommended assignment kept — Sunday with Yossi."
                          : "Alternative selected — Saturday with Dana.",
                      );
                    }}
                    approved={approved}
                    onApprove={() => {
                      setApproved(true);
                      showToast("Onboarding assignment approved.");
                    }}
                    onEditManually={() => setEditOpen(true)}
                  />
                </div>
              </div>
            )}
          </div>
        </main>

        {/* RIGHT: mobile simulator */}
        <aside className="shrink-0 xl:basis-[32%]">
          <div className="xl:sticky xl:top-20">
            <MobileSim
              published={phase === "published"}
              choice={choice}
              acknowledged={acknowledged}
              onAcknowledge={() => setAcknowledged(true)}
            />
          </div>
        </aside>
      </div>

      {rulesOpen && <RulesPanel onClose={() => setRulesOpen(false)} />}
      {editOpen && (
        <EditModal
          choice={choice}
          onClose={() => setEditOpen(false)}
          onSave={(c) => {
            setChoice(c);
            setEditOpen(false);
            if (c === "alternative") setShowAlternative(true);
            showToast("Manual assignment saved.");
          }}
        />
      )}

      {toast && (
        <div className="fixed bottom-5 left-1/2 z-[60] -translate-x-1/2 rounded-[12px] border border-border bg-card px-4 py-3 shadow-[0_10px_30px_rgba(32,42,54,0.18)]">
          <p className="flex items-center gap-2 text-[13.5px] font-medium">
            <CheckCircle2 className="h-4 w-4 text-ct-green" />
            {toast}
          </p>
        </div>
      )}
    </div>
  );
}
