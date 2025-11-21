/**
 * useMarketplace Hook
 * Manages marketplace operations with TanStack Query
 * Provides listing management and token purchase functionality
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { marketplaceService } from '@/services'
import toast from 'react-hot-toast'
import { useStrings } from '@/utils/localizations/useStrings'

export function useMarketplace(filters = {}) {
  const queryClient = useQueryClient()
  const Strings = useStrings()

  // Get listings
  const listingsQuery = useQuery({
    queryKey: ['marketplace', 'listings', filters],
    queryFn: () => marketplaceService.getListings(filters),
    staleTime: 1 * 60 * 1000, // 1 minute
  })

  // Get market stats
  const statsQuery = useQuery({
    queryKey: ['marketplace', 'stats'],
    queryFn: marketplaceService.getStats,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 20 * 1000, // 20 seconds
  })

  // Get recent transactions
  const transactionsQuery = useQuery({
    queryKey: ['marketplace', 'transactions'],
    queryFn: () => marketplaceService.getRecentTransactions(),
    refetchInterval: 15000, // Refetch every 15 seconds
    staleTime: 10 * 1000, // 10 seconds
  })

  // Create listing mutation
  const createListingMutation = useMutation({
    mutationFn: marketplaceService.createListing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketplace', 'listings'] })
      queryClient.invalidateQueries({ queryKey: ['properties'] })
      toast.success(Strings.listingCreated || 'Listado creado exitosamente')
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Error al crear listado'
      toast.error(message)
    },
  })

  // Buy tokens mutation
  const buyTokensMutation = useMutation({
    mutationFn: marketplaceService.buyTokens,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['marketplace'] })
      queryClient.invalidateQueries({ queryKey: ['properties'] })
      queryClient.invalidateQueries({ queryKey: ['wallet'] })
      queryClient.invalidateQueries({ queryKey: ['ownership'] })
      toast.success(Strings.purchaseSuccess || '¡Tokens comprados exitosamente!')
      return data
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Error al comprar tokens'
      toast.error(message)
    },
  })

  return {
    // Listings
    listings: listingsQuery.data?.data || [],
    listingsTotal: listingsQuery.data?.total || 0,
    isLoadingListings: listingsQuery.isLoading,
    listingsError: listingsQuery.error,

    // Stats
    stats: statsQuery.data,
    isLoadingStats: statsQuery.isLoading,

    // Transactions
    recentTransactions: transactionsQuery.data || [],
    isLoadingTransactions: transactionsQuery.isLoading,

    // Mutations
    createListing: createListingMutation.mutate,
    createListingAsync: createListingMutation.mutateAsync,
    isCreatingListing: createListingMutation.isPending,

    buyTokens: buyTokensMutation.mutate,
    buyTokensAsync: buyTokensMutation.mutateAsync,
    isBuyingTokens: buyTokensMutation.isPending,
  }
}
