<script setup lang="ts">

</script>

<template>
  <router-view v-slot="{ Component, route }">
    <component :is="Component" />
  </router-view>
</template>

<style scoped></style>
