import { useState } from 'react'
import { Plus, Home, DollarSign, Users, CheckCircle, Clock, XCircle } from 'lucide-react'
import { Button, Card, CardContent, Badge } from '@/components/ui'
import { PropertyUploadForm } from '@/components/seller/PropertyUploadForm'
import { PropertyCard } from '@/components/marketplace/PropertyCard'
import { PropertyDetails } from '@/pages/property/PropertyDetails'
import { useStrings } from '@/utils/localizations/useStrings'

/**
 * Seller Dashboard Page (Propiedades)
 * Main interface for property sellers/owners
 * Features: Property upload, listing management, revenue tracking
 * Follows Marketplace design patterns
 */

// Mock data - Seller's properties
const MOCK_SELLER_PROPERTIES = [
  {
    id: '1',
    title: 'Casa Moderna en Miami Beach',
    location: 'Miami Beach, FL',
    price: 2500000,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
    category: 'houses',
    area: 3200,
    tokensAvailable: 1000,
    totalTokens: 2500,
    tokensSold: 1500,
    status: 'active',
    createdAt: '2024-01-15',
    revenue: 1500000,
    investors: 245
  },
  {
    id: '2',
    title: 'Apartamento Luxury en Manhattan',
    location: 'Manhattan, NY',
    price: 1800000,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
    category: 'apartments',
    area: 1800,
    tokensAvailable: 500,
    totalTokens: 1800,
    tokensSold: 1300,
    status: 'active',
    createdAt: '2024-02-10',
    revenue: 1300000,
    investors: 180
  },
  {
    id: '3',
    title: 'Villa Colonial en Cartagena',
    location: 'Cartagena, Colombia',
    price: 3200000,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
    category: 'houses',
    area: 5500,
    tokensAvailable: 2000,
    totalTokens: 3200,
    tokensSold: 1200,
    status: 'pending',
    createdAt: '2024-03-01',
    revenue: 1200000,
    investors: 95
  },
]

export function SellerDashboard({ user }) {
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [properties, setProperties] = useState(MOCK_SELLER_PROPERTIES)
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedProperty, setSelectedProperty] = useState(null)
  const Strings = useStrings()

  // Calculate statistics
  const totalProperties = properties.length
  const totalRevenue = properties.reduce((sum, prop) => sum + prop.revenue, 0)
  const totalInvestors = properties.reduce((sum, prop) => sum + prop.investors, 0)
  const activeProperties = properties.filter(p => p.status === 'active').length

  // Filter properties by status
  const filteredProperties = selectedStatus === 'all'
    ? properties
    : properties.filter(p => p.status === selectedStatus)

  const handleUploadSuccess = (newProperty) => {
    setProperties([newProperty, ...properties])
    setShowUploadForm(false)
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

  // Show upload form if requested
  if (showUploadForm) {
    return (
      <PropertyUploadForm
        onBack={() => setShowUploadForm(false)}
        onSuccess={handleUploadSuccess}
        user={user}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header Section - Similar to Marketplace */}
      <div className="border-b border-border">
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
                      ${(totalRevenue / 1000000).toFixed(2)}M
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
            {Strings.all || 'Todas'} ({properties.length})
          </button>
          {Object.entries(statusConfig).map(([status, config]) => {
            const count = properties.filter(p => p.status === status).length
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
                onViewDetails={() => setSelectedProperty(property)}
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
    </div>
  )
}
