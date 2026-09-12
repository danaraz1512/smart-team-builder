export type DayOfWeek = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export interface Employee {
  id: string;
  name: string;
  initials: string;
  role: string;
  experience: string;
  locations: string[];
  skills: string[];
  weeklyLimit: number;
  currentHours: number;
  availability: DayOfWeek[];
  ptoDays: DayOfWeek[];
  isNew?: boolean;
  newBadge?: string;
  avatarBg?: string;
  mentorEligible?: boolean;
}

export type ShiftTimeSlot = 'Morning' | 'Evening';

export interface Shift {
  id: string;
  day: DayOfWeek;
  dayIndex: number;
  dateStr: string; // e.g. "Sep 13"
  location: 'Main Café' | 'Riverside Coffee Cart';
  timeSlot: ShiftTimeSlot;
  timeRange: string; // e.g. "10:00–14:00"
  durationHours: number;
  isPeak: boolean;
  isOffPeak: boolean;
  needsCount: number;
  requiresShiftLead?: boolean;
  requiresCloser?: boolean;
  requiresOpener?: boolean;
  suitableForOnboarding?: boolean;
  assignedEmployeeIds: string[];
  badgeLabel?: string;
  highlighted?: boolean;
}

export type SchedulerState =
  | 'initial'             // Step 1: Scheduling inputs
  | 'analyzing'           // Step 2: AI analysis 2s progress
  | 'draft_generated'     // Step 3: Generated schedule draft
  | 'reviewing_decisions' // Step 4: Manager review of scheduling decisions
  | 'published';          // Step 5: Published schedule and employee mobile update

export type ViewMode = 'focus' | 'detailed';

export type OnboardingAssignmentOption = 'recommended' | 'alternative' | 'custom';

export interface ManualAssignmentConfig {
  shiftId: string;
  location: 'Main Café' | 'Riverside Coffee Cart';
  buddyId: string;
  timeRange: string;
  day: DayOfWeek;
  dateStr: string;
}
