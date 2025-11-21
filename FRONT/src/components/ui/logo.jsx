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
    xs: 'w-10 h-10',
    sm: 'w-16 h-16',
    default: 'w-20 h-20',
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
        {/* Logo image */}
        <img
          src={logoSrc}
          alt="Blocki Logo"
          className={cn(
            'object-contain',
            sizes[size],
            withEffects && [
              'group-hover:scale-110',
              'group-hover:brightness-110',
              'transition-all duration-500',
              'drop-shadow-lg',
              'group-hover:drop-shadow-2xl',
            ]
          )}
        />

        {/* Shine effect on hover */}
        {withEffects && (
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
        )}
      </div>
    </div>
  )
}

/**
 * LogoWithText Component
 * Logo with the Blocki text next to it
 */
export function LogoWithText({ size = 'sm', withEffects = false }) {
  const textSizes = {
    xs: 'text-lg',
    sm: 'text-xl',
    default: 'text-2xl',
    lg: 'text-4xl',
  }

  const gapSizes = {
    xs: 'gap-2',
    sm: 'gap-3',
    default: 'gap-3',
    lg: 'gap-4',
  }

  return (
    <div className={cn('flex items-center', gapSizes[size])}>
      <Logo size={size} withEffects={withEffects} />
      <span className={cn('font-bold', textSizes[size])}>Blocki</span>
    </div>
  )
}
