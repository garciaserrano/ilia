<template>
  <div>
    <header class="dashboard-header">
      <div>
        <h1>Ilia</h1>
        <p>Gym Progress Tracker</p>
      </div>
      <v-btn
        color="primary"
        :loading="loading"
        prepend-icon="mdi-refresh"
        variant="flat"
        @click="refresh"
      >
        Refresh sheet
      </v-btn>
    </header>

    <v-alert v-if="error" class="mb-4" color="error" variant="tonal">
      {{ error }}
    </v-alert>

    <v-alert v-if="warnings.length" class="mb-4" color="warning" variant="tonal">
      {{ warnings.length }} parsing warning{{ warnings.length === 1 ? '' : 's' }}.
      <span class="warning-text">{{ warnings.slice(0, 3).join(' ') }}</span>
    </v-alert>

    <v-progress-linear v-if="loading" class="mb-4" color="primary" indeterminate />

    <v-alert v-if="!loading && !error && !entries.length" color="info" variant="tonal">
      No workout rows were found in the configured Google Sheet.
    </v-alert>

    <template v-if="entries.length">
      <WorkoutFilters
        class="mb-4"
        :equipment="equipmentOptions"
        :exercises="exerciseOptions"
        :filters="filters"
        :movement-patterns="movementPatternOptions"
        :muscle-groups="muscleGroupOptions"
        :progress-exercise="progressExercise"
        @update:filters="setFilters"
        @update:progress-exercise="progressExercise = $event"
      />

      <v-row class="mb-4" dense>
        <v-col cols="6" md="2">
          <SummaryCard label="Total sessions" :value="formatNumber(summary.totalSessions)" />
        </v-col>
        <v-col cols="6" md="2">
          <SummaryCard label="Total exercises" :value="formatNumber(summary.totalExercises)" />
        </v-col>
        <v-col cols="6" md="2">
          <SummaryCard label="Total sets" :value="formatNumber(summary.totalSets)" />
        </v-col>
        <v-col cols="6" md="2">
          <SummaryCard label="Total volume" :value="formatVolume(summary.totalVolume)" />
        </v-col>
        <v-col cols="6" md="2">
          <SummaryCard label="Last workout" :value="formatDate(summary.lastWorkoutDate)" />
        </v-col>
        <v-col cols="6" md="2">
          <SummaryCard label="Weeks tracked" :value="formatNumber(summary.weeksTracked)" />
        </v-col>
      </v-row>

      <ExerciseDetailPanel class="mb-4" :detail="exerciseDetail" />

      <v-row dense>
        <v-col cols="12" lg="6">
          <ChartPanel title="Sessions per week" :empty="!sessionsPerWeek.length">
            <BarChart label="Sessions" :points="sessionsPerWeek" />
          </ChartPanel>
        </v-col>
        <v-col cols="12" lg="6">
          <ChartPanel
            title="Weekly volume by muscle group"
            :empty="!weeklyVolume.labels.length || !weeklyVolume.groups.length"
          >
            <StackedBarChart
              :groups="weeklyVolume.groups"
              :labels="weeklyVolume.labels"
              :values="weeklyVolume.values"
            />
          </ChartPanel>
        </v-col>
        <v-col cols="12" lg="6">
          <ChartPanel title="Weight progression by exercise" :empty="!selectedExercise || !weightProgression.length">
            <LineChart color="#4ec9b0" label="Max logged weight" :points="weightProgression" />
          </ChartPanel>
        </v-col>
        <v-col cols="12" lg="6">
          <ChartPanel title="Volume progression by exercise" :empty="!selectedExercise || !volumeProgression.length">
            <LineChart color="#007acc" label="Volume" :points="volumeProgression" />
          </ChartPanel>
        </v-col>
        <v-col cols="12" md="6">
          <ChartPanel title="Sets by muscle group" :empty="!setsByMuscleGroup.length" compact>
            <BarChart label="Sets" :points="setsByMuscleGroup" />
          </ChartPanel>
        </v-col>
        <v-col cols="12" md="6">
          <ChartPanel title="Movement pattern balance" :empty="!movementPatternBalance.length" compact>
            <BarChart label="Sets" :points="movementPatternBalance" />
          </ChartPanel>
        </v-col>
      </v-row>

      <WorkoutEntriesTable class="mt-4" :entries="filteredEntries" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';

import BarChart from '../components/BarChart.vue';
import ChartPanel from '../components/ChartPanel.vue';
import ExerciseDetailPanel from '../components/ExerciseDetailPanel.vue';
import LineChart from '../components/LineChart.vue';
import StackedBarChart from '../components/StackedBarChart.vue';
import SummaryCard from '../components/SummaryCard.vue';
import WorkoutEntriesTable from '../components/WorkoutEntriesTable.vue';
import WorkoutFilters from '../components/WorkoutFilters.vue';
import { useWorkoutData } from '../composables/useWorkoutData';
import type { WorkoutFilters as WorkoutFiltersType } from '../types/workout';
import { formatDate } from '../utils/date';
import { formatNumber, formatVolume } from '../utils/number';
import {
  applyWorkoutFilters,
  buildExerciseDetail,
  buildMovementPatternBalance,
  buildSessionsPerWeek,
  buildSetsByMuscleGroup,
  buildSummary,
  buildVolumeProgression,
  buildWeeklyVolumeByMuscleGroup,
  buildWeightProgression,
  getUniqueSortedValues,
} from '../utils/workout';

const { entries, warnings, loading, error, refresh } = useWorkoutData();

const filters = reactive<WorkoutFiltersType>({});
const progressExercise = ref<string | undefined>();

const filteredEntries = computed(() => applyWorkoutFilters(entries.value, filters));
const selectedExercise = computed(() => progressExercise.value || filters.exercise || exerciseOptions.value[0]);

const muscleGroupOptions = computed(() => getUniqueSortedValues(entries.value, (entry) => entry.muscleGroup));
const exerciseOptions = computed(() => getUniqueSortedValues(entries.value, (entry) => entry.exercise));
const movementPatternOptions = computed(() =>
  getUniqueSortedValues(entries.value, (entry) => entry.movementPattern),
);
const equipmentOptions = computed(() => getUniqueSortedValues(entries.value, (entry) => entry.equipment));

const summary = computed(() => buildSummary(filteredEntries.value));
const sessionsPerWeek = computed(() => buildSessionsPerWeek(filteredEntries.value));
const weeklyVolume = computed(() => buildWeeklyVolumeByMuscleGroup(filteredEntries.value));
const setsByMuscleGroup = computed(() => buildSetsByMuscleGroup(filteredEntries.value));
const movementPatternBalance = computed(() => buildMovementPatternBalance(filteredEntries.value));
const weightProgression = computed(() => buildWeightProgression(filteredEntries.value, selectedExercise.value));
const volumeProgression = computed(() => buildVolumeProgression(filteredEntries.value, selectedExercise.value));
const exerciseDetail = computed(() => buildExerciseDetail(filteredEntries.value, selectedExercise.value));

function setFilters(nextFilters: WorkoutFiltersType) {
  Object.assign(filters, nextFilters);
}

watch(exerciseOptions, (options) => {
  if (progressExercise.value && !options.includes(progressExercise.value)) {
    progressExercise.value = undefined;
  }
});
</script>

<style scoped>
.dashboard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

h1 {
  margin: 0;
  color: #d4d4d4;
  font-size: clamp(2rem, 5vw, 3rem);
  line-height: 1;
}

p {
  margin: 0.35rem 0 0;
  color: #9cdcfe;
}

.warning-text {
  color: #d4d4d4;
}

@media (max-width: 720px) {
  .dashboard-header {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
