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
    if (storedOrders.length === 0) {
      // Demo orders to show admin panel isn't empty
      setOrders([
        { id: 1001, customerName: 'Demo Customer', total: 129.99, status: 'Pending', date: new Date().toISOString() },
        { id: 1002, customerName: 'Test User', total: 89.99, status: 'Shipped', date: new Date().toISOString() }
      ])
    } else {
      setOrders(storedOrders)
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

      <div className="dashboard-section">
        <h2>📦 Orders</h2>
        {orders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          <div className="orders-table-container">
            <table className="orders-table">
              <thead>
                <tr><th>Order ID</th><th>Customer</th><th>Total (₦)</th><th>Status</th><th>Date</th></tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.customerName}</td>
                    <td>{order.total.toLocaleString()}</td>
                    <td><span className={`status-badge status-${order.status.toLowerCase()}`}>{order.status}</span></td>
                    <td>{new Date(order.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="dashboard-section">
        <h2>🛍️ Product Management (Coming in Phase 2)</h2>
        <p>Admin will be able to add/edit/delete products, upload images, manage categories, and view detailed analytics.</p>
        <button className="coming-soon-btn" disabled>Add New Product</button>
      </div>
    </div>
  )
}

export default AdminDashboard