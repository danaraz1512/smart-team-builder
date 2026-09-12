import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle2, Loader2 } from 'lucide-react';

interface AnalysisProgressProps {
  onComplete: () => void;
}

const ANALYSIS_STEPS = [
  'Checking employee availability and time off…',
  'Matching roles, skills, and locations…',
  'Balancing experience across peak shifts…',
  'Finding the best onboarding shift for Noa…',
];

export const AnalysisProgress: React.FC<AnalysisProgressProps> = ({ onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(15);

  useEffect(() => {
    // 2-second total duration split across the 4 steps: 500ms per step
    const intervalTime = 500;
    let step = 0;

    const timer = setInterval(() => {
      step += 1;
      if (step < ANALYSIS_STEPS.length) {
        setCurrentStepIndex(step);
        setProgressPercent(Math.round(((step + 1) / ANALYSIS_STEPS.length) * 100));
      } else {
        clearInterval(timer);
        setTimeout(() => {
          onComplete();
        }, 200);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div
      id="ai-analysis-progress-card"
      className="bg-white border-2 border-[#C253D9]/30 rounded-2xl p-5 shadow-sm mb-5 animate-in fade-in slide-in-from-top-2 duration-300"
    >
      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#FAF5FF] text-[#C253D9] flex items-center justify-center">
            <Sparkles className="w-4 h-4 animate-spin text-[#C253D9]" style={{ animationDuration: '3s' }} />
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-[#202A36]">
              Connecteam Smart Scheduler Analyzing Team Constraints
            </h3>
            <p className="text-[12px] text-[#77818D]">
              Evaluating 14 shifts against 6 employee profiles, certifications, and onboarding criteria
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#FAF5FF] border border-[#F3E8FF] rounded-lg">
          <Loader2 className="w-3.5 h-3.5 text-[#C253D9] animate-spin" />
          <span className="text-[12px] font-semibold text-[#C253D9]">
            {progressPercent}% Complete
          </span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="w-full h-2 bg-[#F1F3F5] rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-[#2F95F8] to-[#C253D9] transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Sequential Steps List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
        {ANALYSIS_STEPS.map((stepText, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <div
              key={idx}
              className={`flex items-center gap-2 p-2.5 rounded-xl border text-[12px] transition-all ${
                isDone
                  ? 'bg-[#E8F8F0] border-[#BDEBD3] text-[#202A36]'
                  : isCurrent
                  ? 'bg-[#FAF5FF] border-[#E9D5FF] text-[#202A36] font-medium ring-1 ring-[#C253D9]/20'
                  : 'bg-[#F6F7F8] border-[#E1E5E9] text-[#77818D] opacity-60'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-[#37B77D] shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="w-4 h-4 text-[#C253D9] animate-spin shrink-0" />
              ) : (
                <span className="w-4 h-4 rounded-full border border-[#cbd5e1] flex items-center justify-center text-[10px] text-[#77818D] shrink-0">
                  {idx + 1}
                </span>
              )}
              <span className="truncate">{stepText}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
