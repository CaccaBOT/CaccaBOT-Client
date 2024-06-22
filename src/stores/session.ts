import { defineStore } from "pinia"
import { Session } from "../types/Session"
import { useAPIStore } from "./api"

export const useSessionStore = defineStore("session", {
  state: () => ({
    session: {} as Session,
    showLoginModal: false,
    showNavMenu: false
  }),
  getters: {},
  actions: {
    save() {
      localStorage.setItem("session", JSON.stringify(this.session))
    },
    load() {
      this.session = JSON.parse(localStorage.getItem("session") ?? "{}")
    },
    logout() {
      this.session = {}
      this.save()
    },
  },
})
