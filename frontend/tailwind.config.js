/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Modern Gradient-Based Theme System
        theme: {
          // Light Theme Colors
          light: {
            // Background gradients
            'bg-primary': '#ffffff',
            'bg-secondary': '#f5f7fa',
            'bg-tertiary': '#e6f0ff',
            
            // Primary accent (buttons, links, CTA)
            'accent-start': '#00c6ff',
            'accent-end': '#0072ff',
            
            // Secondary accent (warm orange-pink for contrast)
            'secondary-start': '#ff6a00',
            'secondary-end': '#ee0979',
            
            // Card/Container colors
            'card-primary': '#ffffff',
            'card-secondary': '#f0f4f8',
            
            // Text colors
            'text-heading': '#1a1a1a',
            'text-body': '#333333',
            'text-muted': '#666666',
            
            // Border and subtle elements
            'border': '#e5e7eb',
            'border-light': '#f3f4f6',
          },
          
          // Dark Theme Colors
          dark: {
            // Background gradients (deep navy/teal)
            'bg-primary': '#0f2027',
            'bg-secondary': '#203a43',
            'bg-tertiary': '#2c5364',
            
            // Primary accent (glowing cyan-blue)
            'accent-start': '#00c6ff',
            'accent-end': '#0072ff',
            
            // Card/Container colors with neon glow capability
            'card-primary': '#1f1c2c',
            'card-secondary': '#2c3e50',
            
            // Text colors
            'text-heading': '#f5f5f5',
            'text-body': '#cccccc',
            'text-muted': '#999999',
            
            // Border and subtle elements
            'border': '#374151',
            'border-light': '#4b5563',
          },
        },
        
        // Category-specific gradients for both themes
        category: {
          // Technology
          'tech-start': '#ff9966',
          'tech-end': '#ff5e62',
          
          // Travel
          'travel-start': '#fc466b',
          'travel-end': '#3f5efb',
          
          // Food
          'food-start': '#f7971e',
          'food-end': '#ffd200',
          
          // General/Default
          'general-start': '#667eea',
          'general-end': '#764ba2',
        },
        
        // Keep existing color system for backward compatibility
        light: {
          background: "#F9FAFB",
          card: "#FFFFFF",
          text: "#1F2937",
          accent: "#2563EB",
          border: "#E5E7EB",
        },
        dark: {
          background: "#0F172A",
          card: "#1E293B",
          text: "#F8FAFC",
          accent: "#38BDF8",
          border: "#334155",
        },
        
        // Keep existing primary/secondary/accent for backward compatibility
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        accent: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        // Custom colors using CSS variables for dynamic theming (keep for compatibility)
        'theme-bg': 'rgb(var(--color-bg) / <alpha-value>)',
        'theme-bg-secondary': 'rgb(var(--color-bg-secondary) / <alpha-value>)',
        'theme-bg-tertiary': 'rgb(var(--color-bg-tertiary) / <alpha-value>)',
        'theme-text': 'rgb(var(--color-text) / <alpha-value>)',
        'theme-text-secondary': 'rgb(var(--color-text-secondary) / <alpha-value>)',
        'theme-border': 'rgb(var(--color-border) / <alpha-value>)',
      },
      
      // Custom gradient backgrounds
      backgroundImage: {
        // Light theme gradients
        'light-main': 'linear-gradient(135deg, #ffffff, #f5f7fa, #e6f0ff)',
        'light-card': 'linear-gradient(135deg, #ffffff, #f0f4f8)',
        'light-accent': 'linear-gradient(135deg, #00c6ff, #0072ff)',
        'light-secondary': 'linear-gradient(135deg, #ff6a00, #ee0979)',
        
        // Dark theme gradients
        'dark-main': 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
        'dark-card': 'linear-gradient(135deg, #1f1c2c, #2c3e50)',
        'dark-accent': 'linear-gradient(135deg, #00c6ff, #0072ff)',
        
        // Category gradients
        'category-tech': 'linear-gradient(135deg, #ff9966, #ff5e62)',
        'category-travel': 'linear-gradient(135deg, #fc466b, #3f5efb)',
        'category-food': 'linear-gradient(135deg, #f7971e, #ffd200)',
        'category-general': 'linear-gradient(135deg, #667eea, #764ba2)',
        
        // Utility gradients
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      
      // Custom box shadows with glow effects
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -2px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        'large': '0 10px 40px -4px rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card': '0 4px 12px rgba(0,0,0,0.1)',
        
        // Glow effects for dark theme
        'glow-blue': '0 0 20px rgba(0, 198, 255, 0.3), 0 0 40px rgba(0, 198, 255, 0.1)',
        'glow-pink': '0 0 20px rgba(238, 9, 121, 0.3), 0 0 40px rgba(238, 9, 121, 0.1)',
        'glow-cyan': '0 0 20px rgba(0, 114, 255, 0.3), 0 0 40px rgba(0, 114, 255, 0.1)',
        'glow-orange': '0 0 20px rgba(255, 106, 0, 0.3), 0 0 40px rgba(255, 106, 0, 0.1)',
        
        // Hover glow effects
        'hover-glow-blue': '0 0 30px rgba(0, 198, 255, 0.4), 0 0 60px rgba(0, 198, 255, 0.2)',
        'hover-glow-pink': '0 0 30px rgba(238, 9, 121, 0.4), 0 0 60px rgba(238, 9, 121, 0.2)',
      },
      fontFamily: {
        'display': ['Space Grotesk', 'ui-sans-serif', 'system-ui'],
        'body': ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-subtle': 'bounceSubtle 0.6s ease-out',
        
        // Glow animations for modern theme
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'glow-ping': 'glowPing 1s cubic-bezier(0, 0, 0.2, 1) infinite',
        'gradient-shift': 'gradientShift 3s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceSubtle: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
        
        // New modern theme animations
        glowPulse: {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(0, 198, 255, 0.3)',
            transform: 'scale(1)' 
          },
          '50%': { 
            boxShadow: '0 0 40px rgba(0, 198, 255, 0.6)',
            transform: 'scale(1.02)' 
          },
        },
        glowPing: {
          '75%, 100%': {
            transform: 'scale(1.1)',
            opacity: '0',
          },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
