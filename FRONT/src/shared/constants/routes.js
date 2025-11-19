// Application routes
export const ROUTES = {
  // Public routes
  LOGIN: '/login',
  REGISTER: '/register',

  // Protected routes
  HOME: '/home',
  DASHBOARD: '/dashboard',
  WALLET: '/wallet',
  PROFILE: '/profile',

  // Marketplace
  MARKETPLACE: '/marketplace',
  PROPERTY_DETAIL: '/property/:id',
  PUBLISH_PROPERTY: '/publish',

  // KYC
  KYC: '/kyc',

  // Root
  ROOT: '/',
};

/**
 * Helper to generate property detail route
 * @param {string} id - Property ID
 * @returns {string}
 */
export const getPropertyDetailRoute = (id) => `/property/${id}`;
