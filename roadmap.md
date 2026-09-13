# Roadmap

- [x] Port the AI Studio prototype from GitHub repo `danaraz1512/gemini-connecteam-task` into this project (manager scheduler + live mobile simulator under `src/scheduler/`).
- [x] Pull the latest pushed version (onboarding plan, Liron assistant, consolidated smart banner, new mobile app).
- [ ] Continue feature work on the ported version (next asks from the user).
- [x] Jobs registry: recurring shift roles + recurring tasks, task checklists, required skills, per-employee qualification level and can-mentor flag (src/scheduler/components/JobsModal.tsx, src/scheduler/data/jobsData.ts).
- [ ] Phase 2: business outcome signals on the roster (cups/hour, avg tips per shift) — removed from the roster card for now (src/scheduler/components/EmployeeRosterBar.tsx), data fields (`cupsPerHour`, `avgTipsPerShift`) left in place for later.
- [x] Translated all remaining Hebrew UI copy to English across the app for full LTR consistency (canvas.json/README design language is English-first).
