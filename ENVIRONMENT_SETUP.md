# Environment Variables Setup Guide

This document provides comprehensive information about setting up environment variables for the Zidio Dev Project 2.

## 📁 File Structure

The project uses separate environment files for different parts of the application:

```
/
├── .env.example                    # Project-wide configuration guide
├── backend/
│   └── .env.example               # Backend environment variables
└── frontend/
    └── .env.example               # Frontend environment variables
```

## 🚀 Quick Setup

### 1. Backend Environment Setup

```bash
# Navigate to backend directory
cd backend

# Copy the example file
cp .env.example .env

# Edit the .env file with your values
nano .env  # or use your preferred editor
```

**Required Variables:**
```env
MONGO_URI=mongodb://localhost:27017/blog-web-application
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
NODE_ENV=development
```

### 2. Frontend Environment Setup

```bash
# Navigate to frontend directory
cd frontend

# Copy the example file
cp .env.example .env

# Edit the .env file with your values
nano .env  # or use your preferred editor
```

**Required Variables:**
```env
VITE_API_URL=/api
VITE_APP_NAME=Blog Platform
```

## 🔧 Environment Variable Details

### Backend Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MONGO_URI` | ✅ | - | MongoDB connection string |
| `JWT_SECRET` | ✅ | - | Secret key for JWT token signing |
| `PORT` | ❌ | 5000 | Server port number |
| `NODE_ENV` | ❌ | development | Application environment |
| `FRONTEND_URL` | ❌ | http://localhost:5173 | Frontend URL for CORS |

### Frontend Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_URL` | ❌ | /api | Backend API URL |
| `VITE_APP_NAME` | ❌ | Blog Platform | Application name |
| `VITE_DEBUG` | ❌ | true | Enable debug mode |

## 🗄️ Database Setup

1. **Install MongoDB:**
   ```bash
   # On macOS with Homebrew
   brew install mongodb-community

   # On Ubuntu
   sudo apt install mongodb

   # On Windows - Download from MongoDB website
   ```

2. **Start MongoDB:**
   ```bash
   # macOS/Linux
   mongod

   # Windows (if installed as service)
   net start MongoDB
   ```

3. **Create Super Admin:**
   ```bash
   cd backend
   node scripts/createSuperAdmin.js
   ```

   **Default Super Admin Credentials:**
   - Email: `superadmin@bloghub.com`
   - Password: `SuperAdmin123!`

## 🔐 Security Best Practices

### JWT Secret Generation

Generate a secure JWT secret:

```bash
# Method 1: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Method 2: Using OpenSSL
openssl rand -hex 32

# Method 3: Using online generator (not recommended for production)
# Visit: https://generate-secret.vercel.app/32
```

### Environment-Specific Configuration

#### Development
```env
NODE_ENV=development
JWT_SECRET=dev-secret-key-not-for-production
MONGO_URI=mongodb://localhost:27017/blog-web-application-dev
```

#### Production
```env
NODE_ENV=production
JWT_SECRET=super-secure-production-secret-32-chars-minimum
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/blog-production
```

## 🌐 Deployment Configurations

### Vercel (Frontend)

Create `vercel.json` in frontend directory:
```json
{
  "env": {
    "VITE_API_URL": "https://your-backend-domain.com"
  }
}
```

### Heroku (Backend)

Set environment variables:
```bash
heroku config:set MONGO_URI="your-mongodb-uri"
heroku config:set JWT_SECRET="your-jwt-secret"
heroku config:set NODE_ENV="production"
```

### Railway (Backend)

Set environment variables in Railway dashboard:
```env
MONGO_URI=mongodb+srv://...
JWT_SECRET=your-secret
NODE_ENV=production
PORT=5000
```

## 🔍 Troubleshooting

### Common Issues

1. **MongoDB Connection Error:**
   ```
   Error: MongoNetworkError: failed to connect to server
   ```
   **Solution:** Ensure MongoDB is running and `MONGO_URI` is correct.

2. **JWT Secret Missing:**
   ```
   Error: JWT_SECRET is required
   ```
   **Solution:** Set `JWT_SECRET` in backend/.env file.

3. **CORS Error:**
   ```
   Error: Access to fetch blocked by CORS policy
   ```
   **Solution:** Update `FRONTEND_URL` in backend/.env or configure CORS properly.

4. **Vite Environment Variables Not Working:**
   ```
   Error: import.meta.env.VITE_API_URL is undefined
   ```
   **Solution:** Ensure variables start with `VITE_` prefix in frontend/.env.

### Validation Commands

Check if environment variables are loaded correctly:

```bash
# Backend
cd backend
node checkEnv.js

# Frontend (in browser console)
console.log(import.meta.env)
```

## 📝 .gitignore Configuration

Ensure your `.gitignore` includes:

```gitignore
# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Backend specific
backend/.env
backend/.env.*

# Frontend specific
frontend/.env
frontend/.env.*
```

## 🔄 Environment Variable Loading Order

### Backend (Node.js)
1. System environment variables
2. `.env` file in backend directory
3. Default values in code

### Frontend (Vite)
1. System environment variables
2. `.env.local` (ignored by git)
3. `.env.[mode].local` (ignored by git)
4. `.env.[mode]`
5. `.env`

## 📚 Additional Resources

- [Vite Environment Variables Guide](https://vitejs.dev/guide/env-and-mode.html)
- [Node.js Environment Variables Best Practices](https://nodejs.org/en/learn/command-line/how-to-read-environment-variables-from-nodejs)
- [MongoDB Connection String Format](https://docs.mongodb.com/manual/reference/connection-string/)
- [JWT Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)

## 🆘 Support

If you encounter issues with environment setup:

1. Check this documentation
2. Verify all required variables are set
3. Ensure MongoDB is running
4. Check console/server logs for specific errors
5. Create an issue in the project repository