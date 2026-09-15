const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenAI } = require("@google/genai");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


// Gemini AI client
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});


// --------------------------------------------------
// Test route
// --------------------------------------------------

app.get("/", (req, res) => {
    res.json({
        message: "EDU-28 Backend is running"
    });
});


// --------------------------------------------------
// Check Gemini response
// --------------------------------------------------

function validateEvaluationResult(result, totalMarks) {

    if (!result || typeof result !== "object") {
        return false;
    }

    if (typeof result.score !== "number") {
        return false;
    }

    if (typeof result.totalMarks !== "number") {
        return false;
    }

    if (!Array.isArray(result.correctConcepts)) {
        return false;
    }

    if (!Array.isArray(result.partialConcepts)) {
        return false;
    }

    if (!Array.isArray(result.missingConcepts)) {
        return false;
    }

    if (typeof result.feedback !== "string") {
        return false;
    }

    if (!Array.isArray(result.improvementSuggestions)) {
        return false;
    }

    if (result.score < 0 || result.score > totalMarks) {
        return false;
    }

    return true;
}


// --------------------------------------------------
// Call Gemini with retry
// --------------------------------------------------

async function evaluateWithGemini(prompt) {

    const maxAttempts = 3;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {

        try {

            console.log(`Gemini evaluation attempt ${attempt}/${maxAttempts}`);

            const response = await ai.models.generateContent({
                model: "gemini-3.5-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",

                    responseSchema: {
                        type: "object",

                        properties: {

                            score: {
                                type: "number"
                            },

                            totalMarks: {
                                type: "number"
                            },

                            correctConcepts: {
                                type: "array",
                                items: {
                                    type: "string"
                                }
                            },

                            partialConcepts: {
                                type: "array",
                                items: {
                                    type: "string"
                                }
                            },

                            missingConcepts: {
                                type: "array",
                                items: {
                                    type: "string"
                                }
                            },

                            feedback: {
                                type: "string"
                            },

                            improvementSuggestions: {
                                type: "array",
                                items: {
                                    type: "string"
                                }
                            }
                        },

                        required: [
                            "score",
                            "totalMarks",
                            "correctConcepts",
                            "partialConcepts",
                            "missingConcepts",
                            "feedback",
                            "improvementSuggestions"
                        ]
                    }
                }
            });

            return response;

        } catch (error) {

            console.error(
                `Gemini attempt ${attempt} failed. Status:`,
                error.status
            );

            // Retry only temporary/rate-limit errors
            if (
                error.status !== 503 &&
                error.status !== 429
            ) {
                throw error;
            }

            // If this was the last attempt, throw the error
            if (attempt === maxAttempts) {
                throw error;
            }

            // Wait before retrying
            const delay = attempt * 1500;

            console.log(`Retrying in ${delay} ms...`);

            await new Promise(resolve => {
                setTimeout(resolve, delay);
            });
        }
    }
}


// --------------------------------------------------
// Evaluation API
// --------------------------------------------------

app.post("/api/evaluate", async (req, res) => {

    const {
        question,
        referenceAnswer,
        studentAnswer,
        totalMarks,
        rubric
    } = req.body;


    // --------------------------------------------------
    // Input validation
    // --------------------------------------------------

    if (!question || !referenceAnswer || !studentAnswer) {

        return res.status(400).json({
            error: true,
            message:
                "Question, reference answer and student answer are required."
        });
    }


    if (
        typeof totalMarks !== "number" ||
        totalMarks <= 0
    ) {

        return res.status(400).json({
            error: true,
            message:
                "Total marks must be greater than 0."
        });
    }


    // --------------------------------------------------
    // Create AI prompt
    // --------------------------------------------------

    const prompt = `
You are an educational answer evaluator.

Evaluate the student's answer by comparing it with the reference answer.

IMPORTANT RULES:

1. Evaluate meaning and concepts, not exact wording.
2. Give credit when the student expresses the same concept using different words.
3. Identify concepts that are correct.
4. Identify concepts that are partially correct.
5. Identify important concepts that are missing.
6. Consider the question, reference answer, student answer, total marks and rubric.
7. Give a fair score between 0 and the maximum marks.
8. The score must not be greater than the total marks.
9. Give a concise explanation of the evaluation.
10. Give actionable suggestions to improve the answer.
11. Return ONLY valid JSON.
12. Do not use Markdown.
13. Do not add text before or after the JSON.

QUESTION:
${question}

REFERENCE ANSWER:
${referenceAnswer}

STUDENT ANSWER:
${studentAnswer}

TOTAL MARKS:
${totalMarks}

RUBRIC:
${rubric || "No specific rubric provided."}
`;


    try {

        // --------------------------------------------------
        // Call Gemini
        // --------------------------------------------------

        const response = await evaluateWithGemini(prompt);


        // --------------------------------------------------
        // Parse Gemini response
        // --------------------------------------------------

        let result;

        try {

            result = JSON.parse(response.text);

        } catch (parseError) {

            console.error("Invalid JSON returned by Gemini.");

            return res.status(500).json({
                error: true,
                message:
                    "The AI returned an invalid evaluation response."
            });
        }


        // --------------------------------------------------
        // Validate AI response
        // --------------------------------------------------

        if (!validateEvaluationResult(result, totalMarks)) {

            console.error("Invalid evaluation structure:", result);

            return res.status(500).json({
                error: true,
                message:
                    "The AI returned an invalid evaluation response."
            });
        }


        // --------------------------------------------------
        // Protect score range
        // --------------------------------------------------

        if (result.score < 0) {
            result.score = 0;
        }

        if (result.score > totalMarks) {
            result.score = totalMarks;
        }


        // Always use the marks sent by the user
        result.totalMarks = totalMarks;


        // --------------------------------------------------
        // Send final result
        // --------------------------------------------------

        res.json(result);

    } catch (error) {

        console.error("Gemini evaluation error:", error);


        // Temporary Gemini availability problem
        if (
            error.status === 503 ||
            error.status === 429
        ) {

            return res.status(503).json({
                error: true,
                message:
                    "The AI service is temporarily busy. Please try again."
            });
        }


        // General error
        return res.status(500).json({
            error: true,
            message:
                "Unable to evaluate the answer. Please try again."
        });
    }

});


// --------------------------------------------------
// Start server
// --------------------------------------------------

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});