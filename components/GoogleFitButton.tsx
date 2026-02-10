'use client'

import { useSession, signIn, signOut } from 'next-auth/react'

export default function GoogleFitButton() {
  const { data: session } = useSession()

  return (
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
        onClick={() => (session ? signOut() : signIn('google'))}
        className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
          session
            ? 'bg-red-100 text-red-700 hover:bg-red-200'
            : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
        }`}
      >
        {session ? 'Disconnect' : 'Connect'}
      </button>
    </div>
  )
}
