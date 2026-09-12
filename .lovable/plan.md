# Employee Work Profiles — build per your spec

Build the Employee Work Profiles feature inside the existing project, exactly as described in your follow-on prompt. No rebuild, no change to the existing scheduler screen, layout, styling, mobile simulator, names, shift data, or generation flow. Local mock data + client-side state only.

## What I'll build
1. **Profile data** in `demo.ts`: extend each of the 6 employees with start date, direct manager, employment details, experience profile, current level, readiness capabilities (independent work / peak / opening / closing / shift lead / mentoring), location familiarity, and onboarding progress — using the exact values from your spec.
2. **`scheduling-logic.ts`**: pure functions that compute the Thursday peak decision, Noa's onboarding decision, and the Maya tenure note from the **live** employee profiles, so editing a profile changes the agent's output.
3. **`EmployeeProfileDrawer.tsx`**: large right-side drawer in the web-admin area (~45–50% width, mobile sim stays visible). Header (avatar, name, Active badge, position, primary location, onboarding badge, close). Tabs: Work Profile / Availability / Time Off. Work Profile has the two-column layout — right summary (editable Position, start date, manager, primary location, weekly hour limit) + main (Employment Details, Skills & Shift Readiness with experience presets and editable readiness table, Location Familiarity, Onboarding Progress). Sticky footer: Save Work Profile / Cancel + "Unsaved changes" indicator.
4. **`EmployeeListPanel.tsx`**: employee list (avatar, name, position, experience, peak readiness, primary location, onboarding status) → opens a profile.
5. **Entry points**: every employee name/avatar in the grid and team section becomes clickable (hover tooltip "View work profile"); a new "Employee Profiles" button near the scheduler controls opens the list.
6. **Save behavior**: updates local state, success toast, and if a schedule already exists → "Employee readiness changed. Regenerate the schedule…" banner with a **Regenerate Schedule** action (no auto-regenerate).
7. **Scheduler connection**: decision explanations read live profiles. Default Thursday team stays Dana (lead) / Eli (closer) / Tom (cashier); Noa excluded by default with the specified explanation. Maya gets the tenure-vs-skill note on her Riverside peak shift.
8. **Reset** restores original profiles + schedule.

## The decisive test
Edit Noa → Peak Shifts "Ready" → Save → Regenerate → the Thursday peak explanation changes to reflect Noa is now peak-ready. This proves the profile is a real input to scheduling.

## Files
- New: `src/lib/scheduling-logic.ts`, `src/components/EmployeeProfileDrawer.tsx`, `src/components/EmployeeListPanel.tsx`
- Modified: `src/data/demo.ts`, `src/components/ScheduleGrid.tsx`, `src/components/EmployeeRail.tsx`, `src/components/DecisionPanel.tsx`, `src/routes/index.tsx`, `src/components/ui-kit.tsx` (minor helpers if needed)

No backend, database, auth, or external API. Existing visual system unchanged.
