import { Component } from 'react'
import { Button } from '@/components/ui'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    // Store error details in state
    this.setState({
      error,
      errorInfo
    })

    // Clear potentially corrupted localStorage data
    try {
      const token = localStorage.getItem('blocki_token')
      const user = localStorage.getItem('blocki_user')

      // If error occurs and user data seems corrupted, clear it
      if (error?.message?.includes('JSON') || error?.message?.includes('parse')) {
        localStorage.removeItem('blocki_user')
        localStorage.removeItem('blocki_token')
        console.log('Cleared potentially corrupted localStorage data')
      }
    } catch (e) {
      console.error('Error clearing localStorage:', e)
    }
  }

  handleReset = () => {
    // Clear all app data and reload
    try {
      localStorage.clear()
      sessionStorage.clear()

      // Clear service workers
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          registrations.forEach(registration => registration.unregister())
        })
      }

      // Hard reload
      window.location.href = '/'
    } catch (e) {
      // Fallback: just reload
      window.location.reload()
    }
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-card border border-border rounded-lg p-8 shadow-lg">
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-500"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>

            {/* Error Message */}
            <h1 className="text-2xl font-bold text-center text-foreground mb-2">
              Oops! Something went wrong
            </h1>
            <p className="text-center text-muted-foreground mb-6">
              The application encountered an unexpected error. Don't worry, your data is safe.
            </p>

            {/* Error Details (in development) */}
            {import.meta.env.DEV && this.state.error && (
              <details className="mb-6 p-4 bg-muted rounded-md text-sm">
                <summary className="cursor-pointer font-semibold text-foreground mb-2">
                  Error Details (Dev Only)
                </summary>
                <div className="mt-2 space-y-2">
                  <p className="text-red-500 font-mono text-xs break-all">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo?.componentStack && (
                    <pre className="text-xs text-muted-foreground overflow-auto max-h-40 whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              </details>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={this.handleReload}
                className="w-full"
                variant="default"
              >
                Reload Page
              </Button>
              <Button
                onClick={this.handleReset}
                className="w-full"
                variant="outline"
              >
                Clear Data & Reset
              </Button>
            </div>

            {/* Help Text */}
            <p className="text-center text-xs text-muted-foreground mt-6">
              If this problem persists, try clearing your browser cache (Ctrl + Shift + R)
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
