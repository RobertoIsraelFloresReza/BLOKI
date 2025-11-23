import i18n from '../../config/i18n'

class StringsBase {
  // ============================================
  // App General
  // ============================================
  static welcome = 'welcome'
  static loading = 'loading'
  static comingSoon = 'comingSoon'

  // ============================================
  // Navigation
  // ============================================
  static marketplace = 'marketplace'
  static explore = 'explore'
  static portfolio = 'portfolio'
  static profile = 'profile'

  // ============================================
  // Marketplace Page
  // ============================================
  static marketplaceTitle = 'marketplaceTitle'
  static marketplaceTitleLine1 = 'marketplaceTitleLine1'
  static marketplaceTitleLine2 = 'marketplaceTitleLine2'
  static marketplaceTitleLine3 = 'marketplaceTitleLine3'
  static marketplaceSubtitle = 'marketplaceSubtitle'
  static marketplaceSubtitlePassive = 'marketplaceSubtitlePassive'
  static marketplaceSubtitleTokenized = 'marketplaceSubtitleTokenized'
  static searchPlaceholder = 'searchPlaceholder'
  static propertiesFound = 'propertiesFound'
  static propertyFound = 'propertyFound'
  static noPropertiesFound = 'noPropertiesFound'
  static noPropertiesMessage = 'noPropertiesMessage'
  static tryOtherSearch = 'tryOtherSearch'

  // ============================================
  // Filters
  // ============================================
  static all = 'all'
  static houses = 'houses'
  static apartments = 'apartments'
  static hotels = 'hotels'
  static commercial = 'commercial'

  // ============================================
  // Property Card
  // ============================================
  static propertyValuation = 'propertyValuation'
  static estimatedROI = 'estimatedROI'
  static totalTokens = 'totalTokens'
  static available = 'available'
  static pricePerToken = 'pricePerToken'
  static fundedByInvestors = 'fundedByInvestors'
  static viewDetails = 'viewDetails'
  static soldOut = 'soldOut'
  static verified = 'verified'

  // Property details
  static bedrooms = 'bedrooms'
  static bathrooms = 'bathrooms'
  static area = 'area'
  static sqft = 'sqft'

  // ============================================
  // Wallet Connection
  // ============================================
  static wallet = 'wallet'
  static stellarWallet = 'stellarWallet'
  static connectWallet = 'connectWallet'
  static connectedToFreighter = 'connectedToFreighter'
  static connectYourWallet = 'connectYourWallet'
  static connected = 'connected'
  static yourAddress = 'yourAddress'
  static connectionFailed = 'connectionFailed'
  static disconnect = 'disconnect'
  static walletNotInstalled = 'walletNotInstalled'
  static installFreighter = 'installFreighter'
  static connecting = 'connecting'
  static walletInfo = 'walletInfo'

  // ============================================
  // Search & Filters
  // ============================================
  static searchProperties = 'searchProperties'
  static clearSearch = 'clearSearch'
  static filterByCategory = 'filterByCategory'

  // ============================================
  // Theme
  // ============================================
  static lightMode = 'lightMode'
  static darkMode = 'darkMode'
  static toggleTheme = 'toggleTheme'

  // ============================================
  // Common Actions
  // ============================================
  static close = 'close'
  static cancel = 'cancel'
  static confirm = 'confirm'
  static save = 'save'
  static edit = 'edit'
  static delete = 'delete'
  static search = 'search'
  static filter = 'filter'
  static sort = 'sort'
  static refresh = 'refresh'

  // ============================================
  // Status
  // ============================================
  static success = 'success'
  static error = 'error'
  static warning = 'warning'
  static info = 'info'

  // ============================================
  // Validation & Errors
  // ============================================
  static required = 'required'
  static invalidEmail = 'invalidEmail'
  static invalidPassword = 'invalidPassword'
  static passwordMismatch = 'passwordMismatch'
  static somethingWentWrong = 'somethingWentWrong'

  // ============================================
  // Time & Dates
  // ============================================
  static today = 'today'
  static yesterday = 'yesterday'
  static tomorrow = 'tomorrow'
  static week = 'week'
  static month = 'month'
  static year = 'year'

  // ============================================
  // Purchase Modal
  // ============================================
  static purchaseTokens = 'purchaseTokens'
  static tokensToPurchase = 'tokensToPurchase'
  static totalCost = 'totalCost'
  static transactionFee = 'transactionFee'
  static grandTotal = 'grandTotal'
  static processing = 'processing'
  static purchaseSuccessful = 'purchaseSuccessful'
  static purchaseComplete = 'purchaseComplete'
  static transactionHash = 'transactionHash'
  static viewOnExplorer = 'viewOnExplorer'
  static purchaseError = 'purchaseError'
  static tryAgain = 'tryAgain'
  static insufficientFunds = 'insufficientFunds'
  static ownership = 'ownership'
  static yourOwnership = 'yourOwnership'
  static estimatedValue = 'estimatedValue'
  static youWillOwn = 'youWillOwn'
  static ofThisProperty = 'ofThisProperty'

  // ============================================
  // OAuth2
  // ============================================
  static signInWithGoogle = 'signInWithGoogle'
  static signInWithGitHub = 'signInWithGitHub'
  static orContinueWith = 'orContinueWith'

  // ============================================
  // Profile Page
  // ============================================
  static userInformation = 'userInformation'
  static emailAddress = 'emailAddress'
  static fullName = 'fullName'
  static walletAddress = 'walletAddress'
  static memberSince = 'memberSince'
  static accountSettings = 'accountSettings'
  static kycStatus = 'kycStatus'
  static notVerified = 'notVerified'
  static startKYC = 'startKYC'
  static myProperties = 'myProperties'
  static myInvestments = 'myInvestments'

  // ============================================
  // Wallet Page
  // ============================================
  static myWallet = 'myWallet'
  static totalBalance = 'totalBalance'
  static availableBalance = 'availableBalance'
  static recentTransactions = 'recentTransactions'
  static transactionHistory = 'transactionHistory'
  static deposit = 'deposit'
  static withdraw = 'withdraw'
  static send = 'send'
  static receive = 'receive'
  static amount = 'amount'
  static type = 'type'
  static date = 'date'
  static status = 'status'
  static pending = 'pending'
  static completed = 'completed'
  static failed = 'failed'
  static noTransactions = 'noTransactions'
  static loadMore = 'loadMore'
  static copyAddress = 'copyAddress'
  static addressCopied = 'addressCopied'
  static assetType = 'assetType'
  static balance = 'balance'
  static assets = 'assets'
  static sent = 'sent'
  static received = 'received'

  // ============================================
  // Seller Dashboard / Propiedades
  // ============================================
  static properties = 'properties'
  static myProperties = 'myProperties'
  static manageYourProperties = 'manageYourProperties'
  static uploadProperty = 'uploadProperty'
  static totalProperties = 'totalProperties'
  static totalRevenue = 'totalRevenue'
  static totalInvestors = 'totalInvestors'
  static activeStatus = 'activeStatus'
  static inactiveStatus = 'inactiveStatus'
  static pendingStatus = 'pendingStatus'
  static withInvestors = 'withInvestors'
  static availableForSale = 'availableForSale'
  static fullyFunded = 'fullyFunded'
  static thisMonth = 'thisMonth'
  static thisWeek = 'thisWeek'
  static noProperties = 'noProperties'
  static uploadFirstProperty = 'uploadFirstProperty'
  static noPropertiesWithStatus = 'noPropertiesWithStatus'
  static viewProperty = 'viewProperty'
  static editProperty = 'editProperty'
  static deleteProperty = 'deleteProperty'
  static pauseListing = 'pauseListing'
  static activateListing = 'activateListing'
  static revenue = 'revenue'
  static investors = 'investors'
  static value = 'value'
  static funded = 'funded'
  static complete = 'complete'

  // ============================================
  // Property Upload Form
  // ============================================
  static uploadNewProperty = 'uploadNewProperty'
  static fillPropertyDetails = 'fillPropertyDetails'
  static propertyImages = 'propertyImages'
  static clickToUpload = 'clickToUpload'
  static propertyDetails = 'propertyDetails'
  static propertyTitle = 'propertyTitle'
  static location = 'location'
  static propertyType = 'propertyType'
  static propertyValue = 'propertyValue'
  static description = 'description'
  static tokenizationSettings = 'tokenizationSettings'
  static tokenizationNote = 'tokenizationNote'
  static uploading = 'uploading'
  static back = 'back'
  static continue = 'continue'
  static propertyUploadedSuccessfully = 'propertyUploadedSuccessfully'
  static propertyUnderReview = 'propertyUnderReview'
  static propertyName = 'propertyName'

  // ============================================
  // Evaluators Page
  // ============================================
  static certifiedEvaluators = 'certifiedEvaluators'
  static evaluatorsTitleLine1 = 'evaluatorsTitleLine1'
  static evaluatorsTitleLine2 = 'evaluatorsTitleLine2'
  static evaluatorsDescription = 'evaluatorsDescription'
  static activeEvaluators = 'activeEvaluators'
  static propertiesEvaluated = 'propertiesEvaluated'
  static averageRating = 'averageRating'
  static searchEvaluators = 'searchEvaluators'
  static loadingEvaluators = 'loadingEvaluators'
  static errorLoadingEvaluators = 'errorLoadingEvaluators'
  static errorLoadingEvaluatorsMessage = 'errorLoadingEvaluatorsMessage'
  static noEvaluatorsFound = 'noEvaluatorsFound'
  static tryOtherSearchTerms = 'tryOtherSearchTerms'
  static noEvaluatorsYet = 'noEvaluatorsYet'
  static more = 'more'
  static certifiedByBlocki = 'certifiedByBlocki'
  static evaluatorProfile = 'evaluatorProfile'
  static statistics = 'statistics'
  static certifications = 'certifications'
  static propertiesHistory = 'propertiesHistory'
  static backToEvaluators = 'backToEvaluators'
  static evaluatorNotFound = 'evaluatorNotFound'
  static noPropertiesEvaluatedYet = 'noPropertiesEvaluatedYet'

  // ============================================
  // Auth Page
  // ============================================
  static welcomeBack = 'welcomeBack'
  static createYourAccount = 'createYourAccount'
  static signInToManageProperties = 'signInToManageProperties'
  static getStellarWalletInstantly = 'getStellarWalletInstantly'
  static emailPlaceholder = 'emailPlaceholder'
  static passwordPlaceholder = 'passwordPlaceholder'
  static rememberMe = 'rememberMe'
  static forgotPassword = 'forgotPassword'
  static signingIn = 'signingIn'
  static signIn = 'signIn'
  static dontHaveAccount = 'dontHaveAccount'
  static createOne = 'createOne'
  static personalInfo = 'personalInfo'
  static security = 'security'
  static fullNamePlaceholder = 'fullNamePlaceholder'
  static atLeast8Characters = 'atLeast8Characters'
  static stellarWalletIncluded = 'stellarWalletIncluded'
  static stellarWalletAutoCreate = 'stellarWalletAutoCreate'
  static creatingAccount = 'creatingAccount'
  static createAccount = 'createAccount'
  static byCreatingAccount = 'byCreatingAccount'
  static and = 'and'
  static alreadyHaveAccount = 'alreadyHaveAccount'

  // ============================================
  // Property Details Page
  // ============================================
  static loadingProperty = 'loadingProperty'
  static errorLoadingProperty = 'errorLoadingProperty'
  static couldNotLoadProperty = 'couldNotLoadProperty'
  static backToMarketplace = 'backToMarketplace'
  static propertyNotFoundDescription = 'propertyNotFoundDescription'
  static verifiedProperty = 'verifiedProperty'
  static instantTokenization = 'instantTokenization'
  static highSpeedInternet = 'highSpeedInternet'
  static privateParking = 'privateParking'
  static swimmingPool = 'swimmingPool'
  static highSpeedWiFi = 'highSpeedWiFi'
  static gymAccess = 'gymAccess'
  static security24_7 = 'security24_7'
  static premiumWiFi = 'premiumWiFi'
  static fitnessCenter = 'fitnessCenter'
  static spaAndPool = 'spaAndPool'
  static valetParking = 'valetParking'
  static businessInternet = 'businessInternet'
  static parkingLot = 'parkingLot'
  static securitySystem = 'securitySystem'
  static couldNotRetrieveWalletKey = 'couldNotRetrieveWalletKey'
  static tokenDistribution = 'tokenDistribution'
  static tokenizedOnStellar = 'tokenizedOnStellar'
  static propertyFeatures = 'propertyFeatures'
  static aboutThisProperty = 'aboutThisProperty'
  static propertyDefaultDescription = 'propertyDefaultDescription'
  static numberOfTokens = 'numberOfTokens'
  static maxTokens = 'maxTokens'
  static token = 'token'
  static processingOnStellar = 'processingOnStellar'
  static tokensWillAppearInWallet = 'tokensWillAppearInWallet'
  static signInRequired = 'signInRequired'
  static pleaseSignInToPurchase = 'pleaseSignInToPurchase'
  static goToSignIn = 'goToSignIn'
  static continueBrowsing = 'continueBrowsing'

  // ============================================
  // Wallet Page
  // ============================================
  static loadingWalletData = 'loadingWalletData'
  static errorLoadingWallet = 'errorLoadingWallet'
  static couldNotLoadWalletInfo = 'couldNotLoadWalletInfo'
  static retry = 'retry'
  static justNow = 'justNow'
  static hoursAgo = 'hoursAgo'
  static copied = 'copied'
  static copy = 'copy'
  static portfolioValue = 'portfolioValue'
  static noInvestmentsYet = 'noInvestmentsYet'
  static startByBuyingTokens = 'startByBuyingTokens'
  static loadingTransactions = 'loadingTransactions'
  static transaction = 'transaction'

  // ============================================
  // Profile Page
  // ============================================
  static failedToStartKYC = 'failedToStartKYC'
  static emailUpdatedSuccess = 'emailUpdatedSuccess'
  static passwordMinLength = 'passwordMinLength'
  static passwordUpdatedSuccess = 'passwordUpdatedSuccess'
  static personalInformation = 'personalInformation'
  static updating = 'updating'
  static updateEmail = 'updateEmail'
  static enterNewPassword = 'enterNewPassword'
  static confirmNewPassword = 'confirmNewPassword'
  static updatePassword = 'updatePassword'
  static blockchain = 'blockchain'
  static stellarNetwork = 'stellarNetwork'
  static securityVerification = 'securityVerification'
  static rejected = 'rejected'
  static completeKYCDescription = 'completeKYCDescription'
  static starting = 'starting'
  static retryVerification = 'retryVerification'
  static reason = 'reason'
  static verificationBeingReviewed = 'verificationBeingReviewed'
  static identityVerified = 'identityVerified'
  static accountActions = 'accountActions'
  static redirectAfterSignOut = 'redirectAfterSignOut'

  // ============================================
  // Evaluator Profile
  // ============================================
  static loadingEvaluatorProfile = 'loadingEvaluatorProfile'
  static couldNotLoadEvaluatorInfo = 'couldNotLoadEvaluatorInfo'
  static rating = 'rating'
  static propertyEvaluationHistory = 'propertyEvaluationHistory'
  static allPropertiesCertifiedBy = 'allPropertiesCertifiedBy'
  static evaluatorNoCertifications = 'evaluatorNoCertifications'

  // ============================================
  // Seller Dashboard
  // ============================================
  static propertyUpdatedSuccess = 'propertyUpdatedSuccess'
  static propertyCreatedSuccess = 'propertyCreatedSuccess'
  static confirmDeleteProperty = 'confirmDeleteProperty'
  static propertyDeletedSuccess = 'propertyDeletedSuccess'
  static errorDeletingProperty = 'errorDeletingProperty'
  static loadingYourProperties = 'loadingYourProperties'
  static errorLoadingProperties = 'errorLoadingProperties'
  static couldNotLoadProperties = 'couldNotLoadProperties'
  static reload = 'reload'

  // ============================================
  // Marketplace
  // ============================================
  static searchAndFilter = 'searchAndFilter'
  static categories = 'categories'
  static apply = 'apply'
  static loadingProperties = 'loadingProperties'
  static couldNotLoadPropertiesPleaseTryAgain = 'couldNotLoadPropertiesPleaseTryAgain'

  // ============================================
  // Components - General
  // ============================================
  static sold = 'sold'
  static viewAllProperties = 'viewAllProperties'
  static inTotal = 'inTotal'
  static table = 'table'
  static cards = 'cards'
  static asset = 'asset'
  static valueUSDC = 'valueUSDC'
  static fromTo = 'fromTo'
  static searchPropertiesPlaceholder = 'searchPropertiesPlaceholder'
  static collapseTitle = 'collapseTitle'
  static expandTitle = 'expandTitle'
  static collapseLocation = 'collapseLocation'
  static expandLocation = 'expandLocation'
  static evaluators = 'evaluators'
  static settings = 'settings'
  static user = 'user'
  static defaultEmail = 'defaultEmail'
  static viewMyWallet = 'viewMyWallet'
  static mode = 'mode'
  static dark = 'dark'
  static light = 'light'

  // ============================================
  // DeFi Components
  // ============================================
  static instantSwapToUSDC = 'instantSwapToUSDC'
  static youPay = 'youPay'
  static youReceive = 'youReceive'
  static priceImpact = 'priceImpact'
  static route = 'route'
  static swapping = 'swapping'
  static swapNow = 'swapNow'
  static assetUSD = 'assetUSD'
  static failedToLoad = 'failedToLoad'
  static live = 'live'
  static confidence = 'confidence'
  static yieldEstimation = 'yieldEstimation'
  static amountUSDC = 'amountUSDC'
  static durationDays = 'durationDays'
  static failedToEstimateYield = 'failedToEstimateYield'
  static apy = 'apy'
  static totalYield = 'totalYield'
  static sellerShare = 'sellerShare'
  static buyerShare = 'buyerShare'
  static protocolShare = 'protocolShare'
  static enterAmountDuration = 'enterAmountDuration'
  static oracleValuation = 'oracleValuation'
  static failedToLoadValuation = 'failedToLoadValuation'
  static na = 'na'
  static in = 'in'
  static unknown = 'unknown'

  // ============================================
  // Property Upload Form
  // ============================================
  static house = 'house'
  static apartment = 'apartment'
  static hotel = 'hotel'
  static titleRequired = 'titleRequired'
  static locationRequired = 'locationRequired'
  static validPriceRequired = 'validPriceRequired'
  static validAreaRequired = 'validAreaRequired'
  static validTokenAmountRequired = 'validTokenAmountRequired'
  static atLeastOneImageRequired = 'atLeastOneImageRequired'
  static propertyCreatedSuccess = 'propertyCreatedSuccess'
  static imageUploadInfo = 'imageUploadInfo'
  static certifiedEvaluator = 'certifiedEvaluator'
  static selectCertifiedEvaluator = 'selectCertifiedEvaluator'
  static noEvaluatorsAvailable = 'noEvaluatorsAvailable'
  static verificationId = 'verificationId'
  static verificationIdPlaceholder = 'verificationIdPlaceholder'
  static verificationIdHelp = 'verificationIdHelp'
  static valuationDocument = 'valuationDocument'
  static uploadOfficialDocument = 'uploadOfficialDocument'
  static selectEvaluatorFirst = 'selectEvaluatorFirst'
  static uploadValuationDocument = 'uploadValuationDocument'
  static documentUploadInfo = 'documentUploadInfo'
  static valuationDocumentName = 'valuationDocumentName'
  static megabytes = 'megabytes'
  static alreadyUploaded = 'alreadyUploaded'
  static propertyTitlePlaceholder = 'propertyTitlePlaceholder'
  static locationPlaceholder = 'locationPlaceholder'
  static pricePlaceholder = 'pricePlaceholder'
  static areaPlaceholder = 'areaPlaceholder'
  static bedroomsPlaceholder = 'bedroomsPlaceholder'
  static bathroomsPlaceholder = 'bathroomsPlaceholder'
  static descriptionPlaceholder = 'descriptionPlaceholder'
  static totalTokensPlaceholder = 'totalTokensPlaceholder'
  static pricePerToken = 'pricePerToken'
  static enterValueToCalculate = 'enterValueToCalculate'

  // ============================================
  // OAuth2
  // ============================================
  static signingYouIn = 'signingYouIn'
  static pleaseWaitAuth = 'pleaseWaitAuth'

  // ============================================
  // Wallet Components
  // ============================================
  static freighterNotInstalled = 'freighterNotInstalled'
  static failedToConnectWallet = 'failedToConnectWallet'

  // ============================================
  // Footer
  // ============================================
  static about = 'about'
  static aboutUs = 'aboutUs'
  static howItWorks = 'howItWorks'
  static team = 'team'
  static legal = 'legal'
  static privacy = 'privacy'
  static privacyPolicy = 'privacyPolicy'
  static terms = 'terms'
  static termsOfService = 'termsOfService'
  static cookies = 'cookies'
  static cookiesPolicy = 'cookiesPolicy'
  static support = 'support'
  static helpCenter = 'helpCenter'
  static contact = 'contact'
  static faq = 'faq'
  static allRightsReserved = 'allRightsReserved'
  static poweredBy = 'poweredBy'
  static builtFor = 'builtFor'
  static footerDescription = 'footerDescription'
  static technology = 'technology'
  static totalVolume = 'totalVolume'
  static blockchainSecurity = 'blockchainSecurity'
  static livePlatform = 'livePlatform'
  static stellarBlockchain = 'stellarBlockchain'
  static sorobanSmartContracts = 'sorobanSmartContracts'
  static freighterWallet = 'freighterWallet'
  static hackathonBadge = 'hackathonBadge'
}

// Create a Proxy object for StringsBase to intercept property access
const Strings = new Proxy(StringsBase, {
  // Define the handler for the 'get' trap
  get(target, prop) {
    // Check if the property is a string and exists in the target object
    if (typeof prop === 'string' && prop in target) {
      // Use the i18n translation function to translate the property value
      return i18n.t(target[prop])
    }
    // Log a warning if the property does not exist in the target object
    console.error(`No translation for: ${String(prop)}`)
    // Return the property value from the target object
    return target[prop]
  },
})

// Export the Strings Proxy object as the default export
export default Strings
