import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import User from "../models/User.js"
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables from the backend directory
dotenv.config({ path: path.join(__dirname, '../.env') })

const createSuperAdmin = async () => {
  try {
    // Debug environment variables
    console.log("Environment check:")
    console.log("- NODE_ENV:", process.env.NODE_ENV || "not set")
    console.log("- MONGO_URI:", process.env.MONGO_URI ? "Found" : "Not found")
    console.log("- JWT_SECRET:", process.env.JWT_SECRET ? "Found" : "Not found")
    
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/blog-app"
    console.log("Connecting to MongoDB:", mongoUri)
    
    await mongoose.connect(mongoUri)
    console.log("Connected to MongoDB")

    // Check if superadmin already exists
    const existingSuperAdmin = await User.findOne({ role: 'superadmin' })
    if (existingSuperAdmin) {
      console.log("Super admin already exists:", existingSuperAdmin.email)
      return
    }

    // Create superadmin user
    const hashedPassword = await bcrypt.hash("SuperAdmin123!", 12)
    
    const superAdmin = new User({
      name: "Super Administrator",
      email: "superadmin@bloghub.com",
      password: hashedPassword,
      role: "superadmin",
      isActive: true,
      emailVerified: true
    })

    await superAdmin.save()
    
    console.log("✅ Super admin created successfully!")
    console.log("Email: superadmin@bloghub.com")
    console.log("Password: SuperAdmin123!")
    console.log("Role: superadmin")
    
    // Also create a test admin user
    const existingAdmin = await User.findOne({ role: 'admin', email: 'admin@bloghub.com' })
    if (!existingAdmin) {
      const adminHashedPassword = await bcrypt.hash("Admin123!", 12)
      
      const admin = new User({
        name: "Test Administrator",
        email: "admin@bloghub.com",
        password: adminHashedPassword,
        role: "admin",
        isActive: true,
        emailVerified: true
      })

      await admin.save()
      console.log("✅ Test admin created successfully!")
      console.log("Email: admin@bloghub.com")
      console.log("Password: Admin123!")
      console.log("Role: admin")
    }

    // Create a regular test user
    const existingUser = await User.findOne({ role: 'user', email: 'user@bloghub.com' })
    if (!existingUser) {
      const userHashedPassword = await bcrypt.hash("User123!", 12)
      
      const regularUser = new User({
        name: "Test User",
        email: "user@bloghub.com",
        password: userHashedPassword,
        role: "user",
        isActive: true,
        emailVerified: true
      })

      await regularUser.save()
      console.log("✅ Test user created successfully!")
      console.log("Email: user@bloghub.com")
      console.log("Password: User123!")
      console.log("Role: user")
    }

  } catch (error) {
    console.error("Error creating users:", error.message)
  } finally {
    await mongoose.connection.close()
    console.log("Database connection closed")
    process.exit(0)
  }
}

createSuperAdmin()