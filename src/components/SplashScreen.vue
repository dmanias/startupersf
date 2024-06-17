<!-- SplashScreen.vue -->
<template>
  <div v-if="showSplashScreen" class="splash-screen">
    <div class="splash-content">
      <h2>{{ newlyCreatedIdea?.title }}</h2>
      <div class="splash-avatar-container">
        <img v-if="newlyCreatedIdea && newlyCreatedIdea.avatarURL" :src="newlyCreatedIdea.avatarURL" alt="Avatar" class="splash-avatar" />
      </div>
      <p class="splash-text">How you doin'!</p>
      <CustomButton text="Close" @click="closeSplashScreen">Close</CustomButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import CustomButton from "~/src/components/CustomButton.vue";
import type {IdeaType} from '~/src/types/types.vue';

const props = defineProps<{
  showSplashScreen: boolean;
  newlyCreatedIdea: IdeaType | null;
}>();

const emit = defineEmits<{
  (event: 'close'): void;
}>();

function closeSplashScreen() {
  emit('close');
}
</script>
<style scoped>
.splash-content h2 {
  margin-bottom: 15px;
}

.splash-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.splash-content {
  background-color: var(--pencil-line-color);
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  max-width: 600px;
  width: 90%;
  border: 4px solid var(--shadow-color);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}
.splash-avatar-container {
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.splash-avatar {
  width: 300px;
  height: 300px;
  border-radius: 50%;
  margin-bottom: 10px;
}
</style>