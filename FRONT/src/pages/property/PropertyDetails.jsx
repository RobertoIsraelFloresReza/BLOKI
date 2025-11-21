import { useState, useEffect } from 'react'
import { ArrowLeft, MapPin, TrendingUp, Share2, Heart, CheckCircle, Users, Maximize, Wifi, ParkingCircle, Dumbbell, Waves, Shield, Zap, Check, X, ChevronUp, ChevronDown, User } from 'lucide-react'
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  LoaderButton,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui'
import { useStrings } from '@/utils/localizations/useStrings'

/**
 * PropertyDetails Page
 * Detailed view of a tokenized property
 * Features: Image gallery, property info, token purchase
 */
export function PropertyDetails({ property, onBack, user }) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [tokenAmount, setTokenAmount] = useState(1)
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showAuthRequired, setShowAuthRequired] = useState(false)
  const Strings = useStrings()

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">{Strings.noPropertiesFound}</h2>
          <p className="text-muted-foreground mb-6">{Strings.noPropertiesMessage}</p>
          <Button onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {Strings.marketplace}
          </Button>
        </div>
      </div>
    )
  }

  // Normalize property data (backend schema vs frontend schema)
  const title = property.name || property.title
  const location = property.address || property.location
  const price = property.valuation || property.price
  const category = property.metadata?.category || property.category || 'houses'
  const area = property.metadata?.area || property.area
  const bedrooms = property.metadata?.bedrooms || property.bedrooms
  const bathrooms = property.metadata?.bathrooms || property.bathrooms
  const description = property.description || ''
  const totalTokens = property.totalSupply || property.totalTokens || 0
  const tokensAvailable = property.availableTokens || property.tokensAvailable || totalTokens
  const verified = property.verified || false

  const pricePerToken = price && totalTokens ? Math.round(price / totalTokens) : 100
  const tokensSold = totalTokens - tokensAvailable
  const tokensSoldPercentage = totalTokens && totalTokens > 0
    ? ((tokensSold) / totalTokens) * 100
    : 0

  // Use real images from property or fallback to placeholder
  const propertyImages = property.images && property.images.length > 0
    ? property.images
    : [property.image || '/blocki_general.jpg']

  const images = propertyImages.length > 0
    ? propertyImages
    : [
        '/blocki_general.jpg',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
        'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&q=80',
      ]

  // Property features based on category
  const getPropertyFeatures = (category) => {
    const baseFeatures = [
      { icon: Shield, label: 'Verified Property' },
      { icon: Zap, label: 'Instant Tokenization' },
    ]

    const categoryFeatures = {
      houses: [
        { icon: Wifi, label: 'High-Speed Internet' },
        { icon: ParkingCircle, label: 'Private Parking' },
        { icon: Waves, label: 'Swimming Pool' },
      ],
      apartments: [
        { icon: Wifi, label: 'High-Speed WiFi' },
        { icon: Dumbbell, label: 'Gym Access' },
        { icon: Shield, label: '24/7 Security' },
      ],
      hotels: [
        { icon: Wifi, label: 'Premium WiFi' },
        { icon: Dumbbell, label: 'Fitness Center' },
        { icon: Waves, label: 'Spa & Pool' },
        { icon: ParkingCircle, label: 'Valet Parking' },
      ],
      commercial: [
        { icon: Wifi, label: 'Business Internet' },
        { icon: ParkingCircle, label: 'Parking Lot' },
        { icon: Shield, label: 'Security System' },
      ],
    }

    return [...baseFeatures, ...(categoryFeatures[category] || categoryFeatures.houses)]
  }

  const features = getPropertyFeatures(category)

  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [purchaseResult, setPurchaseResult] = useState(null)

  const handlePurchase = async () => {
    // Check if user is logged in
    if (!user) {
      setShowAuthRequired(true)
      return
    }

    setIsPurchasing(true)

    // Simulate Stellar transaction processing (faster simulation)
    setTimeout(() => {
      setIsPurchasing(false)

      // Calculate purchase details
      const transactionFee = 0.01 // Mock fee in USDC
      const ownershipPercentage = ((tokenAmount / totalTokens) * 100).toFixed(2)

      setPurchaseResult({
        tokens: tokenAmount,
        totalCost: tokenAmount * pricePerToken,
        transactionFee,
        grandTotal: (tokenAmount * pricePerToken) + transactionFee,
        ownershipPercentage,
        transactionId: `TX${Date.now().toString(36).toUpperCase()}`,
        timestamp: new Date().toISOString()
      })
      setShowSuccessModal(true)

      // Reset form after success
      setTimeout(() => {
        setTokenAmount(1)
      }, 3000)
    }, 800) // Faster response time
  }

  const totalCost = tokenAmount * pricePerToken

  return (
    <div className="min-h-screen pb-20">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          {Strings.marketplace}
        </Button>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column - Images & Info */}
          <div className="lg:col-span-2 space-y-6">

            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-video rounded-2xl overflow-hidden bg-muted relative group">
                <img
                  src={images[selectedImage]}
                  alt={title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Image Controls */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`p-3 rounded-xl backdrop-blur-xl transition-all ${
                      isFavorite
                        ? 'bg-destructive text-destructive-foreground'
                        : 'bg-card/80 text-foreground hover:bg-card'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-3 rounded-xl bg-card/80 backdrop-blur-xl text-foreground hover:bg-card transition-all">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-4 gap-4">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-video rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-primary scale-95'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Property Info */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-3xl">{title}</CardTitle>
                      {verified && (
                        <CheckCircle className="w-6 h-6 text-primary" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{location}</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    {category}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Price in USDC */}
                <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
                  <p className="text-sm text-muted-foreground mb-2">
                    {Strings.propertyValuation}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-bold">
                      ${price?.toLocaleString('en-US')}
                    </p>
                    <span className="text-lg font-medium text-muted-foreground">USDC</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Tokenized on Stellar Network
                  </p>
                </div>

                {/* Property Stats */}
                <div className="grid grid-cols-3 gap-4">
                  {area && (
                    <div className="text-center p-4 rounded-xl bg-muted/50">
                      <Maximize className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm font-semibold">
                        {area?.toLocaleString()} {Strings.sqft}
                      </p>
                      <p className="text-xs text-muted-foreground">{Strings.area}</p>
                    </div>
                  )}
                  <div className="text-center p-4 rounded-xl bg-muted/50">
                    <Users className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-semibold">
                      {Math.round((tokensSold / totalTokens) * 100)}%
                    </p>
                    <p className="text-xs text-muted-foreground">{Strings.fundedByInvestors}</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-muted/50">
                    <TrendingUp className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-semibold">
                      {tokensAvailable?.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">{Strings.available}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Token Distribution</span>
                    <span className="font-semibold">
                      {tokensSold?.toLocaleString()} / {totalTokens?.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                      style={{ width: `${tokensSoldPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Property Features */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Property Features</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {features.map((feature, index) => {
                      const Icon = feature.icon
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                        >
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Icon className="w-4 h-4 text-primary" />
                          </div>
                          <span className="text-sm font-medium">{feature.label}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">About this property</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    This premium property represents a unique investment opportunity in the
                    tokenized real estate market. Located in a prime area with high appreciation
                    potential. Each token represents a fractional ownership stake, allowing you to diversify
                    your real estate portfolio with lower capital requirements.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Purchase Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <CardTitle>Purchase Tokens</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Price per Token in USDC */}
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                    <p className="text-sm text-muted-foreground mb-1">
                      {Strings.pricePerToken}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold text-primary">
                        ${pricePerToken?.toLocaleString()}
                      </p>
                      <span className="text-sm font-medium text-muted-foreground">USDC</span>
                    </div>
                  </div>

                  {/* Amount Input */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Number of Tokens
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={tokenAmount}
                        onChange={(e) => setTokenAmount(Math.max(1, Math.min(tokensAvailable, parseInt(e.target.value) || 1)))}
                        className="w-full text-center h-12 rounded-lg border border-border bg-background px-3 pr-8 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        min="1"
                        max={tokensAvailable}
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-0.5">
                        <button
                          onClick={() => setTokenAmount(Math.min(tokensAvailable, tokenAmount + 1))}
                          disabled={tokenAmount >= tokensAvailable}
                          className="p-0.5 rounded hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <ChevronUp className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button
                          onClick={() => setTokenAmount(Math.max(1, tokenAmount - 1))}
                          disabled={tokenAmount <= 1}
                          className="p-0.5 rounded hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Max: {tokensAvailable?.toLocaleString()} tokens
                    </p>
                  </div>

                  {/* Total Cost in USDC */}
                  <div className="p-4 rounded-xl bg-gradient-to-br from-accent/20 to-primary/5 border border-border">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-muted-foreground">Total Cost</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold">
                          ${totalCost?.toLocaleString()}
                        </span>
                        <span className="text-sm font-medium text-muted-foreground">USDC</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {tokenAmount} {tokenAmount === 1 ? 'token' : 'tokens'} × ${pricePerToken?.toLocaleString()} USDC
                    </p>
                  </div>

                  {/* Purchase Button */}
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handlePurchase}
                    disabled={isPurchasing || tokensAvailable === 0}
                  >
                    {isPurchasing ? (
                      <>
                        <LoaderButton className="mr-2" />
                        Processing...
                      </>
                    ) : tokensAvailable === 0 ? (
                      Strings.soldOut
                    ) : (
                      'Purchase Tokens'
                    )}
                  </Button>

                  {/* Info */}
                  <p className="text-xs text-muted-foreground text-center">
                    {Strings.walletInfo}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

        </div>
      </div>

      {/* Success Modal - Improved with i18n and better details */}
      {showSuccessModal && purchaseResult && (
        <Dialog open={showSuccessModal} onClose={() => setShowSuccessModal(false)}>
          <DialogContent className="max-w-lg">
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute right-4 top-4 p-2 rounded-lg hover:bg-accent transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <DialogHeader>
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center animate-in zoom-in duration-300">
                  <CheckCircle className="w-12 h-12 text-green-500" />
                </div>
                <div className="text-center">
                  <DialogTitle className="text-2xl font-bold mb-2">
                    {Strings.purchaseSuccessful}
                  </DialogTitle>
                  <p className="text-sm text-muted-foreground">
                    {Strings.purchaseComplete}
                  </p>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Purchase Summary */}
              <div className="p-5 rounded-xl bg-gradient-to-br from-accent/30 to-primary/10 border border-border/50 space-y-3">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium text-muted-foreground">{Strings.tokensToPurchase}</span>
                  <span className="text-xl font-bold">{purchaseResult.tokens?.toLocaleString()}</span>
                </div>

                <div className="h-px bg-border/50" />

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{Strings.totalCost}</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-bold">${purchaseResult.totalCost?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    <span className="text-xs font-medium text-muted-foreground">USDC</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{Strings.transactionFee}</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-sm font-semibold">${purchaseResult.transactionFee?.toFixed(2)}</span>
                    <span className="text-xs text-muted-foreground">USDC</span>
                  </div>
                </div>

                <div className="h-px bg-border" />

                <div className="flex items-center justify-between py-1">
                  <span className="text-sm font-semibold">{Strings.grandTotal}</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-bold text-primary">${purchaseResult.grandTotal?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    <span className="text-sm font-medium text-muted-foreground">USDC</span>
                  </div>
                </div>
              </div>

              {/* Ownership Info */}
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{Strings.yourOwnership}</span>
                  <span className="text-2xl font-bold text-primary">{purchaseResult.ownershipPercentage}%</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {Strings.youWillOwn} {purchaseResult.ownershipPercentage}% {Strings.ofThisProperty}
                </p>
              </div>

              {/* Transaction Hash */}
              <div className="p-4 rounded-xl bg-muted/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{Strings.transactionHash}</span>
                  <Badge variant="outline" className="text-xs">Stellar</Badge>
                </div>
                <p className="text-xs font-mono text-foreground break-all bg-background/50 p-2 rounded border border-border">
                  {purchaseResult.transactionId}
                </p>
                <button className="text-xs text-primary hover:underline flex items-center gap-1">
                  {Strings.viewOnExplorer} →
                </button>
              </div>

              {/* Info Message */}
              <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                <p className="text-sm text-center text-muted-foreground">
                  Your tokens will appear in your wallet shortly. Transaction is being processed on the Stellar network.
                </p>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={() => setShowSuccessModal(false)}
              >
                {Strings.close}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Auth Required Modal */}
      {showAuthRequired && (
        <Dialog open={showAuthRequired} onClose={() => setShowAuthRequired(false)}>
          <DialogContent className="max-w-md">
            <button
              onClick={() => setShowAuthRequired(false)}
              className="absolute right-4 top-4 p-2 rounded-lg hover:bg-accent transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <DialogHeader>
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-10 h-10 text-primary" />
                </div>
                <DialogTitle className="text-2xl text-center">
                  Sign In Required
                </DialogTitle>
              </div>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <p className="text-center text-muted-foreground">
                Please sign in or create an account to purchase property tokens
              </p>
              <Button
                className="w-full"
                size="lg"
                onClick={() => {
                  setShowAuthRequired(false)
                  onBack()
                  // This will trigger the auth page since user is null
                }}
              >
                Go to Sign In
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowAuthRequired(false)}
              >
                Continue Browsing
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
