import { cn } from '@/lib/utils'

/**
 * FiltersTabs Component
 * Horizontal scrollable filter tabs for categories
 * Follows Nielsen's heuristics: recognition over recall, flexibility, consistency
 */
export function FiltersTabs({
  filters = [],
  selectedFilter,
  onFilterChange,
  className = ""
}) {
  // Si no hay filtros, no renderizar nada
  if (!filters || filters.length === 0) {
    return null
  }

  return (
    <div className={cn("relative bg-transparent", className)}>
      {/* Gradient overlays for scroll indication - Hidden on mobile */}
      <div className="hidden md:block absolute left-0 top-0 bottom-0 w-8 pointer-events-none z-10 bg-gradient-to-r from-background to-transparent" />
      <div className="hidden md:block absolute right-0 top-0 bottom-0 w-8 pointer-events-none z-10 bg-gradient-to-l from-background to-transparent" />

      {/* Scrollable container */}
      <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 py-4 justify-start lg:justify-center bg-transparent">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium",
              "whitespace-nowrap transition-all duration-200",
              "min-w-fit shrink-0",
              "hover:scale-105 active:scale-95",
              selectedFilter === filter.id
                ? "bg-gradient-to-tr from-primary to-primary dark:from-primary/80 dark:to-transparent text-primary-foreground shadow-lg shadow-primary/20"
                : "bg-card text-foreground border border-border hover:border-primary/50 hover:bg-accent"
            )}
            aria-pressed={selectedFilter === filter.id}
          >
            {/* Icon */}
            {filter.icon && (
              <span className="w-5 h-5 flex items-center justify-center">
                {filter.icon}
              </span>
            )}

            {/* Label */}
            <span>{filter.name}</span>

            {/* Count badge (optional) */}
            {filter.count !== undefined && (
              <span
                className={cn(
                  "ml-1 px-2 py-0.5 rounded-full text-xs font-semibold",
                  selectedFilter === filter.id
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {filter.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
