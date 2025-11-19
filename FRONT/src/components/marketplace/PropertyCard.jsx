import { useState, useRef } from 'react'
import { MapPin, TrendingUp, Users, Home, BedDouble, Bath, Maximize, CheckCircle, Building2, Hotel, Warehouse } from 'lucide-react'
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

/**
 * PropertyCard Component
 * Displays property information for the marketplace
 * Optimized for real estate tokenization
 * Features 3D tilt effect on hover for inspection feel
 */
export function PropertyCard({ property }) {
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 })
  const cardRef = useRef(null)
  const {
    id,
    title,
    location,
    image,
    price,
    bedrooms,
    bathrooms,
    area,
    tokensAvailable,
    totalTokens,
    roi,
    verified,
    category,
  } = property

  const availableTokens = tokensAvailable || 0
  const pricePerToken = price && totalTokens ? Math.round(price / totalTokens) : 100
  const type = category || 'house'
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
        className="property-card overflow-hidden group"
        style={{
          transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
          transition: 'transform 0.2s ease-out',
          transformStyle: 'preserve-3d',
        }}
      >
      {/* Property Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <img
          src={image || '/blocki_general.jpg'}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Status Badge */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Badge variant={getStatusColor(status)} className="shadow-lg backdrop-blur-sm">
            {status === 'available' && (
              <>
                <TrendingUp className="w-3 h-3 mr-1" />
                Available
              </>
            )}
            {status === 'sold-out' && 'Sold Out'}
            {status === 'coming-soon' && 'Coming Soon'}
          </Badge>
        </div>

        {/* Type Badge */}
        <div className="absolute top-4 left-4">
          <Badge variant="default" className="shadow-lg backdrop-blur-sm gap-1">
            {getTypeIcon(type)}
            {type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Property'}
          </Badge>
        </div>

        {/* Progress Bar */}
        {status === 'available' && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
            <div
              className="h-full bg-secondary transition-all duration-500"
              style={{ width: `${tokensSoldPercentage}%` }}
            />
          </div>
        )}
      </div>

      <CardHeader>
        <CardTitle className="line-clamp-1 flex items-center gap-2">
          {title}
          {verified && (
            <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
          )}
        </CardTitle>
        <CardDescription className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {location}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Valuation and ROI */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Property Valuation</p>
            <p className="text-2xl font-bold text-foreground">
              ${price?.toLocaleString('en-US') || '0'}
            </p>
          </div>
          {roi && (
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Est. ROI</p>
              <p className="text-lg font-bold text-secondary">
                {roi}%
              </p>
            </div>
          )}
        </div>

        {/* Property Details */}
        {(bedrooms || bathrooms || area) && (
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            {bedrooms > 0 && (
              <div className="flex items-center gap-1">
                <BedDouble className="w-4 h-4" />
                <span>{bedrooms}</span>
              </div>
            )}
            {bathrooms > 0 && (
              <div className="flex items-center gap-1">
                <Bath className="w-4 h-4" />
                <span>{bathrooms}</span>
              </div>
            )}
            {area && (
              <div className="flex items-center gap-1">
                <Maximize className="w-4 h-4" />
                <span>{area?.toLocaleString() || area} sqft</span>
              </div>
            )}
          </div>
        )}

        {/* Token Info */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Total Tokens</p>
            <p className="text-sm font-semibold">{totalTokens?.toLocaleString() || '0'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Available</p>
            <p className="text-sm font-semibold text-secondary">
              {availableTokens?.toLocaleString() || '0'}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Price/Token</p>
            <p className="text-sm font-semibold">${pricePerToken || '0'}</p>
          </div>
        </div>

        {/* Investors Count (if any tokens sold) */}
        {tokensSoldPercentage > 0 && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-accent/30">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {Math.round(tokensSoldPercentage)}% funded by investors
            </span>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          size="lg"
          disabled={status !== 'available'}
        >
          {status === 'available' && 'View Details'}
          {status === 'sold-out' && 'Sold Out'}
          {status === 'coming-soon' && 'Coming Soon'}
        </Button>
      </CardFooter>
    </Card>
    </div>
  )
}
