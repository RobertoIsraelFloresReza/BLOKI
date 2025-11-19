import { cn } from '@/lib/utils'

/**
 * Loader3D Component
 * Loader from cssloaders.github.io
 * Uses primary (blue) and secondary (green) colors
 * Fixed size: 48px
 */
export function Loader3D({ className }) {
  return (
    <span
      className={cn(
        'loader',
        className
      )}
    />
  )
}
