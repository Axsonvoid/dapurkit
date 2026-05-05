import { createContext, useState, useEffect, useContext } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [account, setAccount] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('dapurkit_account')
    if (stored) {
      try {
        setAccount(JSON.parse(stored))
      } catch {
        localStorage.removeItem('dapurkit_account')
      }
    }
  }, [])

  const login = (email) => {
    const newAccount = { email, createdAt: new Date().toISOString() }
    localStorage.setItem('dapurkit_account', JSON.stringify(newAccount))
    setAccount(newAccount)
  }

  const logout = () => {
    localStorage.removeItem('dapurkit_account')
    setAccount(null)
  }

  return (
    <AuthContext.Provider value={{ account, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)