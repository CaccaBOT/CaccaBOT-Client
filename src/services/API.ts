export const baseURL = "https://caccabot.duckdns.org/api"

export default class API {
  async login(username: string, password: string) {
    return await fetch(`${baseURL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        password,
      }),
    })
  }

  async getMonthlyLeaderboard(date: Date = new Date()) {
    return await fetch(
      `${baseURL}/poop/leaderboard/${date.getFullYear()}/${date.getMonth()}`,
    )
  }

  async getLeaderboard() {
    return await fetch(`${baseURL}/poop/leaderboard`)
  }

  async getProfile(id: string) {
    return await fetch(`${baseURL}/profile/${id}`)
  }

  async getStats() {
    return await fetch(`${baseURL}/poop/stats`)
  }

  async getUserStats(id: string) {
    return await fetch(`${baseURL}/poop/stats/${id}`)
  }

  async getMonthlyUserStats(id: string, date = new Date()) {
    return await fetch(
      `${baseURL}/poop/stats/${id}/${date.getFullYear()}/${date.getMonth()}`,
    )
  }

  async searchProfile(username: string) {
    return await fetch(`${baseURL}/profile/search?username=${username}`)
  }

  async getPoopsFromUser(id: string) {
    return await fetch(`${baseURL}/poop/${id}`)
  }

  async getMonthlyPoopsFromUser(id: string, date = new Date()) {
    return await fetch(
      `${baseURL}/poop/${id}/${date.getFullYear()}/${date.getMonth()}`,
    )
  }

  async getMonthlyPoops(date = new Date()) {
    return await fetch(
      `${baseURL}/poop/all/${date.getFullYear()}/${date.getMonth()}`,
    )
  }
}
