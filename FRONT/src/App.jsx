import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Navbar, Footer } from '@/components/layout'
import { Marketplace } from '@/pages/marketplace'
import { AuthPage } from '@/pages/auth'
import { OAuth2Callback } from '@/pages/auth/OAuth2Callback'
import { ProfilePage } from '@/pages/profile'
import { WalletPage } from '@/pages/wallet'
import { SellerDashboard } from '@/pages/seller'
import { useStrings } from '@/utils/localizations/useStrings'

function AppContent() {
  const location = useLocation()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [marketplaceFilters, setMarketplaceFilters] = useState({ filters: [], selectedFilter: 'all', onFilterChange: null })
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const Strings = useStrings()

  // Determine active tab from location
  const activeTab = location.pathname === '/seller' ? 'seller'
    : location.pathname === '/wallet' ? 'wallet'
    : location.pathname === '/profile' ? 'profile'
    : 'marketplace'

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 600)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Check for existing user session
  useEffect(() => {
    const storedUser = localStorage.getItem('blocki_user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        console.error('Error parsing user from localStorage:', e)
        localStorage.removeItem('blocki_user')
      }
    }
  }, [])

  const handleAuthSuccess = (userData) => {
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem('blocki_token')
    localStorage.removeItem('blocki_user')
    setUser(null)
    navigate('/')
  }

  const handleTabChange = (tab) => {
    const routes = {
      'marketplace': '/',
      'seller': '/seller',
      'wallet': '/wallet',
      'profile': '/profile'
    }
    navigate(routes[tab] || '/')
  }

  return (
    <div className="min-h-screen pb-20 lg:pb-0 flex flex-col bg-background">
      {/* Floating Navbar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        user={user}
        onLogout={handleLogout}
        showFilters={isScrolled && activeTab === 'marketplace'}
        filters={marketplaceFilters.filters}
        selectedFilter={marketplaceFilters.selectedFilter}
        onFilterChange={marketplaceFilters.onFilterChange}
        onMobileSearchClick={() => setShowMobileSearch(true)}
      />

      {/* Main Content */}
      <main className="flex-1 bg-background">
        <Routes>
          {/* Marketplace Route */}
          <Route
            path="/"
            element={
              <Marketplace
                user={user}
                onFiltersChange={setMarketplaceFilters}
                isScrolled={isScrolled}
                showMobileSearch={showMobileSearch}
                onCloseMobileSearch={() => setShowMobileSearch(false)}
              />
            }
          />

          {/* Seller Route */}
          <Route
            path="/seller"
            element={
              user ? <SellerDashboard user={user} /> : <Navigate to="/auth" replace />
            }
          />

          {/* Wallet Route */}
          <Route
            path="/wallet"
            element={
              user ? <WalletPage user={user} /> : <Navigate to="/auth" replace />
            }
          />

          {/* Profile Route */}
          <Route
            path="/profile"
            element={
              user ? (
                <ProfilePage
                  user={user}
                  onLogout={handleLogout}
                  onNavigateToSeller={() => navigate('/seller')}
                  onViewPropertyDetails={() => navigate('/seller')}
                />
              ) : (
                <Navigate to="/auth" replace />
              )
            }
          />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* OAuth2 Callback Route */}
        <Route path="/auth/callback" element={<OAuth2Callback />} />

        {/* Auth Route */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Main App Routes */}
        <Route path="/*" element={<AppContent />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
