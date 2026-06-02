const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: '2-digit',
});

export function parseDate(value: string): Date | undefined {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export function compareDateStrings(left: string, right: string): number {
  return left.localeCompare(right);
}

export function formatDate(value?: string): string {
  if (!value) {
    return 'No data';
  }

  const date = parseDate(value);
  return date ? dateFormatter.format(date) : value;
}

export function getWeekKey(value: string): string {
  const date = parseDate(value);
  if (!date) {
    return value;
  }

  const target = new Date(date.valueOf());
  const dayNumber = (target.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNumber + 3);
  const firstThursday = new Date(target.getFullYear(), 0, 4);
  const firstThursdayDay = (firstThursday.getDay() + 6) % 7;
  firstThursday.setDate(firstThursday.getDate() - firstThursdayDay + 3);
  const week = 1 + Math.round((target.valueOf() - firstThursday.valueOf()) / 604800000);

  return `${target.getFullYear()}-W${String(week).padStart(2, '0')}`;
}

export function getWeeksTracked(dates: string[]): number {
  const uniqueWeeks = new Set(dates.map(getWeekKey));
  return uniqueWeeks.size;
}
