import { Routes, Route, Navigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { ThemeProvider } from "./contexts/ThemeContext"
import Navbar from "./components/Navbar"
import Sidebar from "./components/Sidebar"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import CreateBlog from "./pages/CreateBlog"
import EditBlog from "./pages/EditBlog"
import BlogDetails from "./pages/BlogDetails"
import Profile from "./pages/Profile"
import MyProfile from "./pages/MyProfile"
import Settings from "./pages/Settings"
import AdminPanel from "./pages/AdminPanel"
import AdminDashboard from "./pages/AdminDashboard"
import SuperAdminPanel from "./pages/SuperAdminPanel"
import SuperAdminDashboard from "./pages/SuperAdminDashboard"

function App() {
  const { user } = useSelector((state) => state.auth)

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-theme-bg transition-colors duration-300">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 min-h-screen">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
              <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
              <Route path="/create" element={user ? <CreateBlog /> : <Navigate to="/login" />} />
              <Route path="/edit/:id" element={user ? <EditBlog /> : <Navigate to="/login" />} />
              <Route path="/blog/:id" element={<BlogDetails />} />
              <Route path="/profile" element={user ? <MyProfile /> : <Navigate to="/login" />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" />} />
              <Route path="/admin" element={(user?.role === "admin" || user?.role === "superadmin") ? <AdminPanel /> : <Navigate to="/" />} />
              <Route path="/admin-dashboard" element={(user?.role === "admin" || user?.role === "superadmin") ? <AdminDashboard /> : <Navigate to="/" />} />
              <Route path="/superadmin" element={user?.role === "superadmin" ? <SuperAdminPanel /> : <Navigate to="/" />} />
              <Route path="/superadmin-dashboard" element={user?.role === "superadmin" ? <SuperAdminDashboard /> : <Navigate to="/" />} />
              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App
