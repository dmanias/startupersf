<script lang="ts">
export interface Idea {
  id: string
  title: string
  description: string
  tags: string[]
  privacy: string
  inspiration: string
  avatarURL: string
  dateCreated: string;
}

export interface Post {
  id: string;
  ideaId: string;
  authorId: string;
  content: string;
  dateCreated: string;
  dateUpdated: string;
}

</script>

<template>

</template>

<style scoped>

</style>