<!-- src/components/SimpleAlert.vue -->
<template>
  <div class="success-alert">
    <div class="success-alert-content">
      <h3>{{ message }}</h3>
      <button class="close-button" @click="$emit('close')">
        <Icon name="mdi:close" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  message: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();
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
  position: relative;
  background-color: var(--pencil-line-color);
  padding: 20px;
  border-radius: 10px;
  max-width: 90%;
  width: auto;
  min-width: 300px;
  border: 4px solid var(--shadow-color);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.success-alert-content h3 {
  font-size: 18px;
  font-weight: bold;
  color: var(--shadow-color);
  word-wrap: break-word;
}

.close-button {
  position: absolute;
  top: -5px;
  right: 1px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--shadow-color);
  transition: color 0.3s ease;
}

.close-button:hover {
  color: var(--tree-color);
}
</style>