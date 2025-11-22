import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Award, Star, Building2, MapPin, Mail, Phone, Globe, CheckCircle, Calendar } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Spinner } from '@/components/ui'
import { PropertyCard } from '@/components/properties/PropertyCard'
import { useEvaluator } from '@/hooks'

/**
 * EvaluatorProfile
 * Detailed profile page for a specific evaluator
 * Shows credentials, statistics, and property history
 * Provides transparency for fraud prevention
 */

export function EvaluatorProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { evaluator, isLoading, error } = useEvaluator(id)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pb-20">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-muted-foreground">Cargando perfil del evaluador...</p>
        </div>
      </div>
    )
  }

  if (error || !evaluator) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pb-20">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
            <Award className="w-8 h-8 text-destructive" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Evaluador no encontrado
          </h3>
          <p className="text-muted-foreground mb-4">
            {error?.message || 'No se pudo cargar la información del evaluador'}
          </p>
          <Button onClick={() => navigate('/evaluators')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Evaluadores
          </Button>
        </div>
      </div>
    )
  }

  const certifications = evaluator.certifications ? JSON.parse(evaluator.certifications) : []
  const properties = evaluator.properties || []

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/evaluators')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Evaluadores
          </Button>

          {/* Evaluator Header */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Logo */}
            {evaluator.logo ? (
              <img
                src={evaluator.logo}
                alt={evaluator.name}
                className="w-32 h-32 rounded-xl object-cover border-2 border-border"
              />
            ) : (
              <div className="w-32 h-32 rounded-xl bg-primary/10 flex items-center justify-center border-2 border-border">
                <Award className="w-16 h-16 text-primary" />
              </div>
            )}

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-foreground">{evaluator.name}</h1>
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0" />
                <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">
                  Certificado por Blocki
                </Badge>
              </div>

              {evaluator.country && (
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <MapPin className="w-4 h-4" />
                  {evaluator.country}
                </div>
              )}

              {evaluator.description && (
                <p className="text-muted-foreground mb-4 max-w-3xl">
                  {evaluator.description}
                </p>
              )}

              {/* Contact Info */}
              <div className="flex flex-wrap gap-4 text-sm">
                {evaluator.email && (
                  <a
                    href={`mailto:${evaluator.email}`}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    {evaluator.email}
                  </a>
                )}
                {evaluator.phone && (
                  <a
                    href={`tel:${evaluator.phone}`}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    {evaluator.phone}
                  </a>
                )}
                {evaluator.website && (
                  <a
                    href={evaluator.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    {evaluator.website}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - Stats & Certifications */}
          <div className="lg:col-span-1 space-y-6">
            {/* Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Estadísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold">{evaluator.rating || 5.0}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Propiedades Evaluadas</span>
                  <span className="font-semibold">{evaluator.propertiesEvaluated || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Miembro desde</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-muted-foreground" />
                    <span className="text-sm font-semibold">
                      {new Date(evaluator.createdAt).getFullYear()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Certifications */}
            {certifications.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Certificaciones</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {certifications.map((cert, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 rounded-lg bg-accent/50"
                      >
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-sm">{cert}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content - Property History */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Historial de Propiedades Evaluadas
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  Todas las propiedades certificadas por este evaluador
                </p>
              </CardHeader>
              <CardContent>
                {properties.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6">
                    {properties.map((property) => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        onViewDetails={() => navigate(`/property/${property.id}`)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                      <Building2 className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">
                      Este evaluador aún no ha certificado propiedades en la plataforma
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
