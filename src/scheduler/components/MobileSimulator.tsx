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
  onOpenMessageModal: () => void;
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
  { key: 'sun4', hebrewLabel: "4 א'", dayName: 'ראשון', holidayTag: 'ערב חג 🍯', isHolidayEve: true },
  { key: 'mon5', hebrewLabel: "5 ב'", dayName: 'שני', holidayTag: 'חג 🌿' },
  { key: 'tue6', hebrewLabel: "6 ג'", dayName: 'שלישי' },
  { key: 'wed7', hebrewLabel: "7 ד'", dayName: 'רביעי' },
  { key: 'thu8', hebrewLabel: "8 ה'", dayName: 'חמישי' },
  { key: 'fri9', hebrewLabel: "9 ו'", dayName: 'שישי' },
  { key: 'sat3', hebrewLabel: "3 ש'", dayName: 'שבת' },
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
  // Tabs: 'schedule' (היומן שלי), 'onboarding' (החפיפה שלי), 'everyone' (כולם), 'availability' (הזמינות שלי), 'swaps' (החלפות)
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
          shortDay: 'שבת, 19 ספטמבר',
          time: '09:00–13:00',
          location: 'Main Café',
          badge: 'Training Shift',
          badgeColor: '#F3A43B',
          isAlternative: true,
        }
      : {
          day: 'Sunday, Sep 13',
          shortDay: 'ראשון, 13 ספטמבר',
          time: '10:00–14:00',
          location: 'Main Café',
          badge: 'משמרת חפיפה (שעות שקטות)',
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
          note: 'גמיש/ה לערב חג תמורת שובר 🎁',
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
      return 'ערב חג (08:00 - 14:00)';
    }
    if (rec.hoursPreset === 'morning') {
      return `בוקר (${rec.startTime || '08:00'}-${rec.endTime || '16:00'})`;
    }
    if (rec.hoursPreset === 'evening') {
      return `ערב (${rec.startTime || '16:00'}-${rec.endTime || '23:00'})`;
    }
    if (rec.hoursPreset === 'custom') {
      return `${rec.startTime || '08:00'} - ${rec.endTime || '16:00'}`;
    }
    return 'כל היום';
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
        if (draftRecord.note?.includes('שובר')) {
          updateHolidayStatus('flexible_voucher');
        } else {
          updateHolidayStatus('open');
        }
      } else {
        updateHolidayStatus('constraint');
      }
    }

    setSavedNotification(`זמינות יום ${activeMenuDay.dayName} נשמרה בהצלחה!`);
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
              <span className="text-[11px] font-bold text-[#202A36]">נועה (שבוע 1)</span>
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
                  ? 'תוכנית חפיפה מאושרת ✓ המשך לצפייה במשימות'
                  : 'ברוכה הבאה נועה! לחצי לצפייה בתוכנית החפיפה ☕'}
              </span>
            </div>
            <span className="bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded-full text-[10px] shrink-0">
              {isSignedOff ? 'אושר ✓' : 'התחל חפיפה ←'}
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
            {/* TAB: הזמינות שלי (AVAILABILITY - MATCHING USER SCREENSHOT) */}
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

                {/* Week Day Strip (Matching screenshot: ש' 3 (blue), ו' 2, ה' 1, ד' 30, ג' 29, ב' 28, א' 27) */}
                <div className="flex items-center justify-between px-1 py-1 text-center font-bold">
                  {[
                    { key: 'sat3', day: "ש'", num: '3' },
                    { key: 'fri2', day: "ו'", num: '2' },
                    { key: 'thu1', day: "ה'", num: '1' },
                    { key: 'wed30', day: "ד'", num: '30' },
                    { key: 'tue29', day: "ג'", num: '29' },
                    { key: 'mon28', day: "ב'", num: '28' },
                    { key: 'sun27', day: "א'", num: '27' },
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
                    <span>שבוע ערב חג בפתח (4 א'): דרושה זמינות גבוהה!</span>
                  </div>
                  <p className="text-[11px] text-amber-900 leading-snug">
                    "שימו לב: <strong>יום ראשון (4 א') הינו ערב חג 🍯</strong> (מתכונת 08:00–14:00). אם תשאירו את היום פתוח לשיבוץ ללא אילוצים או תצהירו גמישות – <strong className="text-[#00A3FF]">תקבלו שובר מתנה (ארוחת בוקר זוגית)!</strong>" 🎁
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
                          <span>נרשמת כפתוח/ה לערב חג! מועמד/ת לשובר 🎁</span>
                        </>
                      ) : (
                        <>
                          <Award className="w-3.5 h-3.5" />
                          <span>אני מתגמש/ת לערב חג (תן בראש לשובר!) 🎁</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Weekly Summary Dropdown Strip (Matching screenshot: סיכום שבועי) */}
                <div className="flex items-center justify-between py-1.5 px-3 bg-white rounded-xl border border-[#E1E5E9] text-[12px] text-[#202A36] font-bold shadow-2xs">
                  <div className="flex flex-col items-start gap-0 text-[10px] text-[#77818D]">
                    <ChevronUp className="w-3 h-3 -mb-1" />
                    <ChevronDown className="w-3 h-3" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span>סיכום שבועי Sep 27 - Oct 03</span>
                    <span className="text-[#00A3FF]">
                      {
                        AVAILABILITY_DAYS.filter((d) => {
                          const st = getDayStatus(d.key);
                          return st === 'available' || st === 'prefer_not';
                        }).length
                      }{' '}
                      ימים פתוחים לשיבוץ
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
                              title="לחץ לעריכת זמינות לערב חג"
                            >
                              <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                              <span>פתוח לערב חג · שובר 🎁</span>
                              <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-amber-900 bg-white/80 px-1.5 py-0.5 rounded-md border border-amber-200 group-hover:bg-white transition-colors">
                                <Pencil className="w-2.5 h-2.5 text-amber-700" />
                                <span>ערוך</span>
                              </span>
                            </button>
                          ) : status === 'unavailable' ? (
                            <button
                              onClick={() => handleOpenEditDay(day)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#FEE2E2] hover:bg-[#FECACA] text-[#DC2626] font-bold text-[11px] border border-[#FECACA] cursor-pointer transition-all shadow-2xs text-right active:scale-[0.98] group"
                              title="לחץ לעריכת אילוץ אי-זמינות"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] shrink-0" />
                              <span>לא זמין.ה ({record.startTime && record.endTime ? `${record.startTime} - ${record.endTime}` : '09:00 - 17:00'})</span>
                              <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-rose-700 bg-white/80 px-1.5 py-0.5 rounded-md border border-rose-200 group-hover:bg-white transition-colors">
                                <Pencil className="w-2.5 h-2.5 text-rose-600" />
                                <span>ערוך</span>
                              </span>
                            </button>
                          ) : status === 'prefer_not' ? (
                            <button
                              onClick={() => handleOpenEditDay(day)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#FEF3C7] hover:bg-[#FDE68A] text-amber-900 font-bold text-[11px] border border-amber-300 cursor-pointer transition-all shadow-2xs text-right active:scale-[0.98] group"
                              title="לחץ לעריכת העדפה"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                              <span>מעדיף/ה שלא</span>
                              <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-amber-900 bg-white/80 px-1.5 py-0.5 rounded-md border border-amber-200 group-hover:bg-white transition-colors">
                                <Pencil className="w-2.5 h-2.5 text-amber-700" />
                                <span>ערוך</span>
                              </span>
                            </button>
                          ) : status === 'vacation' ? (
                            <button
                              onClick={() => handleOpenEditDay(day)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#FAF5FF] hover:bg-[#F3E8FF] text-purple-900 font-bold text-[11px] border border-[#E9D5FF] cursor-pointer transition-all shadow-2xs text-right active:scale-[0.98] group"
                              title="לחץ לעריכת חופשה"
                            >
                              <span className="text-xs">🌴</span>
                              <span>חופש (יום חופשה)</span>
                              <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-purple-900 bg-white/80 px-1.5 py-0.5 rounded-md border border-purple-200 group-hover:bg-white transition-colors">
                                <Pencil className="w-2.5 h-2.5 text-purple-700" />
                                <span>ערוך</span>
                              </span>
                            </button>
                          ) : (
                            /* Default: available - פתוח לשיבוץ (עריך!) */
                            <button
                              onClick={() => handleOpenEditDay(day)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#E8F8F0] hover:bg-[#D4F4E2] text-[#166534] font-bold text-[11px] border border-[#BDEBD3] hover:border-[#86EFAC] cursor-pointer transition-all shadow-2xs group text-right active:scale-[0.98]"
                              title="לחץ לעריכת שעות הזמינות והעדפות שיבוץ"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                              <span>פתוח לשיבוץ: {getAvailableLabel(record, day.isHolidayEve)}</span>
                              <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-[#15803D] bg-white/80 px-1.5 py-0.5 rounded-md border border-[#86EFAC]/60 group-hover:bg-white transition-colors">
                                <Pencil className="w-2.5 h-2.5 text-[#15803D]" />
                                <span>ערוך</span>
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
                    title="הוספת אילוץ או עריכת זמינות"
                  >
                    <Plus className="w-5 h-5 text-[#475569]" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB: היומן שלי (MY SCHEDULE) */}
            {activeTab === 'schedule' && (
              <div className="space-y-3 animate-in fade-in duration-200 text-right select-none" dir="rtl">
                <div className="flex items-center justify-between">
                  <h2 className="text-[18px] font-bold text-[#202A36]">
                    היומן שלי
                  </h2>
                  <span className="text-[11px] font-medium text-[#77818D]">
                    שבוע 13–19 בספטמבר
                  </span>
                </div>

                {!isPublished ? (
                  <div className="bg-white rounded-2xl p-6 text-center border border-[#E1E5E9] space-y-2">
                    <Calendar className="w-8 h-8 text-[#cbd5e1] mx-auto" />
                    <p className="text-[13px] font-semibold text-[#202A36]">
                      הסידור עדיין בטיוטה
                    </p>
                    <p className="text-[12px] text-[#77818D]">
                      מנהל המשמרת מרכיב את הסידור לפי הזמינות שלכם. תקבלו התראה עם הפרסום!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* First Shift Card Highlighted */}
                    <div className="bg-white border-2 border-[#37B77D] rounded-2xl p-4 shadow-sm space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#37B77D] text-white">
                          משמרת חפיפה ראשונה ☕
                        </span>
                        <span className="text-[11px] font-bold text-[#202A36]">
                          יום ראשון, 13 ספטמבר
                        </span>
                      </div>

                      <div className="text-[16px] font-bold text-[#202A36]">
                        {shiftInfo.time} (משמרת אמצע-סגירה בגינה)
                      </div>

                      <div className="flex items-center gap-1.5 text-[12px] text-[#77818D]">
                        <MapPin className="w-3.5 h-3.5 text-[#2F95F8]" />
                        <span>עגלת קפה בגינה (ליד מתחם האמהות)</span>
                      </div>

                      <div className="pt-2 border-t border-[#E1E5E9] flex items-center justify-between text-[12px]">
                        <span className="text-[#77818D]">חונך/ת מלווה:</span>
                        <span className="font-semibold text-[#202A36]">
                          {buddy.name}
                        </span>
                      </div>
                    </div>

                    {/* Rest of the week shifts */}
                    <div className="bg-white rounded-xl p-3 border border-[#E1E5E9] flex items-center justify-between text-[12px]">
                      <span className="font-bold text-[#202A36]">יום שני, 14 ספטמבר</span>
                      <span className="text-[#77818D]">חופש</span>
                    </div>
                    <div className="bg-white rounded-xl p-3 border border-[#E1E5E9] flex items-center justify-between text-[12px]">
                      <span className="font-bold text-[#202A36]">יום שלישי, 15 ספטמבר</span>
                      <span className="text-[#00A3FF] font-semibold">14:00 - 19:00 (משמרת ערב בגינה)</span>
                    </div>
                    <div className="bg-white rounded-xl p-3 border border-[#E1E5E9] flex items-center justify-between text-[12px]">
                      <span className="font-bold text-[#202A36]">יום רביעי, 16 ספטמבר</span>
                      <span className="text-[#77818D]">חופש</span>
                    </div>
                    <div className="bg-white rounded-xl p-3 border border-[#E1E5E9] flex items-center justify-between text-[12px]">
                      <span className="font-bold text-[#202A36]">יום שישי, 18 ספטמבר</span>
                      <span className="text-[#37B77D] font-semibold">08:00 - 15:00 (משמרת שישי סגירה לפני שבת)</span>
                    </div>
                    <div className="bg-white rounded-xl p-3 border border-[#E1E5E9] flex items-center justify-between text-[12px]">
                      <span className="font-bold text-[#202A36]">יום שבת, 19 ספטמבר</span>
                      <span className="text-[#37B77D] font-semibold">10:00 - 18:00 (משמרת שבת בגינה)</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: החלפות (SHIFT SWAPS / ILLNESS / COVERAGE - FROM LIRON'S CONVERSATION) */}
            {activeTab === 'swaps' && (
              <div className="space-y-3 animate-in fade-in duration-200 text-right select-none" dir="rtl">
                <div className="flex items-center justify-between">
                  <h2 className="text-[18px] font-bold text-[#202A36]">
                    החלפות ובלת"מים
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF5FF] text-[#168FF5]">
                    סיוע מיידי
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
                  <div className="flex items-center gap-2 text-rose-900 font-bold text-[12.5px]">
                    <Flame className="w-4 h-4 text-rose-600" />
                    <span>אני חולה וחייב/ת חילוף למשמרת!</span>
                  </div>
                  <p className="text-[11.5px] text-rose-800 leading-relaxed">
                    הסוכן בדק מי הגיש/ה זמינות תואמת ויכול/ה להחליף אותך במשמרת:
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-3.5 border border-[#E1E5E9] shadow-xs space-y-3">
                  <div className="text-[12.5px] font-bold text-[#202A36]">
                    מחליפים פוטנציאליים זמינים:
                  </div>

                  {/* Candidate 1: Sharon */}
                  <div className="p-2.5 rounded-xl border border-[#BAE0FD] bg-[#FAFBFD] flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[#202A36] text-[12.5px]">שרון כהן</div>
                      <div className="text-[10.5px] text-[#77818D]">
                        סימנה זמינות למשמרת ערב (הגישה רביעי וחמישי ערב)
                      </div>
                    </div>
                    <button
                      onClick={() => setSwapRequested(true)}
                      className="px-2.5 py-1 rounded-lg bg-[#2F95F8] text-white text-[11px] font-bold hover:bg-[#168FF5] transition-all cursor-pointer shadow-2xs"
                    >
                      {swapRequested ? 'בקשה נשלחה! ✓' : 'הצע החלפה'}
                    </button>
                  </div>

                  {/* Candidate 2: Tom */}
                  <div className="p-2.5 rounded-xl border border-[#E1E5E9] bg-white flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[#202A36] text-[12.5px]">תום ריד</div>
                      <div className="text-[10.5px] text-[#77818D]">
                        מתחת לתקרת השעות (25 שעות מתוך 28)
                      </div>
                    </div>
                    <button
                      onClick={() => setSwapRequested(true)}
                      className="px-2.5 py-1 rounded-lg border border-[#BAE0FD] text-[#168FF5] hover:bg-[#2F95F8] hover:text-white text-[11px] font-bold transition-all cursor-pointer"
                    >
                      פנה לתום
                    </button>
                  </div>

                  <div className="pt-2 border-t border-[#E1E5E9] flex items-center justify-between">
                    <span className="text-[11px] text-[#77818D]">
                      לירון: "תתקשרו ותראו מי יכול להחליף"
                    </span>
                    <button
                      onClick={() => setSwapRequested(true)}
                      className="flex items-center gap-1 text-[11.5px] font-bold text-[#2F95F8] hover:underline cursor-pointer"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>חייג למחליפים</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: כולם (EVERYONE - RATINGS, REWARDS & CLOCK-IN) */}
            {activeTab === 'everyone' && (
              <div className="space-y-3 animate-in fade-in duration-200 text-right select-none" dir="rtl">
                <div className="flex items-center justify-between">
                  <h2 className="text-[18px] font-bold text-[#202A36]">
                    צוות בית הקפה
                  </h2>
                  <span className="text-[11px] font-bold text-[#37B77D]">
                    6 עובדים פעילים
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-[#E8F8F0] border border-[#BDEBD3] text-[11.5px] text-[#202A36] space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-[#37B77D]">
                    <Award className="w-4 h-4" />
                    <span>מדד גמישות ודירוג נוכחות חודשי:</span>
                  </div>
                  <p className="text-[#475569]">
                    עובדים שמדייקים בשעון נוכחות ומתגמשים בשביל המקום זוכים בשוברי ארוחת בוקר זוגית ובונוסים!
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
                            דירוג שעון נוכחות: 98% ⭐
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

            {/* TAB: החפיפה שלי (ONBOARDING JOURNEY FOR NEW EMPLOYEE - NOA) */}
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
                          ברוכה הבאה נועה! 🎉
                        </h2>
                        <p className="text-[11px] text-slate-300">
                          מסלול החפיפה שלך בעגלת הקפה · שבוע 1
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      מתלמדת שבוע 1
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="pt-1 space-y-1">
                    <div className="flex items-center justify-between text-[10.5px] text-slate-300">
                      <span>התקדמות חפיפה: 1 מתוך 3 שלבים</span>
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
                      החונך המלווה שלך
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#EAF5FF] text-[#168FF5]">
                      ציון חניכה 4.9 ⭐
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
                        {buddy.name} (בריסטה בכיר)
                      </div>
                      <div className="text-[11px] text-[#64748B]">
                        ילווה אותך צמוד במשמרות, בסבלנות ובקצב מותאם
                      </div>
                    </div>
                  </div>

                  <div className="pt-1 flex items-center gap-2">
                    <button
                      onClick={() => onOpenMessageModal(buddy.name)}
                      className="flex-1 py-1.5 px-3 rounded-xl bg-[#00A3FF] hover:bg-[#0092E5] text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>שלחי הודעה ליוסי</span>
                    </button>
                    <button
                      onClick={() => onOpenMessageModal(buddy.name)}
                      className="py-1.5 px-3 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#334155] font-bold text-[11px] flex items-center justify-center gap-1 transition-all cursor-pointer"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>חיוג</span>
                    </button>
                  </div>
                </div>

                {/* Stepped Shifts Journey */}
                <div className="p-3.5 rounded-2xl bg-white border border-[#E1E5E9] shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold text-[#1E293B] flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#00A3FF]" />
                      מסלול המשמרות שלך לשבועות הראשונים
                    </span>
                    {onOpenOnboardingPlanModal && (
                      <button
                        onClick={onOpenOnboardingPlanModal}
                        className="text-[10px] text-blue-600 hover:text-blue-800 font-bold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 cursor-pointer"
                        title="עריכת משימות החפיפה בממשק הניהול"
                      >
                        ערוך משימות ✏️
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
                              שקט · ללא לחץ
                            </span>
                          )}
                        </div>

                        {step.tasks && step.tasks.length > 0 && (
                          <div className="mr-6 space-y-1.5 pt-1 text-[11px] text-slate-700">
                            <div className="font-bold text-slate-900 text-[11px]">
                              📋 מה עושים במשמרת זו?
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

                {/* Read & Acknowledge Sign-off Checklist (סמן שקראת) */}
                <div className="p-3.5 rounded-2xl bg-white border border-[#E1E5E9] shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold text-[#1E293B] flex items-center gap-1.5">
                      <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                      אישור נהלי חפיפה (סמני שקראת)
                    </span>
                    <span className="text-[10.5px] text-[#64748B]">חובה לפני משמרת 1</span>
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
                          <span>תוכנית החפיפה אושרה בהצלחה! 🚀</span>
                        </div>
                        <p className="text-[10.5px] text-emerald-700">
                          המנהל והחונך יוסי קיבלו אישור דיגיטלי. שיהיה המון בהצלחה במשמרת!
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
                        <span>סמן שקראת ואישרת את תוכנית החפיפה ✓</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Connecteam Bottom Navigation Bar (MATCHING USER SCREENSHOT EXACTLY + ONBOARDING TAB) */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t border-[#E1E5E9] px-1.5 flex items-center justify-around z-30 select-none" dir="rtl">
            {/* 1. היומן שלי (My Calendar) */}
            <button
              id="mobile-nav-schedule"
              onClick={() => setActiveTab('schedule')}
              className={`flex flex-col items-center gap-0.5 transition-colors cursor-pointer ${
                activeTab === 'schedule' ? 'text-[#00A3FF]' : 'text-[#77818D] hover:text-[#202A36]'
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span className="text-[9.5px] font-bold">היומן שלי</span>
            </button>

            {/* 2. חפיפה (Onboarding Journey - Dedicated for Noa) */}
            <button
              id="mobile-nav-onboarding"
              onClick={() => setActiveTab('onboarding')}
              className={`relative flex flex-col items-center gap-0.5 transition-colors cursor-pointer ${
                activeTab === 'onboarding' ? 'text-emerald-600 font-black' : 'text-[#77818D] hover:text-[#202A36]'
              }`}
            >
              <GraduationCap className="w-5 h-5" />
              <span className="text-[9.5px] font-bold">החפיפה שלי</span>
              {!isSignedOff && (
                <span className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              )}
            </button>

            {/* 3. הזמינות שלי (My Availability) */}
            <button
              id="mobile-nav-availability"
              onClick={() => setActiveTab('availability')}
              className={`flex flex-col items-center gap-0.5 transition-colors cursor-pointer ${
                activeTab === 'availability' ? 'text-[#00A3FF]' : 'text-[#77818D] hover:text-[#202A36]'
              }`}
            >
              <Clock className="w-5 h-5" />
              <span className="text-[9.5px] font-bold">הזמינות שלי</span>
            </button>

            {/* 4. החלפות (Shift Swaps) */}
            <button
              id="mobile-nav-swaps"
              onClick={() => setActiveTab('swaps')}
              className={`flex flex-col items-center gap-0.5 transition-colors cursor-pointer ${
                activeTab === 'swaps' ? 'text-[#00A3FF]' : 'text-[#77818D] hover:text-[#202A36]'
              }`}
            >
              <ArrowLeftRight className="w-5 h-5" />
              <span className="text-[9.5px] font-bold">החלפות</span>
            </button>

            {/* 5. כולם (Everyone) */}
            <button
              id="mobile-nav-everyone"
              onClick={() => setActiveTab('everyone')}
              className={`flex flex-col items-center gap-0.5 transition-colors cursor-pointer ${
                activeTab === 'everyone' ? 'text-[#00A3FF]' : 'text-[#77818D] hover:text-[#202A36]'
              }`}
            >
              <Users className="w-5 h-5" />
              <span className="text-[9.5px] font-bold">כולם</span>
            </button>
          </div>
        </div>

        {/* BOTTOM SHEET MODAL: AVAILABILITY SELECTION (לא זמין.ה / מעדיף שלא / חופש / פתוח לשיבוץ) */}
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
                    זמינות: יום {activeMenuDay.dayName} ({activeMenuDay.hebrewLabel})
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

              {/* 4 Status Tabs: פתוח לשיבוץ, לא זמין.ה, מעדיף שלא, חופש */}
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                {/* 1. פתוח לשיבוץ */}
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
                      <div className="text-[12px] font-bold">פתוח לשיבוץ</div>
                      <div className="text-[9.5px] opacity-75">ברירת מחדל / עריכת שעות</div>
                    </div>
                  </div>
                  {draftRecord.type === 'available' && (
                    <span className="text-emerald-700 font-bold text-xs">✓</span>
                  )}
                </button>

                {/* 2. לא זמין.ה */}
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
                      <div className="text-[12px] font-bold">לא זמין.ה</div>
                      <div className="text-[9.5px] opacity-75">חסימת שיבוץ</div>
                    </div>
                  </div>
                  {draftRecord.type === 'unavailable' && (
                    <span className="text-rose-600 font-bold text-xs">✓</span>
                  )}
                </button>

                {/* 3. מעדיף שלא */}
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
                      <div className="text-[12px] font-bold">מעדיף שלא</div>
                      <div className="text-[9.5px] opacity-75">העדפה רכה</div>
                    </div>
                  </div>
                  {draftRecord.type === 'prefer_not' && (
                    <span className="text-amber-700 font-bold text-xs">✓</span>
                  )}
                </button>

                {/* 4. חופש */}
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
                      <div className="text-[12px] font-bold">חופש</div>
                      <div className="text-[9.5px] opacity-75">יום חופשה שנתי</div>
                    </div>
                  </div>
                  {draftRecord.type === 'vacation' && (
                    <span className="text-purple-700 font-bold text-xs">✓</span>
                  )}
                </button>
              </div>

              {/* Special Option: ערב חג - שובר בונוס (אם זה יום ערב חג) */}
              {activeMenuDay.isHolidayEve && (
                <button
                  type="button"
                  onClick={() => {
                    setDraftRecord({
                      type: 'available',
                      hoursPreset: 'all_day',
                      startTime: '08:00',
                      endTime: '14:00',
                      note: 'גמיש/ה לערב חג תמורת שובר 🎁',
                    });
                  }}
                  className={`w-full p-2.5 rounded-xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                    draftRecord.type === 'available' && draftRecord.note?.includes('שובר')
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
                        פתוח/ה לערב חג · זכאות לשובר 🎁
                      </div>
                      <div className="text-[10px] text-amber-800">
                        משמרת קצרה (08:00–14:00) + שובר ארוחת בוקר
                      </div>
                    </div>
                  </div>
                  {draftRecord.type === 'available' && draftRecord.note?.includes('שובר') && (
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
                      עריכת שעות ומשמרות זמינות לשיבוץ:
                    </span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                      פתוח לשיבוץ
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
                      <span>כל היום</span>
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
                      <span>בוקר</span>
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
                      <span>ערב</span>
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
                      <span>מותאם</span>
                    </button>
                  </div>

                  {/* Time Range Selectors */}
                  <div className="grid grid-cols-2 gap-2 pt-1 bg-white p-2 rounded-xl border border-[#E2E8F0]">
                    <div>
                      <label className="block text-[10px] font-semibold text-[#64748B] mb-1">
                        משעה:
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
                        עד שעה:
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
                      הערה לסידור / למנהל (אופציונלי):
                    </label>
                    <input
                      type="text"
                      value={draftRecord.note || ''}
                      onChange={(e) =>
                        setDraftRecord((prev) => ({ ...prev, note: e.target.value }))
                      }
                      placeholder="למשל: יכול/ה להקדים לחפיפה / מעדיף/ה פתיחה..."
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
                      הגדרת אילוץ אי-זמינות:
                    </span>
                    <span className="text-[10px] text-rose-700 bg-rose-100 border border-rose-300 px-2 py-0.5 rounded-full font-semibold">
                      חסימת שיבוץ
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 bg-white p-2 rounded-xl border border-rose-200">
                    <div>
                      <label className="block text-[10px] font-semibold text-[#64748B] mb-1">
                        אי-זמינות משעה:
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
                        עד שעה:
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
                      סיבת האילוץ (לימודים / רפואי / אישי):
                    </label>
                    <input
                      type="text"
                      value={draftRecord.note || ''}
                      onChange={(e) =>
                        setDraftRecord((prev) => ({ ...prev, note: e.target.value }))
                      }
                      placeholder="הסבר קצר למנהל..."
                      className="w-full bg-white border border-rose-200 rounded-xl px-2.5 py-1.5 text-[11.5px] text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:border-rose-400"
                    />
                  </div>
                </div>
              )}

              {draftRecord.type === 'prefer_not' && (
                <div className="bg-[#FFFBEB] p-3 rounded-2xl border border-[#FDE68A] space-y-2 text-right">
                  <div className="text-[11.5px] font-bold text-amber-900">
                    העדפה רכה – המערכת תשתדל לא לשבץ ביום זה
                  </div>
                  <div className="text-[10.5px] text-amber-800 leading-relaxed">
                    במידה וקיים מחסור בכוח אדם, המנהל יוכל לפנות אליך לבדיקת התגמשות.
                  </div>
                  <div>
                    <input
                      type="text"
                      value={draftRecord.note || ''}
                      onChange={(e) =>
                        setDraftRecord((prev) => ({ ...prev, note: e.target.value }))
                      }
                      placeholder="הערה לגבי ההעדפה (אופציונלי)..."
                      className="w-full bg-white border border-amber-300 rounded-xl px-2.5 py-1.5 text-[11.5px] text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              )}

              {draftRecord.type === 'vacation' && (
                <div className="bg-[#FAF5FF] p-3 rounded-2xl border border-[#E9D5FF] space-y-2 text-right">
                  <div className="text-[11.5px] font-bold text-purple-900">
                    בקשת יום חופשה רשמי 🌴
                  </div>
                  <div className="text-[10.5px] text-purple-800 leading-relaxed">
                    בקשה זו תירשם כיום חופש ותועבר לסנכרון מול מכסת ימי החופשה.
                  </div>
                  <div>
                    <input
                      type="text"
                      value={draftRecord.note || ''}
                      onChange={(e) =>
                        setDraftRecord((prev) => ({ ...prev, note: e.target.value }))
                      }
                      placeholder="הערות לחופשה..."
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
                  <span>שמור זמינות</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMenuDay(null)}
                  className="py-2.5 px-3 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0] active:scale-[0.98] text-[#475569] font-bold text-[12px] transition-all cursor-pointer"
                >
                  ביטול
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
