<!-- components/SearchBar.vue -->
<template>
  <div class="search-container">
    <input type="text" v-model="searchQuery" placeholder="Search ideas..." class="search-input" @input="$emit('search', searchQuery)" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const searchQuery = ref('');

defineEmits(['search']);
</script>

<style scoped>
.search-container {
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 2px solid var(--shadow-color);
  border-radius: 5px;
}
</style>