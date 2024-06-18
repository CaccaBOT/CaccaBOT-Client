import { defineStore } from "pinia"
import { Session } from "../types/Session"

export const useSessionStore = defineStore("session", {
  state: () => ({
    session: {} as Session,
    showLoginModal: false,
  }),
  getters: {},
  actions: {},
})
