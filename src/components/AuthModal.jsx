import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import '../styles/AuthModal.css'

function AuthModal({ onClose, onSuccess }) {
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { signup, login } = useAuth()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isLogin) {
      const success = login(email, password)
      if (success) {
        onSuccess()
        onClose()
      } else {
        setError('Invalid credentials. Please sign up first.')
      }
    } else {
      if (!name) {
        setError('Name is required')
        return
      }
      signup(name, email, password)
      onSuccess()
      onClose()
    }
  }

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close" onClick={onClose}>×</button>
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />}
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <p className="auth-error">{error}</p>}
          <button type="submit">{isLogin ? 'Login' : 'Create Account'}</button>
        </form>
        <p onClick={() => { setIsLogin(!isLogin); setError(''); }} className="auth-switch">
          {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
        </p>
      </div>
    </div>
  )
}

export default AuthModal