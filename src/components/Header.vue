<script setup lang="ts">
import router from "../router/router"
import HugeiconsGithub from "~icons/hugeicons/github"
import HeroiconsTrophy from "~icons/heroicons/trophy"
import HeroiconsBookOpen from "~icons/heroicons/book-open"
import HeroiconsChartBar from "~icons/heroicons/chart-bar"
import HeroiconsUsers from "~icons/heroicons/users"
import noPfp from "../assets/no_pfp.webp"
function isActive(route) {
  return router.currentRoute.value.path.startsWith(route)
}
</script>

<template>
  <div class="header-wrapper w-full">
    <div class="navbar navbar-start mx-auto mb-5 mt-4 w-11/12 rounded-2xl bg-base-300 shadow-2xl">
      <div class="xl:navbar-start">
        <div class="dropdown">
          <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul tabindex="0" class="menu dropdown-content z-[1] mt-3 w-52 rounded-box bg-base-300 p-2 shadow">
            <li>
              <button @click="router.push('/leaderboard')">
                <HeroiconsTrophy class="text-xl" />
                Rankings
              </button>
            </li>
            <li>
              <button @click="router.push('/manual')">
                <HeroiconsBookOpen class="text-xl" />
                Manual
              </button>
            </li>
            <li>
              <button @click="router.push('/stats')">
                <HeroiconsChartBar class="text-xl" />
                Stats
              </button>
            </li>
            <li>
              <button @click="router.push('/users')">
                <HeroiconsUsers class="text-xl" />
                Users
              </button>
            </li>
          </ul>
        </div>
        <a class="btn btn-ghost mr-6 text-2xl" @click="router.push('/')">CaccaBOT</a>
      </div>
      <div class="navbar-start hidden lg:flex">
        <button class="btn mx-2 w-36" :class="{ 'btn-primary': isActive('/leaderboard') }"
          @click="router.push('/leaderboard')">
          <HeroiconsTrophy class="text-xl" />
          Rankings
        </button>
        <button class="btn mx-2 w-36" :class="{ 'btn-secondary': isActive('/manual') }" @click="router.push('/manual')">
          <HeroiconsBookOpen class="text-xl" />
          Manual
        </button>
        <button class="btn mx-2 w-36" :class="{ 'btn-accent': isActive('/stats') }" @click="router.push('/stats')">
          <HeroiconsChartBar class="text-xl" />
          Stats
        </button>
        <button class="btn mx-2 w-36" :class="{ 'btn-info': isActive('/users') }" @click="router.push('/users')">
          <HeroiconsUsers class="text-xl" />
          Users
        </button>
      </div>
      <div class="navbar-end cursor-pointer">
        <div class="avatar absolute right-[4vw]">
          <div class="w-16 rounded-full bg-base-300 ring ring-primary ring-offset-base-100 ring-offset-2">
            <img :src="noPfp" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.avatar {
  transition: all .25s;
}

.avatar:hover {
  transform: scale(1.1);
}
</style>
