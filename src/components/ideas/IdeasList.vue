<template>
  <div class="ideas-list">
    <div v-if="ideas.length === 0" class="no-ideas-message">
      No ideas found. Let's birth some new ones!
    </div>
    <div v-else>
      <div class="idea-headers">
        <div class="idea-header avatar-header"></div>
        <div class="idea-header title-header">Title</div>
        <div class="idea-header tags-header">Tags</div>
        <div class="idea-header date-header">Created On</div>
        <div class="idea-header actions-header"></div>
      </div>
      <div v-for="idea in ideas" :key="idea.id" class="idea-item">
        <div class="idea-field avatar-field" @click="showIdea(idea.id)">
          <img v-if="idea.avatarURL" :src="`${backUrl}/${idea.avatarURL}`" alt="Avatar" class="idea-avatar" />
          <div v-else class="idea-avatar-placeholder"></div>
        </div>
        <div class="idea-field title-field" @click="showIdea(idea.id)">
          <span class="idea-name">{{ idea.title }}</span>
        </div>
        <div class="idea-field tags-field" @click="showIdea(idea.id)">
          <span class="idea-tags" v-if="idea.tags && idea.tags.length > 0">
            {{ idea.tags.join(', ') }}
          </span>
        </div>
        <div class="idea-field date-field" @click="showIdea(idea.id)">
          <span class="idea-date">{{ formatDate(idea.dateCreated) }}</span>
        </div>
        <div class="idea-field actions-field">
          <div class="idea-actions">
            <div class="action-dots" @click.stop="toggleActionMenu(idea.id)">&#8942;</div>
            <div v-if="showActionMenu === idea.id" ref="actionMenu" class="action-menu-container">
              <ActionMenu
                  :idea-id="idea.id"
                  @open-delete-confirmation="openDeleteConfirmation"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <Pagination
        :total-items="totalItems"
        :items-per-page="itemsPerPage"
        :current-page="currentPage"
        @update:items-per-page="$emit('update:itemsPerPage', $event)"
        @update:current-page="$emit('update:currentPage', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import type { IdeaType } from '~/src/types/types.vue';
import ActionMenu from '~/src/components/ActionMenu.vue';
import { format } from 'date-fns';
import Pagination from '~/src/components/Pagination.vue';

const config = useRuntimeConfig();
const backUrl = config.public.BACKEND_URL;
const props = defineProps<{
  ideas: IdeaType[];
  itemsPerPage: number;
  currentPage: number;
  totalItems: number;
}>();

const emit = defineEmits(['update:itemsPerPage', 'update:currentPage', 'open-delete-confirmation']);

const router = useRouter();
const showActionMenu = ref('');
const actionMenuRef = ref<HTMLElement | null>(null);

function formatDate(date: string) {
  return format(new Date(date), 'MMMM d, yyyy');
}

function toggleActionMenu(ideaId: string) {
  if (showActionMenu.value === ideaId) {
    showActionMenu.value = ''; // Close the action menu if it's already open for the same idea
    removeOutsideClickListener();
  } else {
    showActionMenu.value = ideaId; // Open the action menu for the clicked idea
    nextTick(() => {
      actionMenuRef.value = document.querySelector(`.action-menu-container`);
      addOutsideClickListener();
    });
  }
}

function openDeleteConfirmation(ideaId: string) {
  emit('open-delete-confirmation', ideaId);
}

function showIdea(ideaId: string) {
  router.push({ path: `/ideas/${ideaId}` });
}

function handleOutsideClick(event: MouseEvent) {
  if (actionMenuRef.value && !actionMenuRef.value.contains(event.target as Node)) {
    showActionMenu.value = '';
    removeOutsideClickListener();
  }
}

function addOutsideClickListener() {
  document.addEventListener('click', handleOutsideClick);
}

function removeOutsideClickListener() {
  document.removeEventListener('click', handleOutsideClick);
}

onBeforeUnmount(() => {
  removeOutsideClickListener();
});
</script>

<style scoped>
.idea-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 2px dashed var(--shadow-color);
  cursor: pointer;
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

.idea-headers {
  display: flex;
  font-weight: bold;
  padding: 10px;
  border-bottom: 2px solid var(--shadow-color);
}

.idea-header {
  display: flex;
  align-items: center;
  flex: 1;
}

.avatar-header {
  flex: 0 0 60px;
}

.title-header {
  flex: 2;
  margin-left: 10px;
}

.tags-header,
.date-header {
  flex: 1;
}

.actions-header {
  flex: 0 0 100px;
}

.idea-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 2px dashed var(--shadow-color);
}

.idea-field {
  flex: 1;
  display: flex;
  align-items: center;
}

.avatar-field {
  flex: 0 0 60px;
}

.title-field {
  flex: 2;
  margin-left: 10px;
}

.actions-field {
  flex: 0 0 100px;
  justify-content: flex-end;
}

.idea-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.idea-avatar-placeholder {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--shadow-color);
}

.idea-name {
  font-size: 18px;
  color: var(--shadow-color);
}

.idea-tags {
  font-size: 14px;
  color: gray;
}

.idea-date {
  font-size: 0.8em;
  color: gray;
}

.idea-actions {
  position: relative;
}

.action-dots {
  cursor: pointer;
  font-size: 24px;
  color: var(--shadow-color);
}
</style>
