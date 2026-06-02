# AGENTS.md

## Project name

Ilia

## Project description

Ilia is a simple personal gym progress tracker.

The app is named "Ilia" as a personal homage to Ilia Topuria and the idea of becoming strong, consistent and hard to kill in the gym.

This is a lightweight web application that reads workout data from a public Google Sheet and visualizes gym progress over time.

The app must be simple, useful and clean. Avoid overengineering.

## Main goal

Build a complete first version of the Ilia gym tracker.

The application must read workout data live from a public Google Sheet stored in Google Drive. The user updates that sheet externally, often using voice input, so the app must not require uploading CSV files manually.

The app should load the latest data from the Google Sheet every time the user opens or refreshes the web app.

## Tech stack

Use:

- Vue 3
- TypeScript
- Vite
- Vuetify
- Chart.js or another simple Vue-compatible chart library
- No backend for the first version

All code, comments, variables, components, services and documentation must be written in English.

The user may speak Spanish in prompts, but the project codebase must remain in English.

## Architecture

Keep the project simple and maintainable.

Recommended structure:

```text
src/
  assets/
  components/
  composables/
  constants/
  layouts/
  pages/
  services/
  types/
  utils/
```

Suggested responsibilities:

- `services/`: Google Sheet loading and CSV parsing.
- `types/`: TypeScript interfaces.
- `utils/`: date, number and volume calculations.
- `components/`: reusable dashboard cards, filters, charts and tables.
- `pages/`: main dashboard page.

Avoid mixing parsing/business logic directly inside Vue components.

## Google Sheet data source

The app must read from a public Google Sheet.

Do not commit CSV files.

Do not require the user to manually export CSV files.

Do not hardcode the Google Sheet URL in the source code.

Use environment variables.

Supported environment variables:

```bash
VITE_GOOGLE_SHEET_ID=
VITE_GOOGLE_SHEET_GID=0
VITE_GOOGLE_SHEET_CSV_URL=
```

The app should support both modes:

1. If `VITE_GOOGLE_SHEET_CSV_URL` is present, use it directly.
2. Otherwise, build the public CSV URL from:
   - `VITE_GOOGLE_SHEET_ID`
   - `VITE_GOOGLE_SHEET_GID`

The preferred format is a live public Google Sheet CSV URL, for example:

```text
https://docs.google.com/spreadsheets/d/{SHEET_ID}/export?format=csv&gid={GID}
```

or a published-to-web CSV URL:

```text
https://docs.google.com/spreadsheets/d/e/{PUBLISHED_ID}/pub?output=csv&gid={GID}
```

The app must show a clear error if the sheet cannot be loaded.

## Expected Google Sheet columns

The current Google Sheet has this structure:

```text
Date
Time
Session ID
Exercise
Muscle Group
Movement Pattern
Equipment
Set #
Reps
Weight kg
Notes
Pain/Discomfort
Source
Logged At
```

Example rows:

```text
2026-05-25,,20260525-BACK-01,Jalón al pecho,Back,Vertical Pull,Cable Machine,1,10,50,,,Voice,2026-05-28 14:55:17
2026-05-25,,20260525-BACK-01,Jalón al pecho,Back,Vertical Pull,Cable Machine,2,9,50,,,Voice,2026-05-28 14:55:18
2026-05-25,,20260525-BACK-01,Jalón al pecho,Back,Vertical Pull,Cable Machine,3,8,50,,,Voice,2026-05-28 14:55:19
```

The parser must support the exact column names above.

The parser should be tolerant with empty values.

The parser should trim text values.

The parser should convert numeric values safely.

The parser should ignore completely empty rows.

## Workout entry model

Create a TypeScript model similar to:

```ts
export interface WorkoutEntry {
  date: string;
  time?: string;
  sessionId?: string;
  exercise: string;
  muscleGroup: string;
  movementPattern?: string;
  equipment?: string;
  setNumber: number;
  reps: number;
  weightKg: number;
  notes?: string;
  painDiscomfort?: string;
  source?: string;
  loggedAt?: string;
}
```

## Session definition

A training session is defined by all workout entries performed on the same `Date`.

Do not count each `Session ID` as a separate workout session.

For this project:

- One date equals one gym session.
- Multiple muscle groups on the same date still count as one gym session.
- Multiple exercises on the same date still count as one gym session.
- Multiple sets on the same date still count as one gym session.

`Session ID` can be used for grouping exercises internally, but the main session count must be based on `Date`.

## Important calculation rules

### Sets

Each row represents one set.

Total sets = number of valid rows with exercise, reps and weight.

### Volume

Volume should be calculated as:

```text
volume = reps * weightKg
```

Weekly or exercise volume should sum the volume of all matching sets.

### Dumbbells and "each arm" notes

Do not automatically double the weight when the note says something like:

```text
17.5 kg each arm
8 kg each arm
```

The value in `Weight kg` should be treated as the logged weight.

If needed, add a small UI note explaining that dumbbell weights are displayed as logged.

### Estimated 1RM

Estimated 1RM is optional.

If implemented, use a simple formula such as Epley:

```text
estimated1RM = weightKg * (1 + reps / 30)
```

Only show it as an estimate, not as a strict strength metric.

## Main features

Implement a complete first version with the following features.

### 1. App shell

The app should be named:

```text
Ilia
```

Recommended subtitle:

```text
Gym Progress Tracker
```

The app should have a clean dashboard layout.

The app should be responsive and usable on desktop and mobile.

### 2. Dark theme

Use a dark theme inspired by Visual Studio Code.

The visual style should feel like:

- dark background
- slightly lighter cards
- subtle borders
- muted secondary text
- clean typography
- blue accent color
- no flashy colors
- no childish gym design

Suggested palette:

```text
Background: #1e1e1e
Surface: #252526
Surface elevated: #2d2d30
Border: #3e3e42
Primary accent: #007acc
Text primary: #d4d4d4
Text secondary: #9cdcfe
Success accent: #4ec9b0
Warning accent: #dcdcaa
Error accent: #f48771
```

Do not use a bright white background.

### 3. Dashboard summary cards

Show at least:

- Total sessions
- Total exercises
- Total sets
- Total volume
- Last workout date
- Current training streak or weeks tracked, if easy to implement

Remember:

Total sessions = number of unique `Date` values.

### 4. Filters

Add filters for:

- Date range
- Muscle group
- Exercise
- Movement pattern
- Equipment

Filters should affect charts and tables.

### 5. Charts

Add the most useful charts for gym progress.

Minimum expected charts:

#### Sessions per week

Shows how many gym sessions were completed each week.

Based on unique dates, not row count.

#### Weekly volume by muscle group

Shows total volume per week grouped by muscle group.

Useful to see training distribution.

#### Weight progression by exercise

User selects an exercise and the chart shows weight over time.

Use the best set or max logged weight per date for that exercise.

#### Volume progression by exercise

User selects an exercise and the chart shows total volume over time for that exercise.

#### Sets by muscle group

Shows how many sets were performed per muscle group in the selected period.

#### Movement pattern balance

Shows distribution by movement pattern, for example:

- Vertical Pull
- Horizontal Pull
- Vertical Push
- Elbow Flexion
- Core Flexion

Optional chart:

#### Estimated 1RM progression

Only if simple and clean.

### 6. Tables

Add a workout entries table.

The table should show:

- Date
- Exercise
- Muscle Group
- Movement Pattern
- Equipment
- Set #
- Reps
- Weight kg
- Notes
- Pain/Discomfort
- Source
- Logged At

Add sorting where easy.

Keep it readable in dark mode.

### 7. Exercise detail section

Add a simple exercise-focused section.

When the user selects one exercise, show:

- Last performed date
- Max logged weight
- Best estimated 1RM, if implemented
- Total sets
- Total volume
- Chart with weight progression
- Chart with volume progression

### 8. Loading and error states

The app must include:

- Loading state while reading the Google Sheet
- Empty state if no rows are found
- Error state if the Google Sheet URL is missing or cannot be loaded
- Parsing warning if some rows are skipped

### 9. Refresh

Add a manual refresh button.

The button should reload the data from the Google Sheet.

Suggested label:

```text
Refresh sheet
```

### 10. README

Update README with:

- Project description
- Setup steps
- Environment variables
- Google Sheet expected structure
- How sessions are calculated
- How to run locally
- How to build

## Quality requirements

Before finishing, run:

```bash
npm run build
```

Fix all build errors.

The final code should have no TypeScript errors.

Use clean, readable code.

Avoid unnecessary dependencies.

Prefer simple calculations that are easy to validate.

## Out of scope for first version

Do not add:

- Authentication
- User accounts
- Backend API
- Database
- Google OAuth
- Editing workout entries from the app
- Writing back to Google Sheets
- Complex AI analysis
- Payment features
- Social features

This first version is read-only.

The user updates the Google Sheet externally.

Ilia only reads, analyzes and visualizes the progress.

## Final response expected from Codex

When finished, summarize:

- What was implemented
- How to configure `.env`
- How to run the app
- Any assumptions made
- Any known limitations
