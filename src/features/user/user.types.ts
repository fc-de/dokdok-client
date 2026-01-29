export type User = {
  id: number
  nickname: string
  profileImageUrl: string | null
  createdAt: string
}

export type UserUpdateInput = {
  nickname: string
}
