import type { EmpId, Employee, Readiness } from "@/data/demo";

export function isPeakReady(e: Employee) {
  return e.readiness.peakShifts === "Ready";
}
export function isMentor(e: Employee) {
  return e.readiness.mentoring === "Eligible";
}
export function isShiftLead(e: Employee) {
  return e.readiness.shiftLead === "Qualified";
}
export function isCloser(e: Employee) {
  return e.readiness.closing === "Qualified";
}
export function isOpener(e: Employee) {
  return e.readiness.opening === "Qualified";
}

export type PeakMember = { id: EmpId; note: string };

/**
 * Compute the Thursday evening peak-shift decision from the LIVE employee
 * profiles. Default team: Dana (lead), Eli (closer), Tom (cashier). The
 * Noa-specific note changes depending on her peak-readiness, so editing her
 * profile and regenerating visibly changes the agent's explanation.
 */
export function peakDecision(employees: Employee[]): {
  team: PeakMember[];
  why: string[];
  noaNote: string;
} {
  const find = (id: EmpId) => employees.find((e) => e.id === id)!;
  const dana = find("dana");
  const eli = find("eli");
  const tom = find("tom");
  const noa = find("noa");

  const team: PeakMember[] = [
    { id: "dana", note: "Shift Lead" },
    { id: "eli", note: "Experienced Barista · Qualified Closer" },
    { id: "tom", note: "Cashier" },
  ];

  const why = [
    "Dana provides required shift-lead coverage.",
    "Eli is qualified to close the location.",
    "All assigned employees are available.",
    "The team has sufficient peak-shift experience.",
  ];

  const noaNote =
    noa.readiness.peakShifts === "Ready"
      ? "Noa is now peak-ready and available. She was not assigned to this peak shift because the shift-lead and closer roles are already filled and she is still in training for those roles."
      : "Noa is available, but availability alone is not sufficient. She currently requires support during peak shifts, and no eligible onboarding mentor is assigned.";

  return { team, why, noaNote };
}

/**
 * Explanation for Noa's recommended first shift. References her current
 * readiness level and the eligible onboarding mentor on that shift.
 */
export function onboardingDecisionWhy(employees: Employee[], choice: "recommended" | "alternative"): string[] {
  const noa = employees.find((e) => e.id === "noa")!;
  const buddyId = choice === "recommended" ? "yossi" : "dana";
  const buddy = employees.find((e) => e.id === buddyId)!;

  return [
    "Noa and the assigned buddy are both available.",
    choice === "recommended" ? "The shift is off-peak." : "The shift has higher demand but remains valid.",
    "The location has enough coverage for guided learning.",
    `${buddy.short} is mentor-eligible and familiar with the assigned location.`,
    `Noa was assigned because the shift matches her current readiness level (${noa.level}) and includes an eligible onboarding mentor.`,
    "Noa's weekly-hour limit remains protected.",
  ];
}

/**
 * Maya tenure-vs-skill note for her Riverside peak shift. Returns null if Maya
 * is no longer peak-ready or no longer experienced at Riverside.
 */
export function mayaNote(employees: Employee[]): string | null {
  const maya = employees.find((e) => e.id === "maya")!;
  if (maya.readiness.peakShifts !== "Ready") return null;
  if (maya.locationFamiliarity.river !== "Experienced") return null;
  return "Maya was assigned despite shorter company tenure because she is peak-ready and experienced at Riverside Coffee Cart.";
}

export type { Readiness };
