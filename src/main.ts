import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import 'firebase/auth';
import 'firebase/firestore';

import { IonicVue } from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Theme variables */
import './theme/variables.css';
import { initializeApp } from "firebase/app";
import { defineCustomElements } from '@ionic/pwa-elements/loader';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAjJ7rEdhGO1wvmGyk9-f6_cKNRQ0ZOJx8",
  authDomain: "exam-bb6d7.firebaseapp.com",
  projectId: "exam-bb6d7",
  storageBucket: "exam-bb6d7.appspot.com",
  messagingSenderId: "114487909309",
  appId: "1:114487909309:web:c61c19697ca0bfce34d0d4"
};

initializeApp(firebaseConfig)

const app = createApp(App)
  .use(IonicVue)
  .use(router);

defineCustomElements(window);
router.isReady().then(() => {
  app.mount('#app');
});