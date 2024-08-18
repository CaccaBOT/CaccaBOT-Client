<script setup lang="ts">
import router from "../router/router"
import homeImage from "../assets/home.webp"
import HeroiconsTrophy from "~icons/heroicons/trophy"
import HeroiconsBookOpen from "~icons/heroicons/book-open"
import HeroiconsChartBar from "~icons/heroicons/chart-bar"
import HeroiconsDownload from "~icons/heroicons/arrow-down-tray"
import HeroiconsUsers from "~icons/heroicons/users"
import { onMounted, ref } from "vue"
import { useAPIStore } from "../stores/api"
const {client} = useAPIStore()

let serverVersion = ref('')
let installPrompt = ref(null)

async function install() {
  await installPrompt.value.prompt()
}

onMounted(async () => {
  const {version} = await (await client.getVersion()).json()
  serverVersion.value = version
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault()
    installPrompt.value = event
  })
})
</script>

<template>
  <div class="home-wrapper">
    <img class="mb-5 w-80" :src="homeImage" />
    <div class="prose text-center">
      <h1 class="mb-0">CaccaBOT</h1>
      <p class="m-0 text-2xl">{{ serverVersion }}</p>
    </div>
    <button
      v-show="installPrompt != null"
      @click="install"
      class="btn btn-success mt-6 w-80"
    >
      <HeroiconsDownload class="text-xl" />

      Install
    </button>
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
</style>
