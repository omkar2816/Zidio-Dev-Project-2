import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"
import { dirname } from "path"
import connectDB from "./config/db.js"
import authRoutes from "./routes/authRoutes.js"
import blogRoutes from "./routes/blogRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import adminRequestRoutes from "./routes/adminRequestRoutes.js"
import uploadRoutes from "./routes/uploadRoutes.js"
import { errorHandler } from "./middleware/errorMiddleware.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config()

const app = express()

// Connect to MongoDB
connectDB()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/blogs", blogRoutes)
app.use("/api/users", userRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/admin-request", adminRequestRoutes)
app.use("/api/upload", uploadRoutes)

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
