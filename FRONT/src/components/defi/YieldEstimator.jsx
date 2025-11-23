import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, Input, Label } from '@/components/ui'
import { useDeFindex } from '@/hooks'
import { Coins, Loader2 } from 'lucide-react'
import { useStrings } from '@/utils/localizations/useStrings'

export function YieldEstimator({ defaultAmount = 1000 }) {
  const [amount, setAmount] = useState(defaultAmount)
  const [duration, setDuration] = useState(30)
  const { useYieldEstimate } = useDeFindex()
  const Strings = useStrings()

  const { data: estimate, isLoading, error } = useYieldEstimate(
    amount,
    duration,
    amount > 0 && duration > 0
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="w-5 h-5" />
          {Strings.yieldEstimation}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="amount">{Strings.amountUSDC}</Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            placeholder="1000"
            min="0"
            step="100"
          />
        </div>

        <div>
          <Label htmlFor="duration">{Strings.durationDays}</Label>
          <Input
            id="duration"
            type="number"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
            placeholder="30"
            min="1"
            step="1"
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center text-sm text-red-500 py-4">
            {Strings.failedToEstimateYield}
          </div>
        ) : estimate ? (
          <div className="space-y-3 pt-4 border-t">
            <div className="flex justify-between">
              <span className="text-sm">{Strings.apy}:</span>
              <span className="font-bold text-green-600">
                {estimate.apy ? parseFloat(estimate.apy).toFixed(2) : '0.00'}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">{Strings.totalYield}:</span>
              <span className="font-medium">
                ${estimate.estimatedYield ? parseFloat(estimate.estimatedYield).toFixed(2) : '0.00'}
              </span>
            </div>
            <div className="text-xs space-y-1 text-muted-foreground">
              <div className="flex justify-between">
                <span>{Strings.sellerShare}:</span>
                <span>
                  ${estimate.sellerYield ? parseFloat(estimate.sellerYield).toFixed(2) : '0.00'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{Strings.buyerShare}:</span>
                <span>
                  ${estimate.buyerYield ? parseFloat(estimate.buyerYield).toFixed(2) : '0.00'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{Strings.protocolShare}:</span>
                <span>
                  ${estimate.protocolYield ? parseFloat(estimate.protocolYield).toFixed(2) : '0.00'}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-sm text-muted-foreground py-4">
            {Strings.enterAmountDuration}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
