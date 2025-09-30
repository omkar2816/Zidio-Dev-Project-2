import { useState, useEffect, useRef, useCallback } from "react"
import { FiSearch, FiFilter, FiX, FiTag, FiCalendar, FiTrendingUp, FiClock } from "react-icons/fi"
import { expandSearchTerm, getSearchSuggestions } from "../services/synonymService"

function SearchBar({ onSearch, onFilter }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState("")
  const [sortBy, setSortBy] = useState("createdAt")
  const [showFilters, setShowFilters] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const searchTimeoutRef = useRef(null)
  const suggestionsRef = useRef(null)

  const categories = [
    "Technology", 
    "Web Development", 
    "Mobile Development", 
    "Data Science", 
    "DevOps", 
    "UI/UX Design", 
    "Career", 
    "Tutorials"
  ]

  const sortOptions = [
    { value: "createdAt", label: "Latest First", icon: FiCalendar },
    { value: "likesCount", label: "Most Liked", icon: FiTrendingUp },
    { value: "viewsCount", label: "Most Viewed", icon: FiTrendingUp },
    { value: "title", label: "Alphabetical", icon: FiTag }
  ]

  // Debounced search function
  const debouncedSearch = useCallback((term) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      setIsSearching(true)
      const expandedTerms = expandSearchTerm(term)
      onSearch(term, expandedTerms)
      setIsSearching(false)
    }, 300) // 300ms delay for real-time search
  }, [onSearch])

  // Handle search input changes
  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    
    // Generate suggestions
    if (value.trim().length >= 2) {
      const newSuggestions = getSearchSuggestions(value)
      setSuggestions(newSuggestions)
      setShowSuggestions(newSuggestions.length > 0)
    } else {
      setShowSuggestions(false)
      setSuggestions([])
    }
    
    // Trigger real-time search
    if (value.trim().length >= 2) {
      debouncedSearch(value.trim())
    } else if (value.trim().length === 0) {
      onSearch("", [])
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setShowSuggestions(false)
    if (searchTerm.trim()) {
      const expandedTerms = expandSearchTerm(searchTerm.trim())
      onSearch(searchTerm.trim(), expandedTerms)
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion)
    setShowSuggestions(false)
    const expandedTerms = expandSearchTerm(suggestion)
    onSearch(suggestion, expandedTerms)
  }

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  const handleCategoryChange = (value) => {
    setCategory(value)
    onFilter({ category: value, sortBy })
  }

  const handleSortChange = (value) => {
    setSortBy(value)
    onFilter({ category, sortBy: value })
  }

  const clearFilters = () => {
    setSearchTerm("")
    setCategory("")
    setSortBy("createdAt")
    setShowSuggestions(false)
    setSuggestions([])
    onSearch("", [])
    onFilter({})
  }

  return (
    <div className="card-modern p-6 space-y-6">
      {/* Main Search */}
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative group" ref={suggestionsRef}>
          <FiSearch className={`search-icon-centered left-4 group-focus-within:text-primary-500 transition-colors duration-200 z-10 w-5 h-5 ${
            isSearching ? 'animate-pulse text-primary-500' : 'text-theme-text-secondary'
          }`} />
          <input
            type="text"
            placeholder="Search for stories, authors, topics..."
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => {
              if (suggestions.length > 0) {
                setShowSuggestions(true)
              }
            }}
            className="input-modern pl-12 pr-4 w-full"
            style={{ height: '56px' }}
            autoComplete="off"
          />
          
          {/* Search Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-theme-bg border border-theme-border rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto">
              <div className="p-2">
                <div className="text-xs text-theme-text-secondary px-3 py-2 font-medium flex items-center">
                  <FiSearch className="w-3 h-3 mr-2" />
                  Search suggestions
                </div>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-3 py-2 hover:bg-theme-bg-secondary rounded-lg transition-colors duration-200 flex items-center text-sm"
                  >
                    <FiTag className="w-3 h-3 mr-2 text-theme-text-secondary" />
                    <span className="text-theme-text">{suggestion}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button 
            type="submit" 
            disabled={isSearching}
            className="btn-primary px-8 whitespace-nowrap group min-w-[120px] text-lg font-medium flex items-center justify-center disabled:opacity-50"
            style={{ height: '56px' }}
          >
            {isSearching ? (
              <>
                <FiClock className="mr-2 animate-spin" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <FiSearch className="mr-2 group-hover:scale-110 transition-transform duration-200" />
                <span>Search</span>
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-secondary px-6 group flex items-center justify-center ${showFilters ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : ''}`}
            style={{ height: '56px' }}
          >
            <FiFilter className="group-hover:scale-110 transition-transform duration-200" />
          </button>
        </div>
      </form>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="border-t border-theme-border pt-6 space-y-4 animate-slide-down">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h3 className="text-lg font-display font-semibold text-theme-text">Filters & Sorting</h3>
            
            {(category || sortBy !== 'createdAt') && (
              <button
                onClick={clearFilters}
                className="flex items-center space-x-2 text-theme-text-secondary hover:text-accent-500 transition-colors duration-200"
              >
                <FiX className="w-4 h-4" />
                <span>Clear All</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Categories */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-theme-text">Category</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleCategoryChange("")}
                  className={`px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                    !category
                      ? 'bg-primary-500 text-white shadow-md'
                      : 'bg-theme-bg-secondary text-theme-text-secondary hover:text-theme-text hover:bg-theme-bg-tertiary'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`px-3 py-2 text-sm rounded-lg transition-all duration-200 text-left ${
                      category === cat
                        ? 'bg-primary-500 text-white shadow-md'
                        : 'bg-theme-bg-secondary text-theme-text-secondary hover:text-theme-text hover:bg-theme-bg-tertiary'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-theme-text">Sort By</label>
              <div className="space-y-2">
                {sortOptions.map((option) => {
                  const IconComponent = option.icon
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleSortChange(option.value)}
                      className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-all duration-200 ${
                        sortBy === option.value
                          ? 'bg-primary-500 text-white shadow-md'
                          : 'bg-theme-bg-secondary text-theme-text-secondary hover:text-theme-text hover:bg-theme-bg-tertiary'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span>{option.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchBar
