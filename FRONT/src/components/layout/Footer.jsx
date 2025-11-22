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
      <footer className="relative w-full mt-auto border-t border-border/50 bg-gradient-to-b from-background via-primary/[0.02] to-background overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 opacity-50" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Stats Bar */}
          <div className="py-8 border-b border-border/30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Main Footer Content */}
          <div className="py-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Left: Branding */}
              <div className="lg:col-span-5">
                <div className="mb-6">
                  <LogoWithText size="sm" />
                </div>
                <p className="text-base text-muted-foreground leading-relaxed max-w-md mb-6">
                  {Strings.footerDescription}
                </p>

                {/* Social Links */}
                <div className="flex items-center gap-3">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon
                    return (
                      <a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-11 h-11 rounded-xl bg-accent/50 backdrop-blur-sm border border-border/50 flex items-center justify-center transition-all ${social.color} hover:scale-110 hover:shadow-lg`}
                        aria-label={social.label}
                      >
                        <Icon className="w-5 h-5" />
                      </a>
                    )
                  })}
                </div>
              </div>

              {/* Right: Quick Links */}
              <div className="lg:col-span-7">
                <div className="grid grid-cols-2 gap-8">
                  {/* Legal */}
                  <div>
                    <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-primary" />
                      {Strings.legal}
                    </h3>
                    <ul className="space-y-3">
                      <li>
                        <button
                          onClick={() => setShowModal('privacy')}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                        >
                          <span>{Strings.privacyPolicy}</span>
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => setShowModal('terms')}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                        >
                          <span>{Strings.termsOfService}</span>
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => setShowModal('cookies')}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                        >
                          <span>{Strings.cookiesPolicy}</span>
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      </li>
                    </ul>
                  </div>

                  {/* Technology */}
                  <div>
                    <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-secondary" />
                      {Strings.technology}
                    </h3>
                    <ul className="space-y-3">
                      <li>
                        <a
                          href="https://stellar.org"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-muted-foreground hover:text-secondary transition-colors flex items-center gap-2 group"
                        >
                          <span>{Strings.stellarBlockchain}</span>
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://soroban.stellar.org"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-muted-foreground hover:text-secondary transition-colors flex items-center gap-2 group"
                        >
                          <span>{Strings.sorobanSmartContracts}</span>
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://freighter.app"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-muted-foreground hover:text-secondary transition-colors flex items-center gap-2 group"
                        >
                          <span>{Strings.freighterWallet}</span>
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="py-6 border-t border-border/30">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-muted-foreground">
                © {currentYear} Blocki. {Strings.allRightsReserved}
              </p>
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
