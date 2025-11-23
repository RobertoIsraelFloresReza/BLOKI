import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Award, Star, MapPin, Mail, Globe, CheckCircle } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, Badge, Spinner, AnimatedText, ScrollReveal } from '@/components/ui'
import { SearchBar } from '@/components/marketplace/SearchBar'
import { useEvaluators } from '@/hooks'
import { useStrings } from '@/utils/localizations/useStrings'

/**
 * EvaluatorsPage
 * Public page showing all certified property evaluators
 */

export function EvaluatorsPage() {
  console.log('✅ EvaluatorsPage component is MOUNTING!')

  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const Strings = useStrings()
  const { evaluators = [], isLoading, error } = useEvaluators(true)

  console.log('🔍 EvaluatorsPage RENDERED!')
  console.log('🔍 evaluators:', evaluators)
  console.log('🔍 evaluators type:', typeof evaluators)
  console.log('🔍 evaluators is array:', Array.isArray(evaluators))
  console.log('🔍 isLoading:', isLoading)
  console.log('🔍 error:', error)

  // Ensure evaluators is always an array
  const safeEvaluators = Array.isArray(evaluators) ? evaluators : []

  // Filter evaluators by search query
  const filteredEvaluators = safeEvaluators.filter(evaluator => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      evaluator.name?.toLowerCase().includes(query) ||
      evaluator.description?.toLowerCase().includes(query) ||
      evaluator.country?.toLowerCase().includes(query)
    )
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-primary/[0.01] to-background pb-20">
      {/* Clean Professional Header */}
      <div className="relative py-8 md:py-10 lg:py-12 border-b border-border/40">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 relative z-10">
          {/* Title Section */}
          <div className="text-center mb-8">
            <h1 className="font-open-sans font-extrabold mb-4 leading-none">
              <div className="text-4xl md:text-5xl lg:text-6xl mb-2">
                <AnimatedText
                  text={Strings.evaluatorsTitleLine1}
                  type="wave"
                  delay={0}
                />
              </div>
              <div className="text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient-x">
                <AnimatedText
                  text={Strings.evaluatorsTitleLine2}
                  type="wave"
                  delay={0.2}
                />
              </div>
            </h1>

            {/* Subtitle */}
            <ScrollReveal delay={0.6} duration={0.6}>
              <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto font-open-sans leading-snug">
                {Strings.evaluatorsDescription}
              </p>
            </ScrollReveal>
          </div>

          {/* Search Bar */}
          <ScrollReveal delay={0.4} duration={0.6}>
            <div className="max-w-2xl mx-auto">
              <SearchBar
                placeholder={Strings.searchEvaluators || 'Buscar evaluadores...'}
                value={searchQuery}
                onChange={setSearchQuery}
              />
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Evaluators List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col justify-center items-center py-20 gap-4">
            <div className="relative">
              <Spinner size="xl" variant="orbit" />
              <div className="absolute inset-0 -z-10 bg-primary/20 blur-2xl rounded-full animate-pulse" />
            </div>
            <p className="text-muted-foreground animate-pulse">
              {Strings.loadingEvaluators || 'Cargando evaluadores...'}
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
              <Award className="w-8 h-8 text-destructive" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {Strings.errorLoadingEvaluators || 'Error al cargar evaluadores'}
            </h3>
            <p className="text-muted-foreground">
              {error?.message || (Strings.errorLoadingEvaluatorsMessage || 'No se pudieron cargar los evaluadores')}
            </p>
          </div>
        )}

        {/* Evaluators Grid */}
        {!isLoading && !error && filteredEvaluators.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvaluators.map((evaluator) => {
              const certifications = evaluator.certifications
                ? (typeof evaluator.certifications === 'string'
                  ? JSON.parse(evaluator.certifications)
                  : evaluator.certifications)
                : []

              return (
                <Card
                  key={evaluator.id}
                  className="group hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer border-2 border-border/50 hover:border-primary/60 bg-card/90 backdrop-blur-sm overflow-hidden"
                  onClick={() => navigate(`/evaluators/${evaluator.id}`)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4">
                      {evaluator.logo ? (
                        <div className="relative">
                          <img
                            src={evaluator.logo}
                            alt={evaluator.name}
                            className="w-20 h-20 rounded-xl object-cover flex-shrink-0 ring-2 ring-primary/10 group-hover:ring-primary/30 transition-all shadow-md"
                          />
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 border-2 border-card flex items-center justify-center">
                            <CheckCircle className="w-3.5 h-3.5 text-white fill-green-500" />
                          </div>
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0 ring-2 ring-primary/10 shadow-md">
                          <Award className="w-10 h-10 text-primary" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2 mb-2">
                          <CardTitle className="text-lg font-bold line-clamp-2 group-hover:text-primary transition-colors">
                            {evaluator.name}
                          </CardTitle>
                        </div>
                        {evaluator.country && (
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <MapPin className="w-3.5 h-3.5" />
                            <span className="font-medium">{evaluator.country}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Description */}
                    {evaluator.description && (
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {evaluator.description}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-6 px-3 py-2.5 bg-accent/30 rounded-lg border border-border/50">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        </div>
                        <span className="text-base font-bold text-foreground">{evaluator.rating || 5.0}</span>
                      </div>
                      <div className="h-4 w-px bg-border" />
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span className="font-semibold text-foreground">{evaluator.propertiesEvaluated || 0}</span>
                        <span>{Strings.properties || 'propiedades'}</span>
                      </div>
                    </div>

                    {/* Certifications */}
                    {certifications.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {certifications.slice(0, 2).map((cert, index) => (
                          <Badge key={index} variant="secondary" className="text-xs font-medium px-3 py-1 bg-primary/10 text-primary border-primary/20">
                            {cert}
                          </Badge>
                        ))}
                        {certifications.length > 2 && (
                          <Badge variant="outline" className="text-xs font-medium px-3 py-1 border-primary/30 text-primary">
                            +{certifications.length - 2} {Strings.more || 'más'}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Contact Info */}
                    <div className="space-y-2.5 pt-3 border-t border-border/50">
                      {evaluator.email && (
                        <div className="flex items-center gap-2.5 text-xs group/email">
                          <div className="w-7 h-7 rounded-lg bg-primary/5 flex items-center justify-center flex-shrink-0 group-hover/email:bg-primary/10 transition-colors">
                            <Mail className="w-3.5 h-3.5 text-primary" />
                          </div>
                          <span className="truncate text-muted-foreground group-hover/email:text-foreground transition-colors font-medium">
                            {evaluator.email}
                          </span>
                        </div>
                      )}
                      {evaluator.website && (
                        <div className="flex items-center gap-2.5 text-xs group/web">
                          <div className="w-7 h-7 rounded-lg bg-secondary/5 flex items-center justify-center flex-shrink-0 group-hover/web:bg-secondary/10 transition-colors">
                            <Globe className="w-3.5 h-3.5 text-secondary" />
                          </div>
                          <span className="truncate text-muted-foreground group-hover/web:text-foreground transition-colors font-medium">
                            {evaluator.website}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredEvaluators.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <Award className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {Strings.noEvaluatorsFound || 'No se encontraron evaluadores'}
            </h3>
            <p className="text-muted-foreground">
              {searchQuery
                ? (Strings.tryOtherSearchTerms || 'Intenta con otros términos de búsqueda')
                : (Strings.noEvaluatorsYet || 'Aún no hay evaluadores certificados en la plataforma')
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
