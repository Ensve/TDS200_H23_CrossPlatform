<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Upload</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Upload</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-list>
        <!-- Button to trigger camera -->
        <ion-button class="image-picker" color="light" @click="triggerCamera">
          Chose file or take picture 📸
        </ion-button>

        <!-- Image preview section -->
        <section v-if="newPost.image.length">
          <div v-for="(image, index) in newPost.image" :key="index" class="image-preview">
            <img :src="image" alt="" />
            <!-- Button to remove image preview -->
            <ion-button fill="default" class="remove-image-preview" @click="() => removeImagePreview(index)">
              <ion-icon slot="icon-only" :icon="trashOutline" color="danger"></ion-icon>
            </ion-button>
          </div>
        </section>

        <!-- Input for post title -->
        <ion-item>
          <ion-label class="label-mild" position="floating">Title</ion-label>
          <ion-input type="text" v-model="newPost.title"></ion-input>
        </ion-item>

        <!-- Textarea for post description -->
        <ion-item>
          <ion-label class="label-mild" position="floating">Description</ion-label>
          <ion-textarea type="text" v-model="newPost.description"></ion-textarea>
        </ion-item>

        <!-- Input for adding hashtags -->
        <ion-item>
          <ion-label class="label-mild" position="floating">Hashtag</ion-label>
          <ion-input type="text" v-model="newHashtagText"></ion-input>

          <!-- Display added hashtags as chips -->
          <ion-button slot="end" color="dark" size="default" @click="addNewHashtag">
            <ion-icon :icon="add"></ion-icon>
          </ion-button>
        </ion-item>

        <ion-item lines="none">
          <ion-chip color="primary" v-for="tag in newPost.hashtags" :key="tag">{{tag}}</ion-chip>
        </ion-item>

        <!-- Button to upload the new post -->
        <ion-button @click="uploadNewPost" class="button-add" fill="solid" color="dark" size="default" expand="block">
          Upload
        </ion-button>
      </ion-list>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonList, toastController, IonTextarea, IonChip, IonButton, IonItem } from '@ionic/vue';
import { add, trashOutline } from 'ionicons/icons';
import { getFirestore, doc, setDoc, collection } from "firebase/firestore";
import { Camera, CameraResultType } from '@capacitor/camera';
import {
  getStorage,
  uploadBytes,
  getDownloadURL,
  ref as dbRef,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import {ref} from "vue";
import { useRouter } from 'vue-router';
import {INewPost} from "@/models/postModels";

const router = useRouter();

// Create a reference for new hashtag text
const newHashtagText = ref("");

const newPost = ref(<INewPost>{
  title: "",
  description: "",
  hashtags: [],
  image: [],
  id: ""
});

// Create a reference for the posts collection
const postsCollection = collection(getFirestore(), "posts_upload");

// Function to add a new hashtag to the post
const addNewHashtag = () => {
  if (newHashtagText.value) {
    newPost.value.hashtags.push(newHashtagText.value);
    newPost.value.hashtags = [...newPost.value.hashtags, newHashtagText.value];
    newHashtagText.value = "";
  }
};

// Function to upload a new post
const uploadNewPost = async () => {

  // Check if there are no images in the new post
  if (newPost.value.image.length === 0) {
    alert("You have to add at least one image!");
    return;
  }

  try {
    // Generate a unique identifier for the new post
    const generatedUUID = uuidv4();

    // Array to store the URLs of the uploaded images
    const newImageUrls = [];

    // Iterate through each image in the new post
    for (const image of newPost.value.image) {

      // Generate a unique name for the image
      const imageName = new Date().getTime() + '.jpg';

      // Get references to Firebase storage
      const storageRef = getStorage();
      const imageRef = dbRef(storageRef, `images/${imageName}`);
      const response = await fetch(image);

      const imageBlob = await response.blob();
      const snapshot = await uploadBytes(imageRef, imageBlob);

      // Get the download URL of the uploaded image
      const url = await getDownloadURL(snapshot.ref);

      // Add the image URL to the array
      newImageUrls.push(url);
    }

    // Update the new post with the array of image URLs and the generated UUID
    newPost.value.image = newImageUrls;
    newPost.value.id = generatedUUID;
    console.log(newPost.value);

    // Set the document in the Firebase collection with the new post data
    await setDoc(doc(postsCollection, generatedUUID), newPost.value);

    // Display a success toast message and redirect to the home page
    const successToast = await toastController.create({
      message: 'The post was successfully uploaded!',
      duration: 1500,
      position: 'bottom',
      color: 'success'
    });

    await successToast.present();
    await router.push('/tabs/tab1');

    // Display an error toast message if something goes wrong during the upload
  } catch (error) {
    const errorToast = await toastController.create({
      message: 'Something went wrong while uploading the post!',
      duration: 2500,
      position: 'bottom',
      color: 'danger'
    });

    await errorToast.present();
    console.error(error);
  }
}

// Function to trigger the camera and add a photo to the post
const triggerCamera = async () => {
  const photo = await Camera.getPhoto({
    quality: 100,
    allowEditing: false,
    resultType: CameraResultType.Uri,
  });
  if (photo.webPath) {
    newPost.value.image.push(photo.webPath);
  }
};

// Function to remove an image preview from the post
const removeImagePreview = (index) => {
  if (index >= 0 && index < newPost.value.image.length) {
    newPost.value.image.splice(index, 1);
  }
}
</script>

<style>
ion-content {
  display: flex;
}

ion-list {
  display: flex;
  flex-direction: column;
}

.label-mild {
  --color: #8a8a8a !important;
}

.image-picker {
  height: 20vh;
  margin: 10px;
  border: 2px #8a8a8a dashed;
  border-radius: 8px;
  font-size: medium;
}

.image-preview {
  margin: 10px;
  border-radius: 8px;
  height: 40vh;
  overflow: hidden;
}

.remove-image-preview {
  position: absolute;
  right: 15px;
}

.button-add {
  margin-top: 50px;
  margin-left: 10px;
  margin-right: 10px;
}
</style>
