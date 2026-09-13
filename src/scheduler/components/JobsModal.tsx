import React, { useMemo, useState } from 'react';
import {
  X,
  Briefcase,
  Plus,
  Repeat,
  Clock,
  MapPin,
  Users,
  GraduationCap,
  ListChecks,
  ShieldCheck,
  Sparkles,
  Trash2,
  CalendarDays,
} from 'lucide-react';
import {
  Employee,
  JobRecord,
  JobQualificationLevel,
  DayOfWeek,
} from '../types';

interface JobsModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobs: JobRecord[];
  employees: Employee[];
  onUpdateJob: (job: JobRecord) => void;
  onCreateJob: () => string;
}

const DAY_LABELS: { day: DayOfWeek; short: string }[] = [
  { day: 'Sunday', short: 'Sun' },
  { day: 'Monday', short: 'Mon' },
  { day: 'Tuesday', short: 'Tue' },
  { day: 'Wednesday', short: 'Wed' },
  { day: 'Thursday', short: 'Thu' },
  { day: 'Friday', short: 'Fri' },
  { day: 'Saturday', short: 'Sat' },
];

const LEVELS: {
  value: JobQualificationLevel;
  label: string;
  chip: string;
}[] = [
  {
    value: 'certified_mentor',
    label: 'Certified + Mentor',
    chip: 'bg-[#E8F8F0] text-[#1F8A5B] border-[#BDEBD3]',
  },
  {
    value: 'qualified',
    label: 'Qualified',
    chip: 'bg-[#EAF5FF] text-[#168FF5] border-[#BAE0FD]',
  },
  {
    value: 'in_training',
    label: 'In Training',
    chip: 'bg-[#FFF6E5] text-[#B4741A] border-[#FBE0B0]',
  },
  {
    value: 'not_qualified',
    label: 'Not Qualified',
    chip: 'bg-[#F1F3F5] text-[#77818D] border-[#E1E5E9]',
  },
];

const levelMeta = (level: JobQualificationLevel) =>
  LEVELS.find((l) => l.value === level) ?? LEVELS[3]!;

export const JobsModal: React.FC<JobsModalProps> = ({
  isOpen,
  onClose,
  jobs,
  employees,
  onUpdateJob,
  onCreateJob,
}) => {
  const [selectedJobId, setSelectedJobId] = useState<string>(jobs[0]?.id ?? '');
  const [newTask, setNewTask] = useState('');

  const selectedJob = useMemo(
    () => jobs.find((j) => j.id === selectedJobId) ?? jobs[0],
    [jobs, selectedJobId]
  );

  if (!isOpen) return null;

  const patch = (changes: Partial<JobRecord>) => {
    if (!selectedJob) return;
    onUpdateJob({ ...selectedJob, ...changes });
  };

  const toggleDay = (day: DayOfWeek) => {
    if (!selectedJob) return;
    const days = selectedJob.recurrence.days.includes(day)
      ? selectedJob.recurrence.days.filter((d) => d !== day)
      : [...selectedJob.recurrence.days, day];
    patch({ recurrence: { ...selectedJob.recurrence, days } });
  };

  const setLevel = (employeeId: string, level: JobQualificationLevel) => {
    if (!selectedJob) return;
    patch({
      qualifications: selectedJob.qualifications.map((q) =>
        q.employeeId === employeeId
          ? {
              ...q,
              level,
              canMentor: level === 'certified_mentor' ? true : q.canMentor && level === 'qualified',
            }
          : q
      ),
    });
  };

  const toggleMentor = (employeeId: string) => {
    if (!selectedJob) return;
    patch({
      qualifications: selectedJob.qualifications.map((q) =>
        q.employeeId === employeeId ? { ...q, canMentor: !q.canMentor } : q
      ),
    });
  };

  const addTask = () => {
    if (!selectedJob || !newTask.trim()) return;
    patch({ tasks: [...selectedJob.tasks, newTask.trim()] });
    setNewTask('');
  };

  const removeTask = (index: number) => {
    if (!selectedJob) return;
    patch({ tasks: selectedJob.tasks.filter((_, i) => i !== index) });
  };

  const qualifiedCount = (job: JobRecord) =>
    job.qualifications.filter(
      (q) => q.level === 'qualified' || q.level === 'certified_mentor'
    ).length;

  const mentorCount = (job: JobRecord) =>
    job.qualifications.filter((q) => q.canMentor).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
      <div
        id="jobs-registry-modal"
        dir="rtl"
        className="w-full max-w-5xl h-[86vh] bg-white rounded-2xl shadow-xl border border-[#E1E5E9] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E1E5E9] bg-[#F6F7F8] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#EAF5FF] text-[#2F95F8] flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[#202A36]">
                Jobs Registry
              </h3>
              <p className="text-[11.5px] text-[#77818D]">
                Shifts and recurring tasks · employee qualifications and mentoring authorization
              </p>
            </div>
          </div>
          <button
            id="close-jobs-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#77818D] hover:text-[#202A36] hover:bg-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* LEFT (RTL right): Jobs list */}
          <aside className="w-[290px] shrink-0 border-l border-[#E1E5E9] bg-[#FBFCFD] flex flex-col">
            <div className="p-3 border-b border-[#E1E5E9]">
              <button
                id="create-job-btn"
                onClick={() => setSelectedJobId(onCreateJob())}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#2F95F8] hover:bg-[#168FF5] text-white text-[12.5px] font-bold transition-colors cursor-pointer shadow-2xs"
              >
                <Plus className="w-4 h-4" />
                <span>Create Job Record</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
              {jobs.map((job) => {
                const active = selectedJob?.id === job.id;
                return (
                  <button
                    key={job.id}
                    onClick={() => setSelectedJobId(job.id)}
                    className={`w-full text-right px-3 py-2.5 rounded-xl border transition-all cursor-pointer ${
                      active
                        ? 'bg-white border-[#BAE0FD] shadow-xs'
                        : 'bg-transparent border-transparent hover:bg-white hover:border-[#E1E5E9]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: job.color }}
                      />
                      <span className="text-[13px] font-semibold text-[#202A36] truncate">
                        {job.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 pr-4.5 text-[11px] text-[#77818D]">
                      <span className="inline-flex items-center gap-1">
                        <Repeat className="w-3 h-3" />
                        {job.recurrence.days.length} days
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <GraduationCap className="w-3 h-3" />
                        {qualifiedCount(job)} qualified
                      </span>
                    </div>
                    <div className="mt-1 pr-4.5">
                      <span
                        className={`inline-flex px-1.5 py-0.5 rounded-md text-[10px] font-bold border ${
                          job.kind === 'recurring_task'
                            ? 'bg-[#FFF6E5] text-[#B4741A] border-[#FBE0B0]'
                            : 'bg-[#EAF5FF] text-[#168FF5] border-[#BAE0FD]'
                        }`}
                      >
                        {job.kind === 'recurring_task'
                          ? 'Recurring Task'
                          : 'Shift Role'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* RIGHT: Job detail */}
          {selectedJob && (
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-white">
              {/* Title row */}
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <span
                    className="w-3.5 h-3.5 rounded-full mt-1.5"
                    style={{ backgroundColor: selectedJob.color }}
                  />
                  <div>
                    <input
                      value={selectedJob.name}
                      onChange={(e) => patch({ name: e.target.value })}
                      className="text-[18px] font-bold text-[#202A36] bg-transparent border-b border-transparent hover:border-[#E1E5E9] focus:border-[#2F95F8] focus:outline-none px-0.5"
                    />
                    <p className="text-[12px] text-[#77818D] mt-0.5">
                      {selectedJob.nameEn} · {selectedJob.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[11.5px]">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#F6F7F8] border border-[#E1E5E9] text-[#202A36] font-semibold">
                    <Users className="w-3.5 h-3.5 text-[#2F95F8]" />
                    {qualifiedCount(selectedJob)} qualified
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#E8F8F0] border border-[#BDEBD3] text-[#1F8A5B] font-semibold">
                    <GraduationCap className="w-3.5 h-3.5" />
                    {mentorCount(selectedJob)} mentors
                  </span>
                </div>
              </div>

              {/* Recurrence card */}
              <section className="rounded-2xl border border-[#E1E5E9] p-4 bg-[#FBFCFD]">
                <div className="flex items-center gap-2 mb-3">
                  <Repeat className="w-4 h-4 text-[#2F95F8]" />
                  <h4 className="text-[13px] font-bold text-[#202A36]">
                    Recurrence
                  </h4>
                  <span className="text-[11.5px] text-[#77818D]">
                    · {selectedJob.recurrence.frequencyLabel}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 mb-3">
                  {DAY_LABELS.map(({ day, short }) => {
                    const on = selectedJob.recurrence.days.includes(day);
                    return (
                      <button
                        key={day}
                        onClick={() => toggleDay(day)}
                        className={`w-9 h-9 rounded-xl text-[12px] font-bold border transition-all cursor-pointer ${
                          on
                            ? 'bg-[#2F95F8] text-white border-[#2F95F8] shadow-2xs'
                            : 'bg-white text-[#77818D] border-[#E1E5E9] hover:border-[#BAE0FD]'
                        }`}
                      >
                        {short}
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center gap-2 text-[12px]">
                  <label className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white border border-[#E1E5E9]">
                    <Clock className="w-3.5 h-3.5 text-[#77818D]" />
                    <input
                      value={selectedJob.recurrence.timeRange}
                      onChange={(e) =>
                        patch({
                          recurrence: {
                            ...selectedJob.recurrence,
                            timeRange: e.target.value,
                          },
                        })
                      }
                      className="w-24 bg-transparent focus:outline-none font-semibold text-[#202A36]"
                    />
                  </label>

                  <label className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white border border-[#E1E5E9]">
                    <Users className="w-3.5 h-3.5 text-[#77818D]" />
                    <span className="text-[#77818D]">Required</span>
                    <input
                      type="number"
                      min={1}
                      max={6}
                      value={selectedJob.requiredHeadcount}
                      onChange={(e) =>
                        patch({
                          requiredHeadcount: Math.max(1, Number(e.target.value) || 1),
                        })
                      }
                      className="w-10 bg-transparent focus:outline-none font-semibold text-[#202A36]"
                    />
                  </label>

                  <label className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white border border-[#E1E5E9]">
                    <MapPin className="w-3.5 h-3.5 text-[#77818D]" />
                    <select
                      value={selectedJob.location}
                      onChange={(e) => patch({ location: e.target.value })}
                      className="bg-transparent focus:outline-none font-semibold text-[#202A36] cursor-pointer"
                    >
                      <option>Main Café</option>
                      <option>Riverside Coffee Cart</option>
                      <option>All Locations</option>
                    </select>
                  </label>

                  <label className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white border border-[#E1E5E9]">
                    <CalendarDays className="w-3.5 h-3.5 text-[#77818D]" />
                    <select
                      value={selectedJob.kind}
                      onChange={(e) =>
                        patch({ kind: e.target.value as JobRecord['kind'] })
                      }
                      className="bg-transparent focus:outline-none font-semibold text-[#202A36] cursor-pointer"
                    >
                      <option value="shift_role">Shift Role</option>
                      <option value="recurring_task">Recurring Task</option>
                    </select>
                  </label>
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-3 text-[12px]">
                  <button
                    onClick={() =>
                      patch({ requiresMentorOnShift: !selectedJob.requiresMentorOnShift })
                    }
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border font-semibold transition-all cursor-pointer ${
                      selectedJob.requiresMentorOnShift
                        ? 'bg-[#E8F8F0] text-[#1F8A5B] border-[#BDEBD3]'
                        : 'bg-white text-[#77818D] border-[#E1E5E9]'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Mentor required on shift: {selectedJob.requiresMentorOnShift ? 'Yes' : 'No'}
                  </button>
                  <button
                    onClick={() =>
                      patch({ suitableForOnboarding: !selectedJob.suitableForOnboarding })
                    }
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border font-semibold transition-all cursor-pointer ${
                      selectedJob.suitableForOnboarding
                        ? 'bg-[#EAF5FF] text-[#168FF5] border-[#BAE0FD]'
                        : 'bg-white text-[#77818D] border-[#E1E5E9]'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Suitable for onboarding: {selectedJob.suitableForOnboarding ? 'Yes' : 'No'}
                  </button>
                </div>
              </section>

              {/* Tasks */}
              <section className="rounded-2xl border border-[#E1E5E9] p-4">
                <div className="flex items-center gap-2 mb-3">
                  <ListChecks className="w-4 h-4 text-[#2F95F8]" />
                  <h4 className="text-[13px] font-bold text-[#202A36]">
                    Job Tasks ({selectedJob.tasks.length})
                  </h4>
                  {selectedJob.estimatedMinutes && (
                    <span className="text-[11.5px] text-[#77818D]">
                      · Est. {selectedJob.estimatedMinutes} min
                    </span>
                  )}
                </div>

                <ul className="space-y-1.5 mb-3">
                  {selectedJob.tasks.map((task, i) => (
                    <li
                      key={`${task}-${i}`}
                      className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-[#FBFCFD] border border-[#E1E5E9] text-[12.5px] text-[#202A36]"
                    >
                      <span>{task}</span>
                      <button
                        onClick={() => removeTask(i)}
                        title="Delete task"
                        className="p-1 rounded-lg text-[#A0AEC0] hover:text-[#F34949] hover:bg-white transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </li>
                  ))}
                  {selectedJob.tasks.length === 0 && (
                    <li className="text-[12px] text-[#77818D] px-1">
                      No tasks added to this job yet.
                    </li>
                  )}
                </ul>

                <div className="flex items-center gap-2">
                  <input
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addTask()}
                    placeholder="Add a recurring task..."
                    className="flex-1 px-3 py-2 rounded-xl bg-[#F6F7F8] border border-transparent text-[12.5px] focus:bg-white focus:border-[#2F95F8] focus:outline-none"
                  />
                  <button
                    onClick={addTask}
                    className="px-3 py-2 rounded-xl bg-[#202A36] text-white text-[12.5px] font-bold hover:bg-[#334155] transition-colors cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                {selectedJob.requiredSkills.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-[#E1E5E9]">
                    <span className="text-[11.5px] text-[#77818D]">
                      Required skills:
                    </span>
                    {selectedJob.requiredSkills.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded-md bg-[#F1F3F5] border border-[#E1E5E9] text-[11px] font-semibold text-[#202A36]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </section>

              {/* Qualification matrix */}
              <section className="rounded-2xl border border-[#E1E5E9] overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 bg-[#F6F7F8] border-b border-[#E1E5E9]">
                  <GraduationCap className="w-4 h-4 text-[#2F95F8]" />
                  <h4 className="text-[13px] font-bold text-[#202A36]">
                    Employee Qualification Level
                  </h4>
                  <span className="text-[11.5px] text-[#77818D]">
                    · The agent only schedules qualified employees
                  </span>
                </div>

                <div className="divide-y divide-[#EEF1F4]">
                  {selectedJob.qualifications.map((q) => {
                    const emp = employees.find((e) => e.id === q.employeeId);
                    if (!emp) return null;
                    const meta = levelMeta(q.level);
                    return (
                      <div
                        key={q.employeeId}
                        className="flex flex-wrap items-center gap-3 px-4 py-2.5"
                      >
                        <div className="flex items-center gap-2.5 min-w-[190px]">
                          <div
                            className="w-8 h-8 rounded-full text-white flex items-center justify-center text-[11px] font-bold"
                            style={{ backgroundColor: emp.avatarBg || '#2F95F8' }}
                          >
                            {emp.initials}
                          </div>
                          <div>
                            <div className="text-[12.5px] font-semibold text-[#202A36]">
                              {emp.name}
                            </div>
                            <div className="text-[11px] text-[#77818D]">
                              {emp.role}
                            </div>
                          </div>
                        </div>

                        <span
                          className={`px-2 py-0.5 rounded-md text-[10.5px] font-bold border ${meta.chip}`}
                        >
                          {meta.label}
                        </span>

                        <select
                          value={q.level}
                          onChange={(e) =>
                            setLevel(
                              q.employeeId,
                              e.target.value as JobQualificationLevel
                            )
                          }
                          className="px-2.5 py-1.5 rounded-xl bg-white border border-[#E1E5E9] text-[12px] font-semibold text-[#202A36] focus:border-[#2F95F8] focus:outline-none cursor-pointer"
                        >
                          {LEVELS.map((l) => (
                            <option key={l.value} value={l.value}>
                              {l.label}
                            </option>
                          ))}
                        </select>

                        <button
                          onClick={() => toggleMentor(q.employeeId)}
                          disabled={q.level === 'in_training' || q.level === 'not_qualified'}
                          title="Whether this employee can mentor on this job"
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11.5px] font-bold transition-all ${
                            q.level === 'in_training' || q.level === 'not_qualified'
                              ? 'bg-[#F6F7F8] text-[#A0AEC0] border-[#E1E5E9] cursor-not-allowed'
                              : q.canMentor
                                ? 'bg-[#E8F8F0] text-[#1F8A5B] border-[#BDEBD3] cursor-pointer'
                                : 'bg-white text-[#77818D] border-[#E1E5E9] cursor-pointer hover:border-[#BAE0FD]'
                          }`}
                        >
                          <GraduationCap className="w-3.5 h-3.5" />
                          Can mentor: {q.canMentor ? 'Yes' : 'No'}
                        </button>

                        <div className="flex-1 text-[11px] text-[#77818D] text-left min-w-[120px]">
                          {q.note ? q.note : q.lastCertified ? `Certified: ${q.lastCertified}` : ''}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {selectedJob.notes && (
                <p className="text-[12px] text-[#77818D] bg-[#FBFCFD] border border-[#E1E5E9] rounded-xl px-3 py-2">
                  {selectedJob.notes}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#E1E5E9] bg-[#F6F7F8] flex items-center justify-between shrink-0">
          <span className="text-[11.5px] text-[#77818D]">
            {jobs.length} job records · Changes save instantly and are used by the agent in the next scheduling run
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#2F95F8] hover:bg-[#168FF5] text-white text-[12.5px] font-bold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
