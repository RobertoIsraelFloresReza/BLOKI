import { useState } from 'react'
import { Navbar } from '@/components/layout'
import { Marketplace } from '@/pages/marketplace'

function App() {
  const [activeTab, setActiveTab] = useState('marketplace')

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      {/* Floating Navbar */}
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <main>
        {activeTab === 'marketplace' && <Marketplace />}
        {activeTab === 'explore' && (
          <div className="container mx-auto px-4 py-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Explorar</h2>
            <p className="text-muted-foreground">Próximamente...</p>
          </div>
        )}
        {activeTab === 'portfolio' && (
          <div className="container mx-auto px-4 py-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Mi Portfolio</h2>
            <p className="text-muted-foreground">Próximamente...</p>
          </div>
        )}
        {activeTab === 'profile' && (
          <div className="container mx-auto px-4 py-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Perfil</h2>
            <p className="text-muted-foreground">Próximamente...</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
