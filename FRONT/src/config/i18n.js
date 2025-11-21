import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
  en: {
    translation: {
      // ============================================
      // App General
      // ============================================
      welcome: 'Welcome',
      loading: 'Loading...',
      comingSoon: 'Coming soon...',

      // ============================================
      // Navigation
      // ============================================
      marketplace: 'Marketplace',
      explore: 'Explore',
      portfolio: 'Portfolio',
      profile: 'Profile',

      // ============================================
      // Marketplace Page
      // ============================================
      marketplaceTitle: 'Property Marketplace',
      marketplaceSubtitle:
        'Invest in tokenized properties on the Stellar blockchain. Diversify your portfolio with premium real estate fractions.',
      searchPlaceholder: 'Search properties, locations...',
      propertiesFound: 'properties found',
      propertyFound: 'property found',
      noPropertiesFound: 'No properties available',
      noPropertiesMessage: 'No properties match your search criteria.',
      tryOtherSearch: 'Try other search terms or change the filters.',

      // ============================================
      // Filters
      // ============================================
      all: 'All',
      houses: 'Houses',
      apartments: 'Apartments',
      hotels: 'Hotels',
      commercial: 'Commercial',

      // ============================================
      // Property Card
      // ============================================
      propertyValuation: 'Property Valuation',
      estimatedROI: 'Est. ROI',
      totalTokens: 'Total Tokens',
      available: 'Available',
      pricePerToken: 'Price/Token',
      fundedByInvestors: 'funded by investors',
      viewDetails: 'View Details',
      soldOut: 'Sold Out',
      verified: 'Verified',

      // Property details
      bedrooms: 'Bedrooms',
      bathrooms: 'Bathrooms',
      area: 'Area',
      sqft: 'sqft',

      // ============================================
      // Wallet Connection
      // ============================================
      wallet: 'Wallet',
      stellarWallet: 'Stellar Wallet',
      connectWallet: 'Connect Wallet',
      connectedToFreighter: 'Connected to Freighter',
      connectYourWallet: 'Connect your Freighter wallet',
      connected: 'Connected',
      yourAddress: 'Your Address',
      connectionFailed: 'Connection Failed',
      disconnect: 'Disconnect',
      walletNotInstalled: 'Freighter wallet not installed',
      installFreighter: 'Install Freighter',
      connecting: 'Connecting...',
      walletInfo:
        'Make sure you have Freighter wallet installed to interact with properties',

      // ============================================
      // Search & Filters
      // ============================================
      searchProperties: 'Search properties',
      clearSearch: 'Clear search',
      filterByCategory: 'Filter by category',

      // ============================================
      // Theme
      // ============================================
      lightMode: 'Light mode',
      darkMode: 'Dark mode',
      toggleTheme: 'Toggle theme',

      // ============================================
      // Common Actions
      // ============================================
      close: 'Close',
      cancel: 'Cancel',
      confirm: 'Confirm',
      save: 'Save',
      edit: 'Edit',
      delete: 'Delete',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      refresh: 'Refresh',

      // ============================================
      // Status
      // ============================================
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
      info: 'Info',

      // ============================================
      // Validation & Errors
      // ============================================
      required: 'Required',
      invalidEmail: 'Invalid email',
      invalidPassword: 'Invalid password',
      passwordMismatch: 'Passwords do not match',
      somethingWentWrong: 'Something went wrong',

      // ============================================
      // Time & Dates
      // ============================================
      today: 'Today',
      yesterday: 'Yesterday',
      tomorrow: 'Tomorrow',
      week: 'Week',
      month: 'Month',
      year: 'Year',

      // ============================================
      // Purchase Modal
      // ============================================
      purchaseTokens: 'Purchase Tokens',
      tokensToPurchase: 'Tokens to Purchase',
      totalCost: 'Total Cost',
      transactionFee: 'Transaction Fee',
      grandTotal: 'Grand Total',
      processing: 'Processing...',
      purchaseSuccessful: 'Purchase Successful',
      purchaseComplete: 'Purchase Complete',
      transactionHash: 'Transaction Hash',
      viewOnExplorer: 'View on Explorer',
      purchaseError: 'Purchase Error',
      tryAgain: 'Try Again',
      insufficientFunds: 'Insufficient Funds',
      ownership: 'Ownership',
      yourOwnership: 'Your Ownership',
      estimatedValue: 'Estimated Value',
      youWillOwn: 'You will own',
      ofThisProperty: 'of this property',

      // ============================================
      // OAuth2
      // ============================================
      signInWithGoogle: 'Sign in with Google',
      signInWithGitHub: 'Sign in with GitHub',
      orContinueWith: 'Or continue with',

      // ============================================
      // Profile Page
      // ============================================
      userInformation: 'User Information',
      emailAddress: 'Email Address',
      fullName: 'Full Name',
      walletAddress: 'Wallet Address',
      memberSince: 'Member Since',
      accountSettings: 'Account Settings',
      kycStatus: 'KYC Status',
      notVerified: 'Not Verified',
      startKYC: 'Start KYC',
      myProperties: 'My Properties',
      myInvestments: 'My Investments',

      // ============================================
      // Wallet Page
      // ============================================
      myWallet: 'My Wallet',
      totalBalance: 'Total Balance',
      availableBalance: 'Available Balance',
      recentTransactions: 'Recent Transactions',
      transactionHistory: 'Transaction History',
      deposit: 'Deposit',
      withdraw: 'Withdraw',
      send: 'Send',
      receive: 'Receive',
      amount: 'Amount',
      type: 'Type',
      date: 'Date',
      status: 'Status',
      pending: 'Pending',
      completed: 'Completed',
      failed: 'Failed',
      noTransactions: 'No transactions yet',
      loadMore: 'Load More',
      copyAddress: 'Copy Address',
      addressCopied: 'Address Copied',
      assetType: 'Asset Type',
      balance: 'Balance',
      assets: 'Assets',
      sent: 'Sent',
      received: 'Received',

      // ============================================
      // Properties / Propiedades (Seller Dashboard)
      // ============================================
      properties: 'Properties',
      myProperties: 'My Properties',
      manageYourProperties: 'Manage your tokenized properties and track performance',
      uploadProperty: 'Upload Property',
      totalProperties: 'Total Properties',
      totalRevenue: 'Total Revenue',
      totalInvestors: 'Total Investors',
      activeStatus: 'Active',
      inactiveStatus: 'Inactive',
      pendingStatus: 'Pending Review',
      withInvestors: 'With Investors',
      availableForSale: 'Available for Sale',
      fullyFunded: 'Fully Funded',
      thisMonth: 'this month',
      thisWeek: 'this week',
      noProperties: 'No properties found',
      uploadFirstProperty: 'Upload your first property to start generating revenue',
      noPropertiesWithStatus: 'No properties with this status',
      viewProperty: 'View Property',
      editProperty: 'Edit Property',
      deleteProperty: 'Delete Property',
      pauseListing: 'Pause Listing',
      activateListing: 'Activate Listing',
      revenue: 'Revenue',
      investors: 'Investors',
      value: 'Value',
      funded: 'Funded',
      complete: 'complete',

      // ============================================
      // Property Upload Form
      // ============================================
      uploadNewProperty: 'Upload New Property',
      fillPropertyDetails: 'Fill in the details to tokenize your property on the Stellar blockchain',
      propertyImages: 'Property Images',
      clickToUpload: 'Click to upload images',
      propertyDetails: 'Property Details',
      propertyTitle: 'Property Title',
      location: 'Location',
      propertyType: 'Property Type',
      propertyValue: 'Property Value (USDC)',
      description: 'Description',
      tokenizationSettings: 'Tokenization Settings',
      tokenizationNote: 'Your property will be tokenized on the Stellar blockchain. Each token represents fractional ownership and will be available for investors to purchase.',
      uploading: 'Uploading...',
      back: 'Back',
      continue: 'Continue',
      propertyUploadedSuccessfully: 'Property Uploaded Successfully!',
      propertyUnderReview: 'Your property is now under review. You will be notified once it goes live on the marketplace.',
      propertyName: 'Property Name',

      // ============================================
      // Footer
      // ============================================
      about: 'About',
      aboutUs: 'About Us',
      howItWorks: 'How it Works',
      team: 'Team',
      legal: 'Legal',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      cookies: 'Cookies',
      support: 'Support',
      helpCenter: 'Help Center',
      contact: 'Contact',
      faq: 'FAQ',
      allRightsReserved: 'All rights reserved.',
      poweredBy: 'Powered by',
      footerDescription: 'Decentralized real estate marketplace powered by Stellar blockchain. Invest in tokenized properties with transparency and security.',
    },
  },
  es: {
    translation: {
      // ============================================
      // App General
      // ============================================
      welcome: 'Bienvenido',
      loading: 'Cargando...',
      comingSoon: 'Próximamente...',

      // ============================================
      // Navigation
      // ============================================
      marketplace: 'Marketplace',
      explore: 'Explorar',
      portfolio: 'Portfolio',
      profile: 'Perfil',

      // ============================================
      // Marketplace Page
      // ============================================
      marketplaceTitle: 'Marketplace de Propiedades',
      marketplaceSubtitle:
        'Invierte en propiedades tokenizadas en la blockchain de Stellar. Diversifica tu portafolio con fracciones de bienes raíces premium.',
      searchPlaceholder: 'Buscar propiedades, ubicaciones...',
      propertiesFound: 'propiedades encontradas',
      propertyFound: 'propiedad encontrada',
      noPropertiesFound: 'No hay propiedades disponibles',
      noPropertiesMessage: 'No hay propiedades que coincidan con tus criterios de búsqueda.',
      tryOtherSearch: 'Intenta con otros términos de búsqueda o cambia los filtros.',

      // ============================================
      // Filters
      // ============================================
      all: 'Todas',
      houses: 'Casas',
      apartments: 'Apartamentos',
      hotels: 'Hoteles',
      commercial: 'Comercial',

      // ============================================
      // Property Card
      // ============================================
      propertyValuation: 'Valuación de Propiedad',
      estimatedROI: 'ROI Est.',
      totalTokens: 'Tokens Totales',
      available: 'Disponibles',
      pricePerToken: 'Precio/Token',
      fundedByInvestors: 'financiado por inversores',
      viewDetails: 'Ver Detalles',
      soldOut: 'Agotado',
      verified: 'Verificado',

      // Property details
      bedrooms: 'Habitaciones',
      bathrooms: 'Baños',
      area: 'Área',
      sqft: 'pies²',

      // ============================================
      // Wallet Connection
      // ============================================
      wallet: 'Cartera',
      stellarWallet: 'Wallet de Stellar',
      connectWallet: 'Conectar Wallet',
      connectedToFreighter: 'Conectado a Freighter',
      connectYourWallet: 'Conecta tu wallet de Freighter',
      connected: 'Conectado',
      yourAddress: 'Tu Dirección',
      connectionFailed: 'Conexión Fallida',
      disconnect: 'Desconectar',
      walletNotInstalled: 'Wallet de Freighter no instalado',
      installFreighter: 'Instalar Freighter',
      connecting: 'Conectando...',
      walletInfo:
        'Asegúrate de tener la wallet de Freighter instalada para interactuar con propiedades',

      // ============================================
      // Search & Filters
      // ============================================
      searchProperties: 'Buscar propiedades',
      clearSearch: 'Limpiar búsqueda',
      filterByCategory: 'Filtrar por categoría',

      // ============================================
      // Theme
      // ============================================
      lightMode: 'Modo claro',
      darkMode: 'Modo oscuro',
      toggleTheme: 'Cambiar tema',

      // ============================================
      // Common Actions
      // ============================================
      close: 'Cerrar',
      cancel: 'Cancelar',
      confirm: 'Confirmar',
      save: 'Guardar',
      edit: 'Editar',
      delete: 'Eliminar',
      search: 'Buscar',
      filter: 'Filtrar',
      sort: 'Ordenar',
      refresh: 'Actualizar',

      // ============================================
      // Status
      // ============================================
      success: 'Éxito',
      error: 'Error',
      warning: 'Advertencia',
      info: 'Información',

      // ============================================
      // Validation & Errors
      // ============================================
      required: 'Requerido',
      invalidEmail: 'Email inválido',
      invalidPassword: 'Contraseña inválida',
      passwordMismatch: 'Las contraseñas no coinciden',
      somethingWentWrong: 'Algo salió mal',

      // ============================================
      // Time & Dates
      // ============================================
      today: 'Hoy',
      yesterday: 'Ayer',
      tomorrow: 'Mañana',
      week: 'Semana',
      month: 'Mes',
      year: 'Año',

      // ============================================
      // Purchase Modal
      // ============================================
      purchaseTokens: 'Comprar Tokens',
      tokensToPurchase: 'Tokens a Comprar',
      totalCost: 'Costo Total',
      transactionFee: 'Tarifa de Transacción',
      grandTotal: 'Total General',
      processing: 'Procesando...',
      purchaseSuccessful: 'Compra Exitosa',
      purchaseComplete: 'Compra Completada',
      transactionHash: 'Hash de Transacción',
      viewOnExplorer: 'Ver en Explorer',
      purchaseError: 'Error en Compra',
      tryAgain: 'Intentar de Nuevo',
      insufficientFunds: 'Fondos Insuficientes',
      ownership: 'Propiedad',
      yourOwnership: 'Tu Propiedad',
      estimatedValue: 'Valor Estimado',
      youWillOwn: 'Tendrás',
      ofThisProperty: 'de esta propiedad',

      // ============================================
      // OAuth2
      // ============================================
      signInWithGoogle: 'Iniciar sesión con Google',
      signInWithGitHub: 'Iniciar sesión con GitHub',
      orContinueWith: 'O continuar con',

      // ============================================
      // Profile Page
      // ============================================
      userInformation: 'Información de Usuario',
      emailAddress: 'Dirección de Email',
      fullName: 'Nombre Completo',
      walletAddress: 'Dirección de Wallet',
      memberSince: 'Miembro Desde',
      accountSettings: 'Configuración de Cuenta',
      kycStatus: 'Estado KYC',
      notVerified: 'No Verificado',
      startKYC: 'Iniciar KYC',
      myProperties: 'Mis Propiedades',
      myInvestments: 'Mis Inversiones',

      // ============================================
      // Wallet Page
      // ============================================
      myWallet: 'Mi Cartera',
      totalBalance: 'Balance Total',
      availableBalance: 'Balance Disponible',
      recentTransactions: 'Transacciones Recientes',
      transactionHistory: 'Historial de Transacciones',
      deposit: 'Depositar',
      withdraw: 'Retirar',
      send: 'Enviar',
      receive: 'Recibir',
      amount: 'Cantidad',
      type: 'Tipo',
      date: 'Fecha',
      status: 'Estado',
      pending: 'Pendiente',
      completed: 'Completado',
      failed: 'Fallido',
      noTransactions: 'No hay transacciones aún',
      loadMore: 'Cargar Más',
      copyAddress: 'Copiar Dirección',
      addressCopied: 'Dirección Copiada',
      assetType: 'Tipo de Activo',
      balance: 'Balance',
      assets: 'Activos',
      sent: 'Enviado',
      received: 'Recibido',

      // ============================================
      // Properties / Propiedades (Seller Dashboard)
      // ============================================
      properties: 'Propiedades',
      myProperties: 'Mis Propiedades',
      manageYourProperties: 'Administra tus propiedades tokenizadas y rastrea su rendimiento',
      uploadProperty: 'Subir Propiedad',
      totalProperties: 'Propiedades Totales',
      totalRevenue: 'Ingresos Totales',
      totalInvestors: 'Inversores Totales',
      activeStatus: 'Activo',
      inactiveStatus: 'Inactivo',
      pendingStatus: 'Pendiente',
      withInvestors: 'Con Inversores',
      availableForSale: 'Disponible para Venta',
      fullyFunded: 'Totalmente Financiado',
      thisMonth: 'este mes',
      thisWeek: 'esta semana',
      noProperties: 'No se encontraron propiedades',
      uploadFirstProperty: 'Sube tu primera propiedad para comenzar a generar ingresos',
      noPropertiesWithStatus: 'No hay propiedades con este estado',
      viewProperty: 'Ver Propiedad',
      editProperty: 'Editar Propiedad',
      deleteProperty: 'Eliminar Propiedad',
      pauseListing: 'Pausar Listado',
      activateListing: 'Activar Listado',
      revenue: 'Ingresos',
      investors: 'Inversores',
      value: 'Valor',
      funded: 'Financiado',
      complete: 'completado',

      // ============================================
      // Property Upload Form
      // ============================================
      uploadNewProperty: 'Subir Nueva Propiedad',
      fillPropertyDetails: 'Completa los detalles para tokenizar tu propiedad en la blockchain de Stellar',
      propertyImages: 'Imágenes de la Propiedad',
      clickToUpload: 'Click para subir imágenes',
      propertyDetails: 'Detalles de la Propiedad',
      propertyTitle: 'Título de la Propiedad',
      location: 'Ubicación',
      propertyType: 'Tipo de Propiedad',
      propertyValue: 'Valor de la Propiedad (USDC)',
      description: 'Descripción',
      tokenizationSettings: 'Configuración de Tokenización',
      tokenizationNote: 'Tu propiedad será tokenizada en la blockchain de Stellar. Cada token representa una propiedad fraccionaria y estará disponible para que los inversores la compren.',
      uploading: 'Subiendo...',
      back: 'Atrás',
      continue: 'Continuar',
      propertyUploadedSuccessfully: '¡Propiedad Subida Exitosamente!',
      propertyUnderReview: 'Tu propiedad está ahora bajo revisión. Serás notificado una vez que esté en vivo en el marketplace.',
      propertyName: 'Nombre de la Propiedad',

      // ============================================
      // Footer
      // ============================================
      about: 'Acerca de',
      aboutUs: 'Sobre Nosotros',
      howItWorks: 'Cómo Funciona',
      team: 'Equipo',
      legal: 'Legal',
      privacy: 'Política de Privacidad',
      terms: 'Términos de Servicio',
      cookies: 'Cookies',
      support: 'Soporte',
      helpCenter: 'Centro de Ayuda',
      contact: 'Contacto',
      faq: 'Preguntas Frecuentes',
      allRightsReserved: 'Todos los derechos reservados.',
      poweredBy: 'Desarrollado con',
      footerDescription: 'Marketplace descentralizado de bienes raíces basado en blockchain de Stellar. Invierte en propiedades tokenizadas con transparencia y seguridad.',
    },
  },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
