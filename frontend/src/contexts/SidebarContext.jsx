import { createContext, useContext, useState, useEffect } from "react"

const SidebarContext = createContext()

export const useSidebar = () => {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

export function SidebarProvider({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setIsOpen(false)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const toggleSidebar = () => {
    if (isMobile) {
      setIsOpen(!isOpen)
    } else {
      setIsCollapsed(!isCollapsed)
    }
  }

  const closeMobileSidebar = () => {
    if (isMobile) {
      setIsOpen(false)
    }
  }

  const sidebarWidth = isCollapsed && !isMobile ? "w-16" : "w-64"
  const sidebarWidthValue = isCollapsed && !isMobile ? 64 : 256 // in pixels

  return (
    <SidebarContext.Provider value={{
      isCollapsed,
      setIsCollapsed,
      isMobile,
      isOpen,
      setIsOpen,
      toggleSidebar,
      closeMobileSidebar,
      sidebarWidth,
      sidebarWidthValue
    }}>
      {children}
    </SidebarContext.Provider>
  )
}