<script setup lang="ts">
import { ref } from "vue";
import Header from "./components/Header.vue"
import LoginPanel from "./components/LoginPanel.vue"
import router from "./router/router"
import { useSessionStore } from "./stores/session"
const sessionStore = useSessionStore()
</script>

<template>
  <Header v-show="router.currentRoute.value.name != 'home'" />
  <LoginPanel v-show="false && !sessionStore.session.id"/> <!-- remember to remove false -->
  <router-view v-slot="{ Component, route }">
    <component :is="Component" />
  </router-view>
</template>

<style scoped></style>
