import { useState } from 'react'
import { LogoWithText } from '@/components/ui'
import { Twitter, Linkedin, Github, ExternalLink, Shield, FileText, ScrollText, Sparkles, TrendingUp, Lock } from 'lucide-react'
import { useStrings } from '@/utils/localizations/useStrings'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui'

/**
 * Footer Component
 * Modern, innovative footer with interactive sections and modals
 * Features: Gradient backgrounds, hover effects, legal modals, stats
 */
export function Footer() {
  const Strings = useStrings()
  const currentYear = new Date().getFullYear()
  const [showModal, setShowModal] = useState(null)

  // Stats for showcase
  const stats = [
    { icon: Shield, value: '100%', label: Strings.blockchainSecurity },
    { icon: Sparkles, value: '24/7', label: Strings.livePlatform },
  ]

  // Social links with real styling
  const socialLinks = [
    {
      icon: Twitter,
      href: 'https://twitter.com/blocki',
      label: 'Twitter',
      color: 'hover:bg-blue-500/10 hover:text-blue-500'
    },
    {
      icon: Linkedin,
      href: 'https://linkedin.com/company/blocki',
      label: 'LinkedIn',
      color: 'hover:bg-blue-600/10 hover:text-blue-600'
    },
    {
      icon: Github,
      href: 'https://github.com/blocki',
      label: 'GitHub',
      color: 'hover:bg-purple-500/10 hover:text-purple-500'
    },
  ]

  // Modal content for legal pages
  const modalContent = {
    privacy: {
      title: Strings.privacyPolicy,
      icon: Lock,
      content: (
        <div className="space-y-4 text-sm text-muted-foreground">
          <p>En Blocki, tu privacidad es nuestra prioridad. Esta política describe cómo recopilamos, usamos y protegemos tu información.</p>

          <h3 className="text-foreground font-semibold mt-4">Información que Recopilamos</h3>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Dirección de wallet (pública en blockchain)</li>
            <li>Historial de transacciones</li>
            <li>Preferencias de inversión</li>
          </ul>

          <h3 className="text-foreground font-semibold mt-4">Uso de la Información</h3>
          <p>Usamos tu información para proporcionar servicios de tokenización, mejorar la experiencia del usuario y cumplir con regulaciones.</p>

          <h3 className="text-foreground font-semibold mt-4">Seguridad</h3>
          <p>Implementamos medidas de seguridad estándar de la industria para proteger tus datos. Las transacciones se realizan en la blockchain de Stellar.</p>
        </div>
      )
    },
    terms: {
      title: Strings.termsOfService,
      icon: FileText,
      content: (
        <div className="space-y-4 text-sm text-muted-foreground">
          <p>Bienvenido a Blocki. Al usar nuestra plataforma, aceptas los siguientes términos y condiciones.</p>

          <h3 className="text-foreground font-semibold mt-4">1. Servicios</h3>
          <p>Blocki proporciona una plataforma para la tokenización y comercio de bienes raíces en la blockchain de Stellar.</p>

          <h3 className="text-foreground font-semibold mt-4">2. Riesgos de Inversión</h3>
          <p>Las inversiones en bienes raíces tokenizados conllevan riesgos. El valor puede fluctuar y no garantizamos rendimientos.</p>

          <h3 className="text-foreground font-semibold mt-4">3. Responsabilidades del Usuario</h3>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Mantener la seguridad de tu wallet</li>
            <li>Verificar la información antes de invertir</li>
            <li>Cumplir con las leyes locales</li>
          </ul>

          <h3 className="text-foreground font-semibold mt-4">4. Propiedad Intelectual</h3>
          <p>Todo el contenido de Blocki está protegido por derechos de autor.</p>
        </div>
      )
    },
    cookies: {
      title: Strings.cookiesPolicy,
      icon: ScrollText,
      content: (
        <div className="space-y-4 text-sm text-muted-foreground">
          <p>Blocki utiliza cookies para mejorar tu experiencia en la plataforma.</p>

          <h3 className="text-foreground font-semibold mt-4">Tipos de Cookies</h3>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li><strong>Esenciales:</strong> Necesarias para el funcionamiento básico</li>
            <li><strong>Rendimiento:</strong> Nos ayudan a mejorar la plataforma</li>
            <li><strong>Preferencias:</strong> Guardan tu configuración de idioma y tema</li>
          </ul>

          <h3 className="text-foreground font-semibold mt-4">Control de Cookies</h3>
          <p>Puedes gestionar las cookies desde la configuración de tu navegador. Bloquear cookies puede afectar la funcionalidad.</p>
        </div>
      )
    }
  }

  return (
    <>
      <footer className="relative w-full mt-auto overflow-hidden border-t border-border/50">
        {/* Background matching navbar style */}
        <div className="absolute inset-0 bg-card/50 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Content - Centered and Minimal */}
          <div className="py-12">
            <div className="flex flex-col items-center text-center space-y-8">

              {/* Logo */}
              <div className="mb-2">
                <LogoWithText size="sm" />
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground max-w-lg leading-relaxed">
                {Strings.footerDescription}
              </p>

              {/* Stellar Technology Links - Professional */}
              <div className="flex flex-wrap items-center justify-center gap-6">
                <a
                  href="https://stellar.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{Strings.stellarBlockchain}</span>
                  <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                </a>

                <a
                  href="https://soroban.stellar.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  <span>{Strings.sorobanSmartContracts}</span>
                  <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>

              {/* Legal Links - Minimal */}
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
                <button
                  onClick={() => setShowModal('privacy')}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {Strings.privacyPolicy}
                </button>
                <span className="text-muted-foreground/30">•</span>
                <button
                  onClick={() => setShowModal('terms')}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {Strings.termsOfService}
                </button>
                <span className="text-muted-foreground/30">•</span>
                <button
                  onClick={() => setShowModal('cookies')}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {Strings.cookiesPolicy}
                </button>
              </div>

              {/* Copyright - Bottom */}
              <div className="pt-8 border-t border-border/30 w-full">
                <p className="text-xs text-muted-foreground">
                  © {currentYear} Blocki. {Strings.allRightsReserved}
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals for Legal Pages */}
      {showModal && modalContent[showModal] && (
        <Dialog open={!!showModal} onClose={() => setShowModal(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogClose onClose={() => setShowModal(null)} />
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                {(() => {
                  const Icon = modalContent[showModal].icon
                  return <Icon className="w-6 h-6 text-primary" />
                })()}
                {modalContent[showModal].title}
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              {modalContent[showModal].content}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
