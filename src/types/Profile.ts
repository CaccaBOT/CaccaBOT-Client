export type Profile = {
  id: string
  username: string
  bio: string | null
  pfp: string | null
  poops: number
  frozen: boolean
}

export type Poop = {
  id: string
  timestamp: string
  user_id: string
}