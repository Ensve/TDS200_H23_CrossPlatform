<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Home</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Home</ion-title>
        </ion-toolbar>
      </ion-header>

      <!-- Pull-to-refresh feature -->
      <ion-refresher slot="fixed" @ionRefresh="refreshPostsView($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <!-- Button to open the gallery -->
      <ion-button @click="openGallery" class="button-open" fill="solid" color="dark" expand="block">
        Gallery
      </ion-button>

      <!-- Post cards rendered based on fetched data -->
      <post-card v-for="spot in posts" :key="spot.id || uniqueFallbackValue"  :spot="spot" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  onIonViewDidEnter, toastController
} from '@ionic/vue';

import {ref} from "vue";
import {useRouter} from "vue-router";
import {
  collection,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import PostCard from "@/components/PostCard.vue";
import {IPostResponse} from "@/models/postModels";

// Initialize Firestore and create a reference for posts
const db = getFirestore();
const posts = ref([]);
const router = useRouter();

// Fetch posts when entering the view
onIonViewDidEnter(async()=>{
  await fetchPosts();
})

// Function to open the gallery view
const openGallery =() => {
  router.replace('/gallery')
}

// Function to refresh the posts view
const refreshPostsView = async (event: CustomEvent) => {
  await fetchPosts();
  event.target.complete();
}

// Function to fetch posts from Firestore
const fetchPosts = (async () => {
  try {
    // Array to store fetched posts
    const results: IPostResponse.posts_upload = [];

    // Query Firestore for posts
    const postsSnapshot = await getDocs(collection(db, "posts_upload"));

    // Iterate through the snapshot and push data to the results array
    postsSnapshot.forEach((doc) => {
      results.push({id: doc.id, ...doc.data()});
    });

    // Update the posts ref with fetched data
    posts.value = results;
    // console.log(posts.value)

    // Display an error toast if fetching posts fails
  } catch (error) {
      const errorToast = await toastController.create({
        message: 'Noe gikk galt ved opplasting av post!',
        duration: 2500,
        position: 'bottom',
        color: 'danger'
    });

    await errorToast.present();
    console.error(error);
  }
})

</script>

<style scoped>
.button-open {
  margin-left: 10px;
  margin-right: 10px;
}
</style>
```