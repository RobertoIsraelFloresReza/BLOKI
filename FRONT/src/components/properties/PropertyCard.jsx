import { useState, useRef } from 'react'
import { MapPin, TrendingUp, Users, Home, BedDouble, Bath, Maximize, CheckCircle, Building2, Hotel, Warehouse, MoreVertical, Edit, Trash2, Eye, Award, Plus, Minus, ShoppingCart } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Badge,
} from '@/components/ui'
import { useStrings } from '@/utils/localizations/useStrings'

/**
 * PropertyCard Component
 * Displays property information for marketplace and seller dashboard
 * Optimized for real estate tokenization
 * Features 3D tilt effect on hover for inspection feel
 *
 * @param {Object} property - Property data
 * @param {Function} onViewDetails - Callback when view details is clicked
 * @param {Function} onEdit - Optional callback for edit action (seller mode)
 * @param {Function} onDelete - Optional callback for delete action (seller mode)
 * @param {Function} onCreateListing - Optional callback for create listing action (seller mode)
 * @param {boolean} showActions - Show edit/delete actions menu (seller mode)
 */
export function PropertyCard({ property, onViewDetails, onEdit, onDelete, onCreateListing, showActions = false }) {
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 })
  const [showMenu, setShowMenu] = useState(false)
  const [expandedTitle, setExpandedTitle] = useState(false)
  const [expandedLocation, setExpandedLocation] = useState(false)
  const cardRef = useRef(null)
  const Strings = useStrings()

  // Helper function to clean PostgreSQL array URLs (removes {" and "} escapes)
  const cleanImageUrl = (url) => {
    if (!url) return '/blocki_general.jpg'
    // Remove PostgreSQL array escapes: {" at start and "} at end
    return url.replace(/^\{?"?/, '').replace(/"?\}?$/, '').replace(/\\"/g, '"')
  }

  // Normalize backend data (support both old and new schema)
  const id = property.id
  const title = property.name || property.title
  const location = property.address || property.location
  const rawImage = property.images?.[0] || property.image
  const image = cleanImageUrl(rawImage)

  // Convert strings to numbers (backend sends them as strings with 7 decimals)
  const price = parseFloat(property.valuation || property.price || 0)
  const totalTokens = parseFloat(property.totalSupply || property.totalTokens || 0)
  const tokensAvailable = parseFloat(property.availableTokens || property.tokensAvailable || totalTokens)

  const bedrooms = property.metadata?.bedrooms || property.bedrooms
  const bathrooms = property.metadata?.bathrooms || property.bathrooms
  const area = parseFloat(property.metadata?.area || property.area || 0)
  const roi = parseFloat(property.roi || 0)
  const verified = property.verified !== undefined ? property.verified : true
  const category = property.metadata?.category || property.category || 'houses'
  const evaluator = property.evaluator || null
  const verificationId = property.verificationId || null

  const availableTokens = tokensAvailable || 0
  const pricePerToken = price && totalTokens ? Math.round(price / totalTokens) : 100
  const type = category
  const status = tokensAvailable === 0 ? 'sold-out' : 'available'

  // Safe calculation with fallback
  const tokensSoldPercentage = totalTokens && totalTokens > 0
    ? ((totalTokens - availableTokens) / totalTokens) * 100
    : 0

  // Handle mouse move for 3D tilt effect
  const handleMouseMove = (e) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    // Calculate distance from center (-1 to 1)
    const deltaX = (e.clientX - centerX) / (rect.width / 2)
    const deltaY = (e.clientY - centerY) / (rect.height / 2)

    // Apply tilt (max 10 degrees for cards)
    const maxTilt = 10
    const rotateY = deltaX * maxTilt
    const rotateX = -deltaY * maxTilt

    setTilt({ rotateX, rotateY })
  }

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'secondary'
      case 'sold-out':
        return 'destructive'
      case 'coming-soon':
        return 'default'
      default:
        return 'default'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'houses':
        return <Home className="w-4 h-4" />
      case 'apartments':
        return <Building2 className="w-4 h-4" />
      case 'hotels':
        return <Hotel className="w-4 h-4" />
      case 'commercial':
        return <Warehouse className="w-4 h-4" />
      default:
        return <Home className="w-4 h-4" />
    }
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '1000px',
      }}
    >
      <Card
        className="property-card overflow-hidden group cursor-pointer"
        style={{
          transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
          transition: 'transform 0.2s ease-out',
          transformStyle: 'preserve-3d',
        }}
        onClick={() => onViewDetails && onViewDetails(property)}
      >
      {/* Property Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <img
          src={image || '/blocki_general.jpg'}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Evaluator Badge - Solo este en la esquina izquierda */}
        {evaluator && (
          <div className="absolute top-4 left-4">
            <Badge variant="secondary" className="shadow-lg backdrop-blur-sm gap-1 bg-green-500/90 text-white">
              <Award className="w-3 h-3" />
              {evaluator.name}
            </Badge>
          </div>
        )}

        {/* Actions Menu (Seller Mode) */}
        {showActions && (
          <div className="absolute top-4 right-4">
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 rounded-lg bg-card/90 backdrop-blur-sm border border-border hover:bg-card transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                    <button
                      onClick={() => {
                        setShowMenu(false)
                        onViewDetails?.(property)
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm hover:bg-accent transition-colors flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      {Strings.viewProperty}
                    </button>
                    <button
                      onClick={() => {
                        setShowMenu(false)
                        onEdit?.(property)
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm hover:bg-accent transition-colors flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      {Strings.editProperty}
                    </button>
                    {onCreateListing && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setShowMenu(false)
                          onCreateListing?.(property)
                        }}
                        className="w-full px-4 py-2.5 text-left text-sm hover:bg-accent transition-colors flex items-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        {Strings.createListing || 'Create Listing'}
                      </button>
                    )}
                    <div className="h-px bg-border" />
                    <button
                      onClick={() => {
                        setShowMenu(false)
                        onDelete?.(property)
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm hover:bg-destructive/10 text-destructive transition-colors flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      {Strings.deleteProperty}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {status === 'available' && tokensSoldPercentage > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
            <div
              className="h-full bg-secondary transition-all duration-500"
              style={{ width: `${tokensSoldPercentage}%` }}
            />
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 leading-relaxed">
          <span className={expandedTitle ? '' : 'truncate'}>
            {title}
          </span>
          {title && title.length > 30 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setExpandedTitle(!expandedTitle)
              }}
              className="flex-shrink-0 p-1 hover:bg-accent rounded transition-colors"
              aria-label={expandedTitle ? Strings.collapseTitle : Strings.expandTitle}
            >
              {expandedTitle ? (
                <Minus className="w-3 h-3 text-muted-foreground" />
              ) : (
                <Plus className="w-3 h-3 text-muted-foreground" />
              )}
            </button>
          )}
        </CardTitle>
        <CardDescription className="flex items-center gap-1 leading-relaxed pb-1">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className={expandedLocation ? '' : 'truncate'}>
            {location}
          </span>
          {location && location.length > 30 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setExpandedLocation(!expandedLocation)
              }}
              className="flex-shrink-0 p-1 hover:bg-accent rounded transition-colors"
              aria-label={expandedLocation ? Strings.collapseLocation : Strings.expandLocation}
            >
              {expandedLocation ? (
                <Minus className="w-3 h-3 text-muted-foreground" />
              ) : (
                <Plus className="w-3 h-3 text-muted-foreground" />
              )}
            </button>
          )}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 pb-4">
        {/* Valuation in USDC */}
        <div>
          <p className="text-xs text-muted-foreground mb-1 leading-relaxed">{Strings.propertyValuation}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-foreground leading-tight">
              ${price?.toLocaleString('en-US') || '0'}
            </p>
            <span className="text-sm font-medium text-muted-foreground leading-tight">USDC</span>
          </div>
        </div>

        {/* Property Details */}
        {area && (
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1 leading-relaxed">
              <Maximize className="w-4 h-4" />
              <span>{area?.toLocaleString() || area} {Strings.sqft}</span>
            </div>
          </div>
        )}

        {/* Token Info */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-muted-foreground leading-relaxed pb-1">{Strings.totalTokens}</p>
            <p className="text-sm font-semibold leading-tight">{totalTokens?.toLocaleString() || '0'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground leading-relaxed pb-1">{Strings.available}</p>
            <p className="text-sm font-semibold text-secondary leading-tight">
              {availableTokens?.toLocaleString() || '0'}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground leading-relaxed pb-1">{Strings.pricePerToken}</p>
            <div className="flex items-baseline gap-1">
              <p className="text-sm font-semibold leading-tight">${pricePerToken || '0'}</p>
              <span className="text-[10px] text-muted-foreground leading-tight">USDC</span>
            </div>
          </div>
        </div>

        {/* Investors Count (if any tokens sold) */}
        {tokensSoldPercentage > 0 && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-accent/30">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground leading-relaxed">
              {Math.round(tokensSoldPercentage)}% {Strings.funded}
            </span>
          </div>
        )}

      </CardContent>

      {/* Property Type Badge - Shown on card hover (desktop) / Always visible (mobile) */}
      <div className="relative opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
        {/* Gradient separator */}
        <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-t from-blue-400/50 dark:from-border/30 to-transparent pointer-events-none" />

        <div className="px-6 py-3 flex items-center justify-end relative">
          <div className="flex items-center gap-1">
            <div className="w-6 h-6 flex items-center justify-center text-muted-foreground">
              {getTypeIcon(type)}
            </div>
            <span className="text-base font-semibold text-foreground">
              {type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Property'}
            </span>
          </div>
        </div>
      </div>
    </Card>
    </div>
  )
}
