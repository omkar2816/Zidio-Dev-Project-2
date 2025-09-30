"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { getBlogs } from "../store/slices/blogSlice"
import BlogCard from "../components/BlogCard"
import SearchBar from "../components/SearchBar"
import { FiLoader, FiTrendingUp, FiUsers, FiBookOpen, FiStar, FiArrowRight, FiFeather } from "react-icons/fi"

function Home() {
  const dispatch = useDispatch()
  const { blogs, isLoading } = useSelector((state) => state.blog)
  const { user } = useSelector((state) => state.auth)
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

  const stats = [
    { icon: FiBookOpen, label: "Total Articles", value: blogs?.length || 0, color: "blue" },
    { icon: FiUsers, label: "Active Writers", value: "50+", color: "purple" },
    { icon: FiTrendingUp, label: "Monthly Views", value: "10K+", color: "green" },
    { icon: FiStar, label: "Reader Rating", value: "4.9", color: "yellow" }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-900/20 py-20">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-600/10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            {/* Main Heading */}
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium">
                  <FiFeather className="w-4 h-4" />
                  <span>Modern Blogging Platform</span>
                </div>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-display font-bold">
                <span className="text-gray-900 dark:text-white">Share Your</span>
                <br />
                <span className="text-gradient animate-gradient">Amazing Stories</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Discover incredible stories, connect with passionate writers, and share your own journey with a community that celebrates creativity.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {!user ? (
                <>
                  <Link
                    to="/register"
                    className="btn btn-primary px-8 py-4 text-lg font-semibold group"
                  >
                    Start Writing Today
                    <FiArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/login"
                    className="btn btn-secondary px-8 py-4 text-lg font-semibold"
                  >
                    Explore Stories
                  </Link>
                </>
              ) : (
                <Link
                  to="/create"
                  className="btn btn-primary px-8 py-4 text-lg font-semibold group"
                >
                  Create New Blog
                  <FiArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center space-y-2 group">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-${stat.color}-100 dark:bg-${stat.color}-900/30 text-${stat.color}-600 dark:text-${stat.color}-400 group-hover:scale-110 transition-transform`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-12 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SearchBar onSearch={handleSearch} onFilter={handleFilter} />
        </div>
      </section>

      {/* Blog Posts Section */}
      {/* Blog Posts Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
              Latest Stories
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Explore our collection of engaging articles from talented writers around the world.
            </p>
          </div>

          {isLoading ? (
            <div className="flex flex-col justify-center items-center py-20">
              <div className="loading-spinner w-12 h-12 mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading amazing stories...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.length > 0 ? (
                blogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)
              ) : (
                <div className="col-span-full text-center py-20">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No stories yet</h3>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">Be the first to share an amazing story!</p>
                  {user && (
                    <Link
                      to="/create"
                      className="btn btn-primary px-6 py-3"
                    >
                      Write Your First Blog
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Home
