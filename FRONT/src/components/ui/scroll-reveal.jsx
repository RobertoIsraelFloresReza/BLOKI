import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

/**
 * ScrollReveal Component
 * Wraps children with scroll reveal animation using Framer Motion
 * Children fade in and slide up when they enter the viewport
 *
 * @param {ReactNode} children - Content to animate
 * @param {number} delay - Animation delay in seconds (default: 0)
 * @param {number} duration - Animation duration in seconds (default: 0.5)
 * @param {number} distance - Distance to slide up in pixels (default: 50)
 * @param {boolean} once - Whether animation should occur only once (default: true)
 */
export function ScrollReveal({
  children,
  delay = 0,
  duration = 0.5,
  distance = 50,
  once = true,
  className = ''
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, {
    once,
    margin: "-100px" // Start animation 100px before element enters viewport
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: distance }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: distance }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1] // Custom easing for smooth animation
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * ScrollRevealItem Component
 * Similar to ScrollReveal but designed for list items with stagger effect
 * Use this when mapping over arrays to create staggered animations
 *
 * @param {ReactNode} children - Content to animate
 * @param {number} index - Item index for stagger calculation
 * @param {number} staggerDelay - Delay between each item (default: 0.1)
 */
export function ScrollRevealItem({
  children,
  index = 0,
  staggerDelay = 0.1,
  duration = 0.5,
  distance = 50,
  once = true,
  className = ''
}) {
  return (
    <ScrollReveal
      delay={index * staggerDelay}
      duration={duration}
      distance={distance}
      once={once}
      className={className}
    >
      {children}
    </ScrollReveal>
  )
}
