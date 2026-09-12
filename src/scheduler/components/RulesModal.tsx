import React from 'react';
import { X, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
      <div
        id="scheduling-rules-modal"
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-[#E1E5E9] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E1E5E9] bg-[#F6F7F8]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#EAF5FF] text-[#2F95F8] flex items-center justify-center font-semibold text-sm">
              ⚙️
            </div>
            <div>
              <h3 className="text-[17px] font-semibold text-[#202A36]">
                Scheduling Rules & Principles
              </h3>
              <p className="text-[12px] text-[#77818D]">
                Bean & Bloom workforce constraints engine
              </p>
            </div>
          </div>
          <button
            id="close-rules-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#77818D] hover:text-[#202A36] hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Hard Constraints */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F34949]"></span>
              <h4 className="text-[14px] font-semibold uppercase tracking-wider text-[#202A36]">
                Hard Constraints (Non-negotiable)
              </h4>
            </div>
            <div className="bg-[#FFF5F5] border border-[#FED7D7] rounded-xl p-4 space-y-2.5">
              <div className="flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-[#F34949] shrink-0 mt-0.5" />
                <span className="text-[13px] text-[#202A36] leading-snug">
                  <strong>Never schedule an unavailable employee:</strong> Strict match to employee weekly availability.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-[#F34949] shrink-0 mt-0.5" />
                <span className="text-[13px] text-[#202A36] leading-snug">
                  <strong>Respect approved PTO:</strong> Employees on approved time-off (e.g. Maya on Tue, Tom on Sun) cannot be assigned.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-[#F34949] shrink-0 mt-0.5" />
                <span className="text-[13px] text-[#202A36] leading-snug">
                  <strong>Every shift must include required roles:</strong> Fill minimum headcount and core capabilities.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-[#F34949] shrink-0 mt-0.5" />
                <span className="text-[13px] text-[#202A36] leading-snug">
                  <strong>Peak shifts require a shift lead:</strong> Dana Levi or certified lead must oversee high-volume hours.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-[#F34949] shrink-0 mt-0.5" />
                <span className="text-[13px] text-[#202A36] leading-snug">
                  <strong>Closing shifts require a qualified closer:</strong> Eli Bar or Dana Levi for store security and cash reconciliation.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-[#F34949] shrink-0 mt-0.5" />
                <span className="text-[13px] text-[#202A36] leading-snug">
                  <strong>New employee safeguard:</strong> A new employee cannot work without an experienced teammate.
                </span>
              </div>
            </div>
          </div>

          {/* Soft Preferences */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2F95F8]"></span>
              <h4 className="text-[14px] font-semibold uppercase tracking-wider text-[#202A36]">
                Soft Preferences (AI Optimization)
              </h4>
            </div>
            <div className="bg-[#EAF5FF] border border-[#BAE0FD] rounded-xl p-4 space-y-2.5">
              <div className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-[#C253D9] shrink-0 mt-0.5" />
                <span className="text-[13px] text-[#202A36] leading-snug">
                  <strong>Prefer off-peak shifts for first-week onboarding:</strong> Less stress, higher learning retention.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-[#C253D9] shrink-0 mt-0.5" />
                <span className="text-[13px] text-[#202A36] leading-snug">
                  <strong>Balance weekly hours fairly:</strong> Respect contract limits (20h to 40h) without unplanned overtime.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-[#C253D9] shrink-0 mt-0.5" />
                <span className="text-[13px] text-[#202A36] leading-snug">
                  <strong>Location familiarity:</strong> Assign staff to locations where they have prior experience.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-[#C253D9] shrink-0 mt-0.5" />
                <span className="text-[13px] text-[#202A36] leading-snug">
                  <strong>Mentor pairing:</strong> Pair new employees with a designated Onboarding Mentor (Yossi Cohen).
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#F6F7F8] border-t border-[#E1E5E9] flex justify-end">
          <button
            id="done-rules-modal-btn"
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#2F95F8] hover:bg-[#168FF5] text-white font-medium text-[14px] transition-colors shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
