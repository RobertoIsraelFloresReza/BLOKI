import { useState, useEffect } from 'react'
import { Plus, Home, DollarSign, Users, CheckCircle, Clock, XCircle, TrendingUp } from 'lucide-react'
import { Button, Card, CardContent, Badge, Spinner } from '@/components/ui'
import { PropertyUploadForm } from '@/components/seller/PropertyUploadForm'
import { PropertyCard } from '@/components/properties/PropertyCard'
import { PropertyDetails } from '@/pages/property/PropertyDetails'
import { CreateListingModal } from '@/components/marketplace'
import { useStrings } from '@/utils/localizations/useStrings'
import { useMyOwnedProperties, useProperties } from '@/hooks'
import { useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

/**
 * Seller Dashboard Page (Propiedades)
 * Main interface for property sellers/owners
 * Features: Property upload, listing management, revenue tracking
 * Follows Marketplace design patterns
 */

export function SellerDashboard({ user }) {
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [editingProperty, setEditingProperty] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [showCreateListing, setShowCreateListing] = useState(false)
  const [propertyForListing, setPropertyForListing] = useState(null)
  const Strings = useStrings()
  const queryClient = useQueryClient()

  // Fetch user's owned properties from backend (uses /properties/my-owned endpoint)
  const { data: ownedPropertiesResponse, isLoading, error } = useMyOwnedProperties()

  // Get delete mutation from useProperties hook
  const { deleteProperty, isDeleting } = useProperties()

  // Backend returns {data: [...]} so extract the array
  const userProperties = ownedPropertiesResponse?.data || ownedPropertiesResponse || []

  console.log('🔍 DEBUG SellerDashboard - User:', user)
  console.log('🔍 DEBUG SellerDashboard - Owned properties response:', ownedPropertiesResponse)
  console.log('🔍 DEBUG SellerDashboard - User properties:', userProperties)

  // Calculate statistics from user's properties
  const totalProperties = userProperties.length

  // Calculate revenue: sum of (tokensSold * price / totalTokens) for each property
  const totalRevenue = userProperties.reduce((sum, prop) => {
    try {
      // Convert strings to numbers (backend sends them as strings)
      const totalSupply = parseFloat(prop.totalSupply || prop.totalTokens || 0)
      const availableTokens = parseFloat(prop.availableTokens || prop.tokensAvailable || 0)
      const valuation = parseFloat(prop.valuation || prop.price || 0)

      const tokensSold = totalSupply - availableTokens
      const pricePerToken = totalSupply > 0 ? valuation / totalSupply : 0
      const revenue = tokensSold * pricePerToken

      return sum + (isNaN(revenue) ? 0 : revenue)
    } catch (error) {
      console.error('Error calculating revenue for property:', prop, error)
      return sum
    }
  }, 0)

  // Total investors would need ownership data - for now use a placeholder
  const totalInvestors = userProperties.reduce((sum, prop) => {
    // This should come from ownership/transactions table
    return sum + (prop.investors || 0)
  }, 0)

  const activeProperties = userProperties.filter(p => (p.status || 'active') === 'active').length

  // Filter properties by status
  const filteredProperties = selectedStatus === 'all'
    ? userProperties
    : userProperties.filter(p => (p.status || 'active') === selectedStatus)

  const handleUploadSuccess = (newProperty) => {
    // Close the form
    setShowUploadForm(false)
    setEditingProperty(null)

    // Invalidate queries to refresh the properties list
    queryClient.invalidateQueries({ queryKey: ['properties', 'my-owned'] })
    queryClient.invalidateQueries({ queryKey: ['properties'] })

    const message = editingProperty
      ? '¡Propiedad actualizada exitosamente!'
      : '¡Propiedad creada! Aparecerá en tu dashboard en unos momentos.'
    toast.success(message)
  }

  const handleEditProperty = (property) => {
    setEditingProperty(property)
    setShowUploadForm(true)
  }

  const handleDeleteProperty = (property) => {
    const propertyName = property.name || property.title
    if (window.confirm(`¿Estás seguro de eliminar "${propertyName}"?\n\nEsta acción no se puede deshacer.`)) {
      deleteProperty(property.id, {
        onSuccess: () => {
          toast.success(`Propiedad "${propertyName}" eliminada exitosamente`)
        },
        onError: (error) => {
          const message = error.response?.data?.message || 'Error al eliminar la propiedad'
          toast.error(message)
        }
      })
    }
  }

  // Status badges configuration
  const statusConfig = {
    active: {
      label: Strings.activeStatus || 'Activo',
      variant: 'default',
      icon: CheckCircle,
      color: 'text-green-500'
    },
    pending: {
      label: Strings.pendingStatus || 'Pendiente',
      variant: 'secondary',
      icon: Clock,
      color: 'text-yellow-500'
    },
    inactive: {
      label: Strings.inactiveStatus || 'Inactivo',
      variant: 'outline',
      icon: XCircle,
      color: 'text-gray-500'
    }
  }

  // Show PropertyDetails if a property is selected
  if (selectedProperty) {
    return (
      <PropertyDetails
        property={selectedProperty}
        onBack={() => setSelectedProperty(null)}
        user={user}
      />
    )
  }

  // Show upload/edit form if requested
  if (showUploadForm) {
    return (
      <PropertyUploadForm
        onBack={() => {
          setShowUploadForm(false)
          setEditingProperty(null)
        }}
        onSuccess={handleUploadSuccess}
        user={user}
        initialProperty={editingProperty}
      />
    )
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pb-20">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Spinner size="xl" variant="orbit" />
            <div className="absolute inset-0 -z-10 bg-primary/20 blur-2xl rounded-full animate-pulse" />
          </div>
          <p className="text-muted-foreground animate-pulse">{Strings.loadingYourProperties}</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pb-20">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
            <Home className="w-8 h-8 text-destructive" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {Strings.errorLoadingProperties}
          </h3>
          <p className="text-muted-foreground mb-4">
            {error?.message || Strings.couldNotLoadProperties}
          </p>
          <Button onClick={() => window.location.reload()}>
            {Strings.reload}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header Section - Similar to Marketplace */}
      <div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Title */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-3">
                {Strings.myProperties || 'Mis Propiedades'}
              </h1>
              <p className="text-lg text-muted-foreground">
                {Strings.manageYourProperties || 'Administra tus propiedades tokenizadas y rastrea su rendimiento'}
              </p>
            </div>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setShowUploadForm(true)}
              className="gap-2 shrink-0 bg-transparent border-2 border-primary/30 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
            >
              <Plus className="w-5 h-5" />
              {Strings.uploadProperty || 'Subir Propiedad'}
            </Button>
          </div>

          {/* Statistics Grid - Simplified, no ROI */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Properties */}
            <Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-transparent">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {Strings.totalProperties || 'Propiedades Totales'}
                    </p>
                    <p className="text-3xl font-bold">{totalProperties}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activeProperties} {Strings.activeStatus || 'activas'}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-primary/20">
                    <Home className="w-8 h-8 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Revenue */}
            <Card className="border-green-500/20 bg-gradient-to-br from-green-500/10 to-transparent">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {Strings.totalRevenue || 'Ingresos Totales'}
                    </p>
                    <p className="text-3xl font-bold">
                      ${totalRevenue > 0 ? (totalRevenue / 10000000).toFixed(2) : '0.00'}
                    </p>
                    <p className="text-xs text-green-500 mt-1">
                      +12.5% {Strings.thisMonth || 'este mes'}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-green-500/20">
                    <DollarSign className="w-8 h-8 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Investors */}
            <Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-transparent">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {Strings.totalInvestors || 'Inversores Totales'}
                    </p>
                    <p className="text-3xl font-bold">{totalInvestors}</p>
                    <p className="text-xs text-blue-500 mt-1">
                      +23 {Strings.thisWeek || 'esta semana'}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-500/20">
                    <Users className="w-8 h-8 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Properties Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter Tabs - Similar to Marketplace */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <button
            onClick={() => setSelectedStatus('all')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              selectedStatus === 'all'
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
          >
            {Strings.all || 'Todas'} ({userProperties.length})
          </button>
          {Object.entries(statusConfig).map(([status, config]) => {
            const count = userProperties.filter(p => (p.status || 'active') === status).length
            return (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedStatus === status
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                {config.label} ({count})
              </button>
            )
          })}
        </div>

        {/* Properties Grid */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map(property => (
              <PropertyCard
                key={property.id}
                property={property}
                showActions={true}
                onViewDetails={() => setSelectedProperty(property)}
                onEdit={() => handleEditProperty(property)}
                onDelete={() => handleDeleteProperty(property)}
                onCreateListing={(property) => {
                  setPropertyForListing(property)
                  setShowCreateListing(true)
                }}
              />
            ))}
          </div>
        ) : (
          /* Empty State - Similar to Marketplace */
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <Home className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {Strings.noProperties || 'No se encontraron propiedades'}
            </h3>
            <p className="text-muted-foreground max-w-sm mx-auto mb-6">
              {selectedStatus === 'all'
                ? (Strings.uploadFirstProperty || 'Sube tu primera propiedad para comenzar a generar ingresos')
                : (Strings.noPropertiesWithStatus || `No hay propiedades con este estado`)
              }
            </p>
            {selectedStatus === 'all' && (
              <Button
                onClick={() => setShowUploadForm(true)}
                className="gap-2 bg-transparent border-2 border-primary/30 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                variant="outline"
              >
                <Plus className="w-4 h-4" />
                {Strings.uploadProperty || 'Subir Propiedad'}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Create Listing Modal */}
      {showCreateListing && propertyForListing && (
        <CreateListingModal
          isOpen={showCreateListing}
          onClose={(refresh) => {
            setShowCreateListing(false)
            setPropertyForListing(null)
            if (refresh) {
              // Refresh properties and marketplace data
              queryClient.invalidateQueries({ queryKey: ['properties'] })
              queryClient.invalidateQueries({ queryKey: ['properties', 'my-owned'] })
              queryClient.invalidateQueries({ queryKey: ['marketplace'] })
            }
          }}
          property={propertyForListing}
          user={user}
        />
      )}
    </div>
  )
}
