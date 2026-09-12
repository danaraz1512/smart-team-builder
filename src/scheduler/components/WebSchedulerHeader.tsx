import React from 'react';
import {
  Search,
  HelpCircle,
  Bell,
  Sparkles,
  RotateCcw,
  Calendar,
  MapPin,
  ChevronDown,
  CheckCircle2,
  SlidersHorizontal,
  Layers,
  Zap,
  ShieldCheck,
  Sliders,
} from 'lucide-react';
import { SchedulerState, ViewMode } from '../types';

interface WebSchedulerHeaderProps {
  schedulerState: SchedulerState;
  onGenerateSmartSchedule: () => void;
  onResetDemo: () => void;
  selectedLocation: string;
  onSelectLocation: (loc: string) => void;
  viewMode: ViewMode;
  onToggleViewMode: (mode: ViewMode) => void;
  onOpenRules?: () => void;
  onOpenManualEdit?: () => void;
}

export const WebSchedulerHeader: React.FC<WebSchedulerHeaderProps> = ({
  schedulerState,
  onGenerateSmartSchedule,
  onResetDemo,
  selectedLocation,
  onSelectLocation,
  viewMode,
  onToggleViewMode,
  onOpenRules,
  onOpenManualEdit,
}) => {
  const isPublished = schedulerState === 'published';
  const isAnalyzing = schedulerState === 'analyzing';

  return (
    <header className="bg-white border-b border-[#E1E5E9] shrink-0">
      {/* Connecteam Style Top Utility Bar */}
      <div className="h-14 px-6 flex items-center justify-between border-b border-[#E1E5E9]">
        {/* Left: Connecteam Brand / Product Identity */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            {/* Connecteam logo mark: 3-bar / check stylized mark */}
            <div className="w-8 h-8 rounded-lg bg-[#2F95F8] flex items-center justify-center text-white font-bold shadow-sm">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M4 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-[18px] tracking-tight text-[#202A36] leading-tight">
                connecteam
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#77818D] font-medium">
                Operations Hub
              </span>
            </div>
          </div>

          <div className="h-6 w-[1px] bg-[#E1E5E9]" />

          {/* Search bar */}
          <div className="relative w-64 hidden sm:block">
            <Search className="w-4 h-4 text-[#77818D] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search shifts, rules, employees..."
              className="w-full pl-9 pr-3 py-1.5 text-[13px] bg-[#F6F7F8] border border-transparent rounded-lg focus:bg-white focus:border-[#2F95F8] focus:outline-none transition-all placeholder:text-[#77818D]"
            />
          </div>
        </div>

        {/* Right: Quick Help, Notifications, User Avatar */}
        <div className="flex items-center gap-4">
          <button
            title="Help Center"
            className="p-2 text-[#77818D] hover:text-[#202A36] hover:bg-[#F6F7F8] rounded-lg transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
          <div className="relative">
            <button
              title="Notifications"
              className="p-2 text-[#77818D] hover:text-[#202A36] hover:bg-[#F6F7F8] rounded-lg transition-colors"
            >
              <Bell className="w-4 h-4" />
            </button>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#2F95F8]" />
          </div>

          <div className="h-6 w-[1px] bg-[#E1E5E9]" />

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#202A36] text-white flex items-center justify-center font-semibold text-xs border border-white shadow-sm">
              AM
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[13px] font-semibold text-[#202A36] leading-none">
                Alex Morgan
              </span>
              <span className="text-[11px] text-[#77818D] mt-0.5">
                Operations Manager
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Page Title & Actions Toolbar */}
      <div className="px-6 py-3 flex flex-wrap items-center justify-between gap-3 bg-white">
        <div className="flex flex-col gap-0.5">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-[12px] text-[#77818D]">
            <span>Operations</span>
            <span>/</span>
            <span className="text-[#202A36] font-medium">Job Scheduler</span>
          </div>

          <div className="flex items-center gap-3 mt-0.5">
            <h1 className="text-[20px] font-semibold text-[#202A36] tracking-tight">
              Bean & Bloom Schedule
            </h1>

            {/* Schedule Status Badge */}
            {isPublished ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-[#E8F8F0] text-[#37B77D] border border-[#BDEBD3]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Published
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-[#F1F3F5] text-[#77818D] border border-[#E1E5E9]">
                Draft
              </span>
            )}
          </div>
        </div>

        {/* Controls: Mode Switcher Toggle + Location Filter + Primary Action */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* TOGGLE: Focus View vs Detailed View (Reduces cognitive load) */}
          <div
            id="view-mode-toggle"
            className="flex items-center bg-[#F1F3F5] p-1 rounded-xl border border-[#E1E5E9]"
            title="Toggle between Focus View (reduced cognitive load) and Detailed View"
          >
            <button
              id="toggle-focus-view-btn"
              onClick={() => onToggleViewMode('focus')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[12px] font-semibold transition-all ${
                viewMode === 'focus'
                  ? 'bg-white text-[#2F95F8] shadow-xs'
                  : 'text-[#77818D] hover:text-[#202A36]'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>תצוגה ממוקדת (Focus)</span>
            </button>
            <button
              id="toggle-detailed-view-btn"
              onClick={() => onToggleViewMode('detailed')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[12px] font-semibold transition-all ${
                viewMode === 'detailed'
                  ? 'bg-white text-[#2F95F8] shadow-xs'
                  : 'text-[#77818D] hover:text-[#202A36]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>תצוגה מפורטת (Detailed)</span>
            </button>
          </div>

          <div className="h-5 w-[1px] bg-[#E1E5E9] hidden sm:block" />

          {/* Quick Location Pills */}
          <div className="flex items-center gap-1 bg-[#F6F7F8] p-0.5 rounded-lg border border-[#E1E5E9] text-[12px]">
            {['All Locations', 'Main Café', 'Riverside Coffee Cart'].map((loc) => (
              <button
                key={loc}
                onClick={() => onSelectLocation(loc)}
                className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                  selectedLocation === loc
                    ? 'bg-white text-[#202A36] shadow-xs font-semibold'
                    : 'text-[#77818D] hover:text-[#202A36]'
                }`}
              >
                {loc === 'Riverside Coffee Cart' ? 'Riverside Cart' : loc}
              </button>
            ))}
          </div>

          {/* Week Selector */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 bg-[#F6F7F8] border border-[#E1E5E9] rounded-lg text-[12px] text-[#202A36] font-medium">
            <Calendar className="w-3.5 h-3.5 text-[#77818D]" />
            <span>Sep 13–19, 2026</span>
          </div>

          {/* Rules Action Button */}
          {onOpenRules && (
            <button
              id="header-rules-btn"
              onClick={onOpenRules}
              title="בדיקת חוקי שיבוץ ואילוצים עסקיים"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#BAE0FD] bg-[#EAF5FF] text-[#168FF5] hover:bg-[#2F95F8] hover:text-white text-[12px] font-bold transition-all cursor-pointer shadow-2xs active:scale-[0.98]"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>חוקי שיבוץ (Rules)</span>
            </button>
          )}

          {/* Manual Edit Action Button (available when draft or published) */}
          {onOpenManualEdit && (schedulerState === 'draft_generated' || schedulerState === 'reviewing_decisions' || isPublished) && (
            <button
              id="header-manual-edit-btn"
              onClick={onOpenManualEdit}
              title="ביצוע שינוי ידני של שיבוץ החפיפה ובחירת חונך"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E1E5E9] bg-white text-[#202A36] hover:bg-[#F6F7F8] hover:border-[#BAE0FD] text-[12px] font-bold transition-all cursor-pointer shadow-2xs active:scale-[0.98]"
            >
              <Sliders className="w-3.5 h-3.5 text-[#2F95F8]" />
              <span>שינוי ידני (Manual Edit)</span>
            </button>
          )}

          {/* Reset Demo Action */}
          <button
            id="reset-demo-btn"
            onClick={onResetDemo}
            title="Restore prototype to initial state"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#E1E5E9] bg-white text-[#77818D] hover:text-[#202A36] hover:bg-[#F6F7F8] text-[12px] font-medium transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Primary Action: Generate Smart Schedule */}
          {!isPublished && (
            <button
              id="generate-smart-schedule-btn"
              onClick={onGenerateSmartSchedule}
              disabled={isAnalyzing}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-semibold text-[13px] text-white shadow-sm transition-all ${
                isAnalyzing
                  ? 'bg-[#94CBFC] cursor-not-allowed'
                  : 'bg-[#2F95F8] hover:bg-[#168FF5] active:scale-[0.99]'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#C253D9] animate-pulse" />
              <span>
                {isAnalyzing ? 'Analyzing Constraints...' : 'Generate Smart Schedule'}
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
