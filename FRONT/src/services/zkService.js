/**
 * ZK Service
 * Handles zero-knowledge proof generation and verification
 */

import api from './api'

export const zkService = {
  /**
   * Generate KYC proof
   * @param {string} kycId
   * @param {number} kycStatus - 1 = approved
   * @param {string} userSecret
   * @returns {Promise<{proof, publicSignals}>}
   */
  async generateKYCProof(kycId, kycStatus, userSecret) {
    console.log('🔐 === ZK SERVICE: GENERATE KYC PROOF ===')
    console.log('KYC ID:', kycId)
    console.log('KYC Status:', kycStatus)

    const response = await api.post('/zk/generate-kyc-proof', {
      kycId,
      kycStatus,
      userSecret
    })

    console.log('✅ Proof generated')
    return response.data
  },

  /**
   * Verify KYC proof on-chain
   * @param {Object} proof
   * @param {Array} publicSignals
   * @returns {Promise<{success, transactionHash}>}
   */
  async verifyKYCProof(proof, publicSignals) {
    console.log('🔐 === ZK SERVICE: VERIFY KYC PROOF ===')

    const response = await api.post('/zk/verify-kyc', {
      proof,
      publicSignals
    })

    console.log('✅ Verification result:', response.data)
    return response.data
  }
}

export default zkService
