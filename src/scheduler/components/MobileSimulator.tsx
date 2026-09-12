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
} from 'lucide-react';
import { Employee, OnboardingAssignmentOption } from '../types';

interface MobileSimulatorProps {
  isPublished: boolean;
  onboardingChoice: OnboardingAssignmentOption;
  employees: Employee[];
  onOpenMessageModal: () => void;
  customBuddyId?: string;
}

export const MobileSimulator: React.FC<MobileSimulatorProps> = ({
  isPublished,
  onboardingChoice,
  employees,
  onOpenMessageModal,
  customBuddyId,
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'schedule' | 'chat' | 'profile'>('home');
  const [showNotificationToast, setShowNotificationToast] = useState(false);
  const [checklist, setChecklist] = useState({
    safetyGuidelines: true,
    setupGuide: false,
    arriveEarly: false,
    meetCounter: false,
  });
  const [isShiftAcknowledged, setIsShiftAcknowledged] = useState(false);

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
      setActiveTab('home');
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
          shortDay: 'Sat, Sep 19',
          time: '09:00–13:00',
          location: 'Main Café',
          badge: 'Training Shift',
          badgeColor: '#F3A43B',
          isAlternative: true,
        }
      : {
          day: 'Sunday, Sep 13',
          shortDay: 'Sun, Sep 13',
          time: '10:00–14:00',
          location: 'Main Café',
          badge: 'Off-Peak Training Shift',
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
            </div>
          </div>

          {/* Interactive Slide-down Push Notification Toast */}
          {showNotificationToast && (
            <div
              id="mobile-push-notification-toast"
              onClick={() => {
                setActiveTab('home');
                setShowNotificationToast(false);
              }}
              className="absolute top-12 left-3 right-3 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-[#BAE0FD] z-50 cursor-pointer animate-in slide-in-from-top-4 duration-300"
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
            {/* TAB: HOME */}
            {activeTab === 'home' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* Greeting */}
                <div>
                  <h2 className="text-[22px] font-bold text-[#202A36] tracking-tight leading-tight">
                    Good morning, Noa 👋
                  </h2>
                  <p className="text-[12px] text-[#77818D] mt-0.5">
                    Barista Trainee · Week 1
                  </p>
                </div>

                {/* State A: PRE-PUBLICATION */}
                {!isPublished && (
                  <>
                    {/* Welcome Card */}
                    <div className="bg-white border border-[#E1E5E9] rounded-2xl p-4 shadow-xs space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#EAF5FF] text-[#2F95F8] flex items-center justify-center">
                          <Coffee className="w-4 h-4" />
                        </div>
                        <h3 className="text-[15px] font-semibold text-[#202A36]">
                          Welcome to Bean & Bloom
                        </h3>
                      </div>
                      <p className="text-[13px] text-[#77818D] leading-relaxed">
                        We’re preparing your first-week schedule. You’ll be notified when it’s ready.
                      </p>
                    </div>

                    {/* Onboarding Progress (2 of 3 steps) */}
                    <div className="bg-white border border-[#E1E5E9] rounded-2xl p-4 shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-bold uppercase tracking-wider text-[#202A36]">
                          Onboarding Progress
                        </span>
                        <span className="text-[12px] font-semibold text-[#2F95F8]">
                          2 of 3 steps complete
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-2 bg-[#F1F3F5] rounded-full overflow-hidden">
                        <div className="h-full bg-[#2F95F8] w-2/3 rounded-full" />
                      </div>

                      {/* Checklist items */}
                      <div className="space-y-2 pt-1">
                        <div className="flex items-center gap-2.5 text-[13px] text-[#202A36]">
                          <CheckCircle2 className="w-4 h-4 text-[#37B77D]" />
                          <span>Profile completed</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-[13px] text-[#202A36]">
                          <CheckCircle2 className="w-4 h-4 text-[#37B77D]" />
                          <span>Availability submitted</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-[13px] text-[#77818D]">
                          <div className="w-4 h-4 rounded-full border-2 border-dashed border-[#F3A43B] flex items-center justify-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#F3A43B]" />
                          </div>
                          <span>First shift pending manager publication</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* State B: PUBLISHED */}
                {isPublished && (
                  <>
                    {/* Onboarding Progress Banner */}
                    <div className="bg-white border border-[#E1E5E9] rounded-2xl p-3 shadow-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#E8F8F0] text-[#37B77D] flex items-center justify-center font-bold text-xs">
                          {isShiftAcknowledged ? '3/3' : '2/3'}
                        </div>
                        <div>
                          <div className="text-[12px] font-semibold text-[#202A36]">
                            Onboarding Status
                          </div>
                          <div className="text-[11px] text-[#77818D]">
                            {isShiftAcknowledged
                              ? '3 of 3 steps complete'
                              : '2 of 3 steps complete'}
                          </div>
                        </div>
                      </div>
                      {isShiftAcknowledged && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F8F0] text-[#37B77D] border border-[#BDEBD3]">
                          Ready for Shift
                        </span>
                      )}
                    </div>

                    {/* Prominent First Shift Card */}
                    <div
                      id="mobile-first-shift-card"
                      className="bg-white border-2 border-[#2F95F8]/40 rounded-2xl p-4 shadow-sm space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[11px] uppercase tracking-wider font-bold text-[#2F95F8]">
                            Upcoming Shift
                          </span>
                          <h3 className="text-[17px] font-bold text-[#202A36] mt-0.5">
                            Your first shift ☕
                          </h3>
                        </div>
                        <span
                          className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                          style={{
                            backgroundColor:
                              shiftInfo.badgeColor === '#37B77D' ? '#E8F8F0' : '#FFF7ED',
                            color: shiftInfo.badgeColor,
                          }}
                        >
                          {shiftInfo.badge}
                        </span>
                      </div>

                      {/* Time & Location details */}
                      <div className="bg-[#EAF5FF] rounded-xl p-3 space-y-2 border border-[#BAE0FD]/60">
                        <div className="flex items-center gap-2 text-[14px] font-semibold text-[#202A36]">
                          <Clock className="w-4 h-4 text-[#2F95F8]" />
                          <span>
                            {shiftInfo.day} · {shiftInfo.time}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[13px] text-[#77818D]">
                          <MapPin className="w-4 h-4 text-[#2F95F8]" />
                          <span>{shiftInfo.location} (Espresso Bar 1)</span>
                        </div>
                      </div>
                    </div>

                    {/* Onboarding Buddy Card */}
                    <div
                      id="mobile-onboarding-buddy-card"
                      className="bg-white border border-[#E1E5E9] rounded-2xl p-4 shadow-xs space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-bold uppercase tracking-wider text-[#77818D]">
                          Your onboarding buddy
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#EAF5FF] text-[#2F95F8]">
                          Assigned
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div
                          className="w-11 h-11 rounded-full text-white flex items-center justify-center font-bold text-sm shadow-xs"
                          style={{ backgroundColor: buddy.avatarBg || '#2F95F8' }}
                        >
                          {buddy.initials}
                        </div>
                        <div>
                          <div className="text-[14px] font-bold text-[#202A36]">
                            {buddy.name}
                          </div>
                          <div className="text-[12px] text-[#77818D]">
                            {buddy.role} · {buddy.mentorEligible ? 'Onboarding Mentor' : 'Senior Shift Lead'}
                          </div>
                        </div>
                      </div>

                      <p className="text-[12px] text-[#202A36] leading-relaxed bg-[#F6F7F8] p-2.5 rounded-xl border border-[#E1E5E9]">
                        {buddy.name.split(' ')[0]} will meet you at the beginning of your shift and guide you through the café setup.
                      </p>

                      <button
                        id="mobile-message-buddy-btn"
                        onClick={onOpenMessageModal}
                        className="w-full py-2 rounded-xl bg-[#EAF5FF] hover:bg-[#d9ecfd] text-[#2F95F8] font-semibold text-[13px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Message My Buddy</span>
                      </button>
                    </div>

                    {/* First-Shift Preparation Checklist */}
                    <div
                      id="mobile-checklist-card"
                      className="bg-white border border-[#E1E5E9] rounded-2xl p-4 shadow-xs space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-[14px] font-bold text-[#202A36]">
                          First-Shift Preparation
                        </h4>
                        <span className="text-[11px] text-[#77818D]">
                          {Object.values(checklist).filter(Boolean).length} of 4 checked
                        </span>
                      </div>

                      <div className="space-y-2">
                        <label
                          onClick={() => handleToggleChecklist('safetyGuidelines')}
                          className="flex items-center gap-2.5 text-[12px] text-[#202A36] cursor-pointer"
                        >
                          {checklist.safetyGuidelines ? (
                            <CheckCircle2 className="w-4 h-4 text-[#37B77D] shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-[#cbd5e1] shrink-0" />
                          )}
                          <span className={checklist.safetyGuidelines ? 'line-through text-[#77818D]' : ''}>
                            Read the safety guidelines
                          </span>
                        </label>

                        <label
                          onClick={() => handleToggleChecklist('setupGuide')}
                          className="flex items-center gap-2.5 text-[12px] text-[#202A36] cursor-pointer"
                        >
                          {checklist.setupGuide ? (
                            <CheckCircle2 className="w-4 h-4 text-[#37B77D] shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-[#cbd5e1] shrink-0" />
                          )}
                          <span className={checklist.setupGuide ? 'line-through text-[#77818D]' : ''}>
                            Review the Main Café setup guide
                          </span>
                        </label>

                        <label
                          onClick={() => handleToggleChecklist('arriveEarly')}
                          className="flex items-center gap-2.5 text-[12px] text-[#202A36] cursor-pointer"
                        >
                          {checklist.arriveEarly ? (
                            <CheckCircle2 className="w-4 h-4 text-[#37B77D] shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-[#cbd5e1] shrink-0" />
                          )}
                          <span className={checklist.arriveEarly ? 'line-through text-[#77818D]' : ''}>
                            Arrive 10 minutes early
                          </span>
                        </label>

                        <label
                          onClick={() => handleToggleChecklist('meetCounter')}
                          className="flex items-center gap-2.5 text-[12px] text-[#202A36] cursor-pointer"
                        >
                          {checklist.meetCounter ? (
                            <CheckCircle2 className="w-4 h-4 text-[#37B77D] shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-[#cbd5e1] shrink-0" />
                          )}
                          <span className={checklist.meetCounter ? 'line-through text-[#77818D]' : ''}>
                            Meet your buddy by the main counter
                          </span>
                        </label>
                      </div>

                      {/* Primary Button: I've Reviewed My Shift */}
                      {!isShiftAcknowledged ? (
                        <button
                          id="mobile-reviewed-shift-btn"
                          onClick={handleAcknowledgeShift}
                          className="w-full mt-2 py-2.5 rounded-xl bg-[#2F95F8] hover:bg-[#168FF5] text-white font-semibold text-[13px] shadow-sm transition-all"
                        >
                          I’ve Reviewed My Shift
                        </button>
                      ) : (
                        <div className="p-2.5 rounded-xl bg-[#E8F8F0] border border-[#BDEBD3] text-center space-y-1 animate-in zoom-in-95 duration-150">
                          <div className="flex items-center justify-center gap-1.5 text-[13px] font-bold text-[#37B77D]">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>You’re all set for your first shift.</span>
                          </div>
                          <p className="text-[11px] text-[#77818D]">
                            Onboarding progress: 3 of 3 steps complete.
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* TAB: SCHEDULE */}
            {activeTab === 'schedule' && (
              <div className="space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-[20px] font-bold text-[#202A36]">
                    My Schedule
                  </h2>
                  <span className="text-[11px] font-medium text-[#77818D]">
                    Sep 13–19, 2026
                  </span>
                </div>

                {!isPublished ? (
                  <div className="bg-white rounded-2xl p-6 text-center border border-[#E1E5E9] space-y-2">
                    <Calendar className="w-8 h-8 text-[#cbd5e1] mx-auto" />
                    <p className="text-[13px] font-semibold text-[#202A36]">
                      Schedule in Draft
                    </p>
                    <p className="text-[12px] text-[#77818D]">
                      Your manager is finalizing the team shifts. Check back soon!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* First Shift Card Highlighted */}
                    <div className="bg-white border-2 border-[#37B77D] rounded-2xl p-4 shadow-sm space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#37B77D] text-white">
                          First Training Shift
                        </span>
                        <span className="text-[11px] font-bold text-[#202A36]">
                          {shiftInfo.shortDay}
                        </span>
                      </div>

                      <div className="text-[15px] font-bold text-[#202A36]">
                        {shiftInfo.time}
                      </div>

                      <div className="flex items-center gap-1.5 text-[12px] text-[#77818D]">
                        <MapPin className="w-3.5 h-3.5 text-[#2F95F8]" />
                        <span>{shiftInfo.location}</span>
                      </div>

                      <div className="pt-2 border-t border-[#E1E5E9] flex items-center justify-between text-[12px]">
                        <span className="text-[#77818D]">Paired Mentor:</span>
                        <span className="font-semibold text-[#202A36]">
                          {buddy.name}
                        </span>
                      </div>
                    </div>

                    {/* Subsequent rest days */}
                    <div className="bg-white rounded-xl p-3 border border-[#E1E5E9] flex items-center justify-between text-[12px] text-[#77818D]">
                      <span>Mon, Sep 14</span>
                      <span>Off</span>
                    </div>
                    <div className="bg-white rounded-xl p-3 border border-[#E1E5E9] flex items-center justify-between text-[12px] text-[#77818D]">
                      <span>Tue, Sep 15</span>
                      <span>Off</span>
                    </div>
                    <div className="bg-white rounded-xl p-3 border border-[#E1E5E9] flex items-center justify-between text-[12px] text-[#77818D]">
                      <span>Wed, Sep 16</span>
                      <span>Off</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: CHAT */}
            {activeTab === 'chat' && (
              <div className="space-y-3 animate-in fade-in duration-200">
                <h2 className="text-[20px] font-bold text-[#202A36]">
                  Messages
                </h2>
                <div
                  onClick={onOpenMessageModal}
                  className="bg-white rounded-2xl p-3.5 border border-[#E1E5E9] flex items-center gap-3 cursor-pointer hover:border-[#BAE0FD] transition-all"
                >
                  <div
                    className="w-10 h-10 rounded-full text-white flex items-center justify-center font-bold text-xs shrink-0"
                    style={{ backgroundColor: buddy.avatarBg || '#2F95F8' }}
                  >
                    {buddy.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-semibold text-[#202A36] truncate">
                        {buddy.name}
                      </span>
                      <span className="text-[10px] text-[#77818D]">9:43 AM</span>
                    </div>
                    <p className="text-[11px] text-[#77818D] truncate">
                      {isPublished
                        ? "I'll meet you right by the main counter 10 min early..."
                        : 'Tap to open chat'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: PROFILE */}
            {activeTab === 'profile' && (
              <div className="space-y-3 animate-in fade-in duration-200">
                <h2 className="text-[20px] font-bold text-[#202A36]">
                  Profile
                </h2>
                <div className="bg-white rounded-2xl p-4 border border-[#E1E5E9] text-center space-y-2">
                  <div className="w-14 h-14 rounded-full bg-[#6879EA] text-white flex items-center justify-center font-bold text-lg mx-auto shadow-sm">
                    NS
                  </div>
                  <h3 className="text-[16px] font-bold text-[#202A36]">
                    Noa Shalev
                  </h3>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#37B77D] text-white">
                    NEW · WEEK 1
                  </span>
                  <div className="text-[12px] text-[#77818D] pt-2">
                    Junior Barista · Main Café
                  </div>
                </div>

                <div className="bg-white rounded-xl p-3 border border-[#E1E5E9] text-[12px] space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-[#77818D]">Weekly Max Hours:</span>
                    <span className="font-semibold text-[#202A36]">20 Hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#77818D]">Location:</span>
                    <span className="font-semibold text-[#202A36]">Main Café</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Connecteam Bottom Navigation Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t border-[#E1E5E9] px-4 flex items-center justify-around z-30">
            <button
              id="mobile-nav-home"
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center gap-0.5 transition-colors ${
                activeTab === 'home' ? 'text-[#2F95F8]' : 'text-[#77818D] hover:text-[#202A36]'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-[10px] font-semibold">Home</span>
            </button>

            <button
              id="mobile-nav-schedule"
              onClick={() => setActiveTab('schedule')}
              className={`flex flex-col items-center gap-0.5 transition-colors ${
                activeTab === 'schedule' ? 'text-[#2F95F8]' : 'text-[#77818D] hover:text-[#202A36]'
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span className="text-[10px] font-semibold">Schedule</span>
            </button>

            <button
              id="mobile-nav-chat"
              onClick={() => setActiveTab('chat')}
              className={`flex flex-col items-center gap-0.5 transition-colors ${
                activeTab === 'chat' ? 'text-[#2F95F8]' : 'text-[#77818D] hover:text-[#202A36]'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              <span className="text-[10px] font-semibold">Chat</span>
            </button>

            <button
              id="mobile-nav-profile"
              onClick={() => setActiveTab('profile')}
              className={`flex flex-col items-center gap-0.5 transition-colors ${
                activeTab === 'profile' ? 'text-[#2F95F8]' : 'text-[#77818D] hover:text-[#202A36]'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-[10px] font-semibold">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
