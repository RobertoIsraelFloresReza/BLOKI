/**
 * Ownership Service
 * Handles ownership tracking and blockchain sync
 * Based on backend API documentation endpoints:
 * - GET /ownership/property/:propertyId - Get ownership distribution
 * - GET /ownership/owner/:ownerAddress - Get properties by owner
 * - POST /ownership/property/:propertyId/sync - Sync from blockchain
 */

import api from './api'

export const ownershipService = {
  /**
   * Get ownership distribution for a property
   * @param {string} propertyId - Property ID
   * @returns {Promise<Object>} Ownership distribution with holders array
   */
  async getPropertyOwnership(propertyId) {
    const response = await api.get(`/ownership/property/${propertyId}`)
    return response.data
  },

  /**
   * Get all properties owned by an address
   * @param {string} ownerAddress - Stellar wallet address
   * @returns {Promise<Array>} Array of owned properties with token amounts
   */
  async getPropertiesByOwner(ownerAddress) {
    const response = await api.get(`/ownership/owner/${ownerAddress}`)
    return response.data
  },

  /**
   * Sync property ownership from blockchain
   * @param {string} propertyId - Property ID
   * @returns {Promise<Object>} Updated ownership data
   */
  async syncFromBlockchain(propertyId) {
    const response = await api.post(`/ownership/property/${propertyId}/sync`)
    return response.data
  },
}
