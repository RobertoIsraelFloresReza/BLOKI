/**
 * Wallet Service
 * Handles wallet and transaction-related API calls
 * Based on backend API documentation endpoints:
 * - GET /wallet/balance - Get wallet balances
 * - GET /wallet/transactions - Get transaction history
 */

import api, { buildQueryParams } from './api'

export const walletService = {
  /**
   * Get wallet balances (XLM + all property tokens)
   * @param {string} address - Optional wallet address (defaults to authenticated user)
   * @returns {Promise<Object>} Balance object
   */
  async getBalance(address) {
    const params = address ? { address } : {}
    const queryString = buildQueryParams(params)
    const response = await api.get(`/wallet/balance${queryString ? `?${queryString}` : ''}`)
    return response.data
  },

  /**
   * Get wallet transaction history
   * @param {Object} filters
   * @param {string} filters.address - Wallet address
   * @param {number} filters.page - Page number
   * @param {number} filters.limit - Items per page
   * @param {string} filters.type - Transaction type filter
   * @returns {Promise<{data: Array, total: number, page: number}>}
   */
  async getTransactions(filters = {}) {
    const queryString = buildQueryParams(filters)
    const response = await api.get(`/wallet/transactions${queryString ? `?${queryString}` : ''}`)
    return response.data
  },
}
