<template>
  <v-card class="section-panel" elevation="0">
    <v-card-title class="text-subtitle-1">Exercise detail</v-card-title>
    <v-card-text>
      <div v-if="!detail" class="empty-detail">
        Select an exercise to inspect its latest performance and progression.
      </div>
      <template v-else>
        <div class="detail-title">{{ detail.exercise }}</div>
        <v-row class="mt-1" dense>
          <v-col cols="6" md="2">
            <div class="detail-label">Last performed</div>
            <div class="detail-value">{{ formatDate(detail.lastPerformedDate) }}</div>
          </v-col>
          <v-col cols="6" md="2">
            <div class="detail-label">Max weight</div>
            <div class="detail-value">{{ formatNumber(detail.maxLoggedWeight, 1) }} kg</div>
          </v-col>
          <v-col cols="6" md="2">
            <div class="detail-label">Best est. 1RM</div>
            <div class="detail-value">{{ formatNumber(detail.bestEstimatedOneRepMax, 1) }} kg</div>
          </v-col>
          <v-col cols="6" md="2">
            <div class="detail-label">Total sets</div>
            <div class="detail-value">{{ formatNumber(detail.totalSets) }}</div>
          </v-col>
          <v-col cols="12" md="4">
            <div class="detail-label">Total volume</div>
            <div class="detail-value">{{ formatVolume(detail.totalVolume) }}</div>
          </v-col>
        </v-row>
        <v-alert class="mt-4" color="info" density="compact" variant="tonal">
          Estimated 1RM uses the Epley formula. Dumbbell weights are displayed as logged.
        </v-alert>
      </template>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { ExerciseDetail } from '../types/workout';
import { formatDate } from '../utils/date';
import { formatNumber, formatVolume } from '../utils/number';

defineProps<{
  detail?: ExerciseDetail;
}>();
</script>

<style scoped>
.empty-detail {
  color: #9cdcfe;
}

.detail-title {
  color: #d4d4d4;
  font-size: 1.1rem;
  font-weight: 650;
}

.detail-label {
  color: #9cdcfe;
  font-size: 0.78rem;
}

.detail-value {
  margin-top: 0.25rem;
  color: #d4d4d4;
  font-size: 1rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
</style>
