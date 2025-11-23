import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Premium Spinner Component for Blocki
 * Features modern, professional design with multiple variants
 * - dots: Three pulsing dots
 * - ring: Smooth rotating ring with gradient
 * - orbit: Stellar-themed orbiting animation
 */
const Spinner = React.forwardRef(({ className, size = 'default', variant = 'ring', ...props }, ref) => {
  const sizes = {
    sm: 'h-4 w-4',
    default: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  }

  // Dots variant - Three pulsing dots
  if (variant === 'dots') {
    return (
      <div ref={ref} className={cn('flex items-center justify-center gap-1', className)} {...props}>
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
      </div>
    )
  }

  // Orbit variant - Stellar-themed orbiting circles
  if (variant === 'orbit') {
    const sizeClass = sizes[size]
    return (
      <div ref={ref} className={cn('relative', sizeClass, className)} {...props}>
        {/* Center dot */}
        <div className="absolute inset-0 m-auto w-2 h-2 bg-primary rounded-full" />
        {/* Orbiting circle */}
        <div className="absolute inset-0 animate-spin">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary/60 rounded-full" />
        </div>
        {/* Second orbiting circle (slower) */}
        <div className="absolute inset-0 animate-spin [animation-duration:2s]">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary/40 rounded-full" />
        </div>
      </div>
    )
  }

  // Ring variant (default) - Smooth gradient ring
  return (
    <div
      ref={ref}
      className={cn('relative', sizes[size], className)}
      {...props}
    >
      {/* Outer ring with gradient */}
      <svg
        className="absolute inset-0 w-full h-full animate-spin"
        viewBox="0 0 50 50"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="spinnerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" className="[stop-color:hsl(var(--primary))]" stopOpacity="0" />
            <stop offset="100%" className="[stop-color:hsl(var(--primary))]" stopOpacity="1" />
          </linearGradient>
        </defs>
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="url(#spinnerGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="80, 200"
          className="origin-center"
        />
      </svg>

      {/* Inner glow effect */}
      <div className="absolute inset-0 rounded-full bg-primary/10 blur-sm" />
    </div>
  )
})

Spinner.displayName = 'Spinner'

export { Spinner }
