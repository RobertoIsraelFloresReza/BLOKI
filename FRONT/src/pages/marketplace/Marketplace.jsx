import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Home, Building2, Hotel, Warehouse, TrendingUp, Search, X } from 'lucide-react'
import { SearchBar } from '@/components/marketplace/SearchBar'
import { FiltersTabs } from '@/components/marketplace/FiltersTabs'
import { MarketplaceHeader } from '@/components/marketplace/MarketplaceHeader'
import { PropertyCard } from '@/components/properties/PropertyCard'
import { PropertyDetails } from '@/pages/property'
import { ScrollReveal, ScrollRevealItem, Spinner } from '@/components/ui'
import { useStrings } from '@/utils/localizations/useStrings'
import { useProperties } from '@/hooks'

/**
 * Marketplace Page
 * Main landing page with property listings
 * Features: Search, Category filters, Property grid
 * Follows Nielsen's heuristics and Cupertino design
 */

// Property categories (counts will be dynamic from backend)
const getPropertyFilters = (Strings) => [
  {
    id: 'all',
    name: Strings.all,
    icon: <TrendingUp className="w-5 h-5" />,
  },
  {
    id: 'houses',
    name: Strings.houses,
    icon: <Home className="w-5 h-5" />,
  },
  {
    id: 'apartments',
    name: Strings.apartments,
    icon: <Building2 className="w-5 h-5" />,
  },
  {
    id: 'hotels',
    name: Strings.hotels,
    icon: <Hotel className="w-5 h-5" />,
  },
  {
    id: 'commercial',
    name: Strings.commercial,
    icon: <Warehouse className="w-5 h-5" />,
  }
]

// Mock data only for DEMO purposes - will be removed after backend is populated
const DEMO_PROPERTIES = [
  {
    id: '1',
    title: 'Casa Moderna en Miami Beach',
    location: 'Miami Beach, FL',
    price: 2500000,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
    category: 'houses',
    bedrooms: 4,
    bathrooms: 3,
    area: 3200,
    tokensAvailable: 1000,
    totalTokens: 2500,
    roi: 8.5,
    verified: true
  },
  {
    id: '2',
    title: 'Apartamento Luxury en Manhattan',
    location: 'Manhattan, NY',
    price: 1800000,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
    category: 'apartments',
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    tokensAvailable: 500,
    totalTokens: 1800,
    roi: 7.2,
    verified: true
  },
  {
    id: '3',
    title: 'Hotel Boutique en Los Angeles',
    location: 'Los Angeles, CA',
    price: 8500000,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    category: 'hotels',
    bedrooms: 20,
    bathrooms: 22,
    area: 12000,
    tokensAvailable: 3000,
    totalTokens: 8500,
    roi: 12.3,
    verified: true
  },
  {
    id: '4',
    title: 'Casa de Playa en Cancún',
    location: 'Cancún, México',
    price: 1200000,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    category: 'houses',
    bedrooms: 3,
    bathrooms: 2,
    area: 2400,
    tokensAvailable: 800,
    totalTokens: 1200,
    roi: 9.8,
    verified: false
  },
  {
    id: '5',
    title: 'Penthouse en Buenos Aires',
    location: 'Buenos Aires, Argentina',
    price: 950000,
    image: 'https://images.unsplash.com/photo-1502672260066-6bc35f0ea4a4?w=800&q=80',
    category: 'apartments',
    bedrooms: 4,
    bathrooms: 3,
    area: 2800,
    tokensAvailable: 450,
    totalTokens: 950,
    roi: 6.5,
    verified: true
  },
  {
    id: '6',
    title: 'Villa Colonial en Cartagena',
    location: 'Cartagena, Colombia',
    price: 3200000,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
    category: 'houses',
    bedrooms: 6,
    bathrooms: 5,
    area: 5500,
    tokensAvailable: 1500,
    totalTokens: 3200,
    roi: 10.2,
    verified: true
  },
  {
    id: '7',
    title: 'Loft Moderno en Barcelona',
    location: 'Barcelona, España',
    price: 680000,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
    category: 'apartments',
    bedrooms: 2,
    bathrooms: 2,
    area: 1400,
    tokensAvailable: 340,
    totalTokens: 680,
    roi: 5.8,
    verified: false
  },
  {
    id: '8',
    title: 'Resort en Punta Cana',
    location: 'Punta Cana, Rep. Dominicana',
    price: 15000000,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
    category: 'hotels',
    bedrooms: 50,
    bathrooms: 52,
    area: 25000,
    tokensAvailable: 7500,
    totalTokens: 15000,
    roi: 15.5,
    verified: true
  },
  {
    id: '9',
    title: 'Casa Mediterránea en Ibiza',
    location: 'Ibiza, España',
    price: 4500000,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    category: 'houses',
    bedrooms: 5,
    bathrooms: 4,
    area: 4200,
    tokensAvailable: 2200,
    totalTokens: 4500,
    roi: 11.2,
    verified: true
  },
  {
    id: '10',
    title: 'Apartamento Frente al Mar en Río',
    location: 'Río de Janeiro, Brasil',
    price: 1100000,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
    category: 'apartments',
    bedrooms: 3,
    bathrooms: 2,
    area: 1900,
    tokensAvailable: 600,
    totalTokens: 1100,
    roi: 7.9,
    verified: true
  },
  {
    id: '11',
    title: 'Chalet de Montaña en Aspen',
    location: 'Aspen, CO',
    price: 7800000,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80',
    category: 'houses',
    bedrooms: 7,
    bathrooms: 6,
    area: 6800,
    tokensAvailable: 3900,
    totalTokens: 7800,
    roi: 8.8,
    verified: true
  },
  {
    id: '12',
    title: 'Edificio Comercial en Silicon Valley',
    location: 'Palo Alto, CA',
    price: 12000000,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
    category: 'commercial',
    bedrooms: 0,
    bathrooms: 8,
    area: 18000,
    tokensAvailable: 6000,
    totalTokens: 12000,
    roi: 14.2,
    verified: true
  }
]

export function Marketplace({ user, onFiltersChange, isScrolled, showMobileSearch, onCloseMobileSearch }) {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [selectedProperty, setSelectedProperty] = useState(null)
  const Strings = useStrings()

  // Handler to navigate to property details
  const handleViewDetails = (property) => {
    console.log('🔍 DEBUG Marketplace - Navigating to property:', property.id)
    navigate(`/property/${property.id}`)
  }

  // ALWAYS use real backend data
  const { properties, isLoading, error } = useProperties({
    // No filters - get ALL properties from backend
    page: 1,
    limit: 100,
  })

  // Use real properties from backend (fallback to empty array if loading/error)
  const allProperties = properties || []

  // DEBUG: Log properties to console
  useEffect(() => {
    console.log('🔍 DEBUG Marketplace - Properties:', properties)
    console.log('🔍 DEBUG Marketplace - isLoading:', isLoading)
    console.log('🔍 DEBUG Marketplace - error:', error)
    console.log('🔍 DEBUG Marketplace - allProperties:', allProperties)
  }, [properties, isLoading, error, allProperties])

  // Pass filters to parent (App) so Navbar can display them
  useEffect(() => {
    if (onFiltersChange) {
      onFiltersChange({
        filters: getPropertyFilters(Strings),
        selectedFilter,
        onFilterChange: setSelectedFilter
      })
    }
  }, [selectedFilter, Strings, onFiltersChange])

  // If a property is selected, show PropertyDetails
  if (selectedProperty) {
    return (
      <PropertyDetails
        property={selectedProperty}
        onBack={() => setSelectedProperty(null)}
        user={user}
      />
    )
  }

  // Filter properties on client side
  const filteredProperties = allProperties.filter(property => {
    // Normalize property data (backend might use different field names)
    const propertyCategory = property.metadata?.category || property.category
    const propertyName = property.name || property.title
    const propertyLocation = property.address || property.location

    // Filter by category
    const matchesCategory = selectedFilter === 'all' || propertyCategory === selectedFilter

    // Filter by search query
    const matchesSearch =
      searchQuery === '' ||
      propertyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      propertyLocation?.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-background relative">
      {/* Breathing Background Effect - Positioned in header area but behind everything */}
      <div className="absolute top-0 left-0 right-0 h-[600px] pointer-events-none overflow-visible z-0">
        {/* Animated breathing circles */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/40 dark:bg-primary/10 rounded-full blur-3xl animate-breathing" />
        <div className="absolute top-32 right-1/4 w-96 h-96 bg-blue-500/35 dark:bg-secondary/10 rounded-full blur-3xl animate-breathing-delayed" />
        <div className="absolute top-64 left-1/2 w-96 h-96 bg-blue-300/30 dark:bg-primary/5 rounded-full blur-3xl animate-breathing-slow" />
      </div>

      {/* Mobile Search Modal */}
      {showMobileSearch && (
        <div className="lg:hidden fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl animate-fadeIn">
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-border">
              <h2 className="text-xl font-bold">Buscar y Filtrar</h2>
              <button
                onClick={onCloseMobileSearch}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Search and Filters Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Search Bar */}
              <div>
                <label className="text-sm font-medium mb-2 block">Buscar</label>
                <SearchBar
                  placeholder={Strings.searchPlaceholder}
                  value={searchQuery}
                  onChange={setSearchQuery}
                />
              </div>

              {/* Categories */}
              <div>
                <label className="text-sm font-medium mb-3 block">Categorías</label>
                <FiltersTabs
                  filters={getPropertyFilters(Strings)}
                  selectedFilter={selectedFilter}
                  onFilterChange={setSelectedFilter}
                />
              </div>
            </div>

            {/* Apply Button */}
            <div className="p-4 border-t border-border">
              <button
                onClick={onCloseMobileSearch}
                className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
              >
                Aplicar ({filteredProperties.length} propiedades)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <MarketplaceHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filters={getPropertyFilters(Strings)}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        Strings={Strings}
      />

      {/* Sticky Filter Tabs - Desktop Only (hidden when scrolled, shown in navbar) */}
      <div className={`hidden lg:block sticky top-0 z-40 w-full transition-opacity duration-300 bg-transparent ${
        isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 py-4 bg-transparent">
          <FiltersTabs
            filters={getPropertyFilters(Strings)}
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
          />
        </div>
      </div>

      {/* Properties Grid Section */}
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 py-12">
        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <Spinner size="lg" />
            <span className="ml-3 text-muted-foreground">Cargando propiedades...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
              <Home className="w-8 h-8 text-destructive" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Error al cargar propiedades
            </h3>
            <p className="text-muted-foreground max-w-sm mx-auto mb-4">
              No se pudieron cargar las propiedades. Por favor intenta nuevamente.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              Recargar
            </button>
          </div>
        )}

        {/* Properties Grid */}
        {!isLoading && !error && filteredProperties.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property, index) => (
              <ScrollRevealItem
                key={property.id}
                index={index}
                staggerDelay={0.1}
                duration={0.6}
                distance={60}
              >
                <PropertyCard
                  property={property}
                  onViewDetails={handleViewDetails}
                />
              </ScrollRevealItem>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredProperties.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <Home className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {Strings.noPropertiesFound}
            </h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              {searchQuery
                ? Strings.tryOtherSearch
                : Strings.noPropertiesMessage
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
