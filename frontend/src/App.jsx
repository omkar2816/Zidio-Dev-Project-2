import { Routes, Route, Navigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { ThemeProvider } from "./contexts/ThemeContext"
import { SidebarProvider } from "./contexts/SidebarContext"
import LenisProvider from "./components/LenisProvider"
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
import AdminDashboard from "./pages/AdminDashboard"
import SuperAdminDashboard from "./pages/SuperAdminDashboard"
import Bookmarks from "./pages/Bookmarks"

function App() {
  const { user } = useSelector((state) => state.auth)

  return (
    <LenisProvider>
      <ThemeProvider>
        <SidebarProvider>
          <div className="min-h-screen bg-theme-bg transition-colors duration-300">
          <Navbar />
          <div className="relative">
            <Sidebar />
            <main className="relative min-h-screen pt-24 pl-4">
              {/* Background gradient to match Home page theme */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 pointer-events-none"></div>
              <div className="relative z-10">
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
              <Route path="/bookmarks" element={user ? <Bookmarks /> : <Navigate to="/login" />} />
              <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" />} />
              <Route path="/admin" element={(user?.role === "admin" || user?.role === "superadmin") ? <AdminDashboard /> : <Navigate to="/" />} />
              <Route path="/admin-dashboard" element={(user?.role === "admin" || user?.role === "superadmin") ? <AdminDashboard /> : <Navigate to="/" />} />
              <Route path="/superadmin" element={user?.role === "superadmin" ? <SuperAdminDashboard /> : <Navigate to="/" />} />
              <Route path="/superadmin-dashboard" element={user?.role === "superadmin" ? <SuperAdminDashboard /> : <Navigate to="/" />} />
                  {/* Fallback route */}
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </div>
            </main>
          </div>
        </div>
        </SidebarProvider>
      </ThemeProvider>
    </LenisProvider>
  )
}

export default App
