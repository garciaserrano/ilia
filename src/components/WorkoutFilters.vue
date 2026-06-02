<template>
  <v-card class="section-panel" elevation="0">
    <v-card-title class="text-subtitle-1">Filters</v-card-title>
    <v-card-text>
      <v-row dense>
        <v-col cols="12" md="2">
          <v-text-field
            :model-value="filters.startDate"
            density="compact"
            hide-details
            label="Start date"
            type="date"
            variant="outlined"
            @update:model-value="updateFilter('startDate', String($event || ''))"
          />
        </v-col>
        <v-col cols="12" md="2">
          <v-text-field
            :model-value="filters.endDate"
            density="compact"
            hide-details
            label="End date"
            type="date"
            variant="outlined"
            @update:model-value="updateFilter('endDate', String($event || ''))"
          />
        </v-col>
        <v-col cols="12" md="2">
          <v-select
            :items="muscleGroups"
            :model-value="filters.muscleGroup"
            clearable
            density="compact"
            hide-details
            label="Muscle group"
            variant="outlined"
            @update:model-value="updateFilter('muscleGroup', $event)"
          />
        </v-col>
        <v-col cols="12" md="2">
          <v-select
            :items="exercises"
            :model-value="filters.exercise"
            clearable
            density="compact"
            hide-details
            label="Exercise"
            variant="outlined"
            @update:model-value="updateFilter('exercise', $event)"
          />
        </v-col>
        <v-col cols="12" md="2">
          <v-select
            :items="movementPatterns"
            :model-value="filters.movementPattern"
            clearable
            density="compact"
            hide-details
            label="Movement"
            variant="outlined"
            @update:model-value="updateFilter('movementPattern', $event)"
          />
        </v-col>
        <v-col cols="12" md="2">
          <v-select
            :items="equipment"
            :model-value="filters.equipment"
            clearable
            density="compact"
            hide-details
            label="Equipment"
            variant="outlined"
            @update:model-value="updateFilter('equipment', $event)"
          />
        </v-col>
        <v-col cols="12" md="3">
          <v-select
            :items="exercises"
            :model-value="progressExercise"
            clearable
            density="compact"
            hide-details
            label="Progress exercise"
            variant="outlined"
            @update:model-value="emit('update:progressExercise', $event || undefined)"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { WorkoutFilters } from '../types/workout';

const props = defineProps<{
  filters: WorkoutFilters;
  muscleGroups: string[];
  exercises: string[];
  movementPatterns: string[];
  equipment: string[];
  progressExercise?: string;
}>();

const emit = defineEmits<{
  'update:filters': [filters: WorkoutFilters];
  'update:progressExercise': [exercise: string | undefined];
}>();

function updateFilter(key: keyof WorkoutFilters, value: string | null) {
  emit('update:filters', {
    ...props.filters,
    [key]: value || undefined,
  });
}
</script>
