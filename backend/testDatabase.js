import mongoose from "mongoose"
import dotenv from "dotenv"
import Blog from "./models/Blog.js"
import User from "./models/User.js"

dotenv.config()

const testDatabaseOperations = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI)
    console.log("✅ Connected to MongoDB")

    // Test 1: Check if users exist
    const userCount = await User.countDocuments()
    console.log(`✅ Found ${userCount} users in database`)

    // Test 2: Check if blogs exist
    const blogCount = await Blog.countDocuments()
    console.log(`✅ Found ${blogCount} blogs in database`)

    // Test 3: Get a sample user (to test avatar field)
    const sampleUser = await User.findOne()
    if (sampleUser) {
      console.log("✅ Sample user found:")
      console.log(`   - Name: ${sampleUser.name}`)
      console.log(`   - Email: ${sampleUser.email}`)
      console.log(`   - Avatar: ${sampleUser.avatar || 'No avatar set'}`)
    }

    // Test 4: Get a sample blog (to test image field)
    const sampleBlog = await Blog.findOne().populate('author', 'name email avatar')
    if (sampleBlog) {
      console.log("✅ Sample blog found:")
      console.log(`   - Title: ${sampleBlog.title}`)
      console.log(`   - Author: ${sampleBlog.author?.name || 'Unknown'}`)
      console.log(`   - Image: ${sampleBlog.image || 'No image set'}`)
      console.log(`   - Category: ${sampleBlog.category}`)
    }

    console.log("✅ All database tests passed!")

  } catch (error) {
    console.error("❌ Database test failed:", error)
  } finally {
    await mongoose.disconnect()
    console.log("✅ Disconnected from MongoDB")
    process.exit(0)
  }
}

testDatabaseOperations()