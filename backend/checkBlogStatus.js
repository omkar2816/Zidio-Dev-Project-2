import mongoose from "mongoose"
import dotenv from "dotenv"
import Blog from "./models/Blog.js"
import User from "./models/User.js"

dotenv.config()

const checkBlogStatus = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("Connected to MongoDB")

    // Get all blogs with their status
    const blogs = await Blog.find({}).select('title status author slug publishedAt createdAt').populate('author', 'name')
    
    console.log("All blogs in database:")
    blogs.forEach((blog, index) => {
      console.log(`${index + 1}. "${blog.title}"`)
      console.log(`   Status: ${blog.status || 'undefined'}`)
      console.log(`   Author: ${blog.author?.name}`)
      console.log(`   Slug: ${blog.slug || 'undefined'}`)
      console.log(`   Published At: ${blog.publishedAt || 'undefined'}`)
      console.log(`   Created At: ${blog.createdAt}`)
      console.log('---')
    })

    // Count by status
    const publishedCount = await Blog.countDocuments({ status: 'published' })
    const draftCount = await Blog.countDocuments({ status: 'draft' })
    const undefinedStatusCount = await Blog.countDocuments({ status: { $exists: false } })
    
    console.log(`Published blogs: ${publishedCount}`)
    console.log(`Draft blogs: ${draftCount}`)
    console.log(`Blogs without status: ${undefinedStatusCount}`)

    mongoose.connection.close()
  } catch (error) {
    console.error("Error checking blog status:", error)
    process.exit(1)
  }
}

checkBlogStatus()