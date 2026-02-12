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
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h3 className="text-3xl text-orange-400">Mental Log</h3>
          <p className="text-gray-300 italic">Clear your head for the next mile.</p>
        </div>
      </div>

      <textarea
        value={journalEntryText}
        onChange={(e) => setJournalEntryText(e.target.value)}
        className="w-full bg-white/10 rounded-2xl border-2 border-white/20 p-6 text-xl text-white placeholder-white/30 focus:outline-none focus:border-orange-500 transition-colors focus:bg-white/15"
        rows={6}
        placeholder="Unfiltered training notes..."
        disabled={isSaving}
      />

      <div className="flex items-center justify-between">
        <span className="text-xs font-black uppercase tracking-widest text-white/40">
          Character Count: {journalEntryText.length} / 1000
        </span>
        <button
          onClick={onSave}
          disabled={isSaving}
          className="btn-nyrr"
        >
          {isSaving ? (
            <div className="flex items-center gap-3">
              <Loader2 size={24} className="animate-spin" />
              <span>SAVING...</span>
            </div>
          ) : (
            'Sync Entry'
          )}
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-green-500/20 text-green-400 rounded-xl border border-green-500/30 flex items-center gap-3 font-bold uppercase text-xs tracking-widest">
          <CheckCircle size={20} />
          <span>Sync Successful</span>
        </div>
      )}
      {saveError && (
        <div className="p-4 bg-red-500/20 text-red-400 rounded-xl border border-red-500/30 flex items-center gap-3 font-bold uppercase text-xs tracking-widest">
          <XCircle size={20} />
          <span>Error: {saveError}</span>
        </div>
      )}
    </div>
  )
}
