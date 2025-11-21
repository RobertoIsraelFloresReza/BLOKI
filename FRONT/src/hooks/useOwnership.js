/**
 * useOwnership Hook
 * Manages property ownership data with TanStack Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ownershipService } from '@/services'
import toast from 'react-hot-toast'

/**
 * Hook for fetching property ownership distribution
 */
export function usePropertyOwnership(propertyId) {
  return useQuery({
    queryKey: ['ownership', 'property', propertyId],
    queryFn: () => ownershipService.getPropertyOwnership(propertyId),
    enabled: !!propertyId,
    staleTime: 30 * 1000, // 30 seconds
  })
}

/**
 * Hook for fetching properties owned by an address
 */
export function useOwnerProperties(ownerAddress) {
  return useQuery({
    queryKey: ['ownership', 'owner', ownerAddress],
    queryFn: () => ownershipService.getPropertiesByOwner(ownerAddress),
    enabled: !!ownerAddress,
    staleTime: 30 * 1000, // 30 seconds
  })
}

/**
 * Hook for syncing ownership from blockchain
 */
export function useSyncOwnership() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ownershipService.syncFromBlockchain,
    onSuccess: (data, propertyId) => {
      queryClient.invalidateQueries({ queryKey: ['ownership', 'property', propertyId] })
      queryClient.invalidateQueries({ queryKey: ['properties', 'detail', propertyId] })
      toast.success('Propiedad sincronizada desde blockchain')
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Error al sincronizar'
      toast.error(message)
    },
  })
}
