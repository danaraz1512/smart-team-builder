# Smart Team Scheduler — add employee editing + cleaner manager dashboard

The prototype works end-to-end, but two things are missing vs. what you asked for:

1. **The manager cannot add or edit employee information** — right now employees are read-only display cards. You want the manager to create and edit employees (name, role, experience, locations, skills, weekly hour limit, availability days, PTO, new-employee/mentor flags).
2. **The manager dashboard doesn't match the clean reference you shared** — it's busier than the reference (six input cards, a color-key bar, Morning/Evening rows, a location dropdown) instead of the reference's compact summary, Focus/Detailed toggle, location tabs, and expandable team profiles row.

This plan adds employee editing and realigns the manager screen to the reference look. All existing scheduling workflows (generate, analysis, decisions, alternative onboarding, approve, manual shift edit, publish, Noa's phone, reset) keep working.

## What changes

### A. Manager can add & edit employees
- New component `EmployeeEditor.tsx` — a modal form to add or edit one employee with fields: name, role, experience, locations (multi), skills (multi/chips), weekly hour limit, available days (toggle Sun–Sat), PTO days (toggle), "new employee" and "mentor eligible" toggles.
- Validation inside the form: required name/role; weekly limit is a number; availability at least one day. Saving always lets the manager proceed (manual override), but shows inline warnings (e.g. "No availability selected").
- `src/routes/index.tsx` gets an editable `employees` state (seeded from `EMPLOYEES`), with `addEmployee` and `updateEmployee` handlers. `EmployeeRail`, `ScheduleGrid` avatars, `DecisionPanel`, and `MobileSim` already read from `byId`/`EMPLOYEES` — they'll switch to read from the live employees list so new/edited people appear everywhere.
- Reset clears custom employees and restores defaults.
- New employees get auto-generated initials/short name and a fresh avatar color.

### B. Cleaner manager dashboard (match the reference)
- **Compact summary**: replace the six separate input cards with one tidy "Ready to build next week's schedule" card that lists the inputs as a single inline row of small chips, plus the "Review scheduling rules" link.
- **Focus / Detailed toggle**: add two buttons at the top of the content area — "Focus" (default) shows the schedule grid only; "Detailed" also shows the team profiles section below the grid. This is a new `view` state.
- **Location tabs**: replace the location `<select>` dropdown with three tabs — All Locations / Main Café / Riverside Cart — that filter the weekly grid.
- **Expandable team profiles**: the team section becomes a compact "Team (6)" row of avatar circles with an "Expand" toggle. Expanding reveals the editable employee cards (with an "Edit" button on each and an "Add employee" button). This is where manager employee editing lives.
- **Calmer grid**: keep the existing location-grouped weekly grid but drop the heavy "Color key" legend bar from the grid header (the small inline peak/off-peak badges already communicate status). Keep click-to-edit shifts.
- Keep the breadcrumb, Draft/Published status chip, date range chip, Reset, and Generate actions in a tidy single header row.

### C. Data wiring
- `demo.ts` stays the source of defaults. A small helper `makeEmployee(partial)` builds a full `Employee` with derived `short`/`initials`.
- `byId` becomes a function over the live list, or components receive `employees` as a prop. Prefer passing `employees` down as a prop to avoid global mutation.

## Files touched
- New: `src/components/EmployeeEditor.tsx`
- `src/components/EmployeeRail.tsx` — compact avatar row + expandable editable cards + Add/Edit buttons.
- `src/components/ScheduleGrid.tsx` — remove color-key bar; read live employees for avatars.
- `src/components/DecisionPanel.tsx`, `src/components/MobileSim.tsx` — read live employees for names/avatars.
- `src/data/demo.ts` — add `makeEmployee` helper; export a `byIdFrom(list)` accessor.
- `src/routes/index.tsx` — `employees` state, add/update handlers, `view` (focus/detailed) state, location-tab state replacing dropdown, compact summary card, header realignment, reset wiring.
- `src/styles.css` — any new tokens needed for tabs/toggle (reuse existing tokens where possible).

No backend, no database, no auth — all client state, consistent with the rest of the prototype.

## Verification
- `bunx tsgo --noEmit` passes.
- Playwright: Add a new employee via the form → it appears in the team row, in shift editor assignment dropdown, and (if assigned) in the grid. Edit an existing employee's weekly limit → reflected in EmployeeRail. Switch Focus/Detailed, switch location tabs, run the full generate→decisions→approve→publish→Noa phone→reset flow; no console errors.
