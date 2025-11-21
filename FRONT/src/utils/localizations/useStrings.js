import { useTranslation } from 'react-i18next'
import Strings from './Strings'

/**
 * Hook to make Strings reactive to language changes
 * This hook forces re-render when language changes
 */
export function useStrings() {
  // This hook subscribes to i18n changes and re-renders the component
  useTranslation()

  // Return Strings which will now be reactive
  return Strings
}
