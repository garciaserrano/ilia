<template>
  <v-app>
    <DefaultLayout>
      <DashboardPage />
    </DefaultLayout>
  </v-app>
</template>

<script setup lang="ts">
import DefaultLayout from './layouts/DefaultLayout.vue';
import DashboardPage from './pages/DashboardPage.vue';
</script>
