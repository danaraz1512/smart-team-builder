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
  // Business outcome & performance signals
  tier?: 'A_STAR' | 'CORE' | 'TRAINEE';
  cupsPerHour?: number;
  avgTipsPerShift?: number;
  salesScore?: number; // e.g. 96/100
  mentorRating?: number; // e.g. 4.9/5
  specialtyTag?: string; // e.g. 'מהיר בלחץ', 'חונך סבלני', 'קופאי שירות'
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

export type EmployeeHolidayStatus = 'constraint' | 'open' | 'flexible_voucher';

export type AvailabilityOptionType = 'available' | 'unavailable' | 'prefer_not' | 'vacation';

export type ShiftHoursPreset = 'all_day' | 'morning' | 'evening' | 'custom';

export interface DayAvailabilityRecord {
  type: AvailabilityOptionType;
  hoursPreset?: ShiftHoursPreset;
  startTime?: string;
  endTime?: string;
  customHours?: string;
  note?: string;
}

export interface OnboardingShiftStep {
  stepNumber: number;
  title: string;
  timingRecommendation: string;
  isOffPeakRequired: boolean;
  mentorId: string;
  tasks: string[];
  restrictions: string[];
}

export interface OnboardingChecklistItem {
  id: string;
  text: string;
  subtext: string;
  required: boolean;
}

export interface OnboardingPlanConfig {
  employeeId: string;
  employeeName: string;
  role: string;
  steps: OnboardingShiftStep[];
  acknowledgementItems: OnboardingChecklistItem[];
}


/* ============================================================
   JOBS (רשומות עבודה)
   A job record holds a repeating shift-role or a recurring task,
   its task checklist, required skills and the per-employee
   qualification level (including "can mentor" yes/no).
   ============================================================ */

export type JobKind = 'shift_role' | 'recurring_task';

export type JobQualificationLevel =
  | 'certified_mentor' // מוסמך + יכול לחנוך
  | 'qualified'        // מוסמך
  | 'in_training'      // בהכשרה
  | 'not_qualified';   // לא מוסמך

export interface JobQualification {
  employeeId: string;
  level: JobQualificationLevel;
  canMentor: boolean;
  lastCertified?: string; // e.g. "Aug 2026"
  note?: string;
}

export interface JobRecurrence {
  days: DayOfWeek[];
  timeRange: string;      // e.g. "07:00–15:00"
  frequencyLabel: string; // e.g. "כל שבוע", "פעם בשבוע · ראשון"
}

export interface JobRecord {
  id: string;
  name: string;        // Hebrew display name
  nameEn: string;      // English label (Connecteam style)
  kind: JobKind;
  color: string;       // dot color like Connecteam job records
  location: string;
  recurrence: JobRecurrence;
  requiredHeadcount: number;
  estimatedMinutes?: number;
  tasks: string[];
  requiredSkills: string[];
  requiresMentorOnShift: boolean;
  suitableForOnboarding: boolean;
  notes?: string;
  qualifications: JobQualification[];
}
