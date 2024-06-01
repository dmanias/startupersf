<!-- components/Pagination.vue -->
<template>
  <div class="pagination">
    <div class="items-per-page">
      <label for="itemsPerPage">Items per page:</label>
      <select id="itemsPerPage" v-model="selectedItemsPerPage" @change="$emit('update:itemsPerPage', parseInt(selectedItemsPerPage))">
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="50">50</option>
      </select>
    </div>
    <div class="pagination-buttons">
      <button @click="previousPage" :disabled="currentPage === 1">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

const props = defineProps<{
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
}>();

const emit = defineEmits(['update:itemsPerPage', 'update:currentPage']);

const selectedItemsPerPage = ref(props.itemsPerPage.toString());

watch(() => props.itemsPerPage, (newValue) => {
  selectedItemsPerPage.value = newValue.toString();
});

const totalPages = computed(() => {
  return Math.ceil(props.totalItems / props.itemsPerPage);
});

function previousPage() {
  if (props.currentPage > 1) {
    emit('update:currentPage', props.currentPage - 1);
  }
}

function nextPage() {
  if (props.currentPage < totalPages.value) {
    emit('update:currentPage', props.currentPage + 1);
  }
}
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.items-per-page {
  display: flex;
  align-items: center;
}

.items-per-page label {
  margin-right: 10px;
}

.pagination-buttons {
  display: flex;
  align-items: center;
}

.pagination-buttons button {
  margin: 0 10px;
}
</style>