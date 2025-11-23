import { useState } from 'react'
import { Copy, CheckCircle, AlertTriangle, Eye, EyeOff, Shield, X } from 'lucide-react'
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui'

/**
 * SecretKeyBackupModal Component
 * Shows user's Stellar secret key after registration
 * CRITICAL: User must save this key to create properties and listings
 */
export function SecretKeyBackupModal({ isOpen, onClose, secretKey, publicKey }) {
  const [copied, setCopied] = useState({ public: false, secret: false })
  const [showSecret, setShowSecret] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text)
    setCopied(prev => ({ ...prev, [type]: true }))
    setTimeout(() => {
      setCopied(prev => ({ ...prev, [type]: false }))
    }, 2000)
  }

  const handleContinue = () => {
    if (confirmed) {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onClose={() => {}}>
      <DialogContent className="max-w-2xl">
        {/* No close button - user MUST confirm they saved the key */}

        <DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="w-10 h-10 text-primary" />
            </div>
            <div className="text-center">
              <DialogTitle className="text-2xl font-bold mb-2">
                ¡Guarda tu Secret Key!
              </DialogTitle>
              <p className="text-sm text-muted-foreground max-w-md">
                Esta es tu clave privada de Stellar. <strong>Necesitarás esta clave</strong> para crear propiedades y vender tokens.
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Warning Box */}
          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
              <div className="space-y-2 text-sm">
                <p className="font-semibold text-destructive">⚠️ ADVERTENCIA IMPORTANTE</p>
                <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                  <li>NUNCA compartas esta clave con nadie</li>
                  <li>Guárdala en un lugar seguro (papel, password manager)</li>
                  <li>Si la pierdes, NO podrás crear propiedades ni vender tokens</li>
                  <li>Blocki NO puede recuperar esta clave</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Public Key */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Public Key (Dirección de tu Wallet)
            </label>
            <div className="relative">
              <input
                type="text"
                value={publicKey}
                readOnly
                className="w-full px-4 py-3 pr-12 rounded-lg border border-border bg-muted/50 font-mono text-sm"
              />
              <button
                onClick={() => handleCopy(publicKey, 'public')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-accent transition-colors"
              >
                {copied.public ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Esta es tu dirección pública. Puedes compartirla libremente.
            </p>
          </div>

          {/* Secret Key */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-destructive">
              Secret Key (Clave Privada - GUARDAR EN LUGAR SEGURO)
            </label>
            <div className="relative">
              <input
                type={showSecret ? "text" : "password"}
                value={secretKey}
                readOnly
                className="w-full px-4 py-3 pr-24 rounded-lg border-2 border-destructive/50 bg-destructive/5 font-mono text-sm"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  onClick={() => setShowSecret(!showSecret)}
                  className="p-2 rounded-lg hover:bg-accent transition-colors"
                >
                  {showSecret ? (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
                <button
                  onClick={() => handleCopy(secretKey, 'secret')}
                  className="p-2 rounded-lg hover:bg-accent transition-colors"
                >
                  {copied.secret ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-destructive" />
                  )}
                </button>
              </div>
            </div>
            <p className="text-xs text-destructive font-medium">
              ⚠️ NUNCA compartas esta clave. Necesitarás esta clave para crear propiedades y listings.
            </p>
          </div>

          {/* Confirmation Checkbox */}
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-primary/50"
              />
              <div className="text-sm">
                <p className="font-semibold text-foreground">
                  He guardado mi Secret Key en un lugar seguro
                </p>
                <p className="text-muted-foreground mt-1">
                  Entiendo que si pierdo esta clave, no podré crear propiedades ni vender tokens en el marketplace.
                </p>
              </div>
            </label>
          </div>

          {/* Continue Button */}
          <Button
            onClick={handleContinue}
            disabled={!confirmed}
            className="w-full"
            size="lg"
          >
            {confirmed ? 'Continuar al Dashboard' : 'Por favor, confirma que guardaste tu clave'}
          </Button>

          {/* Help Text */}
          <p className="text-xs text-center text-muted-foreground">
            Puedes ver tu secret key nuevamente en tu perfil, sección "Wallet Security"
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
