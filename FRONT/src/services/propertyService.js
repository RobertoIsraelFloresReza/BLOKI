/**
 * Property Service
 * Handles all property-related API calls
 * Based on backend API documentation endpoints:
 * - GET /properties - List all properties
 * - GET /properties/:id - Property details
 * - POST /properties - Create new property (deploy PropertyToken)
 * - PUT /properties/:id - Update property
 * - DELETE /properties/:id - Delete property
 * - POST /properties/:id/images - Upload property images
 * - POST /properties/:id/documents - Upload property documents
 * - GET /properties/:id/token-info - Get blockchain token info
 * - GET /properties/:id/history - Transaction history
 */

import api, { buildQueryParams, createFormDataRequest } from './api'

export const propertyService = {
  /**
   * Get all properties with optional filters
   * @param {Object} filters
   * @param {string} filters.status - Filter by status (active, sold_out, pending)
   * @param {string} filters.category - Filter by category (houses, apartments, hotels, commercial)
   * @param {number} filters.minPrice - Minimum price
   * @param {number} filters.maxPrice - Maximum price
   * @param {string} filters.search - Search query (name, location, address)
   * @param {string} filters.sortBy - Sort field (price, createdAt, name)
   * @param {string} filters.sortOrder - Sort order (asc, desc)
   * @param {number} filters.page - Page number
   * @param {number} filters.limit - Items per page
   * @returns {Promise<{data: Array, total: number, page: number, pageSize: number}>}
   */
  async getProperties(filters = {}) {
    const queryString = buildQueryParams(filters)
    const response = await api.get(`/properties${queryString ? `?${queryString}` : ''}`)
    return response.data
  },

  /**
   * Get property by ID
   * @param {string} id - Property ID
   * @returns {Promise<Object>} Property object
   */
  async getPropertyById(id) {
    const response = await api.get(`/properties/${id}`)
    return response.data
  },

  /**
   * Create new property and deploy PropertyToken contract
   * @param {Object} data
   * @param {string} data.name - Property name
   * @param {string} data.propertyId - Unique property identifier
   * @param {string} data.address - Property address
   * @param {string} data.description - Property description
   * @param {number} data.valuation - Property valuation in USD
   * @param {number} data.totalSupply - Total number of tokens
   * @param {string} data.legalOwner - Legal owner name
   * @param {string} data.adminSecretKey - Stellar admin secret key (required for contract deployment)
   * @param {Object} data.metadata - Additional metadata (bedrooms, bathrooms, area, etc)
   * @returns {Promise<Object>} Created property with contract ID
   */
  async createProperty(data) {
    console.log('🏗️ === PROPERTY SERVICE: CREATE PROPERTY ===')
    console.log('📝 Input data:', data)

    // Note: category should be in metadata, not as root field
    const payload = {
      ...data,
      metadata: {
        ...data.metadata,
        category: data.category || data.metadata?.category || 'houses'
      }
    }
    // Remove category from root if exists
    delete payload.category

    console.log('📦 Final payload:', JSON.stringify(payload, null, 2))
    console.log('🔗 POST /properties')

    const response = await api.post('/properties', payload)

    console.log('✅ Property created successfully!')
    console.log('📄 Raw response:', response.data)

    // Handle wrapped response format: { data: {...}, message, status }
    const propertyData = response.data.data || response.data

    console.log('📦 Property data:', propertyData)
    console.log('🆔 Property ID:', propertyData.id)
    console.log('🔗 Contract ID:', propertyData.contractId)
    console.log('=== CREATE PROPERTY END ===')

    return propertyData
  },

  /**
   * Update property
   * @param {string} id - Property ID
   * @param {Object} data - Updated property data
   * @returns {Promise<Object>} Updated property
   */
  async updateProperty(id, data) {
    const response = await api.put(`/properties/${id}`, data)
    return response.data
  },

  /**
   * Delete property (only owner can delete)
   * @param {string} id - Property ID
   * @returns {Promise<void>}
   */
  async deleteProperty(id) {
    const response = await api.delete(`/properties/${id}`)
    return response.data
  },

  /**
   * Upload property images
   * @param {string} id - Property ID
   * @param {File[]} files - Array of image files
   * @returns {Promise<{images: string[]}>} Array of uploaded image URLs
   */
  async uploadImages(id, files) {
    console.log('🖼️ === PROPERTY SERVICE: UPLOAD IMAGES ===')
    console.log('📍 Property ID:', id)
    console.log('📁 Files to upload:', files.length)

    files.forEach((file, i) => {
      console.log(`  ${i + 1}. ${file.name} - ${(file.size / 1024).toFixed(2)}KB - ${file.type}`)
    })

    const formData = createFormDataRequest({}, files, 'images')

    console.log('📤 FormData created, sending to backend...')
    console.log(`🔗 POST /properties/${id}/images`)

    const response = await api.post(`/properties/${id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    console.log('✅ Backend response:', response.data)

    // Handle wrapped response format
    const resultData = response.data.data || response.data

    console.log('📦 Result data:', resultData)
    console.log('🔗 Uploaded images:', resultData.images)
    console.log('=== UPLOAD IMAGES END ===')

    return resultData
  },

  /**
   * Upload property documents
   * @param {string} id - Property ID
   * @param {File[]} files - Array of document files
   * @returns {Promise<{documents: string[]}>} Array of uploaded document URLs
   */
  async uploadDocuments(id, files) {
    const formData = createFormDataRequest({}, files, 'documents')

    const response = await api.post(`/properties/${id}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    return response.data
  },

  /**
   * Get property token info from blockchain
   * @param {string} id - Property ID
   * @returns {Promise<Object>} Token info (contract ID, total supply, available tokens, etc)
   */
  async getTokenInfo(id) {
    const response = await api.get(`/properties/${id}/token-info`)
    return response.data
  },

  /**
   * Get property transaction history
   * @param {string} id - Property ID
   * @returns {Promise<Array>} Array of transactions
   */
  async getTransactionHistory(id) {
    const response = await api.get(`/properties/${id}/history`)
    return response.data
  },

  /**
   * Get properties owned by current user (created by user)
   * @returns {Promise<Array>} Array of owned properties
   */
  async getMyOwnedProperties() {
    console.log('🔍 DEBUG propertyService - Calling GET /properties/my-owned')
    console.log('🔍 DEBUG propertyService - Token:', localStorage.getItem('blocki_token'))
    const response = await api.get('/properties/my-owned')
    console.log('🔍 DEBUG propertyService - Response:', response.data)
    return response.data
  },

  /**
   * Get properties where user has invested (holds tokens)
   * @returns {Promise<Array>} Array of investment properties
   */
  async getMyInvestments() {
    const response = await api.get('/properties/my-investments')
    return response.data
  },
}
