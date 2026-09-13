import React, { useState } from 'react';
import {
  CheckCircle2,
  Sparkles,
  AlertCircle,
  ArrowRight,
  Send,
  Users,
  CalendarCheck,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Sliders,
} from 'lucide-react';
import { ViewMode } from '../types';

interface GeneratedDraftSummaryBannerProps {
  onReviewDecisions: () => void;
  onPublishSchedule: () => void;
  onOpenManualEdit: () => void;
  isDecisionsOpen: boolean;
  isApproved: boolean;
  viewMode: ViewMode;
}

export const GeneratedDraftSummaryBanner: React.FC<GeneratedDraftSummaryBannerProps> = ({
  onReviewDecisions,
  onPublishSchedule,
  onOpenManualEdit,
  isDecisionsOpen,
  isApproved,
  viewMode,
}) => {
  const [showDetailedMetrics, setShowDetailedMetrics] = useState(false);
  const isDetailed = viewMode === 'detailed' || showDetailedMetrics;

  return (
    <div
      id="generated-draft-summary-banner"
      className="bg-white border border-[#BAE0FD] rounded-2xl p-4 sm:p-5 shadow-xs mb-4 animate-in fade-in slide-in-from-top-2 duration-300"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-[#E1E5E9]">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#EAF5FF] text-[#2F95F8] flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4 text-[#2F95F8]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[16px] sm:text-[17px] font-semibold text-[#202A36]">
                Schedule draft ready
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#EAF5FF] text-[#2F95F8] border border-[#BAE0FD]">
                AI Optimized
              </span>
              {isApproved && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#E8F8F0] text-[#37B77D] border border-[#BDEBD3]">
                  Decisions Approved ✓
                </span>
              )}
            </div>
            <p className="text-[13px] text-[#77818D] mt-0.5">
              16 shifts covered with 0 hard conflicts. Garden cart extended to 19:00 midweek, Fri to 15:00 & Sat to 18:00.
            </p>
          </div>
        </div>

        {/* Primary & Secondary Actions */}
        <div className="flex items-center gap-2.5 self-start lg:self-auto flex-wrap">
          <button
            id="review-key-decisions-btn"
            onClick={onReviewDecisions}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-[13px] transition-all cursor-pointer shadow-sm active:scale-[0.98] ${
              isDecisionsOpen
                ? 'bg-[#202A36] text-white ring-2 ring-[#202A36]/20'
                : 'bg-[#2F95F8] hover:bg-[#168FF5] text-white ring-2 ring-[#2F95F8]/30'
            }`}
          >
            <AlertCircle className="w-4 h-4 text-amber-300" />
            <span>{isDecisionsOpen ? 'Close Decisions (Viewing Decisions)' : 'Review Key Decisions'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            id="banner-manual-edit-btn"
            onClick={onOpenManualEdit}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border-2 border-[#BAE0FD] bg-[#EAF5FF] text-[#168FF5] hover:bg-[#2F95F8] hover:text-white font-bold text-[13px] transition-all shadow-xs cursor-pointer active:scale-[0.98]"
            title="Manually change Noa's onboarding shift assignment and shift partner"
          >
            <Sliders className="w-4 h-4 text-[#2F95F8] group-hover:text-white" />
            <span>Manual Edit</span>
          </button>

          <button
            id="publish-schedule-btn"
            onClick={onPublishSchedule}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#E1E5E9] bg-white text-[#202A36] hover:bg-[#F6F7F8] font-bold text-[13px] transition-all shadow-xs cursor-pointer active:scale-[0.98]"
          >
            <Send className="w-3.5 h-3.5 text-[#37B77D]" />
            <span>Publish</span>
          </button>
        </div>
      </div>

      {/* FOCUS VIEW: Low cognitive load 1-line status */}
      {!isDetailed ? (
        <div className="flex items-center justify-between pt-2.5 text-[12px]">
          <div className="flex items-center gap-3 text-[#202A36]">
            <span className="flex items-center gap-1.5 text-[#37B77D] font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              16 of 16 shifts staffed
            </span>
            <span className="text-[#A0AEC0]">·</span>
            <span className="text-[#77818D]">0 hard conflicts</span>
            <span className="text-[#A0AEC0]">·</span>
            <span className="text-[#C253D9] font-medium">2 peak balanced</span>
            <span className="text-[#A0AEC0]">·</span>
            <span className="text-[#37B77D] font-medium">1 onboarding created</span>
          </div>

          <button
            onClick={() => setShowDetailedMetrics(true)}
            className="text-[11px] text-[#77818D] hover:text-[#202A36] flex items-center gap-1 font-medium cursor-pointer"
          >
            <span>Show 7 Metric Tiles</span>
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      ) : (
        /* DETAILED VIEW: 7 metric tiles */
        <div className="pt-3">
          <div className="flex justify-end mb-1.5">
            {viewMode === 'focus' && (
              <button
                onClick={() => setShowDetailedMetrics(false)}
                className="text-[11px] text-[#77818D] hover:text-[#202A36] flex items-center gap-1 font-medium cursor-pointer"
              >
                <span>Hide Tiles</span>
                <ChevronUp className="w-3 h-3" />
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-[#F6F7F8] border border-[#E1E5E9]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#37B77D] shrink-0" />
              <span className="text-[11px] font-medium text-[#202A36]">
                <strong>16/16</strong> shifts
              </span>
            </div>

            <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-[#F6F7F8] border border-[#E1E5E9]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2F95F8] shrink-0" />
              <span className="text-[11px] font-medium text-[#202A36]">
                <strong>5</strong> avail limits
              </span>
            </div>

            <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-[#F6F7F8] border border-[#E1E5E9]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#37B77D] shrink-0" />
              <span className="text-[11px] font-medium text-[#202A36]">
                <strong>2</strong> PTOs kept
              </span>
            </div>

            <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-[#F6F7F8] border border-[#E1E5E9]">
              <Sparkles className="w-3.5 h-3.5 text-[#C253D9] shrink-0" />
              <span className="text-[11px] font-medium text-[#202A36]">
                <strong>2</strong> peak staffed
              </span>
            </div>

            <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-[#F6F7F8] border border-[#E1E5E9]">
              <Users className="w-3.5 h-3.5 text-[#37B77D] shrink-0" />
              <span className="text-[11px] font-medium text-[#202A36]">
                <strong>1</strong> onboarding
              </span>
            </div>

            <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-[#F6F7F8] border border-[#E1E5E9]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#37B77D] shrink-0" />
              <span className="text-[11px] font-medium text-[#202A36]">
                <strong>0</strong> conflicts
              </span>
            </div>

            <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-[#FFF7ED] border border-[#FED7AA]">
              <AlertCircle className="w-3.5 h-3.5 text-[#F3A43B] shrink-0" />
              <span className="text-[11px] font-semibold text-[#C2410C]">
                <strong>1</strong> for review
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
