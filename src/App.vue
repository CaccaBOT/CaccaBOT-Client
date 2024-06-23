<script setup lang="ts">
import Header from "./components/Header.vue"
import LoginPanel from "./components/LoginPanel.vue"
import router from "./router/router"
import { useSessionStore } from "./stores/session"
import { useHead } from "@unhead/vue"
import { baseURL } from "./services/API.ts"
import ChangePasswordPanel from "./components/ChangePasswordPanel.vue"

const sessionStore = useSessionStore()
sessionStore.load()

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
  <ChangePasswordPanel
    v-show="sessionStore.session.id && sessionStore.showChangePasswordModal"
  />
  <router-view v-slot="{ Component, route }">
    <component :is="Component" />
  </router-view>
</template>

<style scoped></style>
