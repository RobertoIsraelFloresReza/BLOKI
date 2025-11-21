import { useState, useEffect } from 'react'
import { ArrowLeft, Upload, Image as ImageIcon, CheckCircle, X, MapPin, Home, Building2, Hotel, Warehouse, DollarSign, Maximize, Eye, EyeOff } from 'lucide-react'
import { Button, Card, CardHeader, CardTitle, CardContent, Input, Label } from '@/components/ui'
import { useStrings } from '@/utils/localizations/useStrings'
import { useProperties } from '@/hooks'
import toast from 'react-hot-toast'

/**
 * PropertyUploadForm Component
 * Form for sellers to upload and tokenize properties
 * Features: Property details, image upload, tokenization parameters
 */

const PROPERTY_CATEGORIES = [
  { id: 'houses', name: 'House', icon: Home },
  { id: 'apartments', name: 'Apartment', icon: Building2 },
  { id: 'hotels', name: 'Hotel', icon: Hotel },
  { id: 'commercial', name: 'Commercial', icon: Warehouse },
]

export function PropertyUploadForm({ onBack, onSuccess, user, initialProperty = null }) {
  const Strings = useStrings()
  const [showSuccess, setShowSuccess] = useState(false)
  const [uploadedImages, setUploadedImages] = useState([])
  const [imagesToUpload, setImagesToUpload] = useState([]) // New images to upload

  // Use properties hook for real backend integration
  const {
    createProperty,
    updateProperty,
    uploadImages,
    isCreating,
    isUpdating,
    isUploadingImages
  } = useProperties()

  const isUploading = isCreating || isUpdating || isUploadingImages
  const isEditMode = !!initialProperty

  // Form state
  const [formData, setFormData] = useState({
    title: initialProperty?.name || initialProperty?.title || '',
    location: initialProperty?.address || initialProperty?.location || '',
    category: initialProperty?.category || 'houses',
    price: initialProperty?.valuation || initialProperty?.price || '',
    area: initialProperty?.metadata?.area || initialProperty?.area || '',
    bedrooms: initialProperty?.metadata?.bedrooms || initialProperty?.bedrooms || '',
    bathrooms: initialProperty?.metadata?.bathrooms || initialProperty?.bathrooms || '',
    totalTokens: initialProperty?.totalSupply || initialProperty?.totalTokens || '',
    description: initialProperty?.description || '',
    propertyId: initialProperty?.propertyId || `PROP-${Date.now()}`,
    legalOwner: user?.name || '',
    adminSecretKey: '', // Stellar admin secret key (REQUIRED for contract deployment)
  })

  const [errors, setErrors] = useState({})
  const [showSecretKey, setShowSecretKey] = useState(false)

  // Load existing images if editing
  useEffect(() => {
    if (initialProperty?.images) {
      const existingImages = initialProperty.images.map((url, index) => ({
        id: `existing-${index}`,
        url,
        existing: true,
      }))
      setUploadedImages(existingImages)
    }
  }, [initialProperty])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    const newImages = files.map(file => ({
      id: Math.random().toString(36),
      url: URL.createObjectURL(file),
      file,
      existing: false,
    }))
    setUploadedImages(prev => [...prev, ...newImages])
    setImagesToUpload(prev => [...prev, ...files])
  }

  const removeImage = (imageId) => {
    const imageToRemove = uploadedImages.find(img => img.id === imageId)
    setUploadedImages(prev => prev.filter(img => img.id !== imageId))

    // Also remove from imagesToUpload if it's a new image
    if (imageToRemove && imageToRemove.file) {
      setImagesToUpload(prev => prev.filter(file => file !== imageToRemove.file))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.location.trim()) newErrors.location = 'Location is required'
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required'
    if (!formData.area || parseFloat(formData.area) <= 0) newErrors.area = 'Valid area is required'
    if (!formData.totalTokens || parseInt(formData.totalTokens) <= 0) newErrors.totalTokens = 'Valid token amount is required'
    if (!formData.adminSecretKey || !formData.adminSecretKey.startsWith('S')) {
      newErrors.adminSecretKey = 'Valid Stellar secret key is required (starts with S)'
    }
    if (uploadedImages.length === 0) newErrors.images = 'At least one image is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      let propertyId = initialProperty?.id

      if (isEditMode) {
        // Update existing property
        const updatedProperty = await updateProperty({
          id: propertyId,
          data: {
            name: formData.title,
            address: formData.location,
            description: formData.description,
            valuation: parseFloat(formData.price),
            totalSupply: parseInt(formData.totalTokens),
            category: formData.category,
            metadata: {
              bedrooms: parseInt(formData.bedrooms) || 0,
              bathrooms: parseInt(formData.bathrooms) || 0,
              area: parseFloat(formData.area),
            },
          },
        })
        propertyId = updatedProperty.id
      } else {
        // Create new property
        const payload = {
          name: formData.title,
          propertyId: formData.propertyId,
          address: formData.location,
          description: formData.description,
          valuation: parseFloat(formData.price),
          totalSupply: parseInt(formData.totalTokens),
          legalOwner: formData.legalOwner || user?.name || 'Owner',
          adminSecretKey: formData.adminSecretKey, // REQUIRED: Stellar secret key for deployment
          category: formData.category,
          metadata: {
            bedrooms: parseInt(formData.bedrooms) || 0,
            bathrooms: parseInt(formData.bathrooms) || 0,
            area: parseFloat(formData.area),
          },
        }
        console.log('🔍 DEBUG PropertyUploadForm - Payload:', payload)
        const newProperty = await createProperty(payload)
        console.log('🔍 DEBUG PropertyUploadForm - Response:', newProperty)
        propertyId = newProperty.id
      }

      // Upload images if there are new ones
      if (imagesToUpload.length > 0 && propertyId) {
        await uploadImages({
          id: propertyId,
          files: imagesToUpload,
        })
      }

      // Show success
      const newProperty = {
        id: propertyId,
        title: formData.title,
        name: formData.title,
        location: formData.location,
        address: formData.location,
        price: parseFloat(formData.price),
        valuation: parseFloat(formData.price),
        image: uploadedImages[0]?.url || 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
        category: formData.category,
        area: parseFloat(formData.area),
        bedrooms: parseInt(formData.bedrooms) || 0,
        bathrooms: parseInt(formData.bathrooms) || 0,
        tokensAvailable: parseInt(formData.totalTokens),
        totalTokens: parseInt(formData.totalTokens),
        tokensSold: 0,
        status: 'active',
        createdAt: new Date().toISOString(),
        revenue: 0,
        investors: 0,
        verified: false,
      }

      setShowSuccess(true)

      // Notify parent component of success
      if (onSuccess) {
        onSuccess(newProperty)
      }
    } catch (error) {
      console.error('Error submitting property:', error)
      toast.error(isEditMode ? 'Error al actualizar propiedad' : 'Error al crear propiedad')
    }
  }

  const handleContinue = () => {
    setShowSuccess(false)
    if (onBack) {
      onBack()
    }
  }

  // Scroll to top when success modal shows
  useEffect(() => {
    if (showSuccess) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [showSuccess])

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="max-w-lg w-full">
          <CardContent className="pt-12 pb-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 mb-6 animate-in zoom-in duration-300">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold mb-2">
                {Strings.propertyUploadedSuccessfully || '¡Propiedad Subida Exitosamente!'}
              </h2>
              <p className="text-muted-foreground mb-6">
                {Strings.propertyUnderReview || 'Tu propiedad está ahora bajo revisión. Serás notificado una vez que esté en vivo en el marketplace.'}
              </p>
              <div className="space-y-3 mb-6">
                <div className="p-4 rounded-xl bg-muted/50 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">{Strings.propertyName || 'Nombre de la Propiedad'}</span>
                    <span className="font-semibold">{formData.title}</span>
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">{Strings.totalTokens || 'Tokens Totales'}</span>
                    <span className="font-semibold">{formData.totalTokens}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{Strings.estimatedValue || 'Valor Estimado'}</span>
                    <span className="font-semibold">${parseFloat(formData.price).toLocaleString()} USDC</span>
                  </div>
                </div>
              </div>

              {/* Continue Button */}
              <Button
                onClick={handleContinue}
                size="lg"
                className="w-full"
              >
                {Strings.continue || 'Continuar'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="border-b border-border/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="gap-2 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            {Strings.back || 'Back'}
          </Button>
          <h1 className="text-3xl font-bold mb-2">
            {Strings.uploadNewProperty || 'Upload New Property'}
          </h1>
          <p className="text-muted-foreground">
            {Strings.fillPropertyDetails || 'Fill in the details to tokenize your property on the Stellar blockchain'}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Property Images */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                {Strings.propertyImages || 'Property Images'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Image Upload */}
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  id="images"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label htmlFor="images" className="cursor-pointer">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-sm font-medium mb-1">
                    {Strings.clickToUpload || 'Click to upload images'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG up to 10MB
                  </p>
                </label>
              </div>

              {/* Uploaded Images Preview */}
              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {uploadedImages.map((image) => (
                    <div key={image.id} className="relative group aspect-square rounded-lg overflow-hidden border border-border">
                      <img
                        src={image.url}
                        alt="Property"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {errors.images && (
                <p className="text-sm text-destructive">{errors.images}</p>
              )}
            </CardContent>
          </Card>

          {/* Property Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="w-5 h-5" />
                {Strings.propertyDetails || 'Property Details'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title */}
              <div>
                <Label htmlFor="title">{Strings.propertyTitle || 'Property Title'}</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Modern Beach House in Miami"
                  className={errors.title ? 'border-destructive' : ''}
                />
                {errors.title && (
                  <p className="text-sm text-destructive mt-1">{errors.title}</p>
                )}
              </div>

              {/* Location */}
              <div>
                <Label htmlFor="location">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  {Strings.location || 'Location'}
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="e.g., Miami Beach, FL"
                  className={errors.location ? 'border-destructive' : ''}
                />
                {errors.location && (
                  <p className="text-sm text-destructive mt-1">{errors.location}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <Label>{Strings.propertyType || 'Property Type'}</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                  {PROPERTY_CATEGORIES.map((category) => {
                    const Icon = category.icon
                    const isSelected = formData.category === category.id
                    return (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => handleInputChange('category', category.id)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          isSelected
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <Icon className={`w-6 h-6 mx-auto mb-2 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                        <p className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                          {category.name}
                        </p>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Price and Area */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">
                    <DollarSign className="w-4 h-4 inline mr-1" />
                    {Strings.propertyValue || 'Property Value (USDC)'}
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="e.g., 2500000"
                    className={errors.price ? 'border-destructive' : ''}
                  />
                  {errors.price && (
                    <p className="text-sm text-destructive mt-1">{errors.price}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="area">
                    <Maximize className="w-4 h-4 inline mr-1" />
                    {Strings.area || 'Area (sq ft)'}
                  </Label>
                  <Input
                    id="area"
                    type="number"
                    value={formData.area}
                    onChange={(e) => handleInputChange('area', e.target.value)}
                    placeholder="e.g., 3200"
                    className={errors.area ? 'border-destructive' : ''}
                  />
                  {errors.area && (
                    <p className="text-sm text-destructive mt-1">{errors.area}</p>
                  )}
                </div>
              </div>

              {/* Bedrooms and Bathrooms */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bedrooms">{Strings.bedrooms || 'Bedrooms'}</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                    placeholder="e.g., 4"
                  />
                </div>

                <div>
                  <Label htmlFor="bathrooms">{Strings.bathrooms || 'Bathrooms'}</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                    placeholder="e.g., 3"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">{Strings.description || 'Description'}</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your property, its features, and location benefits..."
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Tokenization Details */}
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                {Strings.tokenizationSettings || 'Tokenization Settings'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="totalTokens">{Strings.totalTokens || 'Total Tokens to Generate'}</Label>
                <Input
                  id="totalTokens"
                  type="number"
                  value={formData.totalTokens}
                  onChange={(e) => handleInputChange('totalTokens', e.target.value)}
                  placeholder="e.g., 2500"
                  className={errors.totalTokens ? 'border-destructive' : ''}
                />
                {errors.totalTokens && (
                  <p className="text-sm text-destructive mt-1">{errors.totalTokens}</p>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  {formData.price && formData.totalTokens && parseFloat(formData.price) > 0 && parseInt(formData.totalTokens) > 0 ? (
                    <>Price per token: ${(parseFloat(formData.price) / parseInt(formData.totalTokens)).toLocaleString()} USDC</>
                  ) : (
                    'Enter property value and token amount to calculate price per token'
                  )}
                </p>
              </div>

              {/* Admin Secret Key */}
              <div>
                <Label htmlFor="adminSecretKey">
                  Stellar Admin Secret Key *
                  <span className="text-xs text-muted-foreground ml-2">(Required for deployment)</span>
                </Label>
                <div className="relative">
                  <Input
                    id="adminSecretKey"
                    type={showSecretKey ? 'text' : 'password'}
                    value={formData.adminSecretKey}
                    onChange={(e) => handleInputChange('adminSecretKey', e.target.value)}
                    placeholder="SABC..."
                    className={errors.adminSecretKey ? 'border-destructive pr-10' : 'pr-10'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecretKey(!showSecretKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showSecretKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.adminSecretKey && (
                  <p className="text-sm text-destructive mt-1">{errors.adminSecretKey}</p>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  Your Stellar secret key (obtained during registration). This is required to deploy the property smart contract.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <p className="text-sm text-foreground">
                  <strong>Note:</strong> {Strings.tokenizationNote || 'Your property will be tokenized on the Stellar blockchain. Each token represents fractional ownership and will be available for investors to purchase.'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="flex-1"
            >
              {Strings.cancel || 'Cancel'}
            </Button>
            <Button
              type="submit"
              disabled={isUploading}
              className="flex-1"
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                  {Strings.uploading || 'Uploading...'}
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  {Strings.uploadProperty || 'Upload Property'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
