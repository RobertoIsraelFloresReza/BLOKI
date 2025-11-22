/**
 * Authentication Service
 * Handles all authentication-related API calls
 * Based on backend API documentation endpoints:
 * - POST /auth/register
 * - POST /auth/login
 * - GET /auth/validate
 * - POST /auth/logout
 * - GET /auth/profile
 */

import api from './api'

export const authService = {
  /**
   * Register new user with auto-generated Stellar wallet
   * @param {Object} data - User registration data
   * @param {string} data.email - User email
   * @param {string} data.password - User password
   * @param {string} data.name - User full name
   * @returns {Promise<{token: string, user: Object, wallet: Object}>}
   */
  async register(data) {
    const response = await api.post('/auth/register', {
      email: data.email,
      password: data.password,
      name: data.name,
    })

    // Backend returns: { token, user, wallet: { publicKey, secretKey, mnemonic } }
    const { token, user, wallet } = response.data

    // Store token and user
    if (token) {
      localStorage.setItem('blocki_token', token)
    }
    if (user) {
      localStorage.setItem('blocki_user', JSON.stringify(user))
    }

    return { token, user, wallet }
  },

  /**
   * Login user
   * @param {Object} credentials
   * @param {string} credentials.email
   * @param {string} credentials.password
   * @returns {Promise<{token: string, user: Object}>}
   */
  async login(credentials) {
    const response = await api.post('/auth/login', {
      email: credentials.email,
      password: credentials.password,
    })

    const { token, user } = response.data

    // Store token and user
    if (token) {
      localStorage.setItem('blocki_token', token)
    }
    if (user) {
      localStorage.setItem('blocki_user', JSON.stringify(user))
    }

    return { token, user }
  },

  /**
   * Logout user
   * @returns {Promise<void>}
   */
  async logout() {
    try {
      await api.post('/auth/logout')
    } finally {
      // Always clear local storage even if request fails
      localStorage.removeItem('blocki_token')
      localStorage.removeItem('blocki_user')
    }
  },

  /**
   * Validate current token
   * @returns {Promise<{valid: boolean, user: Object}>}
   */
  async validateToken() {
    const response = await api.get('/auth/validate')
    return response.data
  },

  /**
   * Get current user profile
   * @returns {Promise<Object>} User object
   */
  async getProfile() {
    const response = await api.get('/auth/profile')
    return response.data
  },

  /**
   * OAuth2 - Google Sign In
   * Redirects to backend OAuth endpoint
   */
  googleSignIn() {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
    window.location.href = `${apiUrl}/auth/google`
  },

  /**
   * OAuth2 - GitHub Sign In
   * Redirects to backend OAuth endpoint
   */
  githubSignIn() {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
    window.location.href = `${apiUrl}/auth/github`
  },

  /**
   * OAuth2 - Handle callback
   * @param {string} code - OAuth code from provider
   * @param {string} provider - OAuth provider (google, github)
   * @returns {Promise<{token: string, user: Object}>}
   */
  async oauthCallback(code, provider) {
    const response = await api.post(`/auth/${provider}/callback`, { code })
    const { token, user } = response.data

    if (token) {
      localStorage.setItem('blocki_token', token)
    }
    if (user) {
      localStorage.setItem('blocki_user', JSON.stringify(user))
    }

    return { token, user }
  },
}
