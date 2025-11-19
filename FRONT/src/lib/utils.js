import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility function to merge Tailwind classes with clsx
 * @param {...any} inputs - Classes to merge
 * @returns {string} - Merged classes
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Format price to USD
 * @param {number} amount - Amount to format
 * @returns {string} - Formatted price
 */
export function formatPrice(amount) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format number with thousands separator
 * @param {number} num - Number to format
 * @returns {string} - Formatted number
 */
export function formatNumber(num) {
  return new Intl.NumberFormat('es-AR').format(num)
}

/**
 * Truncate Stellar address
 * @param {string} address - Stellar public key
 * @param {number} startChars - Characters to show at start
 * @param {number} endChars - Characters to show at end
 * @returns {string} - Truncated address
 */
export function truncateAddress(address, startChars = 4, endChars = 4) {
  if (!address) return ''
  if (address.length <= startChars + endChars) return address

  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`
}

/**
 * Format date to readable string
 * @param {Date|string} date - Date to format
 * @returns {string} - Formatted date
 */
export function formatDate(date) {
  return new Intl.DateTimeFormat('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

/**
 * Format date to relative time (e.g., "hace 2 horas")
 * @param {Date|string} date - Date to format
 * @returns {string} - Relative time
 */
export function formatRelativeTime(date) {
  const now = new Date()
  const then = new Date(date)
  const diffInSeconds = Math.floor((now - then) / 1000)

  const intervals = {
    año: 31536000,
    mes: 2592000,
    semana: 604800,
    día: 86400,
    hora: 3600,
    minuto: 60,
    segundo: 1,
  }

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const count = Math.floor(diffInSeconds / secondsInUnit)
    if (count >= 1) {
      return `hace ${count} ${unit}${count > 1 ? 's' : ''}`
    }
  }

  return 'justo ahora'
}

/**
 * Calculate percentage
 * @param {number} value - Current value
 * @param {number} total - Total value
 * @returns {number} - Percentage
 */
export function calculatePercentage(value, total) {
  if (total === 0) return 0
  return Math.round((value / total) * 100)
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Is valid email
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate Stellar address format
 * @param {string} address - Stellar address
 * @returns {boolean} - Is valid Stellar address
 */
export function isValidStellarAddress(address) {
  return /^G[A-Z0-9]{55}$/.test(address)
}

/**
 * Sleep utility for delays
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} - Promise that resolves after delay
 */
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} - Success status
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return false
  }
}

/**
 * Generate random ID
 * @returns {string} - Random ID
 */
export function generateId() {
  return Math.random().toString(36).substring(2, 15)
}

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} - Debounced function
 */
export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}
