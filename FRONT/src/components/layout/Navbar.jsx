import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Home, Search, Wallet, User, TrendingUp, LogOut, Store, X } from 'lucide-react'
import { Badge, ThemeToggle, LanguageSwitcher, LogoWithText, Button } from '@/components/ui'
import { WalletConnect } from '@/components/wallet'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui'
import { useStrings } from '@/utils/localizations/useStrings'

/**
 * Navbar Component
 * Floating navbar for desktop (80% width, rounded)
 * Bottom navigation for mobile
 * Modern glassmorphism design
 */
export function Navbar({ activeTab = 'marketplace', onTabChange, user, onLogout, showFilters = false, filters = [], selectedFilter = 'all', onFilterChange, onMobileSearchClick }) {
  const navigate = useNavigate()
  const [showWalletModal, setShowWalletModal] = useState(false)
  const Strings = useStrings()

  const handleTabChange = (tabId) => {
    // Mapeo de tabs a rutas
    const routes = {
      'marketplace': '/',
      'seller': '/seller',
      'wallet': '/wallet',
      'profile': '/profile'
    }

    // Navegar a la ruta correspondiente
    navigate(routes[tabId] || '/')

    // Mantener compatibilidad con el callback
    if (onTabChange) {
      onTabChange(tabId)
    }
  }

  // Navigation items (without profile for desktop, it will be in the right side)
  const navItems = [
    {
      id: 'marketplace',
      label: Strings.marketplace,
      icon: Home,
      desktop: true,
      mobile: true
    },
    {
      id: 'seller',
      label: Strings.properties || 'Propiedades',
      icon: Store,
      desktop: true,
      mobile: true
    },
    {
      id: 'wallet',
      label: Strings.wallet || 'Wallet',
      icon: Wallet,
      desktop: true,
      mobile: true
    },
    {
      id: 'profile',
      label: Strings.profile,
      icon: User,
      desktop: false, // Profile will be shown in right side for desktop
      mobile: true
    }
  ]

  return (
    <>
      {/* Desktop Navbar - Floating */}
      <div className="hidden lg:block sticky top-0 z-50 pb-2 pt-4">
        <nav className={`bg-card/90 backdrop-blur-xl mx-auto w-[82%] transition-all duration-300 ${showFilters ? 'rounded-t-2xl' : 'rounded-2xl'}`}>
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-0 hover:opacity-80 transition-opacity"
              >
                <LogoWithText size="xs" />
              </button>

              {/* Navigation Links */}
              <div className="flex items-center gap-2">
                {navItems.filter(item => item.desktop).map((item) => {
                  const Icon = item.icon
                  const isActive = activeTab === item.id

                  return (
                    <div key={item.id} className="relative group">
                      <button
                        onClick={() => handleTabChange(item.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative ${
                          isActive
                            ? 'text-primary'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>

                        {/* Active indicator - Blue line */}
                        {isActive && (
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
                        )}
                      </button>
                    </div>
                  )
                })}
              </div>

              {/* Right side actions */}
              <div className="flex items-center gap-3">
                {/* Profile Button - Modern design */}
                <button
                  onClick={() => handleTabChange('profile')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 relative ${
                    activeTab === 'profile'
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span className="max-w-[100px] truncate">
                    {user ? (user.name || user.email) : (Strings.profile || 'Perfil')}
                  </span>

                  {/* Active indicator - Blue line */}
                  {activeTab === 'profile' && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
                  )}
                </button>

                <div className="w-px h-6 bg-border" />

                <LanguageSwitcher />
                <ThemeToggle />
              </div>
            </div>
          </div>

          {/* Filter Tabs Extension - Only on Marketplace with Scroll */}
          {showFilters && activeTab === 'marketplace' && (
            <div className="border-t border-border/30 px-6 py-4 animate-slideDown rounded-b-2xl">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => onFilterChange?.(filter.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                      selectedFilter === filter.id
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'bg-accent/50 text-muted-foreground hover:bg-accent hover:text-foreground'
                    }`}
                  >
                    {filter.icon}
                    <span>{filter.name}</span>
                    <span className="text-xs opacity-70">({filter.count})</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </nav>
      </div>

      {/* Mobile Navbar - Bottom Fixed */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        <div className="bg-card/95 backdrop-blur-xl border-t border-border shadow-2xl">
          <div className="flex justify-around items-center px-4 pb-0 pt-2 relative">
            {navItems.filter(item => item.mobile).map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`flex flex-col items-center justify-center transition-all duration-300 relative w-14 h-14 rounded-xl ${
                    isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="w-5 h-5 mb-1" />
                  <span className="font-medium text-[10px]">
                    {item.label}
                  </span>

                  {/* Active indicator - Blue dot for mobile */}
                  {isActive && (
                    <div className="absolute top-0 w-1 h-1 bg-primary rounded-full" />
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
            <button
              onClick={() => navigate('/')}
              className="hover:opacity-80 transition-opacity"
            >
              <LogoWithText size="xs" />
            </button>
            <div className="flex items-center gap-2">
              {/* Search Icon - Only on Marketplace */}
              {activeTab === 'marketplace' && (
                <button
                  onClick={onMobileSearchClick}
                  className="p-2 hover:bg-accent rounded-lg transition-colors"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
              <LanguageSwitcher />
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
              {Strings.connectWallet}
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
