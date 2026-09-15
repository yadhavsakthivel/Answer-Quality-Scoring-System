import { useState, useEffect } from 'react'

const INITIAL_FORM = {
  question:         '',
  reference_answer: '',
  student_answer:   '',
}

export default function AnswerForm({ onSubmit, isLoading }) {
  const [form, setForm]     = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [loadingStep, setLoadingStep] = useState(0)

  // Loading animation text steps
  useEffect(() => {
    if (!isLoading) return
    const interval = setInterval(() => {
      setLoadingStep(s => (s + 1) % 3)
    }, 700)
    return () => clearInterval(interval)
  }, [isLoading])

  const loadingSteps = [
    { label: 'Checking concepts', percent: '35%' },
    { label: 'Comparing with reference', percent: '70%' },
    { label: 'Preparing feedback', percent: '95%' },
  ]

  function handleChange(e) {
    const { id, value } = e.target
    setForm(prev => ({ ...prev, [id]: value }))
    if (errors[id]) setErrors(prev => ({ ...prev, [id]: '' }))
  }

  function validate() {
    const newErrors = {}
    if (!form.question.trim())          newErrors.question         = 'Question is required.'
    if (!form.reference_answer.trim())  newErrors.reference_answer = 'Reference answer is required.'
    if (!form.student_answer.trim())    newErrors.student_answer   = 'Your answer is required.'
    return newErrors
  }

  function handleSubmit(e) {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    onSubmit({
      question:        form.question.trim(),
      referenceAnswer: form.reference_answer.trim(),
      studentAnswer:   form.student_answer.trim(),
      totalMarks:      10,
      rubric:          '',
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Answer Evaluation Form"
      className="space-y-8"
    >
      {/* 01 — YOUR QUESTION */}
      <div className="bg-white border border-paper-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-paper-border pb-4">
          <label htmlFor="question" className="flex items-center gap-3">
            <span className="text-xs font-black text-white bg-ink px-2 py-0.5 rounded">01</span>
            <span className="text-sm font-extrabold uppercase tracking-wider text-ink">
              QUESTION
            </span>
          </label>
          {errors.question && (
            <span className="text-xs font-bold text-status-red-badge bg-status-red-bg px-2.5 py-1 rounded border border-status-red-border uppercase tracking-wider">
              {errors.question}
            </span>
          )}
        </div>

        <textarea
          id="question"
          rows={3}
          value={form.question}
          onChange={handleChange}
          placeholder="e.g. What is polymorphism in Java? Explain runtime polymorphism vs compile-time polymorphism with suitable examples."
          className={`field-textarea text-lg font-medium ${errors.question ? 'border-status-red-badge focus:ring-status-red-badge/20' : ''}`}
        />
      </div>

      {/* 2-COLUMN WORKSPACE: REFERENCE vs STUDENT ANSWER */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* COLUMN 1: REFERENCE ANSWER / RUBRIC */}
        <div className="bg-white border border-paper-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-paper-border pb-4">
              <label htmlFor="reference_answer" className="flex items-center gap-3">
                <span className="text-xs font-black text-ink-muted bg-paper-subtle border border-paper-border px-2 py-0.5 rounded">REF</span>
                <span className="text-sm font-extrabold uppercase tracking-wider text-ink">
                  REFERENCE ANSWER / RUBRIC
                </span>
              </label>
              {errors.reference_answer ? (
                <span className="text-xs font-bold text-status-red-badge bg-status-red-bg px-2.5 py-1 rounded border border-status-red-border uppercase tracking-wider">
                  {errors.reference_answer}
                </span>
              ) : (
                <span className="text-xs font-bold uppercase tracking-wider text-coral bg-coral-light/50 px-2 py-0.5 rounded border border-coral/20">
                  Required
                </span>
              )}
            </div>

            <textarea
              id="reference_answer"
              rows={10}
              value={form.reference_answer}
              onChange={handleChange}
              placeholder="Enter the rubric, key expected points, or a reference solution..."
              className={`field-textarea h-[260px] min-h-[200px] ${errors.reference_answer ? 'border-status-red-badge focus:ring-status-red-badge/20' : ''}`}
            />
          </div>
          <div className="text-right pt-2 border-t border-paper-subtle">
            <span className="text-xs font-semibold text-ink-faint">
              {form.reference_answer.length} characters
            </span>
          </div>
        </div>

        {/* COLUMN 2: YOUR ANSWER */}
        <div className="bg-white border border-paper-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-paper-border pb-4">
              <label htmlFor="student_answer" className="flex items-center gap-3">
                <span className="text-xs font-black text-white bg-coral px-2 py-0.5 rounded">ANS</span>
                <span className="text-sm font-extrabold uppercase tracking-wider text-ink">
                  YOUR ANSWER
                </span>
              </label>
              {errors.student_answer ? (
                <span className="text-xs font-bold text-status-red-badge bg-status-red-bg px-2.5 py-1 rounded border border-status-red-border uppercase tracking-wider">
                  {errors.student_answer}
                </span>
              ) : (
                <span className="text-xs font-bold uppercase tracking-wider text-coral bg-coral-light/50 px-2 py-0.5 rounded border border-coral/20">
                  Required
                </span>
              )}
            </div>

            <textarea
              id="student_answer"
              rows={10}
              value={form.student_answer}
              onChange={handleChange}
              placeholder="Write or paste your full response here..."
              className={`field-textarea h-[260px] min-h-[200px] ${errors.student_answer ? 'border-status-red-badge focus:ring-status-red-badge/20' : ''}`}
            />
          </div>
          <div className="text-right pt-2 border-t border-paper-subtle">
            <span className="text-xs font-semibold text-ink-faint">
              {form.student_answer.length} characters
            </span>
          </div>
        </div>
      </div>

      {/* CTA & LOADING CONTAINER */}
      <div className="bg-white border border-paper-border rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <h3 className="text-sm font-bold text-ink uppercase tracking-wider">Ready for instant analysis?</h3>
          <p className="text-xs text-ink-muted">
            The AI will evaluate your concepts against the reference rubric and highlight gaps.
          </p>
        </div>

        <div className="w-full md:w-auto">
          {isLoading ? (
            <div className="bg-paper border border-paper-border rounded-xl p-4 w-full md:w-80 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-ink">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-coral animate-ping"></span>
                  ANALYZING YOUR ANSWER
                </span>
                <span className="text-coral">{loadingSteps[loadingStep].percent}</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-paper-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-coral transition-all duration-500 ease-out"
                  style={{ width: loadingSteps[loadingStep].percent }}
                ></div>
              </div>

              <div className="text-xs font-medium text-ink-muted text-center animate-pulse">
                {loadingSteps[loadingStep].label}...
              </div>
            </div>
          ) : (
            <button
              type="submit"
              className="btn-primary w-full md:w-auto text-center"
              aria-busy={isLoading}
            >
              <span>EVALUATE ANSWER</span>
              <span className="text-lg leading-none">→</span>
            </button>
          )}
        </div>
      </div>
    </form>
  )
}
