import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui'
import { useStrings } from '@/utils/localizations/useStrings'

/**
 * PropertyCardProfile Component
 * Compact property card for user profile
 * Shows 2 most recent properties with fade effect if there are more
 */
export function PropertyCardProfile({ properties = [], onViewDetails, onViewAll }) {
  const Strings = useStrings()

  if (!properties || properties.length === 0) {
    return null
  }

  // Sort by most recent and take only top 2 + partial third
  const sortedProperties = [...properties].sort((a, b) =>
    new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
  )
  const displayedProperties = sortedProperties.slice(0, 2)
  const thirdProperty = sortedProperties[2]
  const hasMore = properties.length > 2

  return (
    <div className="space-y-3">
      {/* Properties List */}
      <div className="relative">
        <div className="space-y-3">
          {/* First 2 properties */}
          {displayedProperties.map((property) => (
          <button
            key={property.id}
            onClick={() => onViewDetails && onViewDetails(property)}
            className="w-full group"
          >
            <div className="flex items-center justify-between gap-4 py-5 px-6 rounded-xl border border-transparent hover:border-primary/50 hover:bg-card hover:shadow-md transition-all duration-200">
              {/* Property Info */}
              <div className="flex-1 min-w-0 text-left">
                <h3 className="text-base font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                  {property.title}
                </h3>
              </div>

              {/* Arrow Icon */}
              <div className="flex-shrink-0 ml-4">
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </button>
        ))}

        {/* Third property - partially visible with fade */}
        {thirdProperty && (
          <div className="relative">
            {/* Gradient overlay for fade effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background z-10 pointer-events-none" />

            {/* Partial third property */}
            <button
              onClick={() => onViewAll && onViewAll()}
              className="w-full group opacity-60"
            >
              <div className="flex items-center justify-between gap-4 py-5 px-6 rounded-xl border border-transparent">
                {/* Property Info */}
                <div className="flex-1 min-w-0 text-left">
                  <h3 className="text-base font-semibold text-foreground line-clamp-1">
                    {thirdProperty.title}
                  </h3>
                </div>

                <div className="flex-shrink-0 ml-4">
                  <ArrowRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>
            </button>
          </div>
        )}
        </div>
      </div>

      {/* View All Button */}
      {onViewAll && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onViewAll}
          className="w-full text-primary hover:text-primary/80 gap-1"
        >
          {Strings.viewAllProperties}
          <ArrowRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  )
}
