/**
 * Helper to structure narrative feedback into expert educational sections:
 * 1. WHAT YOU DID WELL
 * 2. WHAT NEEDS IMPROVEMENT
 * 3. NEXT STEP
 */
function parseAcademicFeedback(text) {
  if (!text) return { well: '', improve: '', next: '' }

  // Split into sentences
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]

  const wellSentences = []
  const improveSentences = []
  const nextSentences = []

  sentences.forEach(s => {
    const trimmed = s.trim()
    const lower = trimmed.toLowerCase()

    if (lower.includes('try to') || lower.includes('next step') || lower.includes('would significantly strengthen') || lower.includes('to improve') || lower.includes('recommend')) {
      nextSentences.push(trimmed)
    } else if (lower.includes('however') || lower.includes('does not mention') || lower.includes('missing') || lower.includes('lacks') || lower.includes('incomplete') || lower.includes('nor does')) {
      improveSentences.push(trimmed)
    } else {
      wellSentences.push(trimmed)
    }
  })

  // Fallback fallback if one section got all sentences
  const well = wellSentences.join(' ') || text
  const improve = improveSentences.join(' ') || 'Review the missing concepts list above to address gaps in your answer.'
  const next = nextSentences.join(' ') || 'Revise your response by incorporating the missing key terms and explaining relationships clearly.'

  return { well, improve, next }
}

export default function FeedbackCard({ feedback, improvementSuggestions }) {
  if (!feedback && (!improvementSuggestions || improvementSuggestions.length === 0)) return null

  const { well, improve, next } = parseAcademicFeedback(feedback || '')
  const hasSuggestions = Array.isArray(improvementSuggestions) && improvementSuggestions.length > 0

  return (
    <div className="bg-white border border-paper-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
      {/* CARD HEADER */}
      <div className="flex items-center justify-between border-b border-paper-border pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-coral text-white font-bold flex items-center justify-center text-sm shadow-sm">
            ★
          </div>
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-ink">
              EXPERT ACADEMIC EVALUATION
            </h3>
            <p className="text-xs font-medium text-ink-muted">
              Structured feedback to guide your answer revision
            </p>
          </div>
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-coral bg-coral-light/60 border border-coral/20 px-3 py-1 rounded-md">
          Teacher Assessment
        </span>
      </div>

      {/* 3 STRUCTURED ACADEMIC SECTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* WHAT YOU DID WELL */}
        <div className="bg-status-green-bg/60 border border-status-green-border rounded-xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-status-green-text font-black text-xs uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-status-green-badge"></span>
            WHAT YOU DID WELL
          </div>
          <p className="text-xs leading-relaxed font-semibold text-ink">
            {well}
          </p>
        </div>

        {/* WHAT NEEDS IMPROVEMENT */}
        <div className="bg-status-amber-bg/60 border border-status-amber-border rounded-xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-status-amber-text font-black text-xs uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-status-amber-badge"></span>
            WHAT NEEDS IMPROVEMENT
          </div>
          <p className="text-xs leading-relaxed font-semibold text-ink">
            {improve}
          </p>
        </div>

        {/* NEXT STEP / IMPROVEMENT SUGGESTIONS */}
        <div className="bg-coral-light/30 border border-coral/30 rounded-xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-coral font-black text-xs uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-coral"></span>
            NEXT STEP / SUGGESTIONS
          </div>
          {hasSuggestions ? (
            <ul className="space-y-1.5 pt-0.5">
              {improvementSuggestions.map((item, idx) => (
                <li key={idx} className="text-xs leading-relaxed font-semibold text-ink flex items-start gap-1.5">
                  <span className="text-coral font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs leading-relaxed font-semibold text-ink">
              {next}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
