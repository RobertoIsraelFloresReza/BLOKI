/**
 * Hooks Index
 * Central export point for all custom hooks
 */

export { useAuth } from './useAuth'
export { useProperties, useProperty, usePropertyTokenInfo, usePropertyHistory } from './useProperties'
export { useMarketplace } from './useMarketplace'
export { useWalletBalance, useWalletTransactions } from './useWallet'
export { usePropertyOwnership, useOwnerProperties, useSyncOwnership } from './useOwnership'
// export { useKYCStatus, useTransactionLimit, useStartKYC, useRetryKYC } from './useKYC'  // TODO: Create useKYC.js
