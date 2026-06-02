import type {
  ChartPoint,
  DashboardSummary,
  ExerciseDetail,
  WorkoutEntry,
  WorkoutFilters,
} from '../types/workout';
import { compareDateStrings, getWeekKey, getWeeksTracked } from './date';

export function calculateVolume(entry: WorkoutEntry): number {
  return entry.reps * entry.weightKg;
}

export function calculateEstimatedOneRepMax(entry: WorkoutEntry): number {
  return entry.weightKg * (1 + entry.reps / 30);
}

export function isValidSet(entry: WorkoutEntry): boolean {
  return Boolean(entry.exercise) && Number.isFinite(entry.reps) && Number.isFinite(entry.weightKg);
}

export function getUniqueSortedValues(
  entries: WorkoutEntry[],
  selector: (entry: WorkoutEntry) => string | undefined,
): string[] {
  return Array.from(
    new Set(entries.map(selector).filter((value): value is string => Boolean(value))),
  ).sort((left, right) => left.localeCompare(right));
}

export function applyWorkoutFilters(entries: WorkoutEntry[], filters: WorkoutFilters): WorkoutEntry[] {
  return entries.filter((entry) => {
    if (filters.startDate && compareDateStrings(entry.date, filters.startDate) < 0) return false;
    if (filters.endDate && compareDateStrings(entry.date, filters.endDate) > 0) return false;
    if (filters.muscleGroup && entry.muscleGroup !== filters.muscleGroup) return false;
    if (filters.exercise && entry.exercise !== filters.exercise) return false;
    if (filters.movementPattern && entry.movementPattern !== filters.movementPattern) return false;
    if (filters.equipment && entry.equipment !== filters.equipment) return false;
    return true;
  });
}

export function buildSummary(entries: WorkoutEntry[]): DashboardSummary {
  const dates = getUniqueSortedValues(entries, (entry) => entry.date);
  const exercises = getUniqueSortedValues(entries, (entry) => entry.exercise);

  return {
    totalSessions: dates.length,
    totalExercises: exercises.length,
    totalSets: entries.length,
    totalVolume: entries.reduce((total, entry) => total + calculateVolume(entry), 0),
    lastWorkoutDate: dates.at(-1),
    weeksTracked: getWeeksTracked(dates),
  };
}

export function buildSessionsPerWeek(entries: WorkoutEntry[]): ChartPoint[] {
  const datesByWeek = new Map<string, Set<string>>();

  for (const entry of entries) {
    const week = getWeekKey(entry.date);
    datesByWeek.set(week, datesByWeek.get(week) ?? new Set<string>());
    datesByWeek.get(week)?.add(entry.date);
  }

  return Array.from(datesByWeek.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([label, dates]) => ({ label, value: dates.size }));
}

export function buildWeeklyVolumeByMuscleGroup(entries: WorkoutEntry[]): {
  labels: string[];
  groups: string[];
  values: Record<string, number[]>;
} {
  const weeks = getUniqueSortedValues(entries, (entry) => getWeekKey(entry.date));
  const groups = getUniqueSortedValues(entries, (entry) => entry.muscleGroup || 'Unknown');
  const values = Object.fromEntries(groups.map((group) => [group, weeks.map(() => 0)]));

  for (const entry of entries) {
    const weekIndex = weeks.indexOf(getWeekKey(entry.date));
    const group = entry.muscleGroup || 'Unknown';
    values[group][weekIndex] += calculateVolume(entry);
  }

  return { labels: weeks, groups, values };
}

export function buildSetsByMuscleGroup(entries: WorkoutEntry[]): ChartPoint[] {
  return buildCountBy(entries, (entry) => entry.muscleGroup || 'Unknown');
}

export function buildMovementPatternBalance(entries: WorkoutEntry[]): ChartPoint[] {
  return buildCountBy(entries, (entry) => entry.movementPattern || 'Unknown');
}

export function buildWeightProgression(entries: WorkoutEntry[], exercise?: string): ChartPoint[] {
  const byDate = new Map<string, number>();

  for (const entry of entries) {
    if (exercise && entry.exercise !== exercise) continue;
    byDate.set(entry.date, Math.max(byDate.get(entry.date) ?? 0, entry.weightKg));
  }

  return Array.from(byDate.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([label, value]) => ({ label, value }));
}

export function buildVolumeProgression(entries: WorkoutEntry[], exercise?: string): ChartPoint[] {
  const byDate = new Map<string, number>();

  for (const entry of entries) {
    if (exercise && entry.exercise !== exercise) continue;
    byDate.set(entry.date, (byDate.get(entry.date) ?? 0) + calculateVolume(entry));
  }

  return Array.from(byDate.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([label, value]) => ({ label, value }));
}

export function buildExerciseDetail(entries: WorkoutEntry[], exercise?: string): ExerciseDetail | undefined {
  if (!exercise) {
    return undefined;
  }

  const exerciseEntries = entries.filter((entry) => entry.exercise === exercise);
  if (!exerciseEntries.length) {
    return undefined;
  }

  return {
    exercise,
    lastPerformedDate: getUniqueSortedValues(exerciseEntries, (entry) => entry.date).at(-1),
    maxLoggedWeight: Math.max(...exerciseEntries.map((entry) => entry.weightKg)),
    bestEstimatedOneRepMax: Math.max(
      ...exerciseEntries.map((entry) => calculateEstimatedOneRepMax(entry)),
    ),
    totalSets: exerciseEntries.length,
    totalVolume: exerciseEntries.reduce((total, entry) => total + calculateVolume(entry), 0),
  };
}

function buildCountBy(
  entries: WorkoutEntry[],
  selector: (entry: WorkoutEntry) => string,
): ChartPoint[] {
  const counts = new Map<string, number>();

  for (const entry of entries) {
    const key = selector(entry);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .sort(([, left], [, right]) => right - left)
    .map(([label, value]) => ({ label, value }));
}
