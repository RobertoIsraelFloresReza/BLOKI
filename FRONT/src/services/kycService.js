import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

/**
 * KYC Service
 * Handles all KYC verification API calls
 */
export const kycService = {
  /**
   * Starts a new KYC verification session
   * @param {number} userId - User ID
   * @param {number} level - KYC level (1, 2, or 3)
   * @returns {Promise} KYC session data with verification URL
   */
  async startKYC(userId, level = 1) {
    try {
      const token = localStorage.getItem('blocki_token')
      const response = await axios.post(
        `${API_URL}/kyc/start`,
        {
          userId,
          level,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      return response.data
    } catch (error) {
      console.error('Error starting KYC:', error)
      throw error
    }
  },

  /**
   * Gets the current KYC status for a user
   * @param {number} userId - User ID
   * @returns {Promise} KYC status information
   */
  async getKYCStatus(userId) {
    try {
      const token = localStorage.getItem('blocki_token')
      const response = await axios.get(`${API_URL}/kyc/status/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error) {
      console.error('Error getting KYC status:', error)
      throw error
    }
  },

  /**
   * Retries a failed KYC verification
   * @param {number} userId - User ID
   * @returns {Promise} New KYC session data
   */
  async retryKYC(userId) {
    try {
      const token = localStorage.getItem('blocki_token')
      const response = await axios.post(
        `${API_URL}/kyc/retry/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      return response.data
    } catch (error) {
      console.error('Error retrying KYC:', error)
      throw error
    }
  },

  /**
   * Gets the transaction limit for a user based on their KYC level
   * @param {number} userId - User ID
   * @returns {Promise} Transaction limit information
   */
  async getTransactionLimit(userId) {
    try {
      const token = localStorage.getItem('blocki_token')
      const response = await axios.get(`${API_URL}/kyc/transaction-limit/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error) {
      console.error('Error getting transaction limit:', error)
      throw error
    }
  },

  /**
   * Fixes the externalVerificationId for old KYC sessions
   * @param {number} userId - User ID
   * @returns {Promise} Fix result
   */
  async fixExternalVerificationId(userId) {
    try {
      const token = localStorage.getItem('blocki_token')
      const response = await axios.post(
        `${API_URL}/kyc/fix-external-id/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      return response.data
    } catch (error) {
      console.error('Error fixing external verification ID:', error)
      throw error
    }
  },
}
