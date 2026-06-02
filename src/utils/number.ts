export function parseSafeNumber(value: string | undefined): number | undefined {
  if (!value) {
    return undefined;
  }

  const normalized = value.trim().replace(',', '.');
  if (!normalized) {
    return undefined;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function formatNumber(value: number, maximumFractionDigits = 0): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits,
  }).format(value);
}

export function formatVolume(value: number): string {
  return `${formatNumber(value)} kg`;
}
