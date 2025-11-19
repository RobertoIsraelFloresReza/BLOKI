// Currency formatting
export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

// Number formatting
export function formatNumber(number) {
  return new Intl.NumberFormat('en-US').format(number);
}

// Compact number format (1.5K, 2.3M, etc)
export function formatCompactNumber(number) {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(number);
}

// Percentage formatting
export function formatPercentage(value, decimals = 2) {
  return `${value.toFixed(decimals)}%`;
}

// Truncate Stellar address
export function truncateAddress(address, chars = 4) {
  if (!address) return '';
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

// Format date
export function formatDate(date, options = {}) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  }).format(new Date(date));
}

// Calculate percentage change
export function calculatePercentageChange(oldValue, newValue) {
  if (oldValue === 0) return 0;
  return ((newValue - oldValue) / oldValue) * 100;
}
