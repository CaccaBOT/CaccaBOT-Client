<script setup lang="ts">
import { onMounted, ref, watch } from "vue"
import router from "../router/router"
import { useGlobalStore } from "../stores/global"
import { useAPIStore } from "../stores/api"
import { UserStats } from "../types/UserStats"
import noPfp from "../assets/no_pfp.webp"
import { color } from "../main.ts"
import HeroiconsTrophy from "~icons/heroicons/trophy"
import HeroiconsFire from "~icons/heroicons/fire"
import HeroiconsChartBar from "~icons/heroicons/chart-bar"
import HeroiconsPencil from "~icons/heroicons/pencil"
import MaterialSymbolsSaveOutline from "~icons/material-symbols/save-outline"
import MaterialSymbolsExposurePlus1Rounded from "~icons/material-symbols/exposure-plus-1-rounded"
import { Poop } from "../types/Profile.ts"
import { DisplayedResult } from "../types/DisplayedResult.ts"
import { useSessionStore } from "../stores/session.ts"

const globalStore = useGlobalStore()
const { client } = useAPIStore()
const sessionStore = useSessionStore()
const userStats = ref({} as UserStats)
const isEditingUsername = ref(false)
const isEditingBio = ref(false)

const monthlyUserPoops = ref([] as Poop[])

let options = ref({})
let series = ref([])

function editUsername() {
  //TODO: implement API call
  isEditingUsername.value = false
}

function editBio() {
  //TODO: implement API call
  isEditingBio.value = false
}

function isOwnProfile() {
  return router.currentRoute.value.path.includes("/own")
}

function groupByDay(data: Poop[]): Record<string, number> {
  const grouped = {}
  data.forEach((item) => {
    const date = new Date(item.timestamp)
    const day = date.toISOString().split("T")[0]
    if (!grouped[day]) {
      grouped[day] = 0
    }
    grouped[day]++
  })

  return grouped
}

function fillMissingDays(
  grouped: Record<string, number>,
): Record<string, number> {
  const startDate = new Date(
    globalStore.selectedDate.getFullYear(),
    globalStore.selectedDate.getMonth(),
    2,
  )
  const endDate = new Date(
    globalStore.selectedDate.getFullYear(),
    globalStore.selectedDate.getMonth() + 1,
    1,
  )
  const filled = {}
  let currentDate = new Date(startDate)
  while (currentDate <= endDate) {
    const day = currentDate.toISOString().split("T")[0]
    filled[day] = grouped[day] || 0
    currentDate.setDate(currentDate.getDate() + 1)
  }
  return filled
}

async function fetchProfileStats(id) {
  if (router.currentRoute.value.name == "monthlyProfile" || isOwnProfile()) {
    const date = new Date(
      globalStore.selectedDate.getFullYear(),
      globalStore.selectedDate.getMonth() + 1,
    )
    userStats.value = await (await client.getMonthlyUserStats(id, date)).json()
    monthlyUserPoops.value = await (
      await client.getMonthlyPoopsFromUser(id, date)
    ).json()
    const groupedByDay = groupByDay(monthlyUserPoops.value)
    const filledData = fillMissingDays(groupedByDay)

    const result: DisplayedResult[] = Object.keys(filledData).map((date) => ({
      date,
      count: filledData[date],
    }))

    options.value = {
      chart: {
        type: "area",
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        type: "date",
        categories: result.map((x) => x.date),
      },
      yaxis: {
        labels: {
          formatter: (val: number) => {
            return val.toFixed(0)
          },
        },
      },
      tooltip: {
        y: {
          formatter: (val: number) => {
            return val.toString()
          },
        },
      },
      theme: {
        mode: color,
      },
    }

    series.value = [
      {
        name: "poop",
        data: result.map((x) => x.count),
      },
    ]
  } else {
    //TODO handle overall stats
  }
}

watch(router.currentRoute, async () => {
  const id = (router.currentRoute.value.params.id ??
    sessionStore.session.id) as string
    userStats.value = {} as UserStats
    options.value = {}
    series.value = []
  await fetchProfileStats(id)
})

onMounted(async () => {
  const id = (router.currentRoute.value.params.id ??
    sessionStore.session.id) as string
  await fetchProfileStats(id)
})
</script>

<template>
  <div class="profile-wrapper">
    <div class="profile-header mx-auto mt-8 text-center">
      <div class="avatar">
        <div
          v-show="!globalStore.profile.username"
          class="skeleton w-32 shrink-0 rounded-full"
        ></div>
        <div
          v-show="globalStore.profile.username"
          class="custom-shadow w-24 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100"
        >
          <img :src="globalStore.profile.pfp ?? noPfp" />
        </div>
        <div
          v-show="isOwnProfile()"
          class="absolute bottom-[-5px] left-[-5px] h-[2.5rem] w-[2.5rem] cursor-pointer rounded-full bg-primary"
        >
          <div class="flex h-full items-center justify-center">
            <HeroiconsPencil class="mx-auto text-center" color="black" />
          </div>
        </div>
      </div>
      <div
        v-show="!globalStore.profile.username"
        class="skeleton mx-auto mt-5 h-6 w-1/6"
      ></div>
      <div v-show="globalStore.profile.username" class="username">
        <h1
          class="mx-auto w-max outline-none"
          :contenteditable="isEditingUsername"
        >
          {{ globalStore.profile.username }}
          <HeroiconsPencil
            v-show="isOwnProfile() && !isEditingUsername"
            class="ml-1 inline cursor-pointer text-[1.25rem]"
            @click="isEditingUsername = !isEditingUsername"
          />
          <MaterialSymbolsSaveOutline
            v-show="isOwnProfile() && isEditingUsername"
            class="ml-1 inline cursor-pointer text-[1.25rem]"
            @click="editUsername"
          />
        </h1>
      </div>
    </div>
    <div
      v-show="!globalStore.profile.username"
      class="skeleton mx-auto mt-5 h-32 w-5/6"
    ></div>
    <div
      v-show="globalStore.profile.username"
      class="card mx-auto mt-5 w-5/6 bg-base-200 text-center shadow-xl"
    >
      <div
        class="prose card-body mx-auto text-center"
        v-show="globalStore.profile.bio"
      >
        <h1 class="quote-top">“</h1>
        <p>
          {{ globalStore.profile.bio ?? "This user has not set a bio yet." }}
        </p>
        <h1 class="quote-bottom">“</h1>
      </div>
    </div>

    <div
      v-show="!userStats.monthlyLeaderboardPosition"
      class="skeleton mx-auto mt-5 h-32 w-5/6"
    ></div>
    <div
      v-show="userStats.monthlyLeaderboardPosition"
      class="card stats mx-auto my-5 flex w-5/6 bg-base-200 text-center shadow sm:flex-col md:flex-row"
    >
      <div class="stat">
        <div class="stat-figure text-sky-500">
          <HeroiconsTrophy class="text-xl" />
        </div>
        <div class="stat-title">Leaderboard</div>
        <div class="stat-value text-sky-500">
          #{{ userStats.monthlyLeaderboardPosition }}
        </div>
        <div class="stat-desc">{{ globalStore.displayDate }}</div>
      </div>

      <div class="stat">
        <div class="stat-figure text-red-500">
          <MaterialSymbolsExposurePlus1Rounded class="text-2xl" />
        </div>
        <div class="stat-title">Count</div>
        <div class="stat-value text-red-500">{{ monthlyUserPoops.length }}</div>
        <div class="stat-desc">{{ globalStore.displayDate }}</div>
      </div>

      <div class="stat">
        <div class="stat-figure text-yellow-500">
          <HeroiconsFire class="text-xl" />
        </div>
        <div class="stat-title">Streak</div>
        <div class="stat-value text-yellow-500">{{ userStats.streak }}</div>
        <div class="stat-desc">days in a row</div>
      </div>

      <div class="stat">
        <div class="stat-figure text-green-500">
          <HeroiconsChartBar />
        </div>
        <div class="stat-title">Daily AVG</div>
        <div class="stat-value text-green-500">{{ userStats.poopAverage }}</div>
        <div class="stat-desc">{{ globalStore.displayDate }}</div>
      </div>
    </div>

    <div
      v-show="!userStats.monthlyLeaderboardPosition"
      class="skeleton mx-auto mt-20 h-72 w-11/12"
    ></div>
    <div
      v-show="userStats.monthlyLeaderboardPosition"
      class="chart mx-auto w-[95%]"
    >
      <apexchart
        height="400px"
        type="area"
        :options="options"
        :series="series"
      />
    </div>
  </div>
</template>

<style scoped>
.profile-wrapper {
  width: 100%;
}

.username {
  width: 100%;
  font-size: 2rem;
  font-weight: bold;
}

.quote-top {
  position: absolute;
  top: 5%;
  left: 15px;
}

.quote-bottom {
  position: absolute;
  bottom: 5%;
  right: 15px;
  transform: rotate(180deg);
}
</style>
