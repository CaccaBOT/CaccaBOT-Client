export default class API {
  async getMonthlyLeaderboard(date: Date = new Date()) {
    return await fetch(
      `http://localhost:3000/api/poop/leaderboard/${date.getFullYear()}/${date.getMonth()}`,
    )
  }

  async getLeaderboard() {
    return await fetch(`http://localhost:3000/api/poop/leaderboard`)
  }

  async getProfile(id: string) {
    return await fetch(`http://localhost:3000/api/profile/${id}`)
  }

  async getStats() {
    return await fetch(`http://localhost:3000/api/poop/stats`)
  }

  async getUserStats(id: string) {
    return await fetch(`http://localhost:3000/api/poop/stats/${id}`)
  }

  async getMonthlyUserStats(id: string, date = new Date()) {
    return await fetch(
      `http://localhost:3000/api/poop/stats/${id}/${date.getFullYear()}/${date.getMonth()}`,
    )
  }

  async searchProfile(username: string) {
    return await fetch(
      `http://localhost:3000/api/profile/search?username=${username}`,
    )
  }

  async getPoopsFromUser(id: string) {
    return await fetch(`http://localhost:3000/api/poop/${id}`)
  }

  async getMonthlyPoopsFromUser(id: string, date = new Date()) {
    return await fetch(
      `http://localhost:3000/api/poop/${id}/${date.getFullYear()}/${date.getMonth()}`,
    )
  }

  async getMonthlyPoops(date = new Date()) {
    return await fetch(
      `http://localhost:3000/api/poop/all/${date.getFullYear()}/${date.getMonth()}`,
    )
  }
}
