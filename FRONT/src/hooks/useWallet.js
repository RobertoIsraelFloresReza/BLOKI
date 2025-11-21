/**
 * useWallet Hook
 * Manages wallet and transaction data with TanStack Query
 */

import { useQuery } from '@tanstack/react-query'
import { walletService } from '@/services'

/**
 * Hook for fetching wallet balance
 */
export function useWalletBalance(address) {
  return useQuery({
    queryKey: ['wallet', 'balance', address],
    queryFn: () => walletService.getBalance(address),
    enabled: !!address,
    staleTime: 30 * 1000, // 30 seconds (blockchain data)
    refetchInterval: 60 * 1000, // Refetch every minute
  })
}

/**
 * Hook for fetching wallet transactions
 */
export function useWalletTransactions(filters = {}) {
  return useQuery({
    queryKey: ['wallet', 'transactions', filters],
    queryFn: () => walletService.getTransactions(filters),
    enabled: !!filters.address,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  })
}
