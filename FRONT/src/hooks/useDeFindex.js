/**
 * useDeFindex Hook
 * Manages DeFindex yield estimation and vault information
 */

import { useQuery } from '@tanstack/react-query'
import { defindexService } from '@/services'

export function useDeFindex() {
  // Get available vaults
  const vaultsQuery = useQuery({
    queryKey: ['defindex-vaults'],
    queryFn: () => defindexService.getVaults(),
    staleTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
  })

  return {
    vaults: vaultsQuery.data || [],
    isLoadingVaults: vaultsQuery.isLoading,
    vaultsError: vaultsQuery.error,

    /**
     * Estimate yield hook
     * @param {number} amount - Amount in USDC
     * @param {number} durationDays - Lock duration in days
     * @param {boolean} enabled
     */
    useYieldEstimate: (amount, durationDays, enabled = true) => {
      return useQuery({
        queryKey: ['yield-estimate', amount, durationDays],
        queryFn: () => defindexService.estimateYield(amount, durationDays),
        enabled: enabled && amount > 0 && durationDays > 0,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 2,
      })
    },
  }
}
