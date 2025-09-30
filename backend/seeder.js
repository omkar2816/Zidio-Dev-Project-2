import mongoose from "mongoose"
import dotenv from "dotenv"
import Category from "./models/Category.js"
import connectDB from "./config/db.js"

dotenv.config()

// Default categories to seed
const defaultCategories = [
  {
    name: "Technology",
    description: "Latest trends in technology and programming",
    color: "#3B82F6",
    icon: "💻",
    order: 1
  },
  {
    name: "Web Development",
    description: "Frontend, backend, and full-stack development",
    color: "#10B981",
    icon: "🌐",
    order: 2
  },
  {
    name: "Mobile Development",
    description: "iOS, Android, and cross-platform mobile apps",
    color: "#8B5CF6",
    icon: "📱",
    order: 3
  },
  {
    name: "Data Science",
    description: "Data analysis, machine learning, and AI",
    color: "#F59E0B",
    icon: "📊",
    order: 4
  },
  {
    name: "DevOps",
    description: "Deployment, CI/CD, and infrastructure",
    color: "#EF4444",
    icon: "⚙️",
    order: 5
  },
  {
    name: "Design",
    description: "UI/UX design and creative development",
    color: "#EC4899",
    icon: "🎨",
    order: 6
  },
  {
    name: "Business",
    description: "Entrepreneurship and business development",
    color: "#6366F1",
    icon: "💼",
    order: 7
  },
  {
    name: "Tutorial",
    description: "Step-by-step guides and tutorials",
    color: "#14B8A6",
    icon: "📚",
    order: 8
  }
]

const seedCategories = async () => {
  try {
    await connectDB()
    
    // Clear existing categories
    await Category.deleteMany({})
    console.log("Existing categories cleared")

    // Insert default categories one by one to trigger pre-save middleware
    const categories = []
    for (const categoryData of defaultCategories) {
      const category = await Category.create(categoryData)
      categories.push(category)
    }

    console.log(`${categories.length} categories seeded successfully:`)
    
    categories.forEach(category => {
      console.log(`- ${category.name} (${category.slug})`)
    })

    process.exit(0)
  } catch (error) {
    console.error("Error seeding categories:", error)
    process.exit(1)
  }
}

const seedSampleData = async () => {
  try {
    await connectDB()
    
    // This could be extended to seed sample users, blogs, etc.
    await seedCategories()
    
  } catch (error) {
    console.error("Error seeding sample data:", error)
    process.exit(1)
  }
}

// Run seeder based on command line arguments
if (process.argv[2] === "categories") {
  seedCategories()
} else if (process.argv[2] === "all") {
  seedSampleData()
} else {
  console.log("Usage:")
  console.log("npm run seed categories  - Seed categories only")
  console.log("npm run seed all         - Seed all sample data")
}