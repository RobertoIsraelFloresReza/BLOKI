import api from './api'

/**
 * Evaluator Service
 * Handles API calls for certified property evaluators
 */

export const evaluatorService = {
  /**
   * Get all evaluators
   * @param {boolean} onlyActive - Filter only active evaluators
   */
  async getAllEvaluators(onlyActive = true) {
    console.log('🔵 [evaluatorService] Fetching evaluators with onlyActive:', onlyActive)
    const response = await api.get('/evaluators', {
      params: { onlyActive: onlyActive.toString() }
    })
    console.log('🔵 [evaluatorService] API Response:', response)
    console.log('🔵 [evaluatorService] Response data:', response.data)
    console.log('🔵 [evaluatorService] Response data type:', typeof response.data)
    console.log('🔵 [evaluatorService] Is array?:', Array.isArray(response.data))
    return response.data
  },

  /**
   * Get single evaluator by ID
   */
  async getEvaluatorById(id) {
    const response = await api.get(`/evaluators/${id}`)
    return response.data
  },

  /**
   * Create new evaluator (Admin only)
   */
  async createEvaluator(data) {
    const response = await api.post('/evaluators', data)
    return response.data
  },

  /**
   * Update evaluator (Admin only)
   */
  async updateEvaluator(id, data) {
    const response = await api.patch(`/evaluators/${id}`, data)
    return response.data
  },

  /**
   * Delete evaluator (Admin only)
   */
  async deleteEvaluator(id) {
    const response = await api.delete(`/evaluators/${id}`)
    return response.data
  }
}
