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
import type { ChartPoint } from '../types/workout';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const props = defineProps<{
  points: ChartPoint[];
  label: string;
}>();

const chartData = computed<ChartData<'bar'>>(() => ({
  labels: props.points.map((point) => point.label),
  datasets: [
    {
      label: props.label,
      data: props.points.map((point) => point.value),
      backgroundColor: props.points.map((_, index) => chartColors[index % chartColors.length]),
      borderWidth: 0,
    },
  ],
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
      ticks: { color: '#9cdcfe', maxRotation: 0, autoSkip: true },
      grid: { color: '#3e3e42' },
    },
    y: {
      beginAtZero: true,
      ticks: { color: '#9cdcfe' },
      grid: { color: '#3e3e42' },
    },
  },
};
</script>
