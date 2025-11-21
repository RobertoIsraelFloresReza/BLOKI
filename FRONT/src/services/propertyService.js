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

    console.log('🔍 DEBUG propertyService - Create payload:', payload)
    const response = await api.post('/properties', payload)
    console.log('🔍 DEBUG propertyService - Create response:', response.data)
    return response.data
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
   * Delete property
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
    const formData = createFormDataRequest({}, files, 'images')

    const response = await api.post(`/properties/${id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    return response.data
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
}
