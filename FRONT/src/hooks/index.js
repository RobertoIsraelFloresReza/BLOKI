/**
 * Hooks Index
 * Central export point for all custom hooks
 */

export { useAuth } from './useAuth'
export {
  useProperties,
  useProperty,
  usePropertyTokenInfo,
  usePropertyHistory,
  useMyOwnedProperties,
  useMyInvestments
} from './useProperties'
export { useMarketplace } from './useMarketplace'
export { useWalletBalance, useWalletTransactions } from './useWallet'
export { usePropertyOwnership, useOwnerProperties, useSyncOwnership } from './useOwnership'
export { useEvaluators, useEvaluator, useEvaluatorMutations } from './useEvaluators'
// export { useKYCStatus, useTransactionLimit, useStartKYC, useRetryKYC } from './useKYC'  // TODO: Create useKYC.js

// DeFi Hooks - NEW
export { useSoroswap } from './useSoroswap'
export { useOracle } from './useOracle'
export { useDeFindex } from './useDeFindex'
export { useZK } from './useZK'
