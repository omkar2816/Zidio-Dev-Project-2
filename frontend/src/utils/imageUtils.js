/**
 * Converts Google Photos sharing URLs to direct image URLs
 * @param {string} url - The Google Photos sharing URL
 * @returns {string} - Direct image URL or original URL if conversion fails
 */
export const convertGooglePhotosUrl = (url) => {
  if (!url) return url
  
  // Handle Google Drive sharing links and convert to direct view
  if (url.includes('drive.google.com/file/d/')) {
    const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
    if (fileIdMatch) {
      const fileId = fileIdMatch[1]
      return `https://drive.google.com/uc?export=view&id=${fileId}`
    }
  }
  
  // Handle other Google Drive formats
  if (url.includes('drive.google.com/open?id=')) {
    const fileIdMatch = url.match(/id=([a-zA-Z0-9_-]+)/)
    if (fileIdMatch) {
      const fileId = fileIdMatch[1]
      return `https://drive.google.com/uc?export=view&id=${fileId}`
    }
  }
  
  // For Google Photos sharing links, we need to provide a warning
  // These cannot be directly embedded due to CORS and authentication requirements
  if (url.includes('photos.app.goo.gl') || url.includes('photos.google.com')) {
    console.warn('Google Photos sharing links cannot be directly embedded. Please use a direct image URL or upload the file.')
    return url // Return original URL but it likely won't work
  }
  
  return url
}

/**
 * Checks if a URL is a Google Photos sharing link that won't work directly
 * @param {string} url - The URL to check
 * @returns {boolean} - True if it's a problematic Google Photos link
 */
export const isGooglePhotosShareLink = (url) => {
  if (!url) return false
  return url.includes('photos.app.goo.gl') || 
         (url.includes('photos.google.com') && !url.includes('googleusercontent.com'))
}

/**
 * Validates if a given URL is likely to be a valid image URL
 * @param {string} url - The URL to validate
 * @param {boolean} required - Whether the URL is required (default: false)
 * @returns {boolean} - True if valid or empty (when not required), false otherwise
 */
export const isValidImageUrl = (url, required = false) => {
  if (!url) return !required // Empty URL is valid only if not required
  
  try {
    new URL(url)
    
    // Special handling for Google Photos links - warn but don't reject
    if (isGooglePhotosShareLink(url)) {
      return true // Allow but will likely fail to load
    }
    
    // Handle Google Drive links
    if (url.includes('drive.google.com')) {
      return true
    }
    
    // More permissive validation - accept any URL that looks like it could be an image
    return /\.(jpg|jpeg|png|gif|webp|svg|bmp|tiff|ico)(\?.*)?$/i.test(url) || 
           url.includes('unsplash.com') || 
           url.includes('pexels.com') ||
           url.includes('pixabay.com') ||
           url.includes('images.') ||
           url.includes('img.') ||
           url.includes('cdn.') ||
           url.includes('amazonaws.com') ||
           url.includes('cloudinary.com') ||
           url.includes('googleusercontent.com') ||
           url.includes('dropbox.com') ||
           url.includes('onedrive.com') ||
           url.includes('imgur.com') ||
           url.includes('photobucket.com') ||
           url.includes('flickr.com') ||
           url.includes('githubusercontent.com') ||
           url.includes('/image') ||
           url.includes('/img') ||
           url.includes('/photo') ||
           // If it's a valid URL and doesn't obviously point to non-image content, allow it
           (!url.includes('.html') && !url.includes('.php') && !url.includes('.js') && !url.includes('.css'))
  } catch {
    return false
  }
}

/**
 * Validates image file type and size
 * @param {File} file - The file to validate
 * @param {number} maxSizeMB - Maximum file size in MB (default: 5)
 * @returns {Object} - Object with isValid boolean and error message if invalid
 */
export const validateImageFile = (file, maxSizeMB = 5) => {
  if (!file) {
    return { isValid: false, error: 'No file provided' }
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
  if (!allowedTypes.includes(file.type)) {
    return { 
      isValid: false, 
      error: 'Please select a valid image file (JPG, PNG, GIF, WebP, SVG)' 
    }
  }

  // Validate file size
  const maxSize = maxSizeMB * 1024 * 1024 // Convert MB to bytes
  if (file.size > maxSize) {
    return { 
      isValid: false, 
      error: `File size must be less than ${maxSizeMB}MB` 
    }
  }

  return { isValid: true, error: null }
}

/**
 * Gets the authentication token from localStorage
 * @returns {string|null} - The authentication token or null if not found
 */
export const getAuthToken = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"))
    return user?.token || null
  } catch (error) {
    console.error("Error getting auth token:", error)
    return null
  }
}

/**
 * Uploads an image file to the server
 * @param {File} file - The file to upload
 * @param {string} token - Authentication token (optional, will get from localStorage if not provided)
 * @returns {Promise<string>} - Promise that resolves to the image URL
 */
export const uploadImageFile = async (file, token = null) => {
  const authToken = token || getAuthToken()
  
  if (!authToken) {
    throw new Error('Authentication token is required. Please login again.')
  }

  const formData = new FormData()
  formData.append('image', file)

  console.log('Uploading file:', file.name)
  console.log('Token present:', !!authToken)

  const response = await fetch('http://localhost:5000/api/upload/image', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`
    },
    body: formData
  })

  console.log('Upload response status:', response.status)

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Upload failed:', errorText)
    
    if (response.status === 401) {
      throw new Error('Authentication failed. Please login again.')
    } else {
      throw new Error(`Upload failed: ${response.status} - ${errorText}`)
    }
  }

  const result = await response.json()
  console.log('Upload success:', result)
  return result.imageUrl
}