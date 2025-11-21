import { useState } from 'react'
import { ArrowLeft, LayoutGrid, Table2 } from 'lucide-react'
import { Button } from '@/components/ui'
import { TransactionTable } from './TransactionTable'
import { TransactionCards } from './TransactionCards'
import { useStrings } from '@/utils/localizations/useStrings'

/**
 * AllTransactions Component
 * Full view of all transactions with toggle between table and card views
 * Modern interface with view switcher
 */
export function AllTransactions({ transactions = [], onBack }) {
  const [viewMode, setViewMode] = useState('table') // 'table' or 'cards'
  const Strings = useStrings()

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={onBack}
            className="gap-2 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Button>

          {/* Title & View Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {Strings.transactionHistory || 'Historial de Transacciones'}
              </h1>
              <p className="text-muted-foreground">
                {transactions.length} {transactions.length === 1 ? 'transacción' : 'transacciones'} en total
              </p>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 p-1 rounded-xl bg-muted/50 border border-border">
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'table'
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Table2 className="w-4 h-4" />
                <span className="hidden sm:inline">Tabla</span>
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'cards'
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Cards</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {viewMode === 'table' ? (
          <div className="bg-card rounded-xl border border-border p-6">
            <TransactionTable transactions={transactions} />
          </div>
        ) : (
          <TransactionCards transactions={transactions} />
        )}
      </div>
    </div>
  )
}
