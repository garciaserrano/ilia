<template>
  <Line :data="chartData" :options="options" />
</template>

<script setup lang="ts">
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  type ChartData,
  type ChartOptions,
} from 'chart.js';
import { computed } from 'vue';
import { Line } from 'vue-chartjs';

import type { ChartPoint } from '../types/workout';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const props = defineProps<{
  points: ChartPoint[];
  label: string;
  color?: string;
}>();

const chartData = computed<ChartData<'line'>>(() => ({
  labels: props.points.map((point) => point.label),
  datasets: [
    {
      label: props.label,
      data: props.points.map((point) => point.value),
      borderColor: props.color ?? '#007acc',
      backgroundColor: `${props.color ?? '#007acc'}33`,
      borderWidth: 2,
      tension: 0.25,
      fill: true,
      pointRadius: 3,
    },
  ],
}));

const options: ChartOptions<'line'> = {
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
