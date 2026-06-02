<template>
  <v-card class="section-panel h-100" elevation="0">
    <v-card-title class="text-subtitle-1">{{ title }}</v-card-title>
    <v-card-text>
      <div v-if="empty" class="empty-chart">No data for the selected filters.</div>
      <div v-else :class="compact ? 'chart-box-sm' : 'chart-box'">
        <slot />
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  empty?: boolean;
  compact?: boolean;
}>();
</script>

<style scoped>
.empty-chart {
  display: grid;
  min-height: 220px;
  place-items: center;
  color: #9cdcfe;
  text-align: center;
}
</style>
