/**
 * User Service
 * Handles user-related API calls
 * Based on backend API documentation endpoints:
 * - GET /user/portfolio - Get user portfolio (owned properties)
 * - GET /user/properties - Get properties where user has tokens
 * - GET /user/transactions - Get user transaction history
 */

import api, { buildQueryParams } from './api'

export const userService = {
  /**
   * Get user portfolio (owned properties with tokens)
   * @param {string} stellarPublicKey - User's Stellar public key
   * @returns {Promise<Object>} Portfolio data
   */
  async getPortfolio(stellarPublicKey) {
    const queryString = buildQueryParams({ stellarPublicKey })
    const response = await api.get(`/user/portfolio${queryString ? `?${queryString}` : ''}`)
    return response.data
  },

  /**
   * Get properties where user has tokens
   * @param {string} stellarPublicKey - User's Stellar public key
   * @returns {Promise<Array>} Array of properties
   */
  async getUserProperties(stellarPublicKey) {
    const queryString = buildQueryParams({ stellarPublicKey })
    const response = await api.get(`/user/properties${queryString ? `?${queryString}` : ''}`)
    return response.data
  },

  /**
   * Get user transaction history
   * @param {string} stellarPublicKey - User's Stellar public key
   * @returns {Promise<Array>} Array of transactions
   */
  async getUserTransactions(stellarPublicKey) {
    const queryString = buildQueryParams({ stellarPublicKey })
    const response = await api.get(`/user/transactions${queryString ? `?${queryString}` : ''}`)
    return response.data
  },
}
