<template>
  <v-app>
    <NewNavigation />

    <v-main>
      <v-container>
        <routerView />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import NewNavigation from './components/NewNavigation.vue';
</script>
<style>
/* 因為沒有 scope 所以要注意 */
</style>
