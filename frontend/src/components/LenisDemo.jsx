import { useLenis } from '../hooks/useLenis'

/**
 * Demo component to showcase Lenis smooth scrolling functionality
 * This can be used in any page to test smooth scroll features
 */
const LenisDemo = () => {
  const { scrollTo, scrollToTop } = useLenis()

  const handleScrollToSection = (sectionId) => {
    scrollTo(`#${sectionId}`, {
      offset: -100, // Account for fixed navbar
      duration: 1.5
    })
  }

  return (
    <div className="p-4 bg-theme-bg-secondary rounded-lg border border-theme-border">
      <h3 className="text-lg font-semibold text-theme-text mb-4">Smooth Scroll Demo</h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => scrollToTop({ duration: 2 })}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          Scroll to Top
        </button>
        <button
          onClick={() => handleScrollToSection('hero')}
          className="px-4 py-2 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 transition-colors"
        >
          Scroll to Hero
        </button>
        <button
          onClick={() => scrollTo(document.body.scrollHeight, { duration: 3 })}
          className="px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors"
        >
          Scroll to Bottom
        </button>
      </div>
      <p className="text-sm text-theme-text-secondary mt-3">
        Lenis provides buttery smooth scrolling with easing and duration controls.
      </p>
    </div>
  )
}

export default LenisDemo