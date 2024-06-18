import { defineStore } from "pinia"
import { useAPIStore } from "./api"
import { Leaderboard } from "../types/Leaderboard"
import { Profile } from "../types/Profile"

export const useGlobalStore = defineStore("global", {
  state: () => ({
    leaderboard: [] as Leaderboard,
    profile: {} as Profile,
    isFetching: false,
    selectedDate: new Date(),
  }),
  getters: {
    displayDate: (state) =>
      new Date(
        state.selectedDate.getFullYear(),
        state.selectedDate.getMonth(),
      ).toLocaleDateString("default", { year: "numeric", month: "long" }),
  },
  actions: {
    async fetchLeaderboard(date: Date) {
      this.isFetching = true
      const apiStore = useAPIStore()
      let response = await apiStore.client.getMonthlyLeaderboard(date)
      this.isFetching = false
      if (response.ok) {
        this.leaderboard = await response.json()
      } else {
        alert("Error fetching leaderboard")
      }
    },
    async fetchProfile(id: string) {
      this.profile = {}
      this.isFetching = true
      const apiStore = useAPIStore()
      let profileResponse = await apiStore.client.getProfile(id)
      this.isFetching = false
      if (profileResponse.ok) {
        this.$state.profile = await profileResponse.json()
      } else {
        alert("Error fetching user profile")
      }
    },
    nextMonth() {
      let year = this.selectedDate.getFullYear()
      let month = this.selectedDate.getMonth()

      if (month == 11) {
        year++
        month = 0
      } else {
        month++
      }

      this.selectedDate = new Date(year, month)
    },
    prevMonth() {
      let year = this.selectedDate.getFullYear()
      let month = this.selectedDate.getMonth()

      if (month == 0) {
        year--
        month = 11
      } else {
        month--
      }

      this.selectedDate = new Date(year, month)
    },
  },
})
