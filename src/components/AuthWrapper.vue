<!-- AuthWrapper.vue -->
<template>
  <div class="auth-container">
    <div class="auth-wrapper">
      <div class="auth-box">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.auth-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 400px;
  padding: 20px;
  background-color: var(--background-color-05);
  border: 2px dashed var(--pencil-line-color);
  border-radius: 10px;
  box-shadow: 0 0 10px var(--shadow-color);
}

.auth-box {
  width: 100%;
  padding: 20px;
  background-color: var(--background-color-08);
  border-radius: 5px;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
