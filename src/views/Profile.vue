<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import router from '../router/router'
import { useGlobalStore } from '../stores/global';
import { useAPIStore } from '../stores/api';
import { UserStats } from '../types/UserStats';
import noPfp from '../assets/no_pfp.webp'
import {color} from "../main.ts";
const globalStore = useGlobalStore()
const { client } = useAPIStore()
const userStats = ref({} as UserStats)
const monthlyUserPoops = ref([])

let options = ref({})
let series = ref([])

function groupByDay(data)
{
  const grouped = {};
  data.forEach(item =>
  {
    const date = new Date(item.timestamp);
    const day = date.toISOString().split('T')[0];
    if (!grouped[day])
    {
      grouped[day] = 0;
    }
    grouped[day]++;
  });
  return grouped;
}

function fillMissingDays(grouped)
{
  const startDate = new Date(globalStore.selectedDate.getFullYear(), globalStore.selectedDate.getMonth(), 2);
  const endDate = new Date(globalStore.selectedDate.getFullYear(), globalStore.selectedDate.getMonth() + 1, 1);
  const filled = {}
  let currentDate = new Date(startDate);
  while (currentDate <= endDate)
  {
    const day = currentDate.toISOString().split('T')[0];
    filled[day] = grouped[day] || 0;
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return filled;
}

onMounted(async () =>
{
  const id = router.currentRoute.value.params.id as string
  if (router.currentRoute.value.name == 'monthlyProfile')
  {
    const date = new Date(globalStore.selectedDate.getFullYear(), globalStore.selectedDate.getMonth() + 1)
    userStats.value = await (await client.getMonthlyUserStats(id, date)).json()
    monthlyUserPoops.value = await (await client.getMonthlyPoopsFromUser(id, date)).json()
    const groupedByDay = groupByDay(monthlyUserPoops.value);
    const filledData = fillMissingDays(groupedByDay);

    const result = Object.keys(filledData).map(date => ({
      date,
      count: filledData[date]
    }))

    options.value = {
      chart: {
        type: 'area',
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        type: 'date',
        categories: result.map(x => x.date)
      },
      theme: {
        mode: color
      }
    }

    series.value = [{
      name: 'poop',
      data: result.map(x => x.count)
    }]
  } else {
    //TODO handle overall stats
  }

})

</script>

<template>
  <div class="profile-wrapper">
    <div class="profile-header mt-5 mx-auto text-center">
      <div class="avatar">
        <div v-show="!globalStore.profile.username" class="skeleton w-32 rounded-full shrink-0"></div>
        <div v-show="globalStore.profile.username"
          class="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
          <img :src="globalStore.profile.pfp ?? noPfp" />
        </div>
      </div>
      <div v-show="!globalStore.profile.username" class="skeleton mt-5 h-6 w-1/6 mx-auto"></div>
      <div v-show="globalStore.profile.username" class="username">
        <h1>{{ globalStore.profile.username }}</h1>
      </div>
    </div>
    <div v-show="!globalStore.profile.username" class="skeleton h-32 w-5/6 mx-auto mt-5"></div>
    <div v-show="globalStore.profile.username" class="card w-5/6 bg-base-200 shadow-xl mx-auto mt-5 text-center">
      <div class="card-body text-center mx-auto prose">
        <h1 class="quote-top">“</h1>
        <p>{{ globalStore.profile.bio ?? 'This user has not set a bio yet.' }}</p>
        <h1 class="quote-bottom">“</h1>
      </div>
    </div>

    <div v-show="!userStats.monthlyLeaderboardPosition" class="skeleton h-32 w-5/6 mx-auto mt-5"></div>
    <div v-show="userStats.monthlyLeaderboardPosition"
      class="flex md:flex-row sm:flex-col mx-auto my-5 w-5/6 card bg-base-200 shadow text-center">

      <div class="stat">
        <div class="stat-figure text-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
          </svg>
        </div>
        <div class="stat-title">Leaderboard</div>
        <div class="stat-value">#{{ userStats.monthlyLeaderboardPosition }}</div>
        <div class="stat-desc">{{ globalStore.displayDate }}</div>
      </div>

      <div class="stat">
        <div class="stat-figure text-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V18Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V13.5Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V18Zm2.504-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V18Zm2.498-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5ZM8.25 6h7.5v2.25h-7.5V6ZM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0 0 12 2.25Z" />
          </svg>

        </div>
        <div class="stat-title">Count</div>
        <div class="stat-value">{{ monthlyUserPoops.length }}</div>
        <div class="stat-desc">{{ globalStore.displayDate }}</div>
      </div>

      <div class="stat">
        <div class="stat-figure text-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
          </svg>
        </div>
        <div class="stat-title">Streak</div>
        <div class="stat-value">{{ userStats.streak }}</div>
        <div class="stat-desc">days in a row</div>
      </div>

      <div class="stat">
        <div class="stat-figure text-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
          </svg>
        </div>
        <div class="stat-title">Daily AVG</div>
        <div class="stat-value">{{ userStats.poopAverage }}</div>
        <div class="stat-desc">{{ globalStore.displayDate }}</div>
      </div>

    </div>
    <div v-show="!userStats.monthlyLeaderboardPosition" class="skeleton h-72 w-11/12 mt-10 mx-auto"></div>
    <div v-show="userStats.monthlyLeaderboardPosition" class="w-full chart mx-auto">
      <apexchart height="400px" type="area" :options="options" :series="series"/>
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
