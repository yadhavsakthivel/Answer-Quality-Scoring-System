// Navbar — application header with branding
export default function Navbar() {
  return (
    <header className="border-b border-paper-border bg-white sticky top-0 z-20 shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        {/* LEFT BRANDING */}
        <div className="flex items-center gap-3">
          <span className="text-xl font-extrabold tracking-tight text-ink flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-coral inline-block"></span>
            AnswerIQ
          </span>
          <span className="hidden sm:inline-block text-paper-border font-light">|</span>
          <span className="hidden sm:inline-block text-xs font-semibold text-ink-muted uppercase tracking-wider">
            AI Educational Answer Evaluation
          </span>
        </div>

        {/* RIGHT WORKSPACE TAG */}
        <div className="flex items-center gap-2 bg-paper-subtle/80 border border-paper-border px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-bold uppercase tracking-wider text-ink-secondary">
            Evaluation Workspace
          </span>
        </div>
      </div>
    </header>
  )
}
