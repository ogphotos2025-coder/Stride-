import TrainingLog from '@/components/TrainingLog'

export default function Home() {
  // ... existing states ...
  return (
    <main className="min-h-screen pb-20">
      {/* Marathon Header - Straightened */}
      <header className="bg-[var(--primary-navy)] text-white py-12 px-6 mb-12 shadow-xl border-b-4 border-[var(--accent-orange)]">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-6xl italic leading-none">Stride & Soul</h1>
            <p className="text-orange-400 font-bold tracking-widest mt-2">BELIEVE IN EVERY STEP</p>
          </div>
          <div className="flex items-center gap-6">
            <Link href="#training-log" className="text-sm font-black uppercase tracking-widest hover:text-orange-400 transition-colors hidden md:block">
              Archive
            </Link>
            <Link href="/settings" className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
              <Settings className="h-8 w-8 text-white" />
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6">
        {/* ... existing grid ... */}
        <section id="training-log">
          <h2 className="text-4xl mb-6 flex items-center gap-3 italic">
            <span className="w-2 h-10 bg-orange-400 block"></span>
            Training Log
          </h2>
          <TrainingLog />
        </section>
      </div>
    </div>
        </div >
      </div >
    </main >
  )
}
