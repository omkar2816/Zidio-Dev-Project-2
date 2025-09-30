"use client"

import { useState } from "react"
import { FiSearch, FiFilter, FiX } from "react-icons/fi"

function SearchBar({ onSearch, onFilter }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const categories = ["Technology", "Lifestyle", "Travel", "Food", "Health", "Business", "Education", "Entertainment"]

  const handleSearch = (e) => {
    e.preventDefault()
    onSearch(searchTerm)
  }

  const handleCategoryChange = (value) => {
    setCategory(value)
    onFilter({ category: value })
    setIsFilterOpen(false)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setCategory("")
    onSearch("")
    onFilter({ category: "" })
  }

  return (
    <div className="card p-8 mb-8">
      {/* Main Search */}
      <form onSubmit={handleSearch} className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative group">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Search for amazing stories, topics, authors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-modern w-full pl-12 text-lg"
            />
          </div>

          {/* Filter Button */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`btn px-6 py-3 flex items-center space-x-2 ${category ? 'btn-primary' : 'btn-secondary'}`}
            >
              <FiFilter className="w-5 h-5" />
              <span>Filter</span>
              {category && <span className="bg-white/20 px-2 py-1 rounded text-xs">{category}</span>}
            </button>

            <button
              type="submit"
              className="btn btn-primary px-8 py-3 font-semibold"
            >
              Search
            </button>
          </div>
        </div>

        {/* Category Filter Dropdown */}
        {isFilterOpen && (
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">Filter by Category</h3>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              <button
                onClick={() => handleCategoryChange("")}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  category === "" 
                    ? "bg-blue-500 text-white" 
                    : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                }`}
              >
                All Categories
              </button>
              
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    category === cat 
                      ? "bg-blue-500 text-white" 
                      : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {(searchTerm || category) && (
              <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-600">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {searchTerm && `Searching for: "${searchTerm}"`}
                  {searchTerm && category && " in "}
                  {category && `Category: ${category}`}
                </span>
                <button
                  onClick={clearFilters}
                  className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  )
}

export default SearchBar
