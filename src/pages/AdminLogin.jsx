import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Toast from '../components/Toast'
import '../styles/AdminLogin.css'

function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [toast, setToast] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    // Mock admin credentials
    if (email === 'admin@designersvault.com' && password === 'admin123') {
      localStorage.setItem('adminAuth', 'true')
      setToast({ message: 'Login successful!', type: 'success' })
      setTimeout(() => navigate('/admin/dashboard'), 1000)
    } else {
      setToast({ message: 'Invalid credentials. Use admin@designersvault.com / admin123', type: 'error' })
    }
  }

  return (
    <div className="admin-login-container">
      <div className="login-card">
        <h2>Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="login-btn">Login</button>
        </form>
        <p className="demo-hint">Demo: admin@designersvault.com / admin123</p>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

export default AdminLogin