<script setup lang="ts">
import { object, string, type InferType } from 'yup';
import type { FormSubmitEvent } from '#ui/types';
import { useRouter } from 'nuxt/app';
import { useAuthStore } from '~/src/store/auth';

const schema = object({
  text: string()
      .required('Required')
      .min(10, 'Text must be at least 10 characters long'),
});

type Schema = InferType<typeof schema>;

const state = reactive({
  text: '',
});

const router = useRouter();
const config = useRuntimeConfig();
const backUrl = config.public.BACKEND_URL;
const showAlert = ref(false);
const alertTitle = ref('');
const alertDescription = ref('');

const authStore = useAuthStore();
const isLoggedIn = computed(() => !!authStore.token);

const isLoading = ref(false);


async function onSubmit(event: FormSubmitEvent<Schema>) {
  isLoading.value = true; // Set isLoading to true when the form is submitted
  const body = JSON.stringify({ query: state.text });

  try {
    // Get the JWT token from the store
    const token = authStore.token;

    // Include the token in the headers
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
    }, 600000); // Set the desired timeout value in milliseconds 600000 = 10 minutes

    const response = await fetch(`${backUrl}/ask`, {
      method: 'POST',
      headers,
      body,
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      console.error('HTTP error', response.status);
      showAlert.value = true;
      alertTitle.value = 'Error';
      alertDescription.value = `An HTTP error occurred: ${response.status}`;
    } else {
      console.log('Response received');
      const decoder = new TextDecoder('utf-8');
      const responseData = await response.arrayBuffer();
      const decodedData = decoder.decode(responseData);
      const data = JSON.parse(decodedData);
      console.log(data);
      if (!data || Object.keys(data).length === 0) {
        console.error('No data received');
        showAlert.value = true;
        alertTitle.value = 'No Data';
        alertDescription.value = 'The server did not return any data.';
      } else {
        await router.push({ path: '/response', query: { data: JSON.stringify(data) } }); // Convert data to a string
      }
    }
  } catch (error) {
    console.error('Fetch error:', error);
    console.error('Error details:', error.message);
    showAlert.value = true;
    alertTitle.value = 'Fetch Error';
    alertDescription.value = 'An error occurred while fetching data from the server.';
  }  finally {
    isLoading.value = false; // Set isLoading to false when the request is completed (success or error)
  }
}
</script>
<template>
  <div class="center">
    <UAlert v-if="showAlert" :title="alertTitle" :description="alertDescription" />
    <UForm v-if="!isLoading" :schema="schema" :state="state" class="space-y-4 box" @submit="onSubmit">
      <UFormGroup name="text">
        <UTextarea
            v-if="isLoggedIn"
            v-model="state.text"
            placeholder="Add your Startup Idea, pls. If no concrete idea is provided, a report for test idea will be generated."
            rows="8"
            style="font-size: 18px;"
        />
        <div v-else class="login-message">
          Please log in to enter your startup idea.
        </div>
      </UFormGroup>
      <UButton class="button-container" type="submit" :disabled="!isLoggedIn">
        Ask
      </UButton>
    </UForm>
    <div v-else class="loader-container">
      <div class="loader"></div>
      <p>Loading...</p>
    </div>
  </div>
</template>

<style scoped>
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-message {
  font-size: 18px;
  color: #888;
  text-align: center;
  padding: 20px;
}

.box {
  width: 80%;
  max-width: 600px;
  padding: 30px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  overflow: hidden;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.button-container {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  font-size: 20px;
}


.loader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
}

.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
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