<template>
  <ion-card :router-link="'/detail/' + spot.id">

    <div v-for="(image, index) in spot.image" :key="index">
      <post-image :image-url="image" />
    </div>

    <ion-card-header>
      <ion-card-title>{{ spot.title }}</ion-card-title>
    </ion-card-header>

    <ion-card-content>
      {{ spot.description }}
    </ion-card-content>

  </ion-card>
</template>

<script setup lang="ts">
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent } from "@ionic/vue";
import PostImage from "@/components/PostImage.vue";

interface Props {
  spot: {
    id: number;
    title: string;
    description: string;
    hashtags: string[];
    image: string[];
    comments: string[]
  }
}

defineProps<Props>();

</script>