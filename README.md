# Smart Team Builder

Build a polished, high-fidelity, interactive web prototype for a Connecteam product concept called:

Connecteam Smart Team Scheduler

Tagline:

“Build the right team for every shift.”

This prototype is for a Product Manager home assignment. It should demonstrate strong product thinking through a realistic, end-to-end workflow—not production-level engineering.

Product Concept

Shift managers do not only need to fill open shifts. They need to assign the right employees to every shift based on:

Employee availability.

Time-off requests.

Role and skills.

Experience level.

Shift-lead and opening/closing qualifications.

Work location.

Weekly hour limits.

Expected customer demand.

Team composition.

New-employee onboarding needs.

A schedule can be fully staffed and still be a poor schedule.

The Smart Team Scheduler turns these workforce constraints into an explainable weekly schedule draft while keeping the manager in control.

A newly hired employee is one important example of the scheduling complexity, but the product must optimize the full team—not only the new employee.

Target Business

Use a fictional small café business:

Business name: “Bean & Bloom”

Business characteristics:

Two locations: Main Café and Riverside Coffee Cart.

24 hourly employees.

Weekly changing schedules.

Peak demand on Thursday evening and Friday morning.

Frequent hiring and employee turnover.

Some employees are qualified as shift leads, closers, openers, or onboarding mentors.

The prototype only needs to display six representative employees.

Users

Primary user:

Alex, a café operations manager responsible for building and publishing the weekly schedule.

Secondary user:

Noa, a newly hired barista in her first week.

Core Product Question

How can Connecteam help shift managers put the right person in the right place at the right time—while building the right team around them?

Technical Instructions

Build the prototype as a responsive React application using TypeScript and Tailwind CSS.

Use:

Local mock data only.

Client-side state only.

No backend.

No authentication.

No database.

No external API calls.

No real AI integration.

Simulate AI behavior using predefined logic and timed state transitions.

The application must be fully interactive and runnable.

Prioritize UI quality, clear product storytelling, and reliable interactions.

Visual Design

Visual Design — Match the Attached Connecteam Screenshots

Recreate the visual language of the attached Connecteam web dashboard and mobile app as closely as possible.

The product should look like a natural extension of the existing Connecteam interface, not like a generic AI SaaS dashboard.

Core Color Palette

Use the following colors consistently:

Primary action blue: #2F95F8

Interactive link blue: #168FF5

Light-blue selected background: #EAF5FF

Secondary periwinkle blue: #6879EA

Primary text: #202A36

Secondary text: #77818D

Application background: #F6F7F8

Card background: #FFFFFF

Border and divider color: #E1E5E9

Success green: #37B77D

Warning orange: #F3A43B

Error and blocked-state red: #F34949

AI accent purple: #C253D9

Color Usage

Use primary blue for main actions, selected navigation items, links, active filters, and schedule highlights.

Use light blue for selected navigation backgrounds, informational cards, highlighted employees, and active states.

Use the periwinkle blue for employee avatars and secondary schedule indicators.

Use green only for valid onboarding assignments, completed states, and successful publication.

Use orange for soft-constraint warnings or assignments requiring manager review.

Use red only for hard conflicts, blocked assignments, or invalid scheduling decisions.

Use purple sparingly for AI-generated insights, sparkle icons, and the Smart Scheduler indicator.

Do not use gradients unless they are extremely subtle.

Do not use dark backgrounds.

Web Dashboard Style

Match the attached Connecteam web screenshots:

Very light gray page background.

Large white content containers with thin gray borders.

Rounded outer panels with approximately 16–20px corner radius.

Smaller controls and input fields with approximately 8–12px corner radius.

Compact top navigation with a white background and subtle bottom border.

Blue selected states with light-blue backgrounds.

Thin table and calendar dividers.

Compact employee avatars using initials or profile photos.

Spacious layout, but keep scheduling information dense enough for operational use.

Avoid oversized cards and excessive empty space.

Keep shadows very subtle; prefer borders over strong elevation.

Use pill-shaped status badges for “NEW,” “Peak,” “Draft,” “Published,” and warning states.

Mobile App Style

Match the attached Connecteam mobile screenshots:

White main background.

Clear, large page titles.

Blue active navigation icons and labels.

Dark gray inactive navigation items.

Large light-blue or pale-colored summary cards.

Rounded rectangular action buttons.

Thin light-gray section dividers.

Simple employee avatars.

Large, readable shift information.

Minimal visual clutter.

Bottom navigation should closely resemble the attached Connecteam mobile interface:

Home.

Schedule.

Chat.

Profile.

Use Connecteam blue for the active navigation item.

Use dark gray for inactive navigation items.

Do not use a floating navigation bar or a generic iOS tab design.

Typography

Use Inter, Arial, or a similar clean sans-serif font.

Typography hierarchy:

Page title: 28–32px, semibold.

Section title: 18–22px, semibold.

Card title: 15–17px, semibold.

Body text: 14–16px, regular.

Supporting text: 12–14px, regular.

Button labels: 14–16px, medium or semibold.

Table and scheduler labels: 12–14px.

Use dark navy rather than pure black.

AI Visual Treatment

The AI feature must remain visually integrated into Connecteam.

The “Generate Smart Schedule” button should use the standard Connecteam blue.

Add only a small purple sparkle icon to signal AI.

Do not create a large purple gradient button.

Do not make the product resemble a chatbot.

AI recommendations should appear in standard white Connecteam cards with a small purple icon or label.

Keep the calendar and manager workflow visually dominant.

Layout Direction

Use a left-to-right English interface.

The web admin dashboard should occupy the left 68% of the screen.

The employee mobile simulator should occupy the right 32%.

Keep alignment, spacing, icon sizes, border styles, and navigation behavior visually consistent with the attached screenshots.

Demo Flow

The prototype must include five states:

Weekly scheduling inputs.

AI analysis.

Generated schedule draft.

Manager review of scheduling decisions.

Published schedule and employee mobile update.

Add a visible “Reset Demo” action that restores the initial state.

LEFT SIDE: WEB ADMIN SCHEDULER

Top Navigation

Create a Connecteam-style top navigation bar containing:

Connecteam-style logo.

Search field.

Help icon.

Notification icon.

User avatar.

User name: Alex Morgan.

Page Header

Display:

Breadcrumb:

“Operations / Job Scheduler”

Title:

“Bean & Bloom Schedule”

Week:

“Sep 13–Sep 19, 2026”

Location filter:

“All Locations”

Schedule status:

“Draft”

Primary action:

“Generate Smart Schedule”

Use a small sparkle or AI icon, but do not make the button feel magical or disconnected from the scheduling data.

Secondary action:

“Reset Demo”

Scheduling Overview

Before generating the schedule, show a summary card titled:

“Ready to build next week’s schedule”

Include these inputs:

14 shifts need staffing.

5 availability constraints.

2 approved PTO requests.

2 peak-demand shifts.

1 new employee in onboarding.

2 business locations.

Supporting text:

“The scheduler will consider availability, skills, experience, location, weekly hours, demand, and team composition.”

Include a subtle link:

“Review scheduling rules”

When clicked, open a small modal or side panel showing:

Hard Constraints

Never schedule an unavailable employee.

Respect approved PTO.

Every shift must include required roles.

Peak shifts require a shift lead.

Closing shifts require a qualified closer.

A new employee cannot work without an experienced teammate.

Soft Preferences

Prefer off-peak shifts for first-week onboarding.

Balance weekly hours fairly.

Prefer employees familiar with the assigned location.

Avoid unnecessary overtime.

Pair a new employee with a mentor-eligible teammate when possible.

Close the panel using an X button or “Done.”

Employees

Use these representative employees:

Dana Levi

Role: Shift Lead.

Experience: Senior.

Locations: Main Café and Riverside Coffee Cart.

Skills: Peak Shift, Closing.

Weekly limit: 40 hours.

Availability: Sunday, Tuesday, Thursday, Friday.

Yossi Cohen

Role: Senior Barista.

Experience: Senior.

Locations: Main Café.

Skills: Opening, Mentor Eligible.

Weekly limit: 36 hours.

Availability: Sunday, Monday, Wednesday, Friday.

Eli Bar

Role: Barista.

Experience: Experienced.

Locations: Both locations.

Skills: Closing.

Weekly limit: 32 hours.

Availability: Monday, Tuesday, Thursday, Friday.

Maya Green

Role: Barista.

Experience: Experienced.

Locations: Riverside Coffee Cart.

Skills: Opening.

Weekly limit: 30 hours.

PTO: Tuesday.

Availability: Sunday, Wednesday, Thursday, Friday.

Tom Reed

Role: Cashier.

Experience: Intermediate.

Locations: Both locations.

Weekly limit: 28 hours.

PTO: Sunday.

Availability: Monday, Wednesday, Thursday, Saturday.

Noa Shalev

Role: Junior Barista.

Experience: New Employee — Week 1.

Locations: Main Café.

Skills: Training in Progress.

Weekly limit: 20 hours.

Availability: Sunday, Tuesday, Thursday, Saturday.

Onboarding rule: First three shifts must include an experienced teammate.

Preferred rule: First shift should not be during peak demand.

Give Noa a visible “NEW · WEEK 1” badge.

Weekly Schedule Grid

Create a weekly scheduler with:

Columns: Sunday through Saturday.

Rows grouped by location:

Main Café.

Riverside Coffee Cart.

Within each location, show Morning and Evening shifts.

Keep the grid visually clear rather than overcrowded.

In the initial state, show shift requirements without assigned employees.

Examples:

Sunday, Sep 13 — Main Café — 10:00–14:00

Off-Peak.

Needs 2 employees.

Suitable for onboarding.

Thursday, Sep 17 — Main Café — 17:00–22:00

Peak Demand.

Needs 3 employees.

Requires Shift Lead.

Requires Qualified Closer.

Friday, Sep 18 — Riverside Coffee Cart — 07:00–13:00

Peak Demand.

Needs 3 employees.

Requires Opener.

Requires Shift Lead.

Use small badges for:

Peak.

Off-Peak.

Shift Lead Required.

Closer Required.

Onboarding Suitable.

STATE 2: AI ANALYSIS

When the manager clicks “Generate Smart Schedule”:

Disable the button temporarily.

Show a polished 2-second analysis state.

Display the following messages sequentially:

“Checking employee availability and time off…”

“Matching roles, skills, and locations…”

“Balancing experience across peak shifts…”

“Finding the best onboarding shift for Noa…”

Do not use a fake conversational chatbot.

Use a progress indicator integrated into the scheduler.

STATE 3: GENERATED SCHEDULE

After the analysis, populate the weekly schedule with assigned employees.

Use:

Blue shift cards for regular scheduled shifts.

Purple badges for peak-demand shifts.

Green accent for onboarding-related assignments.

Amber warnings for decisions requiring manager attention.

Red only for unresolved hard conflicts.

Show a summary banner:

Title:

“Schedule draft ready”

Summary metrics:

14 of 14 shifts covered.

5 availability constraints respected.

2 PTO requests respected.

2 peak shifts properly staffed.

1 onboarding shift created.

0 hard conflicts.

1 decision recommended for review.

Add two actions:

Primary:

“Review Key Decisions”

Secondary:

“Publish Schedule”

The manager should be allowed to publish immediately, but the UI should encourage reviewing the important decisions first.

STATE 4: KEY SCHEDULING DECISIONS

When “Review Key Decisions” is clicked, open a right-side panel inside the web-dashboard area.

Do not cover the mobile simulator.

Panel title:

“Why this schedule works”

Display two decision cards.

Decision 1: Peak-Shift Team Composition

Title:

“Thursday Evening · Main Café”

Time:

“17:00–22:00 · Peak Demand”

Assigned team:

Dana — Shift Lead.

Eli — Experienced Barista and Qualified Closer.

Tom — Cashier.

Explanation:

“Dana provides required shift-lead coverage.”

“Eli is qualified to close the location.”

“All assigned employees are available.”

“The team has sufficient peak-shift experience.”

“Noa was not assigned because this is a peak shift and no onboarding mentor is available.”

Use a badge:

“High-confidence assignment”

Add an action:

“View Team”

When clicked, highlight Dana, Eli, and Tom in the Thursday shift on the calendar.

Decision 2: New-Employee Development

Title:

“Noa’s First Shift”

Recommended assignment:

“Sunday, Sep 13 · 10:00–14:00 · Main Café”

Assigned with:

“Yossi — Senior Barista and Onboarding Mentor”

Explanation:

“Noa and Yossi are both available.”

“The shift is off-peak.”

“The location has enough coverage for guided learning.”

“Yossi is mentor-eligible and familiar with the Main Café.”

“Noa’s weekly-hour limit remains protected.”

Use a green badge:

“Recommended onboarding assignment”

Show two actions:

Primary:

“Approve Assignment”

Secondary:

“View Alternative”

Alternative Assignment

When “View Alternative” is clicked, show:

“Saturday, Sep 19 · 09:00–13:00 · Main Café”

Assigned with:

“Dana — Senior Shift Lead”

Display the trade-off:

“Both employees are available.”

“Dana is experienced.”

“Saturday demand is higher than Sunday.”

“This option is valid, but less suitable for a first shift.”

Badge:

“Valid · Less Preferred”

Allow the manager to:

Keep Recommended Assignment.

Choose Alternative.

Whichever option is selected must update the schedule grid.

Human Control

The decision panel should clearly communicate:

“AI recommends. You decide.”

Include a small text action:

“Edit Manually”

When clicked, open a simple modal allowing the manager to select:

Shift.

Location.

Onboarding buddy.

The modal does not need drag-and-drop.

PUBLISH FLOW

When the manager clicks “Publish Schedule”:

Change the schedule status from “Draft” to “Published.”

Show a success toast:
“Schedule published. Employees have been notified.”

Animate the mobile simulator to its published state.

Disable schedule-generation actions.

Keep “Reset Demo” available.

RIGHT SIDE: EMPLOYEE MOBILE SIMULATOR

Mobile Frame

Create a realistic mobile-device frame containing:

Status bar.

App header.

Bottom navigation.

Smooth in-app transitions.

Bottom navigation:

Home.

Schedule.

Chat.

Profile.

Home should be active.

Initial Mobile State

Before publication, show:

Header:

“Good morning, Noa 👋”

Welcome card:

“Welcome to Bean & Bloom”

Text:

“We’re preparing your first-week schedule. You’ll be notified when it’s ready.”

Onboarding progress:

Profile completed.

Availability submitted.

First shift pending.

Show a progress indicator:

“2 of 3 steps complete”

Do not leave the mobile screen empty.

Published Mobile State

After the manager publishes the schedule, display a push-notification toast:

“New schedule published — your first shift is ready.”

Update the home screen with a prominent card.

Title:

“Your first shift ☕”

Show the assignment selected by the manager.

Default assignment:

Sunday, Sep 13.

10:00–14:00.

Main Café.

Off-Peak Training Shift.

If the manager selected the alternative, show the Saturday assignment instead.

Onboarding Buddy Card

Display:

“Your onboarding buddy”

Show Yossi’s avatar and:

Yossi Cohen.

Senior Barista.

Onboarding Mentor.

Text:

“Yossi will meet you at the beginning of your shift and guide you through the café setup.”

If the alternative assignment was selected, replace Yossi with Dana.

Include a button:

“Message My Buddy”

The button can open a lightweight, non-functional message preview.

First-Shift Preparation

Show a checklist:

Read the safety guidelines — checked.

Review the Main Café setup guide — unchecked.

Arrive 10 minutes early — unchecked.

Meet your buddy by the main counter — unchecked.

Include a primary button:

“I’ve Reviewed My Shift”

When clicked:

Mark the shift as acknowledged.

Show:
“You’re all set for your first shift.”

Update onboarding progress to:
“3 of 3 steps complete.”

Mobile Schedule Tab

Make the Schedule navigation item interactive.

When clicked, show Noa’s first-week schedule with:

The first shift highlighted.

Buddy name.

Location.

Training badge.

Shift time.

Allow the user to return to Home.

REQUIRED INTERACTIONS

All of these interactions must work:

“Review scheduling rules” opens and closes the rules panel.

“Generate Smart Schedule” starts the analysis state.

The weekly schedule populates after analysis.

“Review Key Decisions” opens the decision panel.

“View Team” highlights the Thursday peak-shift team.

“View Alternative” displays the alternative onboarding assignment.

The manager can choose the recommended or alternative assignment.

“Edit Manually” opens a simple editing modal.

“Approve Assignment” marks the onboarding assignment as approved.

“Publish Schedule” updates both the web and mobile states.

“Message My Buddy” opens a lightweight preview.

“I’ve Reviewed My Shift” updates Noa’s onboarding progress.

The mobile Home and Schedule navigation items work.

“Reset Demo” restores the entire initial state.

IMPORTANT PRODUCT PRINCIPLES

The prototype must communicate these principles:

The system optimizes team composition, not only shift coverage.

The employee’s availability is necessary but not sufficient for assignment.

Different shifts require different combinations of skills and experience.

A new employee is one example of a complex workforce constraint.

Peak shifts should contain experienced, appropriately qualified employees.

New employees should be introduced through suitable shifts and teammates.

AI recommendations must be explainable.

The manager always retains final control.

The product connects Connecteam’s Operations and HR data.

The entire product story should be understandable in a three-minute demonstration.

FINAL QUALITY CHECK

Before completing the prototype, verify:

All buttons described above work.

Employee names and roles remain consistent.

Dates and weekdays are correct.

The selected onboarding assignment appears correctly in both web and mobile views.

No employee is scheduled while unavailable or on PTO.

The Thursday peak shift does not include Noa.

The Thursday peak shift includes a shift lead and qualified closer.

The interface contains no placeholder text.

No component overlaps or appears clipped.

The split-screen layout fits on a standard desktop display.

The prototype can be reset and demonstrated repeatedly.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/2b7cebe5-39fd-4bf6-a50d-575fed16359a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
