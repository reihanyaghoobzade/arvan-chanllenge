import { defineStore } from 'pinia'
import TokenService from '../data/services/token'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: TokenService.getToken(),
    isLoggedIn: false,
    user: {
      username: null,
      email: null
    }
  }),
  getters: {
    getUser: (state) => state.user,
    getIsLoggedIn: (state) => state.isLoggedIn
  },
  actions: {
    afterSuccessLogin(user) {
      TokenService.setToken(user?.token)
      this.user = { username: user?.username, email: user?.email }
    },
    checkIsLoggedIn() {
      const token = TokenService.getToken()
      if (token) {
        this.token = token
        this.isLoggedIn = true
      }
    },
    setCurrentUser(user) {
      this.user = { username: user?.username, email: user?.email }
    }
  }
})
