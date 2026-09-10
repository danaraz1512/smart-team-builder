# Smart Team Scheduler — Employee Work Profiles (continuation of existing project)

This is a follow-on build inside the existing project. It does NOT rebuild anything and does NOT change the current scheduler screen, layout, styling, interactions, mobile simulator, employee names, shift data, or generation flow. It adds an employee-profile experience and wires its data into the existing Smart Schedule recommendations, using local mock data and client-side state only.

Core principle to communicate: **"Availability tells the scheduler who can work. Work Profile tells it who should work."**

## New data

Extend `src/data/demo.ts` `Employee` type with profile fields (defaults taken verbatim from the spec for all six employees):

- `startDate`, `directManager` ("Alex Morgan"), `employmentType` ("Hourly"), `wageType` ("Hourly"), `overtimeEligible` (boolean)
- `experienceProfile`: "New to the role" | "Experienced, new to this business" | "Fully qualified for this role"
- `level`: "In training" | "Independent" | "Advanced"
- `readiness`: { independentWork, peakShifts, opening, closing, shiftLead, mentoring } — each with the spec's status values
- `locationFamiliarity`: Record<LocationId, "New" | "Familiar" | "Experienced" | "Not assigned">
- `onboarding`: { status, pack?, progressPct?, supportedShiftsDone?, supportedShiftsTarget?, nextReview? }
- `primaryLocation`: LocationId | "both"
- `currentScheduledHours` (derived at render from live shifts)

Add a deep copy `defaultEmployees()` so Reset can restore originals, and an `applyExperiencePreset(profile)` helper that returns the default readiness set for a chosen experience profile (per the spec's three presets).

## New components (all match existing Connecteam visual system — blue, white panels, light-gray borders, existing Card/Badge/Button, purple only as small AI accent)

1. **`EmployeeProfileDrawer.tsx`** — large right-side drawer occupying ~45–50% of the web-admin column (does NOT cover the mobile simulator, which lives in its own `<aside>`). Sections:
   - **Header**: avatar, full name, "Active" status badge, position, primary location, onboarding badge ("NEW · WEEK 1" + "Onboarding in progress" for Noa; "Onboarding completed" for others), close icon.
   - **Tabs**: Work Profile · Availability · Time Off. Blue active-tab underline.
   - **Work Profile tab** (two-column):
     - *Right summary column*: Position (editable dropdown), Employment Start Date (read-only), Direct Manager (read-only "Alex Morgan"), Primary Location (editable dropdown: Main Café / Riverside Coffee Cart / Both), Weekly Hour Limit (editable numeric).
     - *Main content column*:
       - Section 1 "Employment Details": Employment type, Wage type, Overtime eligibility, Weekly hour limit, Current scheduled hours (live).
       - Section 2 "Skills & Shift Readiness" (AI sparkle icon, purple accent, supporting text): Experience Profile preset selector (3 cards/radios) that applies default readiness + shows "Recommended readiness settings applied. You can adjust them below."; Readiness Capabilities table (Capability · Current status · Used for scheduling) with dropdown/segmented controls for Independent Work, Peak Shifts, Opening, Closing, Shift Lead, Mentoring; Location Familiarity per location; Onboarding Progress (Noa: Barista Onboarding Pack, 40%, 1/5 supported shifts, next review after 5; completed employees show "Onboarding completed").
   - **Availability tab**: read-only weekly availability summary (Available / Not available / Partial) from existing data; text "Employees manage availability from the mobile app."
   - **Time Off tab**: approved PTO, pending requests, "No upcoming requests" from existing data.
   - **Sticky footer**: "Save Work Profile" (primary) + "Cancel" (secondary) + "Unsaved changes" indicator when dirty. Save → updates local state, success toast "Work profile updated. Smart Scheduler will use these settings in future recommendations.", and if a draft/published schedule exists → mark needs-review + show scheduler banner "Employee readiness changed. Regenerate the schedule to apply the updated rules." with a "Regenerate Schedule" action (does NOT auto-regenerate). Cancel discards changes.

2. **`EmployeeListPanel.tsx`** — employee list (within web-admin): avatar, name, primary position, experience profile, peak readiness, primary location, onboarding status. Clicking a row opens `EmployeeProfileDrawer` for that employee.

## Entry points (no disruption to existing scheduler)

- **Entry Point 1**: every employee name/avatar in `ScheduleGrid` shift cards and in `EmployeeRail` becomes clickable. Hover → subtle highlight + tooltip "View work profile". Click → opens `EmployeeProfileDrawer` for that employee (in the web-admin area, not over the mobile sim).
- **Entry Point 2**: add a secondary "Employee Profiles" button (small people icon) near the existing scheduler controls (Reset / Generate). Opens `EmployeeListPanel`.

## Scheduler logic connection (the real proof)

The scheduling recommendations and decision explanations must read from the **live** employee profiles (not the static defaults), so that editing a profile and regenerating changes the agent's output:

- Make shift assignments / explanations derive readiness (`peakShifts`, `shiftLead`, `closing`, `mentoring`) and location familiarity from the live employees list. Replace the hard-coded `peakTeam`/`peakWhy`/`recWhy` strings in `DecisionPanel` with values computed from the active profiles.
- **Thursday peak shift**: require a shift lead, a qualified closer, sufficient peak-ready experience; prefer location-familiar employees. Default stays Dana (lead), Eli (closer), Tom (cashier). Noa excluded by default because peak = "Requires support" + in training + no eligible mentor on that shift. Explanation: "Noa is available, but availability alone is not sufficient. She currently requires support during peak shifts, and no eligible onboarding mentor is assigned."
- **Noa's first shift (Sunday)**: Noa + Yossi (mentor-eligible, both available, off-peak, location capacity). Explanation: "Noa was assigned to Sunday morning because the shift matches her current readiness level and includes an eligible onboarding mentor."
- **Maya**: demonstrate tenure ≠ skill. Maya (<1 yr) is Independent + Peak Ready + Experienced at Riverside, so she can be assigned to a busy Riverside shift. Add explanation on that shift: "Maya was assigned despite shorter company tenure because she is peak-ready and experienced at Riverside Coffee Cart." Never exclude by start date alone.

**The decisive test (must work end-to-end):** open Noa's profile, change Peak Shifts from "Requires support" → "Ready" (and readiness as needed), Save → banner appears → click "Regenerate Schedule" → the Thursday peak decision explanation changes to reflect that Noa is now peak-ready (she becomes a candidate for the peak shift, and the explanation says so). This proves the profile is a real input to scheduling, not decorative UI.

Implementation approach for dynamic explanations: a pure function `buildPeakDecision(employees, shifts)` and `buildOnboardingDecision(employees, choice)` in a new `src/lib/scheduling-logic.ts` that return the assigned team + explanation strings, consumed by `DecisionPanel` and the summary card. The grid's default assignments come from the same live profile data.

## Reset
Reset Demo restores original employee profiles (deep copy) AND the original schedule, clearing any profile edits and the needs-review banner.

## Files
- New: `src/components/EmployeeProfileDrawer.tsx`, `src/components/EmployeeListPanel.tsx`, `src/lib/scheduling-logic.ts`
- Modified: `src/data/demo.ts` (profile fields + defaults + preset helper + deep copy), `src/components/ScheduleGrid.tsx` (clickable employees + tooltip), `src/components/EmployeeRail.tsx` (clickable employees), `src/components/DecisionPanel.tsx` (consume computed decisions/explanations), `src/routes/index.tsx` (live `employees` state, drawer/list open state, "Employee Profiles" button, needs-review banner + Regenerate action, reset wiring), `src/components/ui-kit.tsx` (small additions if needed: tooltip, segmented control, tab underline — reuse tokens).

No backend, database, auth, or external API. No change to the mobile simulator or the overall scheduler look.

## Verification
- `bunx tsgo --noEmit` passes.
- Playwright full flow:
  1. Click an avatar in the grid → correct profile drawer opens, mobile sim still visible.
  2. "Employee Profiles" button → list → click employee → profile opens.
  3. Switch tabs (Work Profile / Availability / Time Off).
  4. Select an experience preset → readiness fields update + "Recommended settings applied" message.
  5. Edit individual readiness + location familiarity → "Unsaved changes" shows. Cancel discards. Save → toast + (if draft exists) needs-review banner with Regenerate action.
  6. **Decisive:** edit Noa → Peak Shifts "Ready" → Save → Regenerate → Thursday peak explanation changes to reflect Noa is now peak-ready.
  7. Maya shift shows the tenure-vs-skill explanation.
  8. Close drawer → scheduler unchanged. Reset → original profiles + schedule restored.
  9. No console errors.
