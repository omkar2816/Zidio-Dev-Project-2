import { useEffect, useCallback } from 'react'

/**
 * Custom hook to interact with Lenis smooth scroll
 */
export const useLenis = () => {
  // Scroll to a specific element or position
  const scrollTo = useCallback((target, options = {}) => {
    if (window.lenis) {
      window.lenis.scrollTo(target, {
        offset: 0,
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        ...options
      })
    }
  }, [])

  // Scroll to top
  const scrollToTop = useCallback((options = {}) => {
    scrollTo(0, options)
  }, [scrollTo])

  // Stop smooth scrolling
  const stop = useCallback(() => {
    if (window.lenis) {
      window.lenis.stop()
    }
  }, [])

  // Start smooth scrolling
  const start = useCallback(() => {
    if (window.lenis) {
      window.lenis.start()
    }
  }, [])

  // Check if Lenis is available
  const isLenisReady = useCallback(() => {
    return !!window.lenis
  }, [])

  return {
    scrollTo,
    scrollToTop,
    stop,
    start,
    isLenisReady
  }
}

export default useLenis