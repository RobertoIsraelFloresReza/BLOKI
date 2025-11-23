import { ArrowDownLeft, ArrowUpRight, ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui'
import { useStrings } from '@/utils/localizations/useStrings'

/**
 * TransactionCards Component
 * Card/grid view for all transactions
 * Mobile-friendly alternative to table view
 */
export function TransactionCards({ transactions = [] }) {
  const Strings = useStrings()

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatAddress = (address) => {
    if (!address) return '-'
    return `${address.slice(0, 8)}...${address.slice(-8)}`
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{Strings.noTransactions}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {transactions.map((tx) => (
        <div
          key={tx.id}
          className="p-4 rounded-xl border border-border hover:border-primary/50 hover:shadow-md transition-all duration-200 bg-card group"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-full ${
                tx.type === 'received'
                  ? 'bg-green-500/10 text-green-500'
                  : 'bg-blue-500/10 text-blue-500'
              }`}>
                {tx.type === 'received' ? (
                  <ArrowDownLeft className="w-4 h-4" />
                ) : (
                  <ArrowUpRight className="w-4 h-4" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold capitalize">
                  {tx.type === 'received' ? Strings.received : Strings.sent}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(tx.timestamp)}
                </p>
              </div>
            </div>

            <Badge
              variant={tx.status === 'completed' ? 'default' : tx.status === 'pending' ? 'secondary' : 'outline'}
              className="text-xs"
            >
              {tx.status === 'completed' ? Strings.completed : tx.status === 'pending' ? Strings.pending : Strings.failed}
            </Badge>
          </div>

          {/* Divider */}
          <div className="h-px bg-border my-3" />

          {/* Amount & Asset */}
          <div className="space-y-2 mb-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{Strings.asset}</span>
              <span className="text-sm font-mono font-medium">{tx.asset}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{Strings.amount}</span>
              <span className="text-lg font-bold">
                {tx.type === 'received' ? '+' : '-'}{tx.amount.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{Strings.value}</span>
              <span className="text-sm font-semibold text-muted-foreground">
                ${tx.valueUSDC.toLocaleString()} USDC
              </span>
            </div>
          </div>

          {/* Address */}
          <div className="pt-3 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {tx.type === 'received' ? `${Strings.from}:` : `${Strings.to}:`}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-muted-foreground">
                  {formatAddress(tx.from || tx.to)}
                </span>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="w-3 h-3 text-muted-foreground hover:text-primary" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
