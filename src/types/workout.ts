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

export interface ParseResult {
  entries: WorkoutEntry[];
  warnings: string[];
}

export interface DashboardSummary {
  totalSessions: number;
  totalExercises: number;
  totalSets: number;
  totalVolume: number;
  lastWorkoutDate?: string;
  weeksTracked: number;
}

export interface WorkoutFilters {
  startDate?: string;
  endDate?: string;
  muscleGroup?: string;
  exercise?: string;
  movementPattern?: string;
  equipment?: string;
}

export interface ChartPoint {
  label: string;
  value: number;
}

export interface ExerciseDetail {
  exercise: string;
  lastPerformedDate?: string;
  maxLoggedWeight: number;
  bestEstimatedOneRepMax: number;
  totalSets: number;
  totalVolume: number;
}
