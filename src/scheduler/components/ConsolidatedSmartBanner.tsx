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

  const title = isInitial
    ? 'סידור עבודה לשבוע הבא'
    : isAnalyzing
    ? 'מנתח אילוצים וחוקי שיבוץ...'
    : isDraftOrReview
    ? 'טיוטת סידור עבודה מוכנה'
    : 'סידור העבודה פורסם בהצלחה';

  const subtitle = isInitial
    ? 'ערב חג ביום ראשון (08:00–14:00) · 16 משמרות לשיבוץ'
    : isAnalyzing
    ? 'בודק זמינות, חוקי שיבוץ וכשירות עובדים'
    : isDraftOrReview
    ? '16/16 משמרות מכוסות · 0 קונפליקטים · החלטה אחת לבדיקה'
    : '16/16 משמרות פורסמו · הצוות קיבל עדכון';

  return (
    <div
      id="consolidated-smart-banner"
      className="bg-white border border-[#E1E5E9] rounded-2xl shadow-xs px-4 py-3 mb-4"
    >
      {/* One calm line: status + what matters now + the next action */}
      <div className="flex flex-wrap items-center gap-3">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
            isPublished
              ? 'bg-[#E8F8F0] text-[#16A34A]'
              : isDraftOrReview
              ? 'bg-[#EAF5FF] text-[#2F95F8]'
              : 'bg-amber-50 text-amber-600'
          }`}
        >
          {isPublished ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : isDraftOrReview ? (
            <Sparkles className="w-4 h-4" />
          ) : (
            <Calendar className="w-4 h-4" />
          )}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-[15px] font-bold text-[#202A36] truncate">{title}</h2>
            {isApproved && (
              <span className="text-[11px] font-semibold text-[#0284C7] whitespace-nowrap">
                החלטות אושרו ✓
              </span>
            )}
          </div>
          <p className="text-[11.5px] text-[#64748B] truncate">{subtitle}</p>
        </div>

        <div className="flex items-center gap-2 ml-auto shrink-0">
          {isInitial && (
            <button
              onClick={onGenerateSchedule}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2F95F8] hover:bg-[#168FF5] text-white font-bold text-[13px] shadow-xs active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4" />
              <span>צור סידור חכם</span>
            </button>
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
                <span>{isDecisionsOpen ? 'סגור החלטות' : 'בדוק החלטות (1)'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                id="smart-banner-manual-btn"
                onClick={onOpenManualEdit}
                title="שינוי ידני של מועד החפיפה ובחירת חונך"
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
                <span>פרסם לצוות</span>
              </button>
            </>
          )}

          <button
            onClick={onOpenRules}
            title="חוקי שיבוץ והגדרות אילוצים"
            className="p-2 rounded-xl border border-[#E1E5E9] hover:bg-[#F1F5F9] text-[#64748B] transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-[#2F95F8]" />
          </button>

          {onOpenOnboardingPlan && (
            <button
              onClick={onOpenOnboardingPlan}
              title="תוכנית חפיפה ומשימות לעובד חדש"
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
            <span>{isExpanded ? 'הסתר פרטים' : 'פרטים'}</span>
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
            { color: 'bg-[#16A34A]', title: '16/16 משמרות', sub: 'מכוסות במלואן' },
            { color: 'bg-amber-500', title: 'ערב חג: 08:00–14:00', sub: 'מתכונת מקוצרת' },
            { color: 'bg-[#2F95F8]', title: '5 אילוצי זמינות', sub: 'נשמרו בהצלחה' },
            { color: 'bg-purple-500', title: '2 משמרות שיא', sub: 'חמישי ושישי' },
            { color: 'bg-emerald-500', title: 'חפיפת נועה', sub: 'ראשון 10:00 · יוסי' },
            { color: 'bg-slate-400', title: '0 קונפליקטים', sub: 'ללא חריגות' },
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
