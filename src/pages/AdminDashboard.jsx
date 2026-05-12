import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/AdminDashboard.css'

function AdminDashboard() {
  const navigate = useNavigate()

  useEffect(() => {
    const isAuth = localStorage.getItem('adminAuth')
    if (!isAuth) {
      navigate('/admin/login')
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    navigate('/admin/login')
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
      <div className="dashboard-content">
        <p>Welcome, Admin. Product management will appear here in Phase 2.</p>
        <p>✅ You are successfully logged in (frontend mock).</p>
      </div>
    </div>
  )
}

export default AdminDashboard