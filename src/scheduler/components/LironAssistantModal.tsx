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
    onTriggerToast('Holiday availability alert and gift vouchers sent to all 6 employees in the app!');
  };

  const handleApplyNegotiation = () => {
    setNegotiationApplied(true);
    if (onApplyNegotiatedShift) onApplyNegotiatedShift();
    onTriggerToast('Compromise approved: Dana will open at 08:00 and leave early at 15:00 for her errands!');
  };

  const handleFindReplacement = () => {
    setReplacementFound(true);
    onTriggerToast('Replacement found: Noa and Tom have been updated and the swap was approved automatically!');
  };

  const handleAdjustShabbat = () => {
    setShabbatAdjusted(true);
    onTriggerToast('Friday hours updated to close at 14:30 per rabbinate guidelines and Shabbat start time.');
  };

  const handleSendReward = (empId: string, empName: string) => {
    setRewardSentEmployeeId(empId);
    onTriggerToast(`A breakfast-for-two voucher was sent to ${empName} in recognition of flexibility and a high rating! 🎁`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#E1E5E9] w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden text-left" dir="ltr">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E1E5E9] flex items-center justify-between bg-gradient-to-l from-[#FAFBFD] to-[#F1F6FD]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2F95F8] text-white flex items-center justify-center shadow-sm">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[17px] font-bold text-[#202A36]">
                  Liron's Smart Assistant — Floor Management, Holidays & Surprises
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF5FF] text-[#168FF5] border border-[#BAE0FD]">
                  AI Shift Manager
                </span>
              </div>
              <p className="text-[12px] text-[#77818D]">
                Inspired by the floor: closing opening-shift gaps, holiday incentives, rabbinate hours, and instant sick-day swaps
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
            <span>Holiday Week & Incentives</span>
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
            <span>Opening Shift Negotiation (08:00)</span>
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
            <span>Sick-Day Surprises & Swaps</span>
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
            <span>Friday / Rabbinate Hours & Daylight Saving</span>
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
            <span>Ratings & Gift Vouchers</span>
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
                  <span>Automatic Holiday Week Detection (Rosh Hashanah / Sukkot)</span>
                </div>
                <p className="text-amber-800 text-[12.5px] mt-1.5">
                  The assistant pulls vacation and holiday data and flags a challenging week ahead of time, with peak demand expected at the café.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#E1E5E9] shadow-xs space-y-3">
                <div className="text-[13px] font-bold text-[#202A36]">
                  Alert message and availability request sent to employees:
                </div>
                <div className="p-3.5 rounded-lg bg-[#FAFBFD] border border-[#BAE0FD] text-[#202A36] font-medium leading-relaxed">
                  "Heads up 🌸 We'll need extra availability from you this week because of the holiday. We can't guarantee you'll be scheduled, but if you are — <strong className="text-[#168FF5]">you'll get a gift voucher (breakfast for two / holiday bonus)!</strong>"
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#E1E5E9]">
                  <span className="text-[12px] text-[#77818D]">
                    The message appears directly on the employee's availability screen in the app.
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
                        <span>Alert sent successfully!</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Holiday Alert to Team</span>
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
                  <span>Floor Challenge: nobody submitted availability for the 08:00 opening (everyone's at 09:00)</span>
                </div>
                <p className="text-amber-800 text-[12.5px] mt-1">
                  Employees avoid the opening shift so they can take care of personal errands. How does Liron solve this?
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#E1E5E9] shadow-xs space-y-3">
                <div className="text-[13px] font-bold text-[#202A36]">
                  Liron's approach: "Come early — leave early"
                </div>
                <div className="p-3 rounded-lg bg-[#F6F7F8] border border-[#E1E5E9] text-[12.5px] text-[#475569] space-y-1.5">
                  <p>• <strong>Offer to the employee (Dana / Noa):</strong> "I don't have anyone to open at 08:00. What errands do you have? Most places aren't open late anyway. Head out right after your shift!"</p>
                  <p>• <strong>Adjusted hours:</strong> Shifted from 09:00–16:00 to <strong>08:00–15:00</strong>. The employee has time for her errands and the branch opens on time with no coverage gap!</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#E1E5E9]">
                  <span className="text-[12px] text-[#77818D]">
                    Closes out a full schedule with 100% coverage.
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
                        <span>Compromise applied to the schedule</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Apply 08:00–15:00 Compromise</span>
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
                  <span>Surprise: "I'm sick and need a swap for tonight!"</span>
                </div>
                <p className="text-rose-800 text-[12.5px] mt-1">
                  The employee is sick at the last minute. Who's available to cover?
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#E1E5E9] shadow-xs space-y-3">
                <div className="text-[13px] font-bold text-[#202A36]">
                  The assistant's instant availability check:
                </div>
                <div className="space-y-2">
                  <div className="p-3 rounded-lg border border-[#BAE0FD] bg-[#EAF5FF] flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[#168FF5]">Noa / Maya</div>
                      <div className="text-[11.5px] text-[#77818D]">
                        Marked as available for the evening shift. Noa has previously requested swaps for Wednesday and Thursday evenings.
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded bg-white text-[#168FF5] text-[11px] font-bold border border-[#BAE0FD]">
                      Available for a mutual swap
                    </span>
                  </div>

                  <div className="p-3 rounded-lg border border-[#E1E5E9] bg-white flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[#202A36]">Tom Reed</div>
                      <div className="text-[11.5px] text-[#77818D]">
                        Below the hours cap (25 out of 28 hours).
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded bg-[#F6F7F8] text-[#77818D] text-[11px] font-bold">
                      Second option
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#E1E5E9]">
                  <span className="text-[12px] text-[#77818D]">
                    "Give them a call and see who can cover — here's a ready-made match"
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
                        <span>Swap request sent to Noa</span>
                      </>
                    ) : (
                      <>
                        <PhoneCall className="w-4 h-4" />
                        <span>Suggest Automatic Swap</span>
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
                  <span>Setting Friday Hours: Rabbinate Guidelines & Daylight Saving</span>
                </div>
                <p className="text-amber-800 text-[12.5px] mt-1">
                  On Fridays, rabbinate guidelines and Shabbat start times determine closing time so employees and customers can get home safely on schedule.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#E1E5E9] shadow-xs space-y-3">
                <div className="text-[13px] font-bold text-[#202A36]">
                  Adjusting operating hours for daylight saving:
                </div>
                <div className="p-3 rounded-lg bg-[#FAFBFD] border border-[#BAE0FD] text-[12.5px] text-[#202A36] space-y-1">
                  <p>• <strong>Main Café:</strong> Closes at 14:30 (cleanup and close-out by 15:00).</p>
                  <p>• <strong>Riverside Coffee Cart:</strong> Closes at exactly 15:00.</p>
                  <p className="text-[11.5px] text-[#77818D]">
                    The assistant automatically updates the schedule hours to prevent running late ahead of Shabbat.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#E1E5E9]">
                  <span className="text-[12px] text-[#77818D]">
                    Respects Shabbat observance and kosher guidelines.
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
                        <span>Friday hours adjusted</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Adjust Hours per Rabbinate Guidelines (14:30)</span>
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
                  <span>"Cover a shift, get recognized": flexibility ratings and gift vouchers</span>
                </div>
                <p className="text-emerald-800 text-[12.5px] mt-1">
                  An employee who stays flexible for the business and clocks in accurately earns a high rating and a breakfast-for-two voucher at the end of the month!
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
                          <span>Clock-in accuracy: 98% ⭐</span>
                          <span>·</span>
                          <span className="text-[#37B77D] font-medium">Flexible for the team</span>
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
                      <span>{rewardSentEmployeeId === emp.id ? 'Voucher sent! 🎁' : 'Send Breakfast Voucher'}</span>
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
            A smart scheduling system that learns from what actually happens on the floor.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#202A36] hover:bg-[#334155] text-white font-bold text-[13px] transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
