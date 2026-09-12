import React, { useState } from 'react';
import {
  CalendarDays,
  UserCheck,
  Palmtree,
  TrendingUp,
  UserPlus,
  Store,
  ArrowRight,
  Info,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
} from 'lucide-react';
import { ViewMode } from '../types';

interface SchedulingOverviewBannerProps {
  onOpenRules: () => void;
  viewMode: ViewMode;
}

export const SchedulingOverviewBanner: React.FC<SchedulingOverviewBannerProps> = ({
  onOpenRules,
  viewMode,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const showFullMetrics = viewMode === 'detailed' || isExpanded;

  return (
    <div
      id="scheduling-overview-banner"
      className="bg-white border border-[#E1E5E9] rounded-2xl p-4 sm:p-5 shadow-xs transition-all mb-4"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#E1E5E9]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2F95F8]" />
            <h2 className="text-[16px] sm:text-[17px] font-semibold text-[#202A36]">
              Ready to build next week’s schedule
            </h2>
            {viewMode === 'focus' && (
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#EAF5FF] text-[#2F95F8]">
                16 Shifts · 2 Locations
              </span>
            )}
          </div>
          <p className="text-[13px] text-[#77818D] mt-0.5">
            Optimizes Main Café & Riverside Park Cart (open to 19:00 midweek, Fri to 15:00, Sat to 18:00).
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto flex-wrap">
          {viewMode === 'focus' && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[12px] text-[#77818D] hover:text-[#202A36] font-medium flex items-center gap-1 cursor-pointer px-2 py-1 rounded-lg hover:bg-[#F1F3F5] transition-colors"
            >
              <span>{showFullMetrics ? 'Hide Inputs' : 'View 6 Inputs'}</span>
              {showFullMetrics ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}

          <button
            id="review-scheduling-rules-btn"
            onClick={onOpenRules}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold bg-[#EAF5FF] text-[#168FF5] hover:bg-[#2F95F8] hover:text-white border-2 border-[#BAE0FD] shadow-xs transition-all cursor-pointer active:scale-[0.98]"
          >
            <ShieldCheck className="w-4 h-4 text-[#2F95F8] group-hover:text-white" />
            <span>Review Scheduling Rules</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Inputs Grid - Collapsible in focus mode, open in detailed mode */}
      {showFullMetrics && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-3.5 animate-in fade-in duration-200">
          {/* Metric 1 */}
          <div className="bg-[#F6F7F8] border border-[#E1E5E9] rounded-xl p-2.5 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#EAF5FF] text-[#2F95F8] flex items-center justify-center shrink-0">
              <CalendarDays className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[15px] font-bold text-[#202A36] leading-none">16</div>
              <div className="text-[11px] text-[#77818D] font-medium mt-0.5">
                Shifts to staff
              </div>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="bg-[#F6F7F8] border border-[#E1E5E9] rounded-xl p-2.5 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#EAF5FF] text-[#2F95F8] flex items-center justify-center shrink-0">
              <UserCheck className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[15px] font-bold text-[#202A36] leading-none">5</div>
              <div className="text-[11px] text-[#77818D] font-medium mt-0.5">
                Availability limits
              </div>
            </div>
          </div>

          {/* Metric 3 */}
          <div className="bg-[#F6F7F8] border border-[#E1E5E9] rounded-xl p-2.5 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#FFF7ED] text-[#F3A43B] flex items-center justify-center shrink-0">
              <Palmtree className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[15px] font-bold text-[#202A36] leading-none">2</div>
              <div className="text-[11px] text-[#77818D] font-medium mt-0.5">
                Approved PTOs
              </div>
            </div>
          </div>

          {/* Metric 4 */}
          <div className="bg-[#F6F7F8] border border-[#E1E5E9] rounded-xl p-2.5 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#FAF5FF] text-[#C253D9] flex items-center justify-center shrink-0">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[15px] font-bold text-[#202A36] leading-none">2</div>
              <div className="text-[11px] text-[#77818D] font-medium mt-0.5">
                Peak shifts
              </div>
            </div>
          </div>

          {/* Metric 5 */}
          <div className="bg-[#F6F7F8] border border-[#E1E5E9] rounded-xl p-2.5 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#E8F8F0] text-[#37B77D] flex items-center justify-center shrink-0">
              <UserPlus className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[15px] font-bold text-[#202A36] leading-none">1</div>
              <div className="text-[11px] text-[#77818D] font-medium mt-0.5">
                New onboarding
              </div>
            </div>
          </div>

          {/* Metric 6 */}
          <div className="bg-[#F6F7F8] border border-[#E1E5E9] rounded-xl p-2.5 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#F1F3F5] text-[#77818D] flex items-center justify-center shrink-0">
              <Store className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[15px] font-bold text-[#202A36] leading-none">2</div>
              <div className="text-[11px] text-[#77818D] font-medium mt-0.5">
                Locations
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
