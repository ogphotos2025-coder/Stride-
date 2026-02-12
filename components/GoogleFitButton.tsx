'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useState } from 'react'

export default function GoogleFitButton() {
  const { data: session, status } = useSession()
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConnect = async () => {
    setIsConnecting(true)
    setError(null)
    try {
      const result = await signIn('google', { callbackUrl: '/settings' })
      if (result?.error) {
        setError(result.error)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect to Google Fit')
    } finally {
      setIsConnecting(false)
    }
  }

  const isLoading = status === 'loading' || isConnecting

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <span className="text-2xl">🏃‍♂️</span>
          <div>
            <h3 className="font-semibold">Google Fit</h3>
            <p className="text-sm text-gray-500">
              {session ? 'Connected' : 'Sync your daily steps'}
            </p>
          </div>
        </div>
        <button
          onClick={() => (session ? signOut() : handleConnect())}
          disabled={isLoading}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${session
              ? 'bg-red-100 text-red-700 hover:bg-red-200'
              : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Processing...' : session ? 'Disconnect' : 'Connect'}
        </button>
      </div>
      {error && (
        <p className="text-xs text-red-500 px-1">
          Error: {error}. Please ensure the Fitness API is enabled in Google Cloud Console.
        </p>
      )}
    </div>
  )
}
