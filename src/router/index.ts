import { createRouter, createWebHistory } from 'vue-router'
import HeroSection from '../components/HeroSection.vue'
import NotFound from '../components/NotFound.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: HeroSection },
    { path: '/:pathMatch(.*)*', component: NotFound },
  ],
})

export default router
