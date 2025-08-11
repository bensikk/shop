import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { api } from '@/lib/api'

interface User {
  id: number
  email: string
  firstName?: string
  lastName?: string
  role: 'USER' | 'ADMIN'
  createdAt?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: { email: string; password: string; firstName?: string; lastName?: string }) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Перевіряємо токен при завантаженні
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token')
      if (storedToken) {
        // Тут можна додати перевірку токена на сервері
        setToken(storedToken)
        // Тимчасово встановлюємо користувача з localStorage
        const userData = localStorage.getItem('user')
        if (userData) {
          setUser(JSON.parse(userData))
        }
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.login({ email, password })
      if (response.data && (response.data as any).access_token) {
        const { access_token, user: userData } = response.data as any
        setToken(access_token)
        setUser(userData)
        localStorage.setItem('token', access_token)
        localStorage.setItem('user', JSON.stringify(userData))
        return true
      }
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const register = async (userData: { email: string; password: string; firstName?: string; lastName?: string }): Promise<boolean> => {
    try {
      const response = await api.register(userData)
      if (response.data && (response.data as any).access_token) {
        const { access_token, user: newUser } = response.data as any
        setToken(access_token)
        setUser(newUser)
        localStorage.setItem('token', access_token)
        localStorage.setItem('user', JSON.stringify(newUser))
        return true
      }
      return false
    } catch (error) {
      console.error('Register error:', error)
      return false
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isLoading,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
