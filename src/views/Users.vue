<script setup lang="ts">
import { onMounted, ref } from "vue"
import { useAPIStore } from "../stores/api"
import noPfp from "../assets/no_pfp.webp"
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
    <div class="prose mx-auto w-full text-center">
      <h1>CACCA USERS</h1>
    </div>
    <div
      class="users flex w-full flex-row flex-wrap items-center justify-center"
    >
      <div
        @click="goToProfile(user.id)"
        v-for="user of users"
        class="card m-4 w-64 bg-base-200 shadow-xl"
      >
        <div class="card-body mx-auto flex flex-col">
          <div class="avatar mx-auto">
            <div
              class="mb-2 w-20 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100"
            >
              <img :src="user.pfp ?? noPfp" />
            </div>
          </div>
          <div class="flex flex-col items-center justify-center">
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
  transition: all 0.25s;
  cursor: pointer;
}

.card:hover {
  transform: scale(1.1);
}
</style>
