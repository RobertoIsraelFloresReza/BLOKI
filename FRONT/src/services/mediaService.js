import api from './api'

/**
 * Media Service
 * Handles file uploads to Cloudflare R2 via backend
 */

export const FILE_TYPES = {
  IMAGE: 'IMAGE',
  PDF: 'PDF',
  VIDEO: 'VIDEO',
  OTHER: 'OTHER',
}

export const mediaService = {
  /**
   * Upload files to Cloudflare R2
   * @param {File[]} files - Array of files to upload
   * @param {string} folder - Optional folder prefix (e.g., 'properties', 'evaluators')
   * @returns {Promise<Array>} Array of media objects with URLs
   */
  uploadFiles: async (files, folder = 'general') => {
    console.log('📤 === MEDIA SERVICE: UPLOAD FILES ===')
    console.log('📁 Folder:', folder)
    console.log('📦 Files:', files.length)

    files.forEach((file, i) => {
      console.log(`  ${i + 1}. ${file.name} - ${(file.size / 1024).toFixed(2)}KB - ${file.type}`)
    })

    const formData = new FormData()

    files.forEach((file) => {
      formData.append('files', file)
    })

    if (folder) {
      formData.append('folder', folder)
    }

    console.log('🚀 Sending to backend: POST /media/upload')

    const response = await api.post('media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    console.log('✅ Upload successful!')
    console.log('📄 Response:', response.data)
    console.log('=== UPLOAD FILES END ===')

    return response.data
  },

  /**
   * Delete media files
   * @param {number[]} ids - Array of media IDs to delete
   * @returns {Promise<Object>} Delete result
   */
  deleteFiles: async (ids) => {
    return await api.delete('media', {
      data: { ids },
    })
  },

  /**
   * Get media by entity
   * @param {number} entityId - Entity ID
   * @param {string} entityType - Entity type (PROPERTY, EVALUATOR, USER)
   * @returns {Promise<Array>} Array of media objects
   */
  getByEntity: async (entityId, entityType) => {
    const response = await api.get('media/entity', {
      params: { entityId, entityType },
    })
    return response.data
  },

  /**
   * Validate file type
   * @param {File} file - File to validate
   * @returns {string} File type constant
   */
  validateFileType: (file) => {
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    const allowedPdfTypes = ['application/pdf']
    const allowedVideoTypes = ['video/mp4', 'video/avi', 'video/mov']

    if (allowedImageTypes.includes(file.type)) {
      return FILE_TYPES.IMAGE
    } else if (allowedPdfTypes.includes(file.type)) {
      return FILE_TYPES.PDF
    } else if (allowedVideoTypes.includes(file.type)) {
      return FILE_TYPES.VIDEO
    }
    return FILE_TYPES.OTHER
  },

  /**
   * Validate file size
   * @param {File} file - File to validate
   * @param {number} maxSizeMB - Maximum size in MB (default: 10)
   * @returns {boolean} True if file size is valid
   */
  validateFileSize: (file, maxSizeMB = 10) => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    return file.size <= maxSizeBytes
  },

  /**
   * Validate image file
   * @param {File} file - File to validate
   * @returns {Object} Validation result { valid: boolean, error: string }
   */
  validateImage: (file) => {
    if (!file) {
      return { valid: false, error: 'No file provided' }
    }

    if (!file.type.startsWith('image/')) {
      return { valid: false, error: 'File must be an image' }
    }

    if (!mediaService.validateFileSize(file, 10)) {
      return { valid: false, error: 'File size must be less than 10MB' }
    }

    return { valid: true, error: null }
  },
}

export default mediaService
