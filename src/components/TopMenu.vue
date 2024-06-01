<script setup lang="ts">
import { useAuthStore } from '~/src/store/auth';

const authStore = useAuthStore();
const username = computed(() => authStore.username || 'Unknown');
const showLogoutMenu = ref(false);

function logout() {
  authStore.logout();
  navigateTo('/');
}

function toggleLogoutMenu() {
  showLogoutMenu.value = !showLogoutMenu.value;
}

function closeLogoutMenu(event: MouseEvent) {
  const target = event.target as HTMLElement;
  const logoutWrapper = document.querySelector('.logout-wrapper');
  const usernameWrapper = document.querySelector('.username-wrapper');

  if (
      logoutWrapper &&
      usernameWrapper &&
      !logoutWrapper.contains(target) &&
      !usernameWrapper.contains(target)
  ) {
    showLogoutMenu.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', closeLogoutMenu);
});

onUnmounted(() => {
  document.removeEventListener('click', closeLogoutMenu);
});
</script>

<template>
  <nav>
    <nuxt-link class="home-link" to="/ideas">Home</nuxt-link>
    <div class="logout-menu" v-if="authStore.token">
      <div class="username-wrapper" @click="toggleLogoutMenu">
        <span class="username">{{ username }}</span>
        <div class="logout-wrapper" :class="{ 'show': showLogoutMenu }">
          <button @click="logout">Logout</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1em;
  background-color: var(--shadow-color);
  font-weight: bold;
  color: var(--pencil-line-color);
}

.home-link {
  text-decoration: none;
  margin-right: 1em;
  margin-left: 10em;
  color: var(--pencil-line-color);
}

.logout-menu {
  position: relative;
}

.username-wrapper {
  position: relative;
  cursor: pointer;
}

.username {
  color: var(--pencil-line-color);
  margin-right: 1em;
}

.logout-wrapper {
  position: absolute;
  top: 100%;
  right: 0;
  display: none;
  background-color: var(--pencil-line-color);
  margin-top: 0.5em;
  padding: 0.5em;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  border: 2px dashed var(--shadow-color);
}

.logout-wrapper.show {
  display: block;
}

button {
  background-color: var(--pencil-line-color);
  color: var(--shadow-color);
  border: none;
  padding: 0.5em 1em;
  cursor: pointer;
  border-radius: 5px;
}

button:hover {
  background-color: var(--background-color);
}
</style>
