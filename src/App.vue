<script setup lang="ts">
import Header from "./components/Header.vue"
import LoginPanel from "./components/LoginPanel.vue"
import router from "./router/router"
import { useSessionStore } from "./stores/session"
import { useHead } from "@unhead/vue"
import { baseURL } from "./services/API.ts"

const sessionStore = useSessionStore()

useHead({
  link: [
    {
      rel: "preconnect",
      href: baseURL,
      crossorigin: "anonymous",
    },
  ],
})
</script>

<template>
  <Header v-show="router.currentRoute.value.name != 'home'" />
  <LoginPanel
    v-show="!sessionStore.session.id && sessionStore.showLoginModal"
  />
  <router-view v-slot="{ Component, route }">
    <component :is="Component" />
  </router-view>
</template>

<style scoped></style>
