import GoogleFitButton from '@/components/GoogleFitButton'
import Link from 'next/link'
import { Home } from 'lucide-react'

export default function SettingsPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center p-24">
      <div className="absolute left-8 top-8">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-gray-700">
          <Home size={20} />
          <span>Home</span>
        </Link>
      </div>
      <h1 className="text-4xl font-bold">Settings</h1>
      <div className="mt-8 w-full max-w-md rounded-xl bg-white p-6 shadow-md">
        <h2 className="text-2xl font-semibold">Integrations</h2>
        <div className="mt-4">
          <p className="text-gray-600">Connect your accounts to automatically sync your data.</p>
          <div className="mt-4">
            <GoogleFitButton />
          </div>
        </div>
      </div>
    </main>
  )
}
