import React, { useState } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Sliders,
  ChevronRight,
  UserCheck,
  ShieldCheck,
  Clock,
  MapPin,
  ArrowRight,
  Award,
} from 'lucide-react';
import { OnboardingAssignmentOption } from '../types';

interface DecisionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onViewThursdayTeam: () => void;
  onboardingChoice: OnboardingAssignmentOption;
  onSelectOnboardingChoice: (choice: OnboardingAssignmentOption) => void;
  onOpenManualEdit: () => void;
  isApproved: boolean;
  onApproveAssignment: () => void;
}

export const DecisionsDrawer: React.FC<DecisionsDrawerProps> = ({
  isOpen,
  onClose,
  onViewThursdayTeam,
  onboardingChoice,
  onSelectOnboardingChoice,
  onOpenManualEdit,
  isApproved,
  onApproveAssignment,
}) => {
  const [showAlternativeView, setShowAlternativeView] = useState(false);

  if (!isOpen) return null;

  return (
    <div
      id="key-decisions-drawer"
      className="w-96 shrink-0 bg-white border-l border-[#E1E5E9] h-full flex flex-col shadow-lg z-20 animate-in slide-in-from-right duration-200"
    >
      {/* Drawer Header */}
      <div className="p-4 border-b border-[#E1E5E9] bg-[#F6F7F8] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#FAF5FF] text-[#C253D9] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-[#C253D9]" />
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-[#202A36]">
              Why this schedule works
            </h3>
            <p className="text-[11px] text-[#77818D]">
              Explainable AI decision rationales
            </p>
          </div>
        </div>
        <button
          id="close-decisions-drawer-btn"
          onClick={onClose}
          className="p-1 rounded-md text-[#77818D] hover:text-[#202A36] hover:bg-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Human-in-the-loop reminder callout */}
      <div className="px-4 py-2.5 bg-[#EAF5FF] border-b border-[#BAE0FD] flex items-center justify-between text-[12px]">
        <span className="font-semibold text-[#168FF5] flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5" />
          AI recommends. You decide.
        </span>
        <button
          id="edit-manually-link"
          onClick={onOpenManualEdit}
          className="px-2.5 py-1 rounded-md bg-white border border-[#BAE0FD] text-[#168FF5] hover:bg-[#2F95F8] hover:text-white font-bold text-[11.5px] flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
        >
          <Sliders className="w-3 h-3 text-[#2F95F8] group-hover:text-white" />
          <span>שינוי ידני (Manual Edit)</span>
        </button>
      </div>

      {/* Drawer Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* DECISION 1: Peak-Shift Team Composition */}
        <div
          id="decision-card-peak-shift"
          className="bg-white border border-[#E1E5E9] rounded-xl p-4 shadow-xs space-y-3 transition-all hover:border-[#BAE0FD]"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#6879EA]">
                Decision 1 · Peak Composition
              </span>
              <h4 className="text-[14px] font-semibold text-[#202A36] mt-0.5">
                Thursday Evening · Main Café
              </h4>
              <p className="text-[12px] text-[#77818D]">17:00–22:00 · Peak Demand</p>
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#EAF5FF] text-[#2F95F8] border border-[#BAE0FD] shrink-0">
              High-confidence
            </span>
          </div>

          {/* Assigned Team */}
          <div className="bg-[#F6F7F8] rounded-lg p-2.5 space-y-1.5 border border-[#E1E5E9]">
            <div className="text-[11px] font-semibold text-[#77818D] uppercase tracking-wider">
              Assigned Team (3 of 3 needed)
            </div>
            <div className="flex items-center gap-2 text-[12px] text-[#202A36]">
              <span className="w-5 h-5 rounded-full bg-[#6879EA] text-white text-[10px] flex items-center justify-center font-bold">
                DL
              </span>
              <span className="font-semibold">Dana Levi</span>
              <span className="text-[#77818D]">— Shift Lead (Peak Certified)</span>
            </div>
            <div className="flex items-center gap-2 text-[12px] text-[#202A36]">
              <span className="w-5 h-5 rounded-full bg-[#37B77D] text-white text-[10px] flex items-center justify-center font-bold">
                EB
              </span>
              <span className="font-semibold">Eli Bar</span>
              <span className="text-[#77818D]">— Experienced Barista & Closer</span>
            </div>
            <div className="flex items-center gap-2 text-[12px] text-[#202A36]">
              <span className="w-5 h-5 rounded-full bg-[#9333EA] text-white text-[10px] flex items-center justify-center font-bold">
                TR
              </span>
              <span className="font-semibold">Tom Reed</span>
              <span className="text-[#77818D]">— Cashier (POS Specialist)</span>
            </div>
          </div>

          {/* Explanation Bullets */}
          <div className="space-y-1.5 text-[12px] text-[#202A36]">
            <div className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#37B77D] shrink-0 mt-0.5" />
              <span>Dana provides required shift-lead coverage.</span>
            </div>
            <div className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#37B77D] shrink-0 mt-0.5" />
              <span>Eli is qualified to close the location.</span>
            </div>
            <div className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#37B77D] shrink-0 mt-0.5" />
              <span>All assigned employees are available.</span>
            </div>
            <div className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#37B77D] shrink-0 mt-0.5" />
              <span>The team has sufficient peak-shift experience.</span>
            </div>
            <div className="flex items-start gap-1.5 text-[#77818D]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2F95F8] shrink-0 mt-0.5" />
              <span>
                Noa was not assigned because this is a peak shift and no onboarding mentor is available.
              </span>
            </div>
          </div>

          {/* Action: View Team */}
          <button
            id="view-thursday-team-btn"
            onClick={onViewThursdayTeam}
            className="w-full py-1.5 rounded-lg border border-[#E1E5E9] bg-white hover:bg-[#EAF5FF] hover:border-[#BAE0FD] text-[#2F95F8] font-medium text-[12px] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Highlight Team in Schedule</span>
          </button>
        </div>

        {/* DECISION 2: New-Employee Development */}
        <div
          id="decision-card-new-employee"
          className="bg-white border-2 border-[#37B77D]/40 rounded-xl p-4 shadow-xs space-y-3 transition-all"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#37B77D]">
                Decision 2 · Onboarding Pairing
              </span>
              <h4 className="text-[14px] font-semibold text-[#202A36] mt-0.5">
                Noa’s First Shift
              </h4>
            </div>
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-semibold shrink-0 ${
                onboardingChoice === 'recommended'
                  ? 'bg-[#E8F8F0] text-[#37B77D] border border-[#BDEBD3]'
                  : 'bg-[#FFF7ED] text-[#F3A43B] border border-[#FED7AA]'
              }`}
            >
              {onboardingChoice === 'recommended' ? 'Recommended' : 'Alternative Active'}
            </span>
          </div>

          {/* Recommended vs Alternative Views */}
          {!showAlternativeView ? (
            /* Recommended View */
            <div className="space-y-2.5">
              <div className="bg-[#F6F7F8] rounded-lg p-2.5 border border-[#E1E5E9] space-y-1">
                <div className="text-[11px] font-semibold text-[#77818D] uppercase">
                  Assignment
                </div>
                <div className="text-[13px] font-semibold text-[#202A36]">
                  Sunday, Sep 13 · 10:00–14:00 · Main Café
                </div>
                <div className="flex items-center gap-2 text-[12px] text-[#202A36] pt-1">
                  <span className="w-5 h-5 rounded-full bg-[#2F95F8] text-white text-[10px] flex items-center justify-center font-bold">
                    YC
                  </span>
                  <span>
                    Pairing: <strong>Yossi Cohen</strong> (Senior Barista & Onboarding Mentor)
                  </span>
                </div>
              </div>

              {/* Explanation Bullets */}
              <div className="space-y-1.5 text-[12px] text-[#202A36]">
                <div className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#37B77D] shrink-0 mt-0.5" />
                  <span>Noa and Yossi are both available.</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#37B77D] shrink-0 mt-0.5" />
                  <span>The shift is off-peak (Sunday mid-day).</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#37B77D] shrink-0 mt-0.5" />
                  <span>The location has enough coverage for guided learning.</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#37B77D] shrink-0 mt-0.5" />
                  <span>Yossi is mentor-eligible and familiar with the Main Café.</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#37B77D] shrink-0 mt-0.5" />
                  <span>Noa’s weekly-hour limit remains protected (4 of 20h).</span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  id="approve-assignment-btn"
                  onClick={onApproveAssignment}
                  className={`w-full py-2 rounded-lg font-medium text-[13px] flex items-center justify-center gap-1.5 transition-all ${
                    isApproved
                      ? 'bg-[#E8F8F0] text-[#37B77D] border border-[#BDEBD3]'
                      : 'bg-[#37B77D] hover:bg-[#2fa06d] text-white shadow-xs'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isApproved ? 'Assignment Approved ✓' : 'Approve Assignment'}</span>
                </button>

                <button
                  id="view-alternative-btn"
                  onClick={() => setShowAlternativeView(true)}
                  className="w-full py-1.5 rounded-lg border border-[#E1E5E9] bg-white text-[#77818D] hover:text-[#202A36] hover:bg-[#F6F7F8] font-medium text-[12px] transition-all"
                >
                  View Alternative Option
                </button>

                <button
                  id="decision-manual-edit-btn"
                  onClick={onOpenManualEdit}
                  className="w-full py-1.5 rounded-lg border border-[#BAE0FD] bg-[#EAF5FF] text-[#168FF5] hover:bg-[#2F95F8] hover:text-white font-semibold text-[12px] flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>שינוי ידני מותאם אישית (Custom Manual Edit)</span>
                </button>
              </div>
            </div>
          ) : (
            /* Alternative View */
            <div className="space-y-2.5 bg-[#FFFDF5] p-3 rounded-xl border border-[#FDE68A] animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#B45309] uppercase tracking-wider">
                  Alternative Option
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                  Valid · Less Preferred
                </span>
              </div>

              <div className="space-y-1">
                <div className="text-[13px] font-semibold text-[#202A36]">
                  Saturday, Sep 19 · 09:00–13:00 · Main Café
                </div>
                <div className="flex items-center gap-2 text-[12px] text-[#202A36]">
                  <span className="w-5 h-5 rounded-full bg-[#6879EA] text-white text-[10px] flex items-center justify-center font-bold">
                    DL
                  </span>
                  <span>
                    Pairing: <strong>Dana Levi</strong> (Senior Shift Lead)
                  </span>
                </div>
              </div>

              {/* Trade-offs */}
              <div className="space-y-1.5 text-[12px] text-[#202A36] pt-1">
                <div className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#37B77D] shrink-0 mt-0.5" />
                  <span>Both employees are available.</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#37B77D] shrink-0 mt-0.5" />
                  <span>Dana is experienced.</span>
                </div>
                <div className="flex items-start gap-1.5 text-[#B45309]">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#F3A43B] shrink-0 mt-0.5" />
                  <span>Saturday demand is higher than Sunday.</span>
                </div>
                <div className="flex items-start gap-1.5 text-[#B45309]">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#F3A43B] shrink-0 mt-0.5" />
                  <span>This option is valid, but less suitable for a first shift.</span>
                </div>
              </div>

              {/* Toggle Choices */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  id="choose-alternative-btn"
                  onClick={() => {
                    onSelectOnboardingChoice('alternative');
                  }}
                  className={`w-full py-1.5 rounded-lg font-medium text-[12px] flex items-center justify-center gap-1.5 transition-all ${
                    onboardingChoice === 'alternative'
                      ? 'bg-[#F3A43B] text-white'
                      : 'bg-white border border-[#E1E5E9] text-[#202A36] hover:bg-[#F6F7F8]'
                  }`}
                >
                  <span>
                    {onboardingChoice === 'alternative'
                      ? 'Alternative Selected ✓'
                      : 'Choose Alternative'}
                  </span>
                </button>

                <button
                  id="keep-recommended-btn"
                  onClick={() => {
                    onSelectOnboardingChoice('recommended');
                    setShowAlternativeView(false);
                  }}
                  className="w-full py-1.5 rounded-lg bg-[#2F95F8] text-white hover:bg-[#168FF5] font-medium text-[12px] transition-all"
                >
                  Keep Recommended Assignment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
