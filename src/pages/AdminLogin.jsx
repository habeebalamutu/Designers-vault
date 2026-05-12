import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/AdminLogin.css'

function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    // Temporary hardcoded admin (will be replaced with real auth later)
    if (email === 'admin@designersvault.com' && password === 'admin123') {
      localStorage.setItem('adminAuth', 'true')
      navigate('/admin/dashboard')
    } else {
      alert('Invalid credentials. Use admin@designersvault.com / admin123')
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
      </div>
    </div>
  )
}

export default AdminLogin