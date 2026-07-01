import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Header() {
  const [logoUrl, setLogoUrl] = useState('')

  useEffect(() => {
    loadLogo()
  }, [])

  const loadLogo = async () => {
    try {
      const response = await axios.get('/api/email/signature')
      if (response.data.logoBase64) {
        setLogoUrl(response.data.logoBase64)
      }
    } catch (error) {
      console.error('Failed to load logo')
    }
  }

  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4">
          <div>
            {logoUrl ? (
              <img src={logoUrl} alt="Master Sparkle's Logo" className="w-20 h-20 object-contain" />
            ) : (
              <div className="w-20 h-20 bg-transparent rounded animate-pulse"></div>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold">Email Blasting Pro</h1>
            <p className="text-blue-100">Professional Email Campaign Manager</p>
          </div>
        </div>
      </div>
    </header>
  )
}
