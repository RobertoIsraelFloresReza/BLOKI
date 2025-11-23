import { useState, useEffect } from 'react'
import { CreateListingModal } from '@/components/marketplace'
import { PurchaseReceipt } from '@/components/purchase'
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
import { useMarketplace } from '@/hooks'
import { authService } from '@/services'
import toast from 'react-hot-toast'

/**
 * PropertyDetails Page
 * Detailed view of a tokenized property
 * Features: Image gallery, property info, token purchase
 */
export function PropertyDetails({ property, onBack, user }) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [tokenAmount, setTokenAmount] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showCreateListingModal, setShowCreateListingModal] = useState(false)
  const [showAuthRequired, setShowAuthRequired] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false) // Local state for simulated purchase
  const [showConfetti, setShowConfetti] = useState(false) // Confetti effect
  const Strings = useStrings()

  // Marketplace hook for real backend integration (commented out for demo)
  // const { buyTokensAsync, isBuyingTokens } = useMarketplace()

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
  const isOwner = user && property && (property.ownerId === user.id || property.userId === user.id || property.owner?.id === user.id)
  const tokensSold = totalTokens - tokensAvailable
  const tokensSoldPercentage = totalTokens && totalTokens > 0
    ? ((tokensSold) / totalTokens) * 100
    : 0

  // Helper function to clean PostgreSQL array URLs (removes {" and "} escapes)
  const cleanImageUrl = (url) => {
    if (!url) return '/blocki_general.jpg'
    // Remove PostgreSQL array escapes: {" at start and "} at end
    return url.replace(/^\{?"?/, '').replace(/"?\}?$/, '').replace(/\\"/g, '"')
  }

  // Use real images from property or fallback to placeholder
  const propertyImages = property.images && property.images.length > 0
    ? property.images.map(cleanImageUrl)
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
      { icon: Shield, label: Strings.verifiedProperty },
      { icon: Zap, label: Strings.instantTokenization },
    ]

    const categoryFeatures = {
      houses: [
        { icon: Wifi, label: Strings.highSpeedInternet },
        { icon: ParkingCircle, label: Strings.privateParking },
        { icon: Waves, label: Strings.swimmingPool },
      ],
      apartments: [
        { icon: Wifi, label: Strings.highSpeedWiFi },
        { icon: Dumbbell, label: Strings.gymAccess },
        { icon: Shield, label: Strings.security24_7 },
      ],
      hotels: [
        { icon: Wifi, label: Strings.premiumWiFi },
        { icon: Dumbbell, label: Strings.fitnessCenter },
        { icon: Waves, label: Strings.spaAndPool },
        { icon: ParkingCircle, label: Strings.valetParking },
      ],
      commercial: [
        { icon: Wifi, label: Strings.businessInternet },
        { icon: ParkingCircle, label: Strings.parkingLot },
        { icon: Shield, label: Strings.securitySystem },
      ],
    }

    return [...baseFeatures, ...(categoryFeatures[category] || categoryFeatures.houses)]
  }

  const features = getPropertyFeatures(category)

  const [purchaseResult, setPurchaseResult] = useState(null)

  const handlePurchase = async () => {
    // Check if user is logged in
    if (!user) {
      setShowAuthRequired(true)
      return
    }

    console.log('💰 === PURCHASE TOKENS: START (SIMULATED) ===')
    console.log('Property:', property.name || property.title)
    console.log('Token amount:', tokenAmount)

    setIsProcessing(true) // Start loading state

    try {
      // === SIMULATED PURCHASE FLOW FOR DEMO ===

      // Step 1: Simulate fetching wallet secret key
      console.log('🔐 Step 1: Fetching wallet secret key... (SIMULATED)')
      await new Promise(resolve => setTimeout(resolve, 800))

      // Simulate secret key (commented out real service call)
      // const walletResponse = await authService.getWalletSecretKey()
      // const secretKey = walletResponse?.data?.stellarSecretKey || walletResponse?.stellarSecretKey
      const secretKey = 'SIMULATED_SECRET_KEY'

      console.log('✅ Secret key retrieved (simulated)')

      // Step 2: Prepare purchase
      const listingId = property.listingDatabaseId || property.id
      console.log('📋 Step 2: Preparing purchase...')
      console.log('Listing ID:', listingId)

      // Step 3: Simulate purchase execution
      console.log('🚀 Step 3: Executing purchase on Stellar... (SIMULATED)')
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Simulate successful response (commented out real service call)
      // const result = await buyTokensAsync({
      //   listingId: listingId,
      //   amount: tokenAmount,
      //   buyerSecretKey: secretKey,
      // })

      const simulatedResult = {
        transaction: {
          hash: `TX${Date.now().toString(36).toUpperCase()}_SIMULATED`
        },
        success: true
      }

      console.log('✅ Purchase successful! (simulated)', simulatedResult)

      // Show success toast
      toast.success(Strings.purchaseSuccessful || '¡Tokens comprados exitosamente!')

      // Step 4: Prepare purchase result and show receipt
      const ownershipPercentage = ((tokenAmount / totalTokens) * 100).toFixed(2)

      setPurchaseResult({
        tokens: tokenAmount,
        totalCost: tokenAmount * pricePerToken,
        transactionFee: 0.01, // Stellar network fee
        grandTotal: (tokenAmount * pricePerToken) + 0.01,
        ownershipPercentage,
        transactionId: simulatedResult.transaction?.hash,
        timestamp: new Date().toISOString()
      })

      // Trigger confetti effect
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 4000)

      // Reset form after success
      setTimeout(() => {
        setTokenAmount(1)
      }, 3000)

      console.log('🎉 Purchase flow completed! (simulated)')
      console.log('=== PURCHASE TOKENS: END ===')
    } catch (error) {
      console.error('❌ === PURCHASE FAILED ===')
      console.error('Error:', error)
      console.error('Message:', error.message)
      console.error('Response:', error.response?.data)
      console.error('=== PURCHASE FAILED: END ===')

      toast.error('Error al procesar la compra')
    } finally {
      setIsProcessing(false) // End loading state
    }
  }

  const totalCost = tokenAmount * pricePerToken

  return (
    <div className="min-h-screen pb-20">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(80)].map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-5%',
                animation: `confetti-fall ${2 + Math.random() * 3}s linear forwards`,
                animationDelay: `${Math.random() * 0.8}s`
              }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  background: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'][Math.floor(Math.random() * 7)],
                  transform: `rotate(${Math.random() * 360}deg)`
                }}
              />
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes confetti-fall {
          to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
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
                    <span className="text-muted-foreground">{Strings.tokenDistribution}</span>
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
                  <h3 className="text-lg font-semibold mb-4">{Strings.propertyFeatures}</h3>
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
                  <h3 className="text-lg font-semibold mb-3">{Strings.aboutThisProperty}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {description || Strings.propertyDefaultDescription}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Purchase Card / Receipt */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {purchaseResult ? (
                /* Show Receipt after purchase */
                <PurchaseReceipt
                  purchaseResult={purchaseResult}
                  property={property}
                  onViewWallet={() => window.location.href = '/wallet'}
                />
              ) : (
                /* Show Purchase Card */
                <Card className="border-2 border-primary/20">
                  <CardHeader>
                    <CardTitle>{Strings.purchaseTokens}</CardTitle>
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
                        {Strings.numberOfTokens}
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
                        {Strings.maxTokens}: {tokensAvailable?.toLocaleString()} {Strings.token}s
                      </p>
                    </div>

                    {/* Total Cost in USDC */}
                    <div className="p-4 rounded-xl bg-gradient-to-br from-accent/20 to-primary/5 border border-border">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-muted-foreground">{Strings.totalCost}</span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold">
                            ${totalCost?.toLocaleString()}
                          </span>
                          <span className="text-sm font-medium text-muted-foreground">USDC</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {tokenAmount} {tokenAmount === 1 ? Strings.token : `${Strings.token}s`} × ${pricePerToken?.toLocaleString()} USDC
                      </p>
                    </div>

                    {/* Create Listing Button */}
                    {isOwner && (
                      <Button className="w-full mb-4" size="lg" variant="secondary" onClick={() => setShowCreateListingModal(true)}>
                        <TrendingUp className="w-5 h-5 mr-2" />
                        {Strings.createListing || 'Create Listing'}
                      </Button>
                    )}

                    {/* Purchase Button */}
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handlePurchase}
                      disabled={isProcessing || tokensAvailable === 0}
                    >
                      {isProcessing ? (
                        <>
                          <LoaderButton className="mr-2" />
                          {Strings.processingOnStellar}
                        </>
                      ) : tokensAvailable === 0 ? (
                        Strings.soldOut
                      ) : (
                        Strings.purchaseTokens
                      )}
                    </Button>

                    {/* Info */}
                    <p className="text-xs text-muted-foreground text-center">
                      {Strings.walletInfo}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

        </div>
      </div>

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
                  {Strings.signInRequired}
                </DialogTitle>
              </div>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <p className="text-center text-muted-foreground">
                {Strings.pleaseSignInToPurchase}
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
                {Strings.goToSignIn}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowAuthRequired(false)}
              >
                {Strings.continueBrowsing}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
      {/* Create Listing Modal */}
      {showCreateListingModal && (
        <CreateListingModal isOpen={showCreateListingModal} onClose={() => setShowCreateListingModal(false)} property={property} user={user} />
      )}

    </div>
  )
}
