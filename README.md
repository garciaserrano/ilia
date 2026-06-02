# Gym Tracker - Chorla

A simple gym progress tracker that reads workout data from a public Google Sheet and visualizes progress over time.

The goal of this project is to keep Google Sheets as the source of truth while providing a cleaner dashboard with progress charts, filters and summaries.

## Main idea

The Google Sheet is updated externally, including by voice workflows. This app does not require uploading or committing a CSV file. Instead, it fetches the live CSV representation of the public Google Sheet at runtime.

## Tech stack

Recommended implementation stack:

- Vue 3
- TypeScript
- Vite
- Vuetify
- Chart.js or another lightweight chart library
- Papa Parse, d3-dsv, or a similar CSV parser

The first version should not include a backend, database or authentication.

## Google Sheet connection

The app supports two ways of connecting to the public Google Sheet.

### Option 1: direct CSV URL

Create a `.env` file:

```bash
VITE_GOOGLE_SHEET_CSV_URL="https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/gviz/tq?tqx=out:csv&gid=0"
```

### Option 2: Sheet ID and GID

Create a `.env` file:

```bash
VITE_GOOGLE_SHEET_ID="YOUR_SHEET_ID"
VITE_GOOGLE_SHEET_GID="0"
```

The app can build this runtime URL:

```text
https://docs.google.com/spreadsheets/d/{SHEET_ID}/gviz/tq?tqx=out:csv&gid={GID}
```

## Environment variables

Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

Expected variables:

```bash
VITE_GOOGLE_SHEET_ID=
VITE_GOOGLE_SHEET_GID=0
VITE_GOOGLE_SHEET_CSV_URL=
```

`VITE_GOOGLE_SHEET_CSV_URL` takes priority when provided.

Do not commit `.env` to git.

## Google Sheet requirements

The sheet must be public or available to anyone with the link.

Expected columns:

| Column | Required | Description |
| --- | --- | --- |
| Date | Yes | Training date in `YYYY-MM-DD` format |
| Time | No | Optional time of the workout or set |
| Session ID | Yes | Logging batch/session identifier from the sheet |
| Exercise | Yes | Exercise name |
| Muscle Group | Yes | Main muscle group |
| Movement Pattern | Yes | Movement category, for example `Vertical Pull` |
| Equipment | Yes | Equipment used |
| Set # | Yes | Set number |
| Reps | Yes | Repetitions performed |
| Weight kg | Yes | Logged load in kg |
| Notes | No | Optional notes |
| Pain/Discomfort | No | Optional discomfort notes |
| Source | Yes | Source of the log, for example `Voice` |
| Logged At | Yes | Timestamp when the row was logged |

Example:

```csv
Date,Time,Session ID,Exercise,Muscle Group,Movement Pattern,Equipment,Set #,Reps,Weight kg,Notes,Pain/Discomfort,Source,Logged At
2026-05-25,,20260525-BACK-01,Jalón al pecho,Back,Vertical Pull,Cable Machine,1,10,50,,,Voice,2026-05-28 14:55:17
2026-05-25,,20260525-BACK-01,Jalón al pecho,Back,Vertical Pull,Cable Machine,2,9,50,,,Voice,2026-05-28 14:55:18
2026-05-25,,20260525-BICEPS-01,Predicador,Biceps,Elbow Flexion,Machine,1,10,17.5,,,Voice,2026-05-28 14:55:26
```

## Important domain rule: training sessions

A training session is defined as all rows with the same `Date`.

Do not count each `Session ID` as a different workout. For this app, if the same date contains back, biceps and abs rows, all of them are part of the same training session.

`Session ID` is still useful for grouping logged blocks, but it is not the app-level training session definition.

## Progress calculations

Default set volume:

```text
set volume = reps * weightKg
```

Daily exercise volume:

```text
sum of all set volumes for the same Date + Exercise
```

Weekly muscle group volume:

```text
sum of all set volumes for the same week + Muscle Group
```

Estimated one-rep max, when used:

```text
estimated1RM = weightKg * (1 + reps / 30)
```

Estimated 1RM must be displayed as an estimate, not as a real tested max.

For dumbbell exercises, do not automatically double the weight even if notes say `kg each arm`. Treat `Weight kg` as the logged value unless the sheet later adds an explicit load mode column.

## Recommended first version features

### Dashboard

- Total training sessions, based on unique dates
- Total sets
- Total exercises tracked
- Total volume
- Last workout date
- Current weekly training frequency

### Filters

- Date range
- Muscle group
- Exercise
- Movement pattern
- Equipment

### Charts

Recommended charts for the first version:

1. Sessions per week
   - Counts unique workout dates per week.
   - Useful for consistency tracking.

2. Weekly volume by muscle group
   - Sums `reps * weightKg` by week and muscle group.
   - Useful for workload distribution.

3. Exercise weight progression
   - Shows the maximum logged weight per date for a selected exercise.
   - Useful for strength progression.

4. Exercise volume progression
   - Shows total volume per date for a selected exercise.
   - Useful because progress is not only more weight.

5. Sets by muscle group
   - Shows total sets per muscle group in the selected period.
   - Useful for detecting imbalances.

6. Movement pattern balance
   - Shows sets by movement pattern.
   - Useful for seeing whether training is too biased toward specific patterns.

7. Estimated 1RM progression
   - Optional but recommended for exercises where it makes sense.

### Tables

- Raw workout log table
- Daily training session summary
- Exercise summary table with best weight, total sets, total reps, total volume and last performed date

### Personal bests

- Best weight per exercise
- Best estimated 1RM per exercise
- Best volume day per exercise

## Visual style

The app should use a dark theme inspired by Visual Studio Code.

Suggested colors:

```text
App background: #1e1e1e
Sidebar / app bar: #252526
Cards / surfaces: #2d2d30
Elevated surfaces: #333333
Border: #3c3c3c
Primary accent: #007acc
Secondary accent: #4fc1ff
Text: #d4d4d4
Muted text: #858585
Success: #89d185
Warning: #cca700
Error: #f48771
```

The UI should be compact, clean, responsive and readable on mobile.

## Development commands

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Suggested Codex prompt

Use this as the first task for Codex:

```text
Read AGENTS.md carefully and implement the full first version of this gym progress tracker.

Create a Vue 3 + TypeScript + Vite + Vuetify app that reads the live public Google Sheet data at runtime, parses the workout rows, applies the session definition from AGENTS.md, and builds the dashboard, filters, charts and tables described there.

Do not add a backend. Do not hardcode the sheet URL. Do not commit CSV files. Use environment variables. Use a VS Code-like dark theme. Run npm run build before finishing and fix all errors.
```

## Privacy warning

A public Google Sheet can be accessed by anyone who has the link. Do not store sensitive personal, medical, financial or private information in the sheet unless you are comfortable with that exposure.

If the data becomes sensitive later, the app should move to a private Google Sheets API integration with OAuth or a small backend service.
