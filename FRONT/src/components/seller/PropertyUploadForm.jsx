import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Upload, Image as ImageIcon, CheckCircle, X, MapPin, Home, Building2, Hotel, Warehouse, DollarSign, Maximize, Award, FileText, Coins } from 'lucide-react'
import { Button, Card, CardHeader, CardTitle, CardContent, Input, Label, Badge, Spinner, Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui'
import { useStrings } from '@/utils/localizations/useStrings'
import { useProperties, useEvaluators } from '@/hooks'
import { authService } from '@/services'
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
  const navigate = useNavigate()
  const [showSuccess, setShowSuccess] = useState(false)
  const [uploadedImages, setUploadedImages] = useState([])
  const [imagesToUpload, setImagesToUpload] = useState([]) // New images to upload
  const [valuationDocument, setValuationDocument] = useState(null) // Valuation document file
  const [valuationDocumentUrl, setValuationDocumentUrl] = useState(initialProperty?.valuationDocument || '')
  const [selectedEvaluatorId, setSelectedEvaluatorId] = useState(initialProperty?.evaluatorId || null)
  const [verificationId, setVerificationId] = useState(initialProperty?.verificationId || '')
  const [currentStep, setCurrentStep] = useState('basic') // Current step in the flow

  // Use properties hook for real backend integration
  const {
    createProperty,
    updateProperty,
    uploadImages,
    isCreating,
    isUpdating,
    isUploadingImages
  } = useProperties()

  // Fetch evaluators
  const { evaluators, isLoading: isLoadingEvaluators } = useEvaluators(true)

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
  })

  const [errors, setErrors] = useState({})

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

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)

    console.log('📷 === IMAGE UPLOAD HANDLER ===')
    console.log('Files selected:', files.length)
    files.forEach((file, i) => {
      console.log(`  ${i + 1}. ${file.name} - ${(file.size / 1024).toFixed(2)}KB - ${file.type}`)
    })

    // Crear preview local inmediatamente
    const newImages = files.map(file => ({
      id: Math.random().toString(36),
      url: URL.createObjectURL(file),
      file,
      existing: false,
      uploading: true, // Marcar como "subiendo"
    }))

    setUploadedImages(prev => [...prev, ...newImages])

    console.log('☁️ Uploading images to Cloudflare R2...')

    try {
      // Subir INMEDIATAMENTE a Cloudflare
      const formData = new FormData()
      files.forEach(file => {
        formData.append('files', file)
      })

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/cloudflare/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('blocki_token')}`
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to upload to Cloudflare')
      }

      const responseData = await response.json()
      console.log('✅ Cloudflare upload successful:', responseData)

      // Extraer el array de resultados (puede venir en data o directamente)
      const cloudflareResults = responseData.data || responseData

      // Actualizar las imágenes con las URLs de Cloudflare
      setUploadedImages(prev => {
        let resultIndex = 0
        const updated = prev.map(img => {
          if (img.uploading && cloudflareResults[resultIndex]) {
            const cloudflareResult = cloudflareResults[resultIndex]
            resultIndex++
            return {
              ...img,
              url: cloudflareResult.url, // Reemplazar URL local con URL de Cloudflare
              cloudflareUrl: cloudflareResult.url,
              uploading: false,
            }
          }
          return img
        })
        return updated
      })

      toast.success(`${files.length} imagen(es) subida(s) exitosamente`)
    } catch (error) {
      console.error('❌ Error uploading to Cloudflare:', error)
      toast.error('Error al subir imágenes a Cloudflare')

      // Remover las imágenes que fallaron
      setUploadedImages(prev => prev.filter(img => !img.uploading))
    }

    console.log('=== IMAGE UPLOAD HANDLER END ===')
  }

  const removeImage = (imageId) => {
    const imageToRemove = uploadedImages.find(img => img.id === imageId)
    setUploadedImages(prev => prev.filter(img => img.id !== imageId))

    // Also remove from imagesToUpload if it's a new image
    if (imageToRemove && imageToRemove.file) {
      setImagesToUpload(prev => prev.filter(file => file !== imageToRemove.file))
    }
  }

  const handleDocumentUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setValuationDocument(file)

    // Clear error if exists
    if (errors.valuationDocument) {
      setErrors(prev => ({ ...prev, valuationDocument: '' }))
    }

    console.log('📄 Uploading valuation document to Cloudflare...')

    try {
      // Subir a Cloudflare
      const formData = new FormData()
      formData.append('files', file)

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/cloudflare/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('blocki_token')}`
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to upload document to Cloudflare')
      }

      const responseData = await response.json()

      // Extraer el array de resultados (puede venir en data o directamente)
      const cloudflareResults = responseData.data || responseData
      const documentUrl = cloudflareResults[0]?.url

      console.log('✅ Valuation document uploaded:', documentUrl)
      setValuationDocumentUrl(documentUrl)

      toast.success('Documento de evaluación subido exitosamente')
    } catch (error) {
      console.error('❌ Error uploading document:', error)
      toast.error('Error al subir el documento')
      setValuationDocument(null)
    }
  }

  const removeDocument = () => {
    setValuationDocument(null)
    setValuationDocumentUrl('')
  }

  const validateForm = () => {
    console.log('🔍 === FORM VALIDATION ===')
    const newErrors = {}

    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.location.trim()) newErrors.location = 'Location is required'
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required'
    if (!formData.area || parseFloat(formData.area) <= 0) newErrors.area = 'Valid area is required'
    if (!formData.totalTokens || parseInt(formData.totalTokens) <= 0) newErrors.totalTokens = 'Valid token amount is required'

    console.log('📸 Images in preview (uploadedImages):', uploadedImages.length)
    console.log('📦 Files to upload (imagesToUpload):', imagesToUpload.length)

    if (uploadedImages.length === 0) {
      console.warn('⚠️ No images selected - validation will fail')
      newErrors.images = 'At least one image is required'
    } else {
      console.log('✅ Images validated:', uploadedImages.length)
    }

    // Valuation document is optional but recommended
    if (!valuationDocument && !valuationDocumentUrl) {
      console.warn('ℹ️ No valuation document provided (optional)')
    }

    console.log('Validation errors:', newErrors)
    console.log('=== FORM VALIDATION END ===')

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    console.log('🚀 === PROPERTY UPLOAD FORM: SUBMIT START ===')

    if (!validateForm()) {
      console.log('❌ Form validation failed')
      return
    }

    console.log('✅ Form validation passed')

    try {
      let propertyId = initialProperty?.id

      if (isEditMode) {
        console.log('📝 Edit mode - Updating property:', propertyId)
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
            evaluatorId: selectedEvaluatorId || undefined,
            verificationId: verificationId || undefined,
            metadata: {
              bedrooms: parseInt(formData.bedrooms) || 0,
              bathrooms: parseInt(formData.bathrooms) || 0,
              area: parseFloat(formData.area),
            },
          },
        })
        propertyId = updatedProperty.id
        console.log('✅ Property updated:', propertyId)
      } else {
        console.log('🆕 Create mode - Creating new property')

        // CRITICAL: Get admin secret key for blockchain deployment
        console.log('🔐 Fetching admin secret key for property deployment...')
        let adminSecretKey
        try {
          const secretKeyResponse = await authService.getWalletSecretKey()
          adminSecretKey = secretKeyResponse.stellarSecretKey
          console.log('✅ Admin secret key retrieved')
        } catch (error) {
          console.error('❌ Failed to get admin secret key:', error)
          toast.error('No se pudo obtener la clave de administrador. Por favor, intenta de nuevo.')
          return
        }

        // Create new property
        const payload = {
          name: formData.title,
          propertyId: formData.propertyId,
          address: formData.location,
          description: formData.description,
          valuation: parseFloat(formData.price),
          totalSupply: parseInt(formData.totalTokens),
          legalOwner: formData.legalOwner || user?.name || 'Owner',
          adminSecretKey: adminSecretKey, // ✅ REQUIRED for blockchain deployment
          category: formData.category,
          evaluatorId: selectedEvaluatorId || undefined,
          verificationId: verificationId || undefined,
          metadata: {
            bedrooms: parseInt(formData.bedrooms) || 0,
            bathrooms: parseInt(formData.bathrooms) || 0,
            area: parseFloat(formData.area),
            category: formData.category,
          },
        }

        console.log('📦 Payload to send (adminSecretKey hidden):', JSON.stringify({ ...payload, adminSecretKey: '***' }, null, 2))
        const newProperty = await createProperty(payload)
        console.log('✅ Property created successfully!')
        console.log('📄 Created property:', newProperty)
        propertyId = newProperty.id
      }

      // Add image URLs to property (already uploaded to Cloudflare)
      console.log('📸 Images to attach:', uploadedImages.length)
      if (uploadedImages.length > 0 && propertyId) {
        // Extraer las URLs de Cloudflare
        const imageUrls = uploadedImages
          .filter(img => img.cloudflareUrl || img.existing)
          .map(img => img.cloudflareUrl || img.url)

        console.log('🖼️ Attaching image URLs to property:', propertyId)
        console.log('URLs:', imageUrls)

        // Enviar las URLs al backend
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/properties/${propertyId}/images`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('blocki_token')}`
          },
          body: JSON.stringify({ imageUrls })
        })

        if (!response.ok) {
          throw new Error('Failed to attach images to property')
        }

        console.log('✅ Images attached successfully!')
      } else {
        console.log('ℹ️ No images to attach')
      }

      // Attach valuation document URL if provided
      console.log('📄 Valuation document URL:', valuationDocumentUrl ? 'Yes' : 'No')
      if (valuationDocumentUrl && propertyId) {
        console.log('📤 Attaching valuation document URL...')

        const docResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/properties/${propertyId}/valuation-document`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('blocki_token')}`
          },
          body: JSON.stringify({ documentUrl: valuationDocumentUrl })
        })

        if (!docResponse.ok) {
          throw new Error('Failed to attach valuation document')
        }

        console.log('✅ Valuation document attached successfully')
      }

      console.log('🎉 Property creation process completed!')
      console.log('=== PROPERTY UPLOAD FORM: SUBMIT END ===')

      // Success toast
      toast.success('¡Propiedad creada exitosamente!')

      // Notify parent component of success and close form immediately
      if (onSuccess) {
        const newProperty = {
          id: propertyId,
          title: formData.title,
          name: formData.title,
          location: formData.location,
          address: formData.location,
          price: parseFloat(formData.price),
          valuation: parseFloat(formData.price),
          image: uploadedImages[0]?.cloudflareUrl || uploadedImages[0]?.url || 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
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
        console.log('📢 Calling onSuccess with:', newProperty)
        onSuccess(newProperty)
      }

      // Close form and return to properties
      console.log('🔄 Closing form and returning to properties list...')
      if (onBack) {
        onBack()
      }
    } catch (error) {
      console.error('❌ === ERROR SUBMITTING PROPERTY ===')
      console.error('Error message:', error.message)
      console.error('Error response:', error.response?.data)
      console.error('Full error:', error)
      console.error('=== ERROR END ===')
      // Error toasts are already handled by useProperties hook
    }
  }

  const handleContinue = () => {
    setShowSuccess(false)
    if (onBack) {
      onBack()
    }
  }

  // Step navigation
  const steps = ['basic', 'images', 'details', 'evaluation', 'tokenization']
  const currentStepIndex = steps.indexOf(currentStep)

  const goToNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1])
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const goToPreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1])
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const isFirstStep = currentStepIndex === 0
  const isLastStep = currentStepIndex === steps.length - 1

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

      {/* Form with Tabs */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          <Tabs value={currentStep} onValueChange={setCurrentStep} className="w-full">
            <TabsList className="w-full border-b border-border grid grid-cols-5">
              <TabsTrigger value="basic" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Información</span>
              </TabsTrigger>
              <TabsTrigger value="images" className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Imágenes</span>
              </TabsTrigger>
              <TabsTrigger value="details" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Detalles</span>
              </TabsTrigger>
              <TabsTrigger value="evaluation" className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                <span className="hidden sm:inline">Evaluación</span>
              </TabsTrigger>
              <TabsTrigger value="tokenization" className="flex items-center gap-2">
                <Coins className="w-4 h-4" />
                <span className="hidden sm:inline">Tokenización</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: Basic Information */}
            <TabsContent value="basic" className="space-y-6 mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="w-5 h-5" />
                    {Strings.propertyDetails || 'Información Básica'}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">
                    Comienza con los detalles fundamentales de tu propiedad
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Title */}
                  <div>
                    <Label htmlFor="title">{Strings.propertyTitle || 'Título de la Propiedad'}</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="ej. Casa Moderna en Miami Beach"
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
                      {Strings.location || 'Ubicación'}
                    </Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="ej. Miami Beach, FL"
                      className={errors.location ? 'border-destructive' : ''}
                    />
                    {errors.location && (
                      <p className="text-sm text-destructive mt-1">{errors.location}</p>
                    )}
                  </div>

                  {/* Category */}
                  <div>
                    <Label>{Strings.propertyType || 'Tipo de Propiedad'}</Label>
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

                  {/* Description */}
                  <div>
                    <Label htmlFor="description">{Strings.description || 'Descripción'}</Label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Describe tu propiedad, sus características y beneficios de ubicación..."
                      rows={4}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 2: Images */}
            <TabsContent value="images" className="space-y-6 mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    {Strings.propertyImages || 'Imágenes de la Propiedad'}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">
                    Sube fotografías de alta calidad de tu propiedad
                  </p>
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
                        {Strings.clickToUpload || 'Click para subir imágenes'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG hasta 10MB
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
                            className={`w-full h-full object-cover ${image.uploading ? 'opacity-50' : ''}`}
                          />
                          {image.uploading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
                            </div>
                          )}
                          {!image.uploading && (
                            <button
                              type="button"
                              onClick={() => removeImage(image.id)}
                              className="absolute top-2 right-2 p-1.5 rounded-lg bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {errors.images && (
                    <p className="text-sm text-destructive">{errors.images}</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 3: Details */}
            <TabsContent value="details" className="space-y-6 mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Detalles de la Propiedad
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">
                    Especifica las características y valor de la propiedad
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Price and Area */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">
                        <DollarSign className="w-4 h-4 inline mr-1" />
                        {Strings.propertyValue || 'Valor de la Propiedad (USDC)'}
                      </Label>
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        placeholder="ej. 2500000"
                        className={errors.price ? 'border-destructive' : ''}
                      />
                      {errors.price && (
                        <p className="text-sm text-destructive mt-1">{errors.price}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="area">
                        <Maximize className="w-4 h-4 inline mr-1" />
                        {Strings.area || 'Área (m²)'}
                      </Label>
                      <Input
                        id="area"
                        type="number"
                        value={formData.area}
                        onChange={(e) => handleInputChange('area', e.target.value)}
                        placeholder="ej. 3200"
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
                      <Label htmlFor="bedrooms">{Strings.bedrooms || 'Habitaciones'}</Label>
                      <Input
                        id="bedrooms"
                        type="number"
                        value={formData.bedrooms}
                        onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                        placeholder="ej. 4"
                      />
                    </div>

                    <div>
                      <Label htmlFor="bathrooms">{Strings.bathrooms || 'Baños'}</Label>
                      <Input
                        id="bathrooms"
                        type="number"
                        value={formData.bathrooms}
                        onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                        placeholder="ej. 3"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 4: Evaluation */}
            <TabsContent value="evaluation" className="space-y-6 mt-8">
              {/* Certified Evaluator Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    Evaluador Certificado
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">
                    Selecciona una empresa evaluadora certificada para validar tu propiedad
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoadingEvaluators ? (
                    <div className="flex items-center justify-center py-8">
                      <Spinner size="md" />
                      <span className="ml-2 text-sm text-muted-foreground">Cargando evaluadores...</span>
                    </div>
                  ) : evaluators.length === 0 ? (
                    <div className="text-center py-8 px-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        No hay evaluadores disponibles en este momento
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Evaluator Grid */}
                      <div className="grid grid-cols-1 gap-3">
                        {evaluators.map((evaluator) => (
                          <button
                            key={evaluator.id}
                            type="button"
                            onClick={() => setSelectedEvaluatorId(evaluator.id)}
                            className={`relative p-4 rounded-lg border-2 transition-all text-left ${
                              selectedEvaluatorId === evaluator.id
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50 hover:bg-accent/5'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              {evaluator.logo && (
                                <img
                                  src={evaluator.logo}
                                  alt={evaluator.name}
                                  className="w-12 h-12 rounded-lg object-cover"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="font-semibold text-sm">{evaluator.name}</p>
                                  {selectedEvaluatorId === evaluator.id && (
                                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                                  )}
                                </div>
                                {evaluator.description && (
                                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                                    {evaluator.description}
                                  </p>
                                )}
                                <div className="flex items-center gap-3 text-xs">
                                  <Badge variant="secondary" className="text-xs">
                                    ⭐ {evaluator.rating || 5.0}
                                  </Badge>
                                  <span className="text-muted-foreground">
                                    {evaluator.propertiesEvaluated || 0} propiedades
                                  </span>
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* Verification ID Input */}
                      {selectedEvaluatorId && (
                        <div className="pt-2">
                          <Label htmlFor="verificationId">ID de Verificación</Label>
                          <Input
                            id="verificationId"
                            type="text"
                            placeholder="VER-2025-001234"
                            value={verificationId}
                            onChange={(e) => setVerificationId(e.target.value)}
                            className="mt-1"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            ID proporcionado por el evaluador después de la inspección
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Valuation Document */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Documento de Evaluación
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">
                    {selectedEvaluatorId
                      ? 'Sube el documento oficial del evaluador seleccionado'
                      : 'Primero selecciona un evaluador certificado arriba'
                    }
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Upload Area */}
                  {!valuationDocument && !valuationDocumentUrl ? (
                    <label className="block cursor-pointer">
                      <div className="border-2 border-dashed border-border rounded-lg p-8 hover:border-primary hover:bg-accent/5 transition-all text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <Upload className="w-8 h-8 text-primary" />
                          </div>
                          <p className="text-sm font-medium mb-1">
                            Subir documento de evaluación
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PDF, DOC, DOCX, o imágenes hasta 10MB
                          </p>
                        </div>
                      </div>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={handleDocumentUpload}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="border border-border rounded-lg p-4 bg-accent/5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Upload className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {valuationDocument?.name || 'Documento de evaluación'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {valuationDocument
                                ? `${(valuationDocument.size / 1024 / 1024).toFixed(2)} MB`
                                : 'Ya subido'
                              }
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={removeDocument}
                          className="text-destructive hover:text-destructive/90 p-2"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 5: Tokenization */}
            <TabsContent value="tokenization" className="space-y-6 mt-8">
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Coins className="w-5 h-5" />
                    {Strings.tokenizationSettings || 'Configuración de Tokenización'}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">
                    Define cuántos tokens representarán tu propiedad en el blockchain
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="totalTokens">{Strings.totalTokens || 'Tokens Totales a Generar'}</Label>
                    <Input
                      id="totalTokens"
                      type="number"
                      value={formData.totalTokens}
                      onChange={(e) => handleInputChange('totalTokens', e.target.value)}
                      placeholder="ej. 2500"
                      className={errors.totalTokens ? 'border-destructive' : ''}
                    />
                    {errors.totalTokens && (
                      <p className="text-sm text-destructive mt-1">{errors.totalTokens}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      {formData.price && formData.totalTokens && parseFloat(formData.price) > 0 && parseInt(formData.totalTokens) > 0 ? (
                        <>Precio por token: ${(parseFloat(formData.price) / parseInt(formData.totalTokens)).toLocaleString()} USDC</>
                      ) : (
                        'Ingresa el valor de la propiedad y cantidad de tokens para calcular el precio por token'
                      )}
                    </p>
                  </div>

                  {/* Summary Card */}
                  {formData.title && formData.price && formData.totalTokens && (
                    <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
                      <p className="text-sm font-semibold text-foreground mb-3">Resumen de Tokenización</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Propiedad</span>
                          <span className="font-medium">{formData.title}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Valor Total</span>
                          <span className="font-medium">${parseFloat(formData.price).toLocaleString()} USDC</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Tokens Totales</span>
                          <span className="font-medium">{formData.totalTokens}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm border-t border-border/50 pt-2 mt-2">
                          <span className="text-muted-foreground">Precio por Token</span>
                          <span className="font-semibold text-primary">
                            ${(parseFloat(formData.price) / parseInt(formData.totalTokens)).toLocaleString()} USDC
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <p className="text-sm text-foreground">
                      <strong>Nota:</strong> {Strings.tokenizationNote || 'Tu propiedad será tokenizada en el blockchain de Stellar. Cada token representa propiedad fraccionaria y estará disponible para que los inversores lo compren.'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8">
            {!isFirstStep && (
              <Button
                type="button"
                variant="outline"
                onClick={goToPreviousStep}
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Anterior
              </Button>
            )}

            {isLastStep ? (
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
                    {Strings.uploadProperty || 'Subir propiedad'}
                  </>
                )}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={goToNextStep}
                className="flex-1"
              >
                Siguiente
                <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
