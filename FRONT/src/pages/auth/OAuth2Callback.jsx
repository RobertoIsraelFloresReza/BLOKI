import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { LoaderButton } from '@/components/ui'

/**
 * OAuth2Callback Component
 * Handles the callback from Google OAuth2
 * Extracts token from URL and stores user data
 */
export function OAuth2Callback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const token = searchParams.get('token')

    if (token) {
      // Store token in localStorage with correct key
      localStorage.setItem('blocki_token', token)

      // Decode JWT to get user data (simple base64 decode, no verification needed on client)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))

        const user = {
          id: payload.id,
          email: payload.email,
          name: payload.name,
          stellarPublicKey: payload.stellarPublicKey,
        }

        localStorage.setItem('blocki_user', JSON.stringify(user))

        // Redirect to marketplace
        navigate('/', { replace: true })
      } catch (error) {
        console.error('Error decoding token:', error)
        // If token is invalid, redirect to auth page
        navigate('/auth', { replace: true })
      }
    } else {
      // No token found, redirect to auth page
      navigate('/auth', { replace: true })
    }
  }, [searchParams, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/5">
      <div className="text-center">
        <LoaderButton className="w-16 h-16 mb-4 mx-auto" />
        <h2 className="text-2xl font-bold mb-2">Signing you in...</h2>
        <p className="text-muted-foreground">Please wait while we complete your authentication</p>
      </div>
    </div>
  )
}
