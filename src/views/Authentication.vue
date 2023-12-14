<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title></ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-list>
      <ion-list-header>
        <ion-label>Welcome to TravelSnap</ion-label>
      </ion-list-header>
        <img class="hero-image" src="/assets/travelsnapImage.png"  alt=""/>

        <ion-item lines="none">
          <ion-label class="label-mild">New user?</ion-label>

          <!-- Toggle for switching between login and registration mode -->
          <ion-toggle color="dark" @ion-change="inRegisterMode = !inRegisterMode"></ion-toggle>
        </ion-item>

        <!-- Form fields for registration mode -->
        <ion-item v-if="inRegisterMode">
          <ion-label position="floating">First name</ion-label>
          <ion-input v-model="userDetails.firstName"></ion-input>
        </ion-item>

        <!-- Form fields for both login and registration -->
        <ion-item>
          <ion-label position="floating">Email</ion-label>
          <ion-input v-model="userDetails.email"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Password</ion-label>
          <ion-input v-model="userDetails.password" type="password"></ion-input>
        </ion-item>

        <!-- Button for registration -->
        <ion-button v-if="inRegisterMode" @click="register" class="button-auth" fill="solid" color="dark" expand="block">
          Register
        </ion-button>

        <!-- Button for login -->
        <ion-button v-else @click="login"  class="button-auth" fill="solid" color="dark" size="default" expand="block">
          Login
        </ion-button>

        <!-- Button for Google Sign-In -->
        <ion-button @click="googleLogin" class="button-auth" fill="solid" color="dark" size="default" expand="block">
          <ion-icon slot="start" :icon="logoGoogle"></ion-icon>
          Sign in with Google
        </ion-button>

        <!-- Display error message if form submission is attempted with missing fields -->
        <ion-content v-if="isFormSubmitted && isErrorVisible" class="error-message">
          <ion-text>
            Please fill in all required fields.
          </ion-text>

        </ion-content>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonContent,
  IonList,
  IonListHeader,
  IonText,
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonToggle,
  IonIcon
} from '@ionic/vue';

import {computed, ref} from "vue";

import { useRouter } from "vue-router";

import {authService} from "@/services/firebase.authservice";

import { logoGoogle } from 'ionicons/icons';

// Initialize router
const router = useRouter();

const inRegisterMode = ref(false);
const userDetails = ref({
  id: '',
  firstName: '',
  email: '',
  password: '',
  profilePhotoUrl: ''
});

const isFormSubmitted = ref(false);


// Function for login
const login = async () => {
  isFormSubmitted.value = true;
  if (isErrorVisible.value) {
    return;
  }
  try {
    await authService.login(userDetails.value.email, userDetails.value.password);
    await router.push('/tabs/tab1');

  } catch (error) {
    console.error(error);
  }
}

// Function for registration
const register = async () => {
  isFormSubmitted.value = true;
  if (isErrorVisible.value) {
    return;
  }
  try {
    await authService.register(userDetails.value.email, userDetails.value.password);
    await login();
  } catch (error) {
    console.log(error);
  }
}

// Function for Google Sign-In
const googleLogin = async ()=>{
  try {
    await authService.signinWithGoogle();
    await router.replace('/tabs/tab1');

  } catch (error) {
    console.error(error);
  }
}

// Property to determine if error message should be visible
const isErrorVisible = computed(() => {
  if (inRegisterMode.value) {
    return userDetails.value.firstName.trim() === '' ||
        userDetails.value.email.trim() === '' ||
        userDetails.value.password.trim() === '';
  } else {
    return userDetails.value.email.trim() === '' ||
        userDetails.value.password.trim() === '';
  }
});

</script>

<style scoped>

ion-content {
  --ion-background-color: #f4f4f4;
  display: flex;
}

ion-list-header {
  text-align: center;
}

ion-list {
  display: flex;
  flex-direction: column;
}

.button-auth {
  margin-top: 50px;
  margin-left: 10px;
  margin-right: 10px;
}

.error-message {
  color: #842029;
  background-color: #f8d7da;
  border-color: #f5c2c7;
  text-align: center;
}

.hero-image {
  width: 80vw;
  align-self: center;
}

img.hero-image {
  width: auto;
  height: 30vh;
}
</style>
