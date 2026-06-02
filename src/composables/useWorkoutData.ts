import { onMounted, ref } from 'vue';

import { loadWorkoutEntries } from '../services/googleSheetService';
import type { WorkoutEntry } from '../types/workout';

export function useWorkoutData() {
  const entries = ref<WorkoutEntry[]>([]);
  const warnings = ref<string[]>([]);
  const loading = ref(false);
  const error = ref<string | undefined>();

  async function refresh() {
    loading.value = true;
    error.value = undefined;

    try {
      const result = await loadWorkoutEntries();
      entries.value = result.entries;
      warnings.value = result.warnings;
    } catch (caughtError) {
      entries.value = [];
      warnings.value = [];
      error.value =
        caughtError instanceof Error ? caughtError.message : 'Could not load workout data.';
    } finally {
      loading.value = false;
    }
  }

  onMounted(refresh);

  return {
    entries,
    warnings,
    loading,
    error,
    refresh,
  };
}
