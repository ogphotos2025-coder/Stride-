'use client'
import { CheckCircle, Loader2, XCircle } from 'lucide-react'

interface JournalEntryProps {
  journalEntryText: string
  setJournalEntryText: (text: string) => void
  onSave: () => void
  isSaving: boolean
  saveError: string | null
  saveSuccess: boolean
}

export default function JournalEntry({
  journalEntryText,
  setJournalEntryText,
  onSave,
  isSaving,
  saveError,
  saveSuccess,
}: JournalEntryProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-md">
      <h3 className="text-lg font-semibold text-gray-800">Brain Dump</h3>
      <p className="mt-1 text-sm text-gray-500">Let it all out. No judgment.</p>
      <textarea
        value={journalEntryText}
        onChange={(e) => setJournalEntryText(e.target.value)}
        className="mt-4 w-full rounded-md border border-gray-300 p-3 text-sm text-gray-700 focus:border-primary-500 focus:ring-primary-500"
        rows={6}
        placeholder="What's on your mind?"
        disabled={isSaving}
      />
      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs font-medium text-gray-400">
          {journalEntryText.length} / 1000
        </span>
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-2 rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-colors hover:bg-primary-700 disabled:opacity-50"
        >
          {isSaving ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            'Save Entry'
          )}
        </button>
      </div>
      {saveSuccess && (
        <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
          <CheckCircle size={16} />
          <span>Entry saved successfully!</span>
        </div>
      )}
      {saveError && (
        <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
          <XCircle size={16} />
          <span>{saveError}</span>
        </div>
      )}
    </div>
  )
}
