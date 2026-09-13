import React, { useState, useEffect } from 'react';
import {
  Home,
  Calendar,
  MessageSquare,
  User,
  CheckCircle2,
  Circle,
  Wifi,
  Battery,
  Clock,
  MapPin,
  Sparkles,
  ChevronRight,
  Bell,
  Send,
  Coffee,
  Plus,
  ArrowLeftRight,
  Users,
  Settings,
  Search,
  Eye,
  Gift,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  PhoneCall,
  Flame,
  Award,
  Pencil,
  Sun,
  Moon,
  Check,
  GraduationCap,
  CheckSquare,
  FileText,
} from 'lucide-react';
import {
  Employee,
  OnboardingAssignmentOption,
  EmployeeHolidayStatus,
  AvailabilityOptionType,
  ShiftHoursPreset,
  DayAvailabilityRecord,
  OnboardingPlanConfig,
} from '../types';
import { DEFAULT_ONBOARDING_PLAN } from '../data/mockData';

interface MobileSimulatorProps {
  isPublished: boolean;
  onboardingChoice: OnboardingAssignmentOption;
  employees: Employee[];
  onOpenMessageModal: (name?: string) => void;
  customBuddyId?: string;
  holidayStatus?: EmployeeHolidayStatus;
  onHolidayStatusChange?: (status: EmployeeHolidayStatus) => void;
  onboardingPlan?: OnboardingPlanConfig;
  onOpenOnboardingPlanModal?: () => void;
}

export interface AvailabilityDayItem {
  key: string;
  hebrewLabel: string;
  dayName: string;
  holidayTag?: string;
  isHolidayEve?: boolean;
}

const AVAILABILITY_DAYS: AvailabilityDayItem[] = [
  { key: 'sun4', hebrewLabel: "Sun 4", dayName: 'Sunday', holidayTag: 'Holiday Eve 🍯', isHolidayEve: true },
  { key: 'mon5', hebrewLabel: "Mon 5", dayName: 'Monday', holidayTag: 'Holiday 🌿' },
  { key: 'tue6', hebrewLabel: "Tue 6", dayName: 'Tuesday' },
  { key: 'wed7', hebrewLabel: "Wed 7", dayName: 'Wednesday' },
  { key: 'thu8', hebrewLabel: "Thu 8", dayName: 'Thursday' },
  { key: 'fri9', hebrewLabel: "Fri 9", dayName: 'Friday' },
  { key: 'sat3', hebrewLabel: "Sat 3", dayName: 'Saturday' },
];

export const MobileSimulator: React.FC<MobileSimulatorProps> = ({
  isPublished,
  onboardingChoice,
  employees,
  onOpenMessageModal,
  customBuddyId,
  holidayStatus = 'constraint',
  onHolidayStatusChange,
  onboardingPlan = DEFAULT_ONBOARDING_PLAN,
  onOpenOnboardingPlanModal,
}) => {
  // Tabs: 'schedule' (My Schedule), 'onboarding' (My Onboarding), 'everyone' (Everyone), 'availability' (My Availability), 'swaps' (Swaps)
  const [activeTab, setActiveTab] = useState<'schedule' | 'availability' | 'swaps' | 'everyone' | 'onboarding'>('availability');
  const [showNotificationToast, setShowNotificationToast] = useState(false);
  const [checkedAckIds, setCheckedAckIds] = useState<Record<string, boolean>>({
    'ack-1': true,
  });
  const [isSignedOff, setIsSignedOff] = useState(false);
  const [checklist, setChecklist] = useState({
    safetyGuidelines: true,
    setupGuide: false,
    arriveEarly: false,
    meetCounter: false,
  });
  const [isShiftAcknowledged, setIsShiftAcknowledged] = useState(false);

  // Availability screen state (matching user screenshot)
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<'sat3' | 'fri2' | 'thu1' | 'wed30' | 'tue29' | 'mon28' | 'sun27'>('sat3');
  const [internalHolidayStatus, setInternalHolidayStatus] = useState<EmployeeHolidayStatus>('constraint');
  const currentHolidayStatus = holidayStatus !== undefined ? holidayStatus : internalHolidayStatus;
  const updateHolidayStatus = (newSt: EmployeeHolidayStatus) => {
    if (onHolidayStatusChange) {
      onHolidayStatusChange(newSt);
    } else {
      setInternalHolidayStatus(newSt);
    }
  };

  // Day availability records state (each day has type, hoursPreset, startTime, endTime, note)
  const [dayRecords, setDayRecords] = useState<Record<string, DayAvailabilityRecord>>({
    sun4: {
      type: holidayStatus === 'constraint' ? 'unavailable' : 'available',
      hoursPreset: 'all_day',
      startTime: '08:00',
      endTime: '14:00',
    },
    mon5: { type: 'available', hoursPreset: 'all_day', startTime: '08:00', endTime: '22:00' },
    tue6: { type: 'available', hoursPreset: 'all_day', startTime: '08:00', endTime: '22:00' },
    wed7: { type: 'available', hoursPreset: 'all_day', startTime: '08:00', endTime: '22:00' },
    thu8: { type: 'available', hoursPreset: 'all_day', startTime: '08:00', endTime: '22:00' },
    fri9: { type: 'available', hoursPreset: 'morning', startTime: '08:00', endTime: '15:00' },
    sat3: { type: 'available', hoursPreset: 'evening', startTime: '18:00', endTime: '23:30' },
  });
  const [activeMenuDay, setActiveMenuDay] = useState<AvailabilityDayItem | null>(null);
  const [draftRecord, setDraftRecord] = useState<DayAvailabilityRecord>({
    type: 'available',
    hoursPreset: 'all_day',
    startTime: '08:00',
    endTime: '22:00',
    note: '',
  });
  const [savedNotification, setSavedNotification] = useState<string | null>(null);
  const [swapRequested, setSwapRequested] = useState(false);

  // Trigger push notification toast upon publishing
  useEffect(() => {
    if (isPublished) {
      setShowNotificationToast(true);
      const timer = setTimeout(() => {
        setShowNotificationToast(false);
      }, 7000);
      return () => clearTimeout(timer);
    } else {
      setShowNotificationToast(false);
      setIsShiftAcknowledged(false);
      setChecklist({
        safetyGuidelines: true,
        setupGuide: false,
        arriveEarly: false,
        meetCounter: false,
      });
    }
  }, [isPublished]);

  // Determine assigned buddy and shift details
  const buddy = (() => {
    if (onboardingChoice === 'alternative') {
      return employees.find((e) => e.id === 'emp-dana') || employees[0];
    }
    if (customBuddyId) {
      return employees.find((e) => e.id === customBuddyId) || employees[1];
    }
    // Default recommended: Yossi Cohen
    return employees.find((e) => e.id === 'emp-yossi') || employees[1];
  })();

  const shiftInfo =
    onboardingChoice === 'alternative'
      ? {
          day: 'Saturday, Sep 19',
          shortDay: 'Saturday, Sep 19',
          time: '09:00–13:00',
          location: 'Main Café',
          badge: 'Training Shift',
          badgeColor: '#F3A43B',
          isAlternative: true,
        }
      : {
          day: 'Sunday, Sep 13',
          shortDay: 'Sunday, Sep 13',
          time: '10:00–14:00',
          location: 'Main Café',
          badge: 'Onboarding Shift (Quiet Hours)',
          badgeColor: '#37B77D',
          isAlternative: false,
        };

  const handleToggleChecklist = (key: keyof typeof checklist) => {
    setChecklist((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleAcknowledgeShift = () => {
    setChecklist({
      safetyGuidelines: true,
      setupGuide: true,
      arriveEarly: true,
      meetCounter: true,
    });
    setIsShiftAcknowledged(true);
  };

  const getDayRecord = (dayKey: string): DayAvailabilityRecord => {
    const existing = dayRecords[dayKey];
    if (dayKey === 'sun4') {
      if (currentHolidayStatus === 'constraint') {
        return {
          type: 'unavailable',
          hoursPreset: 'all_day',
          startTime: '09:00',
          endTime: '17:00',
          note: existing?.note || '',
        };
      }
      if (currentHolidayStatus === 'flexible_voucher') {
        return {
          type: 'available',
          hoursPreset: 'all_day',
          startTime: '08:00',
          endTime: '14:00',
          note: 'Flexible for the holiday eve in exchange for a voucher 🎁',
        };
      }
    }
    return (
      existing || {
        type: 'available',
        hoursPreset: 'all_day',
        startTime: '08:00',
        endTime: '22:00',
      }
    );
  };

  const getDayStatus = (dayKey: string): AvailabilityOptionType => {
    return getDayRecord(dayKey).type;
  };

  const getAvailableLabel = (rec: DayAvailabilityRecord, isHolidayEve?: boolean): string => {
    if (isHolidayEve && rec.hoursPreset === 'all_day') {
      return 'Holiday Eve (08:00 - 14:00)';
    }
    if (rec.hoursPreset === 'morning') {
      return `Morning (${rec.startTime || '08:00'}-${rec.endTime || '16:00'})`;
    }
    if (rec.hoursPreset === 'evening') {
      return `Evening (${rec.startTime || '16:00'}-${rec.endTime || '23:00'})`;
    }
    if (rec.hoursPreset === 'custom') {
      return `${rec.startTime || '08:00'} - ${rec.endTime || '16:00'}`;
    }
    return 'All day';
  };

  const handleOpenEditDay = (day: AvailabilityDayItem) => {
    const current = getDayRecord(day.key);
    setDraftRecord({ ...current });
    setActiveMenuDay(day);
  };

  const handleSaveDraftRecord = () => {
    if (!activeMenuDay) return;
    const dayKey = activeMenuDay.key;

    setDayRecords((prev) => ({
      ...prev,
      [dayKey]: draftRecord,
    }));

    if (dayKey === 'sun4') {
      if (draftRecord.type === 'unavailable') {
        updateHolidayStatus('constraint');
      } else if (draftRecord.type === 'available') {
        if (draftRecord.note?.includes('voucher')) {
          updateHolidayStatus('flexible_voucher');
        } else {
          updateHolidayStatus('open');
        }
      } else {
        updateHolidayStatus('constraint');
      }
    }

    setSavedNotification(`Availability for ${activeMenuDay.dayName} saved successfully!`);
    setTimeout(() => setSavedNotification(null), 2500);
    setActiveMenuDay(null);
  };

  const handleToggleHolidayFlexibility = () => {
    updateHolidayStatus(currentHolidayStatus === 'flexible_voucher' ? 'open' : 'flexible_voucher');
  };

  return (
    <div
      id="mobile-simulator-container"
      className="w-full h-full flex flex-col items-center justify-center p-3 sm:p-5 select-none"
    >
      {/* Device Hardware Bezel */}
      <div className="w-[340px] xl:w-[360px] h-[720px] bg-[#1E293B] rounded-[48px] p-3 shadow-2xl ring-1 ring-black/20 flex flex-col relative">
        {/* Speaker and Camera Notch Island */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-black rounded-full z-40 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-[#111827] mr-2" />
          <div className="w-2 h-2 rounded-full bg-[#1e293b]" />
        </div>

        {/* Screen Glass Area */}
        <div className="w-full h-full bg-[#F6F7F8] rounded-[38px] overflow-hidden flex flex-col relative border border-[#cbd5e1]/40">
          {/* iOS / Android Status Bar */}
          <div className="h-10 px-6 pt-1 flex items-center justify-between text-xs font-semibold text-[#202A36] shrink-0 bg-white z-30">
            <span>9:41</span>
            <div className="flex items-center gap-1.5 text-[#202A36]">
              <Wifi className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold">5G</span>
              <Battery className="w-4 h-4 fill-current" />
            </div>
          </div>

          {/* Connecteam Mobile App Header */}
          <div className="h-12 px-4 bg-white border-b border-[#E1E5E9] flex items-center justify-between shrink-0 z-30">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#2F95F8] flex items-center justify-center text-white text-xs font-bold">
                ✓
              </div>
              <span className="font-bold text-[14px] text-[#202A36] tracking-tight">
                Bean & Bloom
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#6879EA] text-white flex items-center justify-center font-bold text-[10px]">
                NS
              </span>
              <span className="text-[11px] font-bold text-[#202A36]">Noa (Week 1)</span>
            </div>
          </div>

          {/* New Employee Onboarding Quick Access Strip */}
          <div
            onClick={() => setActiveTab('onboarding')}
            className={`px-3 py-2 flex items-center justify-between text-white text-[11.5px] font-bold shrink-0 cursor-pointer shadow-2xs transition-all ${
              isSignedOff
                ? 'bg-gradient-to-r from-emerald-600 to-teal-700'
                : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 animate-pulse'
            }`}
            dir="rtl"
          >
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>
                {isSignedOff
                  ? 'Onboarding plan approved ✓ Continue to view tasks'
                  : 'Welcome, Noa! Tap to view your onboarding plan ☕'}
              </span>
            </div>
            <span className="bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded-full text-[10px] shrink-0">
              {isSignedOff ? 'Approved ✓' : 'Start Onboarding ←'}
            </span>
          </div>

          {/* Interactive Slide-down Push Notification Toast */}
          {showNotificationToast && (
            <div
              id="mobile-push-notification-toast"
              onClick={() => {
                setActiveTab('schedule');
                setShowNotificationToast(false);
              }}
              className="absolute top-12 left-3 right-3 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-[#BAE0FD] z-50 cursor-pointer animate-in slide-in-from-top-4 duration-300 text-right"
              dir="rtl"
            >
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#2F95F8] text-white flex items-center justify-center shrink-0">
                  <Bell className="w-4 h-4 animate-bounce" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#2F95F8] uppercase">
                      Connecteam Schedule
                    </span>
                    <span className="text-[10px] text-[#77818D]">Now</span>
                  </div>
                  <p className="text-[12px] font-semibold text-[#202A36] leading-tight mt-0.5">
                    New schedule published — your first shift is ready.
                  </p>
                  <p className="text-[11px] text-[#77818D] truncate">
                    Tap to review your mentor & preparation steps.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Screen Content Body with internal scroll */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-16 bg-[#F6F7F8]">
            {/* TAB: My Availability (AVAILABILITY - MATCHING USER SCREENSHOT) */}
            {activeTab === 'availability' && (
              <div className="space-y-2.5 animate-in fade-in duration-200 text-right select-none" dir="rtl">
                {/* Top Secondary Action Bar (Matching screenshot: Gear, Search, Eye, Calendar, Schedule >) */}
                <div className="flex items-center justify-between px-1 py-1 text-[#475569] border-b border-[#E1E5E9]/60">
                  <div className="flex items-center gap-3">
                    <Settings className="w-4 h-4 text-[#77818D] hover:text-[#202A36] cursor-pointer" />
                    <Search className="w-4 h-4 text-[#77818D] hover:text-[#202A36] cursor-pointer" />
                    <Eye className="w-4 h-4 text-[#77818D] hover:text-[#202A36] cursor-pointer" />
                    <Calendar className="w-4 h-4 text-[#77818D] hover:text-[#202A36] cursor-pointer" />
                  </div>
                  <div className="flex items-center gap-1 text-[13px] font-bold text-[#202A36] cursor-pointer">
                    <span>Schedule</span>
                    <ChevronRight className="w-4 h-4 text-[#77818D] rotate-180" />
                  </div>
                </div>

                {/* Week Day Strip (Matching screenshot: Sat 3 (blue), Fri 2, Thu 1, Wed 30, Tue 29, Mon 28, Sun 27) */}
                <div className="flex items-center justify-between px-1 py-1 text-center font-bold">
                  {[
                    { key: 'sat3', day: "Sat", num: '3' },
                    { key: 'fri2', day: "Fri", num: '2' },
                    { key: 'thu1', day: "Thu", num: '1' },
                    { key: 'wed30', day: "Wed", num: '30' },
                    { key: 'tue29', day: "Tue", num: '29' },
                    { key: 'mon28', day: "Mon", num: '28' },
                    { key: 'sun27', day: "Sun", num: '27' },
                  ].map((item) => (
                    <div
                      key={item.key}
                      onClick={() => setSelectedCalendarDay(item.key as any)}
                      className="flex flex-col items-center gap-1 cursor-pointer"
                    >
                      <span className="text-[11px] text-[#77818D]">{item.day}</span>
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold transition-all ${
                          selectedCalendarDay === item.key
                            ? 'bg-[#00A3FF] text-white shadow-xs'
                            : 'text-[#475569] hover:bg-[#E2E8F0]'
                        }`}
                      >
                        {item.num}
                      </div>
                    </div>
                  ))}
                </div>

                {/* HOLIDAY & VACATION INCENTIVE ALERT BANNER (Requested by user) */}
                <div className="p-3 rounded-2xl bg-gradient-to-l from-[#FFF7ED] to-[#FEF3C7] border border-[#FDBA74] shadow-xs space-y-2 animate-in zoom-in-95 duration-200">
                  <div className="flex items-center gap-2 text-amber-950 font-bold text-[12.5px]">
                    <div className="w-5 h-5 rounded-md bg-amber-500 text-white flex items-center justify-center shrink-0">
                      <Gift className="w-3.5 h-3.5" />
                    </div>
                    <span>Holiday eve week ahead (Sun 4): high availability needed!</span>
                  </div>
                  <p className="text-[11px] text-amber-900 leading-snug">
                    "Heads up: <strong>Sunday (the 4th) is a holiday eve 🍯</strong> (schedule 08:00–14:00). If you leave the day open for scheduling with no constraints, or declare flexibility – <strong className="text-[#00A3FF]">you'll get a gift voucher (breakfast for two)!</strong>" 🎁
                  </p>

                  <div className="pt-0.5">
                    <button
                      id="mobile-holiday-flexible-btn"
                      onClick={() => {
                        updateHolidayStatus(
                          currentHolidayStatus === 'flexible_voucher' ? 'open' : 'flexible_voucher'
                        );
                      }}
                      className={`w-full py-1.5 px-3 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        currentHolidayStatus === 'flexible_voucher'
                          ? 'bg-[#E8F8F0] text-[#37B77D] border border-[#BDEBD3]'
                          : 'bg-[#00A3FF] hover:bg-[#0092E5] text-white shadow-2xs'
                      }`}
                    >
                      {currentHolidayStatus === 'flexible_voucher' ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>You're marked open for the holiday eve! Eligible for a voucher 🎁</span>
                        </>
                      ) : (
                        <>
                          <Award className="w-3.5 h-3.5" />
                          <span>I'm flexible for the holiday eve (count me in for the voucher!) 🎁</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Weekly Summary Dropdown Strip (Matching screenshot: Weekly Summary) */}
                <div className="flex items-center justify-between py-1.5 px-3 bg-white rounded-xl border border-[#E1E5E9] text-[12px] text-[#202A36] font-bold shadow-2xs">
                  <div className="flex flex-col items-start gap-0 text-[10px] text-[#77818D]">
                    <ChevronUp className="w-3 h-3 -mb-1" />
                    <ChevronDown className="w-3 h-3" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Weekly Summary Sep 27 - Oct 03</span>
                    <span className="text-[#00A3FF]">
                      {
                        AVAILABILITY_DAYS.filter((d) => {
                          const st = getDayStatus(d.key);
                          return st === 'available' || st === 'prefer_not';
                        }).length
                      }{' '}
                      days open for scheduling
                    </span>
                  </div>
                </div>

                {/* Daily Availability Rows (Matching screenshot) */}
                <div className="bg-white rounded-2xl p-2 border border-[#E1E5E9] shadow-xs space-y-1 relative">
                  {savedNotification && (
                    <div className="p-2 mb-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11.5px] font-bold flex items-center justify-center gap-1.5 animate-in fade-in duration-150">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{savedNotification}</span>
                    </div>
                  )}

                  {AVAILABILITY_DAYS.map((day) => {
                    const record = getDayRecord(day.key);
                    const status = record.type;
                    const isSundayFlexible = day.key === 'sun4' && currentHolidayStatus === 'flexible_voucher';

                    return (
                      <div
                        key={day.key}
                        className="flex items-center justify-between py-2 px-2 border-b border-[#F1F5F9] last:border-b-0 hover:bg-[#F8FAFC]/70 rounded-lg transition-colors"
                      >
                        {/* Status / Action Button on Left (Editable!) */}
                        <div className="flex-1">
                          {isSundayFlexible ? (
                            <button
                              onClick={() => handleOpenEditDay(day)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gradient-to-r from-[#FEF3C7] to-[#FFFBEB] text-amber-950 font-bold text-[11px] border border-amber-300 cursor-pointer shadow-2xs hover:border-amber-400 transition-all text-right group active:scale-[0.98]"
                              title="Click to edit holiday eve availability"
                            >
                              <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                              <span>Open for holiday eve · Voucher 🎁</span>
                              <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-amber-900 bg-white/80 px-1.5 py-0.5 rounded-md border border-amber-200 group-hover:bg-white transition-colors">
                                <Pencil className="w-2.5 h-2.5 text-amber-700" />
                                <span>Edit</span>
                              </span>
                            </button>
                          ) : status === 'unavailable' ? (
                            <button
                              onClick={() => handleOpenEditDay(day)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#FEE2E2] hover:bg-[#FECACA] text-[#DC2626] font-bold text-[11px] border border-[#FECACA] cursor-pointer transition-all shadow-2xs text-right active:scale-[0.98] group"
                              title="Click to edit unavailability constraint"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] shrink-0" />
                              <span>Unavailable ({record.startTime && record.endTime ? `${record.startTime} - ${record.endTime}` : '09:00 - 17:00'})</span>
                              <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-rose-700 bg-white/80 px-1.5 py-0.5 rounded-md border border-rose-200 group-hover:bg-white transition-colors">
                                <Pencil className="w-2.5 h-2.5 text-rose-600" />
                                <span>Edit</span>
                              </span>
                            </button>
                          ) : status === 'prefer_not' ? (
                            <button
                              onClick={() => handleOpenEditDay(day)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#FEF3C7] hover:bg-[#FDE68A] text-amber-900 font-bold text-[11px] border border-amber-300 cursor-pointer transition-all shadow-2xs text-right active:scale-[0.98] group"
                              title="Click to edit preference"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                              <span>Prefer not to</span>
                              <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-amber-900 bg-white/80 px-1.5 py-0.5 rounded-md border border-amber-200 group-hover:bg-white transition-colors">
                                <Pencil className="w-2.5 h-2.5 text-amber-700" />
                                <span>Edit</span>
                              </span>
                            </button>
                          ) : status === 'vacation' ? (
                            <button
                              onClick={() => handleOpenEditDay(day)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#FAF5FF] hover:bg-[#F3E8FF] text-purple-900 font-bold text-[11px] border border-[#E9D5FF] cursor-pointer transition-all shadow-2xs text-right active:scale-[0.98] group"
                              title="Click to edit time off"
                            >
                              <span className="text-xs">🌴</span>
                              <span>Time off (vacation day)</span>
                              <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-purple-900 bg-white/80 px-1.5 py-0.5 rounded-md border border-purple-200 group-hover:bg-white transition-colors">
                                <Pencil className="w-2.5 h-2.5 text-purple-700" />
                                <span>Edit</span>
                              </span>
                            </button>
                          ) : (
                            /* Default: available - Open for scheduling (editable!) */
                            <button
                              onClick={() => handleOpenEditDay(day)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#E8F8F0] hover:bg-[#D4F4E2] text-[#166534] font-bold text-[11px] border border-[#BDEBD3] hover:border-[#86EFAC] cursor-pointer transition-all shadow-2xs group text-right active:scale-[0.98]"
                              title="Click to edit availability hours and scheduling preferences"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                              <span>Open for scheduling: {getAvailableLabel(record, day.isHolidayEve)}</span>
                              <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-[#15803D] bg-white/80 px-1.5 py-0.5 rounded-md border border-[#86EFAC]/60 group-hover:bg-white transition-colors">
                                <Pencil className="w-2.5 h-2.5 text-[#15803D]" />
                                <span>Edit</span>
                              </span>
                            </button>
                          )}
                        </div>

                        {/* Day Label on Right */}
                        <div className="flex items-center gap-1.5 pr-1 shrink-0">
                          {day.holidayTag && (
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9.5px] font-bold border ${
                                day.isHolidayEve
                                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                                  : 'bg-purple-100 text-purple-900 border-purple-200'
                              }`}
                            >
                              {day.holidayTag}
                            </span>
                          )}
                          <span className="text-[13px] font-bold text-[#202A36]">
                            {day.hebrewLabel}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Floating (+) Action Button (Matching screenshot on lower left) */}
                <div className="flex justify-start pt-1">
                  <button
                    onClick={() => handleOpenEditDay(AVAILABILITY_DAYS[0])}
                    className="w-10 h-10 rounded-full bg-white hover:bg-[#F8FAFC] border border-[#E1E5E9] shadow-md flex items-center justify-center text-[#202A36] font-bold cursor-pointer transition-transform active:scale-95"
                    title="Add a constraint or edit availability"
                  >
                    <Plus className="w-5 h-5 text-[#475569]" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB: My Schedule (MY SCHEDULE) */}
            {activeTab === 'schedule' && (
              <div className="space-y-3 animate-in fade-in duration-200 text-right select-none" dir="rtl">
                <div className="flex items-center justify-between">
                  <h2 className="text-[18px] font-bold text-[#202A36]">
                    My Schedule
                  </h2>
                  <span className="text-[11px] font-medium text-[#77818D]">
                    Week of Sep 13–19
                  </span>
                </div>

                {!isPublished ? (
                  <div className="bg-white rounded-2xl p-6 text-center border border-[#E1E5E9] space-y-2">
                    <Calendar className="w-8 h-8 text-[#cbd5e1] mx-auto" />
                    <p className="text-[13px] font-semibold text-[#202A36]">
                      Schedule still in draft
                    </p>
                    <p className="text-[12px] text-[#77818D]">
                      Your manager is building the schedule based on your availability. You'll get a notification once it's published!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* First Shift Card Highlighted */}
                    <div className="bg-white border-2 border-[#37B77D] rounded-2xl p-4 shadow-sm space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#37B77D] text-white">
                          First Onboarding Shift ☕
                        </span>
                        <span className="text-[11px] font-bold text-[#202A36]">
                          Sunday, Sep 13
                        </span>
                      </div>

                      <div className="text-[16px] font-bold text-[#202A36]">
                        {shiftInfo.time} (Mid-to-close shift at the garden cart)
                      </div>

                      <div className="flex items-center gap-1.5 text-[12px] text-[#77818D]">
                        <MapPin className="w-3.5 h-3.5 text-[#2F95F8]" />
                        <span>Garden Coffee Cart (near the family area)</span>
                      </div>

                      <div className="pt-2 border-t border-[#E1E5E9] flex items-center justify-between text-[12px]">
                        <span className="text-[#77818D]">Mentor:</span>
                        <span className="font-semibold text-[#202A36]">
                          {buddy.name}
                        </span>
                      </div>
                    </div>

                    {/* Rest of the week shifts */}
                    <div className="bg-white rounded-xl p-3 border border-[#E1E5E9] flex items-center justify-between text-[12px]">
                      <span className="font-bold text-[#202A36]">Monday, Sep 14</span>
                      <span className="text-[#77818D]">Day off</span>
                    </div>
                    <div className="bg-white rounded-xl p-3 border border-[#E1E5E9] flex items-center justify-between text-[12px]">
                      <span className="font-bold text-[#202A36]">Tuesday, Sep 15</span>
                      <span className="text-[#00A3FF] font-semibold">14:00 - 19:00 (Evening shift at the garden)</span>
                    </div>
                    <div className="bg-white rounded-xl p-3 border border-[#E1E5E9] flex items-center justify-between text-[12px]">
                      <span className="font-bold text-[#202A36]">Wednesday, Sep 16</span>
                      <span className="text-[#77818D]">Day off</span>
                    </div>
                    <div className="bg-white rounded-xl p-3 border border-[#E1E5E9] flex items-center justify-between text-[12px]">
                      <span className="font-bold text-[#202A36]">Friday, Sep 18</span>
                      <span className="text-[#37B77D] font-semibold">08:00 - 15:00 (Friday closing shift before Shabbat)</span>
                    </div>
                    <div className="bg-white rounded-xl p-3 border border-[#E1E5E9] flex items-center justify-between text-[12px]">
                      <span className="font-bold text-[#202A36]">Saturday, Sep 19</span>
                      <span className="text-[#37B77D] font-semibold">10:00 - 18:00 (Saturday shift at the garden)</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: Swaps (SHIFT SWAPS / ILLNESS / COVERAGE - FROM LIRON'S CONVERSATION) */}
            {activeTab === 'swaps' && (
              <div className="space-y-3 animate-in fade-in duration-200 text-right select-none" dir="rtl">
                <div className="flex items-center justify-between">
                  <h2 className="text-[18px] font-bold text-[#202A36]">
                    Swaps & Urgent Coverage
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF5FF] text-[#168FF5]">
                    Immediate help
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
                  <div className="flex items-center gap-2 text-rose-900 font-bold text-[12.5px]">
                    <Flame className="w-4 h-4 text-rose-600" />
                    <span>I'm sick and need someone to cover my shift!</span>
                  </div>
                  <p className="text-[11.5px] text-rose-800 leading-relaxed">
                    The assistant checked who submitted matching availability and can cover your shift:
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-3.5 border border-[#E1E5E9] shadow-xs space-y-3">
                  <div className="text-[12.5px] font-bold text-[#202A36]">
                    Potential available replacements:
                  </div>

                  {/* Candidate 1: Sharon */}
                  <div className="p-2.5 rounded-xl border border-[#BAE0FD] bg-[#FAFBFD] flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[#202A36] text-[12.5px]">Sharon Cohen</div>
                      <div className="text-[10.5px] text-[#77818D]">
                        Marked availability for evening shifts (submitted Wednesday and Thursday evenings)
                      </div>
                    </div>
                    <button
                      onClick={() => setSwapRequested(true)}
                      className="px-2.5 py-1 rounded-lg bg-[#2F95F8] text-white text-[11px] font-bold hover:bg-[#168FF5] transition-all cursor-pointer shadow-2xs"
                    >
                      {swapRequested ? 'Request sent! ✓' : 'Suggest a Swap'}
                    </button>
                  </div>

                  {/* Candidate 2: Tom */}
                  <div className="p-2.5 rounded-xl border border-[#E1E5E9] bg-white flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[#202A36] text-[12.5px]">Tom Reed</div>
                      <div className="text-[10.5px] text-[#77818D]">
                        Under the hours cap (25 of 28 hours)
                      </div>
                    </div>
                    <button
                      onClick={() => setSwapRequested(true)}
                      className="px-2.5 py-1 rounded-lg border border-[#BAE0FD] text-[#168FF5] hover:bg-[#2F95F8] hover:text-white text-[11px] font-bold transition-all cursor-pointer"
                    >
                      Contact Tom
                    </button>
                  </div>

                  <div className="pt-2 border-t border-[#E1E5E9] flex items-center justify-between">
                    <span className="text-[11px] text-[#77818D]">
                      Liron: "Call around and see who can cover"
                    </span>
                    <button
                      onClick={() => setSwapRequested(true)}
                      className="flex items-center gap-1 text-[11.5px] font-bold text-[#2F95F8] hover:underline cursor-pointer"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Call replacements</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Everyone (EVERYONE - RATINGS, REWARDS & CLOCK-IN) */}
            {activeTab === 'everyone' && (
              <div className="space-y-3 animate-in fade-in duration-200 text-right select-none" dir="rtl">
                <div className="flex items-center justify-between">
                  <h2 className="text-[18px] font-bold text-[#202A36]">
                    Café Team
                  </h2>
                  <span className="text-[11px] font-bold text-[#37B77D]">
                    6 active employees
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-[#E8F8F0] border border-[#BDEBD3] text-[11.5px] text-[#202A36] space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-[#37B77D]">
                    <Award className="w-4 h-4" />
                    <span>Monthly flexibility score & attendance rating:</span>
                  </div>
                  <p className="text-[#475569]">
                    Employees who clock in on time and stay flexible for the team earn breakfast-for-two vouchers and bonuses!
                  </p>
                </div>

                <div className="space-y-2">
                  {employees.map((emp) => (
                    <div
                      key={emp.id}
                      className="bg-white rounded-xl p-2.5 border border-[#E1E5E9] flex items-center justify-between shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-full text-white font-bold text-xs flex items-center justify-center shrink-0"
                          style={{ backgroundColor: emp.avatarBg || '#2F95F8' }}
                        >
                          {emp.initials}
                        </div>
                        <div>
                          <div className="text-[12.5px] font-bold text-[#202A36]">
                            {emp.name}
                          </div>
                          <div className="text-[10px] text-[#77818D]">
                            Attendance score: 98% ⭐
                          </div>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FAFBFD] border border-[#BAE0FD] text-[#168FF5]">
                        {emp.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: My Onboarding (ONBOARDING JOURNEY FOR NEW EMPLOYEE - NOA) */}
            {activeTab === 'onboarding' && (
              <div className="space-y-3 animate-in fade-in duration-200 text-right select-none pb-2" dir="rtl">
                {/* Header & Welcome Card */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white shadow-md space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-xl bg-blue-500/20 text-[#38BDF8] flex items-center justify-center font-bold text-sm border border-blue-400/30">
                        ☕
                      </span>
                      <div>
                        <h2 className="text-[16px] font-bold tracking-tight">
                          Welcome, Noa! 🎉
                        </h2>
                        <p className="text-[11px] text-slate-300">
                          Your onboarding journey at the coffee cart · Week 1
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Week 1 Trainee
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="pt-1 space-y-1">
                    <div className="flex items-center justify-between text-[10.5px] text-slate-300">
                      <span>Onboarding progress: 1 of 3 stages</span>
                      <span className="font-bold text-emerald-400">33%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-700/60 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full w-1/3 transition-all duration-500" />
                    </div>
                  </div>
                </div>

                {/* Mentor / Buddy Card */}
                <div className="p-3.5 rounded-2xl bg-white border border-[#BAE0FD] shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#168FF5] flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      Your Mentor
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#EAF5FF] text-[#168FF5]">
                      Mentor rating 4.9 ⭐
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-10 h-10 rounded-full text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs"
                      style={{ backgroundColor: buddy.avatarBg || '#2F95F8' }}
                    >
                      {buddy.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-bold text-[#1E293B]">
                        {buddy.name} (Senior Barista)
                      </div>
                      <div className="text-[11px] text-[#64748B]">
                        Will guide you closely through shifts, with patience and at your own pace
                      </div>
                    </div>
                  </div>

                  <div className="pt-1 flex items-center gap-2">
                    <button
                      onClick={() => onOpenMessageModal(buddy.name)}
                      className="flex-1 py-1.5 px-3 rounded-xl bg-[#00A3FF] hover:bg-[#0092E5] text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Message Yossi</span>
                    </button>
                    <button
                      onClick={() => onOpenMessageModal(buddy.name)}
                      className="py-1.5 px-3 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#334155] font-bold text-[11px] flex items-center justify-center gap-1 transition-all cursor-pointer"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>Call</span>
                    </button>
                  </div>
                </div>

                {/* Stepped Shifts Journey */}
                <div className="p-3.5 rounded-2xl bg-white border border-[#E1E5E9] shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold text-[#1E293B] flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#00A3FF]" />
                      Your shift plan for the first few weeks
                    </span>
                    {onOpenOnboardingPlanModal && (
                      <button
                        onClick={onOpenOnboardingPlanModal}
                        className="text-[10px] text-blue-600 hover:text-blue-800 font-bold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 cursor-pointer"
                        title="Edit onboarding tasks in the admin panel"
                      >
                        Edit tasks ✏️
                      </button>
                    )}
                  </div>

                  {/* Dynamic Steps Render */}
                  {onboardingPlan.steps.map((step) => {
                    const isStep1 = step.stepNumber === 1;
                    const isStep2 = step.stepNumber === 2;
                    const borderCls = isStep1
                      ? 'border-emerald-200 bg-emerald-50/50 text-emerald-950'
                      : isStep2
                      ? 'border-blue-200 bg-blue-50/40 text-blue-950'
                      : 'border-slate-200 bg-slate-50 text-slate-700';
                    const numBg = isStep1
                      ? 'bg-emerald-600 text-white'
                      : isStep2
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-400 text-white';

                    return (
                      <div key={step.stepNumber} className={`p-3 rounded-xl border ${borderCls} space-y-2`}>
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-[12px] font-bold flex items-center gap-1.5">
                              <span className={`w-5 h-5 rounded-full ${numBg} text-[10px] flex items-center justify-center font-bold`}>
                                {step.stepNumber}
                              </span>
                              <span>{step.title}</span>
                            </div>
                            <div className="text-[10.5px] opacity-80 mr-6">
                              {step.timingRecommendation}
                            </div>
                          </div>
                          {step.isOffPeakRequired && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                              Quiet · No pressure
                            </span>
                          )}
                        </div>

                        {step.tasks && step.tasks.length > 0 && (
                          <div className="mr-6 space-y-1.5 pt-1 text-[11px] text-slate-700">
                            <div className="font-bold text-slate-900 text-[11px]">
                              📋 What happens during this shift?
                            </div>
                            {step.tasks.map((taskStr, taskIdx) => (
                              <div key={taskIdx} className="flex items-center gap-1.5">
                                <Check className={`w-3.5 h-3.5 ${isStep1 ? 'text-emerald-600' : 'text-blue-600'} shrink-0`} />
                                <span>{taskStr}</span>
                              </div>
                            ))}
                            {step.restrictions && step.restrictions.length > 0 && (
                              <div className="text-[10px] text-slate-800 font-medium bg-white/80 p-1.5 rounded-lg border border-slate-200 space-y-0.5 mt-1">
                                {step.restrictions.map((rStr, rIdx) => (
                                  <div key={rIdx} className="flex items-center gap-1 text-amber-900">
                                    <span>🛡️</span>
                                    <em>{rStr}</em>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Read & Acknowledge Sign-off Checklist (Mark as read) */}
                <div className="p-3.5 rounded-2xl bg-white border border-[#E1E5E9] shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold text-[#1E293B] flex items-center gap-1.5">
                      <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                      Onboarding procedures acknowledgment (mark as read)
                    </span>
                    <span className="text-[10.5px] text-[#64748B]">Required before Shift 1</span>
                  </div>

                  <div className="space-y-2">
                    {onboardingPlan.acknowledgementItems.map((item) => {
                      const isChecked = !!checkedAckIds[item.id];
                      return (
                        <label
                          key={item.id}
                          onClick={() =>
                            setCheckedAckIds((prev) => ({
                              ...prev,
                              [item.id]: !prev[item.id],
                            }))
                          }
                          className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-start gap-2 cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            readOnly
                            className="mt-0.5 rounded text-blue-600 focus:ring-0 cursor-pointer"
                          />
                          <div className="text-[11px] text-slate-700">
                            <span className="font-bold text-slate-900">{item.text}</span>
                            {item.subtext && <div className="text-[10px] text-slate-500">{item.subtext}</div>}
                          </div>
                        </label>
                      );
                    })}
                  </div>

                  {/* Sign-off Action Button */}
                  <div className="pt-1">
                    {isSignedOff ? (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-center space-y-1">
                        <div className="text-[12px] font-bold flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Onboarding plan approved successfully! 🚀</span>
                        </div>
                        <p className="text-[10.5px] text-emerald-700">
                          Your manager and mentor Yossi have received digital confirmation. Good luck with your shift!
                        </p>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          const allChecked: Record<string, boolean> = {};
                          onboardingPlan.acknowledgementItems.forEach((i) => {
                            allChecked[i.id] = true;
                          });
                          setCheckedAckIds(allChecked);
                          setIsSignedOff(true);
                        }}
                        className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.98] text-white font-bold text-[12.5px] transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>Mark as read & approve the onboarding plan ✓</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Connecteam Bottom Navigation Bar (MATCHING USER SCREENSHOT EXACTLY + ONBOARDING TAB) */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t border-[#E1E5E9] px-1.5 flex items-center justify-around z-30 select-none" dir="rtl">
            {/* 1. My Schedule (My Calendar) */}
            <button
              id="mobile-nav-schedule"
              onClick={() => setActiveTab('schedule')}
              className={`flex flex-col items-center gap-0.5 transition-colors cursor-pointer ${
                activeTab === 'schedule' ? 'text-[#00A3FF]' : 'text-[#77818D] hover:text-[#202A36]'
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span className="text-[9.5px] font-bold">My Schedule</span>
            </button>

            {/* 2. Onboarding (Onboarding Journey - Dedicated for Noa) */}
            <button
              id="mobile-nav-onboarding"
              onClick={() => setActiveTab('onboarding')}
              className={`relative flex flex-col items-center gap-0.5 transition-colors cursor-pointer ${
                activeTab === 'onboarding' ? 'text-emerald-600 font-black' : 'text-[#77818D] hover:text-[#202A36]'
              }`}
            >
              <GraduationCap className="w-5 h-5" />
              <span className="text-[9.5px] font-bold">My Onboarding</span>
              {!isSignedOff && (
                <span className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              )}
            </button>

            {/* 3. My Availability (My Availability) */}
            <button
              id="mobile-nav-availability"
              onClick={() => setActiveTab('availability')}
              className={`flex flex-col items-center gap-0.5 transition-colors cursor-pointer ${
                activeTab === 'availability' ? 'text-[#00A3FF]' : 'text-[#77818D] hover:text-[#202A36]'
              }`}
            >
              <Clock className="w-5 h-5" />
              <span className="text-[9.5px] font-bold">My Availability</span>
            </button>

            {/* 4. Swaps (Shift Swaps) */}
            <button
              id="mobile-nav-swaps"
              onClick={() => setActiveTab('swaps')}
              className={`flex flex-col items-center gap-0.5 transition-colors cursor-pointer ${
                activeTab === 'swaps' ? 'text-[#00A3FF]' : 'text-[#77818D] hover:text-[#202A36]'
              }`}
            >
              <ArrowLeftRight className="w-5 h-5" />
              <span className="text-[9.5px] font-bold">Swaps</span>
            </button>

            {/* 5. Everyone (Everyone) */}
            <button
              id="mobile-nav-everyone"
              onClick={() => setActiveTab('everyone')}
              className={`flex flex-col items-center gap-0.5 transition-colors cursor-pointer ${
                activeTab === 'everyone' ? 'text-[#00A3FF]' : 'text-[#77818D] hover:text-[#202A36]'
              }`}
            >
              <Users className="w-5 h-5" />
              <span className="text-[9.5px] font-bold">Everyone</span>
            </button>
          </div>
        </div>

        {/* BOTTOM SHEET MODAL: AVAILABILITY SELECTION (Unavailable / Prefer not to / Time off / Open for scheduling) */}
        {activeMenuDay && (
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-50 flex flex-col justify-end animate-in fade-in duration-150"
            onClick={() => setActiveMenuDay(null)}
          >
            <div
              className="bg-white rounded-t-[32px] p-4 shadow-2xl border-t border-[#E1E5E9] space-y-2.5 animate-in slide-in-from-bottom-6 duration-200 text-right select-none max-h-[85%] overflow-y-auto"
              dir="rtl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[13.5px] font-bold text-[#202A36]">
                    Availability: {activeMenuDay.dayName} ({activeMenuDay.hebrewLabel})
                  </span>
                  {activeMenuDay.holidayTag && (
                    <span className="px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                      {activeMenuDay.holidayTag}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setActiveMenuDay(null)}
                  className="w-7 h-7 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] flex items-center justify-center text-[#77818D] hover:text-[#202A36] text-[12px] font-bold transition-all cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* 4 Status Tabs: Open for scheduling, Unavailable, Prefer not to, Time off */}
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                {/* 1. Open for scheduling */}
                <button
                  type="button"
                  onClick={() => {
                    setDraftRecord((prev) => ({
                      ...prev,
                      type: 'available',
                      hoursPreset: prev.hoursPreset || 'all_day',
                      startTime: prev.startTime || '08:00',
                      endTime: prev.endTime || '22:00',
                    }));
                  }}
                  className={`p-2.5 rounded-xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                    draftRecord.type === 'available'
                      ? 'bg-[#E8F8F0] border-[#37B77D] text-[#166534] shadow-xs font-bold ring-1 ring-[#37B77D]'
                      : 'bg-white hover:bg-[#F8FAFC] border-[#E1E5E9] text-[#202A36]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                        draftRecord.type === 'available'
                          ? 'bg-[#37B77D] text-white'
                          : 'bg-emerald-100 text-[#37B77D]'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-[12px] font-bold">Open for scheduling</div>
                      <div className="text-[9.5px] opacity-75">Default / edit hours</div>
                    </div>
                  </div>
                  {draftRecord.type === 'available' && (
                    <span className="text-emerald-700 font-bold text-xs">✓</span>
                  )}
                </button>

                {/* 2. Unavailable */}
                <button
                  type="button"
                  onClick={() => {
                    setDraftRecord((prev) => ({
                      ...prev,
                      type: 'unavailable',
                      startTime: prev.startTime || '09:00',
                      endTime: prev.endTime || '17:00',
                    }));
                  }}
                  className={`p-2.5 rounded-xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                    draftRecord.type === 'unavailable'
                      ? 'bg-[#FEE2E2] border-[#DC2626] text-[#DC2626] shadow-xs font-bold ring-1 ring-[#DC2626]'
                      : 'bg-white hover:bg-rose-50 border-[#E1E5E9] text-[#202A36]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                        draftRecord.type === 'unavailable'
                          ? 'bg-[#DC2626] text-white'
                          : 'bg-rose-100 text-[#DC2626]'
                      }`}
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-[12px] font-bold">Unavailable</div>
                      <div className="text-[9.5px] opacity-75">Blocks scheduling</div>
                    </div>
                  </div>
                  {draftRecord.type === 'unavailable' && (
                    <span className="text-rose-600 font-bold text-xs">✓</span>
                  )}
                </button>

                {/* 3. Prefer not to */}
                <button
                  type="button"
                  onClick={() => {
                    setDraftRecord((prev) => ({
                      ...prev,
                      type: 'prefer_not',
                    }));
                  }}
                  className={`p-2.5 rounded-xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                    draftRecord.type === 'prefer_not'
                      ? 'bg-[#FEF3C7] border-amber-400 text-amber-950 shadow-xs font-bold ring-1 ring-amber-400'
                      : 'bg-white hover:bg-amber-50 border-[#E1E5E9] text-[#202A36]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                        draftRecord.type === 'prefer_not'
                          ? 'bg-amber-500 text-white'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-[12px] font-bold">Prefer not to</div>
                      <div className="text-[9.5px] opacity-75">Soft preference</div>
                    </div>
                  </div>
                  {draftRecord.type === 'prefer_not' && (
                    <span className="text-amber-700 font-bold text-xs">✓</span>
                  )}
                </button>

                {/* 4. Time off */}
                <button
                  type="button"
                  onClick={() => {
                    setDraftRecord((prev) => ({
                      ...prev,
                      type: 'vacation',
                    }));
                  }}
                  className={`p-2.5 rounded-xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                    draftRecord.type === 'vacation'
                      ? 'bg-[#FAF5FF] border-[#A855F7] text-purple-950 shadow-xs font-bold ring-1 ring-[#A855F7]'
                      : 'bg-white hover:bg-purple-50 border-[#E1E5E9] text-[#202A36]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                        draftRecord.type === 'vacation'
                          ? 'bg-purple-600 text-white'
                          : 'bg-purple-100 text-purple-700'
                      }`}
                    >
                      <span className="text-xs">🌴</span>
                    </div>
                    <div>
                      <div className="text-[12px] font-bold">Time off</div>
                      <div className="text-[9.5px] opacity-75">Annual vacation day</div>
                    </div>
                  </div>
                  {draftRecord.type === 'vacation' && (
                    <span className="text-purple-700 font-bold text-xs">✓</span>
                  )}
                </button>
              </div>

              {/* Special Option: Holiday Eve - Bonus Voucher (if this is a holiday eve day) */}
              {activeMenuDay.isHolidayEve && (
                <button
                  type="button"
                  onClick={() => {
                    setDraftRecord({
                      type: 'available',
                      hoursPreset: 'all_day',
                      startTime: '08:00',
                      endTime: '14:00',
                      note: 'Flexible for the holiday eve in exchange for a voucher 🎁',
                    });
                  }}
                  className={`w-full p-2.5 rounded-xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                    draftRecord.type === 'available' && draftRecord.note?.includes('voucher')
                      ? 'bg-gradient-to-l from-[#FFF7ED] to-[#FEF3C7] border-amber-400 text-amber-950 shadow-xs font-bold ring-1 ring-amber-400'
                      : 'bg-white hover:bg-amber-50 border-[#E1E5E9] text-[#202A36]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0">
                      <Gift className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-[12px] font-bold text-amber-950">
                        Open for the holiday eve · Voucher eligible 🎁
                      </div>
                      <div className="text-[10px] text-amber-800">
                        Short shift (08:00–14:00) + breakfast voucher
                      </div>
                    </div>
                  </div>
                  {draftRecord.type === 'available' && draftRecord.note?.includes('voucher') && (
                    <span className="text-amber-700 font-bold text-xs">✓</span>
                  )}
                </button>
              )}

              {/* DEDICATED EDITING SECTION ACCORDING TO SELECTED STATUS */}
              {draftRecord.type === 'available' && (
                <div className="bg-[#F8FAFC] p-3 rounded-2xl border border-[#E2E8F0] space-y-2.5 text-right">
                  <div className="flex items-center justify-between">
                    <span className="text-[11.5px] font-bold text-[#1E293B] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#00A3FF]" />
                      Edit hours and shifts available for scheduling:
                    </span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                      Open for scheduling
                    </span>
                  </div>

                  {/* Preset quick buttons */}
                  <div className="grid grid-cols-4 gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        setDraftRecord((prev) => ({
                          ...prev,
                          hoursPreset: 'all_day',
                          startTime: '08:00',
                          endTime: '22:00',
                        }))
                      }
                      className={`py-1.5 px-1 rounded-xl text-[10.5px] font-bold border transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                        draftRecord.hoursPreset === 'all_day'
                          ? 'bg-[#00A3FF] text-white border-[#00A3FF] shadow-2xs'
                          : 'bg-white hover:bg-slate-100 text-[#475569] border-[#CBD5E1]'
                      }`}
                    >
                      <Sun className="w-3.5 h-3.5" />
                      <span>All day</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setDraftRecord((prev) => ({
                          ...prev,
                          hoursPreset: 'morning',
                          startTime: '08:00',
                          endTime: '16:00',
                        }))
                      }
                      className={`py-1.5 px-1 rounded-xl text-[10.5px] font-bold border transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                        draftRecord.hoursPreset === 'morning'
                          ? 'bg-[#00A3FF] text-white border-[#00A3FF] shadow-2xs'
                          : 'bg-white hover:bg-slate-100 text-[#475569] border-[#CBD5E1]'
                      }`}
                    >
                      <Sun className="w-3.5 h-3.5 text-amber-500" />
                      <span>Morning</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setDraftRecord((prev) => ({
                          ...prev,
                          hoursPreset: 'evening',
                          startTime: '16:00',
                          endTime: '23:00',
                        }))
                      }
                      className={`py-1.5 px-1 rounded-xl text-[10.5px] font-bold border transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                        draftRecord.hoursPreset === 'evening'
                          ? 'bg-[#00A3FF] text-white border-[#00A3FF] shadow-2xs'
                          : 'bg-white hover:bg-slate-100 text-[#475569] border-[#CBD5E1]'
                      }`}
                    >
                      <Moon className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Evening</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setDraftRecord((prev) => ({
                          ...prev,
                          hoursPreset: 'custom',
                        }))
                      }
                      className={`py-1.5 px-1 rounded-xl text-[10.5px] font-bold border transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                        draftRecord.hoursPreset === 'custom'
                          ? 'bg-[#00A3FF] text-white border-[#00A3FF] shadow-2xs'
                          : 'bg-white hover:bg-slate-100 text-[#475569] border-[#CBD5E1]'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5 text-[#64748B]" />
                      <span>Custom</span>
                    </button>
                  </div>

                  {/* Time Range Selectors */}
                  <div className="grid grid-cols-2 gap-2 pt-1 bg-white p-2 rounded-xl border border-[#E2E8F0]">
                    <div>
                      <label className="block text-[10px] font-semibold text-[#64748B] mb-1">
                        From:
                      </label>
                      <select
                        value={draftRecord.startTime || '08:00'}
                        onChange={(e) =>
                          setDraftRecord((prev) => ({
                            ...prev,
                            hoursPreset: 'custom',
                            startTime: e.target.value,
                          }))
                        }
                        className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-[11.5px] font-bold p-1.5 text-[#1E293B] focus:outline-none focus:border-[#00A3FF]"
                      >
                        <option value="06:00">06:00</option>
                        <option value="07:00">07:00</option>
                        <option value="08:00">08:00</option>
                        <option value="09:00">09:00</option>
                        <option value="10:00">10:00</option>
                        <option value="12:00">12:00</option>
                        <option value="14:00">14:00</option>
                        <option value="16:00">16:00</option>
                        <option value="18:00">18:00</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-[#64748B] mb-1">
                        To:
                      </label>
                      <select
                        value={draftRecord.endTime || '22:00'}
                        onChange={(e) =>
                          setDraftRecord((prev) => ({
                            ...prev,
                            hoursPreset: 'custom',
                            endTime: e.target.value,
                          }))
                        }
                        className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-[11.5px] font-bold p-1.5 text-[#1E293B] focus:outline-none focus:border-[#00A3FF]"
                      >
                        <option value="12:00">12:00</option>
                        <option value="14:00">14:00</option>
                        <option value="15:00">15:00</option>
                        <option value="16:00">16:00</option>
                        <option value="17:00">17:00</option>
                        <option value="18:00">18:00</option>
                        <option value="20:00">20:00</option>
                        <option value="22:00">22:00</option>
                        <option value="23:00">23:00</option>
                        <option value="23:30">23:30</option>
                      </select>
                    </div>
                  </div>

                  {/* Note / Preference Input */}
                  <div>
                    <label className="block text-[10px] font-semibold text-[#64748B] mb-1">
                      Note for the schedule / manager (optional):
                    </label>
                    <input
                      type="text"
                      value={draftRecord.note || ''}
                      onChange={(e) =>
                        setDraftRecord((prev) => ({ ...prev, note: e.target.value }))
                      }
                      placeholder="E.g.: Can come in early for training / prefers opening shifts..."
                      className="w-full bg-white border border-[#CBD5E1] rounded-xl px-2.5 py-1.5 text-[11.5px] text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#00A3FF]"
                    />
                  </div>
                </div>
              )}

              {draftRecord.type === 'unavailable' && (
                <div className="bg-[#FEF2F2] p-3 rounded-2xl border border-[#FECACA] space-y-2 text-right">
                  <div className="flex items-center justify-between">
                    <span className="text-[11.5px] font-bold text-rose-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      Set unavailability constraint:
                    </span>
                    <span className="text-[10px] text-rose-700 bg-rose-100 border border-rose-300 px-2 py-0.5 rounded-full font-semibold">
                      Blocks scheduling
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 bg-white p-2 rounded-xl border border-rose-200">
                    <div>
                      <label className="block text-[10px] font-semibold text-[#64748B] mb-1">
                        Unavailable from:
                      </label>
                      <input
                        type="time"
                        value={draftRecord.startTime || '09:00'}
                        onChange={(e) =>
                          setDraftRecord((prev) => ({ ...prev, startTime: e.target.value }))
                        }
                        className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-[11px] font-bold p-1 text-[#1E293B]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-[#64748B] mb-1">
                        To:
                      </label>
                      <input
                        type="time"
                        value={draftRecord.endTime || '17:00'}
                        onChange={(e) =>
                          setDraftRecord((prev) => ({ ...prev, endTime: e.target.value }))
                        }
                        className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-[11px] font-bold p-1 text-[#1E293B]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-[#64748B] mb-1">
                      Reason for the constraint (school / medical / personal):
                    </label>
                    <input
                      type="text"
                      value={draftRecord.note || ''}
                      onChange={(e) =>
                        setDraftRecord((prev) => ({ ...prev, note: e.target.value }))
                      }
                      placeholder="Brief explanation for the manager..."
                      className="w-full bg-white border border-rose-200 rounded-xl px-2.5 py-1.5 text-[11.5px] text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:border-rose-400"
                    />
                  </div>
                </div>
              )}

              {draftRecord.type === 'prefer_not' && (
                <div className="bg-[#FFFBEB] p-3 rounded-2xl border border-[#FDE68A] space-y-2 text-right">
                  <div className="text-[11.5px] font-bold text-amber-900">
                    Soft preference – the system will try not to schedule you this day
                  </div>
                  <div className="text-[10.5px] text-amber-800 leading-relaxed">
                    If there's a staffing shortage, your manager may reach out to check your flexibility.
                  </div>
                  <div>
                    <input
                      type="text"
                      value={draftRecord.note || ''}
                      onChange={(e) =>
                        setDraftRecord((prev) => ({ ...prev, note: e.target.value }))
                      }
                      placeholder="Note about this preference (optional)..."
                      className="w-full bg-white border border-amber-300 rounded-xl px-2.5 py-1.5 text-[11.5px] text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              )}

              {draftRecord.type === 'vacation' && (
                <div className="bg-[#FAF5FF] p-3 rounded-2xl border border-[#E9D5FF] space-y-2 text-right">
                  <div className="text-[11.5px] font-bold text-purple-900">
                    Official time-off request 🌴
                  </div>
                  <div className="text-[10.5px] text-purple-800 leading-relaxed">
                    This request will be recorded as a day off and synced against your vacation day balance.
                  </div>
                  <div>
                    <input
                      type="text"
                      value={draftRecord.note || ''}
                      onChange={(e) =>
                        setDraftRecord((prev) => ({ ...prev, note: e.target.value }))
                      }
                      placeholder="Notes about the time off..."
                      className="w-full bg-white border border-purple-300 rounded-xl px-2.5 py-1.5 text-[11.5px] text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>
              )}

              {/* ACTION BUTTONS (Save / Cancel) */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveDraftRecord}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#00A3FF] hover:bg-[#008CE0] active:scale-[0.98] text-white font-bold text-[12.5px] transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Availability</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMenuDay(null)}
                  className="py-2.5 px-3 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0] active:scale-[0.98] text-[#475569] font-bold text-[12px] transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
