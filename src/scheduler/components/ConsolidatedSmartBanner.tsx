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
  Gift,
  Calendar,
  Users,
  Award,
  GraduationCap,
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
}

export const ConsolidatedSmartBanner: React.FC<ConsolidatedSmartBannerProps> = ({
  schedulerState,
  viewMode,
  isApproved,
  isDecisionsOpen,
  onReviewDecisions,
  onPublishSchedule,
  onOpenManualEdit,
  onOpenRules,
  onGenerateSchedule,
  onOpenOnboardingPlan,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isDraftOrReview =
    schedulerState === 'draft_generated' || schedulerState === 'reviewing_decisions';
  const isPublished = schedulerState === 'published';
  const isInitial = schedulerState === 'initial';
  const isAnalyzing = schedulerState === 'analyzing';

  return (
    <div
      id="consolidated-smart-banner"
      className="bg-white border border-[#BAE0FD] rounded-2xl shadow-xs p-4 mb-4 transition-all"
    >
      {/* Tier 1: Main Header & Actions (Balanced wrapping with plenty of horizontal space) */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left Side: Status Icon + Title + Status Badges */}
        <div className="flex items-center gap-2.5 flex-wrap min-w-0">
          {/* Status Icon */}
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
              isPublished
                ? 'bg-[#E8F8F0] text-[#16A34A]'
                : isDraftOrReview
                ? 'bg-[#EAF5FF] text-[#2F95F8]'
                : 'bg-amber-50 text-amber-600'
            }`}
          >
            {isPublished ? (
              <CheckCircle2 className="w-5 h-5 text-[#16A34A]" />
            ) : isDraftOrReview ? (
              <Sparkles className="w-5 h-5 text-[#2F95F8]" />
            ) : (
              <Calendar className="w-5 h-5 text-amber-600" />
            )}
          </div>

          {/* Title */}
          <h2 className="text-[15px] sm:text-[16px] font-bold text-[#202A36] whitespace-nowrap">
            {isInitial && 'סידור עבודה לשבוע הבא'}
            {isAnalyzing && 'מנתח אילוצים וחוקי שיבוץ...'}
            {isDraftOrReview && 'טיוטת סידור עבודה מוכנה'}
            {isPublished && 'סידור העבודה פורסם בהצלחה'}
          </h2>

          {/* Shift Coverage Badge */}
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11.5px] font-bold bg-[#E8F8F0] text-[#166534] border border-[#BDEBD3] whitespace-nowrap">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
            <span>16/16 משמרות משובצות</span>
          </span>

          {/* Holiday Context Badge */}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11.5px] font-bold bg-[#FEF3C7] text-amber-950 border border-amber-300 shadow-2xs whitespace-nowrap">
            <Gift className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>ערב חג השבוע (ראשון 08:00–14:00)</span>
          </span>

          {isApproved && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11.5px] font-semibold bg-[#EAF5FF] text-[#0284C7] border border-[#BAE0FD] whitespace-nowrap">
              <span>החלטות אושרו ✓</span>
            </span>
          )}
        </div>

        {/* Right Side: Key Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          {/* Initial State: Generate Button */}
          {isInitial && (
            <button
              onClick={onGenerateSchedule}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2F95F8] hover:bg-[#168FF5] text-white font-bold text-[13px] shadow-xs active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4" />
              <span>צור סידור חכם</span>
            </button>
          )}

          {/* Draft/Review State Actions */}
          {isDraftOrReview && (
            <>
              <button
                id="smart-banner-review-btn"
                onClick={onReviewDecisions}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-[12.5px] transition-all cursor-pointer shadow-xs active:scale-[0.98] whitespace-nowrap ${
                  isDecisionsOpen
                    ? 'bg-[#202A36] text-white ring-2 ring-[#202A36]/20'
                    : 'bg-[#2F95F8] hover:bg-[#168FF5] text-white ring-2 ring-[#2F95F8]/30'
                }`}
              >
                <AlertCircle className="w-4 h-4 text-amber-300" />
                <span>{isDecisionsOpen ? 'סגור החלטות' : 'בדוק החלטות (1)'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                id="smart-banner-manual-btn"
                onClick={onOpenManualEdit}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#BAE0FD] bg-[#EAF5FF] text-[#168FF5] hover:bg-[#2F95F8] hover:text-white font-bold text-[12.5px] transition-all cursor-pointer shadow-2xs active:scale-[0.98] whitespace-nowrap"
                title="שינוי ידני של מועד החפיפה ובחירת חונך"
              >
                <Sliders className="w-3.5 h-3.5 text-[#2F95F8] group-hover:text-white" />
                <span>שינוי ידני</span>
              </button>

              <button
                id="smart-banner-publish-btn"
                onClick={onPublishSchedule}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-[12.5px] transition-all shadow-xs cursor-pointer active:scale-[0.98] whitespace-nowrap"
              >
                <Send className="w-3.5 h-3.5 text-white" />
                <span>פרסם לצוות</span>
              </button>
            </>
          )}

          {/* Rules Action Button */}
          <button
            onClick={onOpenRules}
            title="חוקי שיבוץ והגדרות אילוצים"
            className="p-2 rounded-xl border border-[#E1E5E9] hover:bg-[#F8FAFC] text-[#64748B] hover:text-[#202A36] transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-[#2F95F8]" />
          </button>

          {/* Onboarding Plan Action Button */}
          {onOpenOnboardingPlan && (
            <button
              onClick={onOpenOnboardingPlan}
              title="הגדרת תוכנית חפיפה, משימות וצ'קליסט לעובד חדש"
              className="px-3 py-2 rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100/80 text-emerald-800 font-bold text-[12px] flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              <span>תוכנית חפיפה ומשימות</span>
            </button>
          )}
        </div>
      </div>

      {/* Tier 2: Operational Highlights & Metric Details Toggle (Roomy and clean) */}
      <div className="mt-3 pt-2.5 border-t border-[#F1F5F9] flex flex-wrap items-center justify-between gap-2.5 text-[12px]">
        {/* Key Highlights Pill Group */}
        <div className="flex items-center gap-2 flex-wrap text-[#475569]">
          <span className="inline-flex items-center gap-1 font-semibold text-[#166534] bg-[#F0FDF4] px-2 py-0.5 rounded-lg border border-[#DCFCE7] whitespace-nowrap">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
            0 קונפליקטים קשיחים
          </span>

          {onOpenOnboardingPlan ? (
            <button
              onClick={onOpenOnboardingPlan}
              className="inline-flex items-center gap-1 font-semibold text-[#0369A1] bg-[#F0F9FF] hover:bg-[#E0F2FE] px-2.5 py-0.5 rounded-lg border border-[#BAE0FD] whitespace-nowrap cursor-pointer transition-all text-[12px]"
              title="לחץ לעריכת המשימות של נועה"
            >
              <Users className="w-3.5 h-3.5 text-[#0284C7]" />
              <span>חפיפת נועה: ראשון 10:00 (ערוך משימות ✏️)</span>
            </button>
          ) : (
            <span className="inline-flex items-center gap-1 font-semibold text-[#0369A1] bg-[#F0F9FF] px-2 py-0.5 rounded-lg border border-[#E0F2FE] whitespace-nowrap">
              <Users className="w-3.5 h-3.5 text-[#0284C7]" />
              חפיפת נועה: ראשון 10:00 (עם יוסי)
            </span>
          )}

          <span className="inline-flex items-center gap-1 font-semibold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 whitespace-nowrap">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            עוגני תפוקה בשיא: 100%
          </span>

          <span className="inline-flex items-center gap-1 text-[#64748B] whitespace-nowrap">
            <span>· 5 עובדים זמינים שובצו</span>
          </span>

          <span className="inline-flex items-center gap-1 text-[#64748B] whitespace-nowrap">
            <span>· מתכונת ערב חג קצרה מוגדרת</span>
          </span>
        </div>

        {/* Toggle Detailed Metrics Button */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[11.5px] text-[#64748B] hover:text-[#202A36] font-semibold flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-[#F1F5F9] transition-colors cursor-pointer whitespace-nowrap"
        >
          <span>{isExpanded ? 'צמצם פירוט מדדים' : 'הצג פירוט מדדים מלא'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Tier 3: Collapsible Detailed Metrics Drawer (When requested by user) */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-[#E1E5E9] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-[11px] animate-in fade-in duration-200">
          <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] shrink-0" />
            <div>
              <div className="font-bold text-[#202A36]">16/16 משמרות</div>
              <div className="text-[10px] text-[#64748B]">מכוסות במלואן</div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
            <div>
              <div className="font-bold text-[#202A36]">ערב חג: 08:00–14:00</div>
              <div className="text-[10px] text-amber-800">מתכונת מקוצרת</div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2F95F8] shrink-0" />
            <div>
              <div className="font-bold text-[#202A36]">5 אילוצי זמינות</div>
              <div className="text-[10px] text-[#64748B]">נשמרו בהצלחה</div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0" />
            <div>
              <div className="font-bold text-[#202A36]">2 משמרות שיא</div>
              <div className="text-[10px] text-[#64748B]">חמישי ושישי</div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
            <div>
              <div className="font-bold text-[#202A36]">חפיפת נועה</div>
              <div className="text-[10px] text-[#64748B]">ראשון 10:00 יוסי</div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400 shrink-0" />
            <div>
              <div className="font-bold text-[#202A36]">0 קונפליקטים</div>
              <div className="text-[10px] text-[#64748B]">ללא חריגות</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
