import { useState, useEffect } from "react"
import { FiSearch, FiFilter, FiX, FiTag, FiCalendar, FiTrendingUp } from "react-icons/fi"

function SearchBar({ onSearch, onFilter }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState("")
  const [sortBy, setSortBy] = useState("createdAt")
  const [showFilters, setShowFilters] = useState(false)

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

  // Real-time search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(searchTerm)
    }, 300) // 300ms delay for debouncing

    return () => clearTimeout(timeoutId)
  }, [searchTerm, onSearch])

  const handleSearch = (e) => {
    e.preventDefault()
    // Form submission now just triggers immediate search
    onSearch(searchTerm)
  }

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value)
  }

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
    onSearch("")
    onFilter({})
  }

  return (
    <div className="card-modern p-6 space-y-6">
      {/* Main Search */}
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative group">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-theme-text-secondary group-focus-within:text-primary-500 transition-colors duration-200 z-10 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for stories, authors, topics..."
            value={searchTerm}
            onChange={handleInputChange}
            className="input-modern pl-12 pr-4 w-full"
          />
        </div>

        <div className="flex gap-2">
          <button 
            type="submit" 
            className="btn-primary px-8 py-4 whitespace-nowrap group min-w-[120px] text-lg font-medium flex items-center justify-center"
          >
            <FiSearch className="mr-2 group-hover:scale-110 transition-transform duration-200" />
            <span>Search</span>
          </button>
          
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-secondary px-6 py-4 group flex items-center justify-center ${showFilters ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : ''}`}
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
