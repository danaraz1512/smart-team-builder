import { useState } from "react";
import { X } from "lucide-react";
import { ONBOARDING, type OnboardingChoice } from "@/data/demo";
import { Badge, Button } from "./ui-kit";

const selectCls =
  "mt-1 w-full rounded-[10px] border border-border bg-card px-3 py-2 text-[13.5px] outline-none focus:border-ct-blue";

export default function EditModal({
  choice,
  onClose,
  onSave,
}: {
  choice: OnboardingChoice;
  onClose: () => void;
  onSave: (c: OnboardingChoice) => void;
}) {
  const [next, setNext] = useState<OnboardingChoice>(choice);
  const target = ONBOARDING[next];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#202A36]/30 p-4">
      <div className="w-full max-w-[440px] rounded-[18px] border border-border bg-card p-5">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-[18px] font-semibold">Edit Noa’s first shift</h2>
            <p className="mt-1 text-[12.5px] text-muted-foreground">
              Manual changes always override the recommendation.
            </p>
          </div>
          <button
            aria-label="Close editor"
            onClick={onClose}
            className="rounded-[8px] p-1.5 text-muted-foreground hover:bg-ct-surface"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <label className="block text-[12.5px] font-semibold">
            Shift
            <select
              className={selectCls}
              value={next}
              onChange={(e) => setNext(e.target.value as OnboardingChoice)}
            >
              <option value="recommended">Sunday, Sep 13 · 10:00–14:00 (Off-Peak)</option>
              <option value="alternative">Saturday, Sep 19 · 09:00–13:00 (Higher demand)</option>
            </select>
          </label>

          <label className="block text-[12.5px] font-semibold">
            Location
            <select className={selectCls} value="main" disabled>
              <option value="main">Main Café (Noa’s trained location)</option>
            </select>
          </label>

          <label className="block text-[12.5px] font-semibold">
            Onboarding buddy
            <select className={selectCls} value={target.buddy} disabled>
              <option value="yossi">Yossi Cohen — Senior Barista · Mentor</option>
              <option value="dana">Dana Levi — Senior Shift Lead</option>
            </select>
          </label>

          <div className="rounded-[12px] bg-ct-blue-soft p-3 text-[12.5px] text-foreground">
            Buddy follows the selected shift:{" "}
            <span className="font-semibold">
              {next === "recommended" ? "Yossi Cohen" : "Dana Levi"}
            </span>{" "}
            is the experienced teammate on that shift.
            <div className="mt-2">
              {next === "recommended" ? (
                <Badge tone="green">Recommended</Badge>
              ) : (
                <Badge tone="amber">Valid · Less Preferred</Badge>
              )}
            </div>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={() => onSave(next)}>
            Save Assignment
          </Button>
        </div>
      </div>
    </div>
  );
}
