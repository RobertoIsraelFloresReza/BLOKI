import { useState } from 'react'
import { TrendingUp, DollarSign, Calendar, X, Shield, AlertCircle } from 'lucide-react'
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Label, LoaderButton } from '@/components/ui'
import { useMarketplace } from '@/hooks'
import { authService } from '@/services'
import toast from 'react-hot-toast'

/**
 * CreateListingModal Component
 * Allows property owners to create listings to sell their tokens
 * Required: sellerSecretKey from backend
 */
export function CreateListingModal({ isOpen, onClose, property, user }) {
  const [formData, setFormData] = useState({
    amount: '',
    pricePerToken: '',
    expirationDays: '30'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { createListingAsync } = useMarketplace()

  if (!property) return null

  const totalTokens = property.totalSupply || property.totalTokens || 0
  const availableTokens = property.availableTokens || property.tokensAvailable || totalTokens

  const amount = parseInt(formData.amount) || 0
  const pricePerToken = parseFloat(formData.pricePerToken) || 0
  const totalPrice = amount * pricePerToken

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (!formData.amount || amount <= 0) {
      toast.error('Ingresa una cantidad válida de tokens')
      return
    }

    if (amount > availableTokens) {
      toast.error(`No puedes vender más de ${availableTokens} tokens`)
      return
    }

    if (!formData.pricePerToken || pricePerToken <= 0) {
      toast.error('Ingresa un precio válido por token')
      return
    }

    setIsSubmitting(true)

    try {
      console.log('💰 === CREATE LISTING: START ===')
      console.log('Property:', property.name || property.title)
      console.log('Amount:', amount, 'tokens')
      console.log('Price per token:', pricePerToken, 'USDC')
      console.log('Total price:', totalPrice, 'USDC')

      // Step 1: Get seller's secret key
      console.log('🔐 Step 1: Fetching seller secret key...')
      const { stellarSecretKey } = await authService.getWalletSecretKey()

      if (!stellarSecretKey) {
        throw new Error('No se pudo obtener la clave del vendedor')
      }

      console.log('✅ Seller secret key retrieved')

      // Step 2: Create listing on blockchain
      console.log('🚀 Step 2: Creating listing on blockchain...')
      const result = await createListingAsync({
        propertyId: property.id,
        amount: parseInt(formData.amount),
        pricePerToken: parseFloat(formData.pricePerToken),
        sellerSecretKey: stellarSecretKey,
        expirationDays: parseInt(formData.expirationDays)
      })

      console.log('✅ Listing created successfully!', result)
      console.log('=== CREATE LISTING: END ===')

      toast.success(`¡Listing creado! ${amount} tokens a la venta`)

      // Close modal and refresh data
      onClose(true) // true = refresh needed
    } catch (error) {
      console.error('❌ === CREATE LISTING FAILED ===')
      console.error('Error:', error)
      console.error('Message:', error.message)
      console.error('Response:', error.response?.data)
      console.error('=== CREATE LISTING FAILED: END ===')

      // Error toast already shown by useMarketplace hook
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onClose={() => !isSubmitting && onClose()}>
      <DialogContent className="max-w-2xl">
        <button
          onClick={() => !isSubmitting && onClose()}
          disabled={isSubmitting}
          className="absolute right-4 top-4 p-2 rounded-lg hover:bg-accent transition-colors disabled:opacity-50"
        >
          <X className="w-4 h-4" />
        </button>

        <DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-10 h-10 text-primary" />
            </div>
            <div className="text-center">
              <DialogTitle className="text-2xl font-bold mb-2">
                Crear Listing de Venta
              </DialogTitle>
              <p className="text-sm text-muted-foreground max-w-md">
                Pon tokens de esta propiedad a la venta en el marketplace
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Property Info */}
          <div className="p-4 rounded-xl bg-muted/50 border border-border">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">{property.name || property.title}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Tokens disponibles: <span className="font-semibold text-foreground">{availableTokens.toLocaleString()}</span> / {totalTokens.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Amount Input */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Cantidad de Tokens a Vender
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder="Ej: 50"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                min="1"
                max={availableTokens}
                required
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground">
                Máximo: {availableTokens.toLocaleString()} tokens
              </p>
            </div>

            {/* Price Per Token Input */}
            <div className="space-y-2">
              <Label htmlFor="pricePerToken" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Precio por Token (USDC)
              </Label>
              <Input
                id="pricePerToken"
                type="number"
                placeholder="Ej: 1000"
                value={formData.pricePerToken}
                onChange={(e) => setFormData(prev => ({ ...prev, pricePerToken: e.target.value }))}
                min="0.01"
                step="0.01"
                required
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground">
                Precio en USDC (dólares) por cada token
              </p>
            </div>

            {/* Expiration Days Input */}
            <div className="space-y-2">
              <Label htmlFor="expirationDays" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Días hasta Expiración
              </Label>
              <Input
                id="expirationDays"
                type="number"
                placeholder="30"
                value={formData.expirationDays}
                onChange={(e) => setFormData(prev => ({ ...prev, expirationDays: e.target.value }))}
                min="1"
                max="365"
                required
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground">
                El listing expirará automáticamente después de este tiempo
              </p>
            </div>

            {/* Summary Box */}
            {amount > 0 && pricePerToken > 0 && (
              <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Tokens a vender</span>
                  <span className="text-lg font-bold">{amount.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Precio por token</span>
                  <span className="text-lg font-bold">${pricePerToken.toLocaleString('en-US', { minimumFractionDigits: 2 })} USDC</span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Total a recibir</span>
                  <span className="text-2xl font-bold text-primary">${totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })} USDC</span>
                </div>
              </div>
            )}

            {/* Warning */}
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-semibold text-foreground mb-1">Información importante:</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Se ejecutará una transacción en Stellar blockchain (10-30 seg)</li>
                    <li>Los tokens estarán bloqueados hasta que se vendan o el listing expire</li>
                    <li>Puedes cancelar el listing antes de que expire</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isSubmitting || !amount || !pricePerToken}
            >
              {isSubmitting ? (
                <>
                  <LoaderButton className="mr-2" />
                  Creando listing en blockchain...
                </>
              ) : (
                'Crear Listing'
              )}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
