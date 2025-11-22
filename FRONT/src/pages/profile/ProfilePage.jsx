import { useState, useEffect } from 'react'
import { User, Mail, Wallet, Calendar, Shield, Check, X, Copy, CheckCircle, LogOut, Edit, Eye, EyeOff, Lock } from 'lucide-react'
import { Badge, Button, Input, LoaderButton, Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui'
import { PropertyCardProfile } from '@/components/profile'
import { useStrings } from '@/utils/localizations/useStrings'
import { kycService } from '@/services/kycService'

// Mock seller properties - would come from API
const MOCK_USER_PROPERTIES = [
  {
    id: '1',
    title: 'Casa Moderna en Miami Beach',
    location: 'Miami Beach, FL',
    price: 2500000,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
    tokensAvailable: 1000,
    totalTokens: 2500,
    tokensSold: 1500,
    createdAt: '2024-04-10',
  },
  {
    id: '2',
    title: 'Apartamento Luxury en Manhattan',
    location: 'Manhattan, NY',
    price: 1800000,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
    tokensAvailable: 500,
    totalTokens: 1800,
    tokensSold: 1300,
    createdAt: '2024-04-05',
  },
  {
    id: '3',
    title: 'Villa Colonial en Cartagena',
    location: 'Cartagena, Colombia',
    price: 3200000,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
    tokensAvailable: 2000,
    totalTokens: 3200,
    tokensSold: 1200,
    createdAt: '2024-03-01',
  },
  {
    id: '4',
    title: 'Penthouse en Dubai Marina',
    location: 'Dubai, UAE',
    price: 5000000,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    tokensAvailable: 3000,
    totalTokens: 5000,
    tokensSold: 2000,
    createdAt: '2024-02-15',
  },
]

/**
 * ProfilePage Component
 * Modern profile page without cards
 * Clean sections with dividers
 * Logout button at the bottom
 */
export function ProfilePage({ user, onLogout, onNavigateToSeller, onViewPropertyDetails }) {
  const [copied, setCopied] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [kycStatus, setKycStatus] = useState(null)
  const [kycLoading, setKycLoading] = useState(false)
  const Strings = useStrings()

  // Edit form state
  const [editData, setEditData] = useState({
    email: user?.email || '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})

  // Fetch KYC status on component mount
  useEffect(() => {
    if (user?.id) {
      loadKYCStatus()
    }
  }, [user?.id])

  // Don't poll if already approved
  useEffect(() => {
    if (kycStatus?.status === 'approved') {
      // Status is already approved, no need to poll
      return
    }
  }, [kycStatus])

  const loadKYCStatus = async () => {
    try {
      const statusResponse = await kycService.getKYCStatus(user.id)
      const status = statusResponse.data || statusResponse
      console.log('📊 KYC Status loaded:', status)
      setKycStatus(status)
      return status
    } catch (error) {
      console.error('Error loading KYC status:', error)
      // Set default status on error
      const defaultStatus = {
        status: 'not_started',
        level: 1,
        transactionLimit: 5000,
        retryCount: 0,
      }
      setKycStatus(defaultStatus)
      return defaultStatus
    }
  }

  const handleStartKYC = async () => {
    try {
      setKycLoading(true)
      const response = await kycService.startKYC(user.id, 1)

      // Open Veriff verification URL in a new window
      const kycUrl = response.data?.kycUrl || response.kycUrl
      if (kycUrl) {
        const veriffWindow = window.open(kycUrl, '_blank', 'width=600,height=800')

        // Poll for KYC status updates
        const pollInterval = setInterval(async () => {
          const statusResponse = await kycService.getKYCStatus(user.id)
          const kycData = statusResponse.data || statusResponse
          console.log('KYC Status Poll:', kycData) // Debug log
          setKycStatus(kycData)

          // Stop polling if status changed from pending
          if (kycData.status !== 'pending') {
            console.log('KYC Status changed, closing window. Status:', kycData.status) // Debug log
            clearInterval(pollInterval)
            if (veriffWindow && !veriffWindow.closed) {
              veriffWindow.close()
            }
          }
        }, 5000) // Poll every 5 seconds

        // Clean up interval if window is closed
        const checkWindow = setInterval(() => {
          if (veriffWindow && veriffWindow.closed) {
            clearInterval(pollInterval)
            clearInterval(checkWindow)
            loadKYCStatus() // Refresh status when window closes
          }
        }, 1000)
      }
    } catch (error) {
      console.error('Error starting KYC:', error)
      alert('Failed to start KYC verification. Please try again.')
    } finally {
      setKycLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">{Strings.error}</h2>
          <p className="text-muted-foreground">{Strings.somethingWentWrong}</p>
        </div>
      </div>
    )
  }

  // Mock member since date
  const memberSince = new Date('2025-01-15') // Would come from user data

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(user.walletAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Validation
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validatePassword = (password) => {
    return password.length >= 8
  }

  const handleEmailUpdate = async (e) => {
    e.preventDefault()
    const newErrors = {}

    // Validate email
    if (!validateEmail(editData.email)) {
      newErrors.email = 'Invalid email address'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    setErrors({})

    // Simulate update
    setTimeout(() => {
      setIsLoading(false)
      // Update user data in localStorage
      const updatedUser = { ...user, email: editData.email }
      localStorage.setItem('user', JSON.stringify(updatedUser))

      // Reset form and exit edit mode
      setIsEditing(false)
      setEditData({
        email: editData.email,
        password: '',
        confirmPassword: ''
      })

      // In a real app, you would refresh the user data from the server
      alert('Email updated successfully!')
    }, 1500)
  }

  const handlePasswordUpdate = async (e) => {
    e.preventDefault()
    const newErrors = {}

    // Validate password
    if (!validatePassword(editData.password)) {
      newErrors.password = 'Password must be at least 8 characters'
    }
    if (editData.password !== editData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    setErrors({})

    // Simulate update
    setTimeout(() => {
      setIsLoading(false)

      // Reset form and exit edit mode
      setIsEditing(false)
      setEditData({
        email: editData.email,
        password: '',
        confirmPassword: ''
      })

      // In a real app, you would refresh the user data from the server
      alert('Password updated successfully!')
    }, 1500)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditData({
      email: user?.email || '',
      password: '',
      confirmPassword: ''
    })
    setErrors({})
  }

  return (
    <div className="min-h-screen py-8 lg:py-12 bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Avatar */}
        <div className="mb-12">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center ring-4 ring-background shadow-lg">
              <User className="w-10 h-10 lg:w-12 lg:h-12 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-1">{user.name}</h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {Strings.memberSince} {memberSince.toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="space-y-8">
          {/* Personal Information Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Personal Information
              </h2>
              {!isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="text-primary hover:text-primary/80"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>

            {isEditing ? (
              // Edit Form with Tabs
              <div className="space-y-6">
                <Tabs defaultValue="email" className="w-full">
                  <TabsList className="w-full border-b border-border">
                    <TabsTrigger value="email">Email</TabsTrigger>
                    <TabsTrigger value="password">Password</TabsTrigger>
                  </TabsList>

                  {/* Tab 1: Email */}
                  <TabsContent value="email">
                    <form onSubmit={handleEmailUpdate} className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            type="email"
                            value={editData.email}
                            onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                            placeholder="your@email.com"
                            className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                          />
                        </div>
                        {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-2">
                        <Button type="submit" className="flex-1" disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <LoaderButton className="mr-2" />
                              Updating...
                            </>
                          ) : (
                            'Update Email'
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleCancelEdit}
                          disabled={isLoading}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </TabsContent>

                  {/* Tab 2: Password */}
                  <TabsContent value="password">
                    <form onSubmit={handlePasswordUpdate} className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">New Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            value={editData.password}
                            onChange={(e) => setEditData({ ...editData, password: e.target.value })}
                            placeholder="Enter new password"
                            className={`pl-10 pr-10 ${errors.password ? 'border-destructive' : ''}`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
                        {editData.password && (
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center gap-2 text-xs">
                              <div className={`w-2 h-2 rounded-full ${editData.password.length >= 8 ? 'bg-green-500' : 'bg-muted'}`} />
                              <span className={editData.password.length >= 8 ? 'text-green-500' : 'text-muted-foreground'}>
                                At least 8 characters
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Confirm Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            value={editData.confirmPassword}
                            onChange={(e) => setEditData({ ...editData, confirmPassword: e.target.value })}
                            placeholder="Confirm new password"
                            className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-destructive' : ''}`}
                          />
                        </div>
                        {errors.confirmPassword && <p className="text-xs text-destructive mt-1">{errors.confirmPassword}</p>}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-2">
                        <Button type="submit" className="flex-1" disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <LoaderButton className="mr-2" />
                              Updating...
                            </>
                          ) : (
                            'Update Password'
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleCancelEdit}
                          disabled={isLoading}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              // View Mode
              <div className="space-y-4">
              {/* Email */}
              <div className="flex items-start gap-4 py-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground mb-1">{Strings.emailAddress}</p>
                  <p className="text-base font-medium truncate">{user.email}</p>
                </div>
              </div>


              {/* Full Name */}
              <div className="flex items-start gap-4 py-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <User className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground mb-1">{Strings.fullName}</p>
                  <p className="text-base font-medium">{user.name}</p>
                </div>
              </div>
            </div>
            )}
          </div>

          {/* Divider between sections */}
          <div className="border-t-2 border-border" />

          {/* My Properties Section */}
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              {Strings.myProperties || 'Mis Propiedades'}
            </h2>
            <PropertyCardProfile
              properties={MOCK_USER_PROPERTIES}
              onViewDetails={onViewPropertyDetails}
              onViewAll={onNavigateToSeller}
            />
          </div>

          {/* Divider between sections */}
          <div className="border-t-2 border-border" />

          {/* Blockchain Section */}
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Blockchain
            </h2>
            <div className="space-y-4">
              {/* Wallet Address */}
              <div className="flex items-start gap-4 py-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <Wallet className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground mb-1">{Strings.walletAddress}</p>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-mono font-medium truncate flex-1">{user.walletAddress}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyAddress}
                      className="flex-shrink-0 h-8 px-3"
                    >
                      {copied ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Stellar Network</p>
                </div>
              </div>
            </div>
          </div>

          {/* Divider between sections */}
          <div className="border-t-2 border-border" />

          {/* Security Section */}
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Security & Verification
            </h2>
            <div className="space-y-4">
              {/* KYC Status */}
              <div className="flex items-start gap-4 py-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <Shield className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-medium text-muted-foreground">{Strings.kycStatus}</p>
                    {!kycStatus ? (
                      <Badge variant="outline" className="px-3 py-1">
                        Loading...
                      </Badge>
                    ) : kycStatus.status === 'approved' ? (
                      <Badge className="bg-green-500/10 text-green-600 border-green-500/20 px-3 py-1">
                        <Check className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    ) : kycStatus.status === 'pending' ? (
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20 px-3 py-1">
                        <Calendar className="w-3 h-3 mr-1" />
                        Pending
                      </Badge>
                    ) : kycStatus.status === 'rejected' ? (
                      <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20 px-3 py-1">
                        <X className="w-3 h-3 mr-1" />
                        Rejected
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 px-3 py-1">
                        <X className="w-3 h-3 mr-1" />
                        {Strings.notVerified}
                      </Badge>
                    )}
                  </div>

                  {kycStatus && kycStatus.status !== 'approved' && kycStatus.status !== 'pending' && (
                    <div className="mt-3">
                      <p className="text-sm text-muted-foreground mb-3">
                        Complete KYC verification to unlock higher transaction limits (${kycStatus.transactionLimit?.toLocaleString()}/month)
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto"
                        onClick={handleStartKYC}
                        disabled={kycLoading}
                      >
                        {kycLoading ? (
                          <>
                            <LoaderButton className="w-4 h-4 mr-2" />
                            Starting...
                          </>
                        ) : (
                          <>
                            <Shield className="w-4 h-4 mr-2" />
                            {kycStatus.status === 'rejected' ? 'Retry Verification' : Strings.startKYC}
                          </>
                        )}
                      </Button>
                      {kycStatus.rejectionReason && (
                        <p className="text-sm text-red-600 mt-2">
                          Reason: {kycStatus.rejectionReason}
                        </p>
                      )}
                    </div>
                  )}

                  {kycStatus && kycStatus.status === 'pending' && (
                    <p className="text-sm text-blue-600 mt-2">
                      Your verification is being reviewed. This usually takes 1-2 business days.
                    </p>
                  )}

                  {kycStatus && kycStatus.status === 'approved' && (
                    <p className="text-sm text-green-600 mt-2">
                      Your identity has been verified. Transaction limit: ${kycStatus.transactionLimit?.toLocaleString()}/month
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Divider before logout */}
          <div className="border-t-2 border-border pt-6" />

          {/* Logout Section */}
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Account Actions
            </h2>
            <Button
              variant="outline"
              className="w-full border-2 border-destructive/20 text-destructive hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-all"
              onClick={onLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-3">
              You'll be redirected to the marketplace after signing out
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
