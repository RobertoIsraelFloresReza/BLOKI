import { useState } from 'react'
import { Home, Search, Wallet, User, TrendingUp } from 'lucide-react'
import { Badge, ThemeToggle, LogoWithText } from '@/components/ui'
import { WalletConnect } from '@/components/wallet'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui'

/**
 * Navbar Component
 * Floating navbar for desktop (80% width, rounded)
 * Bottom navigation for mobile
 * Modern glassmorphism design
 */
export function Navbar({ activeTab = 'marketplace', onTabChange }) {
  const [showWalletModal, setShowWalletModal] = useState(false)

  const handleTabChange = (tabId) => {
    if (onTabChange) {
      onTabChange(tabId)
    }
  }

  // Navigation items
  const navItems = [
    {
      id: 'marketplace',
      label: 'Marketplace',
      icon: Home,
      desktop: true,
      mobile: true
    },
    {
      id: 'explore',
      label: 'Explorar',
      icon: Search,
      desktop: true,
      mobile: true
    },
    {
      id: 'portfolio',
      label: 'Portfolio',
      icon: TrendingUp,
      desktop: true,
      mobile: true,
      primary: true // Destacado en mobile
    },
    {
      id: 'profile',
      label: 'Perfil',
      icon: User,
      desktop: true,
      mobile: true
    }
  ]

  return (
    <>
      {/* Desktop Navbar - Floating */}
      <div className="hidden lg:block sticky top-0 z-50 pb-4 pt-4">
        <nav className="bg-card/80 backdrop-blur-xl border border-border shadow-lg mx-auto w-[80%] rounded-2xl">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <LogoWithText size="sm" />
                <Badge variant="secondary" className="text-xs">v2.0</Badge>
              </div>

              {/* Navigation Links */}
              <div className="flex items-center gap-2">
                {navItems.filter(item => item.desktop).map((item) => {
                  const Icon = item.icon
                  const isActive = activeTab === item.id

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabChange(item.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  )
                })}
              </div>

              {/* Right side actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowWalletModal(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <Wallet className="w-4 h-4" />
                  <span className="text-sm font-medium">Connect</span>
                </button>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Navbar - Bottom Fixed */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        <div className="bg-card/95 backdrop-blur-xl border-t border-border shadow-2xl">
          <div className="flex justify-around items-end px-4 pb-safe pt-3 relative">
            {navItems.filter(item => item.mobile).map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              const isPrimary = item.primary

              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`flex flex-col items-center justify-center transition-all duration-300 relative ${
                    isPrimary
                      ? 'w-16 h-16 -mt-8 rounded-2xl shadow-2xl'
                      : 'w-14 h-14 rounded-xl'
                  } ${
                    isPrimary
                      ? isActive
                        ? 'bg-primary text-primary-foreground scale-110'
                        : 'bg-primary text-primary-foreground hover:scale-105'
                      : isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon
                    className={`${
                      isPrimary ? 'w-7 h-7' : 'w-5 h-5'
                    } mb-1`}
                  />
                  <span className={`font-medium ${
                    isPrimary ? 'text-xs' : 'text-[10px]'
                  }`}>
                    {item.label}
                  </span>

                  {/* Active indicator */}
                  {isActive && !isPrimary && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Mobile Header - Top */}
      <div className="lg:hidden sticky top-0 z-40 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <LogoWithText size="sm" />
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowWalletModal(true)}
                className="p-2 rounded-lg bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors"
              >
                <Wallet className="w-5 h-5" />
              </button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Connection Modal */}
      <Dialog open={showWalletModal} onClose={() => setShowWalletModal(false)}>
        <DialogContent className="max-w-md">
          <DialogClose onClose={() => setShowWalletModal(false)} />
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary" />
              Conectar Wallet
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <WalletConnect />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
