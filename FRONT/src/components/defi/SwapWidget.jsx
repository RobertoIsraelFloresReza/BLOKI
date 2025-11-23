import { useState } from 'react'
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { useSoroswap } from '@/hooks'
import { ArrowDownUp, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks'
import { useStrings } from '@/utils/localizations/useStrings'

const USDC_TOKEN = 'CBBHRKEP5M3NUDRISGLJKGHDHX3DA2CN2AZBQY6WLVUJ7VNLGSKBDUCM'

export function SwapWidget({ propertyToken, propertyName }) {
  const [amountIn, setAmountIn] = useState('')
  const { user } = useAuth()
  const { useSwapQuote, useExecuteSwap } = useSoroswap()
  const Strings = useStrings()

  const { data: quote, isLoading } = useSwapQuote(
    propertyToken,
    USDC_TOKEN,
    amountIn,
    parseFloat(amountIn) > 0
  )

  const { mutate: executeSwap, isPending: isSwapping } = useExecuteSwap()

  const handleSwap = () => {
    if (!quote || !user?.walletAddress) return

    const minOut = parseFloat(quote.amountOut) * 0.99 // 1% slippage tolerance

    executeSwap({
      seller: user.walletAddress,
      propertyToken,
      usdcToken: USDC_TOKEN,
      amountIn: amountIn.toString(),
      minUsdcOut: minOut.toString()
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowDownUp className="w-5 h-5" />
          {Strings.instantSwapToUSDC}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm text-muted-foreground">{Strings.youPay}</label>
          <div className="flex items-center gap-2 mt-1">
            <Input
              type="number"
              value={amountIn}
              onChange={(e) => setAmountIn(e.target.value)}
              placeholder="0.00"
              className="flex-1"
              min="0"
              step="0.01"
            />
            <span className="text-sm font-medium whitespace-nowrap">{propertyName || 'Property'} {Strings.tokens || 'Tokens'}</span>
          </div>
        </div>

        <div className="flex justify-center">
          <ArrowDownUp className="w-6 h-6 text-muted-foreground" />
        </div>

        <div>
          <label className="text-sm text-muted-foreground">{Strings.youReceive}</label>
          <div className="flex items-center gap-2 mt-1 p-3 bg-muted rounded-lg">
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span className="text-2xl font-bold">
                  {quote?.amountOut ? parseFloat(quote.amountOut).toFixed(2) : '0.00'}
                </span>
                <span className="text-sm font-medium">USDC</span>
              </>
            )}
          </div>
        </div>

        {quote && (
          <div className="text-xs text-muted-foreground space-y-1">
            <div className="flex justify-between">
              <span>{Strings.priceImpact}:</span>
              <span>{quote.priceImpact || '0.00'}%</span>
            </div>
            {quote.path && (
              <div className="flex justify-between">
                <span>{Strings.route}:</span>
                <span className="text-right">{quote.path.join(' → ')}</span>
              </div>
            )}
          </div>
        )}

        <Button
          onClick={handleSwap}
          disabled={!quote || isSwapping || parseFloat(amountIn) <= 0 || !user}
          className="w-full"
        >
          {isSwapping ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {Strings.swapping}
            </>
          ) : !user ? (
            Strings.connectWallet
          ) : (
            Strings.swapNow
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
