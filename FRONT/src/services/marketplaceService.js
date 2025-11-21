/**
 * Marketplace Service
 * Handles all marketplace-related API calls
 * Based on backend API documentation endpoints:
 * - GET /marketplace/listings - Get active listings
 * - POST /marketplace/listings - Create new listing
 * - POST /marketplace/listings/buy - Purchase tokens
 * - GET /marketplace/stats - Get marketplace statistics
 * - GET /marketplace/transactions - Get recent trades
 */

import api, { buildQueryParams } from './api'

export const marketplaceService = {
  /**
   * Get marketplace listings
   * @param {Object} filters
   * @param {string} filters.propertyId - Filter by property
   * @param {string} filters.status - Filter by listing status
   * @param {number} filters.page - Page number
   * @param {number} filters.limit - Items per page
   * @returns {Promise<{data: Array, total: number}>}
   */
  async getListings(filters = {}) {
    const queryString = buildQueryParams(filters)
    const response = await api.get(`/marketplace/listings${queryString ? `?${queryString}` : ''}`)
    return response.data
  },

  /**
   * Create new marketplace listing
   * @param {Object} data
   * @param {string} data.propertyId - Property ID
   * @param {number} data.tokensAmount - Number of tokens to sell
   * @param {number} data.pricePerToken - Price per token in USDC
   * @returns {Promise<Object>} Created listing
   */
  async createListing(data) {
    const response = await api.post('/marketplace/listings', data)
    return response.data
  },

  /**
   * Buy tokens from marketplace
   * @param {Object} data
   * @param {string} data.propertyId - Property ID
   * @param {number} data.tokensAmount - Number of tokens to buy
   * @param {string} data.buyerAddress - Buyer's Stellar address
   * @param {string} data.signedTransaction - Signed Stellar transaction XDR
   * @returns {Promise<Object>} Purchase confirmation with transaction hash
   */
  async buyTokens(data) {
    const response = await api.post('/marketplace/listings/buy', data)
    return response.data
  },

  /**
   * Get marketplace statistics
   * @returns {Promise<Object>} Stats object
   */
  async getStats() {
    const response = await api.get('/marketplace/stats')
    return response.data
  },

  /**
   * Get recent marketplace transactions
   * @param {number} limit - Number of transactions to return
   * @returns {Promise<Array>} Array of recent transactions
   */
  async getRecentTransactions(limit = 10) {
    const response = await api.get(`/marketplace/transactions?limit=${limit}`)
    return response.data
  },
}
