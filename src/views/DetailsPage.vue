<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Details</ion-title>

        <!-- Back button to navigate to the home page -->
        <ion-buttons slot="start">
          <ion-button @click="backHome">
            <ion-icon :icon="arrowBack"></ion-icon>
          </ion-button>
        </ion-buttons>

        <!-- Button to open the comment modal -->
        <ion-buttons slot="end">
          <ion-button @click="isModalOpen = true" id="commentButton">
            <ion-icon :icon="chatboxOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>

      <!-- Display the post title in the header -->
      <ion-toolbar>
        <ion-title v-if="post">{{post.title}}</ion-title>
      </ion-toolbar>
    </ion-header>

    <!-- Content section with post details -->
    <ion-content :fullscreen="true" v-if="post && !isLoadingPost" overflow="hidden">

      <!-- Display images from the post -->
      <ion-card>
      <div v-for="(image, index) in post.image" :key="index" class="image">
        <post-image :image-url="image" />
      </div>
      </ion-card>

      <!-- Button to toggle like status -->
      <ion-button @click="toggleLikeStatus" class="like-button">
        <ion-icon v-if="hasUserLiked" :icon="heart"></ion-icon>
        <ion-icon v-else :icon="heartOutline"></ion-icon>
        {{hasUserLiked? "Liked": "Like"}}
      </ion-button>

      <!-- Display users who liked the post -->
      <div v-if="post.userWhoLiked">
        <ion-chip v-for="user in post.userWhoLiked" :key="user" color="tertiary">{{user}}</ion-chip>
      </div>

      <!-- Display post description, hashtags, and location -->
      <ion-card>
        <ion-card-header>
          <ion-card-subtitle>Description</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          {{post.description}}
          <hr>

          <!-- Display hashtags from the post -->
          <ion-chip v-for="hashtag in post.hashtags" :key="hashtag" color="tertiary">#{{hashtag}}</ion-chip>

          <!-- Display geolocation information if available -->
          <div v-if="post.location">
                Geolocation: <ion-chip>Latitude: {{post.location.latitude}}, Longitude:  {{post.location.longitude}}</ion-chip>
              </div>

              <!-- Display a map if geolocation information is available -->
              <div>
                <capacitor-google-map ref="myMapref" style="display: block; z-index: 1; width: 100%; height: 400px;"></capacitor-google-map>
              </div>
        </ion-card-content>
      </ion-card>

      <!-- Display comments section with user comments and options to remove -->
      <ion-card>
        <ion-list>
          <ion-list-header>
            <ion-label>
              Comments
              <ion-icon :icon="chatboxOutline"></ion-icon>
            </ion-label>
          </ion-list-header>
          <ion-item v-for="comment in post.comments" :key="comment.id" lines="none">
            <ion-avatar slot="start">
              <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==" alt="" class="spot-image">
            </ion-avatar>
            <ion-label class="ion-text-wrap comment-container">
              <div class="comment-username">
                <b>{{comment.userId}} </b>
              </div>
              <div class="comment-text-and-icon">
                <p class="comment-text">{{comment.text}}</p>

                <!-- Button to remove the comment -->
                <ion-icon :icon="trash" @click="removeComment(comment.id)"></ion-icon>
              </div>
            </ion-label>
          </ion-item>
        </ion-list>
      </ion-card>

      <!-- Modal for adding new comments -->
      <ion-modal
          :is-open="isModalOpen"
          :initial-breakpoint="0.25"
          :breakpoints="[0, 0.25, 0.5, 0.75]"
          @did-dismiss="isModalOpen = false">
        <ion-content>
          <ion-item lines="none">
            <ion-label position="floating">New Comment</ion-label>
            <ion-textarea v-model="newCommentText"></ion-textarea>
            <ion-button @click="addNewComment" fill="solid" color="dark" size="default" expand="block">Add Comment</ion-button>
          </ion-item>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonModal, IonTextarea, IonButton, IonAvatar, IonIcon, IonItem, IonListHeader, IonLabel, IonList, IonCardHeader, IonCardSubtitle, IonButtons, IonCard, IonCardContent, IonChip, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, onIonViewDidEnter } from "@ionic/vue";
import { ref } from 'vue';
import { chatboxOutline, arrowBack, trash, heart, heartOutline} from 'ionicons/icons';
import { useRoute } from 'vue-router';
import {
  collection,
  getFirestore,
  getDoc,
  setDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import {
  getAuth,
} from "firebase/auth";

import { useRouter } from 'vue-router';
import PostImage from "@/components/PostImage.vue";
import {IPostResponse} from "@models/IPostResponse";
import {GoogleMap} from "@capacitor/google-maps";
import { Geolocation } from '@capacitor/geolocation';



const route = useRoute();

const { id } = route.params;
const router = useRouter();

const isModalOpen = ref(false);
const newCommentText = ref('');
const isLoadingPost = ref(true);
const post = ref<IPostResponse.posts_by_id | null>(null);
const hasUserLiked = ref(false);
const currentUserData = ref(null);
const myMapref = ref(null);

// Initialize Firestore and references to post collection and document
const db = getFirestore();
const postCollection = collection(db, "posts_upload");
const postDocRef = doc(postCollection, id);

// Function to navigate back to the home page
const backHome =() => {
  router.replace('/tabs/tab1')
}

onIonViewDidEnter( async() => {
  currentUserData.value = getAuth().currentUser;
  await fetchPosts();
  await checkUserLikeStatus();
  await readGeoLocation();
})

// Function to check if the current user has liked the post
const checkUserLikeStatus = async () => {
  try {
    const docSnapshot = await getDoc(postDocRef);
    const docData = docSnapshot.data();

    if (docData.userWhoLiked && docData.userWhoLiked.includes(currentUserData.value.email)) {
      hasUserLiked.value = true;
    } else {
      hasUserLiked.value = false;
    }

  } catch (error) {
    console.error('Error checking like status:', error);
  }
};

// Function to fetch post details from Firestore
const fetchPosts = async () => {
  try{
    let posts_upload: IPostResponse.posts_by_id = null;

    // Get the document
    const docSnap = await getDoc(postDocRef);
    // Access the document's data
    if (docSnap.exists()) {
      posts_upload = docSnap.data();
      post.value = posts_upload;
      isLoadingPost.value = false;
    } else {
      console.log("No such document!");
    }
  } catch(error) {
    console.error("Error fetching the camping spot", error)
  }

}

// Function to update comments in Firestore
const updateComments = async (updatedComments) => {
  try {
    await setDoc(postDocRef, { comments: updatedComments }, { merge: true });
    post.value.comments = updatedComments;
  } catch (error) {
    console.error('Error updating comments:', error);
  }
};


const addNewComment = async () => {
  try {
    if (currentUserData.value) {

      // Create a new comment object with an increased ID
      const newComment = {
        id: post.value.comments? post.value.comments.length + 1 : 1,
        userId: currentUserData.value.email,
        text: newCommentText.value
      };

      const updatedComments = post.value.comments ? [...post.value.comments, newComment] : [newComment];
      await updateComments(updatedComments);
      isModalOpen.value = false;
      newCommentText.value = '';
    } else {
      console.log('No user is currently logged in.');
    }
  } catch (error) {
    console.error('Error adding comment to Firebase:', error);
  }
};

// Function to remove a comment from the post
const removeComment = async (commentId) => {
  try {
    const targetComment = post.value.comments.find(comment => comment.id === commentId);

    if (!targetComment) {
      throw new Error('Comment not found.');
    }
    // Check if the current user is the owner of the comment
    if (targetComment.userId !== currentUserData.value.email) {
      throw new Error('You are not authorized to remove this comment.');
    }
    const updatedComments = post.value.comments.filter(comment => comment.id !== commentId);
    await updateComments(updatedComments);
  } catch (error) {
    console.error('Error removing comment from Firebase:', error);
  }
};


// Function to toggle the like status of the post
const toggleLikeStatus = async () => {
  try {
    if (currentUserData.value) {
      console.log(currentUserData.value.email)
      const docSnapshot = await getDoc(postDocRef);
      const docData = docSnapshot.data();

      // Check if the user has already liked the camp spot
      if (docData.userWhoLiked && docData.userWhoLiked.includes(currentUserData.value.email)) {

        // User has liked, so remove their like
        const updatedLikes = docData.userWhoLiked.filter((userId) => userId !== currentUserData.value.email);
        console.log(updatedLikes)
        await setDoc(postDocRef, { userWhoLiked: updatedLikes }, { merge: true });
        post.value.userWhoLiked = updatedLikes;
      } else {

        // User has not liked, so add their like
        const updatedLikes = [...(docData.userWhoLiked || []), currentUserData.value.email];
        console.log(updatedLikes)
        await setDoc(postDocRef, { userWhoLiked: updatedLikes }, { merge: true });
        post.value.userWhoLiked = updatedLikes;
      }

      hasUserLiked.value = !hasUserLiked.value;

    }
  } catch (error) {
    console.error('Error toggling like status:', error);
  }
};

// Function to read the geolocation of the post and initialize Google Map
const readGeoLocation = async () => {
  try {
    if (!post.value.location) {
      const position = await Geolocation.getCurrentPosition();
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const location = {
        latitude,
        longitude,
      };
      await updateDoc(postDocRef, { location });
      post.value.location = location;
    }

    console.log("Initializing map...");
    const myMap = await GoogleMap.create({
      id: 'my-google-map',
      element: myMapref.value,
      apiKey: "AIzaSyCawbJau65Yyc0dqez7SThsG9lHaGfIkFo",
      config: {
        center: {
          lat: post.value.location?.latitude,
          lng: post.value.location?.longitude,
        },
        zoom: 16,
      },
    });

    console.log("Adding marker...");
    const markerId = await myMap.addMarker({
      coordinate: {
        lat: post.value.location?.latitude,
        lng: post.value.location?.longitude,
      },
    });

    console.log("Map initialization complete.");
  } catch (error) {
    console.error('Error getting location:', error);
  }
};


</script>

<style>
.comment-container {
  display: flex;
  flex-direction: column;
}

.comment-text-and-icon {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.comment-text {
  flex: 1;
}

.spot-image {
  width: 100%;
  object-fit: cover;
  display: block;
}

.like-button {
  margin-left: 10px;
}


</style>