import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'

/**
 * Logo Component
 * Displays the Blocki logo with blockchain-inspired effects
 * Automatically switches between light and dark mode logos
 */
export function Logo({ size = 'default', withEffects = false, className }) {
  const { theme } = useTheme()

  const sizes = {
    sm: 'w-24 h-24',
    default: 'w-36 h-36',
    lg: 'w-48 h-48',
  }

  const logoSrc = theme === 'dark' ? '/claro.png' : '/oscuro.png'

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center',
        withEffects && 'group',
        className
      )}
      style={{
        perspective: '1000px',
      }}
    >
      {/* Coin flip animation wrapper */}
      <div
        className={cn(
          'relative',
          withEffects && 'group-hover:animate-coin-flip'
        )}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Outer rotating ring - Blockchain effect */}
        {withEffects && (
          <>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-secondary to-primary opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 animate-pulse" />
            <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-spin-slow" style={{ animationDuration: '8s' }} />
            <div className="absolute inset-0 rounded-full border-2 border-secondary/20 animate-spin-slow" style={{ animationDuration: '12s', animationDirection: 'reverse' }} />
          </>
        )}

        {/* Logo container with glassmorphism */}
        <div
          className={cn(
            'relative rounded-full overflow-hidden',
            'bg-gradient-to-br from-card/80 to-card/60',
            'backdrop-blur-sm',
            'border border-border/50',
            'shadow-lg',
            withEffects && [
              'group-hover:scale-110',
              'group-hover:shadow-2xl',
              'group-hover:border-primary/50',
              'transition-all duration-500',
            ],
            sizes[size]
          )}
        >
        {/* Inner glow */}
        {withEffects && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        )}

        {/* Logo image */}
        <img
          src={logoSrc}
          alt="Blocki Logo"
          className={cn(
            'w-full h-full object-contain p-1',
            withEffects && 'group-hover:brightness-110 transition-all duration-500'
          )}
        />

        {/* Shine effect */}
        {withEffects && (
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        )}
      </div>

      {/* Outer glow pulse */}
      {withEffects && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 blur-md animate-pulse" style={{ animationDuration: '3s' }} />
      )}
      </div>
    </div>
  )
}

/**
 * LogoWithText Component
 * Logo with the Blocki text next to it
 */
export function LogoWithText({ size = 'default', withEffects = false }) {
  const textSizes = {
    sm: 'text-xl',
    default: 'text-2xl',
    lg: 'text-4xl',
  }

  return (
    <div className="flex items-center gap-3">
      <Logo size={size} withEffects={withEffects} />
      <span className={cn('font-bold', textSizes[size])}>Blocki</span>
    </div>
  )
}
