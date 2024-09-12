<script setup lang="ts">
import merdollar from "../../assets/merdollar.webp"
const props = defineProps<{
  value: number
  includesAssets: boolean
}>()
</script>

<template>
  <div class="circulating-merdollars-wrapper w-max">
    <div class="stats bg-base-300 text-center shadow">
      <div class="stat">
        <div class="stat-title">Circulating Merdollars</div>
        <div class="stat-value text-success flex justify-center items-center">
          {{ props.value.toLocaleString() }} <img class="ml-2 w-[50px] h-[50px] inline merdollar" :src="merdollar">
        </div>
        <div v-show="props.includesAssets" class="stat-desc mt-2">
          including assets
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
