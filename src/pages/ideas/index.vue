<!-- pages/ideas/index.vue -->
<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {useRouter} from 'vue-router';
import CustomButton from '~/src/components/CustomButton.vue';
import {useAuthStore} from '~/src/store/auth';
import 'vue-select/dist/vue-select.css';
import SplashScreen from "~/src/components/SplashScreen.vue";
import type {Idea} from '~/src/types/types.vue';
import ActionMenu from "~/src/components/ActionMenu.vue";
import ConfirmationAlert from "~/src/components/ConfirmationAlert.vue";
import SuccessAlert from "~/src/components/SuccessAlert.vue";
import vSelect from 'vue-select'; //it is needed for tags do not delete it

const showSuccessAlert = ref(false);
const showDeleteConfirmation = ref(false);
const ideaToDelete = ref<string | null>(null);
const isLoading = ref(false);
const showSplashScreen = ref(false);
const newlyCreatedIdea = ref<Idea | null>(null);
const authStore = useAuthStore();
const router = useRouter();
const ideas = ref<Idea[]>([]);
const config = useRuntimeConfig();
const backUrl = config.public.BACKEND_URL;
const showOptionalInputs = ref(false);
const showActionMenu = ref('');
const existingTags = ref<string[]>([]);
const showModal = ref(false);
const newIdea = ref({
  title: '',
  description: '',
  tags: [] as string[],
  privacy: 'public',
  inspiration: '',
});

async function fetchIdeas() {
  try {
    // Get the JWT token from the store
    const token = authStore.token;

    // Check if the token exists
    if (!token) {
      // If not, redirect to the login page
      await router.push('/');
      return;
    }

    // Include the token in the headers
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(`${backUrl}/${authStore.user_id}/ideas?order=date_created:desc`, {headers});
    if (response.ok) {
      const data = await response.json();
      ideas.value = data.items;
    } else {
      console.error('HTTP error', response.status);
    }
    const tagsResponse = await fetch(`${backUrl}/tags`, {headers});
    if (tagsResponse.ok) {
      const tagsData = await tagsResponse.json();
      existingTags.value = tagsData;
      console.log(tagsData);
    } else {
      console.error('HTTP error', tagsResponse.status);
    }
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

function handleTagInput(selectedTags: string[]) {
  newIdea.value.tags = selectedTags;
}

function handleTagSearch(newTag: string) {
  if (!existingTags.value.includes(newTag)) {
    existingTags.value = [...existingTags.value, newTag];
  }
}
function toggleModal() {
  showModal.value = !showModal.value;
}

function toggleOptionalInputs() {
  showOptionalInputs.value = !showOptionalInputs.value;
}

async function createNewIdea() {
  try {
    isLoading.value = true; // Set loading state to true
    const token = authStore.token;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const ideaData = {
      ...newIdea.value,
      userID: authStore.user_id,
      stage: 'Birth',
      tags: Array.isArray(newIdea.value.tags) ? newIdea.value.tags.map((tag) => tag.toLowerCase()) : [],
    };

    console.log(ideaData);
    const response = await fetch(`${backUrl}/ideas`, {
      method: 'POST',
      headers,
      body: JSON.stringify(ideaData),
    });

    if (response.ok) {
      // Idea created successfully
      toggleModal();
      newlyCreatedIdea.value = await response.json();
      showSplashScreen.value = true;
      await fetchIdeas();
      newIdea.value = {
        title: '',
        description: '',
        tags: [],
        privacy: 'public',
        inspiration: '',
      };
      isLoading.value = false; // Set loading state to false after successful creation
    } else {
      console.error('HTTP error', response.status);
      isLoading.value = false; // Set loading state to false on error
    }
  } catch (error) {
    console.error('Fetch error:', error);
    isLoading.value = false; // Set loading state to false on error
  }
}

onMounted(() => {
  fetchIdeas();
});

function closeSuccessAlert() {
  showSuccessAlert.value = false;
}

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
      // Idea deleted successfully
      await fetchIdeas();
    } else {
      console.error('HTTP error', response.status);
    }
  } catch (error) {
    console.error('Fetch error:', error);
  }
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
    showSuccessAlert.value = true; // Set showSuccessAlert to true after successful deletion
  }
}

function toggleActionMenu(ideaId: string) {
  showActionMenu.value = showActionMenu.value === ideaId ? '' : ideaId;
}

function closeActionMenu(event: MouseEvent) {
  const target = event.target as HTMLElement;
  const actionMenu = document.querySelector('.action-menu');
  const actionDots = document.querySelector('.action-dots');

  if (
      actionMenu &&
      actionDots &&
      !actionMenu.contains(target) &&
      !actionDots.contains(target)
  ) {
    showActionMenu.value = '';
  }
}

onMounted(() => {
  document.addEventListener('click', closeActionMenu);
});

onUnmounted(() => {
  document.removeEventListener('click', closeActionMenu);
});
</script>

<template>
  <div class="page-container">
    <div class="ideas-list-container">
      <h2 class="ideas-list-title">Brilliant Ideas</h2>
      <div class="ideas-list">
        <div v-if="ideas.length === 0" class="no-ideas-message">
          No ideas found. Let's birth some new ones!
        </div>
        <div v-else>
          <div v-for="idea in ideas" :key="idea.id" class="idea-item">
            <img v-if="idea.avatarURL" :src="'data:image/jpeg;base64,' + idea.avatarURL" alt="Avatar" class="idea-avatar" />
            <div v-else class="idea-avatar-placeholder"></div>
            <span class="idea-name">{{ idea.title }}</span>
            <div class="idea-actions">
              <div class="action-dots" @click="toggleActionMenu(idea.id)">&#8942;</div>
              <div v-if="showActionMenu === idea.id">
                <ActionMenu :idea-id="idea.id" @show-idea="$router.push(`/ideas/${idea.id}`)" @open-delete-confirmation="openDeleteConfirmation" />
              </div>
            </div>
            <p class="idea-date">Created on: {{ new Date(idea.dateCreated).toLocaleDateString() }}</p>
          </div>
        </div>
      </div>
      <div class="create-idea-container">
        <CustomButton text="Birth a New Idea" @click="toggleModal">Birth a New Idea</CustomButton>
      </div>
    </div>
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner"></div>
    </div>
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h2 class="modal-title">Birth a New Idea</h2>
        <form @submit.prevent="createNewIdea" class="modal-form">
          <div class="form-group">
            <label for="title">Title:</label>
            <input type="text" id="title" v-model="newIdea.title" required class="form-input"/>
          </div>
          <div class="form-group">
            <label for="description">Description:</label>
            <textarea id="description" v-model="newIdea.description" required class="form-textarea"></textarea>
          </div>
          <div class="form-group">
            <label for="tags">Tags:</label>
            <v-select
                id="tags"
                :value="newIdea.tags"
                :options="existingTags"
                :multiple="true"
                :taggable="true"
                @input="handleTagInput"
                @search="handleTagSearch"
                placeholder="Select or create tags"
                class="form-input tags-select"
            ></v-select>
          </div>
          <div v-if="showOptionalInputs" class="optional-inputs">
            <div class="form-group">
              <label for="privacy">Privacy:</label>
              <select id="privacy" v-model="newIdea.privacy" class="form-select">
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
            <div class="form-group">
              <label for="inspiration">Inspiration:</label>
              <textarea id="inspiration" v-model="newIdea.inspiration" class="form-textarea"></textarea>
            </div>
          </div>
          <div class="toggle-optional" @click="toggleOptionalInputs">
            <span v-if="showOptionalInputs">Hide Optional Inputs &#x25B2;</span>
            <span v-else>Show Optional Inputs &#x25BC;</span>
          </div>
          <div class="modal-actions">
            <CustomButton text="Cancel" @click="toggleModal" class="cancel-button">Cancel</CustomButton>
            <CustomButton text="Create" type="submit" class="create-button">Create</CustomButton>
          </div>
        </form>
      </div>
    </div>
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
    <SuccessAlert v-if="showSuccessAlert" message="Murdered :)" @close="closeSuccessAlert" />
  </div>
</template>

<style scoped>
.idea-date {
  font-size: 0.8em;
  color: gray;
}

.delete-confirmation-modal h3 {
  font-size: 18px;
  font-weight: bold;
  color: var(--shadow-color);
  margin-bottom: 20px;
}

.idea-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 10px;
  border-bottom: 2px dashed var(--shadow-color);
}

.idea-actions {
  position: relative;
}

.action-dots {
  cursor: pointer;
  font-size: 24px;
  color: var(--shadow-color);
}

.splash-screen-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
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
.idea-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}
.idea-avatar-placeholder {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--shadow-color);
  margin-right: 10px;
}

.form-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

.form-group label {
  color: var(--shadow-color);
  font-weight: bold;
  margin-bottom: 5px;
  text-align: left;
}

.page-container {
  background-color: var(--background-color);
  min-height: 100vh;
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

.ideas-list {
  background-color: var(--pencil-line-color);
  border: 4px solid var(--shadow-color);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.no-ideas-message {
  color: var(--shadow-color);
  text-align: center;
  font-style: italic;
}

.idea-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  padding: 10px;
  border-bottom: 2px dashed var(--shadow-color);
}

.idea-name {
  font-size: 18px;
  color: var(--shadow-color);
}

.create-idea-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}


.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background-color: var(--pencil-line-color);
  padding: 20px;
  border-radius: 10px;
  max-width: 400px;
  width: 100%;
  border: 4px solid var(--shadow-color);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  max-height: 80vh;
  overflow-y: auto;
}

.modal-title {
  font-size: 20px;
  font-weight: bold;
  color: var(--shadow-color);
  margin-bottom: 15px;
  text-align: center;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  color: var(--shadow-color);
  font-weight: bold;
  margin-bottom: 5px;
  text-align: left;
}

.form-input,
.form-textarea,
.form-select {
  border: 2px solid var(--shadow-color);
  border-radius: 5px;
  padding: 8px;
  font-size: 14px;
  color: var(--shadow-color);
  background-color: var(--pencil-line-color);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.optional-inputs {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 2px dashed var(--shadow-color);
}

.toggle-optional {
  color: var(--shadow-color);
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 15px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cancel-button,
.create-button {
  padding: 8px 16px;
  font-size: 14px;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
}

.cancel-button {
  background-color: var(--pencil-line-color);
  color: var(--shadow-color);
  border: 2px solid var(--shadow-color);
}

.create-button {
  background-color: var(--shadow-color);
  color: var(--pencil-line-color);
  border: none;
}
</style>