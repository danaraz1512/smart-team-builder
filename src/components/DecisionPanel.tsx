import { Check, Info, Pencil, Sparkles, X } from "lucide-react";
import { ONBOARDING, byId, type OnboardingChoice } from "@/data/demo";
import { Avatar, Badge, Button } from "./ui-kit";

const peakTeam = [
  { id: "dana" as const, note: "Shift Lead" },
  { id: "eli" as const, note: "Experienced Barista · Qualified Closer" },
  { id: "tom" as const, note: "Cashier" },
];

const peakWhy = [
  "Dana provides required shift-lead coverage.",
  "Eli is qualified to close the location.",
  "All assigned employees are available.",
  "The team has sufficient peak-shift experience.",
  "Noa was not assigned because this is a peak shift and no onboarding mentor is available.",
];

const recWhy = [
  "Noa and Yossi are both available.",
  "The shift is off-peak.",
  "The location has enough coverage for guided learning.",
  "Yossi is mentor-eligible and familiar with the Main Café.",
  "Noa’s weekly-hour limit remains protected.",
];

const altWhy = [
  "Both employees are available.",
  "Dana is experienced.",
  "Saturday demand is higher than Sunday.",
  "This option is valid, but less suitable for a first shift.",
];

function Why({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 space-y-1.5">
      {items.map((w) => (
        <li key={w} className="flex gap-2 text-[13px] text-muted-foreground">
          <Check className="mt-[3px] h-3.5 w-3.5 shrink-0 text-ct-blue" />
          <span>{w}</span>
        </li>
      ))}
    </ul>
  );
}

export default function DecisionPanel({
  onClose,
  onViewTeam,
  showAlternative,
  onToggleAlternative,
  choice,
  onChoose,
  approved,
  onApprove,
  onEditManually,
}: {
  onClose: () => void;
  onViewTeam: () => void;
  showAlternative: boolean;
  onToggleAlternative: () => void;
  choice: OnboardingChoice;
  onChoose: (c: OnboardingChoice) => void;
  approved: boolean;
  onApprove: () => void;
  onEditManually: () => void;
}) {
  const rec = ONBOARDING.recommended;
  const alt = ONBOARDING.alternative;

  return (
    <aside className="flex h-full w-full flex-col overflow-y-auto rounded-[18px] border border-border bg-card">
      <div className="flex items-start justify-between gap-2 border-b border-border p-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-ct-purple" />
            <h2 className="text-[18px] font-semibold">Why this schedule works</h2>
          </div>
          <p className="mt-1 flex items-center gap-1 text-[12.5px] text-muted-foreground">
            <Info className="h-3.5 w-3.5" /> AI recommends. You decide.
          </p>
        </div>
        <button
          aria-label="Close decisions"
          onClick={onClose}
          className="rounded-[8px] p-1.5 text-muted-foreground hover:bg-ct-surface"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-4 p-4">
        {/* Decision 1 */}
        <section className="rounded-[14px] border border-border p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-[16px] font-semibold">Thursday Evening · Main Café</h3>
              <p className="text-[12.5px] text-muted-foreground">17:00–22:00 · Peak Demand</p>
            </div>
            <Badge tone="purple">Peak</Badge>
          </div>

          <div className="mt-3 space-y-1.5">
            {peakTeam.map((m) => (
              <div key={m.id} className="flex items-center gap-2 rounded-[10px] bg-ct-surface p-2">
                <Avatar id={m.id} size={26} />
                <span className="text-[13px] font-semibold">{byId(m.id).short}</span>
                <span className="text-[12px] text-muted-foreground">· {m.note}</span>
              </div>
            ))}
          </div>

          <Why items={peakWhy} />

          <div className="mt-4 flex items-center justify-between gap-2">
            <Badge tone="blue">High-confidence assignment</Badge>
            <Button variant="secondary" size="sm" onClick={onViewTeam}>
              View Team
            </Button>
          </div>
        </section>

        {/* Decision 2 */}
        <section className="rounded-[14px] border border-border p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-[16px] font-semibold">Noa’s First Shift</h3>
              <p className="text-[12.5px] text-muted-foreground">New employee · Week 1</p>
            </div>
            {approved ? <Badge tone="green">Approved</Badge> : <Badge tone="amber">Review</Badge>}
          </div>

          <div
            className={
              choice === "recommended"
                ? "mt-3 rounded-[12px] border border-ct-green/40 bg-ct-green-soft p-3"
                : "mt-3 rounded-[12px] border border-border p-3"
            }
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[13.5px] font-semibold">
                {rec.dayLabel} · {rec.time} · {rec.location}
              </span>
              {choice === "recommended" && <Badge tone="green">Selected</Badge>}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Avatar id={rec.buddy} size={26} />
              <span className="text-[12.5px]">
                <span className="font-semibold">Yossi</span> — Senior Barista and Onboarding Mentor
              </span>
            </div>
            <Why items={recWhy} />
            <div className="mt-3">
              <Badge tone="green">Recommended onboarding assignment</Badge>
            </div>
          </div>

          {showAlternative && (
            <div
              className={
                choice === "alternative"
                  ? "mt-3 rounded-[12px] border border-ct-amber/50 bg-ct-amber-soft p-3"
                  : "mt-3 rounded-[12px] border border-border p-3"
              }
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[13.5px] font-semibold">
                  {alt.dayLabel} · {alt.time} · {alt.location}
                </span>
                {choice === "alternative" && <Badge tone="amber">Selected</Badge>}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Avatar id={alt.buddy} size={26} />
                <span className="text-[12.5px]">
                  <span className="font-semibold">Dana</span> — Senior Shift Lead
                </span>
              </div>
              <Why items={altWhy} />
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge tone="amber">Valid · Less Preferred</Badge>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button size="sm" onClick={() => onChoose("recommended")}>
                  Keep Recommended Assignment
                </Button>
                <Button variant="secondary" size="sm" onClick={() => onChoose("alternative")}>
                  Choose Alternative
                </Button>
              </div>
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button size="sm" variant={approved ? "success" : "primary"} onClick={onApprove}>
              {approved ? (
                <>
                  <Check className="h-4 w-4" /> Assignment Approved
                </>
              ) : (
                "Approve Assignment"
              )}
            </Button>
            <Button variant="secondary" size="sm" onClick={onToggleAlternative}>
              {showAlternative ? "Hide Alternative" : "View Alternative"}
            </Button>
            <Button variant="ghost" size="sm" onClick={onEditManually}>
              <Pencil className="h-3.5 w-3.5" /> Edit Manually
            </Button>
          </div>
        </section>
      </div>
    </aside>
  );
}
