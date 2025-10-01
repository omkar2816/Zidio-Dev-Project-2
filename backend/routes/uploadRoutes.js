import express from "express"
import multer from "multer"
import path from "path"
import { fileURLToPath } from "url"
import { dirname } from "path"
import fs from "fs"
import { protect } from "../middleware/authMiddleware.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const router = express.Router()

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads/images')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir)
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Invalid file type. Only JPG, PNG, GIF, WebP, and SVG files are allowed.'), false)
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
})

// @desc    Upload image
// @route   POST /api/upload/image
// @access  Private
router.post('/image', protect, upload.single('image'), (req, res) => {
  try {
    console.log('Upload request received')
    console.log('User:', req.user?.name || 'Anonymous')
    console.log('File:', req.file ? req.file.filename : 'No file')
    
    if (!req.file) {
      console.log('No file in request')
      return res.status(400).json({ message: 'No file uploaded' })
    }

    // Generate the URL for the uploaded file
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/images/${req.file.filename}`
    
    console.log('Generated image URL:', imageUrl)

    res.json({
      message: 'Image uploaded successfully',
      imageUrl: imageUrl,
      filename: req.file.filename
    })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ message: 'Failed to upload image' })
  }
})

// @desc    Upload avatar image
// @route   POST /api/upload/avatar
// @access  Private
router.post('/avatar', protect, upload.single('avatar'), async (req, res) => {
  try {
    console.log('Avatar upload request received')
    console.log('User:', req.user?.name || 'Anonymous')
    console.log('File:', req.file ? req.file.filename : 'No file')
    
    if (!req.file) {
      console.log('No file in request')
      return res.status(400).json({ message: 'No avatar file uploaded' })
    }

    // Generate the URL for the uploaded avatar
    const avatarUrl = `${req.protocol}://${req.get('host')}/uploads/images/${req.file.filename}`
    
    console.log('Generated avatar URL:', avatarUrl)

    // Update user's avatar in database
    const User = (await import('../models/User.js')).default
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id, 
      { avatar: avatarUrl },
      { new: true }
    ).select('-password')

    res.json({
      message: 'Avatar uploaded successfully',
      avatarUrl: avatarUrl,
      filename: req.file.filename,
      user: updatedUser
    })
  } catch (error) {
    console.error('Avatar upload error:', error)
    res.status(500).json({ message: 'Failed to upload avatar' })
  }
})

// @desc    Test upload endpoint (for debugging)
// @route   POST /api/upload/test
// @access  Public
router.post('/test', upload.single('image'), (req, res) => {
  try {
    console.log('Test upload request received')
    console.log('File:', req.file ? req.file.filename : 'No file')
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/images/${req.file.filename}`

    res.json({
      message: 'Test upload successful',
      imageUrl: imageUrl,
      filename: req.file.filename
    })
  } catch (error) {
    console.error('Test upload error:', error)
    res.status(500).json({ message: 'Failed to upload test image' })
  }
})

// Handle multer errors
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File size too large. Maximum size is 5MB.' })
    }
    return res.status(400).json({ message: error.message })
  }
  
  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({ message: error.message })
  }
  
  next(error)
})

export default router