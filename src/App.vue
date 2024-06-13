<script setup lang="ts">
import Header from "./components/Header.vue"
import router from "./router/router"
</script>

<template>
  <Header v-show="router.currentRoute.value.name != 'home'" />
  <router-view v-slot="{ Component, route }">
    <component :is="Component" />
  </router-view>
</template>

<style scoped></style>
