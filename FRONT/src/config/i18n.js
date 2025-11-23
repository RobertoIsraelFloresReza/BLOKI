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
      marketplaceTitleLine1: 'The Future of',
      marketplaceTitleLine2: 'Real Estate',
      marketplaceTitleLine3: 'Investment',
      marketplaceSubtitle: 'Diversify and earn',
      marketplaceSubtitlePassive: 'passive income',
      marketplaceSubtitleTokenized: 'from tokenized real estate on',
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
      viewWallet: 'View Wallet',
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
      // Evaluators Page
      // ============================================
      certifiedEvaluators: 'Certified Evaluators',
      evaluatorsTitleLine1: 'Certified',
      evaluatorsTitleLine2: 'Evaluators',
      evaluatorsDescription: 'Companies verified by Blocki to ensure professional valuations and prevent fraud',
      activeEvaluators: 'Active Evaluators',
      propertiesEvaluated: 'Properties Evaluated',
      averageRating: 'Average Rating',
      searchEvaluators: 'Search evaluators by name, country, or description...',
      loadingEvaluators: 'Loading evaluators...',
      errorLoadingEvaluators: 'Error loading evaluators',
      errorLoadingEvaluatorsMessage: 'Could not load evaluators',
      noEvaluatorsFound: 'No evaluators found',
      tryOtherSearchTerms: 'Try other search terms',
      noEvaluatorsYet: 'No certified evaluators on the platform yet',
      more: 'more',
      certifiedByBlocki: 'Certified by Blocki',
      evaluatorProfile: 'Evaluator Profile',
      statistics: 'Statistics',
      certifications: 'Certifications',
      propertiesHistory: 'Properties History',
      backToEvaluators: 'Back to Evaluators',
      evaluatorNotFound: 'Evaluator not found',
      noPropertiesEvaluatedYet: 'This evaluator has not certified any properties on the platform yet',

      // ============================================
      // Auth Page
      // ============================================
      welcomeBack: 'Welcome back',
      createYourAccount: 'Create your account',
      signInToManageProperties: 'Sign in to manage your tokenized properties',
      getStellarWalletInstantly: 'Get your Stellar wallet instantly',
      emailPlaceholder: 'your@email.com',
      passwordPlaceholder: '••••••••',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot password?',
      signingIn: 'Signing in...',
      signIn: 'Sign In',
      dontHaveAccount: "Don't have an account?",
      createOne: 'Create one',
      personalInfo: 'Personal Info',
      security: 'Security',
      fullNamePlaceholder: 'John Doe',
      atLeast8Characters: 'At least 8 characters',
      stellarWalletIncluded: 'Stellar Wallet Included',
      stellarWalletAutoCreate: 'Your personal Stellar wallet will be created automatically upon registration',
      creatingAccount: 'Creating account...',
      createAccount: 'Create Account',
      byCreatingAccount: 'By creating an account, you agree to our',
      and: 'and',
      alreadyHaveAccount: 'Already have an account?',

      // ============================================
      // Property Details Page
      // ============================================
      loadingProperty: 'Loading property...',
      errorLoadingProperty: 'Error loading property',
      couldNotLoadProperty: 'Could not load the property',
      backToMarketplace: 'Back to Marketplace',
      propertyNotFoundDescription: 'The property you are looking for does not exist or was removed',
      verifiedProperty: 'Verified Property',
      instantTokenization: 'Instant Tokenization',
      highSpeedInternet: 'High-Speed Internet',
      privateParking: 'Private Parking',
      swimmingPool: 'Swimming Pool',
      highSpeedWiFi: 'High-Speed WiFi',
      gymAccess: 'Gym Access',
      security24_7: '24/7 Security',
      premiumWiFi: 'Premium WiFi',
      fitnessCenter: 'Fitness Center',
      spaAndPool: 'Spa & Pool',
      valetParking: 'Valet Parking',
      businessInternet: 'Business Internet',
      parkingLot: 'Parking Lot',
      securitySystem: 'Security System',
      couldNotRetrieveWalletKey: 'Could not retrieve wallet secret key',
      tokenDistribution: 'Token Distribution',
      tokenizedOnStellar: 'Tokenized on Stellar Network',
      propertyFeatures: 'Property Features',
      aboutThisProperty: 'About this property',
      propertyDefaultDescription: 'Beautiful property in a prime location with excellent amenities and investment potential.',
      numberOfTokens: 'Number of Tokens',
      maxTokens: 'Max',
      token: 'token',
      processingOnStellar: 'Processing on Stellar...',
      tokensWillAppearInWallet: 'Your tokens will appear in your wallet shortly. Transaction is being processed on the Stellar network.',
      signInRequired: 'Sign In Required',
      pleaseSignInToPurchase: 'Please sign in or create an account to purchase property tokens',
      goToSignIn: 'Go to Sign In',
      continueBrowsing: 'Continue Browsing',

      // ============================================
      // Wallet Page
      // ============================================
      loadingWalletData: 'Loading wallet data...',
      errorLoadingWallet: 'Error loading wallet',
      couldNotLoadWalletInfo: 'Could not load wallet information',
      retry: 'Retry',
      justNow: 'Just now',
      hoursAgo: 'h ago',
      copied: 'Copied',
      copy: 'Copy',
      portfolioValue: 'Portfolio Value',
      noInvestmentsYet: 'You have no investments yet',
      startByBuyingTokens: 'Start by buying tokens in the marketplace',
      loadingTransactions: 'Loading transactions...',
      transaction: 'Transaction',

      // ============================================
      // Profile Page
      // ============================================
      failedToStartKYC: 'Failed to start KYC verification. Please try again.',
      emailUpdatedSuccess: 'Email updated successfully!',
      passwordMinLength: 'Password must be at least 8 characters',
      passwordUpdatedSuccess: 'Password updated successfully!',
      personalInformation: 'Personal Information',
      updating: 'Updating...',
      updateEmail: 'Update Email',
      enterNewPassword: 'Enter new password',
      confirmNewPassword: 'Confirm new password',
      updatePassword: 'Update Password',
      blockchain: 'Blockchain',
      stellarNetwork: 'Stellar Network',
      securityVerification: 'Security & Verification',
      rejected: 'Rejected',
      completeKYCDescription: 'Complete KYC verification to unlock higher transaction limits',
      starting: 'Starting...',
      retryVerification: 'Retry Verification',
      reason: 'Reason',
      verificationBeingReviewed: 'Your verification is being reviewed. This usually takes 1-2 business days.',
      identityVerified: 'Your identity has been verified. Transaction limit',
      accountActions: 'Account Actions',
      redirectAfterSignOut: "You'll be redirected to the marketplace after signing out",

      // ============================================
      // Evaluator Profile
      // ============================================
      loadingEvaluatorProfile: 'Loading evaluator profile...',
      couldNotLoadEvaluatorInfo: 'Could not load evaluator information',
      rating: 'Rating',
      propertyEvaluationHistory: 'Property Evaluation History',
      allPropertiesCertifiedBy: 'All properties certified by this evaluator',
      evaluatorNoCertifications: 'This evaluator has not certified any properties on the platform yet',

      // ============================================
      // Seller Dashboard
      // ============================================
      propertyUpdatedSuccess: 'Property updated successfully!',
      propertyCreatedSuccess: 'Property created! It will appear in your dashboard shortly.',
      confirmDeleteProperty: 'Are you sure you want to delete this property?\n\nThis action cannot be undone.',
      propertyDeletedSuccess: 'Property deleted successfully',
      errorDeletingProperty: 'Error deleting property',
      loadingYourProperties: 'Loading your properties...',
      errorLoadingProperties: 'Error loading properties',
      couldNotLoadProperties: 'Could not load your properties. Please try again.',
      reload: 'Reload',

      // ============================================
      // Marketplace
      // ============================================
      searchAndFilter: 'Search and Filter',
      categories: 'Categories',
      apply: 'Apply',
      loadingProperties: 'Loading properties...',
      couldNotLoadPropertiesPleaseTryAgain: 'Could not load properties. Please try again.',

      // ============================================
      // Components - General
      // ============================================
      sold: 'sold',
      viewAllProperties: 'View all properties',
      inTotal: 'in total',
      table: 'Table',
      cards: 'Cards',
      asset: 'Asset',
      valueUSDC: 'Value USDC',
      fromTo: 'From/To',
      searchPropertiesPlaceholder: 'Search properties, locations...',
      collapseTitle: 'Collapse title',
      expandTitle: 'Expand title',
      collapseLocation: 'Collapse location',
      expandLocation: 'Expand location',
      evaluators: 'Evaluators',
      settings: 'Settings',
      user: 'User',
      defaultEmail: 'email@example.com',
      viewMyWallet: 'View my wallet',
      mode: 'Mode',
      dark: 'Dark',
      light: 'Light',

      // ============================================
      // DeFi Components
      // ============================================
      instantSwapToUSDC: 'Instant Swap to USDC',
      youPay: 'You pay',
      youReceive: 'You receive',
      priceImpact: 'Price Impact',
      route: 'Route',
      swapping: 'Swapping...',
      swapNow: 'Swap Now',
      assetUSD: 'USD',
      failedToLoad: 'Failed to load',
      live: 'Live',
      confidence: 'Confidence',
      yieldEstimation: 'Yield Estimation',
      amountUSDC: 'Amount (USDC)',
      durationDays: 'Duration (Days)',
      failedToEstimateYield: 'Failed to estimate yield',
      apy: 'APY',
      totalYield: 'Total Yield',
      sellerShare: 'Seller',
      buyerShare: 'Buyer',
      protocolShare: 'Protocol',
      enterAmountDuration: 'Enter amount and duration to see yield estimate',
      oracleValuation: 'Oracle Valuation',
      failedToLoadValuation: 'Failed to load valuation',
      na: 'N/A',
      in: 'in',
      unknown: 'Unknown',

      // ============================================
      // Property Upload Form
      // ============================================
      house: 'House',
      apartment: 'Apartment',
      hotel: 'Hotel',
      titleRequired: 'Title is required',
      locationRequired: 'Location is required',
      validPriceRequired: 'Valid price is required',
      validAreaRequired: 'Valid area is required',
      validTokenAmountRequired: 'Valid token amount is required',
      atLeastOneImageRequired: 'At least one image is required',
      propertyCreatedSuccess: 'Property created successfully!',
      imageUploadInfo: 'PNG, JPG up to 10MB',
      certifiedEvaluator: 'Certified Evaluator',
      selectCertifiedEvaluator: 'Select a certified evaluator company to validate your property',
      noEvaluatorsAvailable: 'No evaluators available at this time',
      verificationId: 'Verification ID',
      verificationIdPlaceholder: 'VER-2025-001234',
      verificationIdHelp: 'ID provided by the evaluator after inspection',
      valuationDocument: 'Valuation Document',
      uploadOfficialDocument: 'Upload the official document from the selected evaluator',
      selectEvaluatorFirst: 'First select a certified evaluator above',
      uploadValuationDocument: 'Upload valuation document',
      documentUploadInfo: 'PDF, DOC, DOCX, or images up to 10MB',
      valuationDocumentName: 'Valuation document',
      megabytes: 'MB',
      alreadyUploaded: 'Already uploaded',
      propertyTitlePlaceholder: 'e.g., Modern Beach House in Miami',
      locationPlaceholder: 'e.g., Miami Beach, FL',
      pricePlaceholder: 'e.g., 2500000',
      areaPlaceholder: 'e.g., 3200',
      bedroomsPlaceholder: 'e.g., 4',
      bathroomsPlaceholder: 'e.g., 3',
      descriptionPlaceholder: 'Describe your property, its features, and location benefits...',
      totalTokensPlaceholder: 'e.g., 2500',
      pricePerToken: 'Price per token',
      enterValueToCalculate: 'Enter property value and token amount to calculate price per token',

      // ============================================
      // OAuth2
      // ============================================
      signingYouIn: 'Signing you in...',
      pleaseWaitAuth: 'Please wait while we complete your authentication',

      // ============================================
      // Wallet Components
      // ============================================
      freighterNotInstalled: 'Freighter wallet not installed',
      failedToConnectWallet: 'Failed to connect wallet',

      // ============================================
      // Footer
      // ============================================
      about: 'About',
      aboutUs: 'About Us',
      howItWorks: 'How it Works',
      team: 'Team',
      legal: 'Legal',
      privacy: 'Privacy Policy',
      privacyPolicy: 'Privacy Policy',
      terms: 'Terms of Service',
      termsOfService: 'Terms of Service',
      cookies: 'Cookies',
      cookiesPolicy: 'Cookies Policy',
      support: 'Support',
      helpCenter: 'Help Center',
      contact: 'Contact',
      faq: 'FAQ',
      allRightsReserved: 'All rights reserved.',
      poweredBy: 'Powered by',
      builtFor: 'Built for',
      footerDescription: 'Tokenized real estate investment platform. Built on Stellar blockchain for maximum transparency and security.',
      technology: 'Technology',
      totalVolume: 'Total Volume',
      blockchainSecurity: 'Blockchain Security',
      livePlatform: 'Live Platform',
      stellarBlockchain: 'Stellar Blockchain',
      sorobanSmartContracts: 'Soroban Smart Contracts',
      freighterWallet: 'Freighter Wallet',
      hackathonBadge: 'Stellar Meridian Hackathon 2025',
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
      marketplaceTitleLine1: 'El Futuro en',
      marketplaceTitleLine2: 'Inversión de',
      marketplaceTitleLine3: 'Bienes Raíces',
      marketplaceSubtitle: 'Diversifica y obtén',
      marketplaceSubtitlePassive: 'ingresos pasivos',
      marketplaceSubtitleTokenized: 'de bienes raíces tokenizados en',
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
      viewWallet: 'Ver Cartera',
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
      // Evaluators Page
      // ============================================
      certifiedEvaluators: 'Evaluadores Certificados',
      evaluatorsTitleLine1: 'Evaluadores',
      evaluatorsTitleLine2: 'Certificados',
      evaluatorsDescription: 'Empresas verificadas por Blocki para garantizar valuaciones profesionales y prevenir fraudes',
      activeEvaluators: 'Evaluadores Activos',
      propertiesEvaluated: 'Propiedades Evaluadas',
      averageRating: 'Rating Promedio',
      searchEvaluators: 'Buscar evaluadores por nombre, país o descripción...',
      loadingEvaluators: 'Cargando evaluadores...',
      errorLoadingEvaluators: 'Error al cargar evaluadores',
      errorLoadingEvaluatorsMessage: 'No se pudieron cargar los evaluadores',
      noEvaluatorsFound: 'No se encontraron evaluadores',
      tryOtherSearchTerms: 'Intenta con otros términos de búsqueda',
      noEvaluatorsYet: 'Aún no hay evaluadores certificados en la plataforma',
      more: 'más',
      certifiedByBlocki: 'Certificado por Blocki',
      evaluatorProfile: 'Perfil del Evaluador',
      statistics: 'Estadísticas',
      certifications: 'Certificaciones',
      propertiesHistory: 'Historial de Propiedades Evaluadas',
      backToEvaluators: 'Volver a Evaluadores',
      evaluatorNotFound: 'Evaluador no encontrado',
      noPropertiesEvaluatedYet: 'Este evaluador aún no ha certificado propiedades en la plataforma',

      // ============================================
      // Auth Page
      // ============================================
      welcomeBack: 'Bienvenido de nuevo',
      createYourAccount: 'Crea tu cuenta',
      signInToManageProperties: 'Inicia sesión para administrar tus propiedades tokenizadas',
      getStellarWalletInstantly: 'Obtén tu wallet de Stellar instantáneamente',
      emailPlaceholder: 'tu@email.com',
      passwordPlaceholder: '••••••••',
      rememberMe: 'Recuérdame',
      forgotPassword: '¿Olvidaste tu contraseña?',
      signingIn: 'Iniciando sesión...',
      signIn: 'Iniciar Sesión',
      dontHaveAccount: '¿No tienes una cuenta?',
      createOne: 'Crear una',
      personalInfo: 'Información Personal',
      security: 'Seguridad',
      fullNamePlaceholder: 'Juan Pérez',
      atLeast8Characters: 'Al menos 8 caracteres',
      stellarWalletIncluded: 'Wallet de Stellar Incluida',
      stellarWalletAutoCreate: 'Tu wallet personal de Stellar será creada automáticamente al registrarte',
      creatingAccount: 'Creando cuenta...',
      createAccount: 'Crear Cuenta',
      byCreatingAccount: 'Al crear una cuenta, aceptas nuestros',
      and: 'y',
      alreadyHaveAccount: '¿Ya tienes una cuenta?',

      // ============================================
      // Property Details Page
      // ============================================
      loadingProperty: 'Cargando propiedad...',
      errorLoadingProperty: 'Error al cargar propiedad',
      couldNotLoadProperty: 'No se pudo cargar la propiedad',
      backToMarketplace: 'Volver al Marketplace',
      propertyNotFoundDescription: 'La propiedad que buscas no existe o fue eliminada',
      verifiedProperty: 'Propiedad Verificada',
      instantTokenization: 'Tokenización Instantánea',
      highSpeedInternet: 'Internet de Alta Velocidad',
      privateParking: 'Estacionamiento Privado',
      swimmingPool: 'Piscina',
      highSpeedWiFi: 'WiFi de Alta Velocidad',
      gymAccess: 'Acceso a Gimnasio',
      security24_7: 'Seguridad 24/7',
      premiumWiFi: 'WiFi Premium',
      fitnessCenter: 'Centro de Fitness',
      spaAndPool: 'Spa y Piscina',
      valetParking: 'Valet Parking',
      businessInternet: 'Internet Empresarial',
      parkingLot: 'Estacionamiento',
      securitySystem: 'Sistema de Seguridad',
      couldNotRetrieveWalletKey: 'No se pudo obtener la clave secreta de la wallet',
      tokenDistribution: 'Distribución de Tokens',
      tokenizedOnStellar: 'Tokenizado en la Red Stellar',
      propertyFeatures: 'Características de la Propiedad',
      aboutThisProperty: 'Acerca de esta propiedad',
      propertyDefaultDescription: 'Hermosa propiedad en una ubicación privilegiada con excelentes amenidades y potencial de inversión.',
      numberOfTokens: 'Número de Tokens',
      maxTokens: 'Máx',
      token: 'token',
      processingOnStellar: 'Procesando en Stellar...',
      tokensWillAppearInWallet: 'Tus tokens aparecerán en tu wallet en breve. La transacción está siendo procesada en la red Stellar.',
      signInRequired: 'Inicio de Sesión Requerido',
      pleaseSignInToPurchase: 'Por favor inicia sesión o crea una cuenta para comprar tokens de propiedades',
      goToSignIn: 'Ir a Iniciar Sesión',
      continueBrowsing: 'Continuar Navegando',

      // ============================================
      // Wallet Page
      // ============================================
      loadingWalletData: 'Cargando datos de la wallet...',
      errorLoadingWallet: 'Error al cargar wallet',
      couldNotLoadWalletInfo: 'No se pudo cargar la información de la wallet',
      retry: 'Reintentar',
      justNow: 'Justo ahora',
      hoursAgo: 'h atrás',
      copied: 'Copiado',
      copy: 'Copiar',
      portfolioValue: 'Valor del Portfolio',
      noInvestmentsYet: 'No tienes inversiones aún',
      startByBuyingTokens: 'Comienza comprando tokens en el marketplace',
      loadingTransactions: 'Cargando transacciones...',
      transaction: 'Transacción',

      // ============================================
      // Profile Page
      // ============================================
      failedToStartKYC: 'Error al iniciar verificación KYC. Por favor intenta nuevamente.',
      emailUpdatedSuccess: '¡Email actualizado exitosamente!',
      passwordMinLength: 'La contraseña debe tener al menos 8 caracteres',
      passwordUpdatedSuccess: '¡Contraseña actualizada exitosamente!',
      personalInformation: 'Información Personal',
      updating: 'Actualizando...',
      updateEmail: 'Actualizar Email',
      enterNewPassword: 'Ingresa nueva contraseña',
      confirmNewPassword: 'Confirma nueva contraseña',
      updatePassword: 'Actualizar Contraseña',
      blockchain: 'Blockchain',
      stellarNetwork: 'Red Stellar',
      securityVerification: 'Seguridad y Verificación',
      rejected: 'Rechazado',
      completeKYCDescription: 'Completa la verificación KYC para desbloquear límites de transacción más altos',
      starting: 'Iniciando...',
      retryVerification: 'Reintentar Verificación',
      reason: 'Razón',
      verificationBeingReviewed: 'Tu verificación está siendo revisada. Esto usualmente toma 1-2 días hábiles.',
      identityVerified: 'Tu identidad ha sido verificada. Límite de transacción',
      accountActions: 'Acciones de Cuenta',
      redirectAfterSignOut: 'Serás redirigido al marketplace después de cerrar sesión',

      // ============================================
      // Evaluator Profile
      // ============================================
      loadingEvaluatorProfile: 'Cargando perfil del evaluador...',
      couldNotLoadEvaluatorInfo: 'No se pudo cargar la información del evaluador',
      rating: 'Rating',
      propertyEvaluationHistory: 'Historial de Evaluaciones de Propiedades',
      allPropertiesCertifiedBy: 'Todas las propiedades certificadas por este evaluador',
      evaluatorNoCertifications: 'Este evaluador aún no ha certificado propiedades en la plataforma',

      // ============================================
      // Seller Dashboard
      // ============================================
      propertyUpdatedSuccess: '¡Propiedad actualizada exitosamente!',
      propertyCreatedSuccess: '¡Propiedad creada! Aparecerá en tu dashboard en breve.',
      confirmDeleteProperty: '¿Estás seguro de eliminar esta propiedad?\n\nEsta acción no se puede deshacer.',
      propertyDeletedSuccess: 'Propiedad eliminada exitosamente',
      errorDeletingProperty: 'Error al eliminar la propiedad',
      loadingYourProperties: 'Cargando tus propiedades...',
      errorLoadingProperties: 'Error al cargar propiedades',
      couldNotLoadProperties: 'No se pudieron cargar tus propiedades. Por favor intenta nuevamente.',
      reload: 'Recargar',

      // ============================================
      // Marketplace
      // ============================================
      searchAndFilter: 'Buscar y Filtrar',
      categories: 'Categorías',
      apply: 'Aplicar',
      loadingProperties: 'Cargando propiedades...',
      couldNotLoadPropertiesPleaseTryAgain: 'No se pudieron cargar las propiedades. Por favor intenta nuevamente.',

      // ============================================
      // Components - General
      // ============================================
      sold: 'vendido',
      viewAllProperties: 'Ver todas las propiedades',
      inTotal: 'en total',
      table: 'Tabla',
      cards: 'Tarjetas',
      asset: 'Activo',
      valueUSDC: 'Valor USDC',
      fromTo: 'De/Para',
      searchPropertiesPlaceholder: 'Buscar propiedades, ubicaciones...',
      collapseTitle: 'Contraer título',
      expandTitle: 'Expandir título',
      collapseLocation: 'Contraer ubicación',
      expandLocation: 'Expandir ubicación',
      evaluators: 'Evaluadores',
      settings: 'Configuración',
      user: 'Usuario',
      defaultEmail: 'email@ejemplo.com',
      viewMyWallet: 'Ver mi cartera',
      mode: 'Modo',
      dark: 'Oscuro',
      light: 'Claro',

      // ============================================
      // DeFi Components
      // ============================================
      instantSwapToUSDC: 'Intercambio Instantáneo a USDC',
      youPay: 'Pagas',
      youReceive: 'Recibes',
      priceImpact: 'Impacto en el Precio',
      route: 'Ruta',
      swapping: 'Intercambiando...',
      swapNow: 'Intercambiar Ahora',
      assetUSD: 'USD',
      failedToLoad: 'Error al cargar',
      live: 'En Vivo',
      confidence: 'Confianza',
      yieldEstimation: 'Estimación de Rendimiento',
      amountUSDC: 'Cantidad (USDC)',
      durationDays: 'Duración (Días)',
      failedToEstimateYield: 'Error al estimar rendimiento',
      apy: 'APY',
      totalYield: 'Rendimiento Total',
      sellerShare: 'Vendedor',
      buyerShare: 'Comprador',
      protocolShare: 'Protocolo',
      enterAmountDuration: 'Ingresa cantidad y duración para ver estimación de rendimiento',
      oracleValuation: 'Valuación Oracle',
      failedToLoadValuation: 'Error al cargar valuación',
      na: 'N/D',
      in: 'en',
      unknown: 'Desconocido',

      // ============================================
      // Property Upload Form
      // ============================================
      house: 'Casa',
      apartment: 'Apartamento',
      hotel: 'Hotel',
      titleRequired: 'El título es requerido',
      locationRequired: 'La ubicación es requerida',
      validPriceRequired: 'Se requiere un precio válido',
      validAreaRequired: 'Se requiere un área válida',
      validTokenAmountRequired: 'Se requiere una cantidad de tokens válida',
      atLeastOneImageRequired: 'Se requiere al menos una imagen',
      propertyCreatedSuccess: '¡Propiedad creada exitosamente!',
      imageUploadInfo: 'PNG, JPG hasta 10MB',
      certifiedEvaluator: 'Evaluador Certificado',
      selectCertifiedEvaluator: 'Selecciona una empresa evaluadora certificada para validar tu propiedad',
      noEvaluatorsAvailable: 'No hay evaluadores disponibles en este momento',
      verificationId: 'ID de Verificación',
      verificationIdPlaceholder: 'VER-2025-001234',
      verificationIdHelp: 'ID proporcionado por el evaluador después de la inspección',
      valuationDocument: 'Documento de Evaluación',
      uploadOfficialDocument: 'Sube el documento oficial del evaluador seleccionado',
      selectEvaluatorFirst: 'Primero selecciona un evaluador certificado arriba',
      uploadValuationDocument: 'Subir documento de evaluación',
      documentUploadInfo: 'PDF, DOC, DOCX, o imágenes hasta 10MB',
      valuationDocumentName: 'Documento de evaluación',
      megabytes: 'MB',
      alreadyUploaded: 'Ya subido',
      propertyTitlePlaceholder: 'ej., Casa Moderna en la Playa de Miami',
      locationPlaceholder: 'ej., Miami Beach, FL',
      pricePlaceholder: 'ej., 2500000',
      areaPlaceholder: 'ej., 3200',
      bedroomsPlaceholder: 'ej., 4',
      bathroomsPlaceholder: 'ej., 3',
      descriptionPlaceholder: 'Describe tu propiedad, sus características y beneficios de ubicación...',
      totalTokensPlaceholder: 'ej., 2500',
      enterValueToCalculate: 'Ingresa valor de propiedad y cantidad de tokens para calcular precio por token',

      // ============================================
      // OAuth2
      // ============================================
      signingYouIn: 'Iniciando sesión...',
      pleaseWaitAuth: 'Por favor espera mientras completamos tu autenticación',

      // ============================================
      // Wallet Components
      // ============================================
      freighterNotInstalled: 'Wallet Freighter no instalada',
      failedToConnectWallet: 'Error al conectar wallet',

      // ============================================
      // Footer
      // ============================================
      about: 'Acerca de',
      aboutUs: 'Sobre Nosotros',
      howItWorks: 'Cómo Funciona',
      team: 'Equipo',
      legal: 'Legal',
      privacy: 'Política de Privacidad',
      privacyPolicy: 'Política de Privacidad',
      terms: 'Términos de Servicio',
      termsOfService: 'Términos de Servicio',
      cookies: 'Cookies',
      cookiesPolicy: 'Política de Cookies',
      support: 'Soporte',
      helpCenter: 'Centro de Ayuda',
      contact: 'Contacto',
      faq: 'Preguntas Frecuentes',
      allRightsReserved: 'Todos los derechos reservados.',
      poweredBy: 'Desarrollado con',
      builtFor: 'Construido para',
      footerDescription: 'Plataforma de inversión en bienes raíces tokenizados. Construida sobre blockchain de Stellar para máxima transparencia y seguridad.',
      technology: 'Tecnología',
      totalVolume: 'Volumen Total',
      blockchainSecurity: 'Seguridad Blockchain',
      livePlatform: 'Plataforma en Vivo',
      stellarBlockchain: 'Blockchain de Stellar',
      sorobanSmartContracts: 'Contratos Inteligentes Soroban',
      freighterWallet: 'Wallet Freighter',
      hackathonBadge: 'Hackathon Stellar Meridian 2025',
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
