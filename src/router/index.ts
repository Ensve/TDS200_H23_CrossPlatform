import { createRouter, createWebHistory } from '@ionic/vue-router';
import { NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw} from 'vue-router';
import Authentication from '../views/Authentication.vue';
import TabsPage from '../views/TabsPage.vue';
import HomePage from "../views/HomePage.vue";
import UploadTab from "../views/UploadTab.vue";
import ProfileTab from "../views/ProfileTab.vue";
import DetailPage from "../views/DetailsPage.vue";
import Gallery from "../views/Gallery.vue";
import { authService } from '@/services/firebase.authservice';
import {toastController} from "@ionic/vue";

const guard = (to:RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  try {
        if (authService.currentUser()) {
        next();
        } else {
        next('/');
        }
  } catch (error) {
        next('/');
  }
}

// Define a route guard for authentication using tokens
const authenticationRouteGuard = async () => {
  const userAccessToken = localStorage.getItem("auth_token")

  if( !userAccessToken ){
    return { name: "Login"}
  }

  const userAccessTokenExpiresAt = localStorage.getItem("auth_expires_at") as unknown as number;

  if (userAccessTokenExpiresAt < new Date().getTime()) {

    const errorToast = await toastController.create({
      message: "Usersession expired - please log in again",
      duration: 3000,
      position: 'middle',
      cssClass: "plase-log-in-toast",
      color: "warning"
    })

    await errorToast.present();
    await authService.logout();
    return { name: "Login"}
  }
}


// Define the array of routes for the application
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: Authentication
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/tab1'
      },
      {
        path: 'tab1',
        component: HomePage,
      },
      {
        path: 'tab2',
        component: UploadTab,
      },
      {
        path: 'tab3',
        component: ProfileTab,
      },
    ],
  },
  {
    path: '/',
    redirect: '/tabs/tab1',
    beforeEnter: [authenticationRouteGuard]
  },
  {
    path: '/',
    redirect: '/tabs/tab2',
    beforeEnter: [authenticationRouteGuard]
  },
  {
    path: '/',
    redirect: '/tabs/tab3',
    beforeEnter: [authenticationRouteGuard]
  },
  {
    path: '/',
    component: Authentication,
    beforeEnter: [authenticationRouteGuard]
  },
  {
    path: "/detail/:id",
    name: "Detail",
    component: DetailPage,
  },
  {
    path: "/gallery",
    name: "Gallery",
    component: Gallery,
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
