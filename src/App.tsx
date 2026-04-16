function App() {
  return (
    <main className="min-h-screen bg-[#06060f] px-6 py-24 text-slate-100">
      <div className="mx-auto flex max-w-5xl flex-col gap-10">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">
            Lesego Sindani
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Portfolio site in progress
          </h1>
          <p className="max-w-2xl text-lg text-slate-300">
            Setting up the React, Vite, and Tailwind foundation for a game-inspired portfolio.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Stack</p>
            <p className="mt-3 text-base text-slate-200">React, Vite, TypeScript, Tailwind CSS</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Status</p>
            <p className="mt-3 text-base text-slate-200">Scaffolding the first pass of the site.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Focus</p>
            <p className="mt-3 text-base text-slate-200">Clean structure before the fun UI chaos.</p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default App
