/** Umbral de trabajos completados para mostrar reputación (igual que la app móvil). */
export const MIN_COMPLETED_JOBS_FOR_REPUTATION = 2;

export function canShowWorkerReputation(completedJobs: number | null | undefined): boolean {
  const n = Math.max(0, Math.floor(Number(completedJobs) || 0));
  return n >= MIN_COMPLETED_JOBS_FOR_REPUTATION;
}

export function normalizeCompletedJobs(raw: unknown): number {
  if (typeof raw === 'number' && Number.isFinite(raw)) {
    return Math.max(0, Math.floor(raw));
  }
  const n = Number(raw);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.floor(n));
}
