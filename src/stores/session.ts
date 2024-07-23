import { defineStore } from "pinia"
import { Session } from "../types/Session"
import { useAPIStore } from "./api"

export const useSessionStore = defineStore("session", {
  state: () => ({
    session: {} as Session,
    showLoginModal: false,
    showNavMenu: false,
    showChangePasswordModal: false,
    showChangePfpModal: false,
    showMobileNavbar: false
  }),
  getters: {},
  actions: {
    save() {
        localStorage.setItem("token", this.session.token)
    },
    async load() {
      const token = localStorage.getItem("token") ?? null
      if (!token) {
        return
      }
      this.session.token = token
      const {client} = useAPIStore()
      this.session = await (await client.getOwnProfile()).json()
      this.session.token = token
    },
    logout() {
      this.session = {}
      this.session.token = null
      this.save()
    },
  },
})
