<!-- CustomButton.vue -->
<template>
  <UButton class="login-button" type="submit"> {{ text }}</UButton>
</template>

<script>
export default {
  name: 'CustomButton',
  props: {
    text: {
      type: String,
      required: true,
    },
    dark: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped>
.login-button {
  margin-top: 15px;
  color: white!important;
  background-color: var(--tree-color)!important;
  border: 2px solid var(--pencil-line-color);
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

.login-button:hover {
  filter: brightness(80%);
}

</style>