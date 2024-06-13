<script setup lang="ts">
import noPoopsFound from "../assets/no_poops_found.webp"
import router from "../router/router"
import noPfp from "../assets/no_pfp.webp"
import { useGlobalStore } from "../stores/global"
import { ref } from "vue"
const globalStore = useGlobalStore()
import type { Ref } from "vue"

const { year, month } = router.currentRoute.value.params

if (year && month) {
  globalStore.selectedDate = new Date(
    parseInt(year as string),
    parseInt(month as string) - 1,
  )
} else {
  globalStore.selectedDate = new Date()
  router.replace(
    `/leaderboard/${globalStore.selectedDate.getFullYear()}/${globalStore.selectedDate.getMonth() + 1}`,
  )
}

function goToProfile(id: string) {
  router.push(
    `/profile/${id}/${globalStore.selectedDate.getFullYear()}/${globalStore.selectedDate.getMonth() + 1}`,
  )
}

function prevMonth() {
  globalStore.prevMonth()
  router.push(
    `/leaderboard/${globalStore.selectedDate.getFullYear()}/${globalStore.selectedDate.getMonth() + 1}`,
  )
  setTime()
}

function nextMonth() {
  globalStore.nextMonth()
  router.push(
    `/leaderboard/${globalStore.selectedDate.getFullYear()}/${globalStore.selectedDate.getMonth() + 1}`,
  )
  setTime()
}

type TimeUntilNewMonth = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const newMonth = new Date(
  new Date().getFullYear(),
  new Date().getMonth() + 1,
  1,
)
const timeUntilNewMonth: Ref<TimeUntilNewMonth> = ref(setTime())
const interval = setInterval(() => {
  timeUntilNewMonth.value = setTime()
}, 1000)

function setTime(): TimeUntilNewMonth {
  const MONTH_IN_MILLISECONDS = 2629746000
  if (
    globalStore.selectedDate.getTime() + MONTH_IN_MILLISECONDS <=
    new Date().getTime()
  ) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  let now = new Date().getTime()
  let diff = newMonth.getTime() - now

  if (diff <= 0) {
    clearInterval(interval)
    diff = 0
  }

  let days = Math.floor(diff / (1000 * 60 * 60 * 24))
  let hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  let seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return { days, hours, minutes, seconds }
}
</script>

<template>
  <div class="leaderboard-wrapper">
    <div
      class="header py-7 w-11/12 mx-auto flex flex-row justify-between items-center"
    >
      <button @click="prevMonth()" class="btn btn-active btn-circle">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.75 19.5 8.25 12l7.5-7.5"
          />
        </svg>
      </button>
      <div>
        <h1 class="text-center m-0">CACCA LEADERBOARD</h1>
        <h2 class="text-center">{{ globalStore.displayDate }}</h2>
        <div
          class="countdown-wrapper flex flex-col justify-center items-center flex-wrap"
        >
          <div class="grid grid-flow-col gap-5 text-center auto-cols-max">
            <div class="flex flex-col">
              <span class="countdown font-mono text-4xl">
                <span :style="'--value:' + timeUntilNewMonth.days"></span>
              </span>
              days
            </div>
            <div class="flex flex-col">
              <span class="countdown font-mono text-4xl">
                <span :style="'--value:' + timeUntilNewMonth.hours"></span>
              </span>
              hours
            </div>
            <div class="flex flex-col">
              <span class="countdown font-mono text-4xl">
                <span :style="'--value:' + timeUntilNewMonth.minutes"></span>
              </span>
              min
            </div>
            <div class="flex flex-col">
              <span class="countdown font-mono text-4xl">
                <span :style="'--value:' + timeUntilNewMonth.seconds"></span>
              </span>
              sec
            </div>
          </div>
        </div>
      </div>
      <button @click="nextMonth()" class="btn btn-active btn-circle">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m8.25 4.5 7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>
    </div>

    <img
      class="md:w-1/2 sm:w-full mx-auto"
      v-show="globalStore.leaderboard.length === 0 && !globalStore.isFetching"
      :src="noPoopsFound"
    />

    <div
      v-show="globalStore.isFetching"
      class="flex flex-col gap-2 w-11/12 mx-auto"
    >
      <div v-for="n in 15" class="skeleton h-12 w-full"></div>
    </div>

    <div
      v-show="globalStore.leaderboard.length > 0 && !globalStore.isFetching"
      class="overflow-x-auto"
    >
      <table class="table table-xl">
        <thead>
          <tr class="prose text-center">
            <th>Rank</th>
            <th>User</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in globalStore.leaderboard">
            <td class="prose text-center">
              <h3>{{ user.rank }}°</h3>
            </td>

            <td>
              <div
                class="flex items-center gap-3 user-cell"
                @click="goToProfile(user.id)"
              >
                <div class="avatar">
                  <div class="mask mask-circle w-16 h-16">
                    <img :src="user.pfp ?? noPfp" />
                  </div>
                </div>
                <div>
                  <div class="font-bold prose">
                    <h2>{{ user.username }}</h2>
                  </div>
                </div>
              </div>
            </td>

            <td class="prose text-center">
              <h3>{{ user.poop_count }}</h3>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.header h1 {
  font-size: 2rem;
  font-weight: bold;
}

.header h2 {
  font-size: 1.4rem;
  font-weight: bold;
}

.user-cell {
  width: 30%;
  margin: auto;
  cursor: pointer;
}

@media only screen and (max-width: 700px) {
  .user-cell {
    width: 100%;
  }

  .header h1 {
  font-size: 1.6rem;
  font-weight: bold;
}
}
</style>
