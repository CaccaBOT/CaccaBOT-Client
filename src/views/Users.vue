<script setup lang="ts">
import { onMounted, ref, watch } from "vue"
import router from "../router/router"
import { useGlobalStore } from "../stores/global"
import { useAPIStore } from "../stores/api"
import { UserStats } from "../types/UserStats"
import icon from "/favicon.ico"
import noPfp from "../assets/no_pfp.webp"
const globalStore = useGlobalStore()
const { client } = useAPIStore()
const users = ref([])

function goToProfile(id: string) {
  //TODO: FEATURE NOT READY YET
  //router.push(`/profile/${id}`);
}

onMounted(async () => {
  users.value = (await (await client.getLeaderboard()).json()).sort(
    (a, b) => b.poops - a.poops,
  )
})
</script>

<template>
  <div class="users-wrapper">
    <div class="prose w-full mx-auto text-center m-5">
      <h1>CACCA USERS</h1>
    </div>
    <div
      class="users w-full flex flex-row flex-wrap justify-center items-center"
    >
      <div
        @click="goToProfile(user.id)"
        v-for="user of users"
        class="card m-4 w-64 bg-base-200 shadow-xl"
      >
        <div class="card-body flex flex-col mx-auto">
          <div class="avatar mx-auto">
            <div
              class="w-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 mb-2"
            >
              <img :src="user.pfp ?? noPfp" />
            </div>
          </div>
          <div class="flex flex-col justify-center items-center">
            <h2 class="card-title">{{ user.username }}</h2>
            <p>{{ user.poops }} poops</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
    transition: all .25s;
    cursor: pointer;
}

.card:hover {
    transform: scale(1.1);
}
</style>
