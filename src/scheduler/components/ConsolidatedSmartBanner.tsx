import React, { useState } from 'react';
import {
  Sparkles,
  AlertCircle,
  ArrowRight,
  Send,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sliders,
  ShieldCheck,
  Calendar,
  GraduationCap,
  CalendarClock,
  CopyPlus,
} from 'lucide-react';
import { SchedulerState, ViewMode } from '../types';

interface ConsolidatedSmartBannerProps {
  schedulerState: SchedulerState;
  viewMode: ViewMode;
  isApproved: boolean;
  isDecisionsOpen: boolean;
  onReviewDecisions: () => void;
  onPublishSchedule: () => void;
  onOpenManualEdit: () => void;
  onOpenRules: () => void;
  onGenerateSchedule: () => void;
  onOpenOnboardingPlan?: () => void;
  onSelectTemplate?: () => void;
  onSelectCopyPrevious?: () => void;
}

export const ConsolidatedSmartBanner: React.FC<ConsolidatedSmartBannerProps> = ({
  schedulerState,
  isApproved,
  isDecisionsOpen,
  onReviewDecisions,
  onPublishSchedule,
  onOpenManualEdit,
  onOpenRules,
  onGenerateSchedule,
  onOpenOnboardingPlan,
  onSelectTemplate,
  onSelectCopyPrevious,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isDraftOrReview =
    schedulerState === 'draft_generated' || schedulerState === 'reviewing_decisions';
  const isPublished = schedulerState === 'published';
  const isInitial = schedulerState === 'initial';
  const isAnalyzing = schedulerState === 'analyzing';

  const title = isInitial
    ? 'Next week\'s schedule'
    : isAnalyzing
    ? 'Analyzing constraints and scheduling rules...'
    : isDraftOrReview
    ? 'Schedule draft ready'
    : 'Schedule published successfully';

  const subtitle = isInitial
    ? 'Holiday eve on Sunday (08:00–14:00) · 16 shifts to staff'
    : isAnalyzing
    ? 'Checking availability, scheduling rules, and employee qualifications'
    : isDraftOrReview
    ? '16/16 shifts covered · 0 conflicts · 1 decision to review'
    : '16/16 shifts published · Team has been notified';

  return (
    <div
      id="consolidated-smart-banner"
      className={`bg-white border rounded-2xl shadow-xs mb-4 ${
        isInitial ? 'border-[#BAE0FD] px-5 py-4' : 'border-[#E1E5E9] px-4 py-3'
      }`}
    >
      {/* One calm line: status + what matters now + the next action */}
      <div className="flex flex-wrap items-center gap-3">
        <div
          className={`rounded-lg flex items-center justify-center shrink-0 ${
            isInitial ? 'w-11 h-11' : 'w-8 h-8'
          } ${
            isPublished
              ? 'bg-[#E8F8F0] text-[#16A34A]'
              : isDraftOrReview
              ? 'bg-[#EAF5FF] text-[#2F95F8]'
              : 'bg-[#EAF5FF] text-[#2F95F8]'
          }`}
        >
          {isPublished ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : isDraftOrReview ? (
            <Sparkles className="w-4 h-4" />
          ) : (
            <Sparkles className={isInitial ? 'w-5 h-5' : 'w-4 h-4'} />
          )}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className={`font-bold text-[#202A36] truncate ${isInitial ? 'text-[17px]' : 'text-[15px]'}`}>{title}</h2>
            {isApproved && (
              <span className="text-[11px] font-semibold text-[#0284C7] whitespace-nowrap">
                Decisions approved ✓
              </span>
            )}
          </div>
          <p className={`text-[#64748B] truncate ${isInitial ? 'text-[13px]' : 'text-[11.5px]'}`}>{subtitle}</p>
        </div>

        <div className="flex items-center gap-2 ml-auto shrink-0">
          {isInitial && (
            <div className="flex flex-col items-end gap-1.5">
              <button
                id="generate-smart-schedule-btn"
                onClick={onGenerateSchedule}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#2F95F8] hover:bg-[#168FF5] text-white font-extrabold text-[15px] shadow-lg shadow-[#2F95F8]/25 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
              >
                <Sparkles className="w-5 h-5 text-white" />
                <span>Generate Smart Schedule</span>
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  id="manual-load-template-btn"
                  onClick={onSelectTemplate}
                  title="Loads a fixed weekly template — does not check real availability"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#BAE0FD] bg-[#EAF5FF] text-[#168FF5] hover:bg-[#2F95F8] hover:text-white text-[12.5px] font-bold transition-all cursor-pointer whitespace-nowrap"
                >
                  <CalendarClock className="w-4 h-4" />
                  <span>Load Weekly Template</span>
                </button>
                <button
                  id="manual-copy-previous-btn"
                  onClick={onSelectCopyPrevious}
                  title="Copies last week's schedule as-is"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E1E5E9] bg-white text-[#202A36] hover:bg-[#F6F7F8] text-[12.5px] font-bold transition-all cursor-pointer whitespace-nowrap"
                >
                  <CopyPlus className="w-4 h-4" />
                  <span>Copy Previous Week</span>
                </button>
              </div>
            </div>
          )}

          {isDraftOrReview && (
            <>
              <button
                id="smart-banner-review-btn"
                onClick={onReviewDecisions}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-[12.5px] transition-all cursor-pointer shadow-xs active:scale-[0.98] whitespace-nowrap ${
                  isDecisionsOpen
                    ? 'bg-[#202A36] text-white'
                    : 'bg-[#2F95F8] hover:bg-[#168FF5] text-white'
                }`}
              >
                <AlertCircle className="w-4 h-4 text-amber-300" />
                <span>{isDecisionsOpen ? 'Close Decisions' : 'Review Decisions (1)'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                id="smart-banner-manual-btn"
                onClick={onOpenManualEdit}
                title="Manually change the onboarding shift time and mentor selection"
                className="p-2 rounded-xl border border-[#E1E5E9] hover:bg-[#F1F5F9] text-[#64748B] transition-colors cursor-pointer"
              >
                <Sliders className="w-4 h-4 text-[#2F95F8]" />
              </button>

              <button
                id="smart-banner-publish-btn"
                onClick={onPublishSchedule}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-[12.5px] transition-all shadow-xs cursor-pointer active:scale-[0.98] whitespace-nowrap"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Publish to Team</span>
              </button>
            </>
          )}

          <button
            onClick={onOpenRules}
            title="Scheduling rules and constraint settings"
            className="p-2 rounded-xl border border-[#E1E5E9] hover:bg-[#F1F5F9] text-[#64748B] transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-[#2F95F8]" />
          </button>

          {onOpenOnboardingPlan && (
            <button
              onClick={onOpenOnboardingPlan}
              title="Onboarding plan and tasks for new employee"
              className="p-2 rounded-xl border border-[#E1E5E9] hover:bg-[#F1F5F9] text-[#64748B] transition-colors cursor-pointer"
            >
              <GraduationCap className="w-4 h-4 text-emerald-600" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[11.5px] text-[#64748B] hover:text-[#202A36] font-semibold flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-[#F1F5F9] transition-colors cursor-pointer whitespace-nowrap"
          >
            <span>{isExpanded ? 'Hide Details' : 'Details'}</span>
            {isExpanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Details only on demand */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-[#E1E5E9] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-[11px] animate-in fade-in duration-200">
          {[
            { color: 'bg-[#16A34A]', title: '16/16 shifts', sub: 'Fully covered' },
            { color: 'bg-amber-500', title: 'Holiday eve: 08:00–14:00', sub: 'Shortened hours' },
            { color: 'bg-[#2F95F8]', title: '5 availability constraints', sub: 'Saved successfully' },
            { color: 'bg-purple-500', title: '2 peak shifts', sub: 'Thursday and Friday' },
            { color: 'bg-emerald-500', title: 'Noa\'s onboarding', sub: 'Sunday 10:00 · Yossi' },
            { color: 'bg-slate-400', title: '0 conflicts', sub: 'No exceptions' },
          ].map((metric) => (
            <div
              key={metric.title}
              className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center gap-2"
            >
              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${metric.color}`} />
              <div>
                <div className="font-bold text-[#202A36]">{metric.title}</div>
                <div className="text-[10px] text-[#64748B]">{metric.sub}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
