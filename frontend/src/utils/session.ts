import { STORAGE_KEYS } from '../constants/storage'
import type { AuthUser } from '../types/auth'
import { isTokenExpired, mapTokenToAuthUser } from './jwt'

export const sessionStorageService = {
  saveToken(token: string) {
    localStorage.setItem(STORAGE_KEYS.authToken, token)
  },

  getToken() {
    return localStorage.getItem(STORAGE_KEYS.authToken)
  },

  removeToken() {
    localStorage.removeItem(STORAGE_KEYS.authToken)
  },

  saveUser(user: AuthUser) {
    localStorage.setItem(STORAGE_KEYS.authUser, JSON.stringify(user))
  },

  getUser() {
    const storedUser = localStorage.getItem(STORAGE_KEYS.authUser)

    if (!storedUser) {
      return null
    }

    try {
      return JSON.parse(storedUser) as AuthUser
    } catch {
      return null
    }
  },

  clearSession() {
    localStorage.removeItem(STORAGE_KEYS.authToken)
    localStorage.removeItem(STORAGE_KEYS.authUser)
  },

  restoreSession() {
    const token = this.getToken()

    if (!token || isTokenExpired(token)) {
      this.clearSession()
      return null
    }

    const user = mapTokenToAuthUser(token)

    if (!user) {
      this.clearSession()
      return null
    }

    this.saveUser(user)
    return { token, user }
  },
}
