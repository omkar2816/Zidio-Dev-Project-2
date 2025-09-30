import mongoose from "mongoose"

const connectDB = async () => {
  try {
    console.log("Attempting to connect to MongoDB...")
    console.log("MONGO_URI:", process.env.MONGO_URI ? "Set" : "Not set")
    
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log(`MongoDB Connected: ${conn.connection.host}`)
    console.log(`Database Name: ${conn.connection.name}`)
    
    // List collections to verify connection
    const collections = await mongoose.connection.db.listCollections().toArray()
    console.log("Available collections:", collections.map(c => c.name))
    
  } catch (error) {
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }
}

export default connectDB
