import { useState } from 'react'
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownLeft, Clock, Copy, CheckCircle, RefreshCw, Send, Download } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from '@/components/ui'
import { useStrings } from '@/utils/localizations/useStrings'
import { AllTransactions } from '@/components/wallet'

/**
 * WalletPage Component
 * Wallet interface similar to Bitso but oriented to property tokens
 * Shows: Total balance, property tokens, recent transactions
 */
export function WalletPage({ user }) {
  const [copied, setCopied] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [showAllTransactions, setShowAllTransactions] = useState(false)
  const Strings = useStrings()

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">{Strings.error}</h2>
          <p className="text-muted-foreground">{Strings.somethingWentWrong}</p>
        </div>
      </div>
    )
  }

  // Mock wallet data - would come from Stellar blockchain via backend
  const mockBalance = {
    totalUSDC: 12500.50,
    availableUSDC: 10200.30,
    lockedUSDC: 2300.20
  }

  const mockTokens = [
    {
      propertyId: '1',
      propertyName: 'Casa Moderna Miami Beach',
      tokenSymbol: 'PROP001',
      balance: 500,
      valuePerToken: 1000,
      totalValue: 500000,
      change24h: 2.5
    },
    {
      propertyId: '2',
      propertyName: 'Apartamento Luxury Manhattan',
      tokenSymbol: 'PROP002',
      balance: 300,
      valuePerToken: 1000,
      totalValue: 300000,
      change24h: -1.2
    },
    {
      propertyId: '3',
      propertyName: 'Hotel Boutique Los Angeles',
      tokenSymbol: 'PROP003',
      balance: 150,
      valuePerToken: 1000,
      totalValue: 150000,
      change24h: 5.8
    }
  ]

  const mockTransactions = [
    {
      id: 'TX001',
      type: 'received',
      asset: 'PROP001',
      amount: 50,
      valueUSDC: 50000,
      timestamp: new Date('2025-01-18T10:30:00'),
      status: 'completed',
      from: 'GABC...XYZ123'
    },
    {
      id: 'TX002',
      type: 'sent',
      asset: 'USDC',
      amount: 5000,
      valueUSDC: 5000,
      timestamp: new Date('2025-01-17T15:45:00'),
      status: 'completed',
      to: 'GDEF...ABC456'
    },
    {
      id: 'TX003',
      type: 'received',
      asset: 'PROP002',
      amount: 100,
      valueUSDC: 100000,
      timestamp: new Date('2025-01-16T09:15:00'),
      status: 'completed',
      from: 'GHIJ...DEF789'
    },
    {
      id: 'TX004',
      type: 'sent',
      asset: 'PROP003',
      amount: 25,
      valueUSDC: 25000,
      timestamp: new Date('2025-01-15T14:20:00'),
      status: 'pending',
      to: 'GKLM...GHI012'
    }
  ]

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(user.walletAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRefresh = () => {
    setRefreshing(true)
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false)
    }, 1500)
  }

  const formatDate = (date) => {
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))

    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Show AllTransactions view if requested
  if (showAllTransactions) {
    return (
      <AllTransactions
        transactions={mockTransactions}
        onBack={() => setShowAllTransactions(false)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header Section */}
      <div className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-3">{Strings.myWallet}</h1>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-sm text-muted-foreground font-mono break-all">{user.walletAddress}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyAddress}
                className="gap-2"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copiar
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Balance & Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Total Balance Card */}
            <Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-transparent">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">{Strings.totalBalance}</p>
                    <div className="flex items-baseline gap-3">
                      <h2 className="text-5xl font-bold">${mockBalance.totalUSDC.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h2>
                      <span className="text-lg text-muted-foreground">USDC</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-primary/10">
                    <Wallet className="w-8 h-8 text-primary" />
                  </div>
                </div>

                {/* Balance Breakdown */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-background/50 border border-border">
                    <p className="text-xs text-muted-foreground mb-1">{Strings.availableBalance}</p>
                    <p className="text-lg font-bold">${mockBalance.availableUSDC.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-background/50 border border-border">
                    <p className="text-xs text-muted-foreground mb-1">Locked in Properties</p>
                    <p className="text-lg font-bold">${mockBalance.lockedUSDC.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-4">
              <Button className="h-auto py-4 flex flex-col gap-2" variant="outline">
                <Download className="w-5 h-5" />
                <span className="text-sm font-medium">{Strings.deposit}</span>
              </Button>
              <Button className="h-auto py-4 flex flex-col gap-2" variant="outline">
                <Send className="w-5 h-5" />
                <span className="text-sm font-medium">{Strings.send}</span>
              </Button>
              <Button className="h-auto py-4 flex flex-col gap-2" variant="outline">
                <ArrowDownLeft className="w-5 h-5" />
                <span className="text-sm font-medium">{Strings.receive}</span>
              </Button>
            </div>

            {/* Property Tokens */}
            <Card className="border-0 shadow-none bg-transparent">
              <CardHeader className="px-0">
                <div className="flex items-center justify-between">
                  <CardTitle>{Strings.myInvestments}</CardTitle>
                  <Badge variant="outline">{mockTokens.length} {Strings.assets}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-0 px-0">
                {mockTokens.map((token, index) => (
                  <div
                    key={token.propertyId}
                    className={`p-4 bg-card hover:bg-accent/50 transition-all cursor-pointer ${
                      index === 0 ? 'rounded-t-xl' : ''
                    } ${
                      index === mockTokens.length - 1 ? 'rounded-b-xl' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <TrendingUp className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">{token.propertyName}</p>
                          <p className="text-xs text-muted-foreground">{token.tokenSymbol}</p>
                        </div>
                      </div>
                      <div className={`flex items-center gap-1 text-sm font-medium ${
                        token.change24h >= 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {token.change24h >= 0 ? '+' : ''}{token.change24h}%
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <p className="text-muted-foreground">{Strings.balance}</p>
                        <p className="font-bold">{token.balance.toLocaleString()} tokens</p>
                      </div>
                      <div className="text-right">
                        <p className="text-muted-foreground">{Strings.estimatedValue}</p>
                        <p className="font-bold">${token.totalValue.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Recent Transactions */}
          <div className="lg:col-span-1">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  {Strings.recentTransactions}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockTransactions.length > 0 ? (
                  <div className="relative space-y-3">
                    {/* First 3 transactions */}
                    {mockTransactions.slice(0, 3).map((tx) => (
                      <div
                        key={tx.id}
                        className="p-3 rounded-lg border border-transparent hover:border-primary/50 hover:bg-accent/50 transition-all"
                      >
                        <div className="flex items-start gap-3 mb-2">
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
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-semibold capitalize">{tx.type}</p>
                              <Badge
                                variant={tx.status === 'completed' ? 'default' : 'outline'}
                                className="text-xs"
                              >
                                {Strings[tx.status] || tx.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">{formatDate(tx.timestamp)}</p>
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-mono font-medium">{tx.amount} {tx.asset}</p>
                              <p className="text-xs text-muted-foreground">${tx.valueUSDC.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* 4th transaction - partially visible with fade */}
                    {mockTransactions[3] && (
                      <div className="relative">
                        {/* Gradient overlay for fade effect */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent from-40% via-background/60 via-70% to-background z-10 pointer-events-none" />

                        {/* Partial 4th transaction */}
                        <div className="opacity-60">
                          <div className="p-3 rounded-lg border border-transparent">
                            <div className="flex items-start gap-3 mb-2">
                              <div className={`p-2 rounded-full ${
                                mockTransactions[3].type === 'received'
                                  ? 'bg-green-500/10 text-green-500'
                                  : 'bg-blue-500/10 text-blue-500'
                              }`}>
                                {mockTransactions[3].type === 'received' ? (
                                  <ArrowDownLeft className="w-3 h-3" />
                                ) : (
                                  <ArrowUpRight className="w-3 h-3" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <p className="text-sm font-semibold capitalize">{mockTransactions[3].type}</p>
                                  <Badge
                                    variant={mockTransactions[3].status === 'completed' ? 'default' : 'outline'}
                                    className="text-xs"
                                  >
                                    {Strings[mockTransactions[3].status] || mockTransactions[3].status}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mb-2">{formatDate(mockTransactions[3].timestamp)}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <Clock className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">{Strings.noTransactions}</p>
                  </div>
                )}

                {mockTransactions.length > 0 && (
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    size="sm"
                    onClick={() => setShowAllTransactions(true)}
                  >
                    {Strings.loadMore}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
