const API_URL = '/api/users'

// Get user profile
const getUserProfile = async (userId, token = null) => {
  const headers = {}
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  const response = await fetch(`${API_URL}/${userId}`, {
    headers
  })
  
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to fetch user profile')
  }
  
  return response.json()
}

// Follow a user
const followUser = async (userId, token) => {
  const response = await fetch(`${API_URL}/${userId}/follow`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to follow user')
  }
  
  return response.json()
}

// Unfollow a user
const unfollowUser = async (userId, token) => {
  const response = await fetch(`${API_URL}/${userId}/follow`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to unfollow user')
  }
  
  return response.json()
}

// Update user profile
const updateUserProfile = async (userId, userData, token) => {
  const response = await fetch(`${API_URL}/${userId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  })
  
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to update profile')
  }
  
  return response.json()
}

// Upload avatar
const uploadAvatar = async (file, token) => {
  const formData = new FormData()
  formData.append('avatar', file)
  
  const response = await fetch('/api/upload/avatar', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  })
  
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to upload avatar')
  }
  
  return response.json()
}

// Get user settings
const getUserSettings = async (token) => {
  const response = await fetch('/api/users/settings', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to fetch settings')
  }
  
  return response.json()
}

// Update user settings
const updateUserSettings = async (settings, token) => {
  const response = await fetch('/api/users/settings', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(settings)
  })
  
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to update settings')
  }
  
  return response.json()
}

// Export user data
const exportUserData = async (token) => {
  const response = await fetch('/api/users/export', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to export data')
  }
  
  // Return blob for download
  const blob = await response.blob()
  const contentDisposition = response.headers.get('Content-Disposition')
  const filename = contentDisposition
    ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
    : 'user-data.json'
  
  return { blob, filename }
}

// Delete user account
const deleteUserAccount = async (password, token) => {
  const response = await fetch('/api/users/account', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ password })
  })
  
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to delete account')
  }
  
  return response.json()
}

const userService = {
  getUserProfile,
  followUser,
  unfollowUser,
  updateUserProfile,
  uploadAvatar,
  getUserSettings,
  updateUserSettings,
  exportUserData,
  deleteUserAccount
}

export default userService