import { MapPin, DollarSign, Users, TrendingUp, MoreVertical, Edit, Trash2, Eye, Pause, Play } from 'lucide-react'
import { Card, CardContent, Badge } from '@/components/ui'
import { useStrings } from '@/utils/localizations/useStrings'
import { useState, useRef } from 'react'

/**
 * SellerPropertyCard Component
 * Card displaying seller's property with management options
 * Features: Status badge, performance metrics, action menu, 3D hover effect
 */
export function SellerPropertyCard({ property, statusConfig }) {
  const Strings = useStrings()
  const [showMenu, setShowMenu] = useState(false)
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 })
  const cardRef = useRef(null)

  const {
    title,
    location,
    price,
    image,
    tokensAvailable,
    totalTokens,
    tokensSold,
    status,
    revenue,
    investors,
  } = property

  const tokensSoldPercentage = totalTokens > 0 ? ((tokensSold / totalTokens) * 100) : 0
  const statusInfo = statusConfig[status] || statusConfig.pending
  const StatusIcon = statusInfo.icon

  // Handle mouse move for 3D tilt effect (same as Marketplace)
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
        className="group overflow-hidden hover:shadow-lg transition-all duration-300 border border-border hover:border-primary/50"
        style={{
          transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
          transition: 'transform 0.2s ease-out',
          transformStyle: 'preserve-3d',
        }}
      >
      <div className="relative">
        {/* Property Image */}
        <div className="aspect-video overflow-hidden bg-muted">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant={statusInfo.variant} className="gap-1.5">
            <StatusIcon className={`w-3 h-3 ${statusInfo.color}`} />
            {statusInfo.label}
          </Badge>
        </div>

        {/* Actions Menu */}
        <div className="absolute top-3 right-3">
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-lg bg-card/90 backdrop-blur-sm border border-border hover:bg-card transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                  <button className="w-full px-4 py-2.5 text-left text-sm hover:bg-accent transition-colors flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    {Strings.viewProperty || 'View Property'}
                  </button>
                  <button className="w-full px-4 py-2.5 text-left text-sm hover:bg-accent transition-colors flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    {Strings.editProperty || 'Edit Property'}
                  </button>
                  {status === 'active' ? (
                    <button className="w-full px-4 py-2.5 text-left text-sm hover:bg-accent transition-colors flex items-center gap-2">
                      <Pause className="w-4 h-4" />
                      {Strings.pauseListing || 'Pause Listing'}
                    </button>
                  ) : (
                    <button className="w-full px-4 py-2.5 text-left text-sm hover:bg-accent transition-colors flex items-center gap-2">
                      <Play className="w-4 h-4" />
                      {Strings.activateListing || 'Activate Listing'}
                    </button>
                  )}
                  <div className="h-px bg-border" />
                  <button className="w-full px-4 py-2.5 text-left text-sm hover:bg-destructive/10 text-destructive transition-colors flex items-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    {Strings.deleteProperty || 'Delete Property'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <CardContent className="p-5 space-y-4">
        {/* Property Info */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1 line-clamp-1">
            {title}
          </h3>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="w-3.5 h-3.5" />
            <span className="line-clamp-1">{location}</span>
          </div>
        </div>

        {/* Funding Progress */}
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">{Strings.funded || 'Funded'}</span>
            <span className="font-semibold">
              {tokensSold?.toLocaleString()} / {totalTokens?.toLocaleString()}
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
              style={{ width: `${tokensSoldPercentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-muted-foreground">
              {tokensSoldPercentage.toFixed(1)}% {Strings.complete || 'complete'}
            </span>
            <span className="text-xs text-muted-foreground">
              {tokensAvailable?.toLocaleString()} {Strings.available || 'available'}
            </span>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border">
          {/* Revenue */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <DollarSign className="w-3.5 h-3.5 text-green-500" />
            </div>
            <p className="text-sm font-bold text-foreground">
              ${(revenue / 1000000).toFixed(2)}M
            </p>
            <p className="text-xs text-muted-foreground">{Strings.revenue || 'Revenue'}</p>
          </div>

          {/* Investors */}
          <div className="text-center border-x border-border">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users className="w-3.5 h-3.5 text-blue-500" />
            </div>
            <p className="text-sm font-bold text-foreground">{investors}</p>
            <p className="text-xs text-muted-foreground">{Strings.investors || 'Investors'}</p>
          </div>

          {/* Value */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-purple-500" />
            </div>
            <p className="text-sm font-bold text-foreground">
              ${(price / 1000000).toFixed(1)}M
            </p>
            <p className="text-xs text-muted-foreground">{Strings.value || 'Value'}</p>
          </div>
        </div>
      </CardContent>
      </Card>
    </div>
  )
}
