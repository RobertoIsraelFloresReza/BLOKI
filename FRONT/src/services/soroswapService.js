/**
 * Soroswap Service
 * Handles DEX swaps for property tokens
 */

import api from './api'

export const soroswapService = {
  /**
   * Get swap quote
   * @param {string} propertyToken - Property token address
   * @param {string} usdcToken - USDC token address
   * @param {number} amountIn - Amount to swap
   * @returns {Promise<{amountOut, path, priceImpact}>}
   */
  async getSwapQuote(propertyToken, usdcToken, amountIn) {
    console.log('🔄 === SOROSWAP SERVICE: GET QUOTE ===')
    console.log('Property Token:', propertyToken)
    console.log('USDC Token:', usdcToken)
    console.log('Amount In:', amountIn)

    const response = await api.get('/soroswap/quote', {
      params: { propertyToken, usdcToken, amountIn }
    })

    console.log('✅ Quote received:', response.data)
    return response.data
  },

  /**
   * Execute swap
   * @param {string} seller - Seller wallet address
   * @param {string} propertyToken
   * @param {string} usdcToken
   * @param {number} amountIn
   * @param {number} minUsdcOut
   * @returns {Promise<{transactionId, amountOut}>}
   */
  async executeSwap(seller, propertyToken, usdcToken, amountIn, minUsdcOut) {
    console.log('🔄 === SOROSWAP SERVICE: EXECUTE SWAP ===')
    console.log('Seller:', seller)
    console.log('Property Token:', propertyToken)
    console.log('USDC Token:', usdcToken)
    console.log('Amount In:', amountIn)
    console.log('Min USDC Out:', minUsdcOut)

    const response = await api.post('/soroswap/swap', {
      seller,
      propertyToken,
      usdcToken,
      amountIn,
      minUsdcOut
    })

    console.log('✅ Swap executed:', response.data)
    return response.data
  }
}

export default soroswapService
