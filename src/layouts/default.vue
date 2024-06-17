<!-- default.vue -->
<template>
  <div class="layout">
    <TopMenu v-if="authStore.token && $route.path !== '/'" />
    <div v-if="$route.path !== '/'">
      <NuxtPage @update:is-logged-in="updateIsLoggedIn" />
    </div>
    <div v-else>
      <NuxtPage @update:is-logged-in="updateIsLoggedIn" />
    </div>
  </div>
</template>

<script setup lang="ts">
import TopMenu from "~/src/components/TopMenu.vue";
import { useAuthStore } from "~/src/store/auth";

const authStore = useAuthStore();
const isLoggedIn = ref(false);

function updateIsLoggedIn(value: boolean) {
  isLoggedIn.value = value;
}
</script>

<style scoped>
.layout {
position: relative;
z-index: 1;
}
</style>