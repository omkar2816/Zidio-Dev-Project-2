import mongoose from "mongoose"
import dotenv from "dotenv"
import Blog from "./models/Blog.js"

dotenv.config()

const checkIndexes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("Connected to MongoDB")

    // Get all indexes on the blogs collection
    const indexes = await Blog.collection.getIndexes()
    console.log("Indexes on blogs collection:")
    console.log(JSON.stringify(indexes, null, 2))

    mongoose.connection.close()
  } catch (error) {
    console.error("Error checking indexes:", error)
    process.exit(1)
  }
}

checkIndexes()