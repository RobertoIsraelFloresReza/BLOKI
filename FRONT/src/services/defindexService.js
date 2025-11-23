/**
 * DeFindex Service
 * Handles yield estimation and vault information
 */

import api from './api'

export const defindexService = {
  /**
   * Get available vaults
   * @returns {Promise<Array<{address, apy, tvl, asset}>>}
   */
  async getVaults() {
    console.log('💰 === DEFINDEX SERVICE: GET VAULTS ===')

    const response = await api.get('/defindex/vaults')

    console.log('✅ Vaults received:', response.data)
    return response.data
  },

  /**
   * Estimate yield
   * @param {number} amount - Amount in USDC
   * @param {number} durationDays - Lock duration in days
   * @returns {Promise<{estimatedYield, apy, sellerYield, buyerYield, protocolYield}>}
   */
  async estimateYield(amount, durationDays) {
    console.log('💰 === DEFINDEX SERVICE: ESTIMATE YIELD ===')
    console.log('Amount:', amount)
    console.log('Duration (days):', durationDays)

    const response = await api.get('/defindex/estimate', {
      params: { amount, duration: durationDays }
    })

    console.log('✅ Yield estimate received:', response.data)
    return response.data
  }
}

export default defindexService
