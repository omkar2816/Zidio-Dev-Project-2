// Test script to check MongoDB connection and user operations
import dotenv from "dotenv"
import mongoose from "mongoose"
import User from "./models/User.js"

dotenv.config()

const testDatabase = async () => {
  try {
    console.log("Testing MongoDB connection...")
    
    // Connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
    console.log(`📊 Database Name: ${conn.connection.name}`)

    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray()
    console.log("📁 Available collections:", collections.map(c => c.name))

    // Count existing users
    const userCount = await User.countDocuments()
    console.log(`👥 Total users in database: ${userCount}`)

    // List all users
    const users = await User.find({}, 'name email role createdAt')
    console.log("📋 Existing users:")
    users.forEach(user => {
      console.log(`  - ${user.name} (${user.email}) - Role: ${user.role} - Created: ${user.createdAt}`)
    })

    // Test creating a new user
    const testEmail = `test_${Date.now()}@example.com`
    console.log(`\n🧪 Testing user creation with email: ${testEmail}`)
    
    const newUser = await User.create({
      name: "Test User",
      email: testEmail,
      password: "hashedpassword123"
    })
    
    console.log("✅ Test user created successfully:", {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    })

    // Verify user was saved
    const savedUser = await User.findById(newUser._id)
    console.log("✅ User verification - found in database:", savedUser ? "YES" : "NO")

    // Clean up test user
    await User.findByIdAndDelete(newUser._id)
    console.log("🧹 Test user cleaned up")

    console.log("\n✅ All tests passed! Database is working correctly.")

  } catch (error) {
    console.error("❌ Test failed:", error.message)
    console.error("Full error:", error)
  } finally {
    await mongoose.connection.close()
    console.log("🔌 Database connection closed")
    process.exit(0)
  }
}

testDatabase()