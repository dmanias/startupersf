<!-- src/components/Post.vue -->
<script setup lang="ts">
import { format } from 'date-fns';
import type { PostType } from '~/src/types/types.vue';

function formatContent(content: string) {
  // Check if the content contains list items
  if (content.includes('- ')) {
    // Split the content into lines
    const lines = content.split('\n');

    // Wrap each line starting with "- " in <li> tags
    const formattedLines = lines.map(line => {
      if (line.startsWith('- ')) {
        return `<li><span class="list-element">&#9679;</span> ${line.slice(2)}</li>`;
      }
      return line;
    });

    // Wrap the formatted lines in <ul> tags
    return `<ul>${formattedLines.join('')}</ul>`;
  }

  // If the content doesn't contain list items, return it as is
  return content;
}

const props = defineProps<{
  post: PostType;
}>();

const emit = defineEmits<{
  (event: 'delete', postId: string): void;
}>();

function deletePost() {
  emit('delete', props.post.id);
}

function formatDate(date: string) {
  return format(new Date(date), 'MMMM d, yyyy');
}
</script>

<template>
  <div class="post" :class="{ 'idea-post': post.ownerType === 'idea' }">
    <div v-html="formatContent(post.content)"></div>
    <p class="post-date">{{ formatDate(post.dateCreated) }}</p>
    <button class="delete-button" @click="deletePost">Delete</button>
  </div>
</template>

<style scoped>
.list-element {
  display: inline-block;
  margin-right: 5px;
  color: var(--shadow-color);
}

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

.post {
  background-color: var(--background-color);
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
}

.idea-post {
  box-shadow: 0 0 10px rgba(0, 123, 255, 0.7);
}

.post-date {
  font-size: 12px;
  color: var(--shadow-color);
  margin-top: 5px;
}
</style>