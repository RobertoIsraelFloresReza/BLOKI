import { useState } from 'react'
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownLeft, Clock, Copy, CheckCircle, RefreshCw, Send, Download, AlertCircle } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Button,
  Spinner,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui'
import { useStrings } from '@/utils/localizations/useStrings'
import { AllTransactions } from '@/components/wallet'
import { useWalletBalance, useWalletTransactions } from '@/hooks/useWallet'
import { useQuery } from '@tanstack/react-query'
import { userService } from '@/services'

/**
 * WalletPage Component
 * Real-time wallet interface integrated with Stellar blockchain
 * Shows: Live balance, property tokens, transaction history from Horizon
 */
export function WalletPage({ user }) {
  const [copied, setCopied] = useState(false)
  const [showAllTransactions, setShowAllTransactions] = useState(false)
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [showSendModal, setShowSendModal] = useState(false)
  const [showReceiveModal, setShowReceiveModal] = useState(false)
  const [sendTo, setSendTo] = useState('')
  const [sendAmount, setSendAmount] = useState('')
  const Strings = useStrings()

  // Fetch real wallet balance from Stellar blockchain
  const {
    data: walletBalance,
    isLoading: isLoadingBalance,
    error: balanceError,
    refetch: refetchBalance,
  } = useWalletBalance(user?.walletAddress)

  // Fetch real transactions from Stellar blockchain
  const {
    data: transactionsData,
    isLoading: isLoadingTransactions,
    error: transactionsError,
  } = useWalletTransactions({ address: user?.walletAddress, page: 1, limit: 20 })

  // Fetch user portfolio (property tokens from backend)
  const {
    data: portfolioData,
    isLoading: isLoadingPortfolio,
  } = useQuery({
    queryKey: ['user', 'portfolio', user?.walletAddress],
    queryFn: () => userService.getPortfolio(user.walletAddress),
    enabled: !!user?.walletAddress,
    staleTime: 30 * 1000, // 30 seconds
  })

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

  // Loading state
  if (isLoadingBalance || isLoadingPortfolio) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Spinner size="xl" variant="orbit" />
            <div className="absolute inset-0 -z-10 bg-primary/20 blur-2xl rounded-full animate-pulse" />
          </div>
          <p className="text-muted-foreground animate-pulse">{Strings.loadingWalletData}</p>
        </div>
      </div>
    )
  }

  // Error state
  if (balanceError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
          <h2 className="text-2xl font-bold">{Strings.errorLoadingWallet}</h2>
          <p className="text-muted-foreground max-w-md">
            {balanceError.response?.data?.message || balanceError.message || Strings.couldNotLoadWalletInfo}
          </p>
          <Button onClick={() => refetchBalance()}>{Strings.retry}</Button>
        </div>
      </div>
    )
  }

  // Extract real data from API responses
  const usdcAsset = walletBalance?.assets?.find(a => a.assetCode === 'USDC') || { balance: '0' }
  const totalUSDC = parseFloat(usdcAsset.balance) || 0
  const nativeBalance = parseFloat(walletBalance?.nativeBalance || '0')

  // Portfolio data (ownerships = property tokens)
  const propertyTokens = portfolioData?.ownerships || []
  const totalInvested = parseFloat(portfolioData?.totalInvested || '0') / 10000000
  const currentValue = parseFloat(portfolioData?.currentValue || '0') / 10000000

  // Transactions from Stellar blockchain
  const transactions = transactionsData?.data || []

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(user.walletAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRefresh = async () => {
    await refetchBalance()
  }

  const handleDeposit = () => {
    setShowDepositModal(true)
  }

  const handleSend = () => {
    setShowSendModal(true)
  }

  const handleReceive = () => {
    setShowReceiveModal(true)
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
        transactions={transactions}
        onBack={() => setShowAllTransactions(false)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header Section */}
      <div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-3">{Strings.myWallet}</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="p-2 px-3 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-sm font-mono font-semibold text-primary">
                    #{Math.floor(100000 + Math.random() * 900000)}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyAddress}
                  className="gap-2"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      {Strings.copied}
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      {Strings.copy}
                    </>
                  )}
                </Button>
              </div>
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
                      <h2 className="text-5xl font-bold">${totalUSDC.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h2>
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
                    <p className="text-lg font-bold">${totalUSDC.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-background/50 border border-border">
                    <p className="text-xs text-muted-foreground mb-1">{Strings.portfolioValue}</p>
                    <p className="text-lg font-bold">${currentValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-4">
              <Button
                className="h-auto py-4 flex flex-col gap-2"
                variant="outline"
                onClick={handleDeposit}
              >
                <Download className="w-5 h-5" />
                <span className="text-sm font-medium">{Strings.deposit || 'Depositar'}</span>
              </Button>
              <Button
                className="h-auto py-4 flex flex-col gap-2"
                variant="outline"
                onClick={handleSend}
              >
                <Send className="w-5 h-5" />
                <span className="text-sm font-medium">{Strings.send || 'Enviar'}</span>
              </Button>
              <Button
                className="h-auto py-4 flex flex-col gap-2"
                variant="outline"
                onClick={handleReceive}
              >
                <ArrowDownLeft className="w-5 h-5" />
                <span className="text-sm font-medium">{Strings.receive || 'Recibir'}</span>
              </Button>
            </div>

            {/* Property Tokens */}
            <Card className="border-0 shadow-none bg-transparent">
              <CardHeader className="px-0">
                <div className="flex items-center justify-between">
                  <CardTitle>{Strings.myInvestments}</CardTitle>
                  <Badge variant="outline">{propertyTokens.length} {Strings.assets}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-0 px-0">
                {propertyTokens.length === 0 ? (
                  <div className="py-12 text-center bg-card rounded-xl">
                    <TrendingUp className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">{Strings.noInvestmentsYet}</p>
                    <p className="text-xs text-muted-foreground mt-1">{Strings.startByBuyingTokens}</p>
                  </div>
                ) : (
                  propertyTokens.map((ownership, index) => {
                    const token = ownership.property
                    const balance = parseFloat(ownership.balance) / 10000000
                    const totalValue = (balance * parseFloat(token.valuation)) / parseFloat(token.totalSupply) / 10000000

                    return (
                      <div
                        key={token.id}
                        className={`p-4 bg-card hover:bg-accent/50 transition-all cursor-pointer ${
                          index === 0 ? 'rounded-t-xl' : ''
                        } ${
                          index === propertyTokens.length - 1 ? 'rounded-b-xl' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <TrendingUp className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold">{token.name}</p>
                              <p className="text-xs text-muted-foreground">{token.propertyId || `PROP${token.id}`}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-sm font-medium text-green-500">
                            {ownership.percentage}%
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div>
                            <p className="text-muted-foreground">{Strings.balance}</p>
                            <p className="font-bold">{balance.toLocaleString()} tokens</p>
                          </div>
                          <div className="text-right">
                            <p className="text-muted-foreground">{Strings.estimatedValue}</p>
                            <p className="font-bold">${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
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
                {isLoadingTransactions ? (
                  <div className="py-8 flex flex-col items-center gap-2">
                    <Spinner size="default" variant="dots" />
                    <p className="text-xs text-muted-foreground">{Strings.loadingTransactions}</p>
                  </div>
                ) : transactions.length > 0 ? (
                  <div className="relative space-y-3">
                    {/* First 3 transactions */}
                    {transactions.slice(0, 3).map((tx) => (
                      <div
                        key={tx.id}
                        className="p-3 rounded-lg border border-transparent hover:border-primary/50 hover:bg-accent/50 transition-all"
                      >
                        <div className="flex items-start gap-3 mb-2">
                          <div className="p-2 rounded-full bg-blue-500/10 text-blue-500">
                            <ArrowUpRight className="w-3 h-3" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-semibold capitalize">{Strings.transaction}</p>
                              <Badge
                                variant={tx.successful ? 'default' : 'outline'}
                                className="text-xs"
                              >
                                {tx.successful ? Strings.completed : Strings.pending}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">{formatDate(new Date(tx.createdAt))}</p>
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-mono text-muted-foreground">{tx.hash.substring(0, 8)}...</p>
                              <p className="text-xs text-muted-foreground">{tx.operationCount} ops</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* 4th transaction - partially visible with fade */}
                    {transactions[3] && (
                      <div className="relative">
                        {/* Gradient overlay for fade effect */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent from-40% via-background/60 via-70% to-background z-10 pointer-events-none" />

                        {/* Partial 4th transaction */}
                        <div className="opacity-60">
                          <div className="p-3 rounded-lg border border-transparent">
                            <div className="flex items-start gap-3 mb-2">
                              <div className="p-2 rounded-full bg-blue-500/10 text-blue-500">
                                <ArrowUpRight className="w-3 h-3" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <p className="text-sm font-semibold capitalize">Transaction</p>
                                  <Badge
                                    variant={transactions[3].successful ? 'default' : 'outline'}
                                    className="text-xs"
                                  >
                                    {transactions[3].successful ? 'Completado' : 'Pendiente'}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mb-2">{formatDate(new Date(transactions[3].createdAt))}</p>
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

                {transactions.length > 0 && (
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

      {/* Deposit Modal */}
      {showDepositModal && (
        <Dialog open={showDepositModal} onOpenChange={setShowDepositModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Depositar USDC
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                  <strong>Testnet:</strong> Usa Friendbot o un exchange de testnet para obtener USDC de prueba
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tu dirección de testnet:</label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 p-3 bg-muted rounded-lg text-xs font-mono break-all">
                    {user.walletAddress}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopyAddress}
                  >
                    {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  className="w-full"
                  onClick={() => {
                    window.open(`https://friendbot.stellar.org?addr=${user.walletAddress}`, '_blank')
                  }}
                >
                  Obtener XLM de Friendbot
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Haz click para recibir 10,000 XLM gratis en testnet
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Send Modal */}
      {showSendModal && (
        <Dialog open={showSendModal} onOpenChange={setShowSendModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Send className="w-5 h-5" />
                Enviar USDC
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Dirección del destinatario</label>
                <input
                  type="text"
                  placeholder="G..."
                  value={sendTo}
                  onChange={(e) => setSendTo(e.target.value)}
                  className="w-full p-3 bg-background border border-border rounded-lg text-sm font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Cantidad (USDC)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                  min="0"
                  step="0.01"
                  className="w-full p-3 bg-background border border-border rounded-lg text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Disponible: ${totalUSDC.toLocaleString('en-US', { minimumFractionDigits: 2 })} USDC
                </p>
              </div>

              <Button className="w-full" disabled>
                <Send className="w-4 h-4 mr-2" />
                Enviar (Próximamente)
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Funcionalidad en desarrollo
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Receive Modal */}
      {showReceiveModal && (
        <Dialog open={showReceiveModal} onOpenChange={setShowReceiveModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ArrowDownLeft className="w-5 h-5" />
                Recibir USDC
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-sm text-muted-foreground">
                Comparte esta dirección para recibir USDC en Stellar testnet
              </p>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tu dirección Stellar:</label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 p-3 bg-muted rounded-lg text-xs font-mono break-all">
                    {user.walletAddress}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopyAddress}
                  >
                    {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg text-center">
                <div className="w-48 h-48 mx-auto bg-white p-4 rounded-lg">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${user.walletAddress}`}
                    alt="QR Code"
                    className="w-full h-full"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Escanea este código QR para obtener la dirección
                </p>
              </div>

              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  <strong>Importante:</strong> Asegúrate de que el remitente envíe USDC en la red Stellar testnet
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
