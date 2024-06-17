<script setup lang="ts">
import { onMounted, ref } from "vue"
import { marked } from "marked"
import markedKatex from "marked-katex-extension"

const manual = ref("")
onMounted(async () => {
  const manualRaw = await (
      await fetch(
        "https://raw.githubusercontent.com/CaccaBOT/CaccaBOT-Manual/main/README.md",
      )
    ).text()
    marked.use(markedKatex({throwOnError: false}))
  manual.value = await marked.parse(manualRaw)
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
