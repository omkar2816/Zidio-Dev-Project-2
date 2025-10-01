import mongoose from "mongoose"
import dotenv from "dotenv"
import Blog from "./models/Blog.js"
import User from "./models/User.js"

dotenv.config()

const createTestBlog = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("Connected to MongoDB")

    // Find a user to assign as author
    const user = await User.findOne()
    if (!user) {
      console.log("No users found in database")
      return
    }

    console.log(`Using user: ${user.name} (${user._id})`)

    const testBlogData = {
      title: "Test Blog - " + new Date().toISOString(),
      content: "<p>This is a test blog post created directly via MongoDB to verify the database connection and blog creation process.</p><p>It includes some HTML content to test the rich text editor integration.</p>",
      category: "Technology",
      tags: ["test", "mongodb", "blog"],
      author: user._id,
      image: "https://via.placeholder.com/800x400"
    }

    console.log("Creating test blog with data:", testBlogData)

    const blog = await Blog.create(testBlogData)
    console.log("Blog created successfully!")
    console.log("Blog ID:", blog._id)
    console.log("Blog Title:", blog.title)

    // Verify by fetching it back
    const createdBlog = await Blog.findById(blog._id).populate("author", "name email")
    console.log("Verified blog from DB:", {
      id: createdBlog._id,
      title: createdBlog.title,
      author: createdBlog.author.name,
      createdAt: createdBlog.createdAt
    })

    // Count total blogs
    const totalBlogs = await Blog.countDocuments()
    console.log("Total blogs in database now:", totalBlogs)

    mongoose.connection.close()
  } catch (error) {
    console.error("Error creating test blog:", error)
    process.exit(1)
  }
}

createTestBlog()