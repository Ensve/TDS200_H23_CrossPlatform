<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Gallery 📷</ion-title>
        <ion-buttons slot="start">
          <ion-button @click="backHome">
            <ion-icon :icon="arrowBack"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" id="main-content">
      <ion-refresher slot="fixed" @ionRefresh="refreshPosts($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      <div v-for="(image, index) in imageList" :key="index">
        <post-image :image-url="image.url" />
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { onIonViewDidEnter, IonContent, IonButtons, IonButton, IonHeader, IonPage, IonTitle, IonToolbar, toastController } from '@ionic/vue';
import { ref } from 'vue';
import { getApp } from "firebase/app";
import { getStorage, ref as storageRef, getDownloadURL, listAll } from "firebase/storage";
import { useRouter } from 'vue-router';
import { arrowBack} from 'ionicons/icons';
import PostImage from "@/components/PostImage.vue";
const firebaseApp = getApp();
const storage = getStorage(firebaseApp);
const imageList = ref([]);

const router = useRouter();
const backHome =() => {
  router.replace('/tabs/tab1')
}
onIonViewDidEnter(async()=>{
  await fetchPosts();
})


const refreshPosts = async (event: CustomEvent) => {
  await fetchPosts();
  event.target.complete();
}

const fetchPosts = (async () => {
  // List the items (images) in the specified folder
  try {
    const imagesRef = storageRef(storage, 'images');
    const listResult = await listAll(imagesRef)

    for (const item of listResult.items) {
      const url = await getDownloadURL(item);
      imageList.value.push({ name: item.name, url });
    }
  } catch (error) {
    const errorToast = await toastController.create({
      message: 'Something went wrong when uploading the post!',
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

ion-content {
  --ion-background-color: #f4f4f4;
  display: flex;
}

ion-button::part(native) {
  background: linear-gradient(62deg, #8264ed 0%, #c736e8 100%);
  color: white;
}

</style>