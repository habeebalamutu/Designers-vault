import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('designersVaultUser')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const signup = (name, email, password) => {
    const newUser = { name, email, password }
    localStorage.setItem('designersVaultUser', JSON.stringify(newUser))
    setUser(newUser)
    return true
  }

  const login = (email, password) => {
    const storedUser = JSON.parse(localStorage.getItem('designersVaultUser'))
    if (storedUser && storedUser.email === email && storedUser.password === password) {
      setUser(storedUser)
      return true
    }
    return false
  }

  const logout = () => {
    localStorage.removeItem('designersVaultUser')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}