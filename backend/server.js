import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/db.js"
import authRoutes from "./routes/authRoutes.js"
import blogRoutes from "./routes/blogRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import commentRoutes from "./routes/commentRoutes.js"
import categoryRoutes from "./routes/categoryRoutes.js"
import likeRoutes from "./routes/likeRoutes.js"
import { errorHandler } from "./middleware/errorMiddleware.js"

dotenv.config()

const app = express()

// Connect to MongoDB
connectDB()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/blogs", blogRoutes)
app.use("/api/users", userRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/comments", commentRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/likes", likeRoutes)

// Health check
app.get("/", (req, res) => {
  res.json({ message: "MERN Blog API is running" })
})

// Error handler
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
