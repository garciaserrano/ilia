# Ilia

**Ilia** is a simple gym progress tracker that reads workout data from a public Google Sheet and visualizes progress over time.

The app is named as a personal homage to Ilia Topuria and the idea of becoming stronger through consistency.

## Goal

Ilia is designed to be a lightweight personal dashboard.

The user logs gym workouts into a Google Sheet, often using voice input from another tool. This app does not edit the sheet. It only reads the live public sheet and displays useful progress metrics, charts and tables.

## Main features

- Reads live workout data from a public Google Sheet
- No manual CSV upload required
- Dark theme inspired by Visual Studio Code
- Dashboard summary cards
- Filters by date, muscle group, exercise, movement pattern and equipment
- Sessions per week chart
- Weekly volume by muscle group chart
- Weight progression by exercise chart
- Volume progression by exercise chart
- Sets by muscle group chart
- Movement pattern balance chart
- Workout entries table
- Exercise detail section
- Manual sheet refresh button

## Tech stack

- Vue 3
- TypeScript
- Vite
- Vuetify
- Chart.js or another Vue-compatible chart library

## Google Sheet structure

The app expects a public Google Sheet with these columns:

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

Example:

```text
Date,Time,Session ID,Exercise,Muscle Group,Movement Pattern,Equipment,Set #,Reps,Weight kg,Notes,Pain/Discomfort,Source,Logged At
2026-05-25,,20260525-BACK-01,Jalón al pecho,Back,Vertical Pull,Cable Machine,1,10,50,,,Voice,2026-05-28 14:55:17
2026-05-25,,20260525-BACK-01,Jalón al pecho,Back,Vertical Pull,Cable Machine,2,9,50,,,Voice,2026-05-28 14:55:18
2026-05-25,,20260525-BACK-01,Jalón al pecho,Back,Vertical Pull,Cable Machine,3,8,50,,,Voice,2026-05-28 14:55:19
```

Each row represents one set.

## Session calculation

A workout session is calculated by date.

That means:

```text
1 unique Date = 1 workout session
```

The app does not count each `Session ID` as a separate workout session.

For example, if the same date contains back, biceps and abs entries, that still counts as one gym session.

## Volume calculation

Training volume is calculated as:

```text
volume = reps * weightKg
```

Each row is one set.

Total volume is the sum of all matching sets.

## Dumbbell note

If the `Notes` column says something like:

```text
17.5 kg each arm
```

the app does not automatically double the value.

The `Weight kg` column is treated as the logged weight.

## Environment variables

Create a `.env` file based on `.env.example`.

```bash
cp .env.example .env
```

You can configure the sheet in two ways.

## Option 1: use a full public CSV URL

```bash
VITE_GOOGLE_SHEET_CSV_URL="https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/export?format=csv&gid=0"
VITE_GOOGLE_SHEET_ID=""
VITE_GOOGLE_SHEET_GID=""
```

## Option 2: use Sheet ID and GID

```bash
VITE_GOOGLE_SHEET_ID="YOUR_SHEET_ID"
VITE_GOOGLE_SHEET_GID="0"
VITE_GOOGLE_SHEET_CSV_URL=""
```

The Sheet ID is the long ID in the Google Sheet URL.

Example Google Sheet URL:

```text
https://docs.google.com/spreadsheets/d/1abcDEFghiJKL1234567890/edit#gid=0
```

In that case:

```bash
VITE_GOOGLE_SHEET_ID="1abcDEFghiJKL1234567890"
VITE_GOOGLE_SHEET_GID="0"
```

## Important privacy note

The Google Sheet must be public or published to the web.

Do not put sensitive information in the sheet.

If the sheet is public, anyone with access to the public URL may be able to read the data.

## Install dependencies

```bash
npm install
```

## Run locally

```bash
npm run dev
```

Then open the local URL shown in the terminal.

Usually:

```text
http://localhost:5173
```

## Build

```bash
npm run build
```

## Preview production build

```bash
npm run preview
```

## Recommended first Codex prompt

After placing `AGENTS.md`, `README.md`, `.gitignore` and `.env.example` in your repository, start Codex from that repository and use this prompt:

```text
Read AGENTS.md carefully and implement the full first version of Ilia.

Create a Vue 3 + TypeScript + Vite + Vuetify app that reads live workout data from the public Google Sheet configured through environment variables.

The app must parse the workout rows using the schema from AGENTS.md, calculate sessions by unique Date, and build the dashboard, filters, charts, exercise detail section and workout table described there.

Use a Visual Studio Code-like dark theme.

Do not add a backend.
Do not hardcode the Google Sheet URL.
Do not commit CSV files.
Run npm run build before finishing and fix all errors.
```

## Current limitations

The first version is read-only.

It does not:

- Write back to Google Sheets
- Edit workout entries
- Require login
- Use a backend
- Use Google OAuth
- Store data locally
