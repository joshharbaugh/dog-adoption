import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface LoginCredentials {
  name: string
  email: string
}

export function useAuth() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const login = async (credentials: LoginCredentials) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      router.replace('/search')
      return true
    } catch (err) {
      setError('Failed to login. Please check your credentials and try again.')
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    login,
    loading,
    error
  }
}