import { ArrowDownLeft, ArrowUpRight, ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui'
import { useStrings } from '@/utils/localizations/useStrings'

/**
 * TransactionTable Component
 * Table view for all transactions
 * Modern, responsive table with hover effects
 */
export function TransactionTable({ transactions = [] }) {
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
    return `${address.slice(0, 6)}...${address.slice(-6)}`
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{Strings.noTransactions || 'No hay transacciones'}</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        {/* Table Header */}
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-4 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Tipo
            </th>
            <th className="text-left py-4 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Activo
            </th>
            <th className="text-right py-4 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Cantidad
            </th>
            <th className="text-right py-4 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Valor USDC
            </th>
            <th className="text-left py-4 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Estado
            </th>
            <th className="text-left py-4 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Fecha
            </th>
            <th className="text-left py-4 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              De/Para
            </th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {transactions.map((tx, index) => (
            <tr
              key={tx.id}
              className="border-b border-border hover:bg-accent/30 transition-colors group"
            >
              {/* Type */}
              <td className="py-4 px-4">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-full ${
                    tx.type === 'received'
                      ? 'bg-green-500/10 text-green-500'
                      : 'bg-blue-500/10 text-blue-500'
                  }`}>
                    {tx.type === 'received' ? (
                      <ArrowDownLeft className="w-3 h-3" />
                    ) : (
                      <ArrowUpRight className="w-3 h-3" />
                    )}
                  </div>
                  <span className="text-sm font-medium capitalize">
                    {tx.type === 'received' ? 'Recibido' : 'Enviado'}
                  </span>
                </div>
              </td>

              {/* Asset */}
              <td className="py-4 px-4">
                <span className="text-sm font-mono font-medium">{tx.asset}</span>
              </td>

              {/* Amount */}
              <td className="py-4 px-4 text-right">
                <span className="text-sm font-semibold">
                  {tx.type === 'received' ? '+' : '-'}{tx.amount.toLocaleString()}
                </span>
              </td>

              {/* Value USDC */}
              <td className="py-4 px-4 text-right">
                <span className="text-sm text-muted-foreground">
                  ${tx.valueUSDC.toLocaleString()}
                </span>
              </td>

              {/* Status */}
              <td className="py-4 px-4">
                <Badge
                  variant={tx.status === 'completed' ? 'default' : tx.status === 'pending' ? 'secondary' : 'outline'}
                  className="text-xs"
                >
                  {tx.status === 'completed' ? 'Completado' : tx.status === 'pending' ? 'Pendiente' : 'Fallido'}
                </Badge>
              </td>

              {/* Date */}
              <td className="py-4 px-4">
                <span className="text-xs text-muted-foreground">
                  {formatDate(tx.timestamp)}
                </span>
              </td>

              {/* From/To */}
              <td className="py-4 px-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-muted-foreground">
                    {formatAddress(tx.from || tx.to)}
                  </span>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="w-3 h-3 text-muted-foreground hover:text-primary" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
