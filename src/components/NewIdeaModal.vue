<!-- components/NewIdeaModal.vue -->
<template>
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
              v-model="newIdea.tags"
              :options="existingTags"
              :multiple="true"
              :taggable="true"
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
          <CustomButton text="Cancel" @click="$emit('close')" class="cancel-button">Cancel</CustomButton>
          <CustomButton text="Create" type="submit" class="create-button">Create</CustomButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CustomButton from '~/src/components/CustomButton.vue';
import vSelect from 'vue-select';
import type {NewIdeaType} from '~/src/types/types.vue';

const props = defineProps({
  showModal: {
    type: Boolean,
    required: true,
  },
  existingTags: {
    type: Array as () => string[],
    default: () => [],
  },
});

const emit = defineEmits(['close', 'create', 'update:existingTags']);

const showOptionalInputs = ref(false);
const newIdea = ref<NewIdeaType>({
  title: '',
  description: '',
  tags: [],
  privacy: 'public',
  inspiration: '',
});

function handleTagInput(selectedTags: any[]) {
  console.log('Selected tags0:', selectedTags);
  if (Array.isArray(selectedTags)) {
    newIdea.value.tags = selectedTags.map((tag) => (typeof tag === 'object' ? tag.label : tag));
    console.log('Selected tags1:', newIdea.value.tags);
  } else {
    newIdea.value.tags = [];
  }
  console.log('Selected tags2:', newIdea.value.tags);
}

function handleTagSearch(newTag: string) {
  if (!props.existingTags.includes(newTag)) {
    emit('update:existingTags', [...props.existingTags, newTag]);
  }
}

function toggleOptionalInputs() {
  showOptionalInputs.value = !showOptionalInputs.value;
}

function createNewIdea() {
  console.log('New idea before emit:', newIdea.value);
  emit('create', { ...newIdea.value });
  // Reset the newIdea object
  newIdea.value = {
    title: '',
    description: '',
    tags: [],
    privacy: 'public',
    inspiration: '',
  };
}
</script>

<style scoped>

.tags-select ::v-deep .vs__dropdown-menu {
  background-color: var(--background-color);
}

.tags-select ::v-deep .vs__dropdown-option:hover {
  background-color: var(--tree-color);
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
  display: flex;
  flex-direction: column;
  align-items: flex-start;
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
  width: 100%;
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