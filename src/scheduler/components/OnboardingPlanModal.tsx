import React, { useState } from 'react';
import {
  X,
  GraduationCap,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  Coffee,
  RotateCcw,
  Save,
  CheckSquare,
  Users,
} from 'lucide-react';
import { OnboardingPlanConfig, OnboardingShiftStep, OnboardingChecklistItem } from '../types';
import { INITIAL_EMPLOYEES } from '../data/mockData';

interface OnboardingPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  planConfig: OnboardingPlanConfig;
  onSavePlan: (updatedPlan: OnboardingPlanConfig) => void;
}

export const OnboardingPlanModal: React.FC<OnboardingPlanModalProps> = ({
  isOpen,
  onClose,
  planConfig,
  onSavePlan,
}) => {
  const [activeTab, setActiveTab] = useState<'shifts' | 'checklist' | 'presets'>('shifts');
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [formData, setFormData] = useState<OnboardingPlanConfig>(planConfig);
  const [newTaskInput, setNewTaskInput] = useState('');
  const [newChecklistText, setNewChecklistText] = useState('');
  const [newChecklistSubtext, setNewChecklistSubtext] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const currentStep = formData.steps[activeStepIndex] || formData.steps[0];
  const mentors = INITIAL_EMPLOYEES.filter((e) => e.mentorEligible || e.experience === 'Experienced');

  const handleAddTask = () => {
    if (!newTaskInput.trim()) return;
    const updatedSteps = [...formData.steps];
    updatedSteps[activeStepIndex] = {
      ...currentStep,
      tasks: [...currentStep.tasks, newTaskInput.trim()],
    };
    setFormData({ ...formData, steps: updatedSteps });
    setNewTaskInput('');
  };

  const handleDeleteTask = (taskIndex: number) => {
    const updatedSteps = [...formData.steps];
    updatedSteps[activeStepIndex] = {
      ...currentStep,
      tasks: currentStep.tasks.filter((_, idx) => idx !== taskIndex),
    };
    setFormData({ ...formData, steps: updatedSteps });
  };

  const handleToggleOffPeak = () => {
    const updatedSteps = [...formData.steps];
    updatedSteps[activeStepIndex] = {
      ...currentStep,
      isOffPeakRequired: !currentStep.isOffPeakRequired,
    };
    setFormData({ ...formData, steps: updatedSteps });
  };

  const handleChangeMentor = (mentorId: string) => {
    const updatedSteps = [...formData.steps];
    updatedSteps[activeStepIndex] = {
      ...currentStep,
      mentorId,
    };
    setFormData({ ...formData, steps: updatedSteps });
  };

  const handleAddChecklistItem = () => {
    if (!newChecklistText.trim()) return;
    const newItem: OnboardingChecklistItem = {
      id: `ack-${Date.now()}`,
      text: newChecklistText.trim(),
      subtext: newChecklistSubtext.trim() || 'אישור נהלי העבודה בעגלה',
      required: true,
    };
    setFormData({
      ...formData,
      acknowledgementItems: [...formData.acknowledgementItems, newItem],
    });
    setNewChecklistText('');
    setNewChecklistSubtext('');
  };

  const handleDeleteChecklistItem = (id: string) => {
    setFormData({
      ...formData,
      acknowledgementItems: formData.acknowledgementItems.filter((i) => i.id !== id),
    });
  };

  const handleApplyPreset = (presetType: 'barista' | 'service' | 'prep') => {
    if (presetType === 'barista') {
      setFormData({
        ...formData,
        steps: [
          {
            stepNumber: 1,
            title: 'משמרת ראשונה: יום ראשון (10:00–14:00)',
            timingRecommendation: 'עגלת קפה בגינה · שעות שקטות (ליווי צמוד עם יוסי)',
            isOffPeakRequired: true,
            mentorId: 'emp-yossi',
            tasks: [
              'שטיפת כלים: שטיפה וסטריליזציה של ידיות החליטה וקנקני חלב',
              'הגשת קפה: מסירת משקאות חמים ומאפים ללקוחות בחיוך',
              'פתיחת עמדה: היכרות עם סידור המקררים והמצרכים',
            ],
            restrictions: ['ללא עבודה על קופה במשמרת ראשונה', 'ללא שיבוץ בשעות עומס שיא'],
          },
          {
            stepNumber: 2,
            title: 'משמרת שנייה: יום רביעי (14:00–18:00)',
            timingRecommendation: 'עגלת קפה בגינה · שעות צהריים רגועות',
            isOffPeakRequired: true,
            mentorId: 'emp-yossi',
            tasks: [
              'הקצפת חלב: תרגול מזיגה ולאטה ארט בסיסי בליווי החונך',
              'היכרות עם קופה: הקלדת הזמנות בסיסיות במערכת ה-POS',
              'חידוש מלאי כוסות ומכסים במהלך המשמרת',
            ],
            restrictions: ['ליווי צמוד של חונך בעת הקלדה בקופה'],
          },
          {
            stepNumber: 3,
            title: 'משמרת שלישית: שבוע הבא (השתלבות עצמאית מלאה)',
            timingRecommendation: 'עבודה רציפה ועצמאית לפי צרכי הסידור',
            isOffPeakRequired: false,
            mentorId: 'emp-yossi',
            tasks: [
              'ניהול קו חליטה והוצאת מנות עצמאית',
              'תפעול מלא של עמדת הקפה והקופה',
            ],
            restrictions: [],
          },
        ],
      });
    } else if (presetType === 'service') {
      setFormData({
        ...formData,
        steps: [
          {
            stepNumber: 1,
            title: 'משמרת ראשונה · היכרות תפריט והגשה',
            timingRecommendation: 'אמצע שבוע שעות בוקר שקטות',
            isOffPeakRequired: true,
            mentorId: 'emp-yossi',
            tasks: [
              'למידת תפריט המשקאות והמאפים בעל פה',
              'הגשת משקאות ופינוי שולחנות',
              'בדיקת ניקיון סביבת הלקוחות',
            ],
            restrictions: ['ללא הכנת אספרסו עצמאית'],
          },
          {
            stepNumber: 2,
            title: 'משמרת שנייה · קופה וקבלת הזמנות',
            timingRecommendation: 'אמצע שבוע שעות צהריים',
            isOffPeakRequired: true,
            mentorId: 'emp-yossi',
            tasks: ['פתיחת חשבונות ב-POS', 'סליקת אשראי ומזומן', 'מענה לשאלות לקוחות'],
            restrictions: ['חונך מלווה בקרבת הקופה'],
          },
          {
            stepNumber: 3,
            title: 'משמרת שלישית · עצמאות בשירות',
            timingRecommendation: 'סוף שבוע בהרכב מלא',
            isOffPeakRequired: false,
            mentorId: 'emp-yossi',
            tasks: ['ניהול הזמנות מהיר בעומס', 'אפסייל מאפים ומארזים'],
            restrictions: [],
          },
        ],
      });
    }
    setActiveTab('shifts');
  };

  const handleSave = () => {
    onSavePlan(formData);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-3 sm:p-4">
      <div
        id="onboarding-plan-modal"
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#CBD5E1] overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200"
        dir="rtl"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0] bg-gradient-to-l from-slate-50 to-blue-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[17px] font-bold text-[#0F172A]">
                  הגדרת תוכנית חפיפה ומשימות משמרת
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-blue-100 text-blue-700 border border-blue-200">
                  עבור: {formData.employeeName}
                </span>
              </div>
              <p className="text-[11.5px] text-[#64748B]">
                כאן בעל העסק מגדיר בדיוק מה העובד החדש יעשה בכל משמרת, ואילו סעיפים עליו לאשר במובייל
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-5 pt-3 border-b border-[#E2E8F0] bg-white text-[13px] font-bold">
          <button
            onClick={() => setActiveTab('shifts')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'shifts'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Coffee className="w-4 h-4" />
            <span>משימות משמרת לפי שלב ({formData.steps.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('checklist')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'checklist'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>צ'קליסט "סמן שקראת" לעובד ({formData.acknowledgementItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('presets')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'presets'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>תבניות מוכנות מראש</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* TAB 1: SHIFT TASKS & PROGRESSION */}
          {activeTab === 'shifts' && (
            <div className="space-y-4">
              {/* Step Selector Pills */}
              <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl">
                {formData.steps.map((step, idx) => (
                  <button
                    key={step.stepNumber}
                    onClick={() => setActiveStepIndex(idx)}
                    className={`flex-1 py-1.5 px-2.5 rounded-lg text-[12px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      activeStepIndex === idx
                        ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 text-[10px] flex items-center justify-center font-bold">
                      {step.stepNumber}
                    </span>
                    <span>{idx === 0 ? 'משמרת 1 (כלים והגשה)' : idx === 1 ? 'משמרת 2 (הקצפה וקופה)' : 'משמרת 3 (עצמאות)'}</span>
                  </button>
                ))}
              </div>

              {/* Active Step Details */}
              <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50/30 space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="text-[11.5px] font-bold text-slate-700 block mb-1">
                      כותרת השלב והשעות
                    </label>
                    <input
                      type="text"
                      value={currentStep.title}
                      onChange={(e) => {
                        const updated = [...formData.steps];
                        updated[activeStepIndex] = { ...currentStep, title: e.target.value };
                        setFormData({ ...formData, steps: updated });
                      }}
                      className="w-full sm:w-80 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-[12.5px] font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Mentor selector */}
                  <div>
                    <label className="text-[11.5px] font-bold text-slate-700 block mb-1">
                      חונך מלווה למשמרת
                    </label>
                    <select
                      value={currentStep.mentorId}
                      onChange={(e) => handleChangeMentor(e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-[12px] font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      {mentors.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} ({m.mentorEligible ? 'חונך מוסמך ⭐' : m.role})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Constraint Toggles */}
                <div className="pt-1 flex flex-wrap items-center gap-3">
                  <label
                    onClick={handleToggleOffPeak}
                    className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 text-[11.5px] font-semibold text-slate-800"
                  >
                    <input
                      type="checkbox"
                      checked={currentStep.isOffPeakRequired}
                      readOnly
                      className="rounded text-blue-600 focus:ring-0 cursor-pointer"
                    />
                    <span>שיבוץ בשעות שקטות בלבד (הגנה מפני עומס שיא)</span>
                  </label>
                </div>
              </div>

              {/* Tasks Editor (The core user question: "מי ממלא את המידע הזה ואיפה") */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[13px] font-bold text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>משימות ספציפיות שהעובד יבצע במשמרת זו (מוצג במובייל):</span>
                  </label>
                  <span className="text-[11px] text-slate-500">ניתן להוסיף, לערוך ולמחוק</span>
                </div>

                {/* Existing Tasks List */}
                <div className="space-y-2">
                  {currentStep.tasks.map((task, tIdx) => (
                    <div
                      key={tIdx}
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-blue-300 transition-all"
                    >
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] flex items-center justify-center font-bold shrink-0">
                        {tIdx + 1}
                      </span>
                      <input
                        type="text"
                        value={task}
                        onChange={(e) => {
                          const updatedTasks = [...currentStep.tasks];
                          updatedTasks[tIdx] = e.target.value;
                          const updatedSteps = [...formData.steps];
                          updatedSteps[activeStepIndex] = { ...currentStep, tasks: updatedTasks };
                          setFormData({ ...formData, steps: updatedSteps });
                        }}
                        className="flex-1 bg-transparent text-[12px] font-medium text-slate-800 focus:outline-none"
                      />
                      <button
                        onClick={() => handleDeleteTask(tIdx)}
                        className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="מחק משימה"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add New Task Input */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="הקלד משימה חדשה למשמרת (למשל: שטיפת ידיות אספרסו, מילוי חלב...)"
                    value={newTaskInput}
                    onChange={(e) => setNewTaskInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTask();
                      }
                    }}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleAddTask}
                    disabled={!newTaskInput.trim()}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-[12px] flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>הוסף משימה</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CHECKLIST "סמן שקראת" */}
          {activeTab === 'checklist' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-950 text-[12px] space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-amber-900">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>סעיפי אישור דיגיטלי במובייל ("סמן שקראת")</span>
                </div>
                <p className="text-[11px] text-amber-900/90 leading-relaxed">
                  העובד רואה את הסעיפים הללו במובייל וחייב לסמן עליהם וי לפני שהוא מתחיל את המשמרת הראשונה. באפשרותך להתאים את הסעיפים לנהלים שלך:
                </p>
              </div>

              {/* Checklist items */}
              <div className="space-y-2.5">
                {formData.acknowledgementItems.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[11px] flex items-center justify-center font-bold shrink-0">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          value={item.text}
                          onChange={(e) => {
                            const updated = [...formData.acknowledgementItems];
                            updated[idx] = { ...item, text: e.target.value };
                            setFormData({ ...formData, acknowledgementItems: updated });
                          }}
                          className="w-full bg-transparent text-[12.5px] font-bold text-slate-900 focus:outline-none focus:underline"
                        />
                      </div>
                      <button
                        onClick={() => handleDeleteChecklistItem(item.id)}
                        className="p-1 text-slate-400 hover:text-red-600 rounded-lg cursor-pointer"
                        title="מחק סעיף"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mr-7">
                      <input
                        type="text"
                        value={item.subtext}
                        placeholder="תיאור משנה או הסבר קצר..."
                        onChange={(e) => {
                          const updated = [...formData.acknowledgementItems];
                          updated[idx] = { ...item, subtext: e.target.value };
                          setFormData({ ...formData, acknowledgementItems: updated });
                        }}
                        className="w-full bg-transparent text-[11px] text-slate-500 focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Add checklist item */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-[12px] font-bold text-slate-800">הוספת סעיף אישור חדש</div>
                <input
                  type="text"
                  placeholder="כותרת הסעיף (למשל: הבנתי את נוהל סגירת קופה ונעילה...)"
                  value={newChecklistText}
                  onChange={(e) => setNewChecklistText(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="הסבר קצר נוסף (אופציונלי)..."
                  value={newChecklistSubtext}
                  onChange={(e) => setNewChecklistSubtext(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-[11px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleAddChecklistItem}
                    disabled={!newChecklistText.trim()}
                    className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-[11.5px] flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>הוסף סעיף לאישור העובד</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PRESETS */}
          {activeTab === 'presets' && (
            <div className="space-y-3">
              <div className="text-[12px] text-slate-600">
                טען תבנית מוגדרת מראש בלחיצה אחת:
              </div>

              <div
                onClick={() => handleApplyPreset('barista')}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-500 bg-white hover:bg-blue-50/40 transition-all cursor-pointer space-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-[13px] text-slate-900 flex items-center gap-1.5">
                    <Coffee className="w-4 h-4 text-amber-600" />
                    <span>בריסטה בעגלת קפה (מומלץ)</span>
                  </div>
                  <span className="text-[10.5px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                    פעיל כעת
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  משמרת 1: שטיפת כלים, הגשת קפה ופתיחה · משמרת 2: הקצפת חלב ותרגול קופה · משמרת 3: עצמאות
                </p>
              </div>

              <div
                onClick={() => handleApplyPreset('service')}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-500 bg-white hover:bg-blue-50/40 transition-all cursor-pointer space-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-[13px] text-slate-900 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span>איש שירות ומלצרות</span>
                  </div>
                  <span className="text-[10.5px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded">
                    לחץ להחלפה
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  משמרת 1: היכרות תפריט והגשה · משמרת 2: קופה וקבלת הזמנות · משמרת 3: עצמאות ואפסייל
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-[#E2E8F0] flex items-center justify-between">
          <button
            onClick={() => handleApplyPreset('barista')}
            className="text-[11.5px] font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>אפס לברירת מחדל</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 font-semibold text-[12.5px] transition-colors cursor-pointer"
            >
              ביטול
            </button>

            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-[13px] transition-all shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              {saveSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>נשמר וסונכרן למובייל!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>שמור וסנכרן למובייל ✓</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
