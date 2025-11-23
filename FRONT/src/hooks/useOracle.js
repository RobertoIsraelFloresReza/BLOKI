/**
 * useOracle Hook
 * Manages Oracle price feeds and property valuations
 */

import { useQuery } from '@tanstack/react-query'
import { oracleService } from '@/services'

export function useOracle() {
  return {
    /**
     * Get asset price hook
     * @param {string} asset - "XLM" | "USDC" | "BTC"
     */
    usePrice: (asset) => {
      return useQuery({
        queryKey: ['oracle-price', asset],
        queryFn: () => oracleService.getPrice(asset),
        enabled: !!asset,
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchInterval: 5 * 60 * 1000, // Refresh every 5 min
        retry: 3,
      })
    },

    /**
     * Get property valuation hook
     * @param {string} propertyId
     * @param {number} sqft
     * @param {number} locationMultiplier
     */
    useValuation: (propertyId, sqft, locationMultiplier = 100) => {
      return useQuery({
        queryKey: ['property-valuation', propertyId, sqft, locationMultiplier],
        queryFn: () => oracleService.getPropertyValuation(propertyId, sqft, locationMultiplier),
        enabled: !!propertyId && !!sqft,
        staleTime: 10 * 60 * 1000, // 10 minutes
        retry: 2,
      })
    },
  }
}
