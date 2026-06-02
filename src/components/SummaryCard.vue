<template>
  <v-card class="dashboard-card h-100" elevation="0">
    <v-card-text>
      <div class="summary-label">{{ label }}</div>
      <div class="summary-value mono-value">{{ value }}</div>
      <div v-if="hint" class="summary-hint">{{ hint }}</div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  value: string;
  hint?: string;
}>();
</script>

<style scoped>
.summary-label {
  color: #9cdcfe;
  font-size: 0.8rem;
  letter-spacing: 0;
}

.summary-value {
  margin-top: 0.35rem;
  color: #d4d4d4;
  font-size: 1.8rem;
  font-weight: 650;
  line-height: 1.1;
}

.summary-hint {
  margin-top: 0.4rem;
  color: #b8b8b8;
  font-size: 0.82rem;
}
</style>
