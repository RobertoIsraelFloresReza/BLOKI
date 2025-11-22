import { SearchBar } from '@/components/marketplace/SearchBar'
import { FiltersTabs } from '@/components/marketplace/FiltersTabs'
import { ScrollReveal, AnimatedText } from '@/components/ui'

/**
 * MarketplaceHeader Component
 * Hero section with animated title, search, and filters
 * Features: Breathing background effect, gradient text, wave animations
 */
export function MarketplaceHeader({
  searchQuery,
  setSearchQuery,
  filters,
  selectedFilter,
  setSelectedFilter,
  Strings
}) {
  return (
    <div className="relative py-8 md:py-10 lg:py-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 relative z-10">
        {/* Title */}
        <div className="text-center mb-6">
          {/* Main Title with Gradient */}
          <h1 className="font-open-sans font-extrabold mb-3 leading-none">
            <div className="text-4xl md:text-5xl lg:text-6xl mb-2">
              <AnimatedText
                key={Strings.marketplaceTitleLine1}
                text={Strings.marketplaceTitleLine1}
                type="wave"
                delay={0}
              />
            </div>
            <div className="text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient-x">
              <AnimatedText
                key={Strings.marketplaceTitleLine2}
                text={Strings.marketplaceTitleLine2}
                type="wave"
                delay={0.2}
              />
            </div>
            <div className="text-4xl md:text-5xl lg:text-6xl mt-2 bg-gradient-to-r from-secondary via-primary to-secondary bg-clip-text text-transparent animate-gradient-x">
              <AnimatedText
                key={Strings.marketplaceTitleLine3}
                text={Strings.marketplaceTitleLine3}
                type="wave"
                delay={0.4}
              />
            </div>
          </h1>

          {/* Subtitle */}
          <ScrollReveal delay={0.8} duration={0.6}>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto font-open-sans leading-snug">
              {Strings.marketplaceSubtitle}{' '}
              <span className="text-primary font-semibold">{Strings.marketplaceSubtitlePassive}</span>
              {' '}{Strings.marketplaceSubtitleTokenized}{' '}
              <span className="text-secondary font-semibold">Stellar</span>
            </p>
          </ScrollReveal>
        </div>

        {/* Search Bar - Desktop Only */}
        <ScrollReveal delay={0.2} duration={0.6}>
          <div className="hidden lg:block max-w-2xl mx-auto mb-6">
            <SearchBar
              placeholder={Strings.searchPlaceholder}
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>
        </ScrollReveal>

        {/* Filter Tabs - Mobile Only (in header as shortcut) */}
        <ScrollReveal delay={0.4} duration={0.6}>
          <div className="lg:hidden">
            <FiltersTabs
              filters={filters}
              selectedFilter={selectedFilter}
              onFilterChange={setSelectedFilter}
            />
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}
