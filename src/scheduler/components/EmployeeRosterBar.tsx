import React, { useState } from 'react';
import { Employee, ViewMode } from '../types';
import { Award, Clock, ShieldCheck, MapPin, Palmtree, ChevronDown, ChevronUp, Users } from 'lucide-react';

interface EmployeeRosterBarProps {
  employees: Employee[];
  viewMode: ViewMode;
}

export const EmployeeRosterBar: React.FC<EmployeeRosterBarProps> = ({ employees, viewMode }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const showDetailed = viewMode === 'detailed' || isExpanded;

  return (
    <div
      id="employee-roster-bar"
      className="bg-white border border-[#E1E5E9] rounded-2xl p-3 sm:p-4 mb-4 shadow-xs transition-all"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-[#2F95F8]" />
            <span className="text-[13px] sm:text-[14px] font-semibold text-[#202A36]">
              Team Profiles ({employees.length})
            </span>
          </div>

          {/* Quick Avatar Strip in Focus Mode */}
          <div className="hidden sm:flex items-center -space-x-1.5 overflow-hidden">
            {employees.map((emp) => (
              <div
                key={emp.id}
                title={`${emp.name} (${emp.role}) - ${emp.currentHours}/${emp.weeklyLimit}h`}
                className="w-6 h-6 rounded-full text-white flex items-center justify-center font-bold text-[10px] ring-2 ring-white cursor-pointer hover:scale-110 transition-transform"
                style={{ backgroundColor: emp.avatarBg || '#6879EA' }}
              >
                {emp.initials}
              </div>
            ))}
          </div>

          <span className="text-[11px] text-[#77818D] hidden md:inline">
            All within weekly limits · Noa paired for onboarding
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="toggle-roster-details-btn"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[12px] text-[#2F95F8] hover:text-[#168FF5] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>{showDetailed ? 'Collapse Staff' : 'Expand Staff Details'}</span>
            {showDetailed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5 text-[#2F95F8]" />}
          </button>
        </div>
      </div>

      {/* Expanded Grid */}
      {showDetailed && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2.5 mt-3 pt-3 border-t border-[#E1E5E9]/80 animate-in fade-in duration-200">
          {employees.map((emp) => (
            <div
              key={emp.id}
              className={`p-2.5 rounded-xl border transition-all ${
                emp.isNew
                  ? 'border-[#37B77D]/60 bg-[#F0FDF4]'
                  : 'border-[#E1E5E9] bg-[#F6F7F8] hover:bg-white'
              }`}
            >
              {/* Top row: Avatar + Name + New Badge */}
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-full text-white flex items-center justify-center font-bold text-[11px] shrink-0"
                  style={{ backgroundColor: emp.avatarBg || '#6879EA' }}
                >
                  {emp.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-semibold text-[#202A36] truncate leading-tight">
                    {emp.name}
                  </div>
                  <div className="text-[11px] text-[#77818D] truncate">
                    {emp.role}
                  </div>
                </div>
              </div>

              {/* Badges / Experience */}
              <div className="mt-2 flex flex-wrap gap-1 items-center">
                {emp.newBadge ? (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#37B77D] text-white">
                    {emp.newBadge}
                  </span>
                ) : (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-white text-[#77818D] border border-[#E1E5E9]">
                    {emp.experience}
                  </span>
                )}

                {emp.mentorEligible && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#EAF5FF] text-[#2F95F8] border border-[#BAE0FD]">
                    Mentor
                  </span>
                )}

                {emp.ptoDays.length > 0 && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#FFF7ED] text-[#F3A43B] border border-[#FED7AA] flex items-center gap-0.5">
                    <Palmtree className="w-2.5 h-2.5" />
                    PTO: {emp.ptoDays[0]!.slice(0, 3)}
                  </span>
                )}
              </div>

              {/* Availability & Hours */}
              <div className="mt-2 pt-1.5 border-t border-[#E1E5E9]/60 text-[11px] text-[#77818D] flex items-center justify-between">
                <span title={emp.availability.join(', ')}>
                  Avail: {emp.availability.map((d) => d.slice(0, 2)).join(', ')}
                </span>
                <span className="font-semibold text-[#202A36]">
                  {emp.currentHours}/{emp.weeklyLimit}h
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
