<script setup lang="ts">
import { onMounted, ref } from "vue"
import showdown from "showdown"

const manual = ref("")
onMounted(async () => {
  let converter = new showdown.Converter()
  converter.setFlavor("github")
  manual.value = converter.makeHtml(
    await (
      await fetch(
        "https://raw.githubusercontent.com/CaccaBOT/CaccaBOT-Manual/main/README.md",
      )
    ).text(),
  )
  document.querySelector(".manual-wrapper").innerHTML = manual.value
})
</script>

<template>
  <div class="manual-wrapper prose mx-5">
    <div class="loader-wrapper flex w-[95%] items-center justify-center">
      <span class="loading loading-spinner loading-lg"></span>
    </div>
  </div>
</template>

<style scoped>
.manual-wrapper {
  max-width: 100%;
}

.loader-wrapper {
  height: 85vh;
}

.loading {
  transform: scale(1.5);
}
</style>
