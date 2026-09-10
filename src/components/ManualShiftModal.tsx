import { useEffect, useState } from "react";
import { Clock, X } from "lucide-react";
import { DAYS, EMPLOYEES, LOCATIONS, type EmpId, type Shift } from "@/data/demo";
import { Badge, Button } from "./ui-kit";

export type ManualShiftChange = {
  shiftId: string;
  time: string;
  assigned: EmpId[];
};

export default function ManualShiftModal({
  shifts,
  initialShiftId,
  onClose,
  onSave,
}: {
  shifts: Shift[];
  initialShiftId: string | null;
  onClose: () => void;
  onSave: (change: ManualShiftChange) => void;
}) {
  const firstShiftId = initialShiftId ?? shifts[0]?.id ?? "";
  const [shiftId, setShiftId] = useState(firstShiftId);
  const selected = shifts.find((shift) => shift.id === shiftId);
  const [time, setTime] = useState(selected?.time ?? "");
  const [assigned, setAssigned] = useState<EmpId[]>(selected?.assigned ?? []);

  useEffect(() => {
    if (!selected) return;
    setTime(selected.time);
    setAssigned(selected.assigned);
  }, [selected]);

  if (!selected) return null;

  const location = LOCATIONS.find((item) => item.id === selected.location);
  const toggleEmployee = (id: EmpId) => {
    setAssigned((current) =>
      current.includes(id) ? current.filter((employeeId) => employeeId !== id) : [...current, id],
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/25 p-4">
      <div className="max-h-[90vh] w-full max-w-[520px] overflow-y-auto rounded-[8px] border border-border bg-card p-5 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[18px] font-semibold">Edit shift manually</h2>
              <Badge tone="gray">Manual</Badge>
            </div>
            <p className="mt-1 text-[12.5px] text-muted-foreground">
              Changes here override the generated schedule.
            </p>
          </div>
          <Button variant="ghost" size="sm" aria-label="Close manual editor" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="mt-5 space-y-4">
          <label className="block text-[12.5px] font-semibold">
            Shift
            <select
              className="mt-1 w-full rounded-[8px] border border-border bg-card px-3 py-2.5 text-[13.5px] outline-none focus:border-ct-blue"
              value={shiftId}
              onChange={(event) => setShiftId(event.target.value)}
            >
              {shifts.map((shift) => (
                <option key={shift.id} value={shift.id}>
                  {DAYS[shift.day]?.label} · {LOCATIONS.find((item) => item.id === shift.location)?.name} · {shift.time}
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-[12.5px] font-semibold">
              Time
              <span className="mt-1 flex items-center gap-2 rounded-[8px] border border-border bg-card px-3 py-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <input
                  className="min-w-0 flex-1 bg-transparent text-[13.5px] outline-none"
                  value={time}
                  onChange={(event) => setTime(event.target.value)}
                  aria-label="Shift time"
                />
              </span>
            </label>
            <div className="text-[12.5px] font-semibold">
              Location
              <div className="mt-1 rounded-[8px] border border-border bg-ct-surface px-3 py-2.5 text-[13.5px] font-medium">
                {location?.name}
              </div>
            </div>
          </div>

          <fieldset>
            <legend className="text-[12.5px] font-semibold">Team members</legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {EMPLOYEES.map((employee) => {
                const checked = assigned.includes(employee.id);
                return (
                  <label
                    key={employee.id}
                    className="flex cursor-pointer items-start gap-2.5 rounded-[8px] border border-border px-3 py-2.5"
                  >
                    <input
                      type="checkbox"
                      className="mt-0.5 h-4 w-4 accent-ct-blue"
                      checked={checked}
                      onChange={() => toggleEmployee(employee.id)}
                    />
                    <span className="min-w-0">
                      <span className="block text-[13px] font-semibold">{employee.name}</span>
                      <span className="block truncate text-[11.5px] text-muted-foreground">
                        {employee.role} · {employee.experience}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        </div>

        <div className="mt-5 flex justify-end gap-2 border-t border-border pt-4">
          <Button variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
          <Button
            size="sm"
            disabled={!time.trim() || assigned.length === 0}
            onClick={() => onSave({ shiftId, time: time.trim(), assigned })}
          >
            Save manual change
          </Button>
        </div>
      </div>
    </div>
  );
}