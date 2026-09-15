export default function ScoreCard({ score, maxScore = 10 }) {
  const percentage = Math.round((score / maxScore) * 100)

  // Status rating and color band
  let statusText = 'NEEDS IMPROVEMENT'
  let textColor  = 'text-status-red-badge'
  let bgColor    = 'bg-status-red-bg'
  let borderColor= 'border-status-red-border'
  let barColor   = 'bg-status-red-badge'

  if (percentage >= 85) {
    statusText  = 'EXCELLENT UNDERSTANDING'
    textColor   = 'text-status-green-badge'
    bgColor     = 'bg-status-green-bg'
    borderColor = 'border-status-green-border'
    barColor    = 'bg-status-green-badge'
  } else if (percentage >= 70) {
    statusText  = 'GOOD UNDERSTANDING'
    textColor   = 'text-status-green-badge'
    bgColor     = 'bg-status-green-bg'
    borderColor = 'border-status-green-border'
    barColor    = 'bg-status-green-badge'
  } else if (percentage >= 50) {
    statusText  = 'PARTIAL UNDERSTANDING'
    textColor   = 'text-status-amber-badge'
    bgColor     = 'bg-status-amber-bg'
    borderColor = 'border-status-amber-border'
    barColor    = 'bg-status-amber-badge'
  }

  return (
    <div className="bg-white border border-paper-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-paper-border">
        {/* SCORE SUMMARY */}
        <div className="space-y-1">
          <span className="text-xs font-black uppercase tracking-widest text-ink-faint">
            YOUR SCORE
          </span>
          <div className="flex items-baseline gap-3">
            <span className="text-5xl sm:text-6xl font-black text-ink tracking-tight">
              {score}
            </span>
            <span className="text-2xl font-bold text-ink-muted">
              / {maxScore}
            </span>
          </div>
        </div>

        {/* STATUS BADGE */}
        <div className="flex flex-col sm:items-end gap-2">
          <span className={`inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-lg border ${bgColor} ${textColor} ${borderColor}`}>
            <span className={`w-2 h-2 rounded-full ${barColor}`}></span>
            {statusText}
          </span>
          <span className="text-xs font-bold text-ink-muted">
            {percentage}% of maximum expected points
          </span>
        </div>
      </div>

      {/* HORIZONTAL SCORE VISUALIZATION BAR */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-bold text-ink-muted uppercase tracking-wider">
          <span>Score Spectrum</span>
          <span>{score} of {maxScore} pts</span>
        </div>

        {/* Track bar */}
        <div className="relative w-full h-4 bg-paper-subtle rounded-full overflow-hidden border border-paper-border">
          <div
            className={`h-full ${barColor} transition-all duration-700 ease-out`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>

        {/* Tick marks */}
        <div className="flex justify-between text-[10px] font-semibold text-ink-faint px-1 pt-1">
          <span>0 (0%)</span>
          <span>2.5 (25%)</span>
          <span>5.0 (50%)</span>
          <span>7.5 (75%)</span>
          <span>10 (100%)</span>
        </div>
      </div>
    </div>
  )
}
