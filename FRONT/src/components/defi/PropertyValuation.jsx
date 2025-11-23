import { Card, CardContent } from '@/components/ui'
import { useOracle } from '@/hooks'
import { Building2, Loader2 } from 'lucide-react'
import { useStrings } from '@/utils/localizations/useStrings'

export function PropertyValuation({ propertyId, sqft, location }) {
  const { useValuation } = useOracle()
  const Strings = useStrings()

  // Location multipliers (100 = 1.0x)
  const locationMultipliers = {
    'New York': 150,
    'San Francisco': 140,
    'Miami': 120,
    'Los Angeles': 130,
    'Chicago': 110,
    'Default': 100,
  }

  const getMultiplier = (loc) => {
    if (!loc) return 100

    // Check if location contains any of the keys
    for (const [key, value] of Object.entries(locationMultipliers)) {
      if (loc.toLowerCase().includes(key.toLowerCase())) {
        return value
      }
    }

    return locationMultipliers['Default']
  }

  const multiplier = getMultiplier(location)

  const { data, isLoading, error } = useValuation(
    propertyId,
    sqft,
    multiplier
  )

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4 flex items-center justify-center min-h-[120px]">
          <Loader2 className="w-6 h-6 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Building2 className="w-8 h-8 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">{Strings.oracleValuation}</p>
              <p className="text-sm text-red-500 mt-1">{Strings.failedToLoadValuation}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const valuation = data?.valuation || 0
  const displayValue = valuation > 0 ? (valuation / 1e7).toLocaleString() : '0'

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Building2 className="w-8 h-8 text-primary" />
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">{Strings.oracleValuation}</p>
            <p className="text-2xl font-bold">
              ${displayValue}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {sqft ? `${sqft.toLocaleString()} ${Strings.sqft}` : Strings.na} {Strings.in} {location || Strings.unknown}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
