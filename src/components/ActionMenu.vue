<!-- src/components/ActionMenu.vue -->
<template>
  <div class="action-menu">
    <button @click="showIdea">Show</button>
    <button @click="openDeleteConfirmation">Delete</button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const props = defineProps<{
  ideaId: string;
}>();

const emit = defineEmits<{
  (e: 'open-delete-confirmation', ideaId: string): void;
}>();

const router = useRouter();

function showIdea() {
  router.push({ path: `/ideas/${props.ideaId}` });
}

function openDeleteConfirmation() {
  emit('open-delete-confirmation', props.ideaId);
}
</script>

<style scoped>
.action-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: var(--pencil-line-color);
  border: 2px solid var(--shadow-color);
  border-radius: 5px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 1;
}

.action-menu button {
  background-color: var(--background-color);
  color: var(--shadow-color);
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  font-weight: bold;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.action-menu button:hover {
  background-color: var(--shadow-color);
  color: var(--pencil-line-color);
}
</style>