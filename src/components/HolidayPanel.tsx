import { useState } from "react";
import {
  AlertTriangle,
  ArrowLeftRight,
  Check,
  Clock,
  Gift,
  PartyPopper,
  Send,
  Sunrise,
} from "lucide-react";
import {
  AVAILABILITY_REQUEST_MESSAGE,
  COVER_REQUEST,
  DAYS,
  HOLIDAY_WEEK,
  OPEN_GAP,
  byId,
} from "@/data/demo";
import { Avatar, Badge, Button, Card } from "./ui-kit";
import { cn } from "@/lib/utils";

export type HolidayState = {
  requestSent: boolean;
  responses: string[];
  mayaAsked: boolean;
  mayaAccepted: boolean;
  coverRequested: boolean;
  coverTakenBy: string | null;
};

export default function HolidayPanel({
  state,
  onSendRequest,
  onAskMaya,
  onRequestCover,
}: {
  state: HolidayState;
  onSendRequest: (message: string) => void;
  onAskMaya: () => void;
  onRequestCover: () => void;
}) {
  const [message, setMessage] = useState(AVAILABILITY_REQUEST_MESSAGE);
  const [open, setOpen] = useState(true);
  const maya = byId(OPEN_GAP.suggestion.empId);
  const sick = byId(COVER_REQUEST.empId);

  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <PartyPopper className="h-4 w-4 text-ct-purple" />
            <h2 className="text-[18px] font-semibold">Holiday week detected</h2>
            <Badge tone="purple">{HOLIDAY_WEEK.name}</Badge>
            <Badge tone="amber">Higher demand</Badge>
          </div>
          <p className="mt-1 text-[12.5px] text-muted-foreground">
            {HOLIDAY_WEEK.eveLabel} · {HOLIDAY_WEEK.source}
          </p>
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="shrink-0 text-[13px] font-semibold text-ct-link hover:underline"
        >
          {open ? "Hide details" : "Show details"}
        </button>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <div className="rounded-[12px] border border-ct-amber/30 bg-ct-amber-soft/60 px-3 py-2.5 text-[12.5px]">
          <p className="font-semibold">Demand</p>
          <p className="mt-0.5 text-muted-foreground">{HOLIDAY_WEEK.demandNote}</p>
          <div className="mt-1.5 flex gap-1">
            {DAYS.map((d, i) => (
              <span
                key={d.label}
                className={cn(
                  "rounded-[7px] border px-1.5 py-0.5 text-[11px] font-semibold",
                  HOLIDAY_WEEK.demandDays.includes(i)
                    ? "border-ct-amber/40 bg-ct-amber text-white"
                    : "border-border bg-card text-muted-foreground",
                )}
              >
                {d.label}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-[12px] border border-border bg-ct-surface px-3 py-2.5 text-[12.5px]">
          <p className="font-semibold">Opening hours</p>
          <p className="mt-0.5 text-muted-foreground">{HOLIDAY_WEEK.earlyCloseNote}</p>
        </div>
      </div>

      {open && (
        <div className="mt-3 space-y-3">
          {/* 1. Availability request */}
          <div className="rounded-[14px] border border-border p-3.5">
            <div className="flex flex-wrap items-center gap-2">
              <Gift className="h-4 w-4 text-ct-blue" />
              <h3 className="text-[14.5px] font-semibold">Ask the team for wider availability</h3>
              {state.requestSent && <Badge tone="green">Sent to 6 employees</Badge>}
            </div>
            {state.requestSent ? (
              <>
                <p className="mt-2 rounded-[10px] bg-ct-blue-soft p-2.5 text-[12.5px]">{message}</p>
                <div className="mt-2 space-y-1.5">
                  {state.responses.length === 0 ? (
                    <p className="text-[12.5px] text-muted-foreground">
                      Waiting for responses in the employee app…
                    </p>
                  ) : (
                    state.responses.map((r) => (
                      <p
                        key={r}
                        className="flex items-center gap-2 text-[12.5px] font-medium text-ct-green"
                      >
                        <Check className="h-3.5 w-3.5" /> {r}
                      </p>
                    ))
                  )}
                </div>
              </>
            ) : (
              <>
                <p className="mt-1 text-[12.5px] text-muted-foreground">
                  The message explains why the week is different, keeps it non-committal, and offers
                  a gift voucher for extra holiday shifts.
                </p>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="mt-2 w-full rounded-[10px] border border-border bg-card p-2.5 text-[12.5px] outline-none focus:border-ct-blue"
                />
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Button size="sm" onClick={() => onSendRequest(message)}>
                    <Send className="h-4 w-4" /> Send Availability Request
                  </Button>
                  <span className="text-[12px] text-muted-foreground">
                    Recipients: 6 employees · Incentive: gift voucher
                  </span>
                </div>
              </>
            )}
          </div>

          {/* 2. Opening gap */}
          <div className="rounded-[14px] border border-border p-3.5">
            <div className="flex flex-wrap items-center gap-2">
              <Sunrise className="h-4 w-4 text-ct-amber-ink" />
              <h3 className="text-[14.5px] font-semibold">No one can open at {OPEN_GAP.opensAt}</h3>
              <Badge tone="amber">Coverage gap</Badge>
            </div>
            <p className="mt-1 text-[12.5px] text-muted-foreground">
              {OPEN_GAP.day} · {OPEN_GAP.location} — {OPEN_GAP.candidates.length} employees
              submitted {OPEN_GAP.submittedAt} and the location opens at {OPEN_GAP.opensAt}.
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2.5 rounded-[10px] bg-ct-surface p-2.5">
              <Avatar id={maya.id} size={30} />
              <div className="min-w-0 text-[12.5px]">
                <p className="font-semibold">
                  Suggestion: move {maya.short} from {OPEN_GAP.suggestion.from} to{" "}
                  {OPEN_GAP.suggestion.to}
                </p>
                <p className="text-muted-foreground">{OPEN_GAP.suggestion.why}</p>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2">
              {state.mayaAccepted ? (
                <Badge tone="green">
                  <Check className="h-3 w-3" /> {maya.short} accepted — opens at{" "}
                  {OPEN_GAP.opensAt}
                </Badge>
              ) : state.mayaAsked ? (
                <Badge tone="blue">
                  <Clock className="h-3 w-3" /> Asked {maya.short} — awaiting reply
                </Badge>
              ) : (
                <Button size="sm" variant="secondary" onClick={onAskMaya}>
                  Ask {maya.short} to Shift One Hour Earlier
                </Button>
              )}
            </div>
          </div>

          {/* 3. Sick cover */}
          <div className="rounded-[14px] border border-border p-3.5">
            <div className="flex flex-wrap items-center gap-2">
              <ArrowLeftRight className="h-4 w-4 text-ct-blue" />
              <h3 className="text-[14.5px] font-semibold">
                {sick.short} needs a replacement
              </h3>
              <Badge tone="red">
                <AlertTriangle className="h-3 w-3" /> {COVER_REQUEST.reason}
              </Badge>
            </div>
            <p className="mt-1 text-[12.5px] text-muted-foreground">
              {COVER_REQUEST.day} · {COVER_REQUEST.time} · {COVER_REQUEST.location}.{" "}
              {COVER_REQUEST.candidateNote}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {COVER_REQUEST.candidates.map((id) => {
                const e = byId(id);
                return (
                  <span
                    key={id}
                    className="flex items-center gap-2 rounded-full border border-border bg-card px-2.5 py-1 text-[12.5px] font-medium"
                  >
                    <Avatar id={id} size={20} /> {e.short} · available
                  </span>
                );
              })}
            </div>
            <div className="mt-2">
              {state.coverTakenBy ? (
                <Badge tone="green">
                  <Check className="h-3 w-3" /> {state.coverTakenBy} took the shift
                </Badge>
              ) : state.coverRequested ? (
                <Badge tone="blue">
                  <Clock className="h-3 w-3" /> Cover request sent to both employees
                </Badge>
              ) : (
                <Button size="sm" variant="secondary" onClick={onRequestCover}>
                  Send Cover Request
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
