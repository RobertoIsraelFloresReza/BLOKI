import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Home, Search, Wallet, User, TrendingUp, LogOut, Store, X, Award, ChevronRight, Moon, Sun, Languages, Mail } from 'lucide-react'
import { Badge, ThemeToggle, LanguageSwitcher, LogoWithText, Button } from '@/components/ui'
import { WalletConnect } from '@/components/wallet'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { useStrings } from '@/utils/localizations/useStrings'
import { useTheme } from '@/contexts/ThemeContext'
import { useTranslation } from 'react-i18next'

/**
 * Desktop Navbar Component - Floating (usando fixed porque overflow-x rompe sticky)
 */
function DesktopNavbar({ activeTab, onTabChange, user, showFilters, filters, selectedFilter, onFilterChange, navItems, searchQuery, onSearchChange }) {
  const navigate = useNavigate()
  const Strings = useStrings()

  return (
    <header className="hidden lg:block fixed top-0 left-0 right-0 z-50 w-full pointer-events-none pt-4">
      <div className="max-w-[82%] mx-auto pointer-events-auto">
        <nav className="bg-card/95  transition-all duration-300 rounded-2xl ">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              {/* Logo */}
              <button
                onClick={() => navigate('/')}
                className="flex items-center hover:opacity-80 transition-opacity shrink-0"
              >
                <LogoWithText size="xs" />
              </button>

              {/* Navigation Links */}
              <div className="flex items-center gap-2">
                {navItems.filter(item => item.desktop).map((item) => {
                  const Icon = item.icon
                  const isActive = activeTab === item.id

                  return (
                    <button
                      key={item.id}
                      onClick={() => onTabChange(item.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative ${
                        isActive
                          ? 'text-primary'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>

                      {/* Active indicator */}
                      {isActive && (
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Right side actions */}
              <div className="flex items-center gap-3 shrink-0">
                {/* Profile Button */}
                <button
                  onClick={() => onTabChange('profile')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 relative ${
                    activeTab === 'profile'
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span className="max-w-[100px] truncate">
                    {user ? (user.name || user.email) : Strings.profile}
                  </span>

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

          {/* Filter Tabs Extension */}
          {showFilters && activeTab === 'marketplace' && (
            <div className="border-t border-border/30 px-6 py-4 animate-slideDown rounded-b-2xl">
              <div className="flex items-center gap-4">
                {/* Categories */}
                <div className="flex gap-2 overflow-x-auto scrollbar-hide flex-1">
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
                    </button>
                  ))}
                </div>

                {/* Search Bar */}
                <div className="relative flex-shrink-0 w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <input
                    type="text"
                    placeholder={Strings.searchProperties}
                    value={searchQuery || ''}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => onSearchChange?.('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}

/**
 * Mobile Top Header Component - Fixed (usando fixed porque overflow-x rompe sticky)
 */
function MobileTopHeader({ onMobileSearchClick, setShowProfileModal, activeTab }) {
  const navigate = useNavigate()

  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-50 px-4 pt-3 pb-2">
      <nav className="bg-card/95 backdrop-blur-xl rounded-2xl shadow-lg w-full">
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

                {/* Profile Button */}
                <button
                  onClick={() => setShowProfileModal(true)}
                  className={`p-2 hover:bg-accent rounded-lg transition-colors ${
                    activeTab === 'profile' ? 'text-primary' : 'text-muted-foreground'
                  }`}
                  aria-label="Profile"
                >
                  <User className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </nav>
    </header>
  )
}

/**
 * Mobile Bottom Navigation Component - Fixed
 */
function MobileBottomNav({ activeTab, onTabChange, navItems }) {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
      <div className="px-4 pb-4">
        <nav className="bg-card/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-border/50 pointer-events-auto w-full">
          <div className="flex items-center justify-around py-2 px-2">
            {navItems.filter(item => item.mobile).map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex flex-col items-center justify-center transition-all duration-200 relative flex-1 h-14 ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <Icon className="w-5 h-5 mb-1" />
                  <span className="font-medium text-[10px] truncate max-w-full">
                    {item.label}
                  </span>

                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute top-1 w-1 h-1 bg-primary rounded-full" />
                  )}
                </button>
              )
            })}
          </div>
        </nav>
      </div>
    </div>
  )
}

/**
 * Main Navbar Component
 */
export function Navbar({ activeTab = 'marketplace', onTabChange, user, onLogout, showFilters = false, filters = [], selectedFilter = 'all', onFilterChange, onMobileSearchClick, searchQuery = '', onSearchChange }) {
  const navigate = useNavigate()
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const Strings = useStrings()
  const { theme, toggleTheme } = useTheme()
  const { i18n } = useTranslation()

  const handleTabChange = (tabId) => {
    const routes = {
      'marketplace': '/',
      'evaluators': '/evaluators',
      'seller': '/seller',
      'wallet': '/wallet',
      'profile': '/profile'
    }

    const targetRoute = routes[tabId] || '/'
    navigate(targetRoute)

    if (onTabChange) {
      onTabChange(tabId)
    }
  }

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
      label: Strings.properties,
      icon: Store,
      desktop: true,
      mobile: true
    },
    {
      id: 'evaluators',
      label: Strings.evaluators,
      icon: Award,
      desktop: true,
      mobile: true
    },
    {
      id: 'wallet',
      label: Strings.wallet,
      icon: Wallet,
      desktop: true,
      mobile: false
    },
    {
      id: 'profile',
      label: Strings.profile,
      icon: User,
      desktop: false,
      mobile: false
    }
  ]

  return (
    <>
      {/* Desktop Navbar */}
      <DesktopNavbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        user={user}
        showFilters={showFilters}
        filters={filters}
        selectedFilter={selectedFilter}
        onFilterChange={onFilterChange}
        navItems={navItems}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
      />

      {/* Mobile Top Header */}
      <MobileTopHeader
        onMobileSearchClick={onMobileSearchClick}
        setShowProfileModal={setShowProfileModal}
        activeTab={activeTab}
      />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        navItems={navItems}
      />

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

      {/* Profile Drawer - Mobile */}
      <Drawer open={showProfileModal} onOpenChange={setShowProfileModal}>
        <DrawerContent className="lg:hidden">
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle className="text-center">{Strings.settings}</DrawerTitle>
            </DrawerHeader>
            <div className="p-4 space-y-3">
              {/* Profile Section */}
              <button
                onClick={() => {
                  setShowProfileModal(false)
                  handleTabChange('profile')
                }}
                className="w-full bg-card hover:bg-accent rounded-2xl p-4 transition-all active:scale-98"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-foreground">{user?.name || Strings.user}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {user?.email || Strings.defaultEmail}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </button>

              {/* Wallet Section */}
              <button
                onClick={() => {
                  setShowProfileModal(false)
                  handleTabChange('wallet')
                }}
                className="w-full bg-card hover:bg-accent rounded-2xl p-4 transition-all active:scale-98"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-foreground">{Strings.wallet}</p>
                      <p className="text-xs text-muted-foreground">{Strings.viewMyWallet}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </button>

              {/* Settings Section */}
              <div className="space-y-2">
                {/* Language Toggle */}
                <button
                  onClick={() => {
                    const newLang = i18n.language === 'en' ? 'es' : 'en'
                    i18n.changeLanguage(newLang)
                  }}
                  className="w-full bg-card hover:bg-accent rounded-2xl p-4 transition-all active:scale-98"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Languages className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium text-foreground">{Strings.language || 'Idioma'}</span>
                    </div>
                    <span className="text-sm text-muted-foreground font-medium">
                      {i18n.language === 'en' ? 'English' : 'Español'}
                    </span>
                  </div>
                </button>

                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="w-full bg-card hover:bg-accent rounded-2xl p-4 transition-all active:scale-98"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {theme === 'dark' ? (
                        <Moon className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <Sun className="w-5 h-5 text-muted-foreground" />
                      )}
                      <span className="font-medium text-foreground">{Strings.mode}</span>
                    </div>
                    <span className="text-sm text-muted-foreground font-medium">
                      {theme === 'dark' ? Strings.dark : Strings.light}
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}
