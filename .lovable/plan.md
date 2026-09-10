# Smart Team Scheduler — final spec pass

The prototype already covers the full brief: the split-screen layout, the five demo states, the rules panel, the schedule grid, the decision panel with the alternative assignment, manual editing, publishing, and Noa's phone. So this plan is a last alignment-and-verification pass rather than a rebuild.

## What changes

1. Business context line under the title: "2 locations · 24 hourly employees · 6 shown in this demo", so the café scale from the brief is visible.
2. Location filter becomes a real control ("All Locations / Main Café / Riverside Coffee Cart") that filters the weekly grid; it currently reads as a static label.
3. Draft summary wording tightened so the "1 decision recommended for review" line reads clearly next to the green metrics.
4. Small polish: consistent badge wording for Peak / Off-Peak / Shift Lead Required / Closer Required / Onboarding Suitable, and a check that nothing clips at 1440px.

## Verification (walked through in the browser)

- Rules panel opens and closes.
- Generate runs the four analysis messages, then fills the grid.
- Review Key Decisions opens beside the grid without covering the phone.
- View Team highlights Dana, Eli, Tom on Thursday.
- View Alternative, choosing either option, and Approve all update grid and phone.
- Edit Manually and click-to-edit a shift both save.
- Publish flips Draft to Published, fires the toast, and pushes the phone notification.
- Message My Buddy, I've Reviewed My Shift, Home/Schedule tabs, and Reset Demo all work.
- Data checks: nobody scheduled on an unavailable day or PTO day; Thursday peak has a shift lead and a closer and no Noa.

## Technical notes

Frontend only: `src/routes/index.tsx`, `ScheduleGrid.tsx`, and small edits to `demo.ts` for the location filter. No backend, no data-model rewrite, client state only.
