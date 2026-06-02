<template>
  <Bar :data="chartData" :options="options" />
</template>

<script setup lang="ts">
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
  type ChartData,
  type ChartOptions,
} from 'chart.js';
import { computed } from 'vue';
import { Bar } from 'vue-chartjs';

import { chartColors } from '../constants/theme';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const props = defineProps<{
  labels: string[];
  groups: string[];
  values: Record<string, number[]>;
}>();

const chartData = computed<ChartData<'bar'>>(() => ({
  labels: props.labels,
  datasets: props.groups.map((group, index) => ({
    label: group,
    data: props.values[group],
    backgroundColor: chartColors[index % chartColors.length],
    borderWidth: 0,
  })),
}));

const options: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: { color: '#d4d4d4' },
    },
  },
  scales: {
    x: {
      stacked: true,
      ticks: { color: '#9cdcfe', maxRotation: 0, autoSkip: true },
      grid: { color: '#3e3e42' },
    },
    y: {
      stacked: true,
      beginAtZero: true,
      ticks: { color: '#9cdcfe' },
      grid: { color: '#3e3e42' },
    },
  },
};
</script>
