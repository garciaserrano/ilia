# AGENTS.md

## Project goal

Build a simple but useful gym progress tracker web application for Chorla.

The application reads workout data from a public Google Sheet stored in Google Drive and visualizes gym progress over time. The sheet is updated externally, including by voice workflows, so the app must always read the current live data from the Google Sheet. Do not require users to upload or commit a local CSV file.

## Expected working mode

You are expected to implement the whole feature, not just suggest snippets.

Before finishing:

- inspect the current repository structure
- create or update all required files
- run dependency installation when needed
- run formatting/linting/build commands when available
- fix all build errors
- update documentation
- keep the implementation simple and maintainable

## Tech stack

Use this stack unless the existing repository already strongly suggests otherwise:

- Vue 3
- TypeScript
- Vite
- Vuetify
- Chart.js or another lightweight Vue-compatible chart library
- Papa Parse, d3-dsv, or a similar lightweight CSV parser
- No backend for the first version
- No database
- No authentication

Use English for:

- code
- comments
- component names
- variable names
- commit messages
- documentation inside the repository

## Data source

The application must read data from a public Google Sheet.

Do not commit a CSV file to the repository. Do not hardcode the Google Sheet URL in the source code.

Support these environment variables:

```bash
VITE_GOOGLE_SHEET_ID=
VITE_GOOGLE_SHEET_GID=0
VITE_GOOGLE_SHEET_CSV_URL=
```

Implementation guidance:

1. Prefer `VITE_GOOGLE_SHEET_CSV_URL` when provided.
2. Otherwise build the live CSV export URL from `VITE_GOOGLE_SHEET_ID` and `VITE_GOOGLE_SHEET_GID`.
3. The app should fetch the live CSV representation of the public Google Sheet at runtime.
4. This is not a local CSV import feature. The source of truth is always the Google Sheet.
5. Show a useful error message if the sheet is not public, the URL is missing, or the network request fails.

Suggested URL pattern when building from ID and GID:

```text
https://docs.google.com/spreadsheets/d/{SHEET_ID}/gviz/tq?tqx=out:csv&gid={GID}
```

## Google Sheet schema

The app must support the current sheet format shown below.

Required columns:

- Date
- Session ID
- Exercise
- Muscle Group
- Movement Pattern
- Equipment
- Set #
- Reps
- Weight kg
- Source
- Logged At

Optional columns:

- Time
- Notes
- Pain/Discomfort

Column names may contain spaces and symbols. Normalize headers safely, but keep the original values available when needed.

Example rows:

```csv
Date,Time,Session ID,Exercise,Muscle Group,Movement Pattern,Equipment,Set #,Reps,Weight kg,Notes,Pain/Discomfort,Source,Logged At
2026-05-25,,20260525-BACK-01,Jalón al pecho,Back,Vertical Pull,Cable Machine,1,10,50,,,Voice,2026-05-28 14:55:17
2026-05-25,,20260525-BACK-01,Jalón al pecho,Back,Vertical Pull,Cable Machine,2,9,50,,,Voice,2026-05-28 14:55:18
2026-05-25,,20260525-BICEPS-01,Predicador,Biceps,Elbow Flexion,Machine,1,10,17.5,,,Voice,2026-05-28 14:55:26
```

## Domain rules

### Training session definition

A training session is all exercises performed on the same `Date`.

Do not treat each `Session ID` as a separate workout session. `Session ID` identifies a block, muscle group, or logging batch, but the app-level session is the date.

For example, if the sheet contains back, biceps and abs rows with the same `Date`, they belong to one training session.

### Set-level data

Each row represents one set.

Use these fields for calculations:

- `Date`: training session date
- `Exercise`: exercise name
- `Muscle Group`: primary muscle group
- `Movement Pattern`: movement classification
- `Equipment`: equipment used
- `Set #`: set number within the exercise/session block
- `Reps`: repetitions performed
- `Weight kg`: logged load in kg

### Volume calculation

Default volume calculation:

```text
set volume = reps * weightKg
```

Daily exercise volume:

```text
sum of all set volumes for the same Date + Exercise
```

Daily muscle group volume:

```text
sum of all set volumes for the same Date + Muscle Group
```

Do not automatically double dumbbell loads even if notes say `kg each arm`. Treat `Weight kg` as the logged value unless the app later introduces an explicit `Load Mode` column.

### Estimated one-rep max

When useful, estimate one-rep max using the Epley formula:

```text
estimated1RM = weightKg * (1 + reps / 30)
```

Use it carefully. Display it as an estimate, not as a real tested max.

## Core features

Implement the first version with these features.

### Dashboard

Show KPI cards for:

- total training sessions, based on unique dates
- total sets
- total exercises tracked
- total volume
- last workout date
- current weekly training frequency

### Filters

Add filters for:

- date range
- muscle group
- exercise
- movement pattern
- equipment

Filters should affect the charts and table.

### Main charts

Add the charts that provide the most value for tracking progress:

1. Sessions per week
   - Count unique workout dates per week.
   - This measures consistency.

2. Weekly volume by muscle group
   - Sum `reps * weightKg` grouped by week and muscle group.
   - This shows training distribution and workload.

3. Exercise weight progression
   - For a selected exercise, show the maximum logged weight per training date.
   - This is the main strength progression chart.

4. Exercise volume progression
   - For a selected exercise, show total volume per training date.
   - This helps detect progress beyond just weight.

5. Sets by muscle group
   - Sum sets by muscle group over the selected period.
   - This helps spot imbalances.

6. Movement pattern balance
   - Sum sets by movement pattern over the selected period.
   - This helps compare push/pull/core/legs/etc.

7. Estimated 1RM progression
   - Optional but recommended for exercises where it makes sense.
   - Use the best estimated 1RM per date for the selected exercise.

### Tables

Include:

- a workout log table showing all set rows
- a grouped daily session summary table
- an exercise summary table with best weight, total sets, total reps, total volume and last performed date

### Personal bests

Show simple personal best cards or highlights:

- best weight per exercise
- best estimated 1RM per exercise
- best volume day per exercise

Keep it simple. Do not over-engineer.

## UX requirements

- Dark theme by default
- Visual style inspired by Visual Studio Code dark theme
- Mobile-friendly layout
- Fast loading
- Clear empty states
- Clear error states
- Manual refresh button to reload the Google Sheet
- Display last refresh time
- Do not hide raw data from the user

## Visual design

Use a VS Code-like dark theme.

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

Use compact, clean dashboard cards. Avoid bright white backgrounds.

## Folder structure

Prefer a structure similar to this:

```text
src/
  components/
    charts/
    dashboard/
    filters/
    tables/
  composables/
  services/
    googleSheetService.ts
  types/
    workout.ts
  utils/
    dates.ts
    numbers.ts
    workoutAggregations.ts
  views/
    DashboardView.vue
  App.vue
  main.ts
```

## Implementation details

Create typed models similar to:

```ts
export interface WorkoutSet {
  date: string;
  time?: string;
  sessionId: string;
  exercise: string;
  muscleGroup: string;
  movementPattern: string;
  equipment: string;
  setNumber: number;
  reps: number;
  weightKg: number;
  notes?: string;
  painDiscomfort?: string;
  source?: string;
  loggedAt?: string;
  volume: number;
  estimatedOneRepMax?: number;
}
```

Build aggregation helpers for:

- unique training sessions by date
- weekly buckets
- total volume
- volume by muscle group
- sets by muscle group
- movement pattern distribution
- exercise progression
- personal bests

Keep parsing and aggregation logic separate from Vue components.

## Data quality

Handle these cases gracefully:

- missing optional columns
- empty notes
- empty time
- empty pain/discomfort
- decimal weights such as `17.5`
- Spanish exercise names
- duplicate rows
- invalid dates
- invalid numeric values
- Google Sheet not public
- Google Sheet URL missing
- network/CORS errors

When a row cannot be parsed, skip it and collect a warning. Show a small warning panel if rows were skipped.

## README requirements

The README must include:

- project description
- setup instructions
- environment variable instructions
- how to connect the Google Sheet
- expected sheet columns
- development commands
- build commands
- explanation of the session definition: all rows with the same Date are one training session
- privacy warning about public Google Sheets

## Quality checklist before finishing

Before considering the task complete:

- run `npm install` if dependencies are missing
- run `npm run build`
- fix all TypeScript/build errors
- check that the README matches the real implementation
- ensure `.env` is ignored by git
- ensure `.env.example` exists
- ensure no Google Sheet URL or personal data is hardcoded
