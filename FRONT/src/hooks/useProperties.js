/**
 * useProperties Hook
 * Manages property listings with TanStack Query
 * Provides CRUD operations for properties
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { propertyService } from '@/services'
import toast from 'react-hot-toast'
import { useStrings } from '@/utils/localizations/useStrings'

/**
 * Hook for fetching multiple properties with filters
 */
export function useProperties(filters = {}) {
  const queryClient = useQueryClient()
  const Strings = useStrings()

  // Fetch properties
  const query = useQuery({
    queryKey: ['properties', 'list', filters],
    queryFn: async () => {
      const result = await propertyService.getProperties(filters)
      console.log('🔍 DEBUG useProperties - Raw result:', result)
      console.log('🔍 DEBUG useProperties - result.data:', result?.data)
      return result
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  })

  // Create property mutation
  const createMutation = useMutation({
    mutationFn: propertyService.createProperty,
    onSuccess: (newProperty) => {
      console.log('🔍 DEBUG useProperties - Property created:', newProperty)
      console.log('🔍 DEBUG useProperties - Invalidating queries...')
      queryClient.invalidateQueries({ queryKey: ['properties', 'list'] })
      queryClient.invalidateQueries({ queryKey: ['properties'] })
      toast.success(Strings.propertyCreated || 'Propiedad creada exitosamente')
      return newProperty
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Error al crear propiedad'
      toast.error(message)
    },
  })

  // Update property mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => propertyService.updateProperty(id, data),
    onSuccess: (updatedProperty) => {
      queryClient.invalidateQueries({ queryKey: ['properties'] })
      toast.success(Strings.propertyUpdated || 'Propiedad actualizada')
      return updatedProperty
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Error al actualizar propiedad'
      toast.error(message)
    },
  })

  // Delete property mutation
  const deleteMutation = useMutation({
    mutationFn: propertyService.deleteProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] })
      toast.success(Strings.propertyDeleted || 'Propiedad eliminada')
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Error al eliminar propiedad'
      toast.error(message)
    },
  })

  // Upload images mutation
  const uploadImagesMutation = useMutation({
    mutationFn: ({ id, files }) => propertyService.uploadImages(id, files),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['properties', 'detail', variables.id] })
      toast.success(Strings.imagesUploaded || 'Imágenes subidas correctamente')
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Error al subir imágenes'
      toast.error(message)
    },
  })

  // Upload documents mutation
  const uploadDocumentsMutation = useMutation({
    mutationFn: ({ id, files }) => propertyService.uploadDocuments(id, files),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['properties', 'detail', variables.id] })
      toast.success(Strings.documentsUploaded || 'Documentos subidos correctamente')
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Error al subir documentos'
      toast.error(message)
    },
  })

  return {
    // Query state
    // Backend returns: {data: [...], status: 200, message: "success"}
    properties: query.data?.data || query.data || [],
    total: query.data?.total || 0,
    page: query.data?.page || 1,
    pageSize: query.data?.pageSize || 10,
    isLoading: query.isLoading,
    error: query.error,

    // Mutations
    createProperty: createMutation.mutate,
    createPropertyAsync: createMutation.mutateAsync,
    isCreating: createMutation.isPending,

    updateProperty: updateMutation.mutate,
    updatePropertyAsync: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,

    deleteProperty: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,

    uploadImages: uploadImagesMutation.mutate,
    uploadImagesAsync: uploadImagesMutation.mutateAsync,
    isUploadingImages: uploadImagesMutation.isPending,

    uploadDocuments: uploadDocumentsMutation.mutate,
    isUploadingDocuments: uploadDocumentsMutation.isPending,
  }
}

/**
 * Hook for fetching a single property by ID
 */
export function useProperty(id) {
  return useQuery({
    queryKey: ['properties', 'detail', id],
    queryFn: () => propertyService.getPropertyById(id),
    enabled: !!id,
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

/**
 * Hook for fetching property token info from blockchain
 */
export function usePropertyTokenInfo(id) {
  return useQuery({
    queryKey: ['properties', 'token-info', id],
    queryFn: () => propertyService.getTokenInfo(id),
    enabled: !!id,
    staleTime: 30 * 1000, // 30 seconds (blockchain data changes frequently)
  })
}

/**
 * Hook for fetching property transaction history
 */
export function usePropertyHistory(id) {
  return useQuery({
    queryKey: ['properties', 'history', id],
    queryFn: () => propertyService.getTransactionHistory(id),
    enabled: !!id,
    staleTime: 30 * 1000, // 30 seconds
  })
}
