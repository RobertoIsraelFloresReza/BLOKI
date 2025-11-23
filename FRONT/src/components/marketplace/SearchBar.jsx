import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui'

/**
 * SearchBar Component
 * Modern search bar with clear button
 * Follows Nielsen's heuristics: visibility, control, feedback
 */
import { useStrings } from '@/utils/localizations/useStrings'

export function SearchBar({
  placeholder,
  value = '',
  onChange,
  className = ""
}) {
  const Strings = useStrings()
  const defaultPlaceholder = placeholder || Strings.searchPropertiesPlaceholder
  const handleClear = () => {
    onChange('')
  }

  return (
    <div className={`relative w-full ${className}`}>
      {/* Search Icon */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <Search className="w-5 h-5 text-muted-foreground" />
      </div>

      {/* Input */}
      <input
        type="text"
        placeholder={defaultPlaceholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-12 pl-12 pr-12 rounded-xl bg-card border border-border
                   text-foreground placeholder:text-muted-foreground
                   focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                   transition-all duration-200
                   hover:border-primary/50"
      />

      {/* Clear Button */}
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-4 top-1/2 -translate-y-1/2
                     text-muted-foreground hover:text-foreground
                     transition-colors duration-200
                     focus:outline-none focus:ring-2 focus:ring-primary rounded-full p-1"
          aria-label={Strings.clearSearch}
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
