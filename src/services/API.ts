import { useSessionStore } from "../stores/session"

export const baseURL = "https://caccabot.duckdns.org"
export const baseAPIURL = `${baseURL}/api`

export default class API {
  sessionStore = useSessionStore()

  async getVersion() {
    return await fetch(`${baseAPIURL}/internals/version`)
  }

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

  async logout(token: string) {
    return await fetch(`${baseAPIURL}/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
      }),
    })
  }

  async changeUsername(username: string) {
    return await fetch(`${baseAPIURL}/profile/username`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-Auth-Token": this.sessionStore.session.token,
      },
      body: JSON.stringify({
        username,
      }),
    })
  }

  async changePassword(password: string) {
    return await fetch(`${baseAPIURL}/auth/password`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-Auth-Token": this.sessionStore.session.token,
      },
      body: JSON.stringify({
        password,
      }),
    })
  }

  async changePfp(base64Pfp: string) {
    return await fetch(`${baseAPIURL}/profile/pfp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Auth-Token": this.sessionStore.session.token,
      },
      body: JSON.stringify({
        image: base64Pfp,
      }),
    })
  }

  async openPack() {
    return await fetch(`${baseAPIURL}/collectible/open`, {
      headers: {
        "X-Auth-Token": this.sessionStore.session.token,
      },
    })
  }

  async removePfp() {
    return await fetch(`${baseAPIURL}/profile/pfp`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-Auth-Token": this.sessionStore.session.token,
      },
    })
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

  async getOwnProfile() {
    return await fetch(`${baseAPIURL}/profile`, {
      headers: {
        "X-Auth-Token": this.sessionStore.session.token,
      },
    })
  }

  async getStats() {
    return await fetch(`${baseAPIURL}/poop/stats`)
  }

  async getUserCollectibles(id: string) {
    return await fetch(`${baseAPIURL}/collectible/inventory/${id}`)
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
