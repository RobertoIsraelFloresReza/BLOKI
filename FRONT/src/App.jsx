import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Navbar, Footer } from '@/components/layout'
import { Marketplace } from '@/pages/marketplace'
import { PropertyDetailsPage } from '@/pages/property'
import { AuthPage } from '@/pages/auth'
import { OAuth2Callback } from '@/pages/auth/OAuth2Callback'
import { ProfilePage } from '@/pages/profile'
import { WalletPage } from '@/pages/wallet'
import { SellerDashboard } from '@/pages/seller'
import { EvaluatorsPage, EvaluatorProfile } from '@/pages/evaluators'
import { useStrings } from '@/utils/localizations/useStrings'
import { useAuth } from '@/hooks/useAuth'

function AppContent() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout: logoutMutation, isLoading } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [marketplaceFilters, setMarketplaceFilters] = useState({ filters: [], selectedFilter: 'all', onFilterChange: null })
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const Strings = useStrings()

  // Determine active tab from location
  const activeTab = location.pathname === '/seller' ? 'seller'
    : location.pathname === '/wallet' ? 'wallet'
    : location.pathname === '/profile' ? 'profile'
    : location.pathname.startsWith('/evaluators') ? 'evaluators'
    : location.pathname.startsWith('/property/') ? 'marketplace' // Property details is part of marketplace
    : 'marketplace'

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 600)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    logoutMutation()
    navigate('/')
  }

  const handleTabChange = (tab) => {
    console.log('🟢 [App] handleTabChange called with tab:', tab)
    const routes = {
      'marketplace': '/',
      'evaluators': '/evaluators',
      'seller': '/seller',
      'wallet': '/wallet',
      'profile': '/profile'
    }
    console.log('🟢 [App] Navigating to:', routes[tab] || '/')
    navigate(routes[tab] || '/')
  }

  return (
    <div className="relative w-full min-h-screen pb-20 lg:pb-0 flex flex-col">
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
      <main className="w-full flex-1 bg-transparent pb-20 lg:pb-0 pt-20 lg:pt-24">
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

          {/* Property Details Route */}
          <Route
            path="/property/:id"
            element={<PropertyDetailsPage user={user} />}
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

          {/* Evaluators Routes - Public */}
          <Route path="/evaluators" element={<EvaluatorsPage />} />
          <Route path="/evaluators/:id" element={<EvaluatorProfile />} />
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
