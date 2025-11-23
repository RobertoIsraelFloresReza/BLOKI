import { useState, useEffect } from 'react'
import { ChevronLeft, Shield, CheckCircle, ExternalLink, Copy, Check } from 'lucide-react'
import { Button, Badge } from '@/components/ui'
import { useStrings } from '@/utils/localizations/useStrings'

/**
 * CheckoutFlow Component
 * Receipt/Comprobante display after successful purchase
 * Mercado Pago style inline receipt
 */
export function CheckoutFlow({
  isOpen,
  onClose,
  property,
  purchaseResult
}) {
  const Strings = useStrings()
  const [copied, setCopied] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  // Trigger confetti when opening
  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true)
      const timer = setTimeout(() => setShowConfetti(false), 4000)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!isOpen || !purchaseResult) return null

  const handleCopyHash = (hash) => {
    navigator.clipboard.writeText(hash)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen pb-20 animate-in fade-in duration-500">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(60)].map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-5%',
                animation: `confetti-fall ${2 + Math.random() * 3}s linear forwards`,
                animationDelay: `${Math.random() * 0.5}s`
              }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  background: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'][Math.floor(Math.random() * 6)],
                  transform: `rotate(${Math.random() * 360}deg)`
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Back Button */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Volver al marketplace</span>
        </button>
      </div>

      {/* Main Content - Receipt */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Success Icon & Title */}
        <div className="text-center py-8 animate-in zoom-in duration-700">
          <div className="w-28 h-28 mx-auto rounded-full bg-green-500/10 flex items-center justify-center mb-6 animate-bounce-slow border-4 border-green-500/20">
            <CheckCircle className="w-20 h-20 text-green-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
            ¡Compra Exitosa!
          </h1>
          <p className="text-lg text-muted-foreground">
            Tu compra de <span className="font-bold text-foreground">{purchaseResult.tokens}</span> tokens ha sido procesada exitosamente
          </p>
        </div>

        {/* Property Info Card */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-lg animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-start gap-4">
            <img
              src={property.images?.[0] || property.image || '/blocki_general.jpg'}
              alt={property.name || property.title}
              className="w-20 h-20 rounded-xl object-cover ring-2 ring-primary/20"
            />
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">{property.name || property.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">{property.address || property.location}</p>
              <Badge variant="secondary" className="text-xs">
                {property.metadata?.category || property.category || 'Property'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Transaction Summary */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg animate-in slide-in-from-bottom-4 duration-500 delay-100">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 px-6 py-4 border-b border-border">
            <h3 className="font-bold text-lg">Resumen de Transacción</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-border/50">
              <div>
                <p className="font-medium">Tokens Comprados</p>
                <p className="text-xs text-muted-foreground">Unidades adquiridas</p>
              </div>
              <span className="text-2xl font-bold">{purchaseResult.tokens}</span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-border/50">
              <div>
                <p className="font-medium">Total Pagado</p>
                <p className="text-xs text-muted-foreground">Incluye tarifa de red</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">${purchaseResult.grandTotal?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                <p className="text-xs text-muted-foreground">USDC</p>
              </div>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium">Tu Participación</p>
                <p className="text-xs text-muted-foreground">Porcentaje de propiedad</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-primary">{purchaseResult.ownershipPercentage}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Hash */}
        <div className="bg-muted/30 border border-border rounded-2xl p-6 animate-in slide-in-from-bottom-4 duration-500 delay-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-500" />
              <h3 className="font-semibold">Hash de Transacción</h3>
            </div>
            <Badge variant="outline" className="text-xs flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Stellar Network
            </Badge>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <code className="flex-1 text-xs font-mono bg-background px-4 py-3 rounded-lg border border-border overflow-x-auto">
              {purchaseResult.transactionId}
            </code>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopyHash(purchaseResult.transactionId)}
              className="shrink-0"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>

          <a
            href={`https://stellar.expert/explorer/testnet/tx/${purchaseResult.transactionId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            Ver en Stellar Explorer
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Info Message */}
        <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-5 animate-in slide-in-from-bottom-4 duration-500 delay-300">
          <div className="flex gap-3">
            <Shield className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm mb-1">Tokens seguros en tu wallet</p>
              <p className="text-xs text-muted-foreground">
                Tus tokens aparecerán en tu wallet en los próximos minutos. Puedes verificar el estado en la sección de Wallet.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 animate-in slide-in-from-bottom-4 duration-500 delay-400">
          <Button
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={onClose}
          >
            Volver al Marketplace
          </Button>
          <Button
            size="lg"
            className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            onClick={() => window.location.href = '/wallet'}
          >
            Ver Mi Wallet
          </Button>
        </div>

        {/* Footer Note */}
        <div className="text-center pt-6 pb-8">
          <p className="text-xs text-muted-foreground">
            Transacción realizada el {new Date(purchaseResult.timestamp).toLocaleString('es-ES', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes confetti-fall {
          to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
