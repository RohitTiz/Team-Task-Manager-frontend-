import { authAPI } from './api'

export const login = async (email, password) => {
  const response = await authAPI.login({ email, password })
  return response.data
}

export const register = async (userData) => {
  const response = await authAPI.register(userData)
  return response.data
}

export const logout = async () => {
  await authAPI.logout()
  localStorage.removeItem('accessToken')
  localStorage.removeItem('user')
}