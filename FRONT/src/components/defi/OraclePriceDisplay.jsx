import { Card, CardContent } from '@/components/ui'
import { useOracle } from '@/hooks'
import { TrendingUp, Loader2 } from 'lucide-react'
import { useStrings } from '@/utils/localizations/useStrings'

export function OraclePriceDisplay({ asset = 'XLM' }) {
  const { usePrice } = useOracle()
  const { data: priceData, isLoading, error } = usePrice(asset)
  const Strings = useStrings()

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4 flex items-center justify-center min-h-[100px]">
          <Loader2 className="w-6 h-6 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">{asset}/{Strings.assetUSD || 'USD'}</p>
            <p className="text-sm text-red-500 mt-2">{Strings.failedToLoad}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{asset}/{Strings.assetUSD || 'USD'}</p>
            <p className="text-2xl font-bold">
              ${priceData?.price ? parseFloat(priceData.price).toFixed(4) : '0.0000'}
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-sm text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span>{Strings.live}</span>
            </div>
            {priceData?.confidence && (
              <p className="text-xs text-muted-foreground mt-1">
                {Strings.confidence}: {priceData.confidence}%
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
