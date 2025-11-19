// Network configuration constants
export const STELLAR_NETWORK = import.meta.env.VITE_STELLAR_NETWORK || 'testnet';
export const SOROBAN_RPC_URL = import.meta.env.VITE_SOROBAN_RPC_URL || 'https://soroban-testnet.stellar.org:443';
export const NETWORK_PASSPHRASE = import.meta.env.VITE_NETWORK_PASSPHRASE || 'Test SDF Network ; September 2015';

/**
 * Contract IDs (will be populated after deployment)
 * @type {Readonly<{
 *   PROPERTY_TOKEN_DEPLOYER: string,
 *   MARKETPLACE: string,
 *   ESCROW: string,
 *   REGISTRY: string
 * }>}
 */
export const CONTRACT_IDS = {
  PROPERTY_TOKEN_DEPLOYER: import.meta.env.VITE_PROPERTY_TOKEN_DEPLOYER_ID || '',
  MARKETPLACE: import.meta.env.VITE_MARKETPLACE_CONTRACT_ID || '',
  ESCROW: import.meta.env.VITE_ESCROW_CONTRACT_ID || '',
  REGISTRY: import.meta.env.VITE_REGISTRY_CONTRACT_ID || '',
};

/**
 * Transaction settings
 * @type {Readonly<{
 *   BASE_FEE: string,
 *   TIMEOUT: number
 * }>}
 */
export const TX_SETTINGS = {
  BASE_FEE: '100',
  TIMEOUT: 180, // seconds
};

/**
 * Freighter wallet settings
 * @type {Readonly<{
 *   ENABLED: boolean,
 *   NETWORK: 'TESTNET' | 'PUBLIC'
 * }>}
 */
export const FREIGHTER_SETTINGS = {
  ENABLED: import.meta.env.VITE_FREIGHTER_ENABLED === 'true',
  NETWORK: /** @type {'TESTNET' | 'PUBLIC'} */ (STELLAR_NETWORK.toUpperCase()),
};
