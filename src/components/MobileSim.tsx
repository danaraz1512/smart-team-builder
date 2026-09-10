import { useEffect, useState } from "react";
import {
  Bell,
  Check,
  Coffee,
  Home,
  MapPin,
  MessageCircle,
  MessageSquare,
  User,
  Calendar,
  X,
} from "lucide-react";
import { ONBOARDING, byId, type OnboardingChoice } from "@/data/demo";
import { cn } from "@/lib/utils";
import { Avatar, Badge, Button } from "./ui-kit";

type Tab = "home" | "schedule" | "chat" | "profile";

const tabs: { id: Tab; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "schedule", label: "Schedule", icon: Calendar },
  { id: "chat", label: "Chat", icon: MessageCircle },
  { id: "profile", label: "Profile", icon: User },
];

function Step({ done, label }: { done: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className={cn(
          "flex h-5 w-5 items-center justify-center rounded-full border",
          done ? "border-ct-green bg-ct-green text-white" : "border-border bg-card",
        )}
      >
        {done && <Check className="h-3 w-3" />}
      </span>
      <span className={cn("text-[13px]", done ? "font-medium" : "text-muted-foreground")}>
        {label}
      </span>
    </div>
  );
}

export default function MobileSim({
  published,
  choice,
  acknowledged,
  onAcknowledge,
}: {
  published: boolean;
  choice: OnboardingChoice;
  acknowledged: boolean;
  onAcknowledge: () => void;
}) {
  const [tab, setTab] = useState<Tab>("home");
  const [push, setPush] = useState(false);
  const [msgOpen, setMsgOpen] = useState(false);
  const [checks, setChecks] = useState<boolean[]>([true, false, false, false]);

  const shift = ONBOARDING[choice];
  const buddy = byId(shift.buddy);

  useEffect(() => {
    if (!published) {
      setTab("home");
      setPush(false);
      setChecks([true, false, false, false]);
      return;
    }
    setPush(true);
    const t = setTimeout(() => setPush(false), 4200);
    return () => clearTimeout(t);
  }, [published]);

  const steps = 2 + (published && acknowledged ? 1 : 0);

  return (
    <div className="mx-auto w-full max-w-[360px]">
      <div className="rounded-[38px] border border-border bg-[#DDE2E7] p-2.5 shadow-[0_10px_30px_rgba(32,42,54,0.12)]">
        <div className="relative overflow-hidden rounded-[30px] border border-border bg-card">
          {/* status bar */}
          <div className="flex items-center justify-between bg-card px-5 pb-1 pt-2.5 text-[11px] font-semibold">
            <span>9:41</span>
            <span className="h-4 w-16 rounded-full bg-[#202A36]" />
            <span className="flex items-center gap-1 text-muted-foreground">
              <span>5G</span>
              <span className="inline-block h-2.5 w-5 rounded-[3px] border border-muted-foreground" />
            </span>
          </div>

          {/* header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-[7px] bg-ct-blue text-[11px] font-bold text-white">
                C
              </span>
              <span className="text-[13px] font-semibold">Bean &amp; Bloom</span>
            </div>
            <div className="relative">
              <Bell className="h-4.5 w-4.5 text-muted-foreground" />
              {published && <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-ct-red" />}
            </div>
          </div>

          {/* push notification */}
          {push && (
            <div className="absolute left-3 right-3 top-14 z-10 animate-[slideDown_.35s_ease-out] rounded-[14px] border border-border bg-card p-3 shadow-[0_8px_24px_rgba(32,42,54,0.18)]">
              <div className="flex items-start gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-ct-blue text-[11px] font-bold text-white">
                  C
                </span>
                <div>
                  <p className="text-[12.5px] font-semibold">Connecteam</p>
                  <p className="text-[12px] text-muted-foreground">
                    New schedule published — your first shift is ready.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* body */}
          <div className="h-[540px] overflow-y-auto px-4 py-4">
            {tab === "home" && (
              <div className="space-y-4">
                <h1 className="text-[22px] font-semibold">Good morning, Noa 👋</h1>

                {!published ? (
                  <>
                    <div className="rounded-[16px] bg-ct-blue-soft p-4">
                      <h2 className="text-[16px] font-semibold">Welcome to Bean &amp; Bloom</h2>
                      <p className="mt-1 text-[13px] text-muted-foreground">
                        We’re preparing your first-week schedule. You’ll be notified when it’s
                        ready.
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-[15px] font-semibold">Onboarding progress</h3>
                        <span className="text-[12px] text-muted-foreground">2 of 3 steps</span>
                      </div>
                      <div className="mt-2 h-1.5 rounded-full bg-ct-surface">
                        <div className="h-1.5 w-2/3 rounded-full bg-ct-blue" />
                      </div>
                      <div className="mt-3 space-y-2.5">
                        <Step done label="Profile completed" />
                        <Step done label="Availability submitted" />
                        <Step done={false} label="First shift pending" />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="rounded-[16px] border border-ct-blue/20 bg-ct-blue-soft p-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-[16px] font-semibold">Your first shift ☕</h2>
                        <Badge tone="green">Published</Badge>
                      </div>
                      <p className="mt-2 text-[20px] font-semibold">{shift.dayLabel}</p>
                      <p className="text-[15px] font-medium">{shift.time}</p>
                      <p className="mt-1 flex items-center gap-1 text-[13px] text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" /> {shift.location}
                      </p>
                      <div className="mt-2.5">
                        <Badge tone={choice === "recommended" ? "green" : "amber"}>
                          {shift.badge}
                        </Badge>
                      </div>
                    </div>

                    <div className="rounded-[16px] border border-border p-4">
                      <h3 className="text-[15px] font-semibold">Your onboarding buddy</h3>
                      <div className="mt-2.5 flex items-center gap-2.5">
                        <Avatar id={buddy.id} size={40} />
                        <div>
                          <p className="text-[14px] font-semibold">{buddy.name}</p>
                          <p className="text-[12px] text-muted-foreground">
                            {buddy.role} · Onboarding Mentor
                          </p>
                        </div>
                      </div>
                      <p className="mt-2.5 text-[13px] text-muted-foreground">
                        {buddy.short} will meet you at the beginning of your shift and guide you
                        through the café setup.
                      </p>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="mt-3 w-full"
                        onClick={() => setMsgOpen(true)}
                      >
                        <MessageSquare className="h-4 w-4" /> Message My Buddy
                      </Button>
                    </div>

                    <div>
                      <h3 className="text-[15px] font-semibold">First-shift preparation</h3>
                      <div className="mt-2.5 divide-y divide-border">
                        {[
                          "Read the safety guidelines",
                          "Review the Main Café setup guide",
                          "Arrive 10 minutes early",
                          "Meet your buddy by the main counter",
                        ].map((label, i) => (
                          <button
                            key={label}
                            onClick={() =>
                              setChecks((c) => c.map((v, idx) => (idx === i ? !v : v)))
                            }
                            className="flex w-full items-center gap-2.5 py-2.5 text-left"
                          >
                            <span
                              className={cn(
                                "flex h-5 w-5 items-center justify-center rounded-[6px] border",
                                checks[i]
                                  ? "border-ct-green bg-ct-green text-white"
                                  : "border-border",
                              )}
                            >
                              {checks[i] && <Check className="h-3 w-3" />}
                            </span>
                            <span className="text-[13px]">{label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {acknowledged ? (
                      <div className="rounded-[16px] border border-ct-green/30 bg-ct-green-soft p-4">
                        <p className="flex items-center gap-2 text-[14px] font-semibold text-ct-green">
                          <Check className="h-4 w-4" /> You’re all set for your first shift.
                        </p>
                        <p className="mt-1 text-[12.5px] text-muted-foreground">
                          Onboarding progress: 3 of 3 steps complete
                        </p>
                      </div>
                    ) : (
                      <Button className="w-full" onClick={onAcknowledge}>
                        I’ve Reviewed My Shift
                      </Button>
                    )}

                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-[15px] font-semibold">Onboarding progress</h3>
                        <span className="text-[12px] text-muted-foreground">{steps} of 3 steps</span>
                      </div>
                      <div className="mt-2 h-1.5 rounded-full bg-ct-surface">
                        <div
                          className="h-1.5 rounded-full bg-ct-blue transition-all"
                          style={{ width: `${(steps / 3) * 100}%` }}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {tab === "schedule" && (
              <div className="space-y-3">
                <h1 className="text-[22px] font-semibold">My schedule</h1>
                <p className="text-[12.5px] text-muted-foreground">Week of Sep 13–Sep 19, 2026</p>

                {published ? (
                  <>
                    <div className="rounded-[16px] border border-ct-blue/30 bg-ct-blue-soft p-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-semibold">{shift.dayLabel}</span>
                        <Badge tone="green">Training</Badge>
                      </div>
                      <p className="mt-1 text-[17px] font-semibold">{shift.time}</p>
                      <p className="mt-0.5 flex items-center gap-1 text-[12.5px] text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" /> {shift.location}
                      </p>
                      <div className="mt-2 flex items-center gap-2 border-t border-ct-blue/20 pt-2">
                        <Avatar id={buddy.id} size={22} />
                        <span className="text-[12.5px]">Buddy: {buddy.name}</span>
                      </div>
                    </div>
                    <div className="rounded-[14px] border border-border p-3.5">
                      <p className="text-[13px] font-semibold">Tuesday, Sep 15</p>
                      <p className="mt-0.5 text-[13px]">16:00–21:00 · Main Café</p>
                      <p className="mt-1 text-[12px] text-muted-foreground">
                        With Eli Bar · Experienced Barista
                      </p>
                    </div>
                    <p className="pt-1 text-[12px] text-muted-foreground">
                      Total scheduled: 9h of your 20h weekly limit.
                    </p>
                  </>
                ) : (
                  <div className="rounded-[16px] border border-dashed border-border p-5 text-center">
                    <Coffee className="mx-auto h-7 w-7 text-muted-foreground" />
                    <p className="mt-2 text-[13.5px] font-semibold">No shifts published yet</p>
                    <p className="mt-1 text-[12.5px] text-muted-foreground">
                      Your manager is finishing next week’s schedule.
                    </p>
                  </div>
                )}
                <Button variant="secondary" size="sm" className="w-full" onClick={() => setTab("home")}>
                  Back to Home
                </Button>
              </div>
            )}

            {tab === "chat" && (
              <div className="space-y-3">
                <h1 className="text-[22px] font-semibold">Chat</h1>
                <div className="flex items-center gap-2.5 rounded-[14px] border border-border p-3">
                  <Avatar id={buddy.id} size={36} />
                  <div>
                    <p className="text-[13.5px] font-semibold">{buddy.name}</p>
                    <p className="text-[12px] text-muted-foreground">
                      Looking forward to meeting you!
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 rounded-[14px] border border-border p-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ct-blue text-[12px] font-semibold text-white">
                    BB
                  </span>
                  <div>
                    <p className="text-[13.5px] font-semibold">Bean &amp; Bloom Team</p>
                    <p className="text-[12px] text-muted-foreground">Welcome aboard, Noa 🎉</p>
                  </div>
                </div>
              </div>
            )}

            {tab === "profile" && (
              <div className="space-y-3">
                <h1 className="text-[22px] font-semibold">Profile</h1>
                <div className="flex items-center gap-3">
                  <Avatar id="noa" size={52} />
                  <div>
                    <p className="text-[16px] font-semibold">Noa Shalev</p>
                    <p className="text-[12.5px] text-muted-foreground">Junior Barista · Main Café</p>
                    <div className="mt-1">
                      <Badge tone="green">NEW · WEEK 1</Badge>
                    </div>
                  </div>
                </div>
                <div className="divide-y divide-border rounded-[14px] border border-border">
                  {[
                    ["Weekly hour limit", "20h"],
                    ["Availability", "Sun, Tue, Thu, Sat"],
                    ["Training status", "In progress"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between px-3 py-2.5">
                      <span className="text-[13px] text-muted-foreground">{k}</span>
                      <span className="text-[13px] font-semibold">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* message preview */}
          {msgOpen && (
            <div className="absolute inset-0 z-20 flex flex-col bg-card">
              <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                <button aria-label="Close chat" onClick={() => setMsgOpen(false)}>
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
                <Avatar id={buddy.id} size={30} />
                <div>
                  <p className="text-[13.5px] font-semibold">{buddy.name}</p>
                  <p className="text-[11.5px] text-ct-green">Online</p>
                </div>
              </div>
              <div className="flex-1 space-y-2 p-4">
                <div className="max-w-[80%] rounded-[14px] bg-ct-surface p-2.5 text-[13px]">
                  Hi Noa! I’ll be your buddy on your first shift. See you by the main counter.
                </div>
                <div className="ml-auto max-w-[80%] rounded-[14px] bg-ct-blue p-2.5 text-[13px] text-white">
                  Thank you! I’ll arrive 10 minutes early.
                </div>
              </div>
              <div className="border-t border-border p-3">
                <div className="rounded-[12px] border border-border px-3 py-2 text-[12.5px] text-muted-foreground">
                  Message preview only
                </div>
              </div>
            </div>
          )}

          {/* bottom nav */}
          <div className="grid grid-cols-4 border-t border-border bg-card pb-2 pt-1.5">
            {tabs.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className="flex flex-col items-center gap-0.5 py-1"
                >
                  <Icon className={cn("h-5 w-5", active ? "text-ct-blue" : "text-[#5A6472]")} />
                  <span
                    className={cn(
                      "text-[11px]",
                      active ? "font-semibold text-ct-blue" : "text-[#5A6472]",
                    )}
                  >
                    {t.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <p className="mt-3 text-center text-[12px] text-muted-foreground">
        Employee app · Noa Shalev
      </p>
    </div>
  );
}
