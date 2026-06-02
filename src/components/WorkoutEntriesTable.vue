<template>
  <v-card class="section-panel" elevation="0">
    <v-card-title class="d-flex align-center justify-space-between ga-3">
      <span class="text-subtitle-1">Workout entries</span>
      <span class="table-count">{{ entries.length }} sets</span>
    </v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="entries"
        :items-per-page="15"
        class="workout-table"
        density="compact"
      >
        <template #item.date="{ item }">
          {{ formatDate(item.date) }}
        </template>
        <template #item.weightKg="{ item }">
          {{ formatNumber(item.weightKg, 1) }}
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { WorkoutEntry } from '../types/workout';
import { formatDate } from '../utils/date';
import { formatNumber } from '../utils/number';

defineProps<{
  entries: WorkoutEntry[];
}>();

const headers = [
  { title: 'Date', key: 'date', sortable: true },
  { title: 'Exercise', key: 'exercise', sortable: true },
  { title: 'Muscle Group', key: 'muscleGroup', sortable: true },
  { title: 'Movement Pattern', key: 'movementPattern', sortable: true },
  { title: 'Equipment', key: 'equipment', sortable: true },
  { title: 'Set #', key: 'setNumber', sortable: true },
  { title: 'Reps', key: 'reps', sortable: true },
  { title: 'Weight kg', key: 'weightKg', sortable: true },
  { title: 'Notes', key: 'notes', sortable: false },
  { title: 'Pain/Discomfort', key: 'painDiscomfort', sortable: false },
  { title: 'Source', key: 'source', sortable: true },
  { title: 'Logged At', key: 'loggedAt', sortable: true },
];
</script>

<style scoped>
.table-count {
  color: #9cdcfe;
  font-size: 0.86rem;
  font-weight: 400;
}

.workout-table {
  border: 1px solid #3e3e42;
  border-radius: 8px;
  overflow: hidden;
}
</style>
