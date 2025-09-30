# MERN Blogging Platform

A full-stack blogging platform built with MongoDB, Express, React (Vite), and Node.js.

## Features

- 🔐 JWT Authentication & Authorization
- 📝 Rich Text Editor (React Quill)
- 💬 Comments & Likes System
- 🔍 Search & Filter Blogs
- 👤 User Profiles
- 🛡️ Admin Dashboard
- 📱 Fully Responsive Design
- 🎨 Modern UI with Tailwind CSS

## Tech Stack

**Frontend:**
- Vite + React 18
- Redux Toolkit for state management
- Tailwind CSS for styling
- React Quill for rich text editing
- Axios for API calls

**Backend:**
- Node.js + Express
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- Cloudinary for image uploads
- Multer for file handling

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB
- Cloudinary account (optional, for image uploads)

### Setup

1. **Clone and Install Dependencies**
   \`\`\`bash
   npm run install-all
   \`\`\`

2. **Backend Environment Variables**
   Create `backend/.env` file:
   \`\`\`
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   NODE_ENV=development
   \`\`\`

3. **Frontend Environment Variables**
   Create `frontend/.env` file:
   \`\`\`
   VITE_API_URL=http://localhost:5000/api
   \`\`\`

4. **Run the Application**
   \`\`\`bash
   npm run dev
   \`\`\`

   Or run separately:
   - Frontend: `npm run client` (http://localhost:5173)
   - Backend: `npm run server` (http://localhost:5000)

## Project Structure

\`\`\`
mern-blog-platform/
├── frontend/                 # Vite + React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── store/           # Redux store
│   │   ├── services/        # API services
│   │   └── utils/           # Utility functions
│   └── package.json
├── backend/                 # Express backend
│   ├── controllers/         # Route controllers
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── config/             # Configuration files
│   └── package.json
└── package.json            # Root package.json
\`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Blogs
- `GET /api/blogs` - Get all blogs (with search & filters)
- `GET /api/blogs/:id` - Get single blog
- `POST /api/blogs` - Create blog (protected)
- `PUT /api/blogs/:id` - Update blog (protected)
- `DELETE /api/blogs/:id` - Delete blog (protected)
- `POST /api/blogs/:id/like` - Like/unlike blog (protected)

### Comments
- `POST /api/blogs/:id/comments` - Add comment (protected)
- `DELETE /api/comments/:id` - Delete comment (protected)

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile (protected)

### Admin
- `GET /api/admin/users` - Get all users (admin only)
- `DELETE /api/admin/users/:id` - Delete user (admin only)
- `DELETE /api/admin/blogs/:id` - Delete any blog (admin only)

## Deployment

### Frontend (Netlify/Vercel)
1. Build: `cd frontend && npm run build`
2. Deploy the `frontend/dist` folder
3. Set environment variable: `VITE_API_URL`

### Backend (Render)
1. Connect your GitHub repository
2. Set build command: `cd backend && npm install`
3. Set start command: `cd backend && npm start`
4. Add environment variables from `.env`

### Database (MongoDB Atlas)
1. Create a free cluster
2. Whitelist IP addresses
3. Get connection string and add to backend `.env`

## Default Admin Account

After first run, you can create an admin account by:
1. Register a normal user
2. Manually update the user's role to "admin" in MongoDB

## Testing

Use Postman to test API endpoints:
- Import the API collection (if provided)
- Set up environment variables
- Test authentication flow
- Test CRUD operations

## License

MIT
