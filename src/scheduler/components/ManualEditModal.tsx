import React, { useState } from 'react';
import { X, UserCheck, Calendar, MapPin } from 'lucide-react';
import { Employee } from '../types';

interface ManualEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
  currentShiftId: string;
  currentBuddyId: string;
  onSave: (shiftId: string, buddyId: string) => void;
}

export const ManualEditModal: React.FC<ManualEditModalProps> = ({
  isOpen,
  onClose,
  employees,
  currentShiftId,
  currentBuddyId,
  onSave,
}) => {
  const [selectedShiftId, setSelectedShiftId] = useState(currentShiftId);
  const [selectedBuddyId, setSelectedBuddyId] = useState(currentBuddyId);

  if (!isOpen) return null;

  // Senior/experienced teammates qualified to pair with Noa
  const eligibleBuddies = employees.filter(
    (e) => !e.isNew && (e.experience === 'Senior' || e.experience === 'Experienced')
  );

  const handleSave = () => {
    onSave(selectedShiftId, selectedBuddyId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
      <div
        id="manual-edit-modal"
        className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-[#E1E5E9] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E1E5E9] bg-[#F6F7F8]">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[#2F95F8]" />
            <h3 className="text-[16px] font-semibold text-[#202A36]">
              Manual Assignment Adjustment
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#77818D] hover:text-[#202A36] hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-[13px] text-[#77818D]">
            Override AI scheduling recommendation for Noa Shalev (New Barista · Week 1).
          </p>

          {/* Location field (Locked to Main Café as per onboarding constraints) */}
          <div>
            <label className="block text-[12px] font-semibold text-[#202A36] mb-1.5 uppercase tracking-wider">
              Work Location
            </label>
            <div className="flex items-center gap-2 px-3 py-2.5 bg-[#F6F7F8] border border-[#E1E5E9] rounded-xl text-[14px] text-[#202A36]">
              <MapPin className="w-4 h-4 text-[#2F95F8]" />
              <span>Main Café (Training Authorized)</span>
            </div>
          </div>

          {/* Shift selection */}
          <div>
            <label className="block text-[12px] font-semibold text-[#202A36] mb-1.5 uppercase tracking-wider">
              Select Shift
            </label>
            <div className="space-y-2">
              <label
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedShiftId === 'shift-sun-mc-morn'
                    ? 'border-[#2F95F8] bg-[#EAF5FF]'
                    : 'border-[#E1E5E9] bg-white hover:bg-[#F6F7F8]'
                }`}
              >
                <input
                  type="radio"
                  name="shift-select"
                  checked={selectedShiftId === 'shift-sun-mc-morn'}
                  onChange={() => setSelectedShiftId('shift-sun-mc-morn')}
                  className="mt-1 text-[#2F95F8]"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-semibold text-[#202A36]">
                      Sunday, Sep 13 · 10:00–14:00
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#E8F8F0] text-[#37B77D]">
                      Off-Peak
                    </span>
                  </div>
                  <p className="text-[12px] text-[#77818D] mt-0.5">
                    Ideal first-day atmosphere with low transaction volume.
                  </p>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedShiftId === 'shift-sat-mc-morn'
                    ? 'border-[#2F95F8] bg-[#EAF5FF]'
                    : 'border-[#E1E5E9] bg-white hover:bg-[#F6F7F8]'
                }`}
              >
                <input
                  type="radio"
                  name="shift-select"
                  checked={selectedShiftId === 'shift-sat-mc-morn'}
                  onChange={() => setSelectedShiftId('shift-sat-mc-morn')}
                  className="mt-1 text-[#2F95F8]"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-semibold text-[#202A36]">
                      Saturday, Sep 19 · 09:00–13:00
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF7ED] text-[#F3A43B]">
                      Moderate Demand
                    </span>
                  </div>
                  <p className="text-[12px] text-[#77818D] mt-0.5">
                    Weekend morning pace; requires experienced shift lead lead.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Buddy selection */}
          <div>
            <label className="block text-[12px] font-semibold text-[#202A36] mb-1.5 uppercase tracking-wider">
              Onboarding Mentor / Teammate
            </label>
            <select
              value={selectedBuddyId}
              onChange={(e) => setSelectedBuddyId(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-[#E1E5E9] rounded-xl text-[14px] text-[#202A36] focus:outline-none focus:border-[#2F95F8]"
            >
              {eligibleBuddies.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} — {emp.role} ({emp.experience}) {emp.mentorEligible ? '⭐ Mentor Certified' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="px-6 py-4 bg-[#F6F7F8] border-t border-[#E1E5E9] flex justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-[#E1E5E9] bg-white text-[#202A36] text-[14px] font-medium hover:bg-[#F6F7F8]"
          >
            Cancel
          </button>
          <button
            id="save-manual-edit-btn"
            onClick={handleSave}
            className="px-5 py-2 rounded-lg bg-[#2F95F8] text-white text-[14px] font-medium hover:bg-[#168FF5] shadow-sm"
          >
            Save Assignment
          </button>
        </div>
      </div>
    </div>
  );
};
