import { Languages } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

/**
 * LanguageSwitcher Component
 * Toggle between English and Spanish
 */
export function LanguageSwitcher({ className }) {
  const { i18n } = useTranslation()

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'es' : 'en'
    i18n.changeLanguage(newLang)
  }

  const currentLang = i18n.language === 'en' ? 'EN' : 'ES'

  return (
    <button
      onClick={toggleLanguage}
      className={cn(
        'inline-flex items-center justify-center gap-2',
        'h-10 px-3 rounded-lg',
        'bg-accent hover:bg-accent/80',
        'text-sm font-medium text-foreground',
        'transition-all duration-200',
        'border border-border',
        className
      )}
      aria-label="Toggle language"
    >
      <Languages className="w-4 h-4" />
      <span className="text-xs font-bold">{currentLang}</span>
    </button>
  )
}
