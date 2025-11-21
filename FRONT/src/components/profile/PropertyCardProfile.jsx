import { ArrowRight, Home, MapPin, DollarSign } from 'lucide-react'
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
            <div className="flex items-center gap-3 p-3 rounded-xl border border-transparent hover:border-primary/50 hover:bg-card hover:shadow-md transition-all duration-200">
              {/* Property Image */}
              <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>

              {/* Property Info */}
              <div className="flex-1 min-w-0 text-left">
                <h3 className="text-sm font-semibold text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                  {property.title}
                </h3>

                {/* Location */}
                <div className="flex items-center gap-1 mb-2">
                  <MapPin className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {property.location}
                  </p>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-green-500" />
                    <span className="text-xs font-medium text-foreground">
                      ${(property.price / 1000000).toFixed(1)}M
                    </span>
                  </div>

                  {property.tokensSold !== undefined && property.totalTokens && (
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span className="text-xs text-muted-foreground">
                        {Math.round((property.tokensSold / property.totalTokens) * 100)}% vendido
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Arrow Icon */}
              <div className="flex-shrink-0">
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
              <div className="flex items-center gap-3 p-3 rounded-xl border border-transparent">
                {/* Property Image */}
                <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <img
                    src={thirdProperty.image}
                    alt={thirdProperty.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>

                {/* Property Info */}
                <div className="flex-1 min-w-0 text-left">
                  <h3 className="text-sm font-semibold text-foreground mb-1 line-clamp-1">
                    {thirdProperty.title}
                  </h3>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {thirdProperty.location}
                    </p>
                  </div>
                </div>

                <div className="flex-shrink-0">
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
          Ver todas las propiedades
          <ArrowRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  )
}
