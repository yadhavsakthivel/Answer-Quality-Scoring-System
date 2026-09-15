import axios from 'axios'

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------
const API_URL = import.meta.env.VITE_API_URL || 'http://10.10.183.206:5000/api/evaluate'

const client = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Evaluate a student's answer against the reference answer/rubric.
 * Sends POST request to ${VITE_API_URL}/api/evaluate with exact JSON structure.
 *
 * @param {{ question: string, referenceAnswer: string, studentAnswer: string, totalMarks?: number, rubric?: string }} payload
 * @returns {Promise<EvaluationResult>}
 */
export async function evaluateAnswer(payload) {
  const requestBody = {
    question: (payload.question || '').trim(),
    referenceAnswer: (payload.referenceAnswer || payload.reference_answer || '').trim(),
    studentAnswer: (payload.studentAnswer || payload.student_answer || '').trim(),
    totalMarks: payload.totalMarks || 10,
    rubric: (payload.rubric || '').trim(),
  }

  try {
    const response = await client.post('/api/evaluate', requestBody)
    return response.data
  } catch (err) {
    console.error('[api] Evaluation request failed:', err)

    // Backend error payload: { "error": true, "message": "..." }
    const backendMessage = err?.response?.data?.message || err?.response?.data?.error

    if (backendMessage && typeof backendMessage === 'string') {
      throw new Error(backendMessage)
    }

    if (err?.code === 'ECONNABORTED' || err?.message?.includes('timeout')) {
      throw new Error('The request timed out. Please try again.')
    }

    if (err?.response?.status === 503) {
      throw new Error('The AI service is temporarily busy. Please try again.')
    }

    if (!err?.response) {
      throw new Error('Unable to connect to the backend server. Please ensure the server is running on http://localhost:5000.')
    }

    throw new Error(err?.message || 'An unexpected error occurred. Please try again.')
  }
}

