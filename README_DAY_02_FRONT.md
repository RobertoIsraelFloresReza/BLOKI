# 📘 BLOCKI - FRONTEND TECHNICAL DOCUMENTATION
## Day 02 - Comprehensive Frontend Architecture & Implementation Guide

> **Stellar Buenos Aires 2025 Hackathon**
> **Project:** Blocki - Tokenized Real Estate Investment Platform
> **Category:** Blockchain & Real Estate
> **Last Updated:** January 21, 2025
> **Version:** 2.0.0

---

## 📑 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Project Architecture](#3-project-architecture)
4. [Directory Structure](#4-directory-structure)
5. [Core Features & Functionality](#5-core-features--functionality)
6. [Component System](#6-component-system)
7. [Services & API Integration](#7-services--api-integration)
8. [State Management](#8-state-management)
9. [Routing Architecture](#9-routing-architecture)
10. [Authentication & Authorization](#10-authentication--authorization)
11. [Blockchain Integration](#11-blockchain-integration)
12. [Styling System](#12-styling-system)
13. [Internationalization](#13-internationalization)
14. [Build & Development](#14-build--development)
15. [Environment Configuration](#15-environment-configuration)
16. [Performance Optimization](#16-performance-optimization)
17. [Security Considerations](#17-security-considerations)
18. [Testing Strategy](#18-testing-strategy)
19. [Deployment Pipeline](#19-deployment-pipeline)
20. [Troubleshooting Guide](#20-troubleshooting-guide)

---

## 1. Project Overview

### 1.1 Executive Summary

**Blocki** es una plataforma revolucionaria de inversión inmobiliaria tokenizada que democratiza el acceso al mercado inmobiliario en América Latina mediante la tecnología blockchain de Stellar. El proyecto permite a inversores comprar propiedades completas o fracciones tokenizadas, comenzando desde $100 USD, eliminando las barreras tradicionales de entrada al mercado inmobiliario.

### 1.2 Core Value Propositions

#### Para Inversores
- **Inversión Fraccionada:** Acceso desde $100 USD mediante tokens ERC-like en Stellar
- **Liquidez 24/7:** Marketplace activo para compra/venta de tokens
- **Transparencia Total:** Toda la información verificable on-chain
- **Diversificación:** Portfolio diversificado de propiedades sin grandes capitales
- **KYC Zero-Knowledge:** Verificación de identidad preservando privacidad

#### Para Propietarios/Vendedores
- **Tokenización Automática:** Deploy de smart contracts con un click
- **Acceso a Capital:** Liquidez inmediata mediante venta de tokens
- **Menor Fricción:** Eliminación de intermediarios tradicionales
- **Evaluaciones Certificadas:** Red de evaluadores verificados
- **Gestión Simplificada:** Dashboard completo para tracking

#### Para Evaluadores
- **Certificación On-chain:** Credenciales verificables en blockchain
- **Reputación Permanente:** Sistema de confianza inmutable
- **Monetización:** Ingresos por evaluaciones profesionales

### 1.3 Technical Highlights

```
┌─────────────────────────────────────────────────────────────┐
│                     BLOCKI FRONTEND                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ⚛️  React 19.2.0        Ultra-modern React features       │
│  ⚡ Vite 7.2.2          Lightning-fast HMR & builds        │
│  🎨 Tailwind CSS v4     Next-gen utility CSS               │
│  🔄 TanStack Query v5   Powerful server state management   │
│  ⭐ Stellar SDK 14.3.2  Complete blockchain integration    │
│  🌐 React Router v7     Advanced client-side routing       │
│  🎭 Framer Motion       Smooth 60fps animations            │
│  🌍 i18next             Multi-language support (ES/EN)     │
│  🎯 TypeScript Ready    Fully typed with JSDoc             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 1.4 Repository Information

```bash
# Repository
git clone https://github.com/Cambar-Solutions/blocki-stellar-web-app.git

# Current Branch
main

# Last Commit
1700fd9 - Add changes summary documentation

# Working Tree Status
Clean (no uncommitted changes)
```

---

## 2. Technology Stack

### 2.1 Core Framework Stack

#### React Ecosystem
```json
{
  "react": "19.2.0",
  "react-dom": "19.2.0",
  "react-router-dom": "7.9.5"
}
```

**React 19 Features Utilized:**
- **Concurrent Rendering:** Improved responsiveness during heavy operations
- **Automatic Batching:** Multiple state updates batched automatically
- **Transitions API:** Smooth loading states with `useTransition`
- **Server Components Ready:** Architecture prepared for RSC migration
- **Improved Suspense:** Better loading boundary handling

**Why React 19?**
- Latest stable version with performance improvements
- Better TypeScript inference
- Improved DevTools integration
- Future-proof for upcoming features

#### Build System
```json
{
  "vite": "7.2.2",
  "@vitejs/plugin-react": "5.1.0"
}
```

**Vite Advantages:**
- ⚡ **Instant Server Start:** Native ESM-based dev server
- 🔥 **Hot Module Replacement:** Sub-100ms updates
- 📦 **Optimized Builds:** Rollup-based production builds
- 🎯 **Smart Dependency Pre-bundling:** esbuild-powered
- 🔌 **Rich Plugin Ecosystem:** Extensible architecture

**Vite Configuration:**
```javascript
// vite.config.js
export default defineConfig({
  plugins: [
    react({
      // Fast Refresh for instant component updates
      fastRefresh: true,
      // JSX automatic runtime
      jsxRuntime: 'automatic'
    }),
    tailwindcss() // Tailwind v4 integration
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src') // Absolute imports
    }
  },
  server: {
    port: 5173,
    open: true, // Auto-open browser
    cors: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Disabled for production
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          stellar: ['@stellar/stellar-sdk'],
          query: ['@tanstack/react-query']
        }
      }
    }
  }
})
```

### 2.2 Styling & UI Framework

#### Tailwind CSS v4
```json
{
  "tailwindcss": "4.1.17",
  "@tailwindcss/vite": "4.1.17"
}
```

**Tailwind v4 Revolutionary Changes:**

**Before (v3):**
```javascript
// tailwind.config.js required
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: { extend: {...} }
}
```

**After (v4):**
```css
/* Direct in CSS - No config file needed! */
@import "tailwindcss";

@theme {
  --color-primary: oklch(0.50 0.20 250);
  --font-sans: Inter, system-ui, sans-serif;
}
```

**Key v4 Improvements:**
- 🎨 **Native CSS Variables:** CSS custom properties instead of JS config
- 🚀 **Lightning Oxide Engine:** 10x faster compilation (Rust-based)
- 📦 **Zero-Config:** Works out of the box
- 🎯 **Better IntelliSense:** IDE autocomplete improved
- 🌈 **OKLCH Colors:** Perceptually uniform color space

#### Utility Libraries
```json
{
  "class-variance-authority": "0.7.1",  // Component variants
  "clsx": "2.1.1",                      // Conditional classes
  "tailwind-merge": "3.4.0"             // Smart class merging
}
```

**Component Variant Example:**
```javascript
import { cva } from 'class-variance-authority'

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg font-medium transition-all",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary/90",
        outline: "border-2 border-primary text-primary hover:bg-primary/10",
        ghost: "hover:bg-accent hover:text-accent-foreground"
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-10 px-4 text-base",
        lg: "h-11 px-8 text-lg"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md"
    }
  }
)

// Usage
<Button variant="outline" size="lg">Click Me</Button>
```

### 2.3 State Management & Data Fetching

#### TanStack Query (React Query v5)
```json
{
  "@tanstack/react-query": "5.90.7",
  "@tanstack/react-query-devtools": "5.90.2"
}
```

**Why TanStack Query?**
- ✅ **Server State Specialist:** Designed for async data
- 🔄 **Auto Caching:** Intelligent background refetching
- 🎯 **Optimistic Updates:** Instant UI feedback
- 📊 **DevTools:** Powerful debugging interface
- 🔌 **Lightweight:** 13kb gzipped

**Configuration:**
```javascript
// main.jsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,                      // Single retry on failure
      refetchOnWindowFocus: false,   // Disable auto-refetch on tab focus
      staleTime: 5 * 60 * 1000,      // 5 minutes (data considered fresh)
      gcTime: 10 * 60 * 1000,        // 10 minutes (garbage collection)
    },
    mutations: {
      retry: 0,                      // No retries for mutations
    }
  }
})
```

**Query Key Strategy:**
```javascript
// Hierarchical query keys for precise cache invalidation
['properties', 'list', { category: 'houses', city: 'Buenos Aires' }]
['properties', 'detail', propertyId]
['properties', 'my-owned']
['wallet', 'balance', walletAddress]
['auth', 'user']
```

**Cache Invalidation Flow:**
```javascript
// After creating a property
await createPropertyMutation.mutateAsync(newProperty)

// Invalidate related queries
queryClient.invalidateQueries({ queryKey: ['properties', 'list'] })
queryClient.invalidateQueries({ queryKey: ['properties', 'my-owned'] })
```

### 2.4 Blockchain Integration

#### Stellar SDK
```json
{
  "@stellar/stellar-sdk": "14.3.2",
  "@stellar/freighter-api": "5.0.0"
}
```

**Stellar SDK Capabilities:**
- 🔐 **Account Management:** Create, fund, query accounts
- 💸 **Transactions:** Build, sign, submit transactions
- 📝 **Smart Contracts:** Soroban contract invocation
- 🔍 **Horizon API:** Query ledger data
- ⚡ **Soroban RPC:** Direct contract interaction

**Freighter Wallet Integration:**
```javascript
import { isConnected, getPublicKey, signTransaction } from '@stellar/freighter-api'

// Check if Freighter is installed
const hasFreighter = await isConnected()

// Get user's public key
const publicKey = await getPublicKey()

// Sign transaction
const signedXDR = await signTransaction(transactionXDR, {
  network: 'TESTNET',
  accountToSign: publicKey
})
```

**Network Configuration:**
```javascript
// src/shared/constants/stellar.js
export const STELLAR_CONFIG = {
  NETWORK: 'testnet',
  NETWORK_PASSPHRASE: 'Test SDF Network ; September 2015',
  SOROBAN_RPC_URL: 'https://soroban-testnet.stellar.org:443',
  HORIZON_URL: 'https://horizon-testnet.stellar.org',

  // Transaction settings
  BASE_FEE: '100',           // 100 stroops
  TIMEOUT: 180,              // 3 minutes

  // Contract IDs (populated after deployment)
  PROPERTY_TOKEN_DEPLOYER: process.env.VITE_PROPERTY_TOKEN_DEPLOYER_ID,
  MARKETPLACE_CONTRACT: process.env.VITE_MARKETPLACE_CONTRACT_ID,
  ESCROW_CONTRACT: process.env.VITE_ESCROW_CONTRACT_ID,
  REGISTRY_CONTRACT: process.env.VITE_REGISTRY_CONTRACT_ID
}
```

### 2.5 HTTP Client & API

#### Axios
```json
{
  "axios": "1.13.2"
}
```

**Axios Instance with Interceptors:**
```javascript
// src/services/api.js
import axios from 'axios'
import toast from 'react-hot-toast'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request Interceptor: Auto-attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('blocki_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor: Global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Auto-logout on unauthorized
      localStorage.removeItem('blocki_token')
      localStorage.removeItem('blocki_user')
      window.location.href = '/auth'
      toast.error('Sesión expirada. Por favor inicia sesión nuevamente.')
    } else if (error.response?.status === 500) {
      toast.error('Error del servidor. Intenta nuevamente.')
    } else if (error.code === 'ECONNABORTED') {
      toast.error('Tiempo de espera agotado. Verifica tu conexión.')
    }
    return Promise.reject(error)
  }
)

export default api
```

### 2.6 UI Component Libraries

#### Radix UI
```json
{
  "@radix-ui/react-tabs": "1.1.13"
}
```

**Why Radix UI?**
- ♿ **Accessibility First:** WAI-ARIA compliant
- 🎨 **Unstyled:** Full styling control with Tailwind
- ⌨️ **Keyboard Navigation:** Built-in
- 🎯 **Composable:** Flexible component composition

#### Animation Library
```json
{
  "framer-motion": "12.23.24"
}
```

**Framer Motion Capabilities:**
```javascript
import { motion } from 'framer-motion'

// Stagger children animation
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1 // 100ms between each child
      }
    }
  }}
>
  {items.map((item) => (
    <motion.div
      key={item.id}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
    >
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

#### Icon Library
```json
{
  "lucide-react": "0.553.0"
}
```

**Lucide Icons Features:**
- 🎨 **1000+ Icons:** Comprehensive library
- 📦 **Tree-shakeable:** Only imports used icons
- 🎯 **Consistent Design:** 24x24 grid
- ⚡ **Lightweight:** Average 1kb per icon

**Usage:**
```javascript
import { Home, Wallet, Building2, User } from 'lucide-react'

<Home className="w-5 h-5 text-primary" />
```

#### UI Enhancements
```json
{
  "vaul": "1.1.2",              // Drawer/Sheet components
  "react-hot-toast": "2.6.0"    // Toast notifications
}
```

**Toast Notifications:**
```javascript
import toast from 'react-hot-toast'

// Success
toast.success('Propiedad creada exitosamente')

// Error
toast.error('Error al procesar la transacción')

// Loading
const toastId = toast.loading('Subiendo imágenes...')
toast.success('Imágenes subidas', { id: toastId })

// Custom
toast.custom((t) => (
  <div className="bg-card p-4 rounded-lg shadow-lg">
    <h3>Transacción completada</h3>
    <p>Hash: {txHash}</p>
  </div>
))
```

### 2.7 Internationalization

#### i18next
```json
{
  "i18next": "25.6.3",
  "react-i18next": "16.3.5",
  "i18next-browser-languagedetector": "8.2.0"
}
```

**i18n Configuration:**
```javascript
// src/config/i18n.js
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: require('./locales/en.json') },
      es: { translation: require('./locales/es.json') }
    },
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false // React already escapes
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  })
```

**Usage in Components:**
```javascript
import { useTranslation } from 'react-i18next'

function Component() {
  const { t, i18n } = useTranslation()

  return (
    <div>
      <h1>{t('marketplace.title')}</h1>
      <button onClick={() => i18n.changeLanguage('en')}>
        English
      </button>
    </div>
  )
}
```

### 2.8 Development Tools

#### ESLint
```json
{
  "eslint": "9.39.1",
  "@eslint/js": "9.39.1",
  "eslint-plugin-react-hooks": "7.0.1",
  "eslint-plugin-react-refresh": "0.4.24"
}
```

**ESLint v9 Flat Config:**
```javascript
// eslint.config.js
import js from '@eslint/js'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module'
      }
    },
    settings: { react: { version: '19.2' } },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }
      ],
      'no-unused-vars': ['error', {
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_'
      }]
    }
  }
]
```

### 2.9 Package Summary Table

| Category | Package | Version | Purpose |
|----------|---------|---------|---------|
| **Core** | react | 19.2.0 | UI library |
| | react-dom | 19.2.0 | React renderer |
| | react-router-dom | 7.9.5 | Routing |
| **Build** | vite | 7.2.2 | Build tool |
| | @vitejs/plugin-react | 5.1.0 | React plugin |
| **Styling** | tailwindcss | 4.1.17 | CSS framework |
| | @tailwindcss/vite | 4.1.17 | Tailwind plugin |
| | class-variance-authority | 0.7.1 | Variants |
| | clsx | 2.1.1 | Class utility |
| | tailwind-merge | 3.4.0 | Class merger |
| **State** | @tanstack/react-query | 5.90.7 | Data fetching |
| | @tanstack/react-query-devtools | 5.90.2 | DevTools |
| **Blockchain** | @stellar/stellar-sdk | 14.3.2 | Stellar SDK |
| | @stellar/freighter-api | 5.0.0 | Wallet |
| **HTTP** | axios | 1.13.2 | HTTP client |
| **UI** | @radix-ui/react-tabs | 1.1.13 | Tabs |
| | framer-motion | 12.23.24 | Animation |
| | lucide-react | 0.553.0 | Icons |
| | vaul | 1.1.2 | Drawer |
| | react-hot-toast | 2.6.0 | Toasts |
| **i18n** | i18next | 25.6.3 | i18n core |
| | react-i18next | 16.3.5 | React i18n |
| | i18next-browser-languagedetector | 8.2.0 | Lang detect |
| **Lint** | eslint | 9.39.1 | Linter |
| | eslint-plugin-react-hooks | 7.0.1 | Hooks lint |
| | eslint-plugin-react-refresh | 0.4.24 | Refresh lint |

---

## 3. Project Architecture

### 3.1 Architectural Pattern

**Blocki Frontend utiliza una arquitectura modular en capas:**

```
┌─────────────────────────────────────────────────────────────┐
│                         UI Layer                            │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐           │
│  │   Pages    │  │ Components │  │   Layout   │           │
│  └────────────┘  └────────────┘  └────────────┘           │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────┴────────────────────────────────────┐
│                     Business Logic Layer                    │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐           │
│  │Custom Hooks│  │  Contexts  │  │  Services  │           │
│  └────────────┘  └────────────┘  └────────────┘           │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────┴────────────────────────────────────┐
│                      Data Layer                             │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐           │
│  │TanStack Q. │  │    API     │  │  Stellar   │           │
│  └────────────┘  └────────────┘  └────────────┘           │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Data Flow Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     USER INTERACTION                         │
└────────────────────────┬─────────────────────────────────────┘
                         ▼
┌──────────────────────────────────────────────────────────────┐
│                  REACT COMPONENT                             │
│  • UI Event (onClick, onChange, etc.)                        │
│  • Calls custom hook method                                  │
└────────────────────────┬─────────────────────────────────────┘
                         ▼
┌──────────────────────────────────────────────────────────────┐
│                  CUSTOM HOOK                                 │
│  • useProperties(), useAuth(), useWallet()                   │
│  • TanStack Query mutation/query                             │
└────────────────────────┬─────────────────────────────────────┘
                         ▼
┌──────────────────────────────────────────────────────────────┐
│                  SERVICE LAYER                               │
│  • propertyService.createProperty()                          │
│  • Axios HTTP request                                        │
└────────────────────────┬─────────────────────────────────────┘
                         ▼
┌──────────────────────────────────────────────────────────────┐
│                  BACKEND API                                 │
│  • Express.js REST API                                       │
│  • Business logic & validation                               │
│  • Database operations (PostgreSQL)                          │
│  • Blockchain transactions (Stellar)                         │
└────────────────────────┬─────────────────────────────────────┘
                         ▼
┌──────────────────────────────────────────────────────────────┐
│               RESPONSE FLOW (REVERSE)                        │
│                                                              │
│  Backend Response → Service → Hook → Component → UI Update  │
│                                                              │
│  • TanStack Query updates cache                              │
│  • Component re-renders with new data                        │
│  • Toast notification shows success/error                    │
└──────────────────────────────────────────────────────────────┘
```

### 3.3 Component Hierarchy

```
App.jsx
│
├── QueryClientProvider (TanStack Query)
│   └── ThemeProvider (Dark/Light mode)
│       └── Router (React Router)
│           │
│           ├── /auth (Auth Layout)
│           │   ├── AuthPage.jsx
│           │   └── OAuth2Callback.jsx
│           │
│           └── / (Main Layout)
│               ├── Navbar.jsx
│               │   ├── DesktopNav
│               │   ├── MobileNav
│               │   ├── ThemeToggle
│               │   ├── LanguageSwitcher
│               │   └── WalletConnect
│               │
│               ├── Main Content (Routes)
│               │   ├── /marketplace (MarketplacePage)
│               │   │   ├── MarketplaceHeader
│               │   │   ├── FiltersTabs
│               │   │   ├── SearchBar
│               │   │   └── PropertyCard[] (Grid)
│               │   │
│               │   ├── /property/:id (PropertyDetailsPage)
│               │   │   ├── PropertyDetails
│               │   │   ├── ImageGallery
│               │   │   ├── TokenInfo
│               │   │   └── PurchaseDialog
│               │   │
│               │   ├── /seller (SellerDashboard)
│               │   │   ├── PropertyUploadForm
│               │   │   ├── MyPropertiesList
│               │   │   └── PropertyCardProfile[]
│               │   │
│               │   ├── /wallet (WalletPage)
│               │   │   ├── WalletConnect
│               │   │   ├── BalanceCards
│               │   │   └── TransactionTable
│               │   │
│               │   ├── /profile (ProfilePage)
│               │   │   ├── UserInfo
│               │   │   ├── KYCStatus
│               │   │   ├── MyInvestments
│               │   │   └── MyOwnedProperties
│               │   │
│               │   └── /evaluators (EvaluatorsPage)
│               │       ├── EvaluatorCard[]
│               │       └── EvaluatorProfile
│               │
│               └── Footer.jsx
│                   ├── FooterLinks
│                   ├── SocialLinks
│                   └── HackathonBadge
```

### 3.4 Separation of Concerns

#### Presentation Components
**Location:** `src/components/ui/`
**Responsibility:** Pure UI, no business logic
**Example:** Button, Card, Dialog, Badge

```javascript
// button.jsx - Pure presentation
export function Button({ variant, size, className, children, ...props }) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </button>
  )
}
```

#### Container Components
**Location:** `src/pages/`, `src/components/marketplace/`, etc.
**Responsibility:** Business logic, data fetching
**Example:** Marketplace, PropertyDetails

```javascript
// Marketplace.jsx - Container with business logic
export function Marketplace() {
  const [filters, setFilters] = useState({ category: 'all' })
  const { data: properties, isLoading } = useProperties(filters)
  const { user } = useAuth()

  // Business logic
  const handleFilterChange = (category) => {
    setFilters({ ...filters, category })
  }

  return (
    <div>
      <FiltersTabs onFilterChange={handleFilterChange} />
      {isLoading ? <Skeleton /> : <PropertyGrid properties={properties} />}
    </div>
  )
}
```

#### Service Layer
**Location:** `src/services/`
**Responsibility:** API communication, data transformation
**Example:** propertyService, authService

```javascript
// propertyService.js
export const propertyService = {
  async getProperties(filters = {}) {
    const queryString = buildQueryParams(filters)
    const response = await api.get(`/properties?${queryString}`)
    return unwrapResponse(response.data)
  },

  async createProperty(propertyData, images) {
    // FormData creation
    const formData = new FormData()
    formData.append('data', JSON.stringify(propertyData))
    images.forEach((img) => formData.append('images', img))

    const response = await api.post('/properties', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return unwrapResponse(response.data)
  }
}
```

#### Custom Hooks
**Location:** `src/hooks/`
**Responsibility:** Reusable stateful logic
**Example:** useAuth, useProperties, useWallet

```javascript
// useProperties.js
export function useProperties(filters = {}) {
  return useQuery({
    queryKey: ['properties', 'list', filters],
    queryFn: () => propertyService.getProperties(filters),
    staleTime: 5 * 60 * 1000
  })
}

export function useCreateProperty() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ propertyData, images }) =>
      propertyService.createProperty(propertyData, images),
    onSuccess: () => {
      // Invalidate cache
      queryClient.invalidateQueries({ queryKey: ['properties'] })
      toast.success('Propiedad creada exitosamente')
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`)
    }
  })
}
```

### 3.5 Code Organization Principles

#### 1. Feature-Based Structure
```
components/
├── marketplace/    # Marketplace-specific components
├── properties/     # Property-specific components
├── wallet/         # Wallet-specific components
└── ui/             # Shared UI components
```

#### 2. Barrel Exports
```javascript
// components/ui/index.js
export { Button } from './button'
export { Card, CardHeader, CardTitle, CardContent } from './card'
export { Dialog, DialogContent, DialogTitle } from './dialog'

// Usage
import { Button, Card, Dialog } from '@/components/ui'
```

#### 3. Absolute Imports
```javascript
// Instead of: '../../../components/ui/button'
import { Button } from '@/components/ui'
import { useAuth } from '@/hooks'
import { propertyService } from '@/services'
```

#### 4. Constants Centralization
```javascript
// src/shared/constants/api.js
export const API_ENDPOINTS = {
  PROPERTIES: '/properties',
  AUTH: '/auth',
  WALLET: '/wallet'
}

// src/shared/constants/routes.js
export const ROUTES = {
  MARKETPLACE: '/',
  PROPERTY_DETAILS: '/property/:id',
  SELLER: '/seller'
}
```

---

## 4. Directory Structure

### 4.1 Complete File Tree

```
blocki-stellar-web-app/
│
├── .claude/                              # 📚 Project Documentation
│   ├── PROJECT_OVERVIEW.md               # Hackathon overview & vision
│   ├── ARCHITECTURE.md                   # Technical architecture
│   ├── ROADMAP.md                        # Development roadmap
│   ├── DESIGN_SYSTEM.md                  # Design system guide
│   ├── ZK_KYC_IMPLEMENTATION.md          # Zero-Knowledge KYC
│   ├── API_INTEGRATION.md                # Backend API docs
│   ├── COMPONENTS_GUIDE.md               # Component guidelines
│   ├── DESIGN_RULES.md                   # Design rules & principles
│   └── integracion-2025-01-21/           # Integration documentation
│       ├── README.md
│       ├── ARCHITECTURE_INTEGRATION.md
│       ├── BACKEND_INTEGRATION.md
│       ├── DEBUGGING_GUIDE.md
│       └── STELLAR_INTEGRATION.md
│
├── public/                               # 🌐 Static Assets
│   ├── Favicon_blocki.png                # 32x32 favicon
│   ├── logo_blocki.jpg                   # Full logo (500x500)
│   ├── blocki_general.jpg                # Default property image
│   └── vite.svg                          # Vite logo
│
├── src/                                  # 💻 Source Code
│   │
│   ├── components/                       # ⚛️ React Components
│   │   │
│   │   ├── ui/                           # 🎨 Reusable UI Components
│   │   │   ├── animated-text.jsx         # Text reveal animations
│   │   │   ├── avatar.jsx                # User avatar with fallback
│   │   │   ├── badge.jsx                 # Status badges
│   │   │   ├── button.jsx                # Primary button (CVA variants)
│   │   │   ├── card.jsx                  # Card compound component
│   │   │   ├── dialog.jsx                # Modal dialogs
│   │   │   ├── drawer.jsx                # Bottom sheet (mobile)
│   │   │   ├── input.jsx                 # Form input
│   │   │   ├── label.jsx                 # Form label
│   │   │   ├── language-switcher.jsx     # EN/ES toggle
│   │   │   ├── loader.jsx                # Full-page loader
│   │   │   ├── logo.jsx                  # Blocki logo component
│   │   │   ├── scroll-reveal.jsx         # Scroll animations (Intersection Observer)
│   │   │   ├── skeleton.jsx              # Loading placeholders
│   │   │   ├── spinner.jsx               # Inline spinner
│   │   │   ├── tabs.jsx                  # Radix tabs wrapper
│   │   │   ├── theme-toggle.jsx          # Dark/light toggle
│   │   │   └── index.js                  # Barrel export
│   │   │
│   │   ├── layout/                       # 📐 Layout Components
│   │   │   ├── Navbar.jsx                # Main navigation (responsive)
│   │   │   │                             # • Desktop: Floating navbar
│   │   │   │                             # • Mobile: Top + bottom nav
│   │   │   ├── Footer.jsx                # Footer with links & socials
│   │   │   └── index.js
│   │   │
│   │   ├── marketplace/                  # 🏪 Marketplace Components
│   │   │   ├── FiltersTabs.jsx           # Category filters (All, Houses, Apartments, etc.)
│   │   │   ├── MarketplaceHeader.jsx     # Hero section with animations
│   │   │   ├── SearchBar.jsx             # Search with debounce
│   │   │   └── index.js
│   │   │
│   │   ├── properties/                   # 🏘️ Property Components
│   │   │   ├── PropertyCard.jsx          # Property card with 3D tilt effect
│   │   │   │                             # • Evaluator badge
│   │   │   │                             # • Progress bar
│   │   │   │                             # • Actions menu (sellers)
│   │   │   └── index.js
│   │   │
│   │   ├── profile/                      # 👤 Profile Components
│   │   │   ├── PropertyCardProfile.jsx   # User's property card
│   │   │   └── index.js
│   │   │
│   │   ├── seller/                       # 💼 Seller Dashboard Components
│   │   │   ├── PropertyUploadForm.jsx    # Multi-step upload form
│   │   │   │                             # • Image upload (drag & drop)
│   │   │   │                             # • Property details
│   │   │   │                             # • Tokenization settings
│   │   │   │                             # • Contract deployment
│   │   │   └── index.js
│   │   │
│   │   └── wallet/                       # 💰 Wallet Components
│   │       ├── WalletConnect.jsx         # Freighter connection UI
│   │       ├── TransactionCards.jsx      # Visual transaction cards
│   │       ├── TransactionTable.jsx      # Tabular transactions
│   │       ├── AllTransactions.jsx       # Full transaction history
│   │       └── index.js
│   │
│   ├── pages/                            # 📄 Page Components (Routes)
│   │   │
│   │   ├── auth/                         # 🔐 Authentication Pages
│   │   │   ├── AuthPage.jsx              # Login & Register forms
│   │   │   │                             # • Tab switcher
│   │   │   │                             # • OAuth buttons (Google, GitHub)
│   │   │   ├── OAuth2Callback.jsx        # OAuth callback handler
│   │   │   └── index.js
│   │   │
│   │   ├── evaluators/                   # 🎓 Evaluators Pages
│   │   │   ├── EvaluatorsPage.jsx        # Evaluators list with search
│   │   │   ├── EvaluatorProfile.jsx      # Individual evaluator profile
│   │   │   └── index.js
│   │   │
│   │   ├── marketplace/                  # 🏪 Marketplace Page
│   │   │   ├── Marketplace.jsx           # Main marketplace
│   │   │   │                             # • Filters integration
│   │   │   │                             # • Property grid
│   │   │   │                             # • Search integration
│   │   │   └── index.js
│   │   │
│   │   ├── profile/                      # 👤 Profile Page
│   │   │   ├── ProfilePage.jsx           # User profile
│   │   │   │                             # • Personal info
│   │   │   │                             # • KYC status
│   │   │   │                             # • Investments
│   │   │   │                             # • Owned properties
│   │   │   └── index.js
│   │   │
│   │   ├── property/                     # 🏠 Property Details Pages
│   │   │   ├── PropertyDetails.jsx       # Detailed property view
│   │   │   │                             # • Image carousel
│   │   │   │                             # • Token info
│   │   │   │                             # • Purchase dialog
│   │   │   │                             # • Transaction history
│   │   │   ├── PropertyDetailsPage.jsx   # Wrapper page
│   │   │   └── index.js
│   │   │
│   │   ├── seller/                       # 💼 Seller Dashboard Page
│   │   │   ├── SellerDashboard.jsx       # Seller dashboard
│   │   │   │                             # • Property upload
│   │   │   │                             # • My properties list
│   │   │   │                             # • Statistics
│   │   │   └── index.js
│   │   │
│   │   └── wallet/                       # 💰 Wallet Page
│   │       ├── WalletPage.jsx            # Wallet overview
│   │       │                             # • Balance display
│   │       │                             # • Transaction history
│   │       │                             # • Send/receive
│   │       └── index.js
│   │
│   ├── services/                         # 🔌 API Services Layer
│   │   ├── api.js                        # Axios instance & interceptors
│   │   ├── authService.js                # Authentication API
│   │   │                                 # • register, login, logout
│   │   │                                 # • OAuth (Google, GitHub)
│   │   │                                 # • Profile management
│   │   ├── evaluatorService.js           # Evaluators API
│   │   │                                 # • List evaluators
│   │   │                                 # • Get evaluator profile
│   │   ├── kycService.js                 # KYC Verification API
│   │   │                                 # • Start verification
│   │   │                                 # • Check status
│   │   │                                 # • Get transaction limits
│   │   ├── marketplaceService.js         # Marketplace API
│   │   │                                 # • Get listings
│   │   │                                 # • Create listing
│   │   │                                 # • Buy tokens
│   │   ├── mediaService.js               # Media Upload API
│   │   │                                 # • Cloudflare R2 integration
│   │   │                                 # • Image optimization
│   │   ├── ownershipService.js           # Token Ownership API
│   │   │                                 # • Get user ownerships
│   │   │                                 # • Get property distribution
│   │   ├── propertyService.js            # Properties API
│   │   │                                 # • CRUD operations
│   │   │                                 # • Image/document upload
│   │   │                                 # • Token deployment
│   │   ├── walletService.js              # Wallet API
│   │   │                                 # • Get balance
│   │   │                                 # • Transaction history
│   │   └── index.js                      # Barrel export
│   │
│   ├── hooks/                            # 🪝 Custom React Hooks
│   │   ├── useAuth.js                    # Authentication hook
│   │   │                                 # • useQuery for user
│   │   │                                 # • Mutations for login/register/logout
│   │   ├── useEvaluators.js              # Evaluators data hook
│   │   ├── useMarketplace.js             # Marketplace data hook
│   │   ├── useOwnership.js               # Ownership data hook
│   │   ├── useProperties.js              # Properties CRUD hooks
│   │   │                                 # • List, detail, create, update, delete
│   │   ├── useWallet.js                  # Wallet data hook
│   │   │                                 # • Balance, transactions
│   │   └── index.js                      # Barrel export
│   │
│   ├── contexts/                         # 🌐 React Contexts
│   │   └── ThemeContext.jsx              # Theme provider (dark/light)
│   │
│   ├── config/                           # ⚙️ Configuration Files
│   │   └── i18n.js                       # i18next configuration
│   │
│   ├── shared/                           # 🔧 Shared Utilities
│   │   ├── constants/                    # 📌 Constants
│   │   │   ├── api.js                    # API endpoints & config
│   │   │   ├── routes.js                 # Route definitions
│   │   │   └── stellar.js                # Stellar blockchain config
│   │   │
│   │   └── utils/                        # 🛠️ Utilities
│   │       ├── cn.js                     # Class name merger
│   │       └── formatters.js             # Formatting utilities
│   │                                     # • Currency, numbers, dates
│   │                                     # • Address truncation
│   │
│   ├── utils/                            # 🌍 Additional Utilities
│   │   └── localizations/                # Translation utilities
│   │       ├── Strings.js                # String constants
│   │       └── useStrings.js             # Strings hook
│   │
│   ├── lib/                              # 📚 Library Utilities
│   │   └── utils.js                      # General utilities
│   │
│   ├── styles/                           # 🎨 Styles
│   │   └── index.css                     # Additional styles
│   │
│   ├── App.jsx                           # 🚀 Main App Component
│   ├── App.css                           # App-specific styles
│   ├── main.jsx                          # 🎯 Entry Point
│   │                                     # • ReactDOM.createRoot
│   │                                     # • QueryClientProvider
│   │                                     # • ThemeProvider
│   │                                     # • Router
│   └── index.css                         # 🌈 Global Styles
│                                         # • Tailwind imports
│                                         # • CSS variables (theme)
│                                         # • Custom animations
│                                         # • Utility classes
│
├── .env.example                          # 🔐 Environment Template
├── .gitignore                            # 🚫 Git Ignore Rules
├── eslint.config.js                      # 📋 ESLint v9 Configuration
├── index.html                            # 🌐 HTML Template
├── jsconfig.json                         # ⚙️ JavaScript Configuration
│                                         # • Path aliases (@/)
├── package.json                          # 📦 Dependencies & Scripts
├── package-lock.json                     # 🔒 Lock File
├── vite.config.js                        # ⚡ Vite Configuration
├── README.md                             # 📖 Project README
├── CHANGES_SUMMARY.md                    # 📝 Recent Changes Log
├── DEBUGGING_GUIDE.md                    # 🐛 Debugging Guide
└── README_DAY_02_FRONT.md                # 📘 This Document
```

### 4.2 Directory Purpose & Responsibilities

#### `/src/components/`
**Purpose:** Reusable React components organized by feature and type

**Organization Strategy:**
- `ui/` - Pure presentational components (no business logic)
- Feature folders (`marketplace/`, `wallet/`, etc.) - Domain-specific components
- Each folder has `index.js` for barrel exports

**Naming Conventions:**
- PascalCase for components: `PropertyCard.jsx`
- camelCase for utils: `formatters.js`
- Barrel exports: `index.js`

#### `/src/pages/`
**Purpose:** Page-level components that map to routes

**Characteristics:**
- Contains business logic and data fetching
- Uses custom hooks for state management
- Composes UI components
- One page per route

#### `/src/services/`
**Purpose:** API communication layer

**Responsibilities:**
- HTTP requests via Axios
- Request/response transformation
- Error handling
- FormData creation for file uploads
- Response unwrapping

**Pattern:**
```javascript
export const entityService = {
  getAll: () => api.get('/entity'),
  getOne: (id) => api.get(`/entity/${id}`),
  create: (data) => api.post('/entity', data),
  update: (id, data) => api.put(`/entity/${id}`, data),
  delete: (id) => api.delete(`/entity/${id}`)
}
```

#### `/src/hooks/`
**Purpose:** Custom React hooks for reusable stateful logic

**Types:**
- **Data Hooks:** `useProperties`, `useWallet`, `useAuth`
- **UI Hooks:** `useTheme`, `useMediaQuery`, `useDebounce`
- **Utility Hooks:** `useLocalStorage`, `useCopyToClipboard`

**Benefits:**
- Logic reuse across components
- Separation of concerns
- Easier testing
- Clean component code

#### `/src/contexts/`
**Purpose:** React Context providers for global state

**Current Contexts:**
- `ThemeContext` - Dark/light theme preference

**When to use Context:**
- Theme preferences
- User authentication state (could move from hook to context)
- Language preferences (currently in i18next)
- Global UI state (modals, notifications)

#### `/src/shared/`
**Purpose:** Shared utilities, constants, and helpers

**Structure:**
- `constants/` - Immutable values (API endpoints, routes, Stellar config)
- `utils/` - Pure functions (formatters, validators, helpers)

**Principle:** No React dependencies - pure JavaScript

#### `/src/lib/`
**Purpose:** Third-party library configurations and wrappers

**Contents:**
- `utils.js` - General utility functions
- Could contain: `queryClient.js`, `stellarClient.js`, etc.

---

## 5. Core Features & Functionality

### 5.1 Property Marketplace

#### Overview
El marketplace es el corazón de Blocki, donde los usuarios exploran, buscan y compran propiedades tokenizadas.

#### Key Components
```
Marketplace Page
├── MarketplaceHeader
│   ├── Animated title with gradient
│   ├── Subtitle with scroll reveal
│   └── Decorative background blobs
│
├── FiltersTabs
│   ├── All properties
│   ├── Houses
│   ├── Apartments
│   ├── Hotels
│   └── Commercial
│
├── SearchBar
│   ├── Debounced input (300ms)
│   ├── Search by: name, location, address
│   └── Clear button
│
└── PropertyGrid
    └── PropertyCard[]
        ├── 3D tilt effect on hover
        ├── Image with gradient overlay
        ├── Evaluator badge (if verified)
        ├── Category icon badge
        ├── Property details (beds, baths, m²)
        ├── Token progress bar
        ├── Price per token
        └── Actions menu (sellers only)
```

#### Technical Implementation

**Data Fetching:**
```javascript
// useProperties hook
export function useProperties(filters = {}) {
  return useQuery({
    queryKey: ['properties', 'list', filters],
    queryFn: () => propertyService.getProperties(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (data) => {
      // Transform data if needed
      return data.map(property => ({
        ...property,
        pricePerToken: property.totalPrice / property.totalTokens,
        availablePercentage: (property.availableTokens / property.totalTokens) * 100
      }))
    }
  })
}
```

**Filtering Logic:**
```javascript
function Marketplace() {
  const [filters, setFilters] = useState({
    category: 'all',
    search: '',
    minPrice: null,
    maxPrice: null,
    city: null
  })

  const { data: properties, isLoading, error } = useProperties(filters)

  const handleCategoryChange = (category) => {
    setFilters(prev => ({ ...prev, category }))
  }

  const handleSearch = useDebounce((query) => {
    setFilters(prev => ({ ...prev, search: query }))
  }, 300)

  return (
    <div>
      <FiltersTabs
        activeCategory={filters.category}
        onCategoryChange={handleCategoryChange}
      />
      <SearchBar onSearch={handleSearch} />
      <PropertyGrid
        properties={properties}
        isLoading={isLoading}
      />
    </div>
  )
}
```

**PropertyCard 3D Tilt Effect:**
```javascript
function PropertyCard({ property }) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = (y - centerY) / 10
    const rotateY = (centerX - x) / 10

    setRotation({ x: rotateX, y: rotateY })
  }

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 })
  }

  return (
    <motion.div
      className="property-card"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Card content */}
    </motion.div>
  )
}
```

### 5.2 Fractional Investment System

#### Token Economics

**Property Tokenization Model:**
```javascript
// Example: $500,000 property
const propertyData = {
  totalPrice: 500000,        // USD
  totalTokens: 100000,       // 100K tokens
  pricePerToken: 5,          // $5 per token
  minInvestment: 20,         // Minimum 20 tokens = $100
  maxInvestment: 50000,      // Maximum 50K tokens = $250K
  availableTokens: 100000    // Initially all available
}

// Investor can buy:
// Minimum: 20 tokens × $5 = $100
// Maximum: 50,000 tokens × $5 = $250,000
// Ownership: (purchased tokens / 100,000) × 100%
```

**Purchase Flow:**
```
┌─────────────────────────────────────────────────────────────┐
│                  TOKEN PURCHASE FLOW                        │
└─────────────────────────────────────────────────────────────┘

1. User clicks "Invest" on PropertyCard
   ↓
2. PurchaseDialog opens
   ├── Shows token info (price, available, total)
   ├── User inputs quantity (with min/max validation)
   └── Calculates total cost in USD & XLM
   ↓
3. User confirms purchase
   ↓
4. KYC Check (via kycService.getTransactionLimit)
   ├── IF limit exceeded → Show error
   └── ELSE → Continue
   ↓
5. Wallet Balance Check
   ├── IF insufficient → Show error
   └── ELSE → Continue
   ↓
6. Smart Contract Invocation (Soroban)
   ├── Call: PropertyToken.transfer(buyer, amount)
   ├── Freighter signs transaction
   └── Submit to Stellar network
   ↓
7. Backend Update (via marketplaceService.buy)
   ├── Record transaction in PostgreSQL
   ├── Update ownership distribution
   └── Emit WebSocket event (future)
   ↓
8. Frontend Update
   ├── Invalidate queries: ['properties'], ['wallet'], ['ownership']
   ├── Show success toast
   └── Redirect to /profile or /wallet
```

**Implementation:**
```javascript
function PurchaseDialog({ property, isOpen, onClose }) {
  const [quantity, setQuantity] = useState(property.minInvestment)
  const { user } = useAuth()
  const { data: kycLimit } = useKYCLimit(user?.id)
  const { mutateAsync: buyTokens, isPending } = useBuyTokens()

  const totalCost = quantity * property.pricePerToken
  const totalCostXLM = totalCost / 0.12 // Assuming 1 XLM = $0.12

  const handlePurchase = async () => {
    try {
      // 1. Validate quantity
      if (quantity < property.minInvestment) {
        throw new Error(`Mínimo ${property.minInvestment} tokens`)
      }
      if (quantity > property.availableTokens) {
        throw new Error('Tokens insuficientes disponibles')
      }

      // 2. Check KYC limit
      if (totalCost > kycLimit?.monthlyLimit) {
        throw new Error('Excede tu límite mensual. Actualiza tu KYC.')
      }

      // 3. Execute purchase
      await buyTokens({
        propertyId: property.id,
        quantity,
        totalCost
      })

      toast.success('Tokens adquiridos exitosamente')
      onClose()
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>Invertir en {property.name}</DialogTitle>

        <div className="space-y-4">
          {/* Token info */}
          <div>
            <Label>Cantidad de tokens</Label>
            <Input
              type="number"
              min={property.minInvestment}
              max={property.availableTokens}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
            <p className="text-sm text-muted-foreground">
              Mín: {property.minInvestment} • Máx: {property.availableTokens}
            </p>
          </div>

          {/* Cost calculation */}
          <div className="bg-accent p-4 rounded-lg">
            <div className="flex justify-between">
              <span>Costo total:</span>
              <span className="font-bold">${formatPrice(totalCost)}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>En XLM:</span>
              <span>{formatNumber(totalCostXLM)} XLM</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Porcentaje de propiedad:</span>
              <span>{((quantity / property.totalTokens) * 100).toFixed(4)}%</span>
            </div>
          </div>

          {/* KYC warning */}
          {kycLimit && totalCost > kycLimit.monthlyRemaining && (
            <Alert variant="destructive">
              <AlertTitle>Límite KYC</AlertTitle>
              <AlertDescription>
                Excedes tu límite mensual restante (${formatPrice(kycLimit.monthlyRemaining)}).
                <Link to="/profile/kyc" className="underline">Actualiza tu KYC</Link>
              </AlertDescription>
            </Alert>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              onClick={handlePurchase}
              disabled={isPending || totalCost > kycLimit?.monthlyRemaining}
            >
              {isPending ? 'Procesando...' : 'Confirmar Compra'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

### 5.3 Property Publishing (Seller Dashboard)

#### Multi-Step Upload Process

```
┌─────────────────────────────────────────────────────────────┐
│             PROPERTY UPLOAD WORKFLOW                        │
└─────────────────────────────────────────────────────────────┘

Step 1: Property Details
├── Basic info: name, description, address
├── Category: houses, apartments, hotels, commercial
├── Location: country, city, coordinates (future)
├── Physical specs: bedrooms, bathrooms, area (m²)
└── Validation: All fields required

Step 2: Images Upload
├── Drag & drop or click to select
├── Multiple images (min 1, max 10)
├── Preview with delete option
├── Supported: JPG, PNG, WebP (max 5MB each)
└── Cloudflare R2 upload on submit

Step 3: Tokenization Settings
├── Total property value (USD)
├── Total tokens to issue
├── Price per token (auto-calculated)
├── Minimum investment (tokens)
├── Maximum investment (tokens)
└── Token symbol (auto-generated: PROP-{id})

Step 4: Legal Documents (Optional)
├── Property title
├── Evaluation certificate
├── Tax documents
└── PDF upload to R2

Step 5: Review & Deploy
├── Summary of all data
├── Terms & conditions checkbox
├── Deploy PropertyToken contract to Soroban
├── Create property in backend
├── Upload media to R2
└── Redirect to property details
```

**Implementation:**
```javascript
function PropertyUploadForm() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    // Step 1: Details
    name: '',
    description: '',
    category: '',
    address: '',
    country: '',
    city: '',
    bedrooms: 0,
    bathrooms: 0,
    area: 0,

    // Step 2: Images
    images: [],

    // Step 3: Tokenization
    totalPrice: 0,
    totalTokens: 0,
    minInvestment: 0,
    maxInvestment: 0,

    // Step 4: Documents
    documents: []
  })

  const { mutateAsync: createProperty, isPending } = useCreateProperty()

  const handleSubmit = async () => {
    try {
      console.log('[PropertyUpload] Starting submission...')
      console.log('[PropertyUpload] Form data:', formData)

      // 1. Create property & deploy contract
      console.log('[PropertyUpload] Creating property...')
      const property = await createProperty({
        propertyData: {
          name: formData.name,
          description: formData.description,
          category: formData.category,
          address: formData.address,
          country: formData.country,
          city: formData.city,
          bedrooms: formData.bedrooms,
          bathrooms: formData.bathrooms,
          area: formData.area,
          totalPrice: formData.totalPrice,
          totalTokens: formData.totalTokens,
          minInvestment: formData.minInvestment,
          maxInvestment: formData.maxInvestment
        },
        images: formData.images
      })

      console.log('[PropertyUpload] Property created:', property)

      // 2. Upload images to R2
      if (formData.images.length > 0) {
        console.log('[PropertyUpload] Uploading images...')
        const imageFormData = new FormData()
        formData.images.forEach((img, idx) => {
          imageFormData.append('images', img)
          console.log(`[PropertyUpload] Image ${idx}:`, img.name, img.size)
        })

        await propertyService.uploadImages(property.id, imageFormData)
        console.log('[PropertyUpload] Images uploaded successfully')
      }

      // 3. Upload documents to R2
      if (formData.documents.length > 0) {
        console.log('[PropertyUpload] Uploading documents...')
        const docFormData = new FormData()
        formData.documents.forEach((doc) => {
          docFormData.append('documents', doc)
        })

        await propertyService.uploadDocuments(property.id, docFormData)
        console.log('[PropertyUpload] Documents uploaded successfully')
      }

      toast.success('Propiedad publicada exitosamente')
      navigate(`/property/${property.id}`)
    } catch (error) {
      console.error('[PropertyUpload] Error:', error)
      toast.error(`Error: ${error.message}`)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress indicator */}
      <div className="flex justify-between mb-8">
        {[1, 2, 3, 4, 5].map((s) => (
          <div
            key={s}
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              s === step && "bg-primary text-white",
              s < step && "bg-secondary text-white",
              s > step && "bg-muted text-muted-foreground"
            )}
          >
            {s}
          </div>
        ))}
      </div>

      {/* Step content */}
      {step === 1 && <Step1Details formData={formData} setFormData={setFormData} />}
      {step === 2 && <Step2Images formData={formData} setFormData={setFormData} />}
      {step === 3 && <Step3Tokenization formData={formData} setFormData={setFormData} />}
      {step === 4 && <Step4Documents formData={formData} setFormData={setFormData} />}
      {step === 5 && <Step5Review formData={formData} />}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={() => setStep(s => Math.max(1, s - 1))}
          disabled={step === 1}
        >
          Anterior
        </Button>

        {step < 5 ? (
          <Button onClick={() => setStep(s => s + 1)}>
            Siguiente
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? 'Publicando...' : 'Publicar Propiedad'}
          </Button>
        )}
      </div>
    </div>
  )
}
```

**Image Upload with Preview:**
```javascript
function Step2Images({ formData, setFormData }) {
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files)

    // Validate
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} excede 5MB`)
        return false
      }
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        toast.error(`${file.name} no es un formato válido`)
        return false
      }
      return true
    })

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...validFiles].slice(0, 10)
    }))
  }

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  return (
    <div>
      <h2>Imágenes de la Propiedad</h2>

      {/* Drag & Drop Zone */}
      <div
        className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition"
        onClick={() => document.getElementById('image-input').click()}
        onDrop={(e) => {
          e.preventDefault()
          handleImageSelect({ target: { files: e.dataTransfer.files } })
        }}
        onDragOver={(e) => e.preventDefault()}
      >
        <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <p>Arrastra imágenes aquí o haz click para seleccionar</p>
        <p className="text-sm text-muted-foreground">
          JPG, PNG o WebP • Máx 5MB • Hasta 10 imágenes
        </p>
      </div>

      <input
        id="image-input"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={handleImageSelect}
        className="hidden"
      />

      {/* Image Previews */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        {formData.images.map((img, idx) => (
          <div key={idx} className="relative group">
            <img
              src={URL.createObjectURL(img)}
              alt={`Preview ${idx}`}
              className="w-full h-40 object-cover rounded-lg"
            />
            <button
              onClick={() => handleRemoveImage(idx)}
              className="absolute top-2 right-2 bg-destructive text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
            >
              <X className="w-4 h-4" />
            </button>
            <span className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
              {(img.size / 1024).toFixed(0)} KB
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
```

### 5.4 Evaluators System

#### Purpose
Certified property evaluators provide trust and credibility to the platform by verifying property values, condition, and legal status.

#### Evaluator Features
- **Certification Badges:** Displayed on PropertyCard if property is evaluated
- **Profile Page:** Statistics, evaluated properties, credentials
- **Trust Score:** Based on number of evaluations and user feedback
- **Blockchain Verification:** Evaluator credentials stored on-chain (future)

#### Implementation
```javascript
function EvaluatorBadge({ evaluator }) {
  return (
    <div className="absolute top-2 left-2 bg-secondary text-white px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
      <CheckCircle className="w-4 h-4" />
      <span className="text-xs font-medium">
        Evaluado por {evaluator.name}
      </span>
    </div>
  )
}

function EvaluatorProfile({ evaluatorId }) {
  const { data: evaluator, isLoading } = useEvaluator(evaluatorId)
  const { data: properties } = useEvaluatorProperties(evaluatorId)

  if (isLoading) return <Skeleton />

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4">
        <Avatar className="w-20 h-20">
          <AvatarImage src={evaluator.avatar} />
          <AvatarFallback>{evaluator.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{evaluator.name}</h1>
          <p className="text-muted-foreground">{evaluator.certification}</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">{evaluator.totalEvaluations}</div>
            <p className="text-sm text-muted-foreground">Evaluaciones</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">{evaluator.trustScore}/10</div>
            <p className="text-sm text-muted-foreground">Confianza</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">${formatCompactNumber(evaluator.totalValue)}</div>
            <p className="text-sm text-muted-foreground">Valor Evaluado</p>
          </CardContent>
        </Card>
      </div>

      {/* Evaluated Properties */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Propiedades Evaluadas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties?.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </div>
  )
}
```

### 5.5 User Authentication

#### Authentication Methods

**1. Email/Password:**
```javascript
const handleRegister = async (email, password, name) => {
  // Backend creates:
  // 1. User in PostgreSQL
  // 2. Stellar wallet (keypair generation)
  // 3. JWT token

  const response = await authService.register({ email, password, name })
  // Returns: { token, user, wallet: { publicKey, secretKey } }

  // IMPORTANT: User must save secret key!
  alert(`⚠️ GUARDA ESTA CLAVE SECRETA: ${response.wallet.secretKey}`)

  // Store token & user
  localStorage.setItem('blocki_token', response.token)
  localStorage.setItem('blocki_user', JSON.stringify(response.user))
}
```

**2. OAuth2 (Google/GitHub):**
```javascript
// Flow:
// 1. User clicks "Sign in with Google"
// 2. Redirect to backend: GET /auth/google
// 3. Backend redirects to Google OAuth
// 4. Google redirects to: /auth/callback?code=xxx&provider=google
// 5. Frontend exchanges code for token

function OAuth2Callback() {
  const [searchParams] = useSearchParams()
  const code = searchParams.get('code')
  const provider = searchParams.get('provider')
  const { mutateAsync: oauthLogin } = useOAuthLogin()

  useEffect(() => {
    if (code && provider) {
      oauthLogin({ code, provider })
        .then(() => navigate('/'))
        .catch((error) => {
          toast.error('Error de autenticación')
          navigate('/auth')
        })
    }
  }, [code, provider])

  return <Loader text="Autenticando..." />
}
```

#### Session Management

**Token Storage:**
```javascript
// After login/register
localStorage.setItem('blocki_token', token)
localStorage.setItem('blocki_user', JSON.stringify(user))

// Axios auto-attaches token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('blocki_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auto-logout on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('blocki_token')
      localStorage.removeItem('blocki_user')
      window.location.href = '/auth'
    }
    return Promise.reject(error)
  }
)
```

**Protected Routes:**
```javascript
function App() {
  const user = JSON.parse(localStorage.getItem('blocki_user'))

  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Marketplace />} />
        <Route path="/property/:id" element={<PropertyDetails />} />
        <Route path="/auth" element={<AuthPage />} />

        {/* Protected */}
        <Route
          path="/seller"
          element={user ? <SellerDashboard /> : <Navigate to="/auth" replace />}
        />
        <Route
          path="/wallet"
          element={user ? <WalletPage /> : <Navigate to="/auth" replace />}
        />
        <Route
          path="/profile"
          element={user ? <ProfilePage /> : <Navigate to="/auth" replace />}
        />
      </Routes>
    </Router>
  )
}
```

### 5.6 Wallet Management

#### Freighter Integration

**Connection Flow:**
```javascript
import { isConnected, getPublicKey } from '@stellar/freighter-api'

function WalletConnect() {
  const [isFreighterInstalled, setIsFreighterInstalled] = useState(false)
  const [connectedAddress, setConnectedAddress] = useState(null)

  useEffect(() => {
    checkFreighter()
  }, [])

  const checkFreighter = async () => {
    const installed = await isConnected()
    setIsFreighterInstalled(installed)
  }

  const handleConnect = async () => {
    try {
      if (!isFreighterInstalled) {
        window.open('https://freighter.app', '_blank')
        return
      }

      const publicKey = await getPublicKey()
      setConnectedAddress(publicKey)
      toast.success('Wallet conectada')
    } catch (error) {
      toast.error('Error al conectar Freighter')
    }
  }

  const handleDisconnect = () => {
    setConnectedAddress(null)
    toast.success('Wallet desconectada')
  }

  return (
    <div>
      {!connectedAddress ? (
        <Button onClick={handleConnect}>
          {isFreighterInstalled ? 'Conectar Freighter' : 'Instalar Freighter'}
        </Button>
      ) : (
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarFallback>
              {connectedAddress.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">
              {truncateAddress(connectedAddress)}
            </p>
            <button
              onClick={() => copyToClipboard(connectedAddress)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Copiar dirección
            </button>
          </div>
          <Button variant="outline" size="sm" onClick={handleDisconnect}>
            Desconectar
          </Button>
        </div>
      )}
    </div>
  )
}
```

#### Balance Display

```javascript
function WalletPage() {
  const { user } = useAuth()
  const { data: balance, isLoading } = useWalletBalance(user?.walletAddress)

  return (
    <div>
      <h1>Mi Wallet</h1>

      {/* XLM Balance */}
      <Card>
        <CardHeader>
          <CardTitle>Balance de XLM</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-12 w-32" />
          ) : (
            <div>
              <div className="text-4xl font-bold">
                {formatNumber(balance?.xlm)} XLM
              </div>
              <p className="text-muted-foreground">
                ≈ ${formatPrice(balance?.xlm * 0.12)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Token Balances */}
      <div className="mt-6">
        <h2>Tokens de Propiedades</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {balance?.tokens.map((token) => (
            <Card key={token.assetCode}>
              <CardHeader>
                <CardTitle className="text-lg">{token.propertyName}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(token.balance)} tokens
                </div>
                <p className="text-sm text-muted-foreground">
                  {token.percentage}% de propiedad
                </p>
                <p className="text-sm text-muted-foreground">
                  Valor: ${formatPrice(token.value)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
```

#### Transaction History

```javascript
function TransactionTable() {
  const { user } = useAuth()
  const [filters, setFilters] = useState({
    type: 'all', // all, send, receive, token_purchase
    startDate: null,
    endDate: null
  })

  const { data: transactions, isLoading } = useTransactions(
    user?.walletAddress,
    filters
  )

  return (
    <div>
      {/* Filters */}
      <div className="flex gap-2 mb-4">
        <Button
          variant={filters.type === 'all' ? 'default' : 'outline'}
          onClick={() => setFilters({ ...filters, type: 'all' })}
        >
          Todas
        </Button>
        <Button
          variant={filters.type === 'token_purchase' ? 'default' : 'outline'}
          onClick={() => setFilters({ ...filters, type: 'token_purchase' })}
        >
          Compras de Tokens
        </Button>
        <Button
          variant={filters.type === 'send' ? 'default' : 'outline'}
          onClick={() => setFilters({ ...filters, type: 'send' })}
        >
          Enviadas
        </Button>
      </div>

      {/* Table */}
      <table className="w-full">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Tipo</th>
            <th>Descripción</th>
            <th>Monto</th>
            <th>Hash</th>
          </tr>
        </thead>
        <tbody>
          {transactions?.map((tx) => (
            <tr key={tx.id}>
              <td>{formatDate(tx.createdAt)}</td>
              <td>
                <Badge variant={tx.type === 'send' ? 'destructive' : 'secondary'}>
                  {tx.type}
                </Badge>
              </td>
              <td>{tx.description}</td>
              <td className={tx.type === 'send' ? 'text-destructive' : 'text-secondary'}>
                {tx.type === 'send' ? '-' : '+'}{formatNumber(tx.amount)} {tx.asset}
              </td>
              <td>
                <button
                  onClick={() => window.open(
                    `https://stellar.expert/explorer/testnet/tx/${tx.hash}`,
                    '_blank'
                  )}
                  className="text-primary hover:underline"
                >
                  {truncateAddress(tx.hash, 6, 6)}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

### 5.7 KYC Verification

#### Zero-Knowledge KYC Architecture

**Concept:**
Users prove their identity meets requirements (age, nationality, etc.) without revealing actual personal data to the platform.

**Implementation Levels:**

```javascript
const KYC_LEVELS = {
  LEVEL_0: {
    name: 'No verificado',
    monthlyLimit: 500,
    requirements: []
  },
  LEVEL_1: {
    name: 'Verificación Básica',
    monthlyLimit: 10000,
    requirements: ['age_over_18', 'email_verified']
  },
  LEVEL_2: {
    name: 'Verificación Completa',
    monthlyLimit: 100000,
    requirements: ['age_over_18', 'email_verified', 'id_document', 'proof_of_address']
  },
  LEVEL_3: {
    name: 'Verificación Institucional',
    monthlyLimit: Infinity,
    requirements: ['level_2', 'company_registration', 'tax_id']
  }
}
```

**Verification Flow:**
```javascript
function KYCVerification() {
  const { user } = useAuth()
  const { data: kycStatus } = useKYCStatus(user?.id)
  const { mutateAsync: startVerification } = useStartKYC()

  const handleStartKYC = async (level) => {
    try {
      // 1. User initiates verification
      const result = await startVerification({ userId: user.id, level })

      // 2. Redirect to ZK proof provider (e.g., Polygon ID, zkMe)
      window.location.href = result.verificationUrl

      // 3. User completes verification off-platform
      // 4. Provider sends ZK proof to backend
      // 5. Backend verifies proof and updates user KYC level
    } catch (error) {
      toast.error('Error al iniciar verificación')
    }
  }

  return (
    <div>
      <h2>Verificación de Identidad</h2>

      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle>Estado Actual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">
                {KYC_LEVELS[`LEVEL_${kycStatus?.level}`].name}
              </p>
              <p className="text-muted-foreground">
                Límite mensual: ${formatPrice(kycStatus?.monthlyLimit)}
              </p>
            </div>
            <Badge variant={kycStatus?.level >= 2 ? 'secondary' : 'outline'}>
              Nivel {kycStatus?.level}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Options */}
      {kycStatus?.level < 3 && (
        <div className="mt-6">
          <h3>Aumentar Límite</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(KYC_LEVELS)
              .filter(([key]) => parseInt(key.split('_')[1]) > kycStatus?.level)
              .map(([key, levelData]) => (
                <Card key={key}>
                  <CardHeader>
                    <CardTitle>{levelData.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Límite: ${formatPrice(levelData.monthlyLimit)}
                    </p>
                    <ul className="list-disc list-inside text-sm mb-4">
                      {levelData.requirements.map((req) => (
                        <li key={req}>{req.replace(/_/g, ' ')}</li>
                      ))}
                    </ul>
                    <Button onClick={() => handleStartKYC(parseInt(key.split('_')[1]))}>
                      Verificar Ahora
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
```

### 5.8 User Profile

#### Profile Overview

```javascript
function ProfilePage() {
  const { user } = useAuth()
  const { data: investments } = useMyInvestments()
  const { data: ownedProperties } = useMyOwnedProperties()
  const { data: kycStatus } = useKYCStatus(user?.id)

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Avatar className="w-20 h-20">
          <AvatarImage src={user?.avatar} />
          <AvatarFallback>{user?.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">{user?.name}</h1>
          <p className="text-muted-foreground">{user?.email}</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">{investments?.length || 0}</div>
            <p className="text-sm text-muted-foreground">Inversiones</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">{ownedProperties?.length || 0}</div>
            <p className="text-sm text-muted-foreground">Propiedades Publicadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">
              ${formatCompactNumber(
                investments?.reduce((sum, inv) => sum + inv.totalValue, 0) || 0
              )}
            </div>
            <p className="text-sm text-muted-foreground">Valor Total Invertido</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold">Nivel {kycStatus?.level}</div>
              <Badge variant="secondary">KYC</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Verificación</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="investments">
        <TabsList>
          <TabsTrigger value="investments">Mis Inversiones</TabsTrigger>
          <TabsTrigger value="properties">Mis Propiedades</TabsTrigger>
          <TabsTrigger value="settings">Configuración</TabsTrigger>
        </TabsList>

        <TabsContent value="investments">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {investments?.map((investment) => (
              <Card key={investment.id}>
                <img
                  src={investment.property.image}
                  alt={investment.property.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <CardHeader>
                  <CardTitle>{investment.property.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tokens:</span>
                      <span className="font-bold">{formatNumber(investment.tokens)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Propiedad:</span>
                      <span className="font-bold">{investment.percentage}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Valor:</span>
                      <span className="font-bold">${formatPrice(investment.totalValue)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="properties">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ownedProperties?.map((property) => (
              <PropertyCardProfile key={property.id} property={property} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <Label>Nombre</Label>
                  <Input defaultValue={user?.name} />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input type="email" defaultValue={user?.email} disabled />
                </div>
                <div>
                  <Label>Wallet Address</Label>
                  <div className="flex gap-2">
                    <Input
                      value={user?.walletAddress}
                      disabled
                      className="font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      onClick={() => copyToClipboard(user?.walletAddress)}
                    >
                      Copiar
                    </Button>
                  </div>
                </div>
                <Button>Guardar Cambios</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
```

### 5.9 Multi-language Support

#### i18n Implementation

**Configuration:**
```javascript
// src/config/i18n.js
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from './locales/en.json'
import es from './locales/es.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es }
    },
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  })

export default i18n
```

**Translation Files:**
```json
// src/config/locales/es.json
{
  "marketplace": {
    "title": "Marketplace de Propiedades",
    "subtitle": "Invierte en propiedades reales con blockchain",
    "filters": {
      "all": "Todas",
      "houses": "Casas",
      "apartments": "Departamentos",
      "hotels": "Hoteles",
      "commercial": "Comercial"
    },
    "search_placeholder": "Buscar por nombre, ubicación...",
    "property_card": {
      "available_tokens": "Tokens disponibles",
      "price_per_token": "Precio por token",
      "view_details": "Ver detalles"
    }
  },
  "auth": {
    "login": "Iniciar Sesión",
    "register": "Registrarse",
    "email": "Correo electrónico",
    "password": "Contraseña",
    "name": "Nombre completo",
    "sign_in_with_google": "Continuar con Google",
    "sign_in_with_github": "Continuar con GitHub"
  }
}

// src/config/locales/en.json
{
  "marketplace": {
    "title": "Property Marketplace",
    "subtitle": "Invest in real properties with blockchain",
    "filters": {
      "all": "All",
      "houses": "Houses",
      "apartments": "Apartments",
      "hotels": "Hotels",
      "commercial": "Commercial"
    },
    "search_placeholder": "Search by name, location...",
    "property_card": {
      "available_tokens": "Available tokens",
      "price_per_token": "Price per token",
      "view_details": "View details"
    }
  },
  "auth": {
    "login": "Login",
    "register": "Register",
    "email": "Email address",
    "password": "Password",
    "name": "Full name",
    "sign_in_with_google": "Continue with Google",
    "sign_in_with_github": "Continue with GitHub"
  }
}
```

**Usage in Components:**
```javascript
import { useTranslation } from 'react-i18next'

function Marketplace() {
  const { t } = useTranslation()

  return (
    <div>
      <h1>{t('marketplace.title')}</h1>
      <p>{t('marketplace.subtitle')}</p>
      <input placeholder={t('marketplace.search_placeholder')} />
    </div>
  )
}
```

**Language Switcher Component:**
```javascript
function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const toggleLanguage = () => {
    const newLang = i18n.language === 'es' ? 'en' : 'es'
    i18n.changeLanguage(newLang)
  }

  return (
    <Button variant="ghost" size="sm" onClick={toggleLanguage}>
      <Globe className="w-4 h-4 mr-2" />
      {i18n.language.toUpperCase()}
    </Button>
  )
}
```

### 5.10 Dark/Light Theme

#### Theme System

**ThemeContext Implementation:**
```javascript
// src/contexts/ThemeContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('blocki-theme') || 'dark'
  })

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
    localStorage.setItem('blocki-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
```

**Theme Toggle Component:**
```javascript
import { useTheme } from '@/contexts/ThemeContext'
import { Sun, Moon } from 'lucide-react'

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="transition-transform hover:rotate-12"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-yellow-400" />
      ) : (
        <Moon className="w-5 h-5 text-blue-600" />
      )}
    </Button>
  )
}
```

**CSS Variables (Repeated from earlier for completeness):**
```css
/* index.css */
:root {
  --background: oklch(0.99 0 0);
  --foreground: oklch(0.15 0 0);
  --primary: oklch(0.50 0.20 250);
  --secondary: oklch(0.60 0.18 162);
  /* ... */
}

.dark {
  --background: #060010;
  --foreground: oklch(0.98 0 0);
  --primary: oklch(0.70 0.22 250);
  --secondary: oklch(0.75 0.24 162);
  /* ... */
}
```

---

## 6. Component System

### 6.1 Component Categories

#### Atomic Design Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                    ATOMIC DESIGN                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ATOMS (src/components/ui/)                                 │
│  • Button, Input, Label, Badge, Avatar                      │
│  • Smallest, indivisible components                         │
│  • No business logic                                        │
│                                                             │
│  MOLECULES (src/components/ui/)                             │
│  • Card, Dialog, Drawer, Tabs                               │
│  • Combination of atoms                                     │
│  • Simple, reusable patterns                                │
│                                                             │
│  ORGANISMS (src/components/[feature]/)                      │
│  • PropertyCard, SearchBar, TransactionTable                │
│  • Complex, feature-specific components                     │
│  • May contain business logic                               │
│                                                             │
│  TEMPLATES (src/pages/)                                     │
│  • Marketplace, PropertyDetails, SellerDashboard            │
│  • Full page layouts                                        │
│  • Orchestrate organisms                                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 UI Component Documentation

#### Button Component

**File:** `src/components/ui/button.jsx`

**Variants:**
- `default` - Primary blue background
- `destructive` - Red for dangerous actions
- `outline` - Border only
- `secondary` - Green background
- `ghost` - Transparent with hover
- `link` - Underlined text

**Sizes:**
- `sm` - 36px height
- `md` - 40px height (default)
- `lg` - 44px height
- `icon` - Square 40x40px

**Implementation:**
```javascript
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg font-medium transition-all active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary/90 shadow-sm",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
        outline: "border-2 border-primary text-primary hover:bg-primary/10",
        secondary: "bg-secondary text-white hover:bg-secondary/90",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-10 px-4 text-base",
        lg: "h-11 px-8 text-lg",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md"
    }
  }
)

export function Button({ variant, size, className, ...props }) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}
```

**Usage:**
```javascript
<Button variant="default">Primary Action</Button>
<Button variant="outline" size="sm">Secondary</Button>
<Button variant="destructive">Delete</Button>
<Button variant="ghost" size="icon">
  <X className="w-4 h-4" />
</Button>
```

#### Card Component

**File:** `src/components/ui/card.jsx`

**Compound Components:**
- `Card` - Container
- `CardHeader` - Top section
- `CardTitle` - Title text
- `CardDescription` - Subtitle text
- `CardContent` - Main content
- `CardFooter` - Bottom section

**Implementation:**
```javascript
export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card text-card-foreground shadow-sm",
        className
      )}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }) {
  return (
    <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  )
}

export function CardTitle({ className, ...props }) {
  return (
    <h3 className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
  )
}

export function CardDescription({ className, ...props }) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props} />
  )
}

export function CardContent({ className, ...props }) {
  return (
    <div className={cn("p-6 pt-0", className)} {...props} />
  )
}

export function CardFooter({ className, ...props }) {
  return (
    <div className={cn("flex items-center p-6 pt-0", className)} {...props} />
  )
}
```

**Usage:**
```javascript
<Card>
  <CardHeader>
    <CardTitle>Property Details</CardTitle>
    <CardDescription>Luxury apartment in Buenos Aires</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Content goes here...</p>
  </CardContent>
  <CardFooter>
    <Button>View More</Button>
  </CardFooter>
</Card>
```

#### Dialog Component

**File:** `src/components/ui/dialog.jsx`

**Features:**
- Modal overlay with backdrop
- Smooth fade-in/out animations
- Focus trap (keyboard navigation)
- Close on escape key
- Accessible (ARIA attributes)

**Implementation:**
```javascript
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function Dialog({ open, onOpenChange, children }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => onOpenChange(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Content */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="relative bg-card rounded-xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              {children}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}

export function DialogContent({ children, onClose }) {
  return (
    <div className="p-6">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-lg hover:bg-accent transition"
      >
        <X className="w-4 h-4" />
      </button>
      {children}
    </div>
  )
}

export function DialogTitle({ children }) {
  return <h2 className="text-2xl font-bold mb-4">{children}</h2>
}

export function DialogDescription({ children }) {
  return <p className="text-muted-foreground mb-6">{children}</p>
}
```

**Usage:**
```javascript
function Component() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Dialog</Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent onClose={() => setIsOpen(false)}>
          <DialogTitle>Confirm Action</DialogTitle>
          <DialogDescription>
            Are you sure you want to proceed?
          </DialogDescription>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
```

#### Skeleton Component

**File:** `src/components/ui/skeleton.jsx`

**Purpose:** Loading placeholders that match content shape

**Implementation:**
```javascript
export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted",
        className
      )}
      {...props}
    />
  )
}
```

**Usage:**
```javascript
// Property card skeleton
function PropertyCardSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-48 w-full" /> {/* Image */}
      <Skeleton className="h-6 w-3/4" />   {/* Title */}
      <Skeleton className="h-4 w-1/2" />   {/* Subtitle */}
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20" />  {/* Badge */}
        <Skeleton className="h-8 w-20" />
      </div>
      <Skeleton className="h-10 w-full" /> {/* Button */}
    </div>
  )
}

// Usage in page
function Marketplace() {
  const { data: properties, isLoading } = useProperties()

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <PropertyCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  return <PropertyGrid properties={properties} />
}
```

### 6.3 Feature Components Documentation

#### PropertyCard Component

**File:** `src/components/properties/PropertyCard.jsx`

**Features:**
- 3D tilt effect on hover
- Evaluator badge (if evaluated)
- Category icon badge
- Progress bar for token sales
- Expandable title/location
- Actions menu (sellers only)

**Props:**
```typescript
interface PropertyCardProps {
  property: {
    id: number
    name: string
    description: string
    category: 'houses' | 'apartments' | 'hotels' | 'commercial'
    address: string
    city: string
    country: string
    image: string
    bedrooms: number
    bathrooms: number
    area: number // m²
    totalPrice: number
    totalTokens: number
    availableTokens: number
    pricePerToken: number
    evaluator?: {
      id: number
      name: string
      avatar: string
    }
  }
  isOwner?: boolean
  onEdit?: () => void
  onDelete?: () => void
}
```

**Implementation Highlights:**
```javascript
function PropertyCard({ property, isOwner, onEdit, onDelete }) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [isExpanded, setIsExpanded] = useState(false)

  // 3D tilt effect
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = (y - centerY) / 10
    const rotateY = (centerX - x) / 10
    setRotation({ x: rotateX, y: rotateY })
  }

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 })
  }

  // Calculate percentages
  const soldPercentage = ((property.totalTokens - property.availableTokens) / property.totalTokens) * 100

  return (
    <motion.div
      className="property-card relative bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        transition: 'transform 0.1s ease-out'
      }}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={property.image || '/blocki_general.jpg'}
          alt={property.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Evaluator Badge */}
        {property.evaluator && (
          <div className="absolute top-2 left-2 bg-secondary text-white px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
            <CheckCircle className="w-4 h-4" />
            <span className="text-xs font-medium">
              Evaluado por {property.evaluator.name}
            </span>
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-2 right-2">
          <Badge variant="secondary">
            {getCategoryIcon(property.category)}
            {property.category}
          </Badge>
        </div>

        {/* Actions Menu (Owner only) */}
        {isOwner && (
          <div className="absolute bottom-2 right-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="bg-white/20 backdrop-blur">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={onEdit}>
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDelete} className="text-destructive">
                  <Trash className="w-4 h-4 mr-2" />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3
          className={cn(
            "text-lg font-bold mb-1",
            !isExpanded && "truncate"
          )}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {property.name}
        </h3>

        {/* Location */}
        <p className="text-sm text-muted-foreground mb-3 truncate">
          📍 {property.city}, {property.country}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Bed className="w-4 h-4" />
            {property.bedrooms}
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4" />
            {property.bathrooms}
          </div>
          <div className="flex items-center gap-1">
            <Maximize className="w-4 h-4" />
            {property.area}m²
          </div>
        </div>

        {/* Token Progress */}
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Tokens vendidos</span>
            <span className="font-medium">{soldPercentage.toFixed(1)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all"
              style={{ width: `${soldPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-xs mt-1 text-muted-foreground">
            <span>{formatNumber(property.availableTokens)} disponibles</span>
            <span>{formatNumber(property.totalTokens)} total</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-xs text-muted-foreground">Precio por token</p>
            <p className="text-2xl font-bold text-primary">
              ${formatPrice(property.pricePerToken)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Valor total</p>
            <p className="text-sm font-medium">
              ${formatCompactNumber(property.totalPrice)}
            </p>
          </div>
        </div>

        {/* CTA */}
        <Link to={`/property/${property.id}`}>
          <Button className="w-full">
            Ver Detalles
          </Button>
        </Link>
      </div>
    </motion.div>
  )
}

function getCategoryIcon(category) {
  const icons = {
    houses: <Home className="w-4 h-4 mr-1" />,
    apartments: <Building className="w-4 h-4 mr-1" />,
    hotels: <Hotel className="w-4 h-4 mr-1" />,
    commercial: <Store className="w-4 h-4 mr-1" />
  }
  return icons[category]
}
```

---

## 7. Services & API Integration

### 7.1 Service Layer Architecture

**Purpose:** Abstraction layer between components and backend API

**Benefits:**
- Centralized API logic
- Consistent error handling
- Easy to mock for testing
- Type safety with JSDoc
- Reusability across components

**Pattern:**
```javascript
// services/entityService.js
export const entityService = {
  // GET all
  async getAll(filters = {}) {
    const queryString = buildQueryParams(filters)
    const response = await api.get(`/entity?${queryString}`)
    return unwrapResponse(response.data)
  },

  // GET one
  async getOne(id) {
    const response = await api.get(`/entity/${id}`)
    return unwrapResponse(response.data)
  },

  // CREATE
  async create(data) {
    const response = await api.post('/entity', data)
    return unwrapResponse(response.data)
  },

  // UPDATE
  async update(id, data) {
    const response = await api.put(`/entity/${id}`, data)
    return unwrapResponse(response.data)
  },

  // DELETE
  async delete(id) {
    const response = await api.delete(`/entity/${id}`)
    return unwrapResponse(response.data)
  }
}
```

### 7.2 API Base Configuration

**File:** `src/services/api.js`

```javascript
import axios from 'axios'
import toast from 'react-hot-toast'

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor: Auto-attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('blocki_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Log request for debugging
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
      params: config.params,
      data: config.data
    })

    return config
  },
  (error) => {
    console.error('[API Request Error]', error)
    return Promise.reject(error)
  }
)

// Response interceptor: Global error handling
api.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.config.url}`, response.data)
    return response
  },
  (error) => {
    console.error('[API Response Error]', error.response || error)

    // Handle specific HTTP status codes
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Unauthorized - Auto logout
          localStorage.removeItem('blocki_token')
          localStorage.removeItem('blocki_user')
          window.location.href = '/auth'
          toast.error('Sesión expirada. Por favor inicia sesión nuevamente.')
          break

        case 403:
          // Forbidden
          toast.error('No tienes permisos para realizar esta acción.')
          break

        case 404:
          // Not found
          toast.error('Recurso no encontrado.')
          break

        case 500:
          // Server error
          toast.error('Error del servidor. Por favor intenta nuevamente.')
          break

        case 502:
        case 503:
        case 504:
          // Server down
          toast.error('Servicio no disponible. Intenta más tarde.')
          break

        default:
          // Generic error
          const message = error.response.data?.message || 'Error desconocido'
          toast.error(message)
      }
    } else if (error.code === 'ECONNABORTED') {
      // Timeout
      toast.error('Tiempo de espera agotado. Verifica tu conexión.')
    } else if (error.code === 'ERR_NETWORK') {
      // Network error
      toast.error('Error de conexión. Verifica tu internet.')
    } else {
      toast.error('Error inesperado. Intenta nuevamente.')
    }

    return Promise.reject(error)
  }
)

// Utility: Build query params
export function buildQueryParams(params) {
  const filtered = Object.entries(params)
    .filter(([_, value]) => value !== null && value !== undefined && value !== '')
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
  return filtered.join('&')
}

// Utility: Unwrap backend response
// Backend may return: { success: true, data: {...} } or { success: false, error: '...' }
export function unwrapResponse(response) {
  if (response.success === false) {
    throw new Error(response.error || 'Error en la respuesta del servidor')
  }
  return response.data || response
}

// Utility: Create FormData for file uploads
export function createFormDataRequest(data, files, fileFieldName = 'file') {
  const formData = new FormData()

  // Append data as JSON string
  formData.append('data', JSON.stringify(data))

  // Append files
  if (Array.isArray(files)) {
    files.forEach((file) => {
      formData.append(fileFieldName, file)
    })
  } else if (files) {
    formData.append(fileFieldName, files)
  }

  return formData
}

export default api
```

### 7.3 Property Service

**File:** `src/services/propertyService.js`

```javascript
import api, { buildQueryParams, unwrapResponse, createFormDataRequest } from './api'

/**
 * Property Service
 * Handles all property-related API calls
 */
export const propertyService = {
  /**
   * Get properties with optional filters
   * @param {Object} filters - Query filters
   * @param {string} [filters.category] - Property category
   * @param {string} [filters.search] - Search query
   * @param {string} [filters.city] - City filter
   * @param {number} [filters.minPrice] - Minimum price
   * @param {number} [filters.maxPrice] - Maximum price
   * @returns {Promise<Array>} Properties array
   */
  async getProperties(filters = {}) {
    console.log('[PropertyService] Getting properties with filters:', filters)

    const queryString = buildQueryParams(filters)
    const response = await api.get(`/properties${queryString ? `?${queryString}` : ''}`)

    return unwrapResponse(response.data)
  },

  /**
   * Get single property by ID
   * @param {number} id - Property ID
   * @returns {Promise<Object>} Property object
   */
  async getProperty(id) {
    console.log('[PropertyService] Getting property:', id)

    const response = await api.get(`/properties/${id}`)
    return unwrapResponse(response.data)
  },

  /**
   * Create new property & deploy token contract
   * @param {Object} propertyData - Property data
   * @param {Array<File>} images - Property images
   * @returns {Promise<Object>} Created property
   */
  async createProperty(propertyData, images = []) {
    console.log('[PropertyService] Creating property:', propertyData)
    console.log('[PropertyService] Images:', images.length)

    const formData = createFormDataRequest(propertyData, images, 'images')

    const response = await api.post('/properties', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    const result = unwrapResponse(response.data)
    console.log('[PropertyService] Property created:', result)

    return result
  },

  /**
   * Update existing property
   * @param {number} id - Property ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated property
   */
  async updateProperty(id, updates) {
    console.log('[PropertyService] Updating property:', id, updates)

    const response = await api.put(`/properties/${id}`, updates)
    return unwrapResponse(response.data)
  },

  /**
   * Delete property
   * @param {number} id - Property ID
   * @returns {Promise<void>}
   */
  async deleteProperty(id) {
    console.log('[PropertyService] Deleting property:', id)

    const response = await api.delete(`/properties/${id}`)
    return unwrapResponse(response.data)
  },

  /**
   * Upload additional images to existing property
   * @param {number} propertyId - Property ID
   * @param {FormData} formData - Images FormData
   * @returns {Promise<Object>} Upload result with URLs
   */
  async uploadImages(propertyId, formData) {
    console.log('[PropertyService] Uploading images for property:', propertyId)

    const response = await api.post(`/properties/${propertyId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return unwrapResponse(response.data)
  },

  /**
   * Upload legal documents to property
   * @param {number} propertyId - Property ID
   * @param {FormData} formData - Documents FormData
   * @returns {Promise<Object>} Upload result with URLs
   */
  async uploadDocuments(propertyId, formData) {
    console.log('[PropertyService] Uploading documents for property:', propertyId)

    const response = await api.post(`/properties/${propertyId}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return unwrapResponse(response.data)
  },

  /**
   * Get blockchain token info for property
   * @param {number} propertyId - Property ID
   * @returns {Promise<Object>} Token info from blockchain
   */
  async getTokenInfo(propertyId) {
    console.log('[PropertyService] Getting token info for property:', propertyId)

    const response = await api.get(`/properties/${propertyId}/token-info`)
    return unwrapResponse(response.data)
  },

  /**
   * Get transaction history for property
   * @param {number} propertyId - Property ID
   * @returns {Promise<Array>} Transactions array
   */
  async getPropertyHistory(propertyId) {
    console.log('[PropertyService] Getting history for property:', propertyId)

    const response = await api.get(`/properties/${propertyId}/history`)
    return unwrapResponse(response.data)
  },

  /**
   * Get user's owned properties (created by user)
   * @returns {Promise<Array>} Properties array
   */
  async getMyOwnedProperties() {
    console.log('[PropertyService] Getting my owned properties')

    const response = await api.get('/properties/my-owned')
    return unwrapResponse(response.data)
  },

  /**
   * Get user's investments (properties where user owns tokens)
   * @returns {Promise<Array>} Investments array
   */
  async getMyInvestments() {
    console.log('[PropertyService] Getting my investments')

    const response = await api.get('/properties/my-investments')
    return unwrapResponse(response.data)
  }
}
```

### 7.4 Authentication Service

**File:** `src/services/authService.js`

```javascript
import api, { unwrapResponse } from './api'

/**
 * Authentication Service
 * Handles user authentication and session management
 */
export const authService = {
  /**
   * Register new user
   * Creates user + generates Stellar wallet
   * @param {Object} userData
   * @param {string} userData.email
   * @param {string} userData.password
   * @param {string} userData.name
   * @returns {Promise<Object>} { user, token, wallet: { publicKey, secretKey } }
   */
  async register(userData) {
    console.log('[AuthService] Registering user:', userData.email)

    const response = await api.post('/auth/register', userData)
    const result = unwrapResponse(response.data)

    // Store token and user
    if (result.token) {
      localStorage.setItem('blocki_token', result.token)
      localStorage.setItem('blocki_user', JSON.stringify(result.user))
    }

    console.log('[AuthService] Registration successful')

    // IMPORTANT: User must save wallet secret key!
    if (result.wallet?.secretKey) {
      console.warn('[AuthService] WALLET SECRET KEY:', result.wallet.secretKey)
      console.warn('[AuthService] Save this key! It cannot be recovered.')
    }

    return result
  },

  /**
   * Login existing user
   * @param {Object} credentials
   * @param {string} credentials.email
   * @param {string} credentials.password
   * @returns {Promise<Object>} { user, token }
   */
  async login(credentials) {
    console.log('[AuthService] Logging in:', credentials.email)

    const response = await api.post('/auth/login', credentials)
    const result = unwrapResponse(response.data)

    // Store token and user
    if (result.token) {
      localStorage.setItem('blocki_token', result.token)
      localStorage.setItem('blocki_user', JSON.stringify(result.user))
    }

    console.log('[AuthService] Login successful')
    return result
  },

  /**
   * Logout current user
   * @returns {Promise<void>}
   */
  async logout() {
    console.log('[AuthService] Logging out')

    try {
      await api.post('/auth/logout')
    } catch (error) {
      // Continue logout even if API call fails
      console.error('[AuthService] Logout API error:', error)
    }

    // Clear local storage
    localStorage.removeItem('blocki_token')
    localStorage.removeItem('blocki_user')

    console.log('[AuthService] Logout successful')
  },

  /**
   * Get current user profile
   * @returns {Promise<Object>} User object
   */
  async getProfile() {
    console.log('[AuthService] Getting profile')

    const response = await api.get('/auth/profile')
    return unwrapResponse(response.data)
  },

  /**
   * Validate JWT token
   * @returns {Promise<boolean>} Token valid
   */
  async validateToken() {
    try {
      const response = await api.get('/auth/validate')
      return unwrapResponse(response.data).valid
    } catch (error) {
      return false
    }
  },

  /**
   * OAuth2: Get Google auth URL
   * @returns {string} Google OAuth URL
   */
  getGoogleAuthUrl() {
    return `${import.meta.env.VITE_API_URL}/auth/google`
  },

  /**
   * OAuth2: Get GitHub auth URL
   * @returns {string} GitHub OAuth URL
   */
  getGitHubAuthUrl() {
    return `${import.meta.env.VITE_API_URL}/auth/github`
  },

  /**
   * OAuth2: Exchange code for token (Google)
   * @param {string} code - OAuth code from callback
   * @returns {Promise<Object>} { user, token }
   */
  async googleCallback(code) {
    console.log('[AuthService] Google OAuth callback')

    const response = await api.post('/auth/google/callback', { code })
    const result = unwrapResponse(response.data)

    // Store token and user
    if (result.token) {
      localStorage.setItem('blocki_token', result.token)
      localStorage.setItem('blocki_user', JSON.stringify(result.user))
    }

    return result
  },

  /**
   * OAuth2: Exchange code for token (GitHub)
   * @param {string} code - OAuth code from callback
   * @returns {Promise<Object>} { user, token }
   */
  async githubCallback(code) {
    console.log('[AuthService] GitHub OAuth callback')

    const response = await api.post('/auth/github/callback', { code })
    const result = unwrapResponse(response.data)

    // Store token and user
    if (result.token) {
      localStorage.setItem('blocki_token', result.token)
      localStorage.setItem('blocki_user', JSON.stringify(result.user))
    }

    return result
  }
}
```

### 7.5 Wallet Service

**File:** `src/services/walletService.js`

```javascript
import api, { buildQueryParams, unwrapResponse } from './api'

/**
 * Wallet Service
 * Handles Stellar wallet operations and transaction history
 */
export const walletService = {
  /**
   * Get wallet balance (XLM + property tokens)
   * @param {string} walletAddress - Stellar public key
   * @returns {Promise<Object>} { xlm, tokens: [...] }
   */
  async getBalance(walletAddress) {
    console.log('[WalletService] Getting balance for:', walletAddress)

    const response = await api.get(`/wallet/balance`, {
      params: { address: walletAddress }
    })

    return unwrapResponse(response.data)
  },

  /**
   * Get transaction history
   * @param {string} walletAddress - Stellar public key
   * @param {Object} filters
   * @param {string} [filters.type] - Transaction type
   * @param {Date} [filters.startDate] - Filter from date
   * @param {Date} [filters.endDate] - Filter to date
   * @param {number} [filters.limit=50] - Results limit
   * @returns {Promise<Array>} Transactions array
   */
  async getTransactions(walletAddress, filters = {}) {
    console.log('[WalletService] Getting transactions for:', walletAddress, filters)

    const queryString = buildQueryParams({
      address: walletAddress,
      ...filters
    })

    const response = await api.get(`/wallet/transactions?${queryString}`)
    return unwrapResponse(response.data)
  },

  /**
   * Send XLM to another wallet
   * @param {Object} transferData
   * @param {string} transferData.from - Sender address
   * @param {string} transferData.to - Recipient address
   * @param {number} transferData.amount - Amount in XLM
   * @param {string} [transferData.memo] - Optional memo
   * @returns {Promise<Object>} Transaction result
   */
  async sendXLM(transferData) {
    console.log('[WalletService] Sending XLM:', transferData)

    const response = await api.post('/wallet/send', transferData)
    return unwrapResponse(response.data)
  }
}
```

### 7.6 Marketplace Service

**File:** `src/services/marketplaceService.js`

```javascript
import api, { buildQueryParams, unwrapResponse } from './api'

/**
 * Marketplace Service
 * Handles property listings and token purchases
 */
export const marketplaceService = {
  /**
   * Get marketplace listings
   * @param {Object} filters
   * @returns {Promise<Array>} Listings array
   */
  async getListings(filters = {}) {
    console.log('[MarketplaceService] Getting listings:', filters)

    const queryString = buildQueryParams(filters)
    const response = await api.get(`/marketplace/listings${queryString ? `?${queryString}` : ''}`)

    return unwrapResponse(response.data)
  },

  /**
   * Create new listing
   * @param {Object} listingData
   * @param {number} listingData.propertyId
   * @param {number} listingData.tokensForSale
   * @param {number} listingData.pricePerToken
   * @returns {Promise<Object>} Created listing
   */
  async createListing(listingData) {
    console.log('[MarketplaceService] Creating listing:', listingData)

    const response = await api.post('/marketplace/listings', listingData)
    return unwrapResponse(response.data)
  },

  /**
   * Buy property tokens
   * @param {Object} purchaseData
   * @param {number} purchaseData.propertyId
   * @param {number} purchaseData.quantity - Number of tokens
   * @param {number} purchaseData.totalCost - Total cost in USD
   * @returns {Promise<Object>} Purchase result with transaction hash
   */
  async buyTokens(purchaseData) {
    console.log('[MarketplaceService] Buying tokens:', purchaseData)

    const response = await api.post('/marketplace/listings/buy', purchaseData)
    return unwrapResponse(response.data)
  },

  /**
   * Get marketplace statistics
   * @returns {Promise<Object>} Stats object
   */
  async getStats() {
    console.log('[MarketplaceService] Getting stats')

    const response = await api.get('/marketplace/stats')
    return unwrapResponse(response.data)
  },

  /**
   * Get recent transactions/trades
   * @param {number} limit - Number of transactions
   * @returns {Promise<Array>} Recent trades
   */
  async getRecentTrades(limit = 10) {
    console.log('[MarketplaceService] Getting recent trades')

    const response = await api.get(`/marketplace/transactions?limit=${limit}`)
    return unwrapResponse(response.data)
  }
}
```

### 7.7 KYC Service

**File:** `src/services/kycService.js`

```javascript
import api, { unwrapResponse } from './api'

/**
 * KYC Service
 * Handles Zero-Knowledge KYC verification
 */
export const kycService = {
  /**
   * Start KYC verification process
   * @param {Object} data
   * @param {number} data.userId - User ID
   * @param {number} data.level - Target KYC level (1, 2, or 3)
   * @returns {Promise<Object>} { verificationUrl, externalId }
   */
  async startVerification(data) {
    console.log('[KYCService] Starting verification:', data)

    const response = await api.post('/kyc/start', data)
    return unwrapResponse(response.data)
  },

  /**
   * Get KYC status for user
   * @param {number} userId
   * @returns {Promise<Object>} { level, status, monthlyLimit, monthlyRemaining }
   */
  async getStatus(userId) {
    console.log('[KYCService] Getting KYC status for user:', userId)

    const response = await api.get(`/kyc/status/${userId}`)
    return unwrapResponse(response.data)
  },

  /**
   * Retry failed verification
   * @param {number} userId
   * @returns {Promise<Object>} New verification URL
   */
  async retryVerification(userId) {
    console.log('[KYCService] Retrying verification for user:', userId)

    const response = await api.post(`/kyc/retry/${userId}`)
    return unwrapResponse(response.data)
  },

  /**
   * Get transaction limit based on KYC level
   * @param {number} userId
   * @returns {Promise<Object>} { monthlyLimit, monthlyRemaining, level }
   */
  async getTransactionLimit(userId) {
    console.log('[KYCService] Getting transaction limit for user:', userId)

    const response = await api.get(`/kyc/transaction-limit/${userId}`)
    return unwrapResponse(response.data)
  },

  /**
   * Fix external verification ID (admin function)
   * @param {number} userId
   * @param {string} externalId
   * @returns {Promise<Object>} Updated status
   */
  async fixExternalId(userId, externalId) {
    console.log('[KYCService] Fixing external ID for user:', userId)

    const response = await api.post(`/kyc/fix-external-id/${userId}`, { externalId })
    return unwrapResponse(response.data)
  }
}
```

### 7.8 API Error Handling Patterns

**Centralized Error Handler:**
```javascript
// In components/hooks
import { toast } from 'react-hot-toast'

export function handleApiError(error, customMessage) {
  // Error already handled by interceptor (toast shown)
  // This is for component-specific logic

  if (error.response) {
    // Server responded with error status
    const status = error.response.status
    const data = error.response.data

    if (status === 400 && data.errors) {
      // Validation errors
      return data.errors
    }

    if (status === 404) {
      // Not found - maybe redirect
      console.warn('Resource not found')
    }
  }

  console.error('API Error:', error)
  return null
}

// Usage in component
try {
  await createProperty(data)
} catch (error) {
  const validationErrors = handleApiError(error)
  if (validationErrors) {
    setFormErrors(validationErrors)
  }
}
```

---

## 8. State Management

### 8.1 TanStack Query Configuration

**File:** `src/main.jsx`

```javascript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

// Create query client with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,                      // Retry failed queries once
      refetchOnWindowFocus: false,   // Don't refetch on tab focus
      refetchOnReconnect: true,      // Refetch on network reconnect
      staleTime: 5 * 60 * 1000,      // 5 minutes - data considered fresh
      gcTime: 10 * 60 * 1000,        // 10 minutes - cache garbage collection
    },
    mutations: {
      retry: 0,                      // Don't retry mutations
      onError: (error) => {
        console.error('[Mutation Error]', error)
        // Global mutation error handling
      }
    }
  }
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Your app */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

### 8.2 Query Keys Architecture

**Hierarchical Structure:**
```javascript
// src/hooks/queryKeys.js

export const queryKeys = {
  // Auth
  auth: {
    user: ['auth', 'user'],
    validate: ['auth', 'validate']
  },

  // Properties
  properties: {
    all: ['properties'],
    list: (filters) => ['properties', 'list', filters],
    detail: (id) => ['properties', 'detail', id],
    tokenInfo: (id) => ['properties', 'token-info', id],
    history: (id) => ['properties', 'history', id],
    myOwned: ['properties', 'my-owned'],
    myInvestments: ['properties', 'my-investments']
  },

  // Wallet
  wallet: {
    balance: (address) => ['wallet', 'balance', address],
    transactions: (address, filters) => ['wallet', 'transactions', address, filters]
  },

  // Marketplace
  marketplace: {
    listings: (filters) => ['marketplace', 'listings', filters],
    stats: ['marketplace', 'stats'],
    trades: (limit) => ['marketplace', 'trades', limit]
  },

  // Evaluators
  evaluators: {
    all: ['evaluators'],
    list: (filters) => ['evaluators', 'list', filters],
    detail: (id) => ['evaluators', 'detail', id],
    properties: (id) => ['evaluators', 'properties', id]
  },

  // KYC
  kyc: {
    status: (userId) => ['kyc', 'status', userId],
    limit: (userId) => ['kyc', 'limit', userId]
  }
}
```

### 8.3 Custom Hooks with TanStack Query

#### useAuth Hook

**File:** `src/hooks/useAuth.js`

```javascript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authService } from '@/services'
import { queryKeys } from './queryKeys'
import toast from 'react-hot-toast'

/**
 * Get current authenticated user
 */
export function useAuth() {
  return useQuery({
    queryKey: queryKeys.auth.user,
    queryFn: async () => {
      // Check if token exists
      const token = localStorage.getItem('blocki_token')
      if (!token) {
        return null
      }

      // Validate token and get user
      try {
        return await authService.getProfile()
      } catch (error) {
        // Token invalid - clear storage
        localStorage.removeItem('blocki_token')
        localStorage.removeItem('blocki_user')
        return null
      }
    },
    staleTime: Infinity, // User data rarely changes
    retry: false
  })
}

/**
 * Register mutation
 */
export function useRegister() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      // Update user cache
      queryClient.setQueryData(queryKeys.auth.user, data.user)

      // Show wallet secret key warning
      if (data.wallet?.secretKey) {
        toast.custom((t) => (
          <div className="bg-destructive text-white p-6 rounded-lg shadow-2xl max-w-md">
            <h3 className="font-bold text-lg mb-2">⚠️ GUARDA TU CLAVE SECRETA</h3>
            <p className="mb-4 text-sm">
              Esta es la ÚNICA vez que verás esta clave. Guárdala en un lugar seguro.
              Sin ella, perderás acceso a tu wallet.
            </p>
            <code className="block bg-black/20 p-3 rounded text-xs break-all mb-4">
              {data.wallet.secretKey}
            </code>
            <button
              onClick={() => {
                navigator.clipboard.writeText(data.wallet.secretKey)
                toast.success('Clave copiada al portapapeles')
              }}
              className="w-full bg-white text-destructive py-2 rounded font-bold"
            >
              Copiar Clave
            </button>
          </div>
        ), { duration: Infinity }) // Never auto-dismiss
      }

      toast.success('Cuenta creada exitosamente')
    }
  })
}

/**
 * Login mutation
 */
export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.auth.user, data.user)
      toast.success('Sesión iniciada')
    }
  })
}

/**
 * Logout mutation
 */
export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      // Clear all caches
      queryClient.clear()
      toast.success('Sesión cerrada')
    }
  })
}

/**
 * OAuth login mutations
 */
export function useOAuthLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ code, provider }) => {
      if (provider === 'google') {
        return await authService.googleCallback(code)
      } else if (provider === 'github') {
        return await authService.githubCallback(code)
      }
      throw new Error('Invalid provider')
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.auth.user, data.user)
      toast.success('Autenticación exitosa')
    }
  })
}
```

#### useProperties Hook

**File:** `src/hooks/useProperties.js`

```javascript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { propertyService } from '@/services'
import { queryKeys } from './queryKeys'
import toast from 'react-hot-toast'

/**
 * Get properties list with filters
 */
export function useProperties(filters = {}) {
  return useQuery({
    queryKey: queryKeys.properties.list(filters),
    queryFn: () => propertyService.getProperties(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Get single property
 */
export function useProperty(id) {
  return useQuery({
    queryKey: queryKeys.properties.detail(id),
    queryFn: () => propertyService.getProperty(id),
    enabled: !!id, // Only run if ID exists
    staleTime: 5 * 60 * 1000
  })
}

/**
 * Get property token info from blockchain
 */
export function usePropertyTokenInfo(id) {
  return useQuery({
    queryKey: queryKeys.properties.tokenInfo(id),
    queryFn: () => propertyService.getTokenInfo(id),
    enabled: !!id,
    staleTime: 30 * 1000, // 30 seconds (blockchain data)
    refetchInterval: 60 * 1000 // Refetch every minute
  })
}

/**
 * Get property transaction history
 */
export function usePropertyHistory(id) {
  return useQuery({
    queryKey: queryKeys.properties.history(id),
    queryFn: () => propertyService.getPropertyHistory(id),
    enabled: !!id,
    staleTime: 30 * 1000
  })
}

/**
 * Get user's owned properties
 */
export function useMyOwnedProperties() {
  return useQuery({
    queryKey: queryKeys.properties.myOwned,
    queryFn: propertyService.getMyOwnedProperties,
    staleTime: 2 * 60 * 1000 // 2 minutes
  })
}

/**
 * Get user's investments
 */
export function useMyInvestments() {
  return useQuery({
    queryKey: queryKeys.properties.myInvestments,
    queryFn: propertyService.getMyInvestments,
    staleTime: 2 * 60 * 1000
  })
}

/**
 * Create property mutation
 */
export function useCreateProperty() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ propertyData, images }) =>
      propertyService.createProperty(propertyData, images),

    onSuccess: (newProperty) => {
      // Invalidate property lists
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.myOwned })

      toast.success('Propiedad creada y contrato deployado exitosamente')
    },

    onError: (error) => {
      console.error('[useCreateProperty] Error:', error)
      toast.error(`Error al crear propiedad: ${error.message}`)
    }
  })
}

/**
 * Update property mutation
 */
export function useUpdateProperty() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, updates }) =>
      propertyService.updateProperty(id, updates),

    onSuccess: (updatedProperty, variables) => {
      // Update cache for specific property
      queryClient.setQueryData(
        queryKeys.properties.detail(variables.id),
        updatedProperty
      )

      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.all })

      toast.success('Propiedad actualizada')
    }
  })
}

/**
 * Delete property mutation
 */
export function useDeleteProperty() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => propertyService.deleteProperty(id),

    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: queryKeys.properties.detail(deletedId) })

      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.all })

      toast.success('Propiedad eliminada')
    }
  })
}

/**
 * Upload images mutation
 */
export function useUploadPropertyImages() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ propertyId, formData }) =>
      propertyService.uploadImages(propertyId, formData),

    onSuccess: (_, variables) => {
      // Invalidate property detail to refetch with new images
      queryClient.invalidateQueries({
        queryKey: queryKeys.properties.detail(variables.propertyId)
      })

      toast.success('Imágenes subidas exitosamente')
    }
  })
}
```

#### useWallet Hook

**File:** `src/hooks/useWallet.js`

```javascript
import { useQuery } from '@tanstack/react-query'
import { walletService } from '@/services'
import { queryKeys } from './queryKeys'

/**
 * Get wallet balance
 */
export function useWalletBalance(walletAddress) {
  return useQuery({
    queryKey: queryKeys.wallet.balance(walletAddress),
    queryFn: () => walletService.getBalance(walletAddress),
    enabled: !!walletAddress,
    staleTime: 30 * 1000,        // 30 seconds (blockchain data)
    refetchInterval: 60 * 1000   // Auto-refetch every minute
  })
}

/**
 * Get transaction history
 */
export function useTransactions(walletAddress, filters = {}) {
  return useQuery({
    queryKey: queryKeys.wallet.transactions(walletAddress, filters),
    queryFn: () => walletService.getTransactions(walletAddress, filters),
    enabled: !!walletAddress,
    staleTime: 30 * 1000
  })
}
```

### 8.4 Optimistic Updates

**Example: Like a property (future feature)**

```javascript
export function useLikeProperty() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (propertyId) => propertyService.like(propertyId),

    // Optimistic update
    onMutate: async (propertyId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: queryKeys.properties.detail(propertyId)
      })

      // Snapshot previous value
      const previousProperty = queryClient.getQueryData(
        queryKeys.properties.detail(propertyId)
      )

      // Optimistically update cache
      queryClient.setQueryData(
        queryKeys.properties.detail(propertyId),
        (old) => ({
          ...old,
          likes: old.likes + 1,
          isLikedByUser: true
        })
      )

      // Return context with snapshot
      return { previousProperty }
    },

    // Rollback on error
    onError: (error, propertyId, context) => {
      // Restore previous value
      queryClient.setQueryData(
        queryKeys.properties.detail(propertyId),
        context.previousProperty
      )

      toast.error('Error al dar like')
    },

    // Refetch on success or error
    onSettled: (data, error, propertyId) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.properties.detail(propertyId)
      })
    }
  })
}
```

### 8.5 Cache Invalidation Strategies

**After Creating a Property:**
```javascript
// Invalidate all property lists
queryClient.invalidateQueries({ queryKey: ['properties'] })

// More specific: only lists
queryClient.invalidateQueries({ queryKey: ['properties', 'list'] })

// Even more specific: only certain filters
queryClient.invalidateQueries({
  queryKey: ['properties', 'list'],
  predicate: (query) => query.queryKey[2]?.category === 'houses'
})
```

**After Buying Tokens:**
```javascript
// Invalidate property detail (to update available tokens)
queryClient.invalidateQueries({
  queryKey: queryKeys.properties.detail(propertyId)
})

// Invalidate wallet balance (tokens received)
queryClient.invalidateQueries({
  queryKey: queryKeys.wallet.balance(userAddress)
})

// Invalidate investments (new investment added)
queryClient.invalidateQueries({
  queryKey: queryKeys.properties.myInvestments
})
```

**Selective Invalidation:**
```javascript
// Invalidate all except user data
queryClient.invalidateQueries({
  predicate: (query) => !query.queryKey.includes('auth')
})
```

### 8.6 React Query DevTools

**Usage:**
```javascript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

function App() {
  return (
    <>
      {/* Your app */}
      <ReactQueryDevtools
        initialIsOpen={false}
        position="bottom-right"
        buttonPosition="bottom-right"
      />
    </>
  )
}
```

**Features:**
- View all queries and mutations
- Inspect query data
- Refetch manually
- See cache staleness
- Monitor network activity

**Hotkeys:**
- Toggle DevTools: Click floating icon
- Refetch query: Click refetch icon
- Invalidate query: Click invalidate icon

---

## 9. Routing Architecture

### 9.1 React Router v7 Configuration

**File:** `src/App.jsx`

```javascript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks'
import { Loader } from '@/components/ui'

// Layouts
import { Navbar, Footer } from '@/components/layout'

// Pages
import {
  Marketplace,
  PropertyDetailsPage,
  SellerDashboard,
  WalletPage,
  ProfilePage,
  EvaluatorsPage,
  EvaluatorProfile,
  AuthPage,
  OAuth2Callback
} from '@/pages'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes (No Navbar/Footer) */}
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/auth/callback" element={<OAuth2Callback />} />

        {/* Main App Routes */}
        <Route path="/*" element={<AppContent />} />
      </Routes>
    </BrowserRouter>
  )
}

function AppContent() {
  const { data: user, isLoading } = useAuth()

  if (isLoading) {
    return <Loader text="Cargando aplicación..." />
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} />

      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route index element={<Marketplace />} />
          <Route path="/property/:id" element={<PropertyDetailsPage />} />
          <Route path="/evaluators" element={<EvaluatorsPage />} />
          <Route path="/evaluators/:id" element={<EvaluatorProfile />} />

          {/* Protected Routes */}
          <Route
            path="/seller"
            element={
              user ? <SellerDashboard user={user} /> : <Navigate to="/auth" replace />
            }
          />
          <Route
            path="/wallet"
            element={
              user ? <WalletPage user={user} /> : <Navigate to="/auth" replace />
            }
          />
          <Route
            path="/profile"
            element={
              user ? <ProfilePage user={user} /> : <Navigate to="/auth" replace />
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <p className="text-xl text-muted-foreground mb-8">Página no encontrada</p>
      <Link to="/">
        <Button>Volver al Marketplace</Button>
      </Link>
    </div>
  )
}

export default App
```

### 9.2 Protected Route Wrapper (Alternative Pattern)

```javascript
// components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks'
import { Loader } from '@/components/ui'

export function ProtectedRoute({ children }) {
  const { data: user, isLoading } = useAuth()

  if (isLoading) {
    return <Loader />
  }

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  return children
}

// Usage in App.jsx
<Route
  path="/seller"
  element={
    <ProtectedRoute>
      <SellerDashboard />
    </ProtectedRoute>
  }
/>
```

### 9.3 Route Constants

**File:** `src/shared/constants/routes.js`

```javascript
export const ROUTES = {
  // Public
  HOME: '/',
  MARKETPLACE: '/',
  PROPERTY_DETAILS: '/property/:id',
  EVALUATORS: '/evaluators',
  EVALUATOR_PROFILE: '/evaluators/:id',

  // Auth
  AUTH: '/auth',
  AUTH_CALLBACK: '/auth/callback',

  // Protected
  SELLER: '/seller',
  WALLET: '/wallet',
  PROFILE: '/profile',

  // Helpers
  propertyDetails: (id) => `/property/${id}`,
  evaluatorProfile: (id) => `/evaluators/${id}`
}

// Usage
import { ROUTES } from '@/shared/constants/routes'

<Link to={ROUTES.propertyDetails(property.id)}>Ver Detalles</Link>
```

### 9.4 Navigation Programmatically

```javascript
import { useNavigate } from 'react-router-dom'

function Component() {
  const navigate = useNavigate()

  const handleSuccess = () => {
    // Navigate to property details
    navigate(`/property/${propertyId}`)

    // Navigate back
    navigate(-1)

    // Navigate with state
    navigate('/profile', {
      state: { message: 'Propiedad creada exitosamente' }
    })

    // Replace (no history entry)
    navigate('/auth', { replace: true })
  }
}
```

### 9.5 Route Params & Query Params

**Params:**
```javascript
import { useParams } from 'react-router-dom'

function PropertyDetailsPage() {
  const { id } = useParams() // From /property/:id

  const { data: property } = useProperty(id)

  return <PropertyDetails property={property} />
}
```

**Query Params:**
```javascript
import { useSearchParams } from 'react-router-dom'

function Marketplace() {
  const [searchParams, setSearchParams] = useSearchParams()

  // Read query params
  const category = searchParams.get('category') || 'all'
  const search = searchParams.get('search') || ''

  // Set query params
  const handleFilterChange = (newCategory) => {
    setSearchParams({ category: newCategory, search })
  }

  // URL: /?category=houses&search=buenos+aires
}
```

### 9.6 Scroll Restoration

**Automatic scroll to top on route change:**

```javascript
// components/ScrollToTop.jsx
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

// In App.jsx
function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>...</Routes>
    </BrowserRouter>
  )
}
```

**Manual scroll preservation:**
```javascript
import { useLocation } from 'react-router-dom'

function Marketplace() {
  const location = useLocation()
  const scrollPosition = useRef(0)

  useEffect(() => {
    // Restore scroll on mount
    window.scrollTo(0, scrollPosition.current)

    // Save scroll before unmount
    return () => {
      scrollPosition.current = window.scrollY
    }
  }, [location])
}
```

---

## 10. Authentication & Authorization

### 10.1 Authentication Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                  AUTHENTICATION FLOWS                       │
└─────────────────────────────────────────────────────────────┘

FLOW 1: Email/Password Registration
┌─────────────────────────────────────────────────────────────┐
│ 1. User fills registration form (email, password, name)    │
│ 2. Frontend sends POST /auth/register                      │
│ 3. Backend:                                                 │
│    a. Validates data                                        │
│    b. Hashes password (bcrypt)                              │
│    c. Creates user in PostgreSQL                            │
│    d. Generates Stellar keypair                             │
│    e. Creates JWT token                                     │
│ 4. Backend responds: { user, token, wallet }                │
│ 5. Frontend:                                                │
│    a. Stores token in localStorage                          │
│    b. Stores user in localStorage                           │
│    c. Shows wallet secret key WARNING                       │
│    d. Updates React Query cache                             │
│    e. Redirects to marketplace                              │
└─────────────────────────────────────────────────────────────┘

FLOW 2: Email/Password Login
┌─────────────────────────────────────────────────────────────┐
│ 1. User fills login form (email, password)                 │
│ 2. Frontend sends POST /auth/login                          │
│ 3. Backend:                                                 │
│    a. Finds user by email                                   │
│    b. Compares password hash                                │
│    c. Generates JWT token                                   │
│ 4. Backend responds: { user, token }                        │
│ 5. Frontend:                                                │
│    a. Stores token in localStorage                          │
│    b. Stores user in localStorage                           │
│    c. Updates React Query cache                             │
│    d. Redirects to marketplace                              │
└─────────────────────────────────────────────────────────────┘

FLOW 3: OAuth2 (Google/GitHub)
┌─────────────────────────────────────────────────────────────┐
│ 1. User clicks "Sign in with Google"                       │
│ 2. Frontend redirects to GET /auth/google                   │
│ 3. Backend redirects to Google OAuth                        │
│ 4. User authenticates on Google                             │
│ 5. Google redirects to /auth/callback?code=xxx&provider... │
│ 6. Frontend:                                                │
│    a. Extracts code and provider from URL                   │
│    b. Sends POST /auth/google/callback with code            │
│ 7. Backend:                                                 │
│    a. Exchanges code for Google tokens                      │
│    b. Gets user profile from Google                         │
│    c. Creates or updates user in DB                         │
│    d. Generates Stellar wallet (if new user)                │
│    e. Generates JWT token                                   │
│ 8. Backend responds: { user, token, wallet? }               │
│ 9. Frontend:                                                │
│    a. Stores token and user                                 │
│    b. Updates cache                                         │
│    c. Redirects to marketplace                              │
└─────────────────────────────────────────────────────────────┘

FLOW 4: Session Validation (on app load)
┌─────────────────────────────────────────────────────────────┐
│ 1. App loads, checks localStorage for token                │
│ 2. If token exists:                                         │
│    a. Frontend sends GET /auth/profile                      │
│    b. Backend validates JWT                                 │
│    c. Backend responds with user data                       │
│    d. Frontend updates cache                                │
│ 3. If token invalid/expired:                                │
│    a. Backend responds 401                                  │
│    b. Axios interceptor clears storage                      │
│    c. User treated as logged out                            │
└─────────────────────────────────────────────────────────────┘

FLOW 5: Logout
┌─────────────────────────────────────────────────────────────┐
│ 1. User clicks "Logout"                                     │
│ 2. Frontend sends POST /auth/logout                         │
│ 3. Backend invalidates token (if using token blacklist)    │
│ 4. Frontend:                                                │
│    a. Removes token from localStorage                       │
│    b. Removes user from localStorage                        │
│    c. Clears ALL React Query cache                          │
│    d. Redirects to home                                     │
└─────────────────────────────────────────────────────────────┘
```

### 10.2 JWT Token Structure

**Token Payload:**
```javascript
{
  id: 9,                              // User ID
  email: "user@example.com",          // Email
  name: "John Doe",                   // Name
  iat: 1705852352,                    // Issued at (timestamp)
  exp: 1705938752                     // Expires at (timestamp)
}
```

**Token Header:**
```javascript
{
  alg: "HS256",                       // Algorithm
  typ: "JWT"                          // Type
}
```

**Full Token Example:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNzA1ODUyMzUyLCJleHAiOjE3MDU5Mzg3NTJ9.hY_LEiDqPcPItn3_buAbmLbuwY1Hxj-NCyWXevHoBcE
```

### 10.3 Authorization Patterns

#### Route-Level Authorization

```javascript
// In App.jsx
<Route
  path="/seller"
  element={
    user ? (
      <SellerDashboard user={user} />
    ) : (
      <Navigate to="/auth" state={{ from: '/seller' }} replace />
    )
  }
/>

// In AuthPage.jsx - redirect after login
const location = useLocation()
const from = location.state?.from || '/'

// After successful login
navigate(from, { replace: true })
```

#### Component-Level Authorization

```javascript
function PropertyCard({ property, user }) {
  const isOwner = user?.id === property.ownerId
  const canEdit = isOwner || user?.role === 'admin'

  return (
    <Card>
      {/* Content */}

      {canEdit && (
        <div className="flex gap-2">
          <Button onClick={handleEdit}>Editar</Button>
          <Button variant="destructive" onClick={handleDelete}>
            Eliminar
          </Button>
        </div>
      )}
    </Card>
  )
}
```

#### API-Level Authorization

```javascript
// Axios interceptor automatically attaches token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('blocki_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Backend validates token on protected endpoints
// If invalid: 401 response
// Interceptor auto-logs out user
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear()
      window.location.href = '/auth'
    }
    return Promise.reject(error)
  }
)
```

### 10.4 Permission Levels

**User Roles (Future Enhancement):**
```javascript
const USER_ROLES = {
  GUEST: 'guest',        // Not logged in - can only view
  USER: 'user',          // Logged in - can buy tokens
  SELLER: 'seller',      // Can create properties
  EVALUATOR: 'evaluator', // Can evaluate properties
  ADMIN: 'admin'         // Full access
}

// Permission check
function hasPermission(user, permission) {
  const permissions = {
    guest: ['view'],
    user: ['view', 'buy'],
    seller: ['view', 'buy', 'create', 'manage_own'],
    evaluator: ['view', 'buy', 'evaluate'],
    admin: ['*']
  }

  const userPermissions = permissions[user?.role || 'guest']
  return userPermissions.includes(permission) || userPermissions.includes('*')
}

// Usage
if (hasPermission(user, 'create')) {
  // Show create property button
}
```

**KYC-Based Limits:**
```javascript
const KYC_LIMITS = {
  0: { name: 'No verificado', monthlyLimit: 500 },
  1: { name: 'Básico', monthlyLimit: 10000 },
  2: { name: 'Completo', monthlyLimit: 100000 },
  3: { name: 'Institucional', monthlyLimit: Infinity }
}

// Check before purchase
async function canPurchase(userId, amount) {
  const kycStatus = await kycService.getStatus(userId)
  const limit = KYC_LIMITS[kycStatus.level]

  if (amount > limit.monthlyRemaining) {
    throw new Error(`Excede tu límite mensual (${limit.name})`)
  }

  return true
}
```

---

## 11. Blockchain Integration

### 11.1 Stellar Network Configuration

**File:** `src/shared/constants/stellar.js`

```javascript
export const STELLAR_CONFIG = {
  // Network
  NETWORK: import.meta.env.VITE_STELLAR_NETWORK || 'testnet',
  NETWORK_PASSPHRASE: 'Test SDF Network ; September 2015',

  // RPC URLs
  SOROBAN_RPC_URL: import.meta.env.VITE_SOROBAN_RPC_URL ||
    'https://soroban-testnet.stellar.org:443',
  HORIZON_URL: 'https://horizon-testnet.stellar.org',

  // Transaction settings
  BASE_FEE: '100',      // 100 stroops = 0.00001 XLM
  TIMEOUT: 180,         // 3 minutes

  // Contract IDs (set after deployment)
  CONTRACTS: {
    PROPERTY_TOKEN_DEPLOYER: import.meta.env.VITE_PROPERTY_TOKEN_DEPLOYER_ID,
    MARKETPLACE: import.meta.env.VITE_MARKETPLACE_CONTRACT_ID,
    ESCROW: import.meta.env.VITE_ESCROW_CONTRACT_ID,
    REGISTRY: import.meta.env.VITE_REGISTRY_CONTRACT_ID
  },

  // Asset codes
  NATIVE_ASSET: 'XLM',
  PROPERTY_TOKEN_PREFIX: 'PROP'
}

// Network passphrase helper
export function getNetworkPassphrase(network = STELLAR_CONFIG.NETWORK) {
  return network === 'testnet'
    ? 'Test SDF Network ; September 2015'
    : 'Public Global Stellar Network ; September 2015'
}
```

### 11.2 Stellar SDK Integration

**Basic Setup:**
```javascript
import * as StellarSDK from '@stellar/stellar-sdk'
import { STELLAR_CONFIG } from '@/shared/constants/stellar'

// Create server instance
const server = new StellarSDK.Horizon.Server(STELLAR_CONFIG.HORIZON_URL)

// For Soroban contracts
const sorobanServer = new StellarSDK.SorobanRpc.Server(STELLAR_CONFIG.SOROBAN_RPC_URL)

// Create keypair from secret
const keypair = StellarSDK.Keypair.fromSecret(secretKey)

// Create keypair (new wallet)
const newKeypair = StellarSDK.Keypair.random()
console.log('Public Key:', newKeypair.publicKey())
console.log('Secret Key:', newKeypair.secret())
```

### 11.3 Freighter Wallet Integration

**File:** `src/services/freighterService.js`

```javascript
import {
  isConnected,
  isAllowed,
  setAllowed,
  getUserInfo,
  getPublicKey,
  signTransaction,
  signAuthEntry
} from '@stellar/freighter-api'

export const freighterService = {
  /**
   * Check if Freighter is installed
   */
  async isInstalled() {
    return await isConnected()
  },

  /**
   * Request access to Freighter
   */
  async requestAccess() {
    if (await isAllowed()) {
      return true
    }
    return await setAllowed()
  },

  /**
   * Get user's public key
   */
  async getPublicKey() {
    const publicKey = await getPublicKey()
    return publicKey
  },

  /**
   * Get user info (network, public key)
   */
  async getUserInfo() {
    const info = await getUserInfo()
    return info
  },

  /**
   * Sign transaction with Freighter
   * @param {string} xdr - Transaction XDR
   * @param {string} network - Network passphrase
   */
  async signTransaction(xdr, network = 'TESTNET') {
    const signedXDR = await signTransaction(xdr, {
      network,
      networkPassphrase: getNetworkPassphrase(network)
    })
    return signedXDR
  },

  /**
   * Sign auth entry (for Soroban)
   */
  async signAuthEntry(entryXDR, network = 'TESTNET') {
    const signedEntry = await signAuthEntry(entryXDR, {
      network,
      networkPassphrase: getNetworkPassphrase(network)
    })
    return signedEntry
  }
}
```

**WalletConnect Component:**
```javascript
import { useState, useEffect } from 'react'
import { freighterService } from '@/services/freighterService'
import { Button } from '@/components/ui'
import { Wallet, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'

export function WalletConnect() {
  const [isInstalled, setIsInstalled] = useState(false)
  const [publicKey, setPublicKey] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    checkFreighter()
  }, [])

  const checkFreighter = async () => {
    const installed = await freighterService.isInstalled()
    setIsInstalled(installed)
  }

  const handleConnect = async () => {
    try {
      setIsLoading(true)

      if (!isInstalled) {
        toast.error('Freighter no está instalado')
        window.open('https://freighter.app', '_blank')
        return
      }

      // Request access
      const hasAccess = await freighterService.requestAccess()
      if (!hasAccess) {
        toast.error('Acceso denegado a Freighter')
        return
      }

      // Get public key
      const key = await freighterService.getPublicKey()
      setPublicKey(key)

      toast.success('Wallet conectada exitosamente')
    } catch (error) {
      console.error('[WalletConnect] Error:', error)
      toast.error('Error al conectar Freighter')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisconnect = () => {
    setPublicKey(null)
    toast.success('Wallet desconectada')
  }

  if (!publicKey) {
    return (
      <Button
        onClick={handleConnect}
        disabled={isLoading}
        className="gap-2"
      >
        <Wallet className="w-4 h-4" />
        {isLoading ? 'Conectando...' : 'Conectar Freighter'}
        {!isInstalled && <ExternalLink className="w-3 h-3" />}
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-3 bg-card px-4 py-2 rounded-lg border border-border">
      <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
      <div>
        <p className="text-xs text-muted-foreground">Freighter</p>
        <p className="text-sm font-mono">
          {publicKey.slice(0, 4)}...{publicKey.slice(-4)}
        </p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          navigator.clipboard.writeText(publicKey)
          toast.success('Dirección copiada')
        }}
      >
        Copiar
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleDisconnect}
      >
        Desconectar
      </Button>
    </div>
  )
}
```

### 11.4 Smart Contract Interaction (Soroban)

**PropertyToken Contract Functions:**

```javascript
// Backend handles most contract interactions
// Frontend only reads token data

/**
 * Get token balance for user
 */
async function getTokenBalance(contractId, userAddress) {
  const contract = new StellarSDK.Contract(contractId)

  const transaction = new StellarSDK.TransactionBuilder(account, {
    fee: STELLAR_CONFIG.BASE_FEE,
    networkPassphrase: getNetworkPassphrase()
  })
    .addOperation(
      contract.call(
        'balance',
        StellarSDK.nativeToScVal(userAddress, { type: 'address' })
      )
    )
    .setTimeout(STELLAR_CONFIG.TIMEOUT)
    .build()

  const result = await sorobanServer.simulateTransaction(transaction)
  const balance = StellarSDK.scValToNative(result.result.retval)

  return balance
}

/**
 * Get token metadata
 */
async function getTokenMetadata(contractId) {
  const contract = new StellarSDK.Contract(contractId)

  // Get name
  const nameResult = await sorobanServer.simulateTransaction(
    buildCallTransaction(contract, 'name')
  )
  const name = StellarSDK.scValToNative(nameResult.result.retval)

  // Get symbol
  const symbolResult = await sorobanServer.simulateTransaction(
    buildCallTransaction(contract, 'symbol')
  )
  const symbol = StellarSDK.scValToNative(symbolResult.result.retval)

  // Get decimals
  const decimalsResult = await sorobanServer.simulateTransaction(
    buildCallTransaction(contract, 'decimals')
  )
  const decimals = StellarSDK.scValToNative(decimalsResult.result.retval)

  return { name, symbol, decimals }
}
```

**Transaction Flow (Token Purchase):**

```
┌─────────────────────────────────────────────────────────────┐
│              TOKEN PURCHASE FLOW (SOROBAN)                  │
└─────────────────────────────────────────────────────────────┘

1. User initiates purchase on frontend
   ↓
2. Frontend validates:
   - KYC limits
   - Wallet balance
   - Token availability
   ↓
3. Frontend calls backend API: POST /marketplace/listings/buy
   ↓
4. Backend builds Soroban transaction:
   a. Load source account
   b. Create transaction with PropertyToken.transfer()
   c. Build and sign with platform key
   ↓
5. Backend returns transaction XDR to frontend
   ↓
6. Frontend signs with Freighter:
   const signedXDR = await freighterService.signTransaction(xdr)
   ↓
7. Frontend submits to backend: POST /transactions/submit
   ↓
8. Backend submits to Stellar network
   ↓
9. Backend polls for confirmation
   ↓
10. Backend updates database:
    - Property.availableTokens -= quantity
    - Create Ownership record
    - Create Transaction record
   ↓
11. Backend responds with transaction hash
   ↓
12. Frontend:
    - Invalidates queries (property, wallet, investments)
    - Shows success toast with explorer link
    - Redirects to wallet or property page
```

### 11.5 Wallet Balance Query

**useWalletBalance Hook:**
```javascript
import { useQuery } from '@tanstack/react-query'
import { walletService } from '@/services'

export function useWalletBalance(walletAddress) {
  return useQuery({
    queryKey: ['wallet', 'balance', walletAddress],
    queryFn: async () => {
      // Backend queries Horizon API for account balances
      const balance = await walletService.getBalance(walletAddress)

      // Returns:
      // {
      //   xlm: 1000.50,
      //   tokens: [
      //     {
      //       assetCode: 'PROP-123',
      //       balance: 50,
      //       propertyName: 'Casa en Buenos Aires',
      //       percentage: 0.05,
      //       value: 2500
      //     }
      //   ]
      // }

      return balance
    },
    enabled: !!walletAddress,
    staleTime: 30 * 1000,     // 30 seconds
    refetchInterval: 60 * 1000 // Refetch every minute
  })
}
```

## 12. Styling System

### 12.1 Tailwind CSS v4 Architecture

**Revolutionary Changes in v4:**

**Before (v3):**
```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6'
      }
    }
  }
}
```

**After (v4):**
```css
/* index.css - Direct CSS configuration! */
@import "tailwindcss";

@theme {
  --color-primary: oklch(0.50 0.20 250);
  --color-secondary: oklch(0.60 0.18 162);
  --font-sans: Inter, system-ui, sans-serif;
  --breakpoint-3xl: 1920px;
}

@custom-variant dark (&:is(.dark *));
```

**Benefits:**
- No JavaScript config file needed
- Native CSS variables
- Better IDE autocomplete
- 10x faster compilation (Rust-based Oxide engine)
- True CSS-first approach

### 12.2 Color System

**File:** `src/index.css`

**Light Theme:**
```css
:root {
  /* Base colors */
  --background: oklch(0.99 0 0);          /* #FCFCFC - Soft white */
  --foreground: oklch(0.15 0 0);          /* #262626 - Dark text */

  /* Brand colors */
  --primary: oklch(0.50 0.20 250);        /* Deep blue - blockchain trust */
  --primary-foreground: oklch(0.99 0 0);  /* White text on primary */

  --secondary: oklch(0.60 0.18 162);      /* Vibrant green - success */
  --secondary-foreground: oklch(0.99 0 0);

  /* Functional colors */
  --muted: oklch(0.96 0 0);               /* #F5F5F5 - Neutral gray */
  --muted-foreground: oklch(0.47 0 0);    /* #757575 - Muted text */

  --accent: oklch(0.96 0.02 280);         /* #F3F3F8 - Subtle purple */
  --accent-foreground: oklch(0.15 0 0);

  --destructive: oklch(0.58 0.24 27);     /* #EF4444 - Warm red */
  --destructive-foreground: oklch(0.99 0 0);

  /* Borders & dividers */
  --border: oklch(0.91 0 0);              /* #E5E5E5 */
  --input: oklch(0.91 0 0);
  --ring: oklch(0.50 0.20 250);           /* Primary color for focus rings */

  /* Cards & surfaces */
  --card: oklch(1 0 0);                   /* Pure white */
  --card-foreground: oklch(0.15 0 0);

  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.15 0 0);

  /* Radius */
  --radius: 0.75rem;                      /* 12px - Base border radius */
}
```

**Dark Theme:**
```css
.dark {
  /* Base colors - Deep purple space theme */
  --background: #060010;                  /* Deep purple black */
  --foreground: oklch(0.98 0 0);          /* Near white */

  /* Brand colors - More vibrant in dark mode */
  --primary: oklch(0.70 0.22 250);        /* Electric blue */
  --primary-foreground: oklch(0.99 0 0);

  --secondary: oklch(0.75 0.24 162);      /* Neon green */
  --secondary-foreground: oklch(0.99 0 0);

  /* Functional colors */
  --muted: #1a1030;                       /* Purple-tinted gray */
  --muted-foreground: oklch(0.65 0 0);

  --accent: #1f1540;                      /* Purple glow */
  --accent-foreground: oklch(0.98 0 0);

  --destructive: oklch(0.65 0.24 27);     /* Bright red */
  --destructive-foreground: oklch(0.99 0 0);

  /* Borders - Subtle purple tint */
  --border: #2a1f4a;
  --input: #2a1f4a;
  --ring: oklch(0.70 0.22 250);

  /* Cards - Elevated surfaces */
  --card: #0d0420;                        /* Dark purple */
  --card-foreground: oklch(0.98 0 0);

  --popover: #0d0420;
  --popover-foreground: oklch(0.98 0 0);
}
```

**Using Colors:**
```jsx
// In components
<div className="bg-background text-foreground">
  <button className="bg-primary text-primary-foreground hover:bg-primary/90">
    Primary Action
  </button>
  <button className="bg-secondary text-secondary-foreground">
    Secondary Action
  </button>
  <div className="text-muted-foreground">Muted text</div>
</div>
```

### 12.3 Typography System

**Font Configuration:**
```css
/* index.css */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700;800&display=swap');

:root {
  /* Font families */
  --font-sans: Inter, system-ui, -apple-system, sans-serif;
  --font-secondary: 'Open Sans', sans-serif;
  --font-mono: 'SF Mono', 'Roboto Mono', monospace;
}

body {
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

**Heading Styles:**
```css
h1 {
  font-size: 2.25rem;      /* 36px */
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

h2 {
  font-size: 1.875rem;     /* 30px */
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.01em;
}

h3 {
  font-size: 1.5rem;       /* 24px */
  font-weight: 600;
  line-height: 1.4;
}

h4 {
  font-size: 1.25rem;      /* 20px */
  font-weight: 600;
  line-height: 1.5;
}
```

**Text Classes:**
```jsx
<h1 className="text-4xl font-bold tracking-tight">Heading 1</h1>
<h2 className="text-3xl font-bold">Heading 2</h2>
<p className="text-base text-muted-foreground">Body text</p>
<p className="text-sm text-muted-foreground">Small text</p>
<code className="font-mono text-sm">Code text</code>
```

### 12.4 Custom Animations

**Keyframe Definitions:**
```css
/* index.css */

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes slideDown {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes blob {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(20px, -50px) scale(1.1);
  }
  50% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  75% {
    transform: translate(50px, 50px) scale(1.05);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes coin-flip {
  0%, 100% {
    transform: rotateY(0deg);
  }
  50% {
    transform: rotateY(180deg);
  }
}

@keyframes breathing {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
}

@keyframes gradient-x {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}
```

**Animation Classes:**
```css
.animate-fadeIn {
  animation: fadeIn 0.5s ease-in-out;
}

.animate-slideUp {
  animation: slideUp 0.3s ease-out;
}

.animate-slideDown {
  animation: slideDown 0.3s ease-out;
}

.animate-blob {
  animation: blob 7s infinite;
}

.animate-spin-slow {
  animation: spin-slow 3s linear infinite;
}

.animate-breathing {
  animation: breathing 2s ease-in-out infinite;
}

.animate-gradient-x {
  animation: gradient-x 3s ease infinite;
  background-size: 200% 200%;
}
```

**Usage:**
```jsx
<div className="animate-fadeIn">Fade in on mount</div>
<div className="animate-blob absolute w-64 h-64 bg-primary/20 rounded-full blur-3xl">
  Background blob
</div>
<div className="animate-breathing">Breathing effect</div>
```

### 12.5 Custom Utility Classes

**Text Gradient:**
```css
.text-gradient-exotic {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #10b981 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.text-gradient-primary {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

**Glass Morphism:**
```css
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.glass-dark {
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

**Scrollbar Hiding:**
```css
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
```

**Line Clamp:**
```css
.truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.truncate-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

**Custom Scrollbar:**
```css
/* Scrollbar styling (light mode) */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Dark mode scrollbar */
.dark ::-webkit-scrollbar-track {
  background: #1f2937;
}

.dark ::-webkit-scrollbar-thumb {
  background: #4b5563;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
```

### 12.6 Shadow System

```css
:root {
  /* Light mode shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-base: 0 2px 8px 0 rgba(0, 0, 0, 0.04);
  --shadow-md: 0 4px 12px 0 rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 8px 24px 0 rgba(0, 0, 0, 0.12);
  --shadow-xl: 0 16px 48px 0 rgba(0, 0, 0, 0.16);

  /* Card shadows */
  --shadow-card: var(--shadow-base);
  --shadow-card-hover: var(--shadow-md);
  --shadow-modal: var(--shadow-xl);
}

.dark {
  /* Dark mode shadows - More prominent */
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.3);
  --shadow-base: 0 4px 16px 0 rgba(0, 0, 0, 0.4);
  --shadow-md: 0 8px 24px 0 rgba(0, 0, 0, 0.5);
  --shadow-lg: 0 16px 32px 0 rgba(0, 0, 0, 0.6);
  --shadow-xl: 0 24px 64px 0 rgba(0, 0, 0, 0.7);

  --shadow-card: var(--shadow-base);
  --shadow-card-hover: var(--shadow-md);
  --shadow-modal: var(--shadow-xl);
}
```

**Usage:**
```jsx
<div className="shadow-card hover:shadow-card-hover transition-shadow">
  Card with shadow
</div>
```

### 12.7 Responsive Design

**Tailwind Breakpoints:**
```
sm:  640px   @media (min-width: 640px)
md:  768px   @media (min-width: 768px)
lg:  1024px  @media (min-width: 1024px)
xl:  1280px  @media (min-width: 1280px)
2xl: 1536px  @media (min-width: 1536px)
```

**Mobile-First Strategy:**
```jsx
<div className="
  w-full           // Mobile: full width
  px-4             // Mobile: 16px padding
  md:w-3/4         // Tablet: 75% width
  md:px-8          // Tablet: 32px padding
  lg:w-1/2         // Desktop: 50% width
  lg:px-12         // Desktop: 48px padding
  xl:max-w-4xl     // Large: max 896px
  2xl:max-w-6xl    // XL: max 1152px
">
  Responsive container
</div>
```

**Responsive Typography:**
```jsx
<h1 className="
  text-3xl         // Mobile: 30px
  md:text-4xl      // Tablet: 36px
  lg:text-5xl      // Desktop: 48px
  font-bold
">
  Responsive Heading
</h1>
```

**Grid Responsiveness:**
```jsx
<div className="
  grid
  grid-cols-1      // Mobile: 1 column
  md:grid-cols-2   // Tablet: 2 columns
  lg:grid-cols-3   // Desktop: 3 columns
  xl:grid-cols-4   // Large: 4 columns
  gap-6
">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>
```

---

## 13. Internationalization

### 13.1 i18next Configuration

**File:** `src/config/i18n.js`

```javascript
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Translation files
import en from './locales/en.json'
import es from './locales/es.json'

i18n
  // Detect user language
  .use(LanguageDetector)
  // Pass i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es }
    },

    fallbackLng: 'es',  // Default to Spanish (LATAM focus)

    debug: false,  // Enable for debugging

    interpolation: {
      escapeValue: false  // React already escapes
    },

    detection: {
      // Detection order
      order: ['localStorage', 'navigator', 'htmlTag'],

      // Cache user language
      caches: ['localStorage'],

      // localStorage key
      lookupLocalStorage: 'blocki-language'
    }
  })

export default i18n
```

### 13.2 Translation Files Structure

**File:** `src/config/locales/es.json`

```json
{
  "common": {
    "loading": "Cargando...",
    "error": "Error",
    "success": "Éxito",
    "cancel": "Cancelar",
    "confirm": "Confirmar",
    "save": "Guardar",
    "delete": "Eliminar",
    "edit": "Editar",
    "view": "Ver",
    "search": "Buscar",
    "filter": "Filtrar",
    "sort": "Ordenar",
    "clear": "Limpiar"
  },

  "navigation": {
    "marketplace": "Marketplace",
    "seller": "Vendedor",
    "wallet": "Wallet",
    "profile": "Perfil",
    "evaluators": "Evaluadores"
  },

  "marketplace": {
    "title": "Marketplace de Propiedades",
    "subtitle": "Invierte en propiedades reales con tecnología blockchain",
    "search_placeholder": "Buscar por nombre, ubicación...",

    "filters": {
      "all": "Todas",
      "houses": "Casas",
      "apartments": "Departamentos",
      "hotels": "Hoteles",
      "commercial": "Comercial"
    },

    "property_card": {
      "bedrooms": "{{count}} habitaciones",
      "bathrooms": "{{count}} baños",
      "area": "{{value}} m²",
      "available_tokens": "Tokens disponibles",
      "price_per_token": "Precio por token",
      "total_value": "Valor total",
      "view_details": "Ver detalles",
      "evaluated_by": "Evaluado por {{name}}"
    },

    "no_results": "No se encontraron propiedades",
    "loading": "Cargando propiedades..."
  },

  "property_details": {
    "title": "Detalles de la Propiedad",
    "overview": "Descripción General",
    "token_info": "Información de Tokens",
    "investment_summary": "Resumen de Inversión",
    "transaction_history": "Historial de Transacciones",

    "invest_button": "Invertir Ahora",
    "share_button": "Compartir",

    "specs": {
      "bedrooms": "Habitaciones",
      "bathrooms": "Baños",
      "area": "Área",
      "location": "Ubicación",
      "category": "Categoría"
    },

    "tokens": {
      "total": "Tokens Totales",
      "available": "Disponibles",
      "price": "Precio por Token",
      "minimum": "Inversión Mínima",
      "maximum": "Inversión Máxima"
    }
  },

  "auth": {
    "login": "Iniciar Sesión",
    "register": "Registrarse",
    "logout": "Cerrar Sesión",

    "email": "Correo electrónico",
    "password": "Contraseña",
    "name": "Nombre completo",
    "confirm_password": "Confirmar contraseña",

    "sign_in_with_google": "Continuar con Google",
    "sign_in_with_github": "Continuar con GitHub",

    "or_continue_with": "O continúa con",
    "already_have_account": "¿Ya tienes cuenta?",
    "dont_have_account": "¿No tienes cuenta?",

    "errors": {
      "invalid_credentials": "Credenciales inválidas",
      "email_exists": "El email ya está registrado",
      "weak_password": "La contraseña es muy débil",
      "passwords_dont_match": "Las contraseñas no coinciden"
    },

    "success": {
      "login": "Sesión iniciada exitosamente",
      "register": "Cuenta creada exitosamente",
      "logout": "Sesión cerrada"
    },

    "wallet_warning": {
      "title": "⚠️ GUARDA TU CLAVE SECRETA",
      "message": "Esta es la ÚNICA vez que verás esta clave. Sin ella, perderás acceso a tu wallet para siempre.",
      "copy_button": "Copiar Clave"
    }
  },

  "wallet": {
    "title": "Mi Wallet",
    "connect": "Conectar Freighter",
    "disconnect": "Desconectar",
    "copy_address": "Copiar dirección",

    "balance": {
      "title": "Balance",
      "xlm": "XLM",
      "tokens": "Tokens de Propiedades",
      "total_value": "Valor Total"
    },

    "transactions": {
      "title": "Transacciones",
      "type": "Tipo",
      "amount": "Monto",
      "date": "Fecha",
      "status": "Estado",
      "hash": "Hash",

      "types": {
        "send": "Enviado",
        "receive": "Recibido",
        "token_purchase": "Compra de Tokens",
        "token_sale": "Venta de Tokens"
      },

      "no_transactions": "No hay transacciones aún"
    }
  },

  "seller": {
    "dashboard_title": "Dashboard de Vendedor",
    "upload_property": "Publicar Propiedad",
    "my_properties": "Mis Propiedades",

    "upload_form": {
      "step_1": "Detalles de la Propiedad",
      "step_2": "Imágenes",
      "step_3": "Configuración de Tokens",
      "step_4": "Documentos Legales",
      "step_5": "Revisar y Publicar",

      "fields": {
        "name": "Nombre de la Propiedad",
        "description": "Descripción",
        "category": "Categoría",
        "address": "Dirección",
        "city": "Ciudad",
        "country": "País",
        "bedrooms": "Habitaciones",
        "bathrooms": "Baños",
        "area": "Área (m²)",

        "total_price": "Valor Total (USD)",
        "total_tokens": "Tokens Totales",
        "price_per_token": "Precio por Token (auto-calculado)",
        "min_investment": "Inversión Mínima (tokens)",
        "max_investment": "Inversión Máxima (tokens)"
      },

      "image_upload": {
        "title": "Imágenes de la Propiedad",
        "drag_drop": "Arrastra imágenes aquí o haz click",
        "requirements": "JPG, PNG o WebP • Máx 5MB • Hasta 10 imágenes"
      },

      "buttons": {
        "previous": "Anterior",
        "next": "Siguiente",
        "publish": "Publicar Propiedad"
      },

      "success": "Propiedad publicada y contrato deployado exitosamente"
    }
  },

  "profile": {
    "title": "Mi Perfil",
    "personal_info": "Información Personal",
    "kyc_status": "Estado KYC",
    "my_investments": "Mis Inversiones",
    "my_properties": "Mis Propiedades",

    "stats": {
      "investments": "Inversiones",
      "properties": "Propiedades",
      "total_invested": "Total Invertido",
      "kyc_level": "Nivel KYC"
    },

    "kyc": {
      "level_0": "No verificado",
      "level_1": "Verificación Básica",
      "level_2": "Verificación Completa",
      "level_3": "Verificación Institucional",

      "monthly_limit": "Límite Mensual",
      "verify_now": "Verificar Ahora",
      "upgrade": "Aumentar Límite"
    }
  },

  "evaluators": {
    "title": "Evaluadores Certificados",
    "search_placeholder": "Buscar evaluador...",

    "profile": {
      "total_evaluations": "Evaluaciones",
      "trust_score": "Puntuación de Confianza",
      "total_value": "Valor Evaluado",
      "certified_since": "Certificado desde",
      "evaluated_properties": "Propiedades Evaluadas"
    }
  },

  "errors": {
    "generic": "Ocurrió un error. Intenta nuevamente.",
    "network": "Error de conexión. Verifica tu internet.",
    "timeout": "Tiempo de espera agotado.",
    "unauthorized": "No tienes permisos para esta acción.",
    "not_found": "Recurso no encontrado.",
    "server_error": "Error del servidor."
  },

  "validation": {
    "required": "Este campo es obligatorio",
    "email_invalid": "Email inválido",
    "min_length": "Mínimo {{count}} caracteres",
    "max_length": "Máximo {{count}} caracteres",
    "min_value": "Valor mínimo: {{value}}",
    "max_value": "Valor máximo: {{value}}"
  }
}
```

**File:** `src/config/locales/en.json`

```json
{
  "common": {
    "loading": "Loading...",
    "error": "Error",
    "success": "Success",
    "cancel": "Cancel",
    "confirm": "Confirm",
    "save": "Save",
    "delete": "Delete",
    "edit": "Edit",
    "view": "View",
    "search": "Search",
    "filter": "Filter",
    "sort": "Sort",
    "clear": "Clear"
  },

  "navigation": {
    "marketplace": "Marketplace",
    "seller": "Seller",
    "wallet": "Wallet",
    "profile": "Profile",
    "evaluators": "Evaluators"
  },

  "marketplace": {
    "title": "Property Marketplace",
    "subtitle": "Invest in real properties with blockchain technology",
    "search_placeholder": "Search by name, location...",

    "filters": {
      "all": "All",
      "houses": "Houses",
      "apartments": "Apartments",
      "hotels": "Hotels",
      "commercial": "Commercial"
    }
  }

  // ... (same structure as Spanish)
}
```

### 13.3 Using Translations in Components

**Basic Usage:**
```javascript
import { useTranslation } from 'react-i18next'

function Marketplace() {
  const { t } = useTranslation()

  return (
    <div>
      <h1>{t('marketplace.title')}</h1>
      <p>{t('marketplace.subtitle')}</p>
      <input placeholder={t('marketplace.search_placeholder')} />
    </div>
  )
}
```

**With Interpolation:**
```javascript
function PropertyCard({ property }) {
  const { t } = useTranslation()

  return (
    <div>
      <p>{t('marketplace.property_card.bedrooms', { count: property.bedrooms })}</p>
      <p>{t('marketplace.property_card.area', { value: property.area })}</p>
    </div>
  )
}
```

**Pluralization:**
```json
{
  "items": {
    "one": "{{count}} item",
    "other": "{{count}} items"
  }
}
```

```javascript
<p>{t('items', { count: itemCount })}</p>
// count = 1: "1 item"
// count = 5: "5 items"
```

### 13.4 Language Switcher Component

**File:** `src/components/ui/language-switcher.jsx`

```javascript
import { useTranslation } from 'react-i18next'
import { Globe } from 'lucide-react'
import { Button } from './button'

export function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const toggleLanguage = () => {
    const newLang = i18n.language === 'es' ? 'en' : 'es'
    i18n.changeLanguage(newLang)
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="gap-2"
    >
      <Globe className="w-4 h-4" />
      <span className="font-semibold">
        {i18n.language.toUpperCase()}
      </span>
    </Button>
  )
}
```

**Advanced Dropdown Version:**
```javascript
import { Check } from 'lucide-react'

const LANGUAGES = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇺🇸' }
]

export function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode)
    setIsOpen(false)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <Globe className="w-4 h-4 mr-2" />
          {i18n.language.toUpperCase()}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
          >
            <span className="mr-2">{lang.flag}</span>
            <span>{lang.name}</span>
            {i18n.language === lang.code && (
              <Check className="w-4 h-4 ml-auto" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

---

## 14. Build & Development

### 14.1 Development Server

**Start Development:**
```bash
npm run dev
```

**Output:**
```
  VITE v7.2.2  ready in 342 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.1.100:5173/
  ➜  press h to show help
```

**Features:**
- ⚡ Instant HMR (Hot Module Replacement)
- 🔥 Fast Refresh for React
- 📦 Optimized dependency pre-bundling
- 🎯 Smart error overlay
- 🔌 Plugin hot reload

**Vite Commands in Dev:**
```
Press r to restart the server
Press u to show server url
Press o to open in browser
Press c to clear console
Press q to quit
```

### 14.2 Production Build

**Build Command:**
```bash
npm run build
```

**Build Process:**
```
vite v7.2.2 building for production...
✓ 1247 modules transformed.
dist/index.html                    0.46 kB │ gzip: 0.30 kB
dist/assets/index-BfZLMr3J.css    45.23 kB │ gzip: 7.82 kB
dist/assets/index-C9vW8pZ7.js    523.45 kB │ gzip: 168.32 kB

✓ built in 4.32s
```

**Output Structure:**
```
dist/
├── index.html                      # Entry HTML (minified)
├── assets/
│   ├── index-[hash].js            # Main bundle
│   ├── index-[hash].css           # Styles bundle
│   ├── vendor-[hash].js           # Vendor chunk (React, etc.)
│   ├── stellar-[hash].js          # Stellar SDK chunk
│   └── query-[hash].js            # TanStack Query chunk
└── [public files copied]
```

**Build Optimizations:**
- ✅ Tree-shaking (removes unused code)
- ✅ Minification (Terser for JS, Lightning CSS for CSS)
- ✅ Code splitting (manual chunks)
- ✅ Asset optimization
- ✅ Gzip compression
- ✅ Source maps (optional)

### 14.3 Preview Build

**Preview Command:**
```bash
npm run preview
```

**Output:**
```
  ➜  Local:   http://localhost:4173/
  ➜  Network: http://192.168.1.100:4173/
```

**Purpose:**
- Test production build locally
- Verify optimizations
- Check for build-specific issues
- Validate bundle sizes

### 14.4 Linting

**Lint Command:**
```bash
npm run lint
```

**ESLint Configuration:**
```javascript
// eslint.config.js
import js from '@eslint/js'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module'
      }
    },
    settings: { react: { version: '19.2' } },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }
      ],
      'no-unused-vars': ['error', {
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_'
      }]
    }
  }
]
```

**Lint Output:**
```
✖ 3 problems (2 errors, 1 warning)
  2 errors and 0 warnings potentially fixable with the `--fix` option.

/src/components/PropertyCard.jsx
  12:7  warning  Component should be exported directly  react-refresh/only-export-components
  45:12 error    'property' is defined but never used    no-unused-vars

/src/pages/Marketplace.jsx
  78:18 error    'data' is assigned a value but never used  no-unused-vars
```

### 14.5 Performance Monitoring

**Bundle Size Analysis:**
```bash
npm run build -- --mode analyze
```

**With rollup-plugin-visualizer:**
```javascript
// vite.config.js
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  ]
})
```

**Lighthouse CI (Future):**
```bash
npm install -D @lhci/cli

# Run Lighthouse
lhci autorun
```

### 14.6 Development Tips

**Fast Refresh Rules:**
```javascript
// ✅ Good - Default export
export default function Component() {
  return <div>Hello</div>
}

// ✅ Good - Named export with constant
export const Component = () => {
  return <div>Hello</div>
}

// ❌ Bad - Multiple exports from same file
export function Component1() {}
export function Component2() {}  // Fast Refresh won't work
```

**Environment Variables:**
```javascript
// Access in code (must start with VITE_)
const apiUrl = import.meta.env.VITE_API_URL

// Check mode
if (import.meta.env.DEV) {
  console.log('Development mode')
}

if (import.meta.env.PROD) {
  // Production-only code
}
```

**Hot Module Replacement API:**
```javascript
if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    // Handle HMR update
  })
}
```

---

## 15. Environment Configuration

### 15.1 Environment Variables

**File:** `.env.example`

```env
# ============================================
# BLOCKI FRONTEND ENVIRONMENT VARIABLES
# ============================================

# Backend API
VITE_API_URL=http://localhost:3000

# Stellar Configuration
VITE_STELLAR_NETWORK=testnet
VITE_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org:443
VITE_NETWORK_PASSPHRASE=Test SDF Network ; September 2015

# Smart Contract IDs (populate after deployment)
VITE_PROPERTY_TOKEN_DEPLOYER_ID=
VITE_MARKETPLACE_CONTRACT_ID=
VITE_ESCROW_CONTRACT_ID=
VITE_REGISTRY_CONTRACT_ID=

# Feature Flags
VITE_FREIGHTER_ENABLED=true
VITE_ENABLE_KYC=true
VITE_ENABLE_FIAT_CONVERSION=true
VITE_USE_MOCK_DATA=false

# Analytics (optional)
VITE_GOOGLE_ANALYTICS_ID=
VITE_HOTJAR_ID=

# Sentry (optional)
VITE_SENTRY_DSN=
VITE_SENTRY_ENVIRONMENT=development
```

**File:** `.env.local` (gitignored)

```env
# Local development overrides
VITE_API_URL=http://localhost:3000
VITE_STELLAR_NETWORK=testnet

# Local contract IDs
VITE_PROPERTY_TOKEN_DEPLOYER_ID=CA...
VITE_MARKETPLACE_CONTRACT_ID=CB...
```

**File:** `.env.production`

```env
# Production configuration
VITE_API_URL=https://api.blocki.com
VITE_STELLAR_NETWORK=mainnet
VITE_SOROBAN_RPC_URL=https://soroban-mainnet.stellar.org:443
VITE_NETWORK_PASSPHRASE=Public Global Stellar Network ; September 2015

# Production contract IDs
VITE_PROPERTY_TOKEN_DEPLOYER_ID=CC...
VITE_MARKETPLACE_CONTRACT_ID=CD...

# Feature flags
VITE_USE_MOCK_DATA=false
VITE_SENTRY_ENVIRONMENT=production
```

### 15.2 Using Environment Variables

**In Code:**
```javascript
// src/shared/constants/api.js
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// src/shared/constants/stellar.js
export const STELLAR_CONFIG = {
  NETWORK: import.meta.env.VITE_STELLAR_NETWORK || 'testnet',
  SOROBAN_RPC_URL: import.meta.env.VITE_SOROBAN_RPC_URL,
  CONTRACTS: {
    DEPLOYER: import.meta.env.VITE_PROPERTY_TOKEN_DEPLOYER_ID
  }
}

// Check feature flags
if (import.meta.env.VITE_FREIGHTER_ENABLED === 'true') {
  // Enable Freighter integration
}
```

**Type Safety with TypeScript (if migrating):**
```typescript
// env.d.ts
interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_STELLAR_NETWORK: 'testnet' | 'mainnet'
  readonly VITE_SOROBAN_RPC_URL: string
  readonly VITE_FREIGHTER_ENABLED: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

### 15.3 Deployment Environments

**Development:**
```bash
npm run dev
# Uses .env.local
```

**Staging:**
```bash
npm run build -- --mode staging
# Uses .env.staging
```

**Production:**
```bash
npm run build
# Uses .env.production
```

### 15.4 Configuration Management

**Create `.env` from example:**
```bash
cp .env.example .env.local
```

**Validate environment:**
```javascript
// src/config/validateEnv.js
export function validateEnv() {
  const required = [
    'VITE_API_URL',
    'VITE_STELLAR_NETWORK',
    'VITE_SOROBAN_RPC_URL'
  ]

  const missing = required.filter(
    key => !import.meta.env[key]
  )

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    )
  }
}

// In main.jsx
validateEnv()
```

---

## 16. Performance Optimization

### 16.1 Code Splitting Strategies

**Route-Based Splitting:**
```javascript
import { lazy, Suspense } from 'react'

// Lazy load pages
const Marketplace = lazy(() => import('./pages/marketplace/Marketplace'))
const PropertyDetails = lazy(() => import('./pages/property/PropertyDetailsPage'))
const SellerDashboard = lazy(() => import('./pages/seller/SellerDashboard'))

function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/" element={<Marketplace />} />
        <Route path="/property/:id" element={<PropertyDetails />} />
        <Route path="/seller" element={<SellerDashboard />} />
      </Routes>
    </Suspense>
  )
}
```

**Component-Based Splitting:**
```javascript
// Heavy component loaded on demand
const ImageGallery = lazy(() => import('./components/ImageGallery'))

function PropertyDetails() {
  return (
    <div>
      <Suspense fallback={<Skeleton className="h-96" />}>
        <ImageGallery images={property.images} />
      </Suspense>
    </div>
  )
}
```

### 16.2 React Optimization Patterns

**Memoization:**
```javascript
import { memo, useMemo, useCallback } from 'react'

// Memoize component
const PropertyCard = memo(function PropertyCard({ property }) {
  return <div>{property.name}</div>
}, (prevProps, nextProps) => {
  // Custom comparison
  return prevProps.property.id === nextProps.property.id
})

// Memoize expensive calculations
function PropertyList({ properties, filters }) {
  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      // Expensive filtering logic
      return p.category === filters.category
    })
  }, [properties, filters])

  return <div>{filteredProperties.map(...)}</div>
}

// Memoize callbacks
function Parent() {
  const handleClick = useCallback(() => {
    console.log('Clicked')
  }, []) // Only created once

  return <Child onClick={handleClick} />
}
```

**Virtual Scrolling (for long lists):**
```bash
npm install @tanstack/react-virtual
```

```javascript
import { useVirtualizer } from '@tanstack/react-virtual'

function PropertyList({ properties }) {
  const parentRef = useRef()

  const virtualizer = useVirtualizer({
    count: properties.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 400, // Estimated height of each item
    overscan: 5 // Render 5 items outside viewport
  })

  return (
    <div ref={parentRef} className="h-screen overflow-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: 'relative'
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`
            }}
          >
            <PropertyCard property={properties[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  )
}
```

### 16.3 Image Optimization

**Lazy Loading Images:**
```javascript
function OptimizedImage({ src, alt, ...props }) {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <div className="relative">
      {!isLoaded && (
        <Skeleton className="absolute inset-0" />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        className={cn(
          'transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0'
        )}
        {...props}
      />
    </div>
  )
}
```

**Progressive Image Loading:**
```javascript
function ProgressiveImage({ lowQualitySrc, highQualitySrc, alt }) {
  const [src, setSrc] = useState(lowQualitySrc)

  useEffect(() => {
    const img = new Image()
    img.src = highQualitySrc
    img.onload = () => setSrc(highQualitySrc)
  }, [highQualitySrc])

  return (
    <img
      src={src}
      alt={alt}
      className={cn(
        'transition-all duration-500',
        src === lowQualitySrc && 'blur-sm'
      )}
    />
  )
}
```

### 16.4 Bundle Optimization

**Manual Code Splitting (Vite Config):**
```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk (React, ReactDOM, Router)
          vendor: [
            'react',
            'react-dom',
            'react-router-dom'
          ],

          // Stellar chunk
          stellar: [
            '@stellar/stellar-sdk',
            '@stellar/freighter-api'
          ],

          // TanStack Query chunk
          query: [
            '@tanstack/react-query',
            '@tanstack/react-query-devtools'
          ],

          // UI libraries
          ui: [
            'framer-motion',
            'lucide-react',
            '@radix-ui/react-tabs'
          ]
        }
      }
    },

    // Chunk size warnings
    chunkSizeWarningLimit: 600 // KB
  }
})
```

### 16.5 Network Optimization

**Prefetching:**
```javascript
import { useQueryClient } from '@tanstack/react-query'

function PropertyCard({ property }) {
  const queryClient = useQueryClient()

  const handleMouseEnter = () => {
    // Prefetch property details on hover
    queryClient.prefetchQuery({
      queryKey: ['properties', 'detail', property.id],
      queryFn: () => propertyService.getProperty(property.id)
    })
  }

  return (
    <Link
      to={`/property/${property.id}`}
      onMouseEnter={handleMouseEnter}
    >
      {/* Card content */}
    </Link>
  )
}
```

**Request Batching:**
```javascript
// Batch multiple property requests
async function fetchPropertiesBatch(ids) {
  const response = await api.post('/properties/batch', { ids })
  return response.data
}

// In component
const { data: properties } = useQuery({
  queryKey: ['properties', 'batch', ids],
  queryFn: () => fetchPropertiesBatch(ids),
  enabled: ids.length > 0
})
```

### 16.6 Performance Monitoring

**Web Vitals:**
```bash
npm install web-vitals
```

```javascript
// src/utils/reportWebVitals.js
import { onCLS, onFCP, onFID, onLCP, onTTFB } from 'web-vitals'

export function reportWebVitals(onPerfEntry) {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    onCLS(onPerfEntry)   // Cumulative Layout Shift
    onFCP(onPerfEntry)   // First Contentful Paint
    onFID(onPerfEntry)   // First Input Delay
    onLCP(onPerfEntry)   // Largest Contentful Paint
    onTTFB(onPerfEntry)  // Time to First Byte
  }
}

// In main.jsx
import { reportWebVitals } from './utils/reportWebVitals'

reportWebVitals(console.log)
```

**React DevTools Profiler:**
```javascript
import { Profiler } from 'react'

function App() {
  const onRender = (id, phase, actualDuration) => {
    console.log(`${id} (${phase}) took ${actualDuration}ms`)
  }

  return (
    <Profiler id="App" onRender={onRender}>
      {/* App content */}
    </Profiler>
  )
}
```

---

## 17. Security Considerations

### 17.1 Authentication Security

**JWT Storage:**
```javascript
// ✅ Good - localStorage (acceptable for non-critical apps)
localStorage.setItem('blocki_token', token)

// ❌ Avoid - Cookies without httpOnly (XSS vulnerable)
document.cookie = `token=${token}`

// ✅ Better - httpOnly cookies (backend-managed)
// Set by backend in Set-Cookie header
// Not accessible from JavaScript
```

**Token Expiration:**
```javascript
// Check token expiration before requests
function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

// In axios interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('blocki_token')

  if (token && isTokenExpired(token)) {
    // Auto-logout
    localStorage.clear()
    window.location.href = '/auth'
    return Promise.reject(new Error('Token expired'))
  }

  config.headers.Authorization = `Bearer ${token}`
  return config
})
```

### 17.2 XSS Prevention

**React Auto-Escaping:**
```jsx
// ✅ Safe - React auto-escapes
<div>{userInput}</div>

// ❌ Dangerous - Bypass escaping
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ Safe alternative - Use library for sanitization
import DOMPurify from 'dompurify'

<div dangerouslySetInnerHTML={{
  __html: DOMPurify.sanitize(userInput)
}} />
```

**URL Sanitization:**
```javascript
// Validate URLs before navigation
function isSafeUrl(url) {
  try {
    const parsed = new URL(url, window.location.origin)
    return ['http:', 'https:'].includes(parsed.protocol)
  } catch {
    return false
  }
}

// Usage
const handleLinkClick = (url) => {
  if (isSafeUrl(url)) {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}
```

### 17.3 CSRF Protection

**SameSite Cookies (Backend):**
```javascript
// Backend sets cookie with SameSite
res.cookie('token', jwt, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict'
})
```

**CSRF Tokens (if needed):**
```javascript
// Get CSRF token from meta tag
const csrfToken = document.querySelector('meta[name="csrf-token"]').content

// Include in requests
api.interceptors.request.use((config) => {
  config.headers['X-CSRF-Token'] = csrfToken
  return config
})
```

### 17.4 Content Security Policy

**Meta Tag (in index.html):**
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https: blob:;
  connect-src 'self' https://soroban-testnet.stellar.org https://horizon-testnet.stellar.org;
  frame-src 'self' https://accounts.google.com;
">
```

### 17.5 Sensitive Data Handling

**Never Log Sensitive Data:**
```javascript
// ❌ Bad
console.log('User data:', user)  // May contain wallet keys!

// ✅ Good
console.log('User ID:', user.id)

// ✅ Good - Redact sensitive fields
const sanitized = {
  ...user,
  walletSecret: '[REDACTED]',
  email: user.email.replace(/(.{2}).*(@.*)/, '$1***$2')
}
console.log('User data:', sanitized)
```

**Wallet Secret Key Warnings:**
```javascript
// Show prominent warning when displaying secret keys
function SecretKeyDisplay({ secretKey }) {
  const [confirmed, setConfirmed] = useState(false)

  if (!confirmed) {
    return (
      <Alert variant="destructive">
        <AlertTitle>⚠️ DANGER: Secret Key</AlertTitle>
        <AlertDescription>
          This key gives FULL access to your wallet. Never share it!
          <Button onClick={() => setConfirmed(true)}>
            I understand, show key
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="bg-destructive/10 p-4 rounded-lg">
      <code className="font-mono break-all">{secretKey}</code>
      <Button onClick={() => copyToClipboard(secretKey)}>
        Copy (one time only)
      </Button>
    </div>
  )
}
```

### 17.6 API Security

**Rate Limiting (Frontend):**
```javascript
// Simple rate limiter
class RateLimiter {
  constructor(maxRequests, timeWindow) {
    this.maxRequests = maxRequests
    this.timeWindow = timeWindow
    this.requests = []
  }

  canMakeRequest() {
    const now = Date.now()
    this.requests = this.requests.filter(
      time => now - time < this.timeWindow
    )

    if (this.requests.length < this.maxRequests) {
      this.requests.push(now)
      return true
    }

    return false
  }
}

const limiter = new RateLimiter(10, 60000) // 10 req/min

// In API call
if (!limiter.canMakeRequest()) {
  throw new Error('Rate limit exceeded')
}
```

**Input Validation:**
```javascript
// Validate before sending to API
function validatePropertyData(data) {
  const schema = {
    name: { type: 'string', minLength: 3, maxLength: 100 },
    totalPrice: { type: 'number', min: 1000, max: 100000000 },
    totalTokens: { type: 'number', min: 100, max: 10000000 }
  }

  for (const [key, rules] of Object.entries(schema)) {
    const value = data[key]

    if (rules.type === 'string') {
      if (typeof value !== 'string') {
        throw new Error(`${key} must be a string`)
      }
      if (value.length < rules.minLength) {
        throw new Error(`${key} too short`)
      }
      if (value.length > rules.maxLength) {
        throw new Error(`${key} too long`)
      }
    }

    if (rules.type === 'number') {
      if (typeof value !== 'number') {
        throw new Error(`${key} must be a number`)
      }
      if (value < rules.min || value > rules.max) {
        throw new Error(`${key} out of range`)
      }
    }
  }

  return true
}
```

---

## 18. Testing Strategy

### 18.1 Testing Philosophy

**Testing Pyramid:**
```
        /\
       /  \      E2E Tests (few) - Full user flows
      /────\
     /      \    Integration Tests (some) - Component + API
    /────────\
   /          \  Unit Tests (many) - Pure functions, utils
  /────────────\
```

### 18.2 Unit Testing Setup

**Install Testing Dependencies:**
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

**Vite Test Config:**
```javascript
// vite.config.js
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: true
  }
})
```

**Test Setup:**
```javascript
// src/test/setup.js
import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

expect.extend(matchers)

afterEach(() => {
  cleanup()
})
```

### 18.3 Component Testing

**Testing Button Component:**
```javascript
// src/components/ui/__tests__/button.test.jsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '../button'

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies variant classes', () => {
    const { container } = render(
      <Button variant="destructive">Delete</Button>
    )

    expect(container.firstChild).toHaveClass('bg-destructive')
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByText('Disabled')).toBeDisabled()
  })
})
```

**Testing with Mock Data:**
```javascript
// src/components/properties/__tests__/PropertyCard.test.jsx
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { PropertyCard } from '../PropertyCard'

const mockProperty = {
  id: 1,
  name: 'Casa en Buenos Aires',
  city: 'Buenos Aires',
  country: 'Argentina',
  bedrooms: 3,
  bathrooms: 2,
  area: 120,
  totalPrice: 500000,
  totalTokens: 100000,
  availableTokens: 50000,
  pricePerToken: 5
}

function renderPropertyCard(props = {}) {
  return render(
    <BrowserRouter>
      <PropertyCard property={mockProperty} {...props} />
    </BrowserRouter>
  )
}

describe('PropertyCard', () => {
  it('displays property name', () => {
    renderPropertyCard()
    expect(screen.getByText('Casa en Buenos Aires')).toBeInTheDocument()
  })

  it('displays property stats', () => {
    renderPropertyCard()
    expect(screen.getByText(/3/)).toBeInTheDocument() // bedrooms
    expect(screen.getByText(/2/)).toBeInTheDocument() // bathrooms
    expect(screen.getByText(/120m²/)).toBeInTheDocument()
  })

  it('calculates sold percentage correctly', () => {
    renderPropertyCard()
    // 50000 / 100000 = 50%
    expect(screen.getByText('50.0%')).toBeInTheDocument()
  })
})
```

### 18.4 Hook Testing

```javascript
// src/hooks/__tests__/useProperties.test.js
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useProperties } from '../useProperties'
import { propertyService } from '@/services'
import { vi } from 'vitest'

vi.mock('@/services', () => ({
  propertyService: {
    getProperties: vi.fn()
  }
}))

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  })

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('useProperties', () => {
  it('fetches properties successfully', async () => {
    const mockProperties = [{ id: 1, name: 'Test Property' }]
    propertyService.getProperties.mockResolvedValue(mockProperties)

    const { result } = renderHook(() => useProperties(), {
      wrapper: createWrapper()
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(mockProperties)
  })

  it('handles errors', async () => {
    propertyService.getProperties.mockRejectedValue(
      new Error('Network error')
    )

    const { result } = renderHook(() => useProperties(), {
      wrapper: createWrapper()
    })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(result.current.error.message).toBe('Network error')
  })
})
```

### 18.5 Integration Testing

```javascript
// src/pages/__tests__/Marketplace.integration.test.jsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Marketplace } from '../Marketplace'
import { propertyService } from '@/services'

vi.mock('@/services')

function renderMarketplace() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Marketplace />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

describe('Marketplace Integration', () => {
  it('fetches and displays properties', async () => {
    propertyService.getProperties.mockResolvedValue([
      { id: 1, name: 'Property 1' },
      { id: 2, name: 'Property 2' }
    ])

    renderMarketplace()

    await waitFor(() => {
      expect(screen.getByText('Property 1')).toBeInTheDocument()
      expect(screen.getByText('Property 2')).toBeInTheDocument()
    })
  })

  it('filters properties by category', async () => {
    const user = userEvent.setup()

    propertyService.getProperties.mockResolvedValue([
      { id: 1, name: 'House', category: 'houses' }
    ])

    renderMarketplace()

    await waitFor(() => {
      expect(screen.getByText('House')).toBeInTheDocument()
    })

    // Click "Apartments" filter
    await user.click(screen.getByText('Apartments'))

    // Should call API with filter
    expect(propertyService.getProperties).toHaveBeenCalledWith({
      category: 'apartments'
    })
  })
})
```

### 18.6 E2E Testing (Planned)

**With Playwright:**
```bash
npm install -D @playwright/test
```

```javascript
// e2e/marketplace.spec.js
import { test, expect } from '@playwright/test'

test.describe('Marketplace', () => {
  test('should load and display properties', async ({ page }) => {
    await page.goto('http://localhost:5173')

    // Wait for properties to load
    await page.waitForSelector('.property-card')

    // Check that at least one property is displayed
    const properties = await page.$$('.property-card')
    expect(properties.length).toBeGreaterThan(0)
  })

  test('should navigate to property details', async ({ page }) => {
    await page.goto('http://localhost:5173')

    // Click first property
    await page.click('.property-card:first-child')

    // Should navigate to details page
    await page.waitForURL(/\/property\/\d+/)

    // Check for property details content
    await expect(page.locator('h1')).toBeVisible()
  })
})
```

---

## 19. Deployment Pipeline

### 19.1 Deployment Platform: Dockploy

**Auto-Deploy Configuration:**
```yaml
# dockploy.yml (example)
name: blocki-frontend

build:
  command: npm run build
  output: dist

env:
  VITE_API_URL: ${API_URL}
  VITE_STELLAR_NETWORK: ${STELLAR_NETWORK}
  VITE_SOROBAN_RPC_URL: ${SOROBAN_RPC_URL}

deploy:
  branch: main
  auto: true
```

**Environment Variables in Dockploy:**
1. Navigate to project settings
2. Add environment variables:
   - `VITE_API_URL`
   - `VITE_STELLAR_NETWORK`
   - All contract IDs
3. Deploy triggers automatically on push to main

### 19.2 Build Process

**Pre-Deploy Checklist:**
```bash
# 1. Run tests
npm test

# 2. Lint code
npm run lint

# 3. Build locally
npm run build

# 4. Preview build
npm run preview

# 5. Check bundle size
ls -lh dist/assets/
```

**Build Output Analysis:**
```bash
# View build stats
npm run build -- --mode analyze

# Expected output:
# dist/assets/index-[hash].js      523 KB  (gzip: 168 KB)
# dist/assets/vendor-[hash].js     345 KB  (gzip: 112 KB)
# dist/assets/stellar-[hash].js    89 KB   (gzip: 28 KB)
```

### 19.3 CI/CD with GitHub Actions

**File:** `.github/workflows/deploy.yml`

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
          VITE_STELLAR_NETWORK: ${{ secrets.VITE_STELLAR_NETWORK }}

      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: dist
          path: dist

      - name: Deploy to Dockploy
        run: |
          # Trigger Dockploy webhook
          curl -X POST ${{ secrets.DOCKPLOY_WEBHOOK_URL }}
```

### 19.4 Rollback Strategy

**Git-Based Rollback:**
```bash
# Find previous working commit
git log --oneline

# Revert to previous commit
git revert <commit-hash>

# Push to trigger redeploy
git push origin main
```

**Dockploy Rollback:**
1. Navigate to deployment history
2. Select previous successful deployment
3. Click "Rollback to this version"
4. Confirm rollback

### 19.5 Monitoring & Alerts

**Health Check Endpoint:**
```javascript
// Create public/health.json
{
  "status": "ok",
  "version": "2.0.0",
  "timestamp": "2025-01-21T12:00:00Z"
}

// Monitor endpoint
// https://blocki.com/health.json
```

**Uptime Monitoring:**
- Use UptimeRobot or similar
- Monitor: https://blocki.com/health.json
- Alert on: HTTP 500, timeout, downtime > 5min

---

## 20. Troubleshooting Guide

### 20.1 Common Development Issues

**Issue: Vite not starting**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite

# Try different port
npm run dev -- --port 3000
```

**Issue: Hot reload not working**
```javascript
// Check vite.config.js
export default defineConfig({
  server: {
    watch: {
      usePolling: true  // Try if HMR fails
    }
  }
})
```

**Issue: Tailwind styles not applying**
```bash
# Rebuild Tailwind
npm run build

# Check index.css has @import "tailwindcss"
# Check className (not class)
# Clear browser cache
```

### 20.2 API Integration Issues

**Issue: CORS errors**
```javascript
// Backend needs to allow frontend origin
// Check backend CORS config:
app.use(cors({
  origin: 'http://localhost:5173',  // Vite dev server
  credentials: true
}))
```

**Issue: 401 Unauthorized**
```javascript
// Check token exists
console.log(localStorage.getItem('blocki_token'))

// Check token format
const token = localStorage.getItem('blocki_token')
console.log(token.split('.').length === 3)  // Should be true

// Check expiration
const payload = JSON.parse(atob(token.split('.')[1]))
console.log(new Date(payload.exp * 1000))
```

**Issue: Request timeout**
```javascript
// Increase timeout in api.js
const api = axios.create({
  timeout: 60000  // 60 seconds
})
```

### 20.3 State Management Issues

**Issue: Queries not refetching**
```javascript
// Force refetch
queryClient.invalidateQueries({ queryKey: ['properties'] })

// Check staleTime
useQuery({
  queryKey: ['properties'],
  queryFn: fetchProperties,
  staleTime: 0  // Always refetch
})
```

**Issue: Cache not updating after mutation**
```javascript
// Ensure invalidation in mutation
useMutation({
  mutationFn: createProperty,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['properties'] })
  }
})
```

### 20.4 Build Issues

**Issue: Build fails with module not found**
```bash
# Check import paths
# Use @ alias consistently
import { Button } from '@/components/ui'

# Check jsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

**Issue: Out of memory during build**
```bash
# Increase Node memory
NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

### 20.5 Blockchain Integration Issues

**Issue: Freighter not detected**
```javascript
// Check Freighter installed
const installed = await isConnected()
if (!installed) {
  window.open('https://freighter.app', '_blank')
}

// Check browser compatibility
// Freighter only works on Chrome/Firefox/Brave
```

**Issue: Transaction failing**
```javascript
// Check network
console.log('Network:', STELLAR_CONFIG.NETWORK)

// Check account exists
const account = await server.loadAccount(publicKey)
console.log('Account balance:', account.balances)

// Check transaction fee
console.log('Base fee:', STELLAR_CONFIG.BASE_FEE)
```

### 20.6 Debug Tools

**React DevTools:**
- Install React DevTools extension
- Inspect component tree
- View props and state
- Profile rendering performance

**TanStack Query DevTools:**
```javascript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

// Add to App.jsx
<ReactQueryDevtools initialIsOpen={false} />
```

**Network Tab (Browser):**
- Monitor API requests
- Check request/response
- Verify headers (Authorization, Content-Type)
- Check timing

**Console Logs:**
```javascript
// Enable verbose logging in development
if (import.meta.env.DEV) {
  console.log('[PropertyService] Getting properties:', filters)
}
```

---

## Conclusion

Este README_DAY_02_FRONT proporciona una documentación técnica exhaustiva y profesional del frontend de Blocki. Cubre:

✅ **20 secciones principales** con información detallada
✅ **Ejemplos de código reales** del proyecto
✅ **Diagramas y flujos** para visualización
✅ **Best practices** y patrones de diseño
✅ **Configuraciones completas** de todas las herramientas
✅ **Guías de troubleshooting** para resolver problemas comunes

**Tecnologías clave documentadas:**
- React 19 + Vite 7
- Tailwind CSS v4
- TanStack Query v5
- Stellar SDK + Freighter
- React Router v7
- i18next

**Para profesionales técnicos:**
- Arquitectura detallada
- Patrones de código
- Estrategias de optimización
- Seguridad y testing
- Deployment y CI/CD

Este documento servirá como referencia completa para cualquier desarrollador que trabaje en el proyecto Blocki.

---

**Documentación creada con ❤️ para Blocki - Stellar Buenos Aires 2025 Hackathon**

