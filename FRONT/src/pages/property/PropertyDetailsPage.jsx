import { useParams, useNavigate } from 'react-router-dom'
import { useProperty } from '@/hooks/useProperties'
import { PropertyDetails } from './PropertyDetails'
import { Button } from '@/components/ui'
import { ArrowLeft } from 'lucide-react'

/**
 * PropertyDetailsPage Wrapper
 * Loads property from backend using URL parameter
 * Wraps the PropertyDetails component with data fetching
 */
export function PropertyDetailsPage({ user }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: propertyResponse, isLoading, error } = useProperty(id)

  // Handle loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Cargando propiedad...</p>
        </div>
      </div>
    )
  }

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Error al cargar propiedad</h2>
          <p className="text-muted-foreground">
            {error.response?.data?.message || error.message || 'No se pudo cargar la propiedad'}
          </p>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Marketplace
          </Button>
        </div>
      </div>
    )
  }

  // Extract property from response (handle different response formats)
  const property = propertyResponse?.data || propertyResponse

  // Handle property not found
  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Propiedad no encontrada</h2>
          <p className="text-muted-foreground">
            La propiedad que buscas no existe o fue eliminada
          </p>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Marketplace
          </Button>
        </div>
      </div>
    )
  }

  return (
    <PropertyDetails
      property={property}
      user={user}
      onBack={() => navigate('/')}
    />
  )
}
