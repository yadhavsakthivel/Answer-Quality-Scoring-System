import { useState }        from 'react'
import AnswerForm           from '../components/AnswerForm'
import EvaluationResult     from '../components/EvaluationResult'
import { evaluateAnswer }   from '../services/api'

// Application state machine
const STATUS = {
  IDLE:       'idle',
  LOADING:    'loading',
  SUCCESS:    'success',
  ERROR:      'error',
}

export default function Home() {
  const [status, setStatus]   = useState(STATUS.IDLE)
  const [result, setResult]   = useState(null)
  const [errorMsg, setError]  = useState('')

  async function handleEvaluate(payload) {
    setStatus(STATUS.LOADING)
    setResult(null)
    setError('')

    try {
      const data = await evaluateAnswer(payload)
      setResult(data)
      setStatus(STATUS.SUCCESS)
      // Smooth-scroll to the result section after a short delay
      setTimeout(() => {
        document.getElementById('evaluation-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    } catch (err) {
      console.error('[Home] Evaluation failed:', err)
      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        'An unexpected error occurred. Please try again.'
      setError(message)
      setStatus(STATUS.ERROR)
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:px-8 space-y-12">
      {/* ── HERO SECTION ── */}
      <section className="bg-white border border-paper-border rounded-2xl p-6 sm:p-10 shadow-sm space-y-6" aria-labelledby="hero-heading">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-coral/10 text-coral px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider">
              Educational Quality Scoring
            </div>
            <h1 id="hero-heading" className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-ink leading-tight">
              Know exactly how well you answered.
            </h1>
            <p className="text-base sm:text-lg text-ink-muted leading-relaxed font-normal">
              Compare your response with the expected answer, discover missing concepts, and get actionable feedback.
            </p>
          </div>

          {/* VISUAL PROCESS INDICATOR */}
          <div className="flex items-center gap-2 pt-2 md:pt-0 shrink-0 border-t md:border-t-0 border-paper-border pt-4 md:pt-0">
            <div className="flex items-center gap-2 bg-paper border border-paper-border px-3 py-2 rounded-lg">
              <span className="text-xs font-black text-coral">01</span>
              <span className="text-xs font-bold tracking-wider uppercase text-ink-secondary">WRITE</span>
            </div>
            <span className="text-ink-faint font-bold text-xs">→</span>
            <div className="flex items-center gap-2 bg-paper border border-paper-border px-3 py-2 rounded-lg">
              <span className="text-xs font-black text-coral">02</span>
              <span className="text-xs font-bold tracking-wider uppercase text-ink-secondary">EVALUATE</span>
            </div>
            <span className="text-ink-faint font-bold text-xs">→</span>
            <div className="flex items-center gap-2 bg-paper border border-paper-border px-3 py-2 rounded-lg">
              <span className="text-xs font-black text-coral">03</span>
              <span className="text-xs font-bold tracking-wider uppercase text-ink-secondary">IMPROVE</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── INPUT FORM WORKSPACE ── */}
      <section aria-label="Evaluation Input Workspace">
        <AnswerForm onSubmit={handleEvaluate} isLoading={status === STATUS.LOADING} />
      </section>

      {/* ── ERROR STATE ── */}
      {status === STATUS.ERROR && (
        <div
          role="alert"
          aria-live="assertive"
          className="bg-status-red-bg border-2 border-status-red-border rounded-xl p-5 text-status-red-text flex items-start gap-4 shadow-sm"
        >
          <div className="w-8 h-8 rounded-full bg-status-red-badge text-white flex items-center justify-center font-bold shrink-0">
            !
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold uppercase tracking-wider">Evaluation Request Error</h3>
            <p className="text-base font-medium">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* ── RESULT SECTION ── */}
      <div id="evaluation-result">
        {status === STATUS.SUCCESS && result && (
          <EvaluationResult result={result} />
        )}

        {/* Empty state — shown only when idle */}
        {status === STATUS.IDLE && (
          <div className="bg-white border border-dashed border-paper-border rounded-2xl p-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-coral/10 text-coral font-bold text-xl flex items-center justify-center mx-auto">
              ✓
            </div>
            <h2 className="text-xl font-bold text-ink uppercase tracking-wide">READY TO REVIEW</h2>
            <p className="text-ink-muted text-base max-w-md mx-auto">
              Enter the question, reference answer and your response above. Your complete evaluation report will appear here.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
