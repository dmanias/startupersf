<!-- pages/ideas/index.vue -->
<script setup lang="ts">
import {computed, onMounted, ref} from 'vue';
import {useRouter} from 'vue-router';
import CustomButton from '~/src/components/CustomButton.vue';
import {useAuthStore} from '~/src/store/auth';
import 'vue-select/dist/vue-select.css';
import SplashScreen from "~/src/components/SplashScreen.vue";
import type {DecodedTokenType, IdeaType, NewIdeaType} from '~/src/types/types.vue';
import ConfirmationAlert from "~/src/components/ConfirmationAlert.vue";
// import vSelect from 'vue-select';
import SearchBar from '~/src/components/SearchBar.vue';
import IdeasList from '~/src/components/ideas/IdeasList.vue';
import NewIdeaModal from '~/src/components/NewIdeaModal.vue';
import SimpleAlert from "~/src/components/SimpleAlert.vue";

// import { useCookie } from 'nuxt/app';
// import { jwtDecode } from 'jwt-decode';

const errorMessage = ref('');
const searchQuery = ref('');
const showSimpleAlert = ref(false);
const showDeleteConfirmation = ref(false);
const ideaToDelete = ref<string | null>(null);
const isLoading = ref(false);
const showSplashScreen = ref(false);
const newlyCreatedIdea = ref<IdeaType | null>(null);
const authStore = useAuthStore();
const router = useRouter();
const ideas = ref<IdeaType[]>([]);
const config = useRuntimeConfig();
const backUrl = config.public.BACKEND_URL;
const existingTags = ref<string[]>([]);
const showModal = ref(false);
const itemsPerPage = ref(10);
const currentPage = ref(1);

definePageMeta({
  middleware: 'auth',
});

const totalIdeas = computed(() => {
  return filteredIdeas.value.length;
});

const filteredIdeas = computed(() => {
  return ideas.value.filter((idea) =>
      idea.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const paginatedIdeas = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  const endIndex = startIndex + itemsPerPage.value;
  return filteredIdeas.value.slice(startIndex, endIndex);
});

async function fetchIdeas() {
  try {
    const token = authStore.token;
    if (!token) {
      await router.push('/');
      return;
    }

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(`${backUrl}/${authStore.user_id}/ideas?orderBy=datecreated,DESC`, {headers});
    if (response.ok) {
      const data = await response.json();
      ideas.value = data.items;
    } else {
      const data = await response.json();
      console.error('HTTP error', response.status);
      errorMessage.value = data.error;
    }
    const tagsResponse = await fetch(`${backUrl}/tags`, { headers });
    if (tagsResponse.ok) {
      const tagsData = await tagsResponse.json();
      existingTags.value = tagsData || []; // Assign an empty array if tagsData is null or undefined
      console.log(tagsData);
    } else {
      console.error('HTTP error', tagsResponse.status);
    }
  } catch (error) {
    console.error('Fetch error:', error);
    errorMessage.value = 'Failed to fetch ideas. Please try again later.';
  }
}

function toggleModal() {
  showModal.value = !showModal.value;
}

async function createNewIdea(newIdeaData: NewIdeaType) {
  console.log('Received newIdeaData:', newIdeaData);
  try {
    isLoading.value = true;
    const token = authStore.token;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const ideaData = {
      ...newIdeaData,
      userID: authStore.user_id,
      stage: 'Birth',
      tags: newIdeaData.tags,
      inspiration: newIdeaData.inspiration,
    };

    console.log('ideaData:', ideaData);
    const response = await fetch(`${backUrl}/ideas`, {
      method: 'POST',
      headers,
      body: JSON.stringify(ideaData),
    });
console.log('response');
    if (response.ok) {
      toggleModal();
      newlyCreatedIdea.value = await response.json();
      console.log('Idea created successfully', newlyCreatedIdea.value);
      showSplashScreen.value = true;
      await fetchIdeas();
      isLoading.value = false;
    } else {
      console.error('HTTP error', response.status);
      isLoading.value = false;
      const data = await response.json();
      errorMessage.value = data.error;
    }
  } catch (error) {
    console.error('Fetch error:', error);
    isLoading.value = false;
    errorMessage.value = 'Failed to create a new idea. Please try again later.';
  }
}

onMounted(() => {
  fetchIdeas();
});

async function deleteIdea(ideaId: string) {
  try {
    const token = authStore.token;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(`${backUrl}/ideas/${ideaId}`, {
      method: 'DELETE',
      headers,
    });

    if (response.ok) {
      await fetchIdeas();
      showSimpleAlert.value = true;
    } else {
      console.error('HTTP error', response.status);
      const data = await response.json();
      errorMessage.value = data.error;
    }
  } catch (error) {
    console.error('Fetch error:', error);
    errorMessage.value = 'Failed to delete idea. Please try again later.';
  }
}

function closeAlert() {
  showSimpleAlert.value = false;
  errorMessage.value = '';
}

function openDeleteConfirmation(ideaId: string) {
  ideaToDelete.value = ideaId;
  showDeleteConfirmation.value = true;
}

function closeDeleteConfirmation() {
  ideaToDelete.value = null;
  showDeleteConfirmation.value = false;
}

async function confirmDelete() {
  if (ideaToDelete.value) {
    await deleteIdea(ideaToDelete.value);
    closeDeleteConfirmation();
  }
}
</script>

<template>
  <div class="page-container">
    <div class="ideas-list-container">
      <h2 class="ideas-list-title">Brilliant Ideas</h2>
      <SearchBar @search="searchQuery = $event"/>
      <IdeasList
          :ideas="paginatedIdeas"
          :items-per-page="itemsPerPage"
          :current-page="currentPage"
          :total-items="totalIdeas"
          @update:items-per-page="itemsPerPage = $event"
          @update:current-page="currentPage = $event"
          @open-delete-confirmation="openDeleteConfirmation"
      />
      <div class="create-idea-container">
        <CustomButton text="Birth a New Idea" @click="toggleModal">Birth a New Idea</CustomButton>
      </div>
    </div>
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner"></div>
    </div>
    <NewIdeaModal
        :show-modal="showModal"
        :existing-tags="existingTags"
        @close="toggleModal"
        @create="createNewIdea"
        @update:existing-tags="existingTags = $event"
    />
    <SplashScreen
        :show-splash-screen="showSplashScreen"
        :newly-created-idea="newlyCreatedIdea"
        @close="showSplashScreen = false"
        class="splash-screen-container"
    ></SplashScreen>
    <ConfirmationAlert
        v-if="showDeleteConfirmation"
        message="Are you gonna kill this idea?"
        @confirm="confirmDelete"
        @cancel="closeDeleteConfirmation"
    />
    <SimpleAlert v-if="errorMessage" :message="errorMessage" @close="closeAlert"/>
    <SimpleAlert v-if="showSimpleAlert" message="Murdered :)" @close="closeAlert"/>
  </div>
</template>

<style scoped>
.page-container {
  background-color: var(--background-color);
  min-height: 100vh;
  position: relative;
  z-index: 1;
}

.ideas-list-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.ideas-list-title {
  font-size: 24px;
  font-weight: bold;
  color: var(--shadow-color);
  text-align: center;
  margin-bottom: 20px;
}

.create-idea-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-spinner {
  border: 4px solid var(--pencil-line-color);
  border-top: 4px solid var(--shadow-color);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
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