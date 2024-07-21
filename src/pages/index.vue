<!-- index.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import Login from "~/src/components/Login.vue";
import Register from "~/src/components/Register.vue";

definePageMeta({
  middleware: 'auth',
});

const isLoggedIn = ref(false);
const showRegisterForm = ref(false);

function handleLogin() {
  isLoggedIn.value = true;
}

function handleSwitchToRegister() {
  showRegisterForm.value = true;
}

function handleRegistrationError() {
  // Do nothing here, or you can add some logging if needed
  console.log('Registration error occurred');
}

function handleSwitchToLogin() {
  showRegisterForm.value = false;
}
</script>

<template>
  <div class="background" v-if="!isLoggedIn && $route.path === '/'">
    <img src="~/public/sprite2.png" alt="Logo" class="logo" />
    <div class="container">
      <div class="content">
        <div class="motto">The place where your ideas live</div>
        <Login v-if="!showRegisterForm" @login="handleLogin" @switchToRegister="handleSwitchToRegister" />
        <Register v-else @switchToLogin="handleSwitchToLogin" @registration-error="handleRegistrationError" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.background {
  background: url('~/public/background4.webp') no-repeat center center fixed;
  background-size: cover; /* Change from 'contain' to 'cover' to stretch background */
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.logo {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 100px;
}
.motto {
  font-weight: bold;
  font-size: 2rem;
  color: var(--pencil-line-color);/* Adjust the color to fit your design */
  padding: 20px;
  background-color: var(--background-color-08);/* Optional: add a background for better readability */
  border-radius: 10px;
  margin-bottom: 20px; /* Space between motto and login component */
  text-align: center;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  border-radius: 10px;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 100%;
  width: 100%;
}

@media (min-width: 1536px) {
  .container {
    max-width: 100%;
  }
}
</style>
