import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/AdminDashboard.css'

function AdminDashboard() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const isAuth = localStorage.getItem('adminAuth')
    if (!isAuth) {
      navigate('/admin/login')
      return
    }
    // Load orders from localStorage
    const storedOrders = JSON.parse(localStorage.getItem('designersVaultOrders') || '[]')
    setOrders(storedOrders)
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

      <div className="dashboard-section">
        <h2>Order Management</h2>
        {orders.length === 0 ? (
          <p>No orders placed yet.</p>
        ) : (
          <div className="orders-table">
            <table>
              <thead>
                <tr><th>Order ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.customerName}</td>
                    <td>₦{order.total.toLocaleString()}</td>
                    <td><span className="status-badge">{order.status}</span></td>
                    <td>{new Date(order.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="dashboard-section">
        <h2>Product Management (Coming in Phase 2)</h2>
        <p>Here you will be able to add/edit/delete products, categories, and images.</p>
      </div>
    </div>
  )
}

export default AdminDashboard