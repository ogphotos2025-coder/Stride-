'use client'
import { useState } from 'react'

export default function JournalEntry() {
  const [entry, setEntry] = useState('')

  return (
    <div className="rounded-xl bg-white p-6 shadow-md">
      <h3 className="text-lg font-semibold text-gray-800">Brain Dump</h3>
      <p className="mt-1 text-sm text-gray-500">Let it all out. No judgment.</p>
      <textarea
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
        className="mt-4 w-full rounded-md border border-gray-300 p-3 text-sm text-gray-700 focus:border-primary-500 focus:ring-primary-500"
        rows={6}
        placeholder="What's on your mind?"
      />
      <div className="mt-2 flex justify-end">
        <span className="text-xs font-medium text-gray-400">
          {entry.length} / 1000
        </span>
      </div>
    </div>
  )
}
