import React from 'react';
import { Shift, Employee, DayOfWeek, SchedulerState, ViewMode, EmployeeHolidayStatus } from '../types';
import { Sparkles, Users, Sliders, Gift, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface WeeklyScheduleGridProps {
  shifts: Shift[];
  employees: Employee[];
  schedulerState: SchedulerState;
  selectedLocation: string;
  highlightThursdayShift: boolean;
  onboardingChoice: 'recommended' | 'alternative' | 'custom';
  viewMode: ViewMode;
  onOpenManualEdit?: () => void;
  noaHolidayStatus?: EmployeeHolidayStatus;
}

const DAYS: {
  name: DayOfWeek;
  short: string;
  date: string;
  holidayBadge?: string;
  isHolidayEve?: boolean;
}[] = [
  { name: 'Sunday', short: 'SUN', date: 'Sep 13', holidayBadge: 'ערב חג', isHolidayEve: true },
  { name: 'Monday', short: 'MON', date: 'Sep 14', holidayBadge: 'חג' },
  { name: 'Tuesday', short: 'TUE', date: 'Sep 15' },
  { name: 'Wednesday', short: 'WED', date: 'Sep 16' },
  { name: 'Thursday', short: 'THU', date: 'Sep 17' },
  { name: 'Friday', short: 'FRI', date: 'Sep 18' },
  { name: 'Saturday', short: 'SAT', date: 'Sep 19' },
];

const ROWS: { slot: 'Morning' | 'Evening'; label: string }[] = [
  { slot: 'Morning', label: 'Morning' },
  { slot: 'Evening', label: 'Evening' },
];

const LOCATION_LABEL: Record<string, string> = {
  'Main Café': 'Main Café',
  'Riverside Coffee Cart': 'Riverside Coffee Cart',
};

export const WeeklyScheduleGrid: React.FC<WeeklyScheduleGridProps> = ({
  shifts,
  employees,
  schedulerState,
  selectedLocation,
  highlightThursdayShift,
  onboardingChoice,
  viewMode,
  onOpenManualEdit,
  noaHolidayStatus = 'flexible_voucher',
}) => {
  const isDraftOrPublished =
    schedulerState === 'draft_generated' ||
    schedulerState === 'reviewing_decisions' ||
    schedulerState === 'published';

  const employeeMap = new Map(employees.map((emp) => [emp.id, emp]));

  const locationsToDisplay =
    selectedLocation === 'All Locations'
      ? ['Main Café', 'Riverside Coffee Cart']
      : [selectedLocation];

  return (
    <div
      id="weekly-schedule-grid"
      className="bg-white border border-[#E1E5E9] rounded-2xl shadow-xs overflow-hidden"
    >
      {/* Day header — date only, quiet */}
      <div className="grid grid-cols-[110px_repeat(7,1fr)] border-b border-[#E1E5E9] bg-[#F6F7F8]">
        <div className="px-2.5 py-2 text-[10.5px] font-bold text-[#77818D] uppercase tracking-wider border-r border-[#E1E5E9] flex items-center">
          Shift
        </div>
        {DAYS.map((day) => (
          <div
            key={day.name}
            className={`px-2 py-2 text-center border-r last:border-r-0 border-[#E1E5E9] ${
              day.name === 'Thursday' && highlightThursdayShift ? 'bg-[#FAF5FF]' : ''
            }`}
          >
            <span className="text-[11px] font-bold text-[#202A36]">{day.short}</span>
            <span className="text-[11px] text-[#77818D] ml-1">{day.date.replace('Sep ', '')}</span>
            {day.holidayBadge && (
              <span className="block text-[9px] font-semibold text-amber-700">
                {day.holidayBadge}
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="divide-y divide-[#E1E5E9]">
        {locationsToDisplay.map((location) => {
          const locationShifts = shifts.filter((s) => s.location === location);

          return (
            <div key={location} className="divide-y divide-[#E1E5E9]/60">
              {/* Slim location strip */}
              <div className="bg-[#FAFBFD] px-3 py-1.5 flex items-center gap-2 border-y border-[#E1E5E9]">
                <span className="w-2 h-2 rounded-full bg-[#2F95F8]" />
                <span className="text-[12px] font-bold text-[#202A36]">
                  {LOCATION_LABEL[location] ?? location}
                </span>
                <span className="ml-auto text-[10.5px] text-[#77818D]">
                  {locationShifts.length} shifts
                </span>
              </div>

              {ROWS.map(({ slot, label }) => (
                <div
                  key={`${location}-${slot}`}
                  className="grid grid-cols-[110px_repeat(7,1fr)] min-h-[76px]"
                >
                  <div className="px-2.5 py-2 bg-[#FCFCFD] border-r border-[#E1E5E9] flex items-center">
                    <span className="text-[12px] font-semibold text-[#202A36]">{label}</span>
                  </div>

                  {DAYS.map((day) => {
                    const shift = locationShifts.find(
                      (s) => s.day === day.name && s.timeSlot === slot
                    );
                    const isThuHighlight =
                      shift?.id === 'shift-thu-mc-eve' && highlightThursdayShift;

                    return (
                      <div
                        key={`${location}-${slot}-${day.name}`}
                        className={`p-1 border-r last:border-r-0 border-[#E1E5E9] ${
                          isThuHighlight ? 'bg-[#FAF5FF]' : 'bg-[#FDFDFE]'
                        }`}
                      >
                        {shift ? (
                          <ShiftCard
                            shift={shift}
                            isDraftOrPublished={isDraftOrPublished}
                            employeeMap={employeeMap}
                            highlightThursdayShift={!!isThuHighlight}
                            onboardingChoice={onboardingChoice}
                            viewMode={viewMode}
                            onOpenManualEdit={onOpenManualEdit}
                            noaHolidayStatus={noaHolidayStatus}
                          />
                        ) : (
                          <div className="h-full flex items-center justify-center text-[11px] text-[#C3CAD3]">
                            —
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
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
  onOpenManualEdit?: () => void;
  noaHolidayStatus?: EmployeeHolidayStatus;
}

const ShiftCard: React.FC<ShiftCardProps> = ({
  shift,
  isDraftOrPublished,
  employeeMap,
  highlightThursdayShift,
  onboardingChoice,
  viewMode,
  onOpenManualEdit,
  noaHolidayStatus = 'flexible_voucher',
}) => {
  const isOnboardingShift =
    (shift.id === 'shift-sun-mc-morn' && onboardingChoice === 'recommended') ||
    (shift.id === 'shift-sat-mc-morn' && onboardingChoice === 'alternative');

  const assignedEmployees = shift.assignedEmployeeIds
    .map((id) => employeeMap.get(id))
    .filter((emp): emp is Employee => Boolean(emp));

  const isFocus = viewMode === 'focus';
  const showHolidayNote =
    shift.day === 'Sunday' &&
    isDraftOrPublished &&
    assignedEmployees.some((emp) => emp.isNew);

  const holidayNote =
    noaHolidayStatus === 'flexible_voucher'
      ? { icon: Gift, text: 'נועה פתוחה · שובר', cls: 'text-amber-700' }
      : noaHolidayStatus === 'open'
      ? { icon: CheckCircle2, text: 'נועה פתוחה לשיבוץ', cls: 'text-[#168FF5]' }
      : { icon: AlertTriangle, text: 'נועה חסומה באילוץ', cls: 'text-rose-600' };
  const HolidayIcon = holidayNote.icon;

  return (
    <div
      id={`shift-card-${shift.id}`}
      className={`rounded-lg p-1.5 h-full flex flex-col gap-1 border text-left transition-all ${
        highlightThursdayShift
          ? 'ring-2 ring-[#C253D9] bg-white border-[#C253D9]'
          : isOnboardingShift && isDraftOrPublished
          ? 'border-[#BDEBD3] bg-[#F6FDF9]'
          : isDraftOrPublished
          ? 'border-[#E1E5E9] bg-white hover:border-[#BAE0FD]'
          : 'border-dashed border-[#D8DEE5] bg-[#FAFBFC]'
      }`}
    >
      {/* One quiet header line: time + at most one badge */}
      <div className="flex items-center justify-between gap-1">
        <span className="text-[10.5px] font-bold text-[#202A36]">{shift.timeRange}</span>
        {isOnboardingShift && isDraftOrPublished ? (
          <span className="text-[8.5px] font-bold text-[#1F9D62]">★ Noa</span>
        ) : shift.isPeak ? (
          <span title="Peak shift"><Sparkles className="w-2.5 h-2.5 text-[#C253D9] shrink-0" /></span>
        ) : null}
      </div>

      {!isDraftOrPublished ? (
        <span className="flex items-center gap-1 text-[9.5px] font-medium text-[#77818D]">
          <Users className="w-2.5 h-2.5" />
          Needs {shift.needsCount}
        </span>
      ) : (
        <div className="space-y-0.5">
          {assignedEmployees.map((emp) => (
            <div
              key={emp.id}
              className="flex items-center gap-1.5 text-[10.5px] leading-tight text-[#202A36]"
            >
              <span
                className="w-3.5 h-3.5 rounded-full text-white text-[8px] flex items-center justify-center font-bold shrink-0"
                style={{ backgroundColor: emp.avatarBg || '#6879EA' }}
              >
                {emp.initials}
              </span>
              <span className={`truncate ${emp.isNew ? 'font-semibold' : ''}`}>{emp.name}</span>
              {!isFocus && emp.role === 'Shift Lead' && (
                <span className="ml-auto text-[8px] text-[#2F95F8] font-semibold">Lead</span>
              )}
            </div>
          ))}

          {showHolidayNote && (
            <span
              className={`flex items-center gap-1 text-[9px] font-semibold ${holidayNote.cls}`}
            >
              <HolidayIcon className="w-2.5 h-2.5 shrink-0" />
              <span className="truncate">{holidayNote.text}</span>
            </span>
          )}

          {isOnboardingShift && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenManualEdit?.();
              }}
              className="mt-0.5 w-full py-0.5 rounded-md border border-[#E1E5E9] text-[#168FF5] hover:bg-[#EAF5FF] text-[9px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
              title="שינוי ידני של מועד החפיפה והחונך"
            >
              <Sliders className="w-2.5 h-2.5" />
              שינוי ידני
            </button>
          )}
        </div>
      )}
    </div>
  );
};
