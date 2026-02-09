// routes/ProtectedRoute.jsx - reusable component
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

function ProtectedRoute() {
  const { user, loading } = useContext(AuthContext)
  const location = useLocation()

  if (loading) return <div>Loading...</div>  

  if (!user) {
    // حفظ المكان اللي كان رايحله عشان يرجعله بعد login
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />  // هنا بيظهر الchildren (الpage نفسها)
}

export default ProtectedRoute