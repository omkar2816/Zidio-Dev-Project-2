// Environment check script
import dotenv from "dotenv"
import fs from "fs"
import path from "path"

dotenv.config()

console.log("🔧 Environment Configuration Check")
console.log("================================\n")

// Check if .env file exists
const envPath = path.join(process.cwd(), '.env')
const envExists = fs.existsSync(envPath)
console.log(`📄 .env file exists: ${envExists ? 'YES' : 'NO'}`)

if (envExists) {
  try {
    const envContent = fs.readFileSync(envPath, 'utf8')
    const envLines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'))
    console.log(`📋 Environment variables found: ${envLines.length}`)
    
    envLines.forEach(line => {
      const [key] = line.split('=')
      console.log(`  - ${key}`)
    })
  } catch (error) {
    console.log("❌ Error reading .env file:", error.message)
  }
}

console.log("\n🔍 Required Environment Variables:")
console.log("==================================")

const requiredVars = [
  'MONGO_URI',
  'JWT_SECRET',
  'PORT'
]

requiredVars.forEach(varName => {
  const value = process.env[varName]
  const status = value ? '✅ SET' : '❌ MISSING'
  const display = value ? (varName === 'MONGO_URI' ? value.replace(/\/\/[^:]+:[^@]+@/, '//<credentials>@') : 
                          varName === 'JWT_SECRET' ? '<hidden>' : value) : 'undefined'
  console.log(`${varName}: ${status} - ${display}`)
})

console.log("\n🌐 Network Configuration:")
console.log("=========================")
console.log(`PORT: ${process.env.PORT || 5000}`)
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'development'}`)

console.log("\n📦 Package.json Scripts:")
console.log("========================")
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
  if (packageJson.scripts) {
    Object.entries(packageJson.scripts).forEach(([name, script]) => {
      console.log(`${name}: ${script}`)
    })
  }
} catch (error) {
  console.log("❌ Could not read package.json")
}