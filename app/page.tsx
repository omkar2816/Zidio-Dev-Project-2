import { FiDownload, FiTerminal, FiDatabase, FiServer, FiCode } from "react-icons/fi"

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-5xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-2xl mb-6">
            <FiCode className="text-4xl text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">MERN Blogging Platform</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A full-stack blogging platform built with MongoDB, Express, React (Vite), and Node.js
          </p>
        </div>

        {/* Alert Box */}
        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg mb-8">
          <div className="flex items-start">
            <FiTerminal className="text-blue-600 text-2xl mr-4 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">This project runs locally</h3>
              <p className="text-blue-800">
                This is a full MERN stack application with a separate backend server and database. Download the project
                and follow the setup instructions below to run it on your machine.
              </p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">✨ Frontend Features</h3>
            <ul className="space-y-2 text-gray-600">
              <li>⚡ Vite + React 18 for blazing fast development</li>
              <li>🎨 Tailwind CSS for modern styling</li>
              <li>🔄 Redux Toolkit for state management</li>
              <li>✍️ React Quill rich text editor</li>
              <li>📱 Fully responsive design</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">🔧 Backend Features</h3>
            <ul className="space-y-2 text-gray-600">
              <li>🔐 JWT authentication with bcrypt</li>
              <li>👥 Role-based access (User/Admin)</li>
              <li>📝 Complete CRUD operations</li>
              <li>💬 Comments & likes system</li>
              <li>🔍 Search and filter functionality</li>
            </ul>
          </div>
        </div>

        {/* Setup Instructions */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">🚀 Quick Start Guide</h2>

          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                1
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <FiDownload className="mr-2" />
                  Download the Project
                </h3>
                <p className="text-gray-600 mb-2">
                  Click the three dots (•••) in the top right corner and select "Download ZIP"
                </p>
                <div className="bg-gray-50 p-3 rounded-lg font-mono text-sm">
                  Or push to GitHub and clone from there
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                2
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <FiTerminal className="mr-2" />
                  Install Dependencies
                </h3>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                  <div>cd mern-blog-platform</div>
                  <div>npm run install-all</div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                3
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <FiDatabase className="mr-2" />
                  Setup Environment Variables
                </h3>
                <p className="text-gray-600 mb-3">Create backend/.env file:</p>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <div>PORT=5000</div>
                  <div>MONGO_URI=your_mongodb_connection_string</div>
                  <div>JWT_SECRET=your_jwt_secret_key</div>
                  <div>NODE_ENV=development</div>
                </div>
                <p className="text-gray-600 mt-3 mb-2">Create frontend/.env file:</p>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                  <div>VITE_API_URL=http://localhost:5000/api</div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                4
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <FiServer className="mr-2" />
                  Run the Application
                </h3>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                  <div className="mb-2"># Run both frontend and backend:</div>
                  <div>npm run dev</div>
                  <div className="mt-4 mb-2"># Or run separately:</div>
                  <div>npm run client # Frontend on http://localhost:5173</div>
                  <div>npm run server # Backend on http://localhost:5000</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Database Setup */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🗄️ MongoDB Setup</h2>
          <div className="space-y-3 text-gray-700">
            <p>
              <strong>Option 1: MongoDB Atlas (Recommended)</strong>
            </p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>
                Go to{" "}
                <a href="https://www.mongodb.com/cloud/atlas" className="text-blue-600 hover:underline">
                  MongoDB Atlas
                </a>
              </li>
              <li>Create a free cluster</li>
              <li>Whitelist your IP address (0.0.0.0/0 for development)</li>
              <li>Create a database user</li>
              <li>Get your connection string and add it to backend/.env</li>
            </ol>
            <p className="mt-4">
              <strong>Option 2: Local MongoDB</strong>
            </p>
            <p className="ml-4">Install MongoDB locally and use: mongodb://localhost:27017/blog-platform</p>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">🛠️ Tech Stack</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Frontend</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• React 18 with Vite</li>
                <li>• Redux Toolkit</li>
                <li>• React Router v6</li>
                <li>• Tailwind CSS</li>
                <li>• React Quill</li>
                <li>• Axios</li>
                <li>• React Hot Toast</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Backend</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Node.js + Express</li>
                <li>• MongoDB + Mongoose</li>
                <li>• JWT Authentication</li>
                <li>• Bcrypt.js</li>
                <li>• CORS</li>
                <li>• Express Async Handler</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Deployment */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🚢 Deployment</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Frontend (Netlify/Vercel)</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 mb-2">Build command:</p>
                <code className="text-sm bg-gray-900 text-green-400 px-3 py-1 rounded">
                  cd frontend && npm run build
                </code>
                <p className="text-gray-600 mt-3 mb-2">Publish directory:</p>
                <code className="text-sm bg-gray-900 text-green-400 px-3 py-1 rounded">frontend/dist</code>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Backend (Render)</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 mb-2">Build command:</p>
                <code className="text-sm bg-gray-900 text-green-400 px-3 py-1 rounded">cd backend && npm install</code>
                <p className="text-gray-600 mt-3 mb-2">Start command:</p>
                <code className="text-sm bg-gray-900 text-green-400 px-3 py-1 rounded">cd backend && npm start</code>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-600">
          <p>Built with ❤️ using the MERN stack</p>
          <p className="mt-2">For questions or issues, check the README.md file in the project</p>
        </div>
      </div>
    </div>
  )
}
