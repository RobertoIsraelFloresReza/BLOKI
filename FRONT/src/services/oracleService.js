/**
 * Oracle Service
 * Handles price feeds and property valuations
 */

import api from './api'

export const oracleService = {
  /**
   * Get asset price
   * @param {string} asset - "XLM" | "USDC" | "BTC"
   * @returns {Promise<{price, timestamp, confidence}>}
   */
  async getPrice(asset) {
    console.log('📊 === ORACLE SERVICE: GET PRICE ===')
    console.log('Asset:', asset)

    const response = await api.get(`/oracle/price/${asset}`)

    console.log('✅ Price received:', response.data)
    return response.data
  },

  /**
   * Get property valuation
   * @param {string} propertyId
   * @param {number} sqft
   * @param {number} locationMultiplier - 100 = 1.0x
   * @returns {Promise<{propertyId, valuation}>}
   */
  async getPropertyValuation(propertyId, sqft, locationMultiplier = 100) {
    console.log('🏠 === ORACLE SERVICE: GET VALUATION ===')
    console.log('Property ID:', propertyId)
    console.log('Sqft:', sqft)
    console.log('Location Multiplier:', locationMultiplier)

    const response = await api.get(`/oracle/valuation/${propertyId}`, {
      params: { sqft, locationMultiplier }
    })

    console.log('✅ Valuation received:', response.data)
    return response.data
  }
}

export default oracleService
