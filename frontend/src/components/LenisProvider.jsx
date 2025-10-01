import { useEffect, useRef } from 'react'
import Lenis from 'lenis'

function LenisProvider({ children }) {
  const lenisRef = useRef(null)

  useEffect(() => {
    // Initialize Lenis with smooth scrolling configuration
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false, // Disable smooth touch to avoid mobile issues
      touchMultiplier: 2,
      infinite: false,
    })

    // Animation frame function
    function raf(time) {
      lenisRef.current?.raf(time)
      requestAnimationFrame(raf)
    }

    // Start the animation loop
    requestAnimationFrame(raf)

    // Cleanup function
    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy()
      }
    }
  }, [])

  // Provide scrollTo function globally if needed
  useEffect(() => {
    if (lenisRef.current) {
      window.lenis = lenisRef.current
    }

    return () => {
      if (window.lenis) {
        delete window.lenis
      }
    }
  }, [])

  return <>{children}</>
}

export default LenisProvider