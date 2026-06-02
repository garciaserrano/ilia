import type { ParseResult, WorkoutEntry } from '../types/workout';
import { parseSafeNumber } from '../utils/number';

const requiredColumns = [
  'Date',
  'Exercise',
  'Muscle Group',
  'Set #',
  'Reps',
  'Weight kg',
];

type RawRow = Record<string, string | undefined>;

export function parseWorkoutCsv(csvText: string): ParseResult {
  const warnings: string[] = [];
  const rows = parseCsvRows(csvText);

  if (!rows.length) {
    return { entries: [], warnings };
  }

  const headers = rows[0].map((header) => header.trim());
  const missingColumns = requiredColumns.filter((column) => !headers.includes(column));
  if (missingColumns.length) {
    return {
      entries: [],
      warnings: [`Missing required columns: ${missingColumns.join(', ')}.`],
    };
  }

  const entries: WorkoutEntry[] = [];

  rows.slice(1).forEach((values, index) => {
    if (values.every((value) => !value.trim())) {
      return;
    }

    const rawRow = toRawRow(headers, values);
    const entry = toWorkoutEntry(rawRow);

    if (!entry) {
      warnings.push(`Skipped row ${index + 2}: missing date, exercise, muscle group, set number or reps.`);
      return;
    }

    entries.push(entry);
  });

  return { entries, warnings };
}

function toRawRow(headers: string[], values: string[]): RawRow {
  return headers.reduce<RawRow>((row, header, index) => {
    row[header] = values[index]?.trim() ?? '';
    return row;
  }, {});
}

function toWorkoutEntry(row: RawRow): WorkoutEntry | undefined {
  const date = row.Date?.trim();
  const exercise = row.Exercise?.trim();
  const muscleGroup = row['Muscle Group']?.trim();
  const setNumber = parseSafeNumber(row['Set #']);
  const reps = parseSafeNumber(row.Reps);
  const weightKg = parseSafeNumber(row['Weight kg']) ?? 0;

  if (!date || !exercise || !muscleGroup || setNumber === undefined || reps === undefined) {
    return undefined;
  }

  return {
    date,
    time: emptyToUndefined(row.Time),
    sessionId: emptyToUndefined(row['Session ID']),
    exercise,
    muscleGroup,
    movementPattern: emptyToUndefined(row['Movement Pattern']),
    equipment: emptyToUndefined(row.Equipment),
    setNumber,
    reps,
    weightKg,
    notes: emptyToUndefined(row.Notes),
    painDiscomfort: emptyToUndefined(row['Pain/Discomfort']),
    source: emptyToUndefined(row.Source),
    loggedAt: emptyToUndefined(row['Logged At']),
  };
}

function emptyToUndefined(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function parseCsvRows(csvText: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentValue = '';
  let inQuotes = false;

  for (let index = 0; index < csvText.length; index += 1) {
    const char = csvText[index];
    const nextChar = csvText[index + 1];

    if (char === '"' && inQuotes && nextChar === '"') {
      currentValue += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === ',' && !inQuotes) {
      currentRow.push(currentValue);
      currentValue = '';
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        index += 1;
      }
      currentRow.push(currentValue);
      rows.push(currentRow);
      currentRow = [];
      currentValue = '';
      continue;
    }

    currentValue += char;
  }

  currentRow.push(currentValue);
  if (currentRow.some((value) => value.trim())) {
    rows.push(currentRow);
  }

  return rows;
}
