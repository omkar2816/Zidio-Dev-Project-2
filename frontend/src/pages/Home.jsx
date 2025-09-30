import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getBlogs } from "../store/slices/blogSlice"
import BlogCard from "../components/BlogCard"
import SearchBar from "../components/SearchBar"
import { useTheme } from "../contexts/ThemeContext"
import { 
  FiLoader, 
  FiTrendingUp, 
  FiUsers, 
  FiBookmark, 
  FiEdit3,
  FiArrowRight,
  FiStar 
} from "react-icons/fi"

function Home() {
  const dispatch = useDispatch()
  const { blogs, isLoading } = useSelector((state) => state.blog)
  const { isDark } = useTheme()
  const [filters, setFilters] = useState({})
  
  // Calculate real stats from blog data
  const stats = {
    totalBlogs: blogs.length,
    activeWriters: [...new Set(blogs.map(blog => blog.author?._id).filter(Boolean))].length,
    totalReads: blogs.reduce((total, blog) => total + (blog.viewsCount || 0), 0),
    featuredPosts: blogs.filter(blog => blog.featured).length
  }

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
    <div className="min-h-screen bg-theme-bg">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 pattern-dots opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center space-y-8">
            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-display font-bold tracking-tight">
                <span className="block text-theme-text">Welcome to</span>
                <span className="block gradient-text">BlogHub</span>
              </h1>
              <p className="text-xl lg:text-2xl text-theme-text-secondary max-w-3xl mx-auto leading-relaxed">
                Discover amazing stories, share your thoughts, and connect with a community of passionate writers and readers.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="btn-primary px-12 py-3 text-xl font-medium group min-w-[200px] flex items-center justify-center">
                <span>Start Writing</span>
                <FiEdit3 className="ml-3 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
              <button className="btn-secondary px-12 py-3 text-xl font-medium group min-w-[200px] flex items-center justify-center">
                <span>Explore Stories</span>
                <FiArrowRight className="ml-3 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto mt-16">
              <div className="text-center space-y-2">
                <div className="text-3xl lg:text-4xl font-display font-bold gradient-text">
                  {stats.totalBlogs.toLocaleString()}
                </div>
                <div className="flex items-center justify-center text-theme-text-secondary">
                  <FiBookmark className="w-4 h-4 mr-2" />
                  <span>Stories Published</span>
                </div>
              </div>
              
              <div className="text-center space-y-2">
                <div className="text-3xl lg:text-4xl font-display font-bold gradient-text">
                  {stats.activeWriters.toLocaleString()}
                </div>
                <div className="flex items-center justify-center text-theme-text-secondary">
                  <FiUsers className="w-4 h-4 mr-2" />
                  <span>Active Writers</span>
                </div>
              </div>
              
              <div className="text-center space-y-2">
                <div className="text-3xl lg:text-4xl font-display font-bold gradient-text">
                  {Math.floor(stats.totalReads / 1000)}K+
                </div>
                <div className="flex items-center justify-center text-theme-text-secondary">
                  <FiTrendingUp className="w-4 h-4 mr-2" />
                  <span>Total Reads</span>
                </div>
              </div>
              
              <div className="text-center space-y-2">
                <div className="text-3xl lg:text-4xl font-display font-bold gradient-text">
                  {stats.featuredPosts}
                </div>
                <div className="flex items-center justify-center text-theme-text-secondary">
                  <FiStar className="w-4 h-4 mr-2" />
                  <span>Featured Posts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Search and Filters */}
        <div className="mb-12">
          <SearchBar onSearch={handleSearch} onFilter={handleFilter} />
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="loading-spinner w-12 h-12"></div>
            <p className="text-theme-text-secondary animate-pulse">Loading amazing stories...</p>
          </div>
        ) : (
          /* Blog Grid */
          <div className="space-y-8">
            {blogs.length > 0 ? (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-display font-bold text-theme-text">
                    Latest Stories
                  </h2>
                  <span className="text-theme-text-secondary">
                    {blogs.length} {blogs.length === 1 ? 'story' : 'stories'} found
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {blogs.map((blog, index) => (
                    <div 
                      key={blog._id} 
                      className="animate-fade-in" 
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <BlogCard blog={blog} />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              /* Empty State */
              <div className="text-center py-32 space-y-6">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-full flex items-center justify-center">
                  <FiBookmark className="w-10 h-10 text-theme-text-secondary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-display font-bold text-theme-text">No stories found</h3>
                  <p className="text-theme-text-secondary max-w-md mx-auto">
                    Try adjusting your search filters or be the first to create a story on this topic!
                  </p>
                </div>
                <button className="btn-primary px-6 py-3">
                  Create First Story
                </button>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  )
}

export default Home
