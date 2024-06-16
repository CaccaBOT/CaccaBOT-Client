import { defineStore } from "pinia"
import { useAPIStore } from "./api"
import router from "../router/router"
import { Leaderboard } from "../types/Leaderboard"
import { Session } from "../types/Session"

export const useSessionStore = defineStore("session", {
  state: () => ({
    session: {} as Session,
  }),
  getters: {

  },
  actions: {

  },
})
