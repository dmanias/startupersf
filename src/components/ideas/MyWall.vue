<!-- components/MyWall.vue -->
<template>
  <div>
    <div class="new-post">
      <textarea v-model="localNewPost" placeholder="Add a new post" :disabled="isIdeaPostLoading" @input="$emit('update:newPost', localNewPost)"></textarea>
      <div class="post-buttons">
        <button @click="addPost" :disabled="isIdeaPostLoading">Post</button>
        <button @click="addIdeaPost" :disabled="isIdeaPostLoading" class="idea-button">
          I have something to say
          <span v-if="isIdeaPostLoading" class="loading-spinner"></span>
        </button>
      </div>
    </div>
    <div class="posts">
      <Post v-for="post in posts" :key="post.id" :post="post" @delete="deletePost" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { PostType } from '~/src/types/types.vue';
import Post from '~/src/components/ideas/Post.vue';

const props = defineProps<{
  posts: PostType[];
  isIdeaPostLoading: boolean;
  newPost: string;
}>();

const emit = defineEmits<{
  (e: 'addPost'): void;
  (e: 'addIdeaPost'): void;
  (e: 'deletePost', postId: string): void;
  (e: 'update:newPost', value: string): void;
}>();

const localNewPost = ref(props.newPost);

watch(() => props.newPost, (newValue) => {
  localNewPost.value = newValue;
});

function addPost() {
  emit('addPost');
}

function addIdeaPost() {
  emit('addIdeaPost');
}

function deletePost(postId: string) {
  emit('deletePost', postId);
}
</script>

<style scoped>
.new-post {
  margin-bottom: 20px;
  color: var(--shadow-color);
}

.new-post textarea {
  width: 100%;
  height: 100px;
  padding: 10px;
  border: 2px solid var(--shadow-color);
  border-radius: 5px;
  resize: vertical;
  color: var(--pencil-line-color);
  background-color: var(--shadow-color);
}

.new-post textarea::placeholder {
  color: var(--pencil-line-color);
}

.post-buttons {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.post-buttons button {
  padding: 8px 16px;
  font-size: 14px;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
  background-color: var(--shadow-color);
  color: var(--pencil-line-color);
  border: none;
}

.idea-button {
  box-shadow: 0 0 10px rgba(0, 123, 255, 0.7);
  font-style: italic;
}

.loading-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid var(--pencil-line-color);
  border-top: 2px solid var(--shadow-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-left: 5px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.posts {
  margin-top: 20px;
}
</style>