"use client"

import { useState } from "react"
import { FiSearch } from "react-icons/fi"

function SearchBar({ onSearch, onFilter }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState("")

  const categories = ["Technology", "Lifestyle", "Travel", "Food", "Health", "Business"]

  const handleSearch = (e) => {
    e.preventDefault()
    onSearch(searchTerm)
  }

  const handleCategoryChange = (e) => {
    const value = e.target.value
    setCategory(value)
    onFilter({ category: value })
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search blogs by title, tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <select
          value={category}
          onChange={handleCategoryChange}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition">
          Search
        </button>
      </form>
    </div>
  )
}

export default SearchBar
