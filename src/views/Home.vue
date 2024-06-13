<script setup lang="ts">
import router from "../router/router"
import homeImage from "../assets/home.webp"
import HeroiconsTrophy from "~icons/heroicons/trophy"
import HeroiconsBookOpen from "~icons/heroicons/book-open"
import HeroiconsChartBar from "~icons/heroicons/chart-bar"
import HeroiconsUsers from "~icons/heroicons/users"
</script>

<template>
  <div class="home-wrapper">
    <img class="mb-5 w-80" :src="homeImage" />
    <div class="prose">
      <h1>CaccaBOT</h1>
    </div>
    <div class="buttons">
      <button
        @click="router.push('/leaderboard')"
        class="btn btn-primary w-96 md:w-36 lg:w-48"
      >
        <HeroiconsTrophy class="text-xl" />

        Rankings
      </button>
      <button
        @click="router.push('/manual')"
        class="btn btn-secondary w-96 md:w-36 lg:w-48"
      >
        <HeroiconsBookOpen class="text-xl" />

        Manual
      </button>
      <button
        @click="router.push('/stats')"
        class="btn btn-accent w-96 md:w-36 lg:w-48"
      >
        <HeroiconsChartBar class="text-xl" />

        Stats
      </button>
      <button
        @click="router.push('/users')"
        class="btn btn-info w-96 md:w-36 lg:w-48"
      >
        <HeroiconsUsers class="text-xl" />

        Users
      </button>
    </div>
  </div>
</template>

<style scoped>
.home-wrapper {
  width: 100%;
  height: 85vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

h1 {
  font-size: 3rem;
}

.home-wrapper div {
  margin: 5px;
}

.buttons {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.buttons button {
  margin: 10px;
  transition: all 0.25s;
  cursor: pointer;
}

.buttons button:hover {
  transform: scale(1.1);
}
</style>
