const VARIANTS = {
  covered: {
    label:       'COVERED CONCEPTS',
    symbol:      '✓',
    iconBg:      'bg-status-green-badge text-white',
    headerColor: 'text-status-green-text',
    cardBg:      'bg-white border-paper-border',
    itemBg:      'bg-status-green-bg border-status-green-border text-ink',
    symbolColor: 'text-status-green-badge font-bold',
    description: 'Clearly addressed in your answer',
  },
  partial: {
    label:       'PARTIALLY COVERED',
    symbol:      '~',
    iconBg:      'bg-status-amber-badge text-white',
    headerColor: 'text-status-amber-text',
    cardBg:      'bg-white border-paper-border',
    itemBg:      'bg-status-amber-bg border-status-amber-border text-ink',
    symbolColor: 'text-status-amber-badge font-bold',
    description: 'Mentioned but incomplete explanation',
  },
  missing: {
    label:       'MISSING CONCEPTS',
    symbol:      '×',
    iconBg:      'bg-status-red-badge text-white',
    headerColor: 'text-status-red-text',
    cardBg:      'bg-white border-paper-border',
    itemBg:      'bg-status-red-bg border-status-red-border text-ink',
    symbolColor: 'text-status-red-badge font-bold',
    description: 'Absent from your answer',
  },
}

/**
 * @param {{ variant: 'covered'|'partial'|'missing', concepts: string[] }} props
 */
export default function ConceptSection({ variant, concepts }) {
  const cfg = VARIANTS[variant]

  const conceptList = concepts || []

  return (
    <div className={`border rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between ${cfg.cardBg}`}>
      <div className="space-y-3">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-paper-border pb-3">
          <div className="flex items-center gap-2.5">
            <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-black shrink-0 ${cfg.iconBg}`}>
              {cfg.symbol}
            </span>
            <h4 className="text-xs font-black uppercase tracking-wider text-ink">
              {cfg.label}
            </h4>
          </div>
          <span className="text-xs font-black px-2 py-0.5 rounded bg-paper-subtle text-ink-secondary">
            {conceptList.length}
          </span>
        </div>

        <p className="text-xs font-medium text-ink-muted">
          {cfg.description}
        </p>

        {/* CONCEPT ROWS */}
        {conceptList.length > 0 ? (
          <ul className="space-y-2.5 pt-1" aria-label={cfg.label}>
            {conceptList.map((concept, idx) => (
              <li
                key={idx}
                className={`flex items-start gap-3 rounded-lg border p-3 text-xs leading-relaxed font-medium ${cfg.itemBg}`}
              >
                <span className={`text-sm leading-none shrink-0 ${cfg.symbolColor}`} aria-hidden="true">
                  {cfg.symbol}
                </span>
                <span className="text-ink font-semibold">{concept}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-4 text-center text-xs font-medium text-ink-faint italic bg-paper/50 rounded-lg border border-dashed border-paper-border">
            None detected
          </div>
        )}
      </div>
    </div>
  )
}
