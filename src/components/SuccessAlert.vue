<!-- src/components/SuccessAlert.vue -->
<template>
  <div class="success-alert">
    <div class="success-alert-content">
      <h3>{{ message }}</h3>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

const props = defineProps<{
  message: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

onMounted(() => {
  setTimeout(() => {
    emit('close');
  }, 1000);
});
</script>

<style scoped>
.success-alert {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.success-alert-content {
  background-color: var(--pencil-line-color);
  padding: 20px;
  border-radius: 10px;
  max-width: 400px;
  width: 100%;
  border: 4px solid var(--shadow-color);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.success-alert-content h3 {
  font-size: 18px;
  font-weight: bold;
  color: var(--shadow-color);
}
</style>