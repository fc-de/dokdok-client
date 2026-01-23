// PrivateRoute에서 사용하는 인증 훅 (stub)
interface User {
  needsOnboarding?: boolean
}

export function useAuth() {
  return {
    data: null as User | null,
    isLoading: false
  }
}
