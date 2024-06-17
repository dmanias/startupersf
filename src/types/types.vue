<script lang="ts">
export interface IdeaType {
  id: string
  title: string
  description: string
  tags: string[]
  privacy: string
  inspiration: string
  avatarURL: string
  dateCreated: string;
}

export interface Step {
  step: string;
  title: string;
  description: string;
  example: string;
}

export interface JourneyStep extends Step {
  answer: string;
  id?: string;
  photoURL?: string;
  isEditing: boolean;
}

export interface NewIdeaType {
  title: string
  description: string
  tags: string[]
  privacy: string
  inspiration: string
}

export interface PostType {
  id: string;
  ideaId: string;
  authorId: string;
  content: string;
  dateCreated: string;
  dateUpdated: string;
  ownerType: string;
}

export interface DecodedTokenType {
  iss: string;
  sub: string;
  exp: number;
  iat: number;
  roles: string[];
  userName: string;
}
</script>

<template>

</template>

<style scoped>

</style>