<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Profile</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Profile</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content :fullscreen="true" v-if="currentUserData">
        <div class="content-center">
          <h2>{{ currentUserData.displayName }}</h2>
          <p>{{ currentUserData.email }}</p>
          <ion-button @click="logout" class="logout-button">Logout</ion-button>
        </div>
      </ion-content>
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
  IonButton,
  onIonViewDidEnter
} from '@ionic/vue';
import {authService} from "@/services/firebase.authservice";
import {ref} from "vue";
import router from "@/router";

const currentUserData = ref(null);

const userDetails = ref({
  id: '',
  firstName: '',
  email: '',
  password: '',
  profilePhotoUrl: ''
});


onIonViewDidEnter(async()=>{
  currentUserData.value= await authService.currentUser();
})

const logout = async() => {
  try {
    await authService.logout();
    localStorage.removeItem("auth_token");
    await router.replace('/');

  } catch (error) {
    console.error(error)
  }
}

</script>

<style>

.content-center {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  height: 100%;
}

.logout-button {
  color:  white;
  text-decoration: none;
  margin: 0 auto;
  text-align:center;
}

</style>