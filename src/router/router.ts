import { createRouter, createWebHistory } from 'vue-router'

import Leaderboard from '../views/Leaderboard.vue'
import Home from '../views/Home.vue'
import Profile from '../views/Profile.vue'
import Stats from '../views/Stats.vue'
import Users from '../views/Users.vue'
import { useGlobalStore } from '../stores/global'

const routes = [
  { path: '/', component: Home, name: 'home' },
  { path: '/stats', component: Stats, name: 'stats' },
  { path: '/leaderboard', component: Leaderboard, name: 'leaderboard' },
  { path: '/leaderboard/:year/:month', component: Leaderboard, name: 'monthlyLeaderboard' },
  { path: '/profile/:id', component: Profile, name: 'profile' },
  { path: '/profile/:id/:year/:month', component: Profile, name: 'monthlyProfile' },
  { path: '/users', component: Users, name: 'users'}
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.afterEach(async (to, from) =>
{
  const globalStore = useGlobalStore()
  switch (to.name)
  {
    case 'monthlyLeaderboard':
      await globalStore.fetchLeaderboard(new Date(parseInt(to.params.year as string), parseInt(to.params.month as string)))
      break
    case 'monthlyProfile':
      globalStore.selectedDate = new Date(parseInt(to.params.year as string), parseInt(to.params.month as string) - 1)
      await globalStore.fetchProfile(to.params.id as string)
      break
    case 'profile':
      globalStore.selectedDate = new Date(new Date().getFullYear(), new Date().getMonth())
      await globalStore.fetchProfile(to.params.id as string)
      break
  }
})

export default router