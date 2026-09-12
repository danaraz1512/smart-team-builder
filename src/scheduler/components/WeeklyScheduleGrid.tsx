import React from 'react';
import { Shift, Employee, DayOfWeek, SchedulerState, ViewMode } from '../types';
import {
  Sparkles,
  Clock,
  ShieldCheck,
  Award,
  Users,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Sliders,
} from 'lucide-react';

interface WeeklyScheduleGridProps {
  shifts: Shift[];
  employees: Employee[];
  schedulerState: SchedulerState;
  selectedLocation: string;
  highlightThursdayShift: boolean;
  onboardingChoice: 'recommended' | 'alternative' | 'custom';
  viewMode: ViewMode;
  onOpenManualEdit?: (() => void) | undefined;
}

const DAYS: { name: DayOfWeek; short: string; date: string }[] = [
  { name: 'Sunday', short: 'SUN', date: 'Sep 13' },
  { name: 'Monday', short: 'MON', date: 'Sep 14' },
  { name: 'Tuesday', short: 'TUE', date: 'Sep 15' },
  { name: 'Wednesday', short: 'WED', date: 'Sep 16' },
  { name: 'Thursday', short: 'THU', date: 'Sep 17' },
  { name: 'Friday', short: 'FRI', date: 'Sep 18' },
  { name: 'Saturday', short: 'SAT', date: 'Sep 19' },
];

export const WeeklyScheduleGrid: React.FC<WeeklyScheduleGridProps> = ({
  shifts,
  employees,
  schedulerState,
  selectedLocation,
  highlightThursdayShift,
  onboardingChoice,
  viewMode,
  onOpenManualEdit,
}) => {
  const isDraftOrPublished =
    schedulerState === 'draft_generated' ||
    schedulerState === 'reviewing_decisions' ||
    schedulerState === 'published';

  const employeeMap = new Map<string, Employee>();
  employees.forEach((emp) => employeeMap.set(emp.id, emp));

  const locationsToDisplay =
    selectedLocation === 'All Locations'
      ? (['Main Café', 'Riverside Coffee Cart'] as const)
      : [selectedLocation as 'Main Café' | 'Riverside Coffee Cart'];

  return (
    <div
      id="weekly-schedule-grid"
      className="bg-white border border-[#E1E5E9] rounded-2xl shadow-xs overflow-hidden"
    >
      {/* Table Header: Days of the week */}
      <div className="grid grid-cols-[130px_repeat(7,1fr)] border-b border-[#E1E5E9] bg-[#F6F7F8]">
        <div className="p-2.5 text-[11px] font-bold text-[#77818D] uppercase tracking-wider border-r border-[#E1E5E9] flex items-center">
          Location / Shift
        </div>
        {DAYS.map((day) => (
          <div
            key={day.name}
            className={`p-2 text-center border-r last:border-r-0 border-[#E1E5E9] ${
              day.name === 'Thursday' && highlightThursdayShift
                ? 'bg-[#FAF5FF] border-b-2 border-b-[#C253D9]'
                : ''
            }`}
          >
            <span className="block text-[10px] font-bold text-[#77818D] uppercase tracking-wider">
              {day.short}
            </span>
            <span className="block text-[12px] font-bold text-[#202A36]">
              {day.date}
            </span>
          </div>
        ))}
      </div>

      {/* Grid Rows by Location */}
      <div className="divide-y divide-[#E1E5E9]">
        {locationsToDisplay.map((location) => {
          const locationShifts = shifts.filter((s) => s.location === location);

          return (
            <div key={location} className="divide-y divide-[#E1E5E9]/60">
              {/* Location Banner Header */}
              <div className="bg-[#FAFBFD] px-3.5 py-2 flex items-center justify-between border-y border-[#E1E5E9]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2F95F8]" />
                  <span className="text-[13px] font-bold text-[#202A36]">
                    {location === 'Riverside Coffee Cart'
                      ? 'Riverside Coffee Cart (Park & Gardens)'
                      : 'Main Café (Flagship Store)'}
                  </span>
                  <span className="text-[11px] text-[#77818D] hidden sm:inline">
                    {location === 'Main Café'
                      ? 'Day Service Mon–Wed (Closes 15:00) · Evening Peak Thu–Fri'
                      : 'Park & Stroller Rush (Midweek to 19:00, Fri to 15:00, Sat to 18:00)'}
                  </span>
                </div>
                <span className="text-[11px] text-[#77818D] font-medium">
                  {locationShifts.length} Weekly Shifts
                </span>
              </div>

              {/* MORNING ROW */}
              <div className="grid grid-cols-[130px_repeat(7,1fr)] min-h-[96px]">
                <div className="p-2.5 bg-[#FCFCFD] border-r border-[#E1E5E9] flex flex-col justify-center">
                  <span className="text-[12px] font-semibold text-[#202A36]">
                    Morning
                  </span>
                  <span className="text-[10px] text-[#77818D]">
                    Opening & Day
                  </span>
                </div>

                {DAYS.map((day) => {
                  const shift = locationShifts.find(
                    (s) => s.day === day.name && s.timeSlot === 'Morning'
                  );

                  return (
                    <div
                      key={`${location}-Morning-${day.name}`}
                      className="p-1 border-r last:border-r-0 border-[#E1E5E9] flex flex-col justify-start min-h-[96px] bg-[#FDFDFE]"
                    >
                      {shift ? (
                        <ShiftCard
                          shift={shift}
                          isDraftOrPublished={isDraftOrPublished}
                          employeeMap={employeeMap}
                          highlightThursdayShift={false}
                          onboardingChoice={onboardingChoice}
                          viewMode={viewMode}
                          onOpenManualEdit={onOpenManualEdit}
                        />
                      ) : (
                        <div className="h-full flex items-center justify-center text-[10px] text-[#A0AEC0] italic">
                          Off
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* EVENING ROW */}
              <div className="grid grid-cols-[130px_repeat(7,1fr)] min-h-[96px]">
                <div className="p-2.5 bg-[#FCFCFD] border-r border-[#E1E5E9] flex flex-col justify-center">
                  <span className="text-[12px] font-semibold text-[#202A36]">
                    Evening
                  </span>
                  <span className="text-[10px] text-[#77818D]">
                    Peak & Closing
                  </span>
                </div>

                {DAYS.map((day) => {
                  const shift = locationShifts.find(
                    (s) => s.day === day.name && s.timeSlot === 'Evening'
                  );

                  const isThuHighlight =
                    shift?.id === 'shift-thu-mc-eve' && highlightThursdayShift;

                  return (
                    <div
                      key={`${location}-Evening-${day.name}`}
                      className={`p-1 border-r last:border-r-0 border-[#E1E5E9] flex flex-col justify-start min-h-[96px] ${
                        isThuHighlight ? 'bg-[#FAF5FF]' : 'bg-[#FDFDFE]'
                      }`}
                    >
                      {shift ? (
                        <ShiftCard
                          shift={shift}
                          isDraftOrPublished={isDraftOrPublished}
                          employeeMap={employeeMap}
                          highlightThursdayShift={isThuHighlight}
                          onboardingChoice={onboardingChoice}
                          viewMode={viewMode}
                          onOpenManualEdit={onOpenManualEdit}
                        />
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center p-2 text-center rounded-lg border border-dashed border-[#E1E5E9]/80 bg-[#FAFAFA]">
                          <span className="text-[10px] font-medium text-[#77818D]">
                            {location === 'Main Café'
                              ? day.name === 'Saturday'
                                ? 'Day Only · Closes 13:00'
                                : 'Day Only · Closes 15:00'
                              : day.name === 'Friday'
                              ? 'Closes 15:00 · Shabbat'
                              : 'Open in Day (to 18:00)'}
                          </span>
                          <span className="text-[9px] text-[#A0AEC0] mt-0.5">
                            No evening service
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface ShiftCardProps {
  shift: Shift;
  isDraftOrPublished: boolean;
  employeeMap: Map<string, Employee>;
  highlightThursdayShift: boolean;
  onboardingChoice: 'recommended' | 'alternative' | 'custom';
  viewMode: ViewMode;
  onOpenManualEdit?: (() => void) | undefined;
}

const ShiftCard: React.FC<ShiftCardProps> = ({
  shift,
  isDraftOrPublished,
  employeeMap,
  highlightThursdayShift,
  onboardingChoice,
  viewMode,
  onOpenManualEdit,
}) => {
  const isSundayOnboarding =
    shift.id === 'shift-sun-mc-morn' && onboardingChoice === 'recommended';
  const isSaturdayOnboarding =
    shift.id === 'shift-sat-mc-morn' && onboardingChoice === 'alternative';
  const isOnboardingShift = isSundayOnboarding || isSaturdayOnboarding;

  const assignedEmployees = shift.assignedEmployeeIds
    .map((id) => employeeMap.get(id))
    .filter(Boolean) as Employee[];

  const isFocus = viewMode === 'focus';

  return (
    <div
      id={`shift-card-${shift.id}`}
      className={`rounded-xl p-1.5 h-full flex flex-col justify-between border transition-all text-left ${
        highlightThursdayShift
          ? 'ring-2 ring-[#C253D9] shadow-md bg-white border-[#C253D9]'
          : isOnboardingShift && isDraftOrPublished
          ? 'border-[#37B77D] bg-[#F0FDF4] shadow-xs'
          : shift.isPeak && isDraftOrPublished
          ? 'border-[#C253D9]/40 bg-[#FAF5FF] shadow-xs'
          : isDraftOrPublished
          ? 'border-[#E1E5E9] bg-white shadow-xs hover:border-[#BAE0FD]'
          : 'border-dashed border-[#cbd5e1] bg-[#F8FAFC]'
      }`}
    >
      {/* Top row: Time + Badges */}
      <div>
        <div className="flex items-center justify-between gap-1 mb-1">
          <span className="text-[10.5px] font-bold text-[#202A36] flex items-center gap-1">
            <Clock className="w-2.5 h-2.5 text-[#77818D]" />
            {shift.timeRange}
          </span>
          <span className="text-[9.5px] text-[#77818D] font-medium">
            {shift.durationHours}h
          </span>
        </div>

        {/* Badges: IN FOCUS MODE, ONLY SHOW EXCEPTIONS (Peak, Onboarding). In Detailed mode, show all */}
        <div className="flex flex-wrap gap-1 mb-1.5">
          {shift.isPeak && (
            <span className="px-1.5 py-0.2 rounded text-[8.5px] font-bold bg-[#FAF5FF] text-[#C253D9] border border-[#F3E8FF] flex items-center gap-0.5">
              <Sparkles className="w-2 h-2" />
              Peak
            </span>
          )}

          {isOnboardingShift && isDraftOrPublished && (
            <span className="px-1.5 py-0.2 rounded text-[8.5px] font-bold bg-[#37B77D] text-white">
              ⭐ Noa Onboard
            </span>
          )}

          {/* Detailed Mode extra badges */}
          {!isFocus && (
            <>
              {shift.isOffPeak && !isOnboardingShift && (
                <span className="px-1 py-0.2 rounded text-[8.5px] font-medium bg-[#E8F8F0] text-[#37B77D]">
                  Off-Peak
                </span>
              )}

              {shift.requiresShiftLead && (
                <span className="px-1 py-0.2 rounded text-[8.5px] font-medium bg-[#EAF5FF] text-[#2F95F8]">
                  Lead Req.
                </span>
              )}

              {shift.requiresCloser && (
                <span className="px-1 py-0.2 rounded text-[8.5px] font-medium bg-[#F1F3F5] text-[#202A36]">
                  Closer
                </span>
              )}

              {shift.suitableForOnboarding && !isDraftOrPublished && (
                <span className="px-1 py-0.2 rounded text-[8.5px] font-semibold bg-[#E8F8F0] text-[#37B77D]">
                  Onboarding
                </span>
              )}
            </>
          )}
        </div>
      </div>

      {/* Bottom Area: Assigned Employees or Empty Requirements */}
      <div className="mt-1 pt-1 border-t border-[#E1E5E9]/60">
        {!isDraftOrPublished ? (
          /* Initial Unassigned State */
          <div className="space-y-0.5">
            <div className="flex items-center justify-between text-[9.5px] text-[#77818D]">
              <span className="flex items-center gap-0.5 font-medium">
                <Users className="w-2.5 h-2.5" />
                Needs {shift.needsCount}
              </span>
              <span className="text-amber-600 font-medium">Open</span>
            </div>
          </div>
        ) : (
          /* Assigned State: Clean and calm */
          <div className="space-y-0.5">
            {assignedEmployees.map((emp) => (
              <div
                key={emp.id}
                className={`flex items-center gap-1.5 px-1 py-0.5 rounded text-[10.5px] leading-tight ${
                  emp.isNew
                    ? 'bg-[#E8F8F0] text-[#202A36] font-semibold border border-[#BDEBD3]'
                    : highlightThursdayShift
                    ? 'bg-[#FAF5FF] text-[#202A36] font-medium'
                    : 'bg-[#F6F7F8] text-[#202A36]'
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full text-white text-[8px] flex items-center justify-center font-bold shrink-0"
                  style={{ backgroundColor: emp.avatarBg || '#6879EA' }}
                >
                  {emp.initials}
                </span>
                <span className="truncate">{emp.name}</span>
                {emp.isNew && (
                  <span className="ml-auto text-[7.5px] uppercase tracking-wider bg-[#37B77D] text-white px-1 py-0.2 rounded font-bold">
                    NEW
                  </span>
                )}
                {!isFocus && emp.role === 'Shift Lead' && (
                  <span className="ml-auto text-[7.5px] bg-[#EAF5FF] text-[#2F95F8] px-1 py-0.2 rounded font-medium">
                    Lead
                  </span>
                )}
              </div>
            ))}

            {/* If Onboarding Shift: Explicit button to trigger Manual Edit / שינוי ידני */}
            {isOnboardingShift && isDraftOrPublished && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenManualEdit?.();
                }}
                className="mt-1 w-full py-1 px-1.5 rounded-lg bg-white hover:bg-[#EAF5FF] border border-[#37B77D] text-[#168FF5] hover:text-[#2F95F8] text-[9.5px] font-bold flex items-center justify-center gap-1 shadow-2xs cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
                title="לחץ כאן לביצוע שינוי ידני של מועד החפיפה והחונך"
              >
                <Sliders className="w-2.5 h-2.5 text-[#2F95F8]" />
                <span>שינוי ידני (Manual Edit)</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
