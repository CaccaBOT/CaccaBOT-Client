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
  marked.use(
    markedKatex({ throwOnError: false, displayMode: true, output: "mathml" }),
  )
  manual.value = await marked.parse(manualRaw)
  document.querySelector(".manual-wrapper").innerHTML = manual.value
})
</script>

<template>
  <div class="manual-wrapper prose mx-5">
    <div
      class="loader-wrapper flex h-[85vh] w-full items-center justify-center"
    >
      <span class="loading loading-spinner loading-lg"></span>
    </div>
  </div>
</template>

<style scoped>
::v-deep(p) {
  font-size: 0.882rem; /*15px*/
}

::v-deep(h2) {
  font-size: 1.765rem; /*30px*/
}

::v-deep(h3) {
  font-size: 1.529rem; /*26px*/
}

::v-deep(h4) {
  font-size: 1.235rem; /*21px*/
}

::v-deep(h5) {
  color: var(--tw-prose-headings);
  font-weight: 500;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  line-height: 1.5;
}

::v-deep(h6) {
  color: var(--tw-prose-headings);
  font-weight: 500;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  line-height: 1.5;
  font-size: 0.882rem;
}

.manual-wrapper {
  max-width: 100%;
}

.loading {
  transform: scale(1.5);
}
</style>
