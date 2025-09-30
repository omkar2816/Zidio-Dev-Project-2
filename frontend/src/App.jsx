import { Routes, Route, Navigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { ThemeProvider } from "./contexts/ThemeContext"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import CreateBlog from "./pages/CreateBlog"
import EditBlog from "./pages/EditBlog"
import BlogDetails from "./pages/BlogDetails"
import Profile from "./pages/Profile"
import AdminPanel from "./pages/AdminPanel"

function App() {
  const { user } = useSelector((state) => state.auth)

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-theme-bg transition-colors duration-300">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/create" element={user ? <CreateBlog /> : <Navigate to="/login" />} />
          <Route path="/edit/:id" element={user ? <EditBlog /> : <Navigate to="/login" />} />
          <Route path="/blog/:id" element={<BlogDetails />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/admin" element={user?.role === "admin" ? <AdminPanel /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </ThemeProvider>
  )
}

export default App
