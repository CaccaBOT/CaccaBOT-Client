import { createApp } from "vue"
import "./style.css"
import router from "./router/router"
import VueApexCharts from "vue3-apexcharts"
import { createPinia } from "pinia"
import App from "./App.vue"

export const color =
  window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"

createApp(App).use(router).use(VueApexCharts).use(createPinia()).mount("#app")
