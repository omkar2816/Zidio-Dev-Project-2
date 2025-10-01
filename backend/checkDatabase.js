import mongoose from "mongoose"
import dotenv from "dotenv"
import Blog from "./models/Blog.js"
import User from "./models/User.js"

dotenv.config()

const checkDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("Connected to MongoDB")

    // Count documents
    const blogCount = await Blog.countDocuments()
    const userCount = await User.countDocuments()
    
    console.log(`\n=== DATABASE STATUS ===`)
    console.log(`Total blogs: ${blogCount}`)
    console.log(`Total users: ${userCount}`)

    // Get latest blogs
    const latestBlogs = await Blog.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 })
      .limit(5)

    console.log(`\n=== LATEST 5 BLOGS ===`)
    latestBlogs.forEach((blog, index) => {
      console.log(`${index + 1}. "${blog.title}" by ${blog.author?.name || 'Unknown'} (${blog.createdAt})`)
    })

    // Get all users
    const users = await User.find().select("name email role")
    console.log(`\n=== ALL USERS ===`)
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - ${user.role}`)
    })

    mongoose.connection.close()
  } catch (error) {
    console.error("Database check error:", error)
    process.exit(1)
  }
}

checkDatabase()