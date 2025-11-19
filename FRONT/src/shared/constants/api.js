// Backend API
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
export const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:3000/graphql';

/**
 * Feature flags
 * @type {Readonly<{
 *   KYC_ENABLED: boolean,
 *   FIAT_CONVERSION_ENABLED: boolean
 * }>}
 */
export const FEATURES = {
  KYC_ENABLED: import.meta.env.VITE_ENABLE_KYC === 'true',
  FIAT_CONVERSION_ENABLED: import.meta.env.VITE_ENABLE_FIAT_CONVERSION === 'true',
};
