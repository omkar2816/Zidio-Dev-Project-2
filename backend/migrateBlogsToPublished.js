import mongoose from "mongoose"
import dotenv from "dotenv"
import Blog from "./models/Blog.js"
import User from "./models/User.js"

dotenv.config()

const migrateBlogsToPublished = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("Connected to MongoDB")

    // Get all blogs that need migration
    const blogsToUpdate = await Blog.find({})
    
    console.log(`Found ${blogsToUpdate.length} blogs to potentially update`)

    for (let blog of blogsToUpdate) {
      let updated = false
      
      // Update status to published if not set
      if (blog.status !== 'published') {
        blog.status = 'published'
        blog.publishedAt = blog.publishedAt || blog.createdAt
        updated = true
        console.log(`Updated status for blog: "${blog.title}"`)
      }
      
      // Generate slug if missing
      if (!blog.slug) {
        // Generate slug from title
        const slug = blog.title
          .toLowerCase()
          .replace(/[^a-z0-9 -]/g, '') // Remove special characters
          .replace(/\s+/g, '-') // Replace spaces with hyphens
          .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
          .trim('-') // Remove leading/trailing hyphens
        
        // Add timestamp to ensure uniqueness
        const timestamp = Date.now()
        blog.slug = `${slug}-${timestamp}`
        updated = true
        console.log(`Generated slug for blog: "${blog.title}" -> "${blog.slug}"`)
      }
      
      if (updated) {
        await blog.save()
        console.log(`Saved updates for blog: "${blog.title}"`)
      }
    }

    // Verify the updates
    const updatedBlogs = await Blog.find({}).select('title status slug publishedAt')
    console.log("\n=== AFTER MIGRATION ===")
    updatedBlogs.forEach((blog, index) => {
      console.log(`${index + 1}. "${blog.title}"`)
      console.log(`   Status: ${blog.status}`)
      console.log(`   Slug: ${blog.slug}`)
      console.log(`   Published At: ${blog.publishedAt}`)
      console.log('---')
    })

    const publishedCount = await Blog.countDocuments({ status: 'published' })
    console.log(`\nTotal published blogs: ${publishedCount}`)

    mongoose.connection.close()
    console.log("Migration completed successfully!")
  } catch (error) {
    console.error("Error during migration:", error)
    process.exit(1)
  }
}

migrateBlogsToPublished()