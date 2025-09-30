"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getBlogs } from "../store/slices/blogSlice"
import BlogCard from "../components/BlogCard"
import SearchBar from "../components/SearchBar"
import { FiLoader } from "react-icons/fi"

function Home() {
  const dispatch = useDispatch()
  const { blogs, isLoading } = useSelector((state) => state.blog)
  const [filters, setFilters] = useState({})

  useEffect(() => {
    dispatch(getBlogs(filters))
  }, [dispatch, filters])

  const handleSearch = (searchTerm) => {
    setFilters({ ...filters, search: searchTerm })
  }

  const handleFilter = (newFilters) => {
    setFilters({ ...filters, ...newFilters })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to BlogHub</h1>
        <p className="text-xl text-gray-600">Discover amazing stories and share your own</p>
      </div>

      <SearchBar onSearch={handleSearch} onFilter={handleFilter} />

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <FiLoader className="animate-spin text-4xl text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.length > 0 ? (
            blogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)
          ) : (
            <div className="col-span-full text-center py-20">
              <p className="text-xl text-gray-500">No blogs found</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Home
