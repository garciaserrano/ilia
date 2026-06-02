<template>
  <v-main>
    <v-container class="py-6 py-md-8" fluid>
      <div class="layout-shell">
        <slot />
      </div>
    </v-container>
  </v-main>
</template>

<style scoped>
.layout-shell {
  width: min(1480px, 100%);
  margin: 0 auto;
}
</style>
