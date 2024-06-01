<!-- src/components/ConfirmationAlert.vue -->
<template>
  <div class="delete-confirmation-overlay">
    <div class="delete-confirmation-modal">
      <h3>{{ message }}</h3>
      <div class="confirmation-actions">
        <button @click="cancel" class="cancel-delete">Cancel</button>
        <button @click="confirm" class="confirm-delete">Delete</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  message: string;
}>();

const emit = defineEmits<{
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}>();

function confirm() {
  emit('confirm');
}

function cancel() {
  emit('cancel');
}
</script>

<style scoped>
.delete-confirmation-overlay {
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

.delete-confirmation-modal {
  background-color: var(--pencil-line-color);
  padding: 20px;
  border-radius: 10px;
  max-width: 400px;
  width: 100%;
  border: 4px solid var(--shadow-color);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
}
.confirmation-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.cancel-delete,
.confirm-delete {
  padding: 10px 20px;
  font-size: 14px;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.cancel-delete {
  background-color: var(--pencil-line-color);
  color: var(--shadow-color);
  border: 2px solid var(--shadow-color);
}

.cancel-delete:hover {
  background-color: var(--shadow-color);
  color: var(--pencil-line-color);
}

.confirm-delete {
  background-color: var(--shadow-color);
  color: var(--pencil-line-color);
  border: none;
}

.confirm-delete:hover {
  background-color: var(--pencil-line-color);
  color: var(--shadow-color);
  border: 2px solid var(--shadow-color);
}
</style>