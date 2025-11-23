import { useState } from 'react'
import { CheckCircle, ExternalLink, Copy, Check } from 'lucide-react'
import { Button, Card, CardContent } from '@/components/ui'
import { useStrings } from '@/utils/localizations/useStrings'

/**
 * PurchaseReceipt Component
 * Minimal receipt that replaces the purchase card after successful purchase
 */
export function PurchaseReceipt({ purchaseResult, property, onViewWallet }) {
  const Strings = useStrings()
  const [copied, setCopied] = useState(false)

  const handleCopyHash = (hash) => {
    navigator.clipboard.writeText(hash)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="border-2 border-green-500/20 shadow-md">
      <CardContent className="pt-6 pb-6 space-y-4">
        {/* Success Icon & Title */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/30">
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-green-600 dark:text-green-400">
              {Strings.purchaseSuccessful || 'Purchase Successful'}
            </h3>
            <p className="text-xs text-muted-foreground">Stellar Network</p>
          </div>
        </div>

        {/* Summary - Compact */}
        <div className="bg-muted/30 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Tokens</span>
            <span className="text-lg font-bold">{purchaseResult.tokens}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{Strings.ownership || 'Ownership'}</span>
            <span className="text-lg font-bold text-primary">{purchaseResult.ownershipPercentage}%</span>
          </div>
        </div>

        {/* Transaction Hash - Compact */}
        <div className="flex items-center gap-2">
          <code className="flex-1 text-xs font-mono bg-muted px-2 py-1.5 rounded truncate">
            {purchaseResult.transactionId}
          </code>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleCopyHash(purchaseResult.transactionId)}
            className="shrink-0 h-7 w-7 p-0"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
          </Button>
          <a
            href={`https://stellar.expert/explorer/testnet/tx/${purchaseResult.transactionId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0"
          >
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              <ExternalLink className="w-3.5 h-3.5" />
            </Button>
          </a>
        </div>

        {/* Action */}
        <Button
          className="w-full"
          onClick={onViewWallet}
        >
          {Strings.viewWallet || 'View Wallet'}
        </Button>
      </CardContent>
    </Card>
  )
}
