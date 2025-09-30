import { useLocation } from "react-router-dom"
import { useSelector } from "react-redux"

function RouteDebugger() {
  const location = useLocation()
  const { user, isAuthenticated } = useSelector((state) => state.auth)

  return (
    <div className="fixed top-4 right-4 bg-black text-white p-4 rounded-lg text-sm z-50 max-w-xs">
      <h3 className="font-bold mb-2">Debug Info:</h3>
      <p><strong>Current Route:</strong> {location.pathname}</p>
      <p><strong>User Logged In:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
      <p><strong>User Name:</strong> {user?.name || 'Not logged in'}</p>
      <p><strong>User Role:</strong> {user?.role || 'N/A'}</p>
    </div>
  )
}

export default RouteDebugger