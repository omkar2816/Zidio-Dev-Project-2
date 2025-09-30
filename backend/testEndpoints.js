// Test registration endpoint
import fetch from 'node-fetch'

const testRegistration = async () => {
  try {
    console.log("🧪 Testing user registration endpoint...")
    
    const testUser = {
      name: `Test User ${Date.now()}`,
      email: `testuser_${Date.now()}@example.com`,
      password: "password123"
    }
    
    console.log("📤 Sending registration request:", {
      name: testUser.name,
      email: testUser.email,
      passwordLength: testUser.password.length
    })
    
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser)
    })
    
    const data = await response.json()
    
    if (response.ok) {
      console.log("✅ Registration successful!")
      console.log("📋 Response data:", {
        id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
        hasToken: !!data.token
      })
    } else {
      console.log("❌ Registration failed:", data.message)
    }
    
  } catch (error) {
    console.error("❌ Network error:", error.message)
  }
}

// Test login as well
const testLogin = async () => {
  try {
    console.log("\n🔑 Testing user login endpoint...")
    
    const loginData = {
      email: "omkarkorgaonkar376@gmail.com", // Using existing user
      password: "123456" // You might need to adjust this password
    }
    
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData)
    })
    
    const data = await response.json()
    
    if (response.ok) {
      console.log("✅ Login successful!")
      console.log("📋 User data:", {
        id: data._id,
        name: data.name,
        email: data.email,
        role: data.role
      })
    } else {
      console.log("❌ Login failed:", data.message)
    }
    
  } catch (error) {
    console.error("❌ Network error:", error.message)
  }
}

// Run tests
testRegistration()
setTimeout(testLogin, 2000) // Wait 2 seconds before testing login