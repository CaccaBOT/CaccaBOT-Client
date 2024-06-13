<script setup lang="ts">
import router from "../router/router"
import HugeiconsGithub from "~icons/hugeicons/github"
function isCurrentRoute(elem) {
  console.log(elem)
  return true
}
</script>

<template>
  <div class="header-wrapper w-full">
    <div
      class="navbar navbar-start mx-auto mb-5 mt-4 w-11/12 rounded-2xl bg-base-300 shadow-2xl"
    >
      <div class="navbar-start">
        <div class="dropdown">
          <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabindex="0"
            class="menu dropdown-content z-[1] mt-3 w-52 rounded-box bg-base-300 p-2 shadow"
          >
            <li>
              <button @click="router.push('/leaderboard')">Rankings</button>
            </li>
            <li>
              <button @click="router.push('/manual')">Manual</button>
            </li>
            <li>
              <button @click="router.push('/stats')">Stats</button>
            </li>
            <li>
              <button @click="router.push('/users')">Users</button>
            </li>
          </ul>
        </div>
        <a class="btn btn-ghost mr-6 text-2xl" @click="router.push('/')"
          >CaccaBOT</a
        >
      </div>
      <div class="navbar-start hidden lg:flex">
        <button class="btn mx-2 w-36" @click="router.push('/leaderboard')">
          Rankings
        </button>
        <button class="btn mx-2 w-36" @click="router.push('/manual')">
          Manual
        </button>
        <button class="btn mx-2 w-36" @click="router.push('/stats')">
          Stats
        </button>
        <button class="btn mx-2 w-36" @click="router.push('/users')">
          Users
        </button>
      </div>
      <div class="navbar-end">
        <button class="btn mx-2 w-12">
          <HugeiconsGithub class="text-xl" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
