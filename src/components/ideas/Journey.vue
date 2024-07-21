<!-- components/Journey.vue -->
<template>
  <div class="journey-container">
    <h3 v-if="journeySteps.length > 0" class="journey-heading"></h3>
    <h3 v-else>No journeys here</h3>
    <div v-if="journeySteps.length > 0" class="journey-steps">
      <div v-for="(step, index) in journeySteps" :key="index" class="journey-step" :class="{ 'ai-answer': step.answer && step.answer.trim() !== '' }">
        <div class="step-header">
          <h4 class="step-title">{{ step.title }}</h4>
        </div>
        <div class="step-content">
          <textarea
              v-model="step.answer"
              :placeholder="!step.answer ? getPlaceholder(step) : ''"
              @focus="clearPlaceholder(step)"
          ></textarea>
          <button @click="$emit('getAIHelp', step)" :disabled="step.isAIHelpLoading" class="help-button" :class="{ 'ai-help': step.answer && step.answer.trim() !== '' }">
            <template v-if="step.isAIHelpLoading">
              <span class="loading-spinner"></span> Loading...
            </template>
            <template v-else>
              Can I help you?
            </template>
          </button>
        </div>
      </div>
    </div>
    <div v-if="journeySteps.length > 0" class="journey-actions">
      <button @click="$emit('submitJourney')">Submit Journey</button>
      <button @click="$emit('deleteJourney')" class="delete-button">Delete Journey</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { JourneyStep } from '~/src/types/types.vue';

defineProps<{
  journeySteps: JourneyStep[];
  isAIHelpLoading: boolean;
}>();

defineEmits<{
  (e: 'submitJourney'): void;
  (e: 'deleteJourney'): void;
  (e: 'getAIHelp', step: JourneyStep): void;
}>();

function getPlaceholder(step: JourneyStep) {
  return `${step.description}\n\nExample: ${step.example}`;
}

function clearPlaceholder(step: JourneyStep) {
  if (step.answer === '') {
    step.answer = '';
  }
}
</script>

<style scoped>
.help-button {
  transition: background-color 0.5s ease;
  box-shadow: 0 0 10px rgba(0, 123, 255, 0.7);
}

.help-button:hover {
  background-color: var(--building-color-opa);
}

.ai-answer {
  box-shadow: 0 0 10px rgba(0, 123, 255, 0.7);
}

.step-content button {
  padding: 8px 16px;
  font-size: 14px;
  font-weight: bold;
  font-style: italic;
  border-radius: 5px;
  cursor: pointer;
  background-color: var(--shadow-color);
  color: var(--pencil-line-color);
  border: none;
  margin-top: 10px;
}

.journey-container {
  max-height: 600px;
  overflow: auto;
  padding: 0px 20px;
}

.journey-heading {
  margin-bottom: 10px;
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
  background-color: var(--shadow-color);
}

.step-content textarea::placeholder {
  color: var(--pencil-line-color);
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

.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #ccc;
  border-top-color: #333;
  animation: spin 1s ease-in-out infinite;
  margin-right: 5px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>