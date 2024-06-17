<!-- components/Journey.vue -->
<template>
  <div class="journey-container">
    <h3 v-if="journeySteps.length > 0" class="journey-heading">Idea's Journey</h3>
    <h3 v-else>No journeys here</h3>
    <div v-if="journeySteps.length > 0" class="journey-steps">
      <div v-for="(step, index) in journeySteps" :key="index" class="journey-step">
        <div class="step-header">
          <h4 class="step-title">{{ step.title }}</h4>
        </div>
        <div class="step-content">
          <textarea
              v-model="step.answer"
              :placeholder="!step.answer ? getPlaceholder(step) : ''"
              @focus="clearPlaceholder(step)"
          ></textarea>
        </div>
      </div>
    </div>
    <div v-if="journeySteps.length > 0" class="journey-actions">
      <button @click="submitJourney">Submit Journey</button>
      <button @click="deleteJourney" class="delete-button">Delete Journey</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { JourneyStep } from '~/src/types/types.vue';

const props = defineProps<{
  journeySteps: JourneyStep[];
}>();

const emit = defineEmits<{
  (e: 'submitJourney'): void;
  (e: 'deleteJourney'): void;
}>();

function getPlaceholder(step: JourneyStep) {
  return `${step.description}\n\nExample: ${step.example}`;
}

function clearPlaceholder(step: JourneyStep) {
  if (step.answer === '') {
    step.answer = '';
  }
}

function submitJourney() {
  emit('submitJourney');
}

function deleteJourney() {
  emit('deleteJourney');
}
</script>

<style scoped>
.journey-container {
  max-height: 600px;
  overflow: auto;
  padding: 0px 20px;
}

.journey-heading {
  margin-bottom: 10px;
}

.error-message {
  color: red;
  font-weight: bold;
  margin-top: 20px;
}

.journey-steps {
  margin-bottom: 20px;
}

.journey-step {
  background-color: var(--background-color);
  border: 2px solid var(--shadow-color);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.step-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.step-title {
  font-size: 18px;
  font-weight: bold;
  color: var(--shadow-color);
  margin: 0;
}

.step-content textarea {
  width: 100%;
  height: 200px;
  padding: 10px;
  border: 2px solid var(--shadow-color);
  border-radius: 5px;
  resize: vertical;
  overflow: auto; /* Added overflow property */
}

.journey-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.journey-actions button {
  padding: 8px 16px;
  font-size: 14px;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
  background-color: var(--shadow-color);
  color: var(--pencil-line-color);
  border: none;
}

.step-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.step-actions button {
  padding: 8px 16px;
  font-size: 14px;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
  background-color: var(--shadow-color);
  color: var(--pencil-line-color);
  border: none;
}

.journey-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.journey-actions button {
  padding: 8px 16px;
  font-size: 14px;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
  background-color: var(--shadow-color);
  color: var(--pencil-line-color);
  border: none;
  margin-left: 10px;
}

.delete-button {
  background-color: #ff4d4d;
}
</style>