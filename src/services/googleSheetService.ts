import type { ParseResult } from '../types/workout';
import { parseWorkoutCsv } from './csvParser';

export function buildGoogleSheetCsvUrl(): string {
  const directUrl = import.meta.env.VITE_GOOGLE_SHEET_CSV_URL?.trim();
  if (directUrl) {
    return directUrl;
  }

  const sheetId = import.meta.env.VITE_GOOGLE_SHEET_ID?.trim();
  const gid = import.meta.env.VITE_GOOGLE_SHEET_GID?.trim() || '0';

  if (!sheetId) {
    throw new Error(
      'Google Sheet is not configured. Set VITE_GOOGLE_SHEET_CSV_URL or VITE_GOOGLE_SHEET_ID in your .env file.',
    );
  }

  return `https://docs.google.com/spreadsheets/d/${encodeURIComponent(sheetId)}/export?format=csv&gid=${encodeURIComponent(gid)}`;
}

export async function loadWorkoutEntries(): Promise<ParseResult> {
  const csvUrl = buildGoogleSheetCsvUrl();
  const response = await fetch(csvUrl, { cache: 'no-store' });

  if (!response.ok) {
    throw new Error(`Could not load Google Sheet CSV. HTTP ${response.status}.`);
  }

  const csvText = await response.text();
  return parseWorkoutCsv(csvText);
}
