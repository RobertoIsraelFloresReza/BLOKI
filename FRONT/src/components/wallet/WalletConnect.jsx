import { useState } from 'react'
import { Wallet, Check, AlertCircle, ExternalLink } from 'lucide-react'
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, Loader3D } from '@/components/ui'

/**
 * WalletConnect Component
 * Handles Freighter wallet connection for Stellar network
 * Modern Web3 UX with clear status feedback
 */
export function WalletConnect() {
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState(null)
  const [error, setError] = useState(null)

  const connectWallet = async () => {
    setIsConnecting(true)
    setError(null)

    try {
      // Check if Freighter is installed
      if (!window.freighter) {
        throw new Error('Freighter wallet not installed')
      }

      // Request access
      const address = await window.freighter.getPublicKey()

      setWalletAddress(address)
      setIsConnected(true)
    } catch (err) {
      setError(err.message || 'Failed to connect wallet')
      setIsConnected(false)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setWalletAddress(null)
    setIsConnected(false)
    setError(null)
  }

  const truncateAddress = (address) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Stellar Wallet
            </CardTitle>
            <CardDescription className="mt-1">
              {isConnected ? 'Connected to Freighter' : 'Connect your Freighter wallet'}
            </CardDescription>
          </div>
          {isConnected && (
            <Badge variant="secondary" className="gap-1">
              <Check className="w-3 h-3" />
              Connected
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Connection Status */}
        {isConnected && walletAddress && (
          <div className="p-4 rounded-lg bg-accent/50 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Your Address</p>
            <div className="flex items-center justify-between gap-2">
              <code className="text-sm font-mono text-foreground">
                {truncateAddress(walletAddress)}
              </code>
              <a
                href={`https://stellar.expert/explorer/testnet/account/${walletAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
            <div className="flex gap-2">
              <AlertCircle className="w-4 h-4 text-destructive mt-0.5" />
              <div>
                <p className="text-sm font-medium text-destructive">Connection Failed</p>
                <p className="text-xs text-destructive/80 mt-1">{error}</p>
                {error.includes('not installed') && (
                  <a
                    href="https://www.freighter.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline mt-2 inline-flex items-center gap-1"
                  >
                    Install Freighter
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        {!isConnected ? (
          <Button
            onClick={connectWallet}
            disabled={isConnecting}
            className="w-full"
            size="lg"
          >
            {isConnecting ? (
              <>
                <Loader3D />
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="w-4 h-4" />
                Connect Wallet
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={disconnectWallet}
            variant="outline"
            className="w-full"
            size="lg"
          >
            Disconnect
          </Button>
        )}

        {/* Info */}
        <p className="text-xs text-muted-foreground text-center">
          Make sure you have Freighter wallet installed to interact with properties
        </p>
      </CardContent>
    </Card>
  )
}
