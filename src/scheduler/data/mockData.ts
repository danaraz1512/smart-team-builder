import { Employee, Shift } from '../types';

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-dana',
    name: 'Dana Levi',
    initials: 'DL',
    role: 'Shift Lead',
    experience: 'Senior',
    locations: ['Main Café', 'Riverside Coffee Cart (Park)'],
    skills: ['Peak Shift', 'Closing', 'Leadership'],
    weeklyLimit: 40,
    currentHours: 32,
    availability: ['Sunday', 'Tuesday', 'Thursday', 'Friday', 'Saturday'],
    ptoDays: [],
    avatarBg: '#6879EA',
  },
  {
    id: 'emp-yossi',
    name: 'Yossi Cohen',
    initials: 'YC',
    role: 'Senior Barista',
    experience: 'Senior',
    locations: ['Main Café'],
    skills: ['Opening', 'Mentor Eligible', 'Espresso Specialist'],
    weeklyLimit: 36,
    currentHours: 26,
    availability: ['Sunday', 'Monday', 'Wednesday', 'Friday'],
    ptoDays: [],
    avatarBg: '#2F95F8',
    mentorEligible: true,
  },
  {
    id: 'emp-eli',
    name: 'Eli Bar',
    initials: 'EB',
    role: 'Barista',
    experience: 'Experienced',
    locations: ['Main Café', 'Riverside Coffee Cart (Park)'],
    skills: ['Closing', 'Inventory', 'Latte Art'],
    weeklyLimit: 32,
    currentHours: 27,
    availability: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
    ptoDays: [],
    avatarBg: '#37B77D',
  },
  {
    id: 'emp-maya',
    name: 'Maya Green',
    initials: 'MG',
    role: 'Barista',
    experience: 'Experienced',
    locations: ['Riverside Coffee Cart (Park)'],
    skills: ['Opening', 'Speed Service', 'Park Families Specialist'],
    weeklyLimit: 30,
    currentHours: 24,
    availability: ['Sunday', 'Wednesday', 'Thursday', 'Friday'],
    ptoDays: ['Tuesday'],
    avatarBg: '#F3A43B',
  },
  {
    id: 'emp-tom',
    name: 'Tom Reed',
    initials: 'TR',
    role: 'Cashier',
    experience: 'Intermediate',
    locations: ['Main Café', 'Riverside Coffee Cart (Park)'],
    skills: ['POS Mastery', 'Customer Relations'],
    weeklyLimit: 28,
    currentHours: 25,
    availability: ['Monday', 'Wednesday', 'Thursday', 'Saturday'],
    ptoDays: ['Sunday'],
    avatarBg: '#9333EA',
  },
  {
    id: 'emp-noa',
    name: 'Noa Shalev',
    initials: 'NS',
    role: 'Junior Barista',
    experience: 'New Employee — Week 1',
    locations: ['Main Café'],
    skills: ['Training in Progress'],
    weeklyLimit: 20,
    currentHours: 4,
    availability: ['Sunday', 'Tuesday', 'Thursday', 'Saturday'],
    ptoDays: [],
    isNew: true,
    newBadge: 'NEW · WEEK 1',
    avatarBg: '#6879EA',
  },
];

export const INITIAL_SHIFTS: Shift[] = [
  // Sunday Sep 13
  {
    id: 'shift-sun-mc-morn',
    day: 'Sunday',
    dayIndex: 0,
    dateStr: 'Sep 13',
    location: 'Main Café',
    timeSlot: 'Morning',
    timeRange: '10:00–14:00',
    durationHours: 4,
    isPeak: false,
    isOffPeak: true,
    needsCount: 2,
    suitableForOnboarding: true,
    assignedEmployeeIds: [],
    badgeLabel: 'Onboarding Suitable',
  },
  {
    id: 'shift-sun-rc-morn',
    day: 'Sunday',
    dayIndex: 0,
    dateStr: 'Sep 13',
    location: 'Riverside Coffee Cart',
    timeSlot: 'Morning',
    timeRange: '08:00–14:00',
    durationHours: 6,
    isPeak: false,
    isOffPeak: false,
    needsCount: 1,
    assignedEmployeeIds: [],
  },
  {
    id: 'shift-sun-rc-eve',
    day: 'Sunday',
    dayIndex: 0,
    dateStr: 'Sep 13',
    location: 'Riverside Coffee Cart',
    timeSlot: 'Evening',
    timeRange: '14:00–19:00',
    durationHours: 5,
    isPeak: false,
    isOffPeak: false,
    needsCount: 1,
    assignedEmployeeIds: [],
    badgeLabel: 'Park Afternoon (to 19:00)',
  },

  // Monday Sep 14
  {
    id: 'shift-mon-mc-morn',
    day: 'Monday',
    dayIndex: 1,
    dateStr: 'Sep 14',
    location: 'Main Café',
    timeSlot: 'Morning',
    timeRange: '07:00–15:00',
    durationHours: 8,
    isPeak: false,
    isOffPeak: false,
    needsCount: 2,
    requiresOpener: true,
    assignedEmployeeIds: [],
  },
  {
    id: 'shift-mon-rc-eve',
    day: 'Monday',
    dayIndex: 1,
    dateStr: 'Sep 14',
    location: 'Riverside Coffee Cart',
    timeSlot: 'Evening',
    timeRange: '13:00–19:00',
    durationHours: 6,
    isPeak: false,
    isOffPeak: false,
    needsCount: 2,
    assignedEmployeeIds: [],
    badgeLabel: 'Park Rush (to 19:00)',
  },

  // Tuesday Sep 15
  {
    id: 'shift-tue-mc-morn',
    day: 'Tuesday',
    dayIndex: 2,
    dateStr: 'Sep 15',
    location: 'Main Café',
    timeSlot: 'Morning',
    timeRange: '07:00–15:00',
    durationHours: 8,
    isPeak: false,
    isOffPeak: false,
    needsCount: 2,
    assignedEmployeeIds: [],
  },
  {
    id: 'shift-tue-rc-morn',
    day: 'Tuesday',
    dayIndex: 2,
    dateStr: 'Sep 15',
    location: 'Riverside Coffee Cart',
    timeSlot: 'Morning',
    timeRange: '08:00–14:00',
    durationHours: 6,
    isPeak: false,
    isOffPeak: false,
    needsCount: 1,
    assignedEmployeeIds: [],
  },
  {
    id: 'shift-tue-rc-eve',
    day: 'Tuesday',
    dayIndex: 2,
    dateStr: 'Sep 15',
    location: 'Riverside Coffee Cart',
    timeSlot: 'Evening',
    timeRange: '14:00–19:00',
    durationHours: 5,
    isPeak: false,
    isOffPeak: false,
    needsCount: 1,
    assignedEmployeeIds: [],
    badgeLabel: 'Park Afternoon (to 19:00)',
  },

  // Wednesday Sep 16
  {
    id: 'shift-wed-mc-morn',
    day: 'Wednesday',
    dayIndex: 3,
    dateStr: 'Sep 16',
    location: 'Main Café',
    timeSlot: 'Morning',
    timeRange: '07:00–15:00',
    durationHours: 8,
    isPeak: false,
    isOffPeak: false,
    needsCount: 2,
    requiresOpener: true,
    assignedEmployeeIds: [],
  },
  {
    id: 'shift-wed-rc-eve',
    day: 'Wednesday',
    dayIndex: 3,
    dateStr: 'Sep 16',
    location: 'Riverside Coffee Cart',
    timeSlot: 'Evening',
    timeRange: '13:00–19:00',
    durationHours: 6,
    isPeak: false,
    isOffPeak: false,
    needsCount: 2,
    assignedEmployeeIds: [],
    badgeLabel: 'Park Rush (to 19:00)',
  },

  // Thursday Sep 17
  {
    id: 'shift-thu-rc-morn',
    day: 'Thursday',
    dayIndex: 4,
    dateStr: 'Sep 17',
    location: 'Riverside Coffee Cart',
    timeSlot: 'Morning',
    timeRange: '08:00–14:00',
    durationHours: 6,
    isPeak: false,
    isOffPeak: false,
    needsCount: 1,
    requiresOpener: true,
    assignedEmployeeIds: [],
  },
  {
    id: 'shift-thu-rc-eve',
    day: 'Thursday',
    dayIndex: 4,
    dateStr: 'Sep 17',
    location: 'Riverside Coffee Cart',
    timeSlot: 'Evening',
    timeRange: '14:00–19:00',
    durationHours: 5,
    isPeak: false,
    isOffPeak: false,
    needsCount: 1,
    assignedEmployeeIds: [],
    badgeLabel: 'Park Rush (to 19:00)',
  },
  {
    id: 'shift-thu-mc-eve',
    day: 'Thursday',
    dayIndex: 4,
    dateStr: 'Sep 17',
    location: 'Main Café',
    timeSlot: 'Evening',
    timeRange: '17:00–22:00',
    durationHours: 5,
    isPeak: true,
    isOffPeak: false,
    needsCount: 3,
    requiresShiftLead: true,
    requiresCloser: true,
    assignedEmployeeIds: [],
    badgeLabel: 'Peak Demand',
  },

  // Friday Sep 18
  {
    id: 'shift-fri-rc-morn',
    day: 'Friday',
    dayIndex: 5,
    dateStr: 'Sep 18',
    location: 'Riverside Coffee Cart',
    timeSlot: 'Morning',
    timeRange: '08:00–15:00', // Closes 15:00 per user request
    durationHours: 7,
    isPeak: true,
    isOffPeak: false,
    needsCount: 3,
    requiresOpener: true,
    requiresShiftLead: true,
    assignedEmployeeIds: [],
    badgeLabel: 'Park Friday (to 15:00)',
  },
  {
    id: 'shift-fri-mc-eve',
    day: 'Friday',
    dayIndex: 5,
    dateStr: 'Sep 18',
    location: 'Main Café',
    timeSlot: 'Evening',
    timeRange: '16:00–22:00',
    durationHours: 6,
    isPeak: false,
    isOffPeak: false,
    needsCount: 2,
    requiresCloser: true,
    assignedEmployeeIds: [],
  },

  // Saturday Sep 19
  {
    id: 'shift-sat-mc-morn',
    day: 'Saturday',
    dayIndex: 6,
    dateStr: 'Sep 19',
    location: 'Main Café',
    timeSlot: 'Morning',
    timeRange: '09:00–13:00',
    durationHours: 4,
    isPeak: false,
    isOffPeak: false,
    needsCount: 2,
    assignedEmployeeIds: [],
  },
  {
    id: 'shift-sat-rc-morn',
    day: 'Saturday',
    dayIndex: 6,
    dateStr: 'Sep 19',
    location: 'Riverside Coffee Cart',
    timeSlot: 'Morning',
    timeRange: '10:00–18:00', // Open until 18:00 per user request
    durationHours: 8,
    isPeak: false,
    isOffPeak: false,
    needsCount: 1,
    assignedEmployeeIds: [],
    badgeLabel: 'Park Sat (to 18:00)',
  },
];

// Helper to get generated schedule assignments based on onboarding choice
export function getGeneratedAssignments(
  onboardingChoice: 'recommended' | 'alternative' | 'custom',
  customConfig?: { shiftId: string; buddyId: string }
): Record<string, string[]> {
  // Base assignments covering all 16 shifts with valid constraints
  const assignments: Record<string, string[]> = {
    // Sunday:
    // If recommended: Noa + Yossi
    // If alternative: Yossi + Dana (and Noa moves to Saturday)
    'shift-sun-mc-morn':
      onboardingChoice === 'recommended'
        ? ['emp-yossi', 'emp-noa']
        : ['emp-yossi', 'emp-dana'],
    'shift-sun-rc-morn': ['emp-maya'],
    'shift-sun-rc-eve': ['emp-dana'], // Dana available Sunday, covers park afternoon to 19:00

    // Monday:
    'shift-mon-mc-morn': ['emp-yossi', 'emp-eli'],
    'shift-mon-rc-eve': ['emp-tom', 'emp-eli'], // Park rush to 19:00

    // Tuesday:
    'shift-tue-mc-morn': ['emp-dana', 'emp-eli'],
    'shift-tue-rc-morn': ['emp-dana'], // Maya is on PTO Tuesday!
    'shift-tue-rc-eve': ['emp-eli'], // Eli available Tuesday, covers park to 19:00

    // Wednesday:
    'shift-wed-mc-morn': ['emp-yossi', 'emp-tom'],
    'shift-wed-rc-eve': ['emp-maya', 'emp-yossi'], // Park rush to 19:00

    // Thursday:
    'shift-thu-rc-morn': ['emp-maya'],
    'shift-thu-rc-eve': ['emp-tom'], // Tom available Thursday, covers park to 19:00
    // Key Decision 1: Dana (Shift Lead), Eli (Closer), Tom (Cashier) - 3 employees, Peak
    'shift-thu-mc-eve': ['emp-dana', 'emp-eli', 'emp-tom'],

    // Friday:
    // Peak Riverside Park (to 15:00): Maya (Opener), Dana (Shift Lead), Yossi
    'shift-fri-rc-morn': ['emp-maya', 'emp-dana', 'emp-yossi'],
    'shift-fri-mc-eve': ['emp-eli', 'emp-dana'],

    // Saturday:
    // If alternative: Noa + Dana
    // If recommended: Tom + Dana
    'shift-sat-mc-morn':
      onboardingChoice === 'alternative'
        ? ['emp-dana', 'emp-noa']
        : ['emp-tom', 'emp-dana'],
    'shift-sat-rc-morn': ['emp-tom'], // Saturday park to 18:00
  };

  if (onboardingChoice === 'custom' && customConfig) {
    // Apply custom buddy to selected shift
    if (customConfig.shiftId === 'shift-sun-mc-morn') {
      assignments['shift-sun-mc-morn'] = [customConfig.buddyId, 'emp-noa'];
      assignments['shift-sat-mc-morn'] = ['emp-tom', 'emp-dana'];
    } else if (customConfig.shiftId === 'shift-sat-mc-morn') {
      assignments['shift-sat-mc-morn'] = [customConfig.buddyId, 'emp-noa'];
      assignments['shift-sun-mc-morn'] = ['emp-yossi', 'emp-dana'];
    }
  }

  return assignments;
}
