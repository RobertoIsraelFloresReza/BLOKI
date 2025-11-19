import { useState } from 'react'
import { Home, Building2, Hotel, Warehouse, TrendingUp } from 'lucide-react'
import { SearchBar } from '@/components/marketplace/SearchBar'
import { FiltersTabs } from '@/components/marketplace/FiltersTabs'
import { PropertyCard } from '@/components/marketplace/PropertyCard'

/**
 * Marketplace Page
 * Main landing page with property listings
 * Features: Search, Category filters, Property grid
 * Follows Nielsen's heuristics and Cupertino design
 */

// Mock data - Property categories
const PROPERTY_FILTERS = [
  {
    id: 'all',
    name: 'Todas',
    icon: <TrendingUp className="w-5 h-5" />,
    count: 12
  },
  {
    id: 'houses',
    name: 'Casas',
    icon: <Home className="w-5 h-5" />,
    count: 5
  },
  {
    id: 'apartments',
    name: 'Apartamentos',
    icon: <Building2 className="w-5 h-5" />,
    count: 4
  },
  {
    id: 'hotels',
    name: 'Hoteles',
    icon: <Hotel className="w-5 h-5" />,
    count: 2
  },
  {
    id: 'commercial',
    name: 'Comercial',
    icon: <Warehouse className="w-5 h-5" />,
    count: 1
  }
]

// Mock data - Properties
const MOCK_PROPERTIES = [
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

export function Marketplace() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')

  // Filter properties based on search and category
  const filteredProperties = MOCK_PROPERTIES.filter(property => {
    // Filter by category
    const matchesCategory = selectedFilter === 'all' || property.category === selectedFilter

    // Filter by search query (title or location)
    const matchesSearch =
      searchQuery === '' ||
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-gradient-to-b from-accent/30 to-transparent border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-3">
              Marketplace de Propiedades
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Invierte en propiedades tokenizadas en la blockchain de Stellar.
              Diversifica tu portafolio con fracciones de bienes raíces premium.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <SearchBar
              placeholder="Buscar propiedades, ubicaciones..."
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>

          {/* Filter Tabs */}
          <FiltersTabs
            filters={PROPERTY_FILTERS}
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
          />
        </div>
      </div>

      {/* Properties Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            {filteredProperties.length === 0
              ? 'No se encontraron propiedades'
              : `${filteredProperties.length} ${filteredProperties.length === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}`
            }
          </p>
        </div>

        {/* Properties Grid */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <Home className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No hay propiedades disponibles
            </h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              {searchQuery
                ? 'Intenta con otros términos de búsqueda o cambia los filtros.'
                : 'No hay propiedades que coincidan con tus criterios de búsqueda.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
