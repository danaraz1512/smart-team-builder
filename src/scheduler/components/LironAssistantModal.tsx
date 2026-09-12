import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Gift,
  Calendar,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Users,
  Award,
  PhoneCall,
  Flame,
  ArrowRight,
  Sun,
  ShieldCheck,
  Send,
  Coffee,
} from 'lucide-react';
import { Employee } from '../types';

interface LironAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
  onApplyNegotiatedShift?: () => void;
  onTriggerToast: (msg: string) => void;
}

export const LironAssistantModal: React.FC<LironAssistantModalProps> = ({
  isOpen,
  onClose,
  employees,
  onApplyNegotiatedShift,
  onTriggerToast,
}) => {
  const [activeTab, setActiveTab] = useState<'holidays' | 'negotiation' | 'illness' | 'shabbat' | 'rewards'>('holidays');
  const [holidayIncentiveSent, setHolidayIncentiveSent] = useState(false);
  const [negotiationApplied, setNegotiationApplied] = useState(false);
  const [replacementFound, setReplacementFound] = useState(false);
  const [shabbatAdjusted, setShabbatAdjusted] = useState(false);
  const [rewardSentEmployeeId, setRewardSentEmployeeId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSendHolidayIncentive = () => {
    setHolidayIncentiveSent(true);
    onTriggerToast('התראת זמינות חג ושוברי מתנה נשלחה לכל 6 העובדים באפליקציה!');
  };

  const handleApplyNegotiation = () => {
    setNegotiationApplied(true);
    if (onApplyNegotiatedShift) onApplyNegotiatedShift();
    onTriggerToast('הסכם הפשרה אושר: דנה תפתח ב-08:00 ותצא מוקדם ב-15:00 לסידוריה!');
  };

  const handleFindReplacement = () => {
    setReplacementFound(true);
    onTriggerToast('נמצא מחליף: שרון ותום עודכנו וההחלפה אושרה אוטומטית!');
  };

  const handleAdjustShabbat = () => {
    setShabbatAdjusted(true);
    onTriggerToast('שעות יום שישי עודכנו לסגירה ב-14:30 לפי הנחיות הרבנות וכניסת שבת.');
  };

  const handleSendReward = (empId: string, empName: string) => {
    setRewardSentEmployeeId(empId);
    onTriggerToast(`שובר ארוחת בוקר זוגית נשלח ל-${empName} כהוקרה על גמישות ודירוג גבוה! 🎁`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#E1E5E9] w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden text-right" dir="rtl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E1E5E9] flex items-center justify-between bg-gradient-to-l from-[#FAFBFD] to-[#F1F6FD]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2F95F8] text-white flex items-center justify-center shadow-sm">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[17px] font-bold text-[#202A36]">
                  הסוכן החכם של לירון — ניהול שטח, חגים ובלת"מים
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF5FF] text-[#168FF5] border border-[#BAE0FD]">
                  מנהל משמרת AI
                </span>
              </div>
              <p className="text-[12px] text-[#77818D]">
                השראה מהשטח: פתרון פערי פתיחה, תמריצי חגים, שעות רבנות וחילופי מחלה מיידיים
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#77818D] hover:text-[#202A36] hover:bg-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-[#E1E5E9] bg-[#FAFBFD] px-4 gap-1 overflow-x-auto text-[13px] font-bold">
          <button
            onClick={() => setActiveTab('holidays')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
              activeTab === 'holidays'
                ? 'border-[#2F95F8] text-[#168FF5] bg-white'
                : 'border-transparent text-[#77818D] hover:text-[#202A36]'
            }`}
          >
            <Gift className="w-4 h-4 text-amber-500" />
            <span>שבוע חג ותמריצים</span>
          </button>

          <button
            onClick={() => setActiveTab('negotiation')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
              activeTab === 'negotiation'
                ? 'border-[#2F95F8] text-[#168FF5] bg-white'
                : 'border-transparent text-[#77818D] hover:text-[#202A36]'
            }`}
          >
            <Clock className="w-4 h-4 text-[#2F95F8]" />
            <span>משא ומתן פתיחה (08:00)</span>
          </button>

          <button
            onClick={() => setActiveTab('illness')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
              activeTab === 'illness'
                ? 'border-[#2F95F8] text-[#168FF5] bg-white'
                : 'border-transparent text-[#77818D] hover:text-[#202A36]'
            }`}
          >
            <Users className="w-4 h-4 text-rose-500" />
            <span>בלת"ם מחלה והחלפות</span>
          </button>

          <button
            onClick={() => setActiveTab('shabbat')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
              activeTab === 'shabbat'
                ? 'border-[#2F95F8] text-[#168FF5] bg-white'
                : 'border-transparent text-[#77818D] hover:text-[#202A36]'
            }`}
          >
            <Sun className="w-4 h-4 text-amber-600" />
            <span>שישי / רבנות ושעון חורף</span>
          </button>

          <button
            onClick={() => setActiveTab('rewards')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
              activeTab === 'rewards'
                ? 'border-[#2F95F8] text-[#168FF5] bg-white'
                : 'border-transparent text-[#77818D] hover:text-[#202A36]'
            }`}
          >
            <Award className="w-4 h-4 text-emerald-600" />
            <span>דירוג ושוברי מתנה</span>
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-[13px] leading-relaxed">
          {/* TAB 1: HOLIDAYS & INCENTIVES */}
          {activeTab === 'holidays' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-[14px]">
                  <Gift className="w-4 h-4 text-amber-600" />
                  <span>זיהוי שבוע חג אוטומטי (ראש השנה / סוכות)</span>
                </div>
                <p className="text-amber-800 text-[12.5px] mt-1.5">
                  הסוכן מושך נתוני חופשות וחגים ומזהה מראש שבוע מאתגר עם ביקוש שיא בקפה.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#E1E5E9] shadow-xs space-y-3">
                <div className="text-[13px] font-bold text-[#202A36]">
                  הודעת התראה וגיוס זמינות שנשלחת לעובדים:
                </div>
                <div className="p-3.5 rounded-lg bg-[#FAFBFD] border border-[#BAE0FD] text-[#202A36] font-medium leading-relaxed">
                  "שימו לב 🌸 נצטרך את עזרתכם השבוע עם זמינות גבוהה יותר שלכם בשל החג. לא בטוח שנשבץ אתכם, אבל במידה וכן – <strong className="text-[#168FF5]">תקבלו שובר מתנה שווה (ארוחת בוקר זוגית / בונוס חג)!</strong>"
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#E1E5E9]">
                  <span className="text-[12px] text-[#77818D]">
                    ההודעה מוצגת ישירות במסך הזמינות באפליקציית העובד.
                  </span>
                  <button
                    id="liron-send-holiday-btn"
                    onClick={handleSendHolidayIncentive}
                    disabled={holidayIncentiveSent}
                    className={`px-4 py-2 rounded-xl font-bold text-[13px] flex items-center gap-2 transition-all cursor-pointer ${
                      holidayIncentiveSent
                        ? 'bg-[#E8F8F0] text-[#37B77D] border border-[#BDEBD3]'
                        : 'bg-[#2F95F8] hover:bg-[#168FF5] text-white shadow-xs'
                    }`}
                  >
                    {holidayIncentiveSent ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>התראה נשלחה בהצלחה!</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>שגר התראת חג לצוות</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: NEGOTIATION ON 08:00 OPENING */}
          {activeTab === 'negotiation' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-xl bg-[#FFF8E6] border border-[#FFE08A]">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-[14px]">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>אתגר שטח: אף אחד לא הגיש פתיחה ב-08:00 (כולם ב-09:00)</span>
                </div>
                <p className="text-amber-800 text-[12.5px] mt-1">
                  העובדים נמנעים משעת הפתיחה כדי להספיק סידורים אישיים. איך לירון פותר את זה?
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#E1E5E9] shadow-xs space-y-3">
                <div className="text-[13px] font-bold text-[#202A36]">
                  שיטת לירון: "בואי מוקדם – תלכי מוקדם"
                </div>
                <div className="p-3 rounded-lg bg-[#F6F7F8] border border-[#E1E5E9] text-[12.5px] text-[#475569] space-y-1.5">
                  <p>• <strong>הצעה לעובדת (דנה / שרון):</strong> "אין לי מי שיפתח ב-08:00. מה יש לך סידורים? החנויות לא פעילות בשעות מאוחרות. לכי אחרי המשמרת!"</p>
                  <p>• <strong>התאמת שעות:</strong> הזזה מ-09:00–16:00 ל-<strong>08:00–15:00</strong>. העובדת מספיקה לסידוריה והסניף פתוח בזמן ללא חוסר!</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#E1E5E9]">
                  <span className="text-[12px] text-[#77818D]">
                    סגירת סידור עבודה מלא ב-100% כיסוי.
                  </span>
                  <button
                    id="apply-negotiation-btn"
                    onClick={handleApplyNegotiation}
                    disabled={negotiationApplied}
                    className={`px-4 py-2 rounded-xl font-bold text-[13px] flex items-center gap-2 transition-all cursor-pointer ${
                      negotiationApplied
                        ? 'bg-[#E8F8F0] text-[#37B77D] border border-[#BDEBD3]'
                        : 'bg-[#2F95F8] hover:bg-[#168FF5] text-white shadow-xs'
                    }`}
                  >
                    {negotiationApplied ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>הפשרה הוחלה על סידור העבודה</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>החל פשרת 08:00–15:00</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ILLNESS & SWAPS */}
          {activeTab === 'illness' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
                <div className="flex items-center gap-2 text-rose-900 font-bold text-[14px]">
                  <Flame className="w-4 h-4 text-rose-600" />
                  <span>בלת"ם: "אני חולה וחייב חילוף להיום בערב!"</span>
                </div>
                <p className="text-rose-800 text-[12.5px] mt-1">
                  העובד חולה ברגע האחרון. מי פנוי ויכול להחליף?
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#E1E5E9] shadow-xs space-y-3">
                <div className="text-[13px] font-bold text-[#202A36]">
                  ניתוח זמינות מיידי של הסוכן:
                </div>
                <div className="space-y-2">
                  <div className="p-3 rounded-lg border border-[#BAE0FD] bg-[#EAF5FF] flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[#168FF5]">שרון / מיה</div>
                      <div className="text-[11.5px] text-[#77818D]">
                        סימנו זמינות פנויה למשמרת ערב. שרון ביקשה בעבר החלפה ברביעי ערב וחמישי ערב.
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded bg-white text-[#168FF5] text-[11px] font-bold border border-[#BAE0FD]">
                      זמינה להחלפה הדדית
                    </span>
                  </div>

                  <div className="p-3 rounded-lg border border-[#E1E5E9] bg-white flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[#202A36]">תום ריד</div>
                      <div className="text-[11.5px] text-[#77818D]">
                        מתחת לתקרת השעות (25 מתוך 28 שעות).
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded bg-[#F6F7F8] text-[#77818D] text-[11px] font-bold">
                      אפשרות שנייה
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#E1E5E9]">
                  <span className="text-[12px] text-[#77818D]">
                    "תתקשרו ותראו מי יכול להחליף – הנה הצעת שידוך מוכנה"
                  </span>
                  <button
                    id="find-replacement-btn"
                    onClick={handleFindReplacement}
                    disabled={replacementFound}
                    className={`px-4 py-2 rounded-xl font-bold text-[13px] flex items-center gap-2 transition-all cursor-pointer ${
                      replacementFound
                        ? 'bg-[#E8F8F0] text-[#37B77D] border border-[#BDEBD3]'
                        : 'bg-[#2F95F8] hover:bg-[#168FF5] text-white shadow-xs'
                    }`}
                  >
                    {replacementFound ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>נשלחה בקשת החלפה לשרון</span>
                      </>
                    ) : (
                      <>
                        <PhoneCall className="w-4 h-4" />
                        <span>הצע החלפה אוטומטית</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SHABBAT & RABBANUT */}
          {activeTab === 'shabbat' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-[14px]">
                  <Sun className="w-4 h-4 text-amber-700" />
                  <span>קביעת שעות שישי: הרבנות ושעון חורף/קיץ</span>
                </div>
                <p className="text-amber-800 text-[12.5px] mt-1">
                  בימי שישי הרבנות וזמני כניסת שבת קובעים מתי לסגור כדי שכל העובדים והלקוחות יספיקו להגיע הביתה בזמן.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#E1E5E9] shadow-xs space-y-3">
                <div className="text-[13px] font-bold text-[#202A36]">
                  התאמת שעות הפעילות לשעון חורף/קיץ:
                </div>
                <div className="p-3 rounded-lg bg-[#FAFBFD] border border-[#BAE0FD] text-[12.5px] text-[#202A36] space-y-1">
                  <p>• <strong>סניף ראשי (Main Café):</strong> סגירה ב-14:30 (ניקיון וסגירה עד 15:00).</p>
                  <p>• <strong>עגלת קפה (Riverside Cart):</strong> סגירה ב-15:00 בדיוק.</p>
                  <p className="text-[11.5px] text-[#77818D]">
                    הסוכן מעדכן אוטומטית את השעות בסידור העבודה כדי למנוע חריגה לקראת שבת.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#E1E5E9]">
                  <span className="text-[12px] text-[#77818D]">
                    מכבד את שומרי השבת והנחיות הכשרות.
                  </span>
                  <button
                    id="adjust-shabbat-btn"
                    onClick={handleAdjustShabbat}
                    disabled={shabbatAdjusted}
                    className={`px-4 py-2 rounded-xl font-bold text-[13px] flex items-center gap-2 transition-all cursor-pointer ${
                      shabbatAdjusted
                        ? 'bg-[#E8F8F0] text-[#37B77D] border border-[#BDEBD3]'
                        : 'bg-[#2F95F8] hover:bg-[#168FF5] text-white shadow-xs'
                    }`}
                  >
                    {shabbatAdjusted ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>שעות שישי מותאמות</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>התאם שעות לפי הרבנות (14:30)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: REWARDS & RATINGS */}
          {activeTab === 'rewards' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-[14px]">
                  <Award className="w-4 h-4 text-emerald-700" />
                  <span>"קח פתוח - תן בראש": דירוג גמישות ושוברי מתנה</span>
                </div>
                <p className="text-emerald-800 text-[12.5px] mt-1">
                  עובד שמתגמש עבור המקום ומדייק בשעון נוכחות מקבל דירוג גבוה ושוברי ארוחת בוקר זוגית בסוף חודש!
                </p>
              </div>

              <div className="space-y-2.5">
                {employees.map((emp) => (
                  <div
                    key={emp.id}
                    className="p-3.5 rounded-xl border border-[#E1E5E9] bg-white flex items-center justify-between hover:border-[#BAE0FD] transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-full text-white font-bold text-xs flex items-center justify-center shadow-xs"
                        style={{ backgroundColor: emp.avatarBg || '#2F95F8' }}
                      >
                        {emp.initials}
                      </div>
                      <div>
                        <div className="font-bold text-[#202A36] text-[13.5px]">
                          {emp.name}
                        </div>
                        <div className="text-[11px] text-[#77818D] flex items-center gap-2">
                          <span>דירוג שעון נוכחות: 98% ⭐</span>
                          <span>·</span>
                          <span className="text-[#37B77D] font-medium">מתגמש/ת בשביל המקום</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleSendReward(emp.id, emp.name)}
                      className={`px-3 py-1.5 rounded-lg text-[12px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        rewardSentEmployeeId === emp.id
                          ? 'bg-[#E8F8F0] text-[#37B77D] border border-[#BDEBD3]'
                          : 'bg-[#FAFBFD] hover:bg-[#2F95F8] text-[#168FF5] hover:text-white border border-[#BAE0FD]'
                      }`}
                    >
                      <Gift className="w-3.5 h-3.5" />
                      <span>{rewardSentEmployeeId === emp.id ? 'שובר נשלח! 🎁' : 'שלח שובר א. בוקר'}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#E1E5E9] bg-[#FAFBFD] flex items-center justify-between">
          <span className="text-[11.5px] text-[#77818D]">
            מערכת שיבוץ חכמה המשלבת למידה משטח העבודה האמיתי.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#202A36] hover:bg-[#334155] text-white font-bold text-[13px] transition-all cursor-pointer"
          >
            סגור חלון
          </button>
        </div>
      </div>
    </div>
  );
};
