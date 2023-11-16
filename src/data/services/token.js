import Cookies from 'js-cookie'

const TANK_TOKEN_KEY = 'arvan-challenge-accessToken'

const TokenService = {
  getToken() {
    return Cookies.get(TANK_TOKEN_KEY) || ''
  },

  setToken(token) {
    Cookies.set(TANK_TOKEN_KEY, token, { expires: 7 })
  },

  removeToken() {
    Cookies.remove(TANK_TOKEN_KEY, { path: '' })
  }
}

export default TokenService
