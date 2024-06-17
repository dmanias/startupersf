<!-- Login.vue -->
<script setup lang="ts">
import { object, string, type InferType } from 'yup';
import type { FormSubmitEvent } from '#ui/types';
import { useAuthStore } from '~/src/store/auth';
import { ref, reactive, defineEmits } from 'vue';
import CustomButton from "~/src/components/CustomButton.vue";
import AuthWrapper from './AuthWrapper.vue';
import { useRouter } from 'nuxt/app';

const router = useRouter();
const emit = defineEmits(['login', 'switchToRegister']);
const authStore = useAuthStore();
const config = useRuntimeConfig();
const backUrl = config.public.BACKEND_URL;

const schema = object({
  email: string().email('Invalid email').required('Required'),
  password: string().min(8, 'Must be at least 8 characters').required('Required'),
});


function switchToRegister() {
  emit('switchToRegister');
}

type Schema = InferType<typeof schema>;

const state = reactive({
  email: '',
  password: '',
});

const showPassword = ref(false);

async function onSubmit(event: FormSubmitEvent<Schema>) {
  await authStore.login({ email: state.email, password: state.password }, backUrl);
  if (!authStore.loginError) {
    emit('login');
    await router.push('/ideas');
  } else {
    setTimeout(() => {
      router.push('/');
    }, 5000);
  }
}

function redirectToLogin() {
  console.log('Redirecting to login...');
  router.go(0);
}

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value;
}
</script>

<template>
  <AuthWrapper>
    <h2 class="auth-title">Welcome</h2>
    <div v-if="!authStore.loginError">
      <!-- Login form -->
      <UForm :schema="schema" :state="state" class="auth-form space-y-4" @submit="onSubmit">
        <UFormGroup name="email" class="form-group">
          <template #label>
            <label class="block font-medium text-custom-label">Email</label>
          </template>
          <template #default>
            <UInput v-model="state.email" class="custom-input" />
          </template>
        </UFormGroup>
        <UFormGroup class="form-group password-form-group" name="password">
          <template #label>
            <label class="block font-medium text-custom-label">Password</label>
          </template>
          <template #default>
            <div class="password-input-container">
              <UInput v-model="state.password" :type="showPassword ? 'text' : 'password'" class="custom-input" />
              <button type="button" class="password-toggle-btn" @click="togglePasswordVisibility">
                <Icon v-if="showPassword" name="mdi:eye" />
                <Icon v-else name="mdi:eye-off" />
              </button>
            </div>
          </template>
        </UFormGroup>
        <CustomButton text="Login" type="submit">Login</CustomButton>
        <div class="register-text-container">
          <span class="register-text">Don't have an account? </span>
          <a href="#" class="register-link" @click.prevent="switchToRegister">Register</a>
        </div>
      </UForm>
    </div>
    <div v-else class="error-message">
      <span>{{ authStore.loginError }}</span>
      <p class="redirect-text" @click="redirectToLogin">Back to Login</p>
    </div>
  </AuthWrapper>
</template>

<style scoped>
.auth-form ::v-deep .custom-input input {
  background-color: var(--grey-input) !important;
}

.auth-title {
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
  color: var(--pencil-line-color);
  text-align: center;
}

.auth-form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.auth-form .form-group label {
  color: var(--pencil-line-color);
}

.password-input-container {
  position: relative;
}

.password-toggle-btn {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: var(--building-color);
}

.register-link {
  color: var(--tree-color);
  font-weight: bold;
}

.register-text-container {
  margin-top: 20px;
  color: var(--pencil-line-color);
  font-weight: bold;
}

.error-message {
  color: red;
  margin-top: 20px;
  text-align: center;
}

.error-message span {
  display: inline-block;
  padding: 10px;
  background-color: rgba(255, 0, 0, 0.1);
  border-radius: 4px;
}

.redirect-text {
  margin-top: 20px;
  color: var(--pencil-line-color);
  text-decoration: underline;
  cursor: pointer;
}

.redirect-text:hover {
  color: var(--tree-color);
}
</style>