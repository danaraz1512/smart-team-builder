/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  SchedulerState,
  OnboardingAssignmentOption,
  Employee,
  Shift,
  ViewMode,
  OnboardingPlanConfig,
} from './types';
import {
  INITIAL_EMPLOYEES,
  INITIAL_SHIFTS,
  getGeneratedAssignments,
  DEFAULT_ONBOARDING_PLAN,
} from './data/mockData';
import { WebSchedulerHeader } from './components/WebSchedulerHeader';
import { ConsolidatedSmartBanner } from './components/ConsolidatedSmartBanner';
import { SchedulingOverviewBanner } from './components/SchedulingOverviewBanner';
import { AnalysisProgress } from './components/AnalysisProgress';
import { GeneratedDraftSummaryBanner } from './components/GeneratedDraftSummaryBanner';
import { DecisionsDrawer } from './components/DecisionsDrawer';
import { EmployeeRosterBar } from './components/EmployeeRosterBar';
import { WeeklyScheduleGrid } from './components/WeeklyScheduleGrid';
import { MobileSimulator } from './components/MobileSimulator';
import { RulesModal } from './components/RulesModal';
import { ManualEditModal } from './components/ManualEditModal';
import { MessageBuddyModal } from './components/MessageBuddyModal';
import { OnboardingPlanModal } from './components/OnboardingPlanModal';
import { JobsModal } from './components/JobsModal';
import { INITIAL_JOBS } from './data/jobsData';
import { CheckCircle2, X } from 'lucide-react';
import { JobRecord } from './types';

export default function App() {
  // Primary workflow state
  const [schedulerState, setSchedulerState] = useState<SchedulerState>('initial');
  const [viewMode, setViewMode] = useState<ViewMode>('focus'); // 'focus' for reduced cognitive load, 'detailed' for full metrics
  const [onboardingChoice, setOnboardingChoice] =
    useState<OnboardingAssignmentOption>('recommended');
  const [isDecisionsDrawerOpen, setIsDecisionsDrawerOpen] = useState(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [isManualEditModalOpen, setIsManualEditModalOpen] = useState(false);
  const [isMessageBuddyModalOpen, setIsMessageBuddyModalOpen] = useState(false);
  const [isOnboardingPlanModalOpen, setIsOnboardingPlanModalOpen] = useState(false);
  const [onboardingPlan, setOnboardingPlan] = useState<OnboardingPlanConfig>(DEFAULT_ONBOARDING_PLAN);
  const [isAssignmentApproved, setIsAssignmentApproved] = useState(false);
  const [highlightThursdayShift, setHighlightThursdayShift] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string>('All Locations');
  const [managerToast, setManagerToast] = useState<string | null>(null);

  // Job records: recurring shift roles & recurring tasks
  const [isJobsModalOpen, setIsJobsModalOpen] = useState(false);
  const [jobs, setJobs] = useState<JobRecord[]>(INITIAL_JOBS);

  // Custom manual edit config if manager manually edits
  const [customConfig, setCustomConfig] = useState<{
    shiftId: string;
    buddyId: string;
  } | null>(null);

  // Compute shifts with assignments dynamically based on state & choices
  const shifts: Shift[] = useMemo(() => {
    if (schedulerState === 'initial' || schedulerState === 'analyzing') {
      return INITIAL_SHIFTS.map((s) => ({ ...s, assignedEmployeeIds: [] }));
    }

    const assignments = getGeneratedAssignments(
      onboardingChoice,
      customConfig || undefined
    );

    return INITIAL_SHIFTS.map((shift) => ({
      ...shift,
      assignedEmployeeIds: assignments[shift.id] || [],
    }));
  }, [schedulerState, onboardingChoice, customConfig]);

  // Show a manager toast notification
  const triggerToast = (msg: string) => {
    setManagerToast(msg);
    setTimeout(() => {
      setManagerToast(null);
    }, 4000);
  };

  // Toggle view mode
  const handleToggleViewMode = (mode: ViewMode) => {
    setViewMode(mode);
    triggerToast(
      mode === 'focus'
        ? 'Switched to Focus View — reduced cognitive load'
        : 'Switched to Detailed View — all metrics and badges shown'
    );
  };

  // State Transition 1 -> 2: Start AI analysis
  const handleGenerateSmartSchedule = () => {
    if (schedulerState === 'analyzing') return;
    setSchedulerState('analyzing');
    setIsDecisionsDrawerOpen(false);
    // analytics hook (Phase 2): track_scheduling_entry_point('smart_agent')
  };

  // Manual entry points that exist on the platform today, kept alongside the
  // agent so we can compare engagement between the two paths (Phase 2: wire
  // real analytics events here instead of a toast).
  const handleSelectTemplate = () => {
    // analytics hook (Phase 2): track_scheduling_entry_point('load_template')
    triggerToast('Loaded a fixed weekly template — note: this does not check real availability and will not update automatically.');
  };

  const handleSelectCopyPrevious = () => {
    // analytics hook (Phase 2): track_scheduling_entry_point('copy_previous_week')
    triggerToast('Copied last week\'s schedule — it may not reflect recent availability changes.');
  };

  // State Transition 2 -> 3: Finish AI analysis, populate draft
  const handleAnalysisComplete = () => {
    setSchedulerState('draft_generated');
    // In detailed mode, open drawer; in focus mode, leave schedule open and clear
    if (viewMode === 'detailed') {
      setIsDecisionsDrawerOpen(true);
    } else {
      setIsDecisionsDrawerOpen(false);
    }
  };

  // State Transition 3 -> 4: Review key decisions drawer toggle
  const handleToggleDecisions = () => {
    setIsDecisionsDrawerOpen((prev) => !prev);
  };

  // Highlight Thursday team from Decision 1
  const handleViewThursdayTeam = () => {
    setHighlightThursdayShift(true);
    setTimeout(() => {
      setHighlightThursdayShift(false);
    }, 5000);
  };

  // Approve onboarding assignment
  const handleApproveAssignment = () => {
    setIsAssignmentApproved(true);
    triggerToast('Onboarding pairing approved: Sunday 10:00–14:00 with Yossi Cohen.');
  };

  // State Transition 4/3 -> 5: Publish Schedule
  const handlePublishSchedule = () => {
    setSchedulerState('published');
    setIsDecisionsDrawerOpen(false);
    triggerToast('Schedule published. Employees have been notified.');
  };

  // Reset Demo to State 1
  const handleResetDemo = () => {
    setSchedulerState('initial');
    setOnboardingChoice('recommended');
    setIsDecisionsDrawerOpen(false);
    setIsRulesModalOpen(false);
    setIsJobsModalOpen(false);
    setJobs(INITIAL_JOBS);
    setIsManualEditModalOpen(false);
    setIsMessageBuddyModalOpen(false);
    setIsAssignmentApproved(false);
    setHighlightThursdayShift(false);
    setCustomConfig(null);
    setSelectedLocation('All Locations');
    triggerToast('Prototype reset to initial state.');
  };

  // Handle manual edit save
  const handleSaveManualEdit = (shiftId: string, buddyId: string) => {
    setCustomConfig({ shiftId, buddyId });
    setOnboardingChoice('custom');
    setIsAssignmentApproved(true);
    triggerToast('Manual schedule adjustment saved successfully.');
  };

  // Handle onboarding plan save
  const handleSaveOnboardingPlan = (updatedPlan: OnboardingPlanConfig) => {
    setOnboardingPlan(updatedPlan);
    triggerToast('Onboarding plan, tasks, and checklist saved successfully and updated in the employee app!');
  };

  // Update a job record (recurring shift role / recurring task)
  const handleUpdateJob = (updated: JobRecord) => {
    setJobs((prev) => prev.map((j) => (j.id === updated.id ? updated : j)));
  };

  // Create a blank job record and return its id so the modal can select it
  const handleCreateJob = () => {
    const id = `job-custom-${Date.now()}`;
    const newJob: JobRecord = {
      id,
      name: 'New Job Record',
      nameEn: 'New Job Record',
      kind: 'recurring_task',
      color: '#0EA5A5',
      location: 'Main Café',
      recurrence: {
        days: ['Monday'],
        timeRange: '09:00–13:00',
        frequencyLabel: 'Every week',
      },
      requiredHeadcount: 1,
      tasks: [],
      requiredSkills: [],
      requiresMentorOnShift: false,
      suitableForOnboarding: false,
      qualifications: INITIAL_EMPLOYEES.map((e) => ({
        employeeId: e.id,
        level: 'not_qualified' as const,
        canMentor: false,
      })),
    };
    setJobs((prev) => [...prev, newJob]);
    triggerToast('New job record created. Set the days, tasks, and qualification levels.');
    return id;
  };

  // Current buddy for modals
  const activeBuddy = useMemo(() => {
    if (onboardingChoice === 'alternative') {
      return (
        INITIAL_EMPLOYEES.find((e) => e.id === 'emp-dana') || INITIAL_EMPLOYEES[0]
      );
    }
    if (customConfig) {
      return (
        INITIAL_EMPLOYEES.find((e) => e.id === customConfig.buddyId) ||
        INITIAL_EMPLOYEES[1]
      );
    }
    return (
      INITIAL_EMPLOYEES.find((e) => e.id === 'emp-yossi') || INITIAL_EMPLOYEES[1]
    );
  }, [onboardingChoice, customConfig]);

  const activeShiftInfo = useMemo(() => {
    if (onboardingChoice === 'alternative') {
      return {
        day: 'Saturday',
        date: 'Sep 19',
        time: '09:00–13:00',
        location: 'Main Café',
      };
    }
    return {
      day: 'Sunday',
      date: 'Sep 13',
      time: '10:00–14:00',
      location: 'Main Café',
    };
  }, [onboardingChoice]);

  return (
    <div className="w-screen h-screen flex flex-col bg-[#F6F7F8] overflow-hidden">
      {/* Toast Notification */}
      {managerToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#202A36] text-white px-4 py-2.5 rounded-xl shadow-xl border border-[#334155] flex items-center gap-2.5 text-[13px] font-medium animate-in fade-in slide-in-from-top-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#37B77D]" />
          <span>{managerToast}</span>
          <button
            onClick={() => setManagerToast(null)}
            className="p-1 hover:text-[#94a3b8] cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Split-Screen Workspace */}
      <div className="flex-1 flex flex-row overflow-hidden">
        {/* LEFT SIDE: WEB ADMIN SCHEDULER (68% width) */}
        <div
          id="web-admin-scheduler"
          className="w-[68%] h-full flex flex-col bg-white border-r border-[#E1E5E9] relative overflow-hidden"
        >
          {/* Top Navigation & Header */}
          <WebSchedulerHeader
            schedulerState={schedulerState}
            onResetDemo={handleResetDemo}
            selectedLocation={selectedLocation}
            onSelectLocation={setSelectedLocation}
            viewMode={viewMode}
            onToggleViewMode={handleToggleViewMode}
            onOpenRules={() => setIsRulesModalOpen(true)}
            onOpenManualEdit={() => setIsManualEditModalOpen(true)}
            onOpenJobs={() => setIsJobsModalOpen(true)}
            jobsCount={jobs.length}
          />

          {/* Body Area: Content + Inside Right-Side Drawer */}
          <div className="flex-1 flex relative overflow-hidden">
            {/* Scrollable Center Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-[#F6F7F8]">
              {/* STATE 2: AI Analysis (shown when analyzing) */}
              {schedulerState === 'analyzing' && (
                <AnalysisProgress onComplete={handleAnalysisComplete} />
              )}

              {/* CONSOLIDATED SMART BANNER (Reduces Cognitive Load) */}
              {schedulerState !== 'analyzing' && (
                <ConsolidatedSmartBanner
                  schedulerState={schedulerState}
                  viewMode={viewMode}
                  isApproved={isAssignmentApproved}
                  isDecisionsOpen={isDecisionsDrawerOpen}
                  onReviewDecisions={handleToggleDecisions}
                  onPublishSchedule={handlePublishSchedule}
                  onOpenManualEdit={() => setIsManualEditModalOpen(true)}
                  onOpenRules={() => setIsRulesModalOpen(true)}
                  onGenerateSchedule={handleGenerateSmartSchedule}
                  onOpenOnboardingPlan={() => setIsOnboardingPlanModalOpen(true)}
                  onSelectTemplate={handleSelectTemplate}
                  onSelectCopyPrevious={handleSelectCopyPrevious}
                />
              )}

              {/* Detailed metrics banner shown only in detailed mode if manager explicitly requested */}
              {viewMode === 'detailed' && schedulerState === 'initial' && (
                <SchedulingOverviewBanner
                  onOpenRules={() => setIsRulesModalOpen(true)}
                  viewMode={viewMode}
                />
              )}
              {viewMode === 'detailed' &&
                (schedulerState === 'draft_generated' ||
                  schedulerState === 'reviewing_decisions') && (
                  <GeneratedDraftSummaryBanner
                    onReviewDecisions={handleToggleDecisions}
                    onPublishSchedule={handlePublishSchedule}
                    onOpenManualEdit={() => setIsManualEditModalOpen(true)}
                    isDecisionsOpen={isDecisionsDrawerOpen}
                    isApproved={isAssignmentApproved}
                    viewMode={viewMode}
                  />
                )}

              {/* Roster Strip */}
              <EmployeeRosterBar
                employees={INITIAL_EMPLOYEES}
                viewMode={viewMode}
                onOpenOnboardingPlan={() => setIsOnboardingPlanModalOpen(true)}
              />

              {/* Weekly Schedule Grid */}
              <WeeklyScheduleGrid
                shifts={shifts}
                employees={INITIAL_EMPLOYEES}
                schedulerState={schedulerState}
                selectedLocation={selectedLocation}
                highlightThursdayShift={highlightThursdayShift}
                onboardingChoice={onboardingChoice}
                viewMode={viewMode}
                onOpenManualEdit={() => setIsManualEditModalOpen(true)}
              />
            </div>

            {/* STATE 4: Key Decisions Right-side Drawer (Inside Web Area, never covers mobile!) */}
            <DecisionsDrawer
              isOpen={isDecisionsDrawerOpen && schedulerState !== 'initial'}
              onClose={() => setIsDecisionsDrawerOpen(false)}
              onViewThursdayTeam={handleViewThursdayTeam}
              onboardingChoice={onboardingChoice}
              onSelectOnboardingChoice={(choice) => {
                setOnboardingChoice(choice);
                triggerToast(
                  choice === 'alternative'
                    ? 'Shift switched to Saturday 09:00–13:00 with Dana Levi.'
                    : 'Shift restored to Sunday 10:00–14:00 with Yossi Cohen.'
                );
              }}
              onOpenManualEdit={() => setIsManualEditModalOpen(true)}
              isApproved={isAssignmentApproved}
              onApproveAssignment={handleApproveAssignment}
              onOpenOnboardingPlan={() => setIsOnboardingPlanModalOpen(true)}
            />
          </div>
        </div>

        {/* RIGHT SIDE: EMPLOYEE MOBILE SIMULATOR (32% width) */}
        <div
          id="employee-mobile-simulator"
          className="w-[32%] h-full bg-[#EBF0F5] border-l border-[#E1E5E9] flex flex-col items-center justify-center p-3 relative overflow-hidden"
        >
          {/* Subtle Mobile Simulator Header Label */}
          <div className="absolute top-2.5 left-4 right-4 flex items-center justify-between text-[11px] text-[#77818D] uppercase tracking-wider font-semibold pointer-events-none">
            <span>Employee View · Noa Shalev</span>
            <span>Live Mobile Simulator</span>
          </div>

          <MobileSimulator
            isPublished={schedulerState === 'published'}
            onboardingChoice={onboardingChoice}
            employees={INITIAL_EMPLOYEES}
            onOpenMessageModal={() => setIsMessageBuddyModalOpen(true)}
            customBuddyId={customConfig?.buddyId}
            onboardingPlan={onboardingPlan}
            onOpenOnboardingPlanModal={() => setIsOnboardingPlanModalOpen(true)}
          />
        </div>
      </div>

      {/* Modals */}
      <JobsModal
        isOpen={isJobsModalOpen}
        onClose={() => setIsJobsModalOpen(false)}
        jobs={jobs}
        employees={INITIAL_EMPLOYEES}
        onUpdateJob={handleUpdateJob}
        onCreateJob={handleCreateJob}
      />

      <RulesModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
        onOpenOnboardingPlan={() => setIsOnboardingPlanModalOpen(true)}
      />

      <OnboardingPlanModal
        isOpen={isOnboardingPlanModalOpen}
        onClose={() => setIsOnboardingPlanModalOpen(false)}
        planConfig={onboardingPlan}
        onSavePlan={handleSaveOnboardingPlan}
      />

      <ManualEditModal
        isOpen={isManualEditModalOpen}
        onClose={() => setIsManualEditModalOpen(false)}
        employees={INITIAL_EMPLOYEES}
        currentShiftId={
          onboardingChoice === 'alternative'
            ? 'shift-sat-mc-morn'
            : 'shift-sun-mc-morn'
        }
        currentBuddyId={activeBuddy.id}
        onSave={handleSaveManualEdit}
      />

      <MessageBuddyModal
        isOpen={isMessageBuddyModalOpen}
        onClose={() => setIsMessageBuddyModalOpen(false)}
        buddy={activeBuddy}
        firstShiftInfo={activeShiftInfo}
      />
    </div>
  );
}
