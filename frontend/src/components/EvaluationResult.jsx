import ScoreCard      from './ScoreCard'
import ConceptSection  from './ConceptSection'
import FeedbackCard    from './FeedbackCard'

/**
 * EvaluationResult — container for the full evaluation output.
 * Receives the raw API response object and renders all sub-sections.
 *
 * Expected shape:
 * {
 *   score:            number,
 *   max_score:        number,
 *   covered_concepts: string[],
 *   partial_concepts: string[],
 *   missing_concepts: string[],
 *   feedback:         string,
 * }
 */
export default function EvaluationResult({ result }) {
  if (!result) return null

  const score = result.score ?? 0
  const totalMarks = result.totalMarks ?? result.max_score ?? 10
  const correctConcepts = result.correctConcepts ?? result.covered_concepts ?? []
  const partialConcepts = result.partialConcepts ?? result.partial_concepts ?? []
  const missingConcepts = result.missingConcepts ?? result.missing_concepts ?? []
  const feedback = result.feedback || ''
  const improvementSuggestions = result.improvementSuggestions || []

  return (
    <section className="animate-slide-up space-y-10" aria-label="Evaluation Result">
      {/* SECTION DIVIDER */}
      <div className="flex items-center gap-4 pt-6">
        <div className="flex items-center gap-2 bg-ink text-white px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider">
          02
        </div>
        <h2 className="text-sm font-extrabold uppercase tracking-widest text-ink">
          EVALUATION REPORT
        </h2>
        <div className="h-px flex-1 bg-paper-border" />
      </div>

      {/* SCORE CARD */}
      <ScoreCard score={score} maxScore={totalMarks} />

      {/* CONCEPT COVERAGE SECTION */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 bg-paper-subtle text-ink-muted border border-paper-border px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider">
            03
          </span>
          <h3 className="text-sm font-extrabold uppercase tracking-widest text-ink">
            CONCEPT COVERAGE
          </h3>
          <div className="h-px flex-1 bg-paper-border" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ConceptSection variant="covered" concepts={correctConcepts} />
          <ConceptSection variant="partial" concepts={partialConcepts} />
          <ConceptSection variant="missing" concepts={missingConcepts} />
        </div>
      </div>

      {/* FEEDBACK SECTION */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 bg-paper-subtle text-ink-muted border border-paper-border px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider">
            04
          </span>
          <h3 className="text-sm font-extrabold uppercase tracking-widest text-ink">
            FEEDBACK & RECOMMENDATIONS
          </h3>
          <div className="h-px flex-1 bg-paper-border" />
        </div>

        <FeedbackCard feedback={feedback} improvementSuggestions={improvementSuggestions} />
      </div>
    </section>
  )
}
