export type EmpId = "dana" | "yossi" | "eli" | "maya" | "tom" | "noa";

export type Employee = {
  id: EmpId;
  name: string;
  short: string;
  initials: string;
  role: string;
  experience: string;
  locations: string;
  skills: string[];
  weeklyLimit: number;
  availability: number[]; // 0 = Sunday
  pto?: number[];
  isNew?: boolean;
  mentor?: boolean;
};

export const DAYS = [
  { label: "Sun", date: "Sep 13" },
  { label: "Mon", date: "Sep 14" },
  { label: "Tue", date: "Sep 15" },
  { label: "Wed", date: "Sep 16" },
  { label: "Thu", date: "Sep 17" },
  { label: "Fri", date: "Sep 18" },
  { label: "Sat", date: "Sep 19" },
];

export const EMPLOYEES: Employee[] = [
  {
    id: "dana",
    name: "Dana Levi",
    short: "Dana",
    initials: "DL",
    role: "Shift Lead",
    experience: "Senior",
    locations: "Main Café · Riverside",
    skills: ["Peak Shift", "Closing"],
    weeklyLimit: 40,
    availability: [0, 2, 4, 5, 6],
  },
  {
    id: "yossi",
    name: "Yossi Cohen",
    short: "Yossi",
    initials: "YC",
    role: "Senior Barista",
    experience: "Senior",
    locations: "Main Café",
    skills: ["Opening", "Mentor Eligible"],
    weeklyLimit: 36,
    availability: [0, 1, 3, 5],
    mentor: true,
  },
  {
    id: "eli",
    name: "Eli Bar",
    short: "Eli",
    initials: "EB",
    role: "Barista",
    experience: "Experienced",
    locations: "Main Café · Riverside",
    skills: ["Closing"],
    weeklyLimit: 32,
    availability: [1, 2, 4, 5],
  },
  {
    id: "maya",
    name: "Maya Green",
    short: "Maya",
    initials: "MG",
    role: "Barista",
    experience: "Experienced",
    locations: "Riverside Coffee Cart",
    skills: ["Opening"],
    weeklyLimit: 30,
    availability: [0, 3, 4, 5],
    pto: [2],
  },
  {
    id: "tom",
    name: "Tom Reed",
    short: "Tom",
    initials: "TR",
    role: "Cashier",
    experience: "Intermediate",
    locations: "Main Café · Riverside",
    skills: ["Front of House"],
    weeklyLimit: 28,
    availability: [1, 3, 4, 6],
    pto: [0],
  },
  {
    id: "noa",
    name: "Noa Shalev",
    short: "Noa",
    initials: "NS",
    role: "Junior Barista",
    experience: "New Employee — Week 1",
    locations: "Main Café",
    skills: ["Training in Progress"],
    weeklyLimit: 20,
    availability: [0, 2, 4, 6],
    isNew: true,
  },
];

export const byId = (id: EmpId) => EMPLOYEES.find((e) => e.id === id)!;

export type LocationId = "main" | "river";

export const LOCATIONS: { id: LocationId; name: string }[] = [
  { id: "main", name: "Main Café" },
  { id: "river", name: "Riverside Coffee Cart" },
];

export type Shift = {
  id: string;
  day: number;
  location: LocationId;
  part: "morning" | "evening";
  time: string;
  hours: number;
  peak: boolean;
  needs: number;
  reqs: string[];
  onboardingSuitable?: boolean;
  assigned: EmpId[];
};

export const SHIFTS: Shift[] = [
  {
    id: "m-sun",
    day: 0,
    location: "main",
    part: "morning",
    time: "10:00–14:00",
    hours: 4,
    peak: false,
    needs: 2,
    reqs: [],
    onboardingSuitable: true,
    assigned: ["yossi", "noa"],
  },
  {
    id: "m-mon",
    day: 1,
    location: "main",
    part: "morning",
    time: "07:00–13:00",
    hours: 6,
    peak: false,
    needs: 2,
    reqs: ["Opener required"],
    assigned: ["yossi", "eli"],
  },
  {
    id: "m-tue",
    day: 2,
    location: "main",
    part: "evening",
    time: "16:00–21:00",
    hours: 5,
    peak: false,
    needs: 2,
    reqs: ["Closer required"],
    onboardingSuitable: true,
    assigned: ["eli", "noa"],
  },
  {
    id: "m-wed",
    day: 3,
    location: "main",
    part: "morning",
    time: "07:00–13:00",
    hours: 6,
    peak: false,
    needs: 2,
    reqs: ["Opener required"],
    assigned: ["yossi", "tom"],
  },
  {
    id: "m-thu",
    day: 4,
    location: "main",
    part: "evening",
    time: "17:00–22:00",
    hours: 5,
    peak: true,
    needs: 3,
    reqs: ["Shift Lead required", "Closer required"],
    assigned: ["dana", "eli", "tom"],
  },
  {
    id: "m-fri-am",
    day: 5,
    location: "main",
    part: "morning",
    time: "07:00–13:00",
    hours: 6,
    peak: false,
    needs: 1,
    reqs: ["Opener required"],
    assigned: ["yossi"],
  },
  {
    id: "m-fri-pm",
    day: 5,
    location: "main",
    part: "evening",
    time: "16:00–21:00",
    hours: 5,
    peak: false,
    needs: 2,
    reqs: ["Closer required"],
    assigned: ["dana", "yossi"],
  },
  {
    id: "m-sat",
    day: 6,
    location: "main",
    part: "morning",
    time: "09:00–13:00",
    hours: 4,
    peak: false,
    needs: 2,
    reqs: [],
    onboardingSuitable: true,
    assigned: ["dana", "tom"],
  },
  {
    id: "r-sun",
    day: 0,
    location: "river",
    part: "morning",
    time: "08:00–13:00",
    hours: 5,
    peak: false,
    needs: 2,
    reqs: ["Opener required"],
    assigned: ["dana", "maya"],
  },
  {
    id: "r-mon",
    day: 1,
    location: "river",
    part: "morning",
    time: "08:00–13:00",
    hours: 5,
    peak: false,
    needs: 1,
    reqs: [],
    assigned: ["tom"],
  },
  {
    id: "r-tue",
    day: 2,
    location: "river",
    part: "morning",
    time: "08:00–13:00",
    hours: 5,
    peak: false,
    needs: 1,
    reqs: [],
    assigned: ["dana"],
  },
  {
    id: "r-wed",
    day: 3,
    location: "river",
    part: "evening",
    time: "15:00–19:00",
    hours: 4,
    peak: false,
    needs: 1,
    reqs: [],
    assigned: ["maya"],
  },
  {
    id: "r-thu",
    day: 4,
    location: "river",
    part: "morning",
    time: "08:00–13:00",
    hours: 5,
    peak: false,
    needs: 1,
    reqs: [],
    assigned: ["maya"],
  },
  {
    id: "r-fri",
    day: 5,
    location: "river",
    part: "morning",
    time: "07:00–13:00",
    hours: 6,
    peak: true,
    needs: 3,
    reqs: ["Opener required", "Shift Lead required"],
    assigned: ["dana", "maya", "eli"],
  },
];

export const HARD_RULES = [
  "Never schedule an unavailable employee.",
  "Respect approved PTO.",
  "Every shift must include required roles.",
  "Peak shifts require a shift lead.",
  "Closing shifts require a qualified closer.",
  "A new employee cannot work without an experienced teammate.",
];

export const SOFT_RULES = [
  "Prefer off-peak shifts for first-week onboarding.",
  "Balance weekly hours fairly.",
  "Prefer employees familiar with the assigned location.",
  "Avoid unnecessary overtime.",
  "Pair a new employee with a mentor-eligible teammate when possible.",
];

export const ANALYSIS_STEPS = [
  "Checking employee availability and time off…",
  "Matching roles, skills, and locations…",
  "Balancing experience across peak shifts…",
  "Finding the best onboarding shift for Noa…",
];

export type OnboardingChoice = "recommended" | "alternative";

export const ONBOARDING = {
  recommended: {
    shiftId: "m-sun",
    dayLabel: "Sunday, Sep 13",
    time: "10:00–14:00",
    location: "Main Café",
    buddy: "yossi" as EmpId,
    badge: "Off-Peak Training Shift",
  },
  alternative: {
    shiftId: "m-sat",
    dayLabel: "Saturday, Sep 19",
    time: "09:00–13:00",
    location: "Main Café",
    buddy: "dana" as EmpId,
    badge: "Training Shift · Higher Demand",
  },
};

/** Shifts with the manager's onboarding choice applied. */
export function shiftsFor(choice: OnboardingChoice): Shift[] {
  return SHIFTS.map((s) => {
    if (choice === "alternative") {
      if (s.id === "m-sun") return { ...s, assigned: s.assigned.filter((a) => a !== "noa") };
      if (s.id === "m-sat") return { ...s, assigned: [...s.assigned, "noa" as EmpId] };
    }
    return { ...s, assigned: [...s.assigned] };
  });
}

export function weeklyHours(shifts: Shift[], id: EmpId) {
  return shifts.reduce((sum, s) => (s.assigned.includes(id) ? sum + s.hours : sum), 0);
}
