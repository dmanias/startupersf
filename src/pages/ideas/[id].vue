<!-- pages/ideas/[id].vue -->
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '~/src/store/auth';
import type {IdeaType, JourneyStep, PostType} from '~/src/types/types.vue';
import SimpleAlert from "~/src/components/SimpleAlert.vue";
import { format } from 'date-fns';
import MyWall from '~/src/components/ideas/MyWall.vue';
import Journey from '~/src/components/ideas/Journey.vue';
import type { Step } from '~/src/types/types.vue';

definePageMeta({
  middleware: 'auth',
});

const moderatorId = ref('');
const journey = ref<JourneyStep[]>([]);
const isIdeaPostLoading = ref(false);
const showSimpleAlert = ref(false);
const errorMessage = ref('');
const route = useRoute();
const ideaId = route.params.id as string;
const idea = ref<IdeaType | null>(null);
const authStore = useAuthStore();
const config = useRuntimeConfig();
const backUrl = config.public.BACKEND_URL;
const newPost = ref('');
const posts = ref<PostType[]>([]);
const selectedTab = ref('myWall');
const journeyId = ref('');


async function getAIHelp(step: JourneyStep, index: number) {
  try {
    const token = authStore.token;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    journey.value[index].isAIHelpLoading = true;
    const questionType = 'step';
    const response = await fetch(`${backUrl}/ask/${ideaId}/${questionType}/${step.description}`, { headers });
    if (response.ok) {
      const data = await response.json();
      const aiResponse = data.ai_response;
      step.answer = aiResponse;
    } else {
      console.error('HTTP error', response.status);
      errorMessage.value = 'Failed to fetch AI help. Please try again later.';
      showSimpleAlert.value = true;
    }
  } catch (error) {
    console.error('Fetch error:', error);
    errorMessage.value = 'An error occurred while fetching AI help. Please try again later.';
    showSimpleAlert.value = true;
  } finally {
    journey.value[index].isAIHelpLoading = false;
  }
}


async function deleteJourney() {
  if (journeyId.value) {
    try {
      const token = authStore.token;
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };

      const response = await fetch(`${backUrl}/challenges/${journeyId.value}`, {
        method: 'DELETE',
        headers,
      });

      if (response.ok) {
        // Show a success message
        errorMessage.value = 'Journey deleted successfully!';
        showSimpleAlert.value = true;
        journeyId.value = ''; // Reset the journey ID
        journey.value = []; // Clear the journey data
        await fetchModeratorInstructions(); // Fetch the moderator instructions again
      } else {
        console.error('HTTP error', response.status);
        // Show an error message
        errorMessage.value = 'Failed to delete journey. Please try again later.';
        showSimpleAlert.value = true;
      }
    } catch (error) {
      console.error('Fetch error:', error);
      // Show an error message
      errorMessage.value = 'An error occurred while deleting the journey. Please try again later.';
      showSimpleAlert.value = true;
    }
  }
}

async function fetchJourneyData() {
  try {
    const token = authStore.token;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(`${backUrl}/ideas/${ideaId}/challenges?moderatorID=${moderatorId.value}`, { headers });
    if (response.ok) {
      const data = await response.json();
      if (data.items && data.items.length > 0) {
        const journeyData = JSON.parse(data.items[0].answer);
        journey.value = journey.value.map((step, index) => ({
          ...step,
          answer: journeyData[index]?.answer || '',
        }));
        journeyId.value = data.items[0].id; // Store the journey ID
      }
    } else {
      console.error('HTTP error', response.status);
      // Show an error message
      errorMessage.value = 'Failed to fetch journey data. Please try again later.';
      showSimpleAlert.value = true;
    }
  } catch (error) {
    console.error('Fetch error:', error);
    // Show an error message
    errorMessage.value = 'An error occurred while fetching the journey data. Please try again later.';
    showSimpleAlert.value = true;
  }
}

async function submitJourney() {
  try {
    const token = authStore.token;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const answerData = journey.value.map((step) => ({
      step: step.step,
      answer: step.answer || '',
    }));

    const challengeData = {
      ideaID: ideaId,
      moderatorID: moderatorId.value,
      answer: JSON.stringify(answerData),
    };

    console.log('journey', challengeData);

    let response;

    if (journeyId.value) {
      // If a journey ID exists, use PUT request to update the journey
      const updateData = {
        id: journeyId.value,
        answer: JSON.stringify(answerData),
      };

      response = await fetch(`${backUrl}/challenges/${journeyId.value}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updateData),
      });
    } else {
      // If no journey ID exists, use POST request to create a new journey
      response = await fetch(`${backUrl}/ideas/challenges`, {
        method: 'POST',
        headers,
        body: JSON.stringify(challengeData),
      });
    }

    if (response.ok) {
      // Show a success message
      errorMessage.value = 'Journey submitted successfully!';
      showSimpleAlert.value = true;
      await fetchJourneyData();
    } else {
      console.error('HTTP error', response.status);
      // Show an error message
      errorMessage.value = 'Failed to submit journey. Please try again later.';
      showSimpleAlert.value = true;
    }
  } catch (error) {
    console.error('Fetch error:', error);
    // Show an error message
    errorMessage.value = 'An error occurred while submitting the journey. Please try again later.';
    showSimpleAlert.value = true;
  }
}

async function fetchIdea() {
  try {
    const token = authStore.token;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(`${backUrl}/ideas/${ideaId}`, { headers });
    if (response.ok) {
      const data = await response.json();
      idea.value = data;
      posts.value = data.posts || [];
    } else {
      console.error('HTTP error', response.status);
      // Show an error message
      errorMessage.value = 'Failed to fetch idea. Please try again later.';
      showSimpleAlert.value = true;
    }

    await fetchPosts();
  } catch (error) {
    console.error('Fetch error:', error);
    // Show an error message
    errorMessage.value = 'An error occurred while fetching the idea. Please try again later.';
    showSimpleAlert.value = true;
  }
}

async function fetchPosts() {
  try {
    const token = authStore.token;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(`${backUrl}/ideas/${ideaId}/posts?orderBy=datecreated,DESC`, { headers });
    if (response.ok) {
      const data = await response.json();
      posts.value = data.items || [];
    } else {
      console.error('HTTP error', response.status);
      const data = await response.json();
      errorMessage.value = data.error || 'Failed to fetch posts. Please try again later.';
      showSimpleAlert.value = true;
    }
  } catch (error) {
    console.error('Fetch error:', error);
    errorMessage.value = 'Failed to fetch ideas. Please try again later.';
    showSimpleAlert.value = true;
  }
}

async function addPost() {
  console.log('Adding post:', newPost);
  if (newPost.value.trim()) {
    try {
      const token = authStore.token;
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };

      const postData = {
        content: newPost.value.trim(),
        ideaId: ideaId,
        authorId: authStore.user_id,
        ownerType: "user",
      };

      const response = await fetch(`${backUrl}/ideas/posts`, {
        method: 'POST',
        headers,
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        const createdPost = await response.json();
        posts.value.unshift(createdPost);
        newPost.value = '';
      } else {
        console.error('HTTP error', response.status);
        const data = await response.json();
        errorMessage.value = data.error || 'Failed to add post. Please try again later.';
        showSimpleAlert.value = true;
      }
    } catch (error) {
      console.error('Fetch error:', error);
      errorMessage.value = 'Failed to add post. Please try again later.';
      showSimpleAlert.value = true;
    }
  }
}

async function addIdeaPost() {
  try {
    isIdeaPostLoading.value = true;
    const token = authStore.token;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const postData = {
      ideaID: ideaId,
      authorID: authStore.user_id,
      ownerType: "idea",
      content: newPost.value.trim(),
      title: idea.value?.title || "",
      description: idea.value?.description || "",
      tags: idea.value?.tags || [],
      stage: "Birth",
      inspiration: "",
    };

    const response = await fetch(`${backUrl}/ideas/posts`, {
      method: 'POST',
      headers,
      body: JSON.stringify(postData),
    });

    if (response.ok) {
      const createdPost = await response.json();
      posts.value.unshift(createdPost);
      newPost.value = '';
      isIdeaPostLoading.value = false;
    } else {
      console.error('HTTP error', response.status);
      const data = await response.json();
      errorMessage.value = data.error;
      errorMessage.value = data.error || 'Failed to add idea post. Please try again later.';
      showSimpleAlert.value = true;
      isIdeaPostLoading.value = false;
    }
  } catch (error) {
    console.error('Fetch error:', error);
    errorMessage.value = 'An error occurred while adding the idea post. Please try again later.';
    showSimpleAlert.value = true;
    isIdeaPostLoading.value = false;
  }
}

async function deletePost(postId: string) {
  try {
    const token = authStore.token;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(`${backUrl}/posts/${postId}`, {
      method: 'DELETE',
      headers,
    });

    if (response.ok) {
      posts.value = posts.value.filter(post => post.id !== postId);
    } else {
      console.error('HTTP error', response.status);
      // Show an error message
      errorMessage.value = 'Failed to delete post. Please try again later.';
      showSimpleAlert.value = true;
    }
  } catch (error) {
    console.error('Fetch error:', error);
    errorMessage.value = 'An error occurred while deleting the post. Please try again later.';
    showSimpleAlert.value = true;
  }
}

function closeAlert() {
  showSimpleAlert.value = false;
  errorMessage.value = '';
}

function formatDate(date: string) {
  return format(new Date(date), 'MMMM d, yyyy');
}

async function fetchModeratorInstructions() {
  try {
    const token = authStore.token;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(`${backUrl}/moderators/journey`, { headers });
    if (response.ok) {
      const data = await response.json();
      console.log('Fetched moderator instructions:', data);

      if (data.id && data.moderator) {
        try {
          const parsedModerator = JSON.parse(data.moderator);
          if (Array.isArray(parsedModerator)) {
            journey.value = parsedModerator.map((step: Step) => ({
              ...step,
              answer: '',
              isEditing: false,
              isAIHelpLoading: false,
            }));
            await fetchJourneyData();
            // Store the moderator ID in the reactive variable
            moderatorId.value = data.id;
            console.log('Moderator ID:', moderatorId.value);
          } else {
            console.error('Unexpected data format:', parsedModerator);
          }
        } catch (parseError) {
          console.error('Error parsing moderator data:', parseError);
        }
      } else {
        console.error('Moderator data not found:', data);
      }
    } else {
      console.error('HTTP error', response.status);
      errorMessage.value = 'Failed to fetch moderator instructions. Please try again later.';
      showSimpleAlert.value = true;
    }
  } catch (error) {
    console.error('Fetch error:', error);
    // Show an error message
    errorMessage.value = 'An error occurred while fetching the moderator instructions. Please try again later.';
    showSimpleAlert.value = true;
  }
}

onMounted(() => {
  fetchIdea();
  fetchModeratorInstructions();
  fetchJourneyData(); // Fetch the journey data when the component is mounted
});
</script>

<template>
  <div class="page-container">
  <div v-if="idea" class="idea-details-container">
    <div class="idea-profile">
      <img v-if="idea.avatarURL" :src="`${backUrl}/${idea.avatarURL}`" alt="Avatar" class="idea-avatar" />
      <div v-else class="idea-avatar-placeholder"></div>
      <h2 class="idea-title">{{ idea.title }}</h2>
    </div>
    <div class="idea-about">
      <div class="about-row">
        <p>{{ idea.description }}</p>
      </div>
      <div class="about-row">
        <div class="about-left">
          <p><strong>Inspiration:</strong> {{ idea.inspiration }}</p>
        </div>
        <div class="about-right">
          <p><strong>Tags:</strong> {{ idea.tags.join(', ') }}</p>
        </div>
      </div>
      <div class="about-row">
        <div class="about-left">
          <p><strong>Born:</strong> {{ formatDate(idea.dateCreated) }}</p>
        </div>
        <div class="about-right">
          <p><strong>Privacy:</strong> {{ idea.privacy }}</p>
        </div>
      </div>
    </div>
    <div class="tab-container">
      <div class="tab-navigation">
        <button @click="selectedTab = 'myWall'" :class="{ active: selectedTab === 'myWall' }">My Wall</button>
        <button @click="selectedTab = 'journey'" :class="{ active: selectedTab === 'journey' }">Let's go for a Journey</button>
      </div>
      <div class="idea-board">
        <MyWall
            v-if="selectedTab === 'myWall'"
            :posts="posts"
            :is-idea-post-loading="isIdeaPostLoading"
            :new-post="newPost"
            @add-post="addPost"
            @add-idea-post="addIdeaPost"
            @delete-post="deletePost"
            @update:new-post="newPost = $event"
        />
        <Journey
            v-if="selectedTab === 'journey'"
            :journeySteps="journey"
            @submitJourney="submitJourney"
            @deleteJourney="deleteJourney"
            @getAIHelp="(step) => getAIHelp(step, journey.indexOf(step))"
        />
      </div>
    </div>
    <SimpleAlert v-if="errorMessage" :message="errorMessage" @close="closeAlert"/>
  </div>
  </div>
</template>

<style scoped>
.page-container {
  background-color: var(--background-color);
  min-height: 100vh;
  padding: 20px;
}

.idea-details-container {
  max-width: 800px;
  margin: 0 auto;
  background-color: var(--pencil-line-color);
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: 2px solid var(--shadow-color);
}

.idea-profile {
  background-color: var(--pencil-line-color);
  padding: 20px;
  display: flex;
  align-items: center;
  border-bottom: 4px solid var(--building-color);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.idea-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-right: 20px;
  background-color: var(--pencil-line-color);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.idea-avatar-placeholder {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: var(--pencil-line-color);
  margin-right: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.idea-title {
  color: white;
  font-size: 24px;
  margin: 0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.idea-about {
  padding: 20px;
  background-color: var(--pencil-line-color);
  color: white;
}

.tab-container {
  position: relative;
  background-color: var(--pencil-line-color);
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

.tab-navigation {
  display: flex;
  justify-content: left;
  margin-bottom: -1px;
  position: relative;
  z-index: 1;
}

.tab-navigation button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: var(--background-color);
  color: var(--shadow-color);
  border: 1px solid var(--shadow-color);
  border-bottom: none;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-right: 5px;
}

.tab-navigation button.active {
  background-color: var(--pencil-line-color);
  color: var(--shadow-color);
  border-color: var(--shadow-color);
}

.tab-navigation button:hover {
  background-color: var(--pencil-line-color);
  color: var(--shadow-color);
}

.idea-board {
  padding: 20px;
  background-color: var(--pencil-line-color);
  border: 4px solid var(--shadow-color);
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.idea-details-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: var(--background-color);
}

.about-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.about-left {
  flex: 0.25;
}

.about-right {
  flex: 1;
}

.idea-about p {
  margin-bottom: 5px;
}

.idea-board h3 {
  font-size: 18px;
  font-weight: bold;
  color:  white;
  margin-bottom: 10px;
}

.new-post textarea {
  width: 100%;
  height: 100px;
  padding: 10px;
  border: 2px solid var(--shadow-color);
  border-radius: 5px;
  resize: vertical;
}

.new-post button {
  margin-top: 10px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
  background-color: var(--shadow-color);
  color: var(--pencil-line-color);
  border: none;
}
</style>