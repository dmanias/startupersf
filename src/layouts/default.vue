<template>
  <div class="layout">
    <TopMenu v-if="isLoggedIn" />
    <NuxtPage @update:is-logged-in="updateIsLoggedIn" />
  </div>
</template>

<script>
import TopMenu from "~/src/components/TopMenu.vue";

export default {
  components: {
    TopMenu,
  },
  data() {
    return {
      isLoggedIn: false,
    };
  },
  methods: {
    updateIsLoggedIn(value) {
      this.isLoggedIn = value;
    },
  },
};
</script>