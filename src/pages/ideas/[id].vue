<!-- pages/ideas/[id].vue -->
<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {useRoute} from 'vue-router';
import {useAuthStore} from '~/src/store/auth';
import type {Idea, Post} from '~/src/types/types.vue';

const route = useRoute();
const router = useRouter();
const ideaId = route.params.id as string;
const idea = ref<Idea | null>(null);
const authStore = useAuthStore();
const config = useRuntimeConfig();
const backUrl = config.public.BACKEND_URL;
const newPost = ref('');
const posts = ref<Post[]>([]);
const editingPostId = ref<string | null>(null);
const editingPostContent = ref('');

async function fetchIdea() {
  try {
    const token = authStore.token;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(`${backUrl}/ideas/${ideaId}`, {headers});
    if (response.ok) {
      const data = await response.json();
      idea.value = data;
      posts.value = data.posts || [];
    } else {
      console.error('HTTP error', response.status);
    }

 await fetchPosts();

  } catch (error) {
    console.error('Fetch error:', error);
  }
}

async function fetchPosts() {
  try {
    const token = authStore.token;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(`${backUrl}/ideas/${ideaId}/posts`, { headers });
    if (response.ok) {
      const data = await response.json();
      posts.value = data.items || [];
    } else {
      console.error('HTTP error', response.status);
    }
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

async function addPost() {
  if (newPost.value.trim()) {
    const token = authStore.token;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const postData = {
      content: newPost.value.trim(),
      ideaId: ideaId,
      authorId: authStore.user_id,
    };

    const response = await fetch(`${backUrl}/ideas/${ideaId}/posts`, {
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
    }
  }
}


async function deletePost(postId: string) {
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
  }
}

function startEditing(post: Post) {
  editingPostId.value = post.id;
  editingPostContent.value = post.content;
}

function cancelEditing() {
  editingPostId.value = null;
  editingPostContent.value = '';
}

async function updatePost(postId: string) {
  if (editingPostContent.value.trim()) {
    const token = authStore.token;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const postData = {
      id: postId,
      content: editingPostContent.value.trim(),
    };

    const response = await fetch(`${backUrl}/posts/${postId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(postData),
    });

    if (response.ok) {
      const updatedPost = await response.json();
      const index = posts.value.findIndex(post => post.id === postId);
      if (index !== -1) {
        posts.value.splice(index, 1, updatedPost);
      }
      editingPostId.value = null;
      editingPostContent.value = '';
    } else {
      console.error('HTTP error', response.status);
    }
  }
}

onMounted(() => {
  if (!authStore.token) {
    // User is not logged in, redirect to the login page
    router.push('/');
  } else {
    fetchIdea();
  }
});
</script>

<template>
  <div v-if="idea" class="idea-details-container">
    <div class="idea-profile">
      <img v-if="idea.avatarURL" :src="'data:image/jpeg;base64,' + idea.avatarURL" alt="Avatar" class="idea-avatar"/>
      <div v-else class="idea-avatar-placeholder"></div>
      <h2 class="idea-title">{{ idea.title }}</h2>
    </div>
    <div class="idea-about">
      <h3>About</h3>
      <p>{{ idea.description }}</p>
      <p><strong>Tags:</strong> {{ idea.tags.join(', ') }}</p>
      <p><strong>Privacy:</strong> {{ idea.privacy }}</p>
      <p><strong>Inspiration:</strong> {{ idea.inspiration }}</p>
    </div>
    <div class="idea-board">
      <h3>Idea Board</h3>
      <div class="new-post">
        <textarea v-model="newPost" placeholder="Add a new post"></textarea>
        <button @click="addPost">Post</button>
      </div>
      <div class="posts">
        <div v-for="post in posts" :key="post.id" class="post">
          <template v-if="editingPostId === post.id">
            <textarea v-model="editingPostContent"></textarea>
            <button @click="updatePost(post.id)">Save</button>
            <button @click="cancelEditing">Cancel</button>
          </template>
          <template v-else>
            <p>{{ post.content }}</p>
<!--            <button @click="startEditing(post)">Edit</button>-->
            <button class="delete-button" @click="deletePost(post.id)">Delete</button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.delete-button {
  margin-top: 5px;
  background-color: var(--shadow-color);
  color: var(--pencil-line-color);
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.5s ease;
}

.delete-button:hover {
  background-color: var(--building-color-opa);
}

.idea-details-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: var(--background-color);
}

.idea-profile {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.idea-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-right: 20px;
}

.idea-avatar-placeholder {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: var(--shadow-color);
  margin-right: 20px;
}

.idea-title {
  font-size: 24px;
  font-weight: bold;
  color: var(--shadow-color);
}

.idea-about {
  margin-bottom: 20px;
}

.idea-about h3 {
  font-size: 18px;
  font-weight: bold;
  color: var(--shadow-color);
  margin-bottom: 10px;
}

.idea-about p {
  margin-bottom: 5px;
}

.idea-board {
  padding: 20px;
  background-color: var(--pencil-line-color);
  border: 4px solid var(--shadow-color);
  border-radius: 8px;
}

.idea-board h3 {
  font-size: 18px;
  font-weight: bold;
  color: var(--shadow-color);
  margin-bottom: 10px;
}

.new-post {
  margin-bottom: 20px;
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

.posts {
  margin-top: 20px;
}

.post {
  background-color: var(--background-color);
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
}
</style>