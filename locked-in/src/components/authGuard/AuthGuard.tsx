import { useEffect, useState, ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

const AuthGuard = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${apiUrl}/health`, {credentials: "include"})
        console.error("test")
        console.error(response.status)
        if (response.status === 200) {
          setIsAuthenticated(true)
        } else {
          setIsAuthenticated(false)
        }
      } catch {
        setIsAuthenticated(false)
      }
    }
    checkAuth()
  }, [])

  if (isAuthenticated === null) {
    return <div>Loading...</div> // Show loading state while checking auth
  }

  return isAuthenticated ? children : <Navigate to="/" replace />
}

export default AuthGuard
