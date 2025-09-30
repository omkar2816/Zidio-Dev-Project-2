import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  // Check for saved theme preference or default to 'light'
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) return savedTheme
    
    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
    return 'light'
  })

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }

  useEffect(() => {
    // Save theme preference
    localStorage.setItem('theme', theme)
    
    // Apply theme class to document root
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
    
    // Update CSS custom properties for theme colors
    if (theme === 'dark') {
      root.style.setProperty('--color-bg', '15 23 42') // slate-900
      root.style.setProperty('--color-bg-secondary', '30 41 59') // slate-800
      root.style.setProperty('--color-bg-tertiary', '51 65 85') // slate-700
      root.style.setProperty('--color-text', '248 250 252') // slate-50
      root.style.setProperty('--color-text-secondary', '203 213 225') // slate-300
      root.style.setProperty('--color-border', '71 85 105') // slate-600
    } else {
      root.style.setProperty('--color-bg', '255 255 255') // white
      root.style.setProperty('--color-bg-secondary', '248 250 252') // slate-50
      root.style.setProperty('--color-bg-tertiary', '241 245 249') // slate-100
      root.style.setProperty('--color-text', '15 23 42') // slate-900
      root.style.setProperty('--color-text-secondary', '71 85 105') // slate-600
      root.style.setProperty('--color-border', '226 232 240') // slate-200
    }
  }, [theme])

  const value = {
    theme,
    toggleTheme,
    isDark: theme === 'dark'
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}