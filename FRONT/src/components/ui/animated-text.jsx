import { motion } from 'framer-motion'

/**
 * AnimatedText Component
 * Text animation with wave effect using Framer Motion
 * Each character animates with a stagger delay creating a wave effect
 *
 * @param {string} text - The text to animate
 * @param {string} className - Additional CSS classes
 * @param {number} delay - Initial delay before animation starts
 * @param {string} type - Animation type: 'wave', 'fadeIn', 'slideUp'
 */
export function AnimatedText({
  text,
  className = '',
  delay = 0,
  type = 'wave'
}) {
  // Split text into individual characters while preserving spaces
  const characters = text.split('')

  // Animation variants for the container
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.03, // Delay between each character
        delayChildren: delay,
      }
    }
  }

  // Animation variants based on type
  const getCharVariants = () => {
    switch (type) {
      case 'wave':
        return {
          hidden: {
            y: 20,
            scale: 0.8,
          },
          visible: {
            y: 0,
            scale: 1,
            transition: {
              type: 'spring',
              damping: 12,
              stiffness: 200,
            }
          }
        }

      case 'fadeIn':
        return {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              duration: 0.3,
            }
          }
        }

      case 'slideUp':
        return {
          hidden: {
            opacity: 0,
            y: 50
          },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.5,
              ease: [0.25, 0.1, 0.25, 1]
            }
          }
        }

      case 'bounce':
        return {
          hidden: {
            opacity: 0,
            y: -20,
            scale: 0.5
          },
          visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
              type: 'spring',
              damping: 8,
              stiffness: 300,
            }
          }
        }

      default:
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 }
        }
    }
  }

  const charVariants = getCharVariants()

  return (
    <motion.span
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ display: 'inline-block' }}
    >
      {characters.map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          variants={charVariants}
          style={{
            display: 'inline-block',
            whiteSpace: char === ' ' ? 'pre' : 'normal'
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  )
}

/**
 * AnimatedTextByWord Component
 * Similar to AnimatedText but animates word by word instead of character by character
 */
export function AnimatedTextByWord({
  text,
  className = '',
  delay = 0,
  type = 'fadeIn'
}) {
  const words = text.split(' ')

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: delay,
      }
    }
  }

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  }

  return (
    <motion.span
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ display: 'inline-block' }}
    >
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          variants={wordVariants}
          style={{
            display: 'inline-block',
            marginRight: '0.25em'
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  )
}
