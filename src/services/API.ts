import { useSessionStore } from "../stores/session"

export const baseURL = "https://caccabot.duckdns.org"
export const baseAPIURL = `${baseURL}/api`

export default class API {
  sessionStore = useSessionStore()

  async login(username: string, password: string) {
    return await fetch(`${baseAPIURL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        password,
      }),
    })
  }

  async changePassword(password: string) {
    return await fetch(`${baseAPIURL}/auth/password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Auth-Token": this.sessionStore.session.token,
      },
      body: JSON.stringify({
        password,
      }),
    })
  }

  async logout() {
    // TODO: write implementation
  }

  async getMonthlyLeaderboard(date: Date = new Date()) {
    return await fetch(
      `${baseAPIURL}/poop/leaderboard/${date.getFullYear()}/${date.getMonth()}`,
    )
  }

  async getLeaderboard() {
    return await fetch(`${baseAPIURL}/poop/leaderboard`)
  }

  async getProfile(id: string) {
    return await fetch(`${baseAPIURL}/profile/${id}`)
  }

  async getStats() {
    return await fetch(`${baseAPIURL}/poop/stats`)
  }

  async getUserStats(id: string) {
    return await fetch(`${baseAPIURL}/poop/stats/${id}`)
  }

  async getMonthlyUserStats(id: string, date = new Date()) {
    return await fetch(
      `${baseAPIURL}/poop/stats/${id}/${date.getFullYear()}/${date.getMonth()}`,
    )
  }

  async searchProfile(username: string) {
    return await fetch(`${baseAPIURL}/profile/search?username=${username}`)
  }

  async getPoopsFromUser(id: string) {
    return await fetch(`${baseAPIURL}/poop/${id}`)
  }

  async getMonthlyPoopsFromUser(id: string, date = new Date()) {
    return await fetch(
      `${baseAPIURL}/poop/${id}/${date.getFullYear()}/${date.getMonth()}`,
    )
  }

  async getMonthlyPoops(date = new Date()) {
    return await fetch(
      `${baseAPIURL}/poop/all/${date.getFullYear()}/${date.getMonth()}`,
    )
  }
}
