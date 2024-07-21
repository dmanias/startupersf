<!-- Register.vue -->
<script setup lang="ts">
import { object, string, ref as yupRef, type InferType } from 'yup';
import type { FormSubmitEvent } from '#ui/types';
import { ref, reactive, defineEmits } from 'vue';
import CustomButton from "~/src/components/CustomButton.vue";
import AuthWrapper from './AuthWrapper.vue';

const emit = defineEmits(['switchToLogin', 'registration-error']);
const router = useRouter();
const registrationSuccessful = ref(false);
const schema = object({
  name: string().required('Name is required'),
  email: string().email('Invalid email').required('Email is required'),
  password: string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  passwordConfirm: string().oneOf([yupRef('password')], 'Passwords must match').required('Password confirmation is required'),
});

type Schema = InferType<typeof schema>;

const state = reactive({
  name: '',
  email: '',
  password: '',
  passwordConfirm: '',
});

const config = useRuntimeConfig();
const backUrl = config.public.BACKEND_URL;
const host = config.public.HOST;
const errorMessage = ref('');
const successMessage = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const isSubmitting = ref(false);

async function onSubmit(event: FormSubmitEvent<Schema>) {
  errorMessage.value = '';
  registrationSuccessful.value = false;
  isSubmitting.value = true;

  const body = JSON.stringify({
    Name: state.name,
    Email: state.email,
    Roles: ['USER'],
    Password: state.password,
    PasswordConfirm: state.passwordConfirm,
  });

  try {
    const response = await fetch(`${backUrl}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('HTTP error', response.status);
      if (data.error) {
        errorMessage.value = `Registration failed: ${data.error}`;
      } else {
        errorMessage.value = `Registration failed: ${response.statusText}`;
      }
      emit('registration-error');
    } else {
      if (!data || Object.keys(data).length === 0) {
        console.error('No data received');
        errorMessage.value = 'Registration failed: No data received from server';
        emit('registration-error');
      } else {
        registrationSuccessful.value = true;
        successMessage.value = 'Registration successful! You can now log in.';
        setTimeout(() => {
          switchToLogin();
        }, 3000);
      }
    }
  } catch (error) {
    console.error('Fetch error:', error);
    errorMessage.value = 'Registration failed: Unable to connect to the server. Please try again later.';
    emit('registration-error');
  } finally {
    isSubmitting.value = false;
  }
}

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value;
}

function toggleConfirmPasswordVisibility() {
  showConfirmPassword.value = !showConfirmPassword.value;
}

function switchToLogin() {
  emit('switchToLogin');
}
</script>

<template>
  <AuthWrapper>
    <h2 class="auth-title">Register</h2>
    <UForm v-if="!registrationSuccessful" :schema="schema" :state="state" class="auth-form space-y-4" @submit="onSubmit">
      <UFormGroup name="name" class="form-group">
        <label class="block font-medium text-custom-label">Name</label>
        <UInput v-model="state.name" class="custom-input" />
      </UFormGroup>
      <UFormGroup name="email" class="form-group">
        <label class="block font-medium text-custom-label">Email</label>
        <UInput v-model="state.email" class="custom-input" />
      </UFormGroup>
      <UFormGroup class="form-group password-form-group" name="password">
        <label class="block font-medium text-custom-label">Password</label>
        <div class="password-input-container">
          <UInput v-model="state.password" :type="showPassword ? 'text' : 'password'" class="custom-input" />
          <button type="button" class="password-toggle-btn" @click="togglePasswordVisibility">
            <Icon v-if="showPassword" name="mdi:eye" />
            <Icon v-else name="mdi:eye-off" />
          </button>
        </div>
      </UFormGroup>
      <UFormGroup class="form-group password-form-group" name="passwordConfirm">
        <label class="block font-medium text-custom-label">Confirm Password</label>
        <div class="password-input-container">
          <UInput v-model="state.passwordConfirm" :type="showConfirmPassword ? 'text' : 'password'" class="custom-input" />
          <button type="button" class="password-toggle-btn" @click="toggleConfirmPasswordVisibility">
            <Icon v-if="showConfirmPassword" name="mdi:eye" />
            <Icon v-else name="mdi:eye-off" />
          </button>
        </div>
      </UFormGroup>
      <CustomButton text="Register" type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? 'Registering...' : 'Register' }}
      </CustomButton>
      <div class="login-text-container">
        <span class="login-text">Already have an account? </span>
        <a href="#" class="login-link" @click.prevent="switchToLogin">Login</a>
      </div>
    </UForm>
    <div v-if="errorMessage" :class="{ 'error-message': !registrationSuccessful, 'success-message': registrationSuccessful }">
      {{ errorMessage }}
    </div>
    <div v-if="registrationSuccessful" class="success-message">
      <p>{{ successMessage }}</p>
      <p>Redirecting to login...</p>
    </div>
  </AuthWrapper>
</template>

<style scoped>
.auth-title {
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
  color: var(--pencil-line-color);
  text-align: center
}

.auth-form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.auth-form .form-group label {
  color:  var(--pencil-line-color);
}

.auth-form ::v-deep .custom-input input {
  background-color: var(--grey-input) !important;
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

.login-link {
  color: var(--tree-color);
  font-weight: bold;
}

.login-text-container {
  margin-top: 20px;
  color: var(--pencil-line-color);
  font-weight: bold;
}

.error-message {
  color: red;
  margin-top: 20px;
  text-align: center;
}

.success-message {
  color: green;
  margin-top: 20px;
  text-align: center;
}

.redirect-text {
  margin-top: 10px;
  color: var(--pencil-line-color);
  text-decoration: underline wavy;
  cursor: pointer;
  font-weight: bold;
  font-size: 18px;
  transition: color 0.3s ease;
}

.redirect-text:hover {
  color: var(--tree-color);
}

.text-center {
  text-align: center;
}
</style>
