/**
 * useSoroswap Hook
 * Manages Soroswap DEX interactions for property tokens
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { soroswapService } from '@/services'
import toast from 'react-hot-toast'

export function useSoroswap() {
  const queryClient = useQueryClient()

  return {
    /**
     * Get swap quote hook
     * @param {string} propertyToken
     * @param {string} usdcToken
     * @param {number} amountIn
     * @param {boolean} enabled
     */
    useSwapQuote: (propertyToken, usdcToken, amountIn, enabled = true) => {
      return useQuery({
        queryKey: ['swap-quote', propertyToken, usdcToken, amountIn],
        queryFn: () => soroswapService.getSwapQuote(propertyToken, usdcToken, amountIn),
        enabled: enabled && !!propertyToken && !!usdcToken && parseFloat(amountIn) > 0,
        staleTime: 30 * 1000, // 30 seconds
        retry: 2,
      })
    },

    /**
     * Execute swap mutation
     */
    useExecuteSwap: () => {
      return useMutation({
        mutationFn: ({ seller, propertyToken, usdcToken, amountIn, minUsdcOut }) =>
          soroswapService.executeSwap(seller, propertyToken, usdcToken, amountIn, minUsdcOut),
        onSuccess: (data) => {
          console.log('✅ Swap successful:', data)
          toast.success(`Swap successful! Received ${data.amountOut} USDC`)
          queryClient.invalidateQueries({ queryKey: ['swap-quote'] })
        },
        onError: (error) => {
          console.error('❌ Swap failed:', error)
          toast.error(error.response?.data?.message || 'Swap failed')
        },
      })
    },
  }
}
