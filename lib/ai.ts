import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function generateEmbedding(text: string) {
    try {
        // Using confirmed working model name for this API key
        const model = genAI.getGenerativeModel({ model: 'gemini-embedding-001' })
        // Specify the dimension to match our Supabase vector(1536) column
        const result = await model.embedContent({
            content: { parts: [{ text }], role: 'user' },
            taskType: 'RETRIEVAL_DOCUMENT',
            outputDimensionality: 1536
        } as any)
        return result.embedding.values
    } catch (error: any) {
        console.error('Error generating embedding:', error.message)
        throw error
    }
}

export async function generateInsight(
    currentEntry: { mood: string; journal_entry: string; steps: number },
    pastEntries: any[]
) {
    try {
        if (!process.env.GEMINI_API_KEY) {
            console.error('RAG ERROR: GEMINI_API_KEY is missing in environment')
            return "Keep going! (API Key Missing)"
        }

        // Using 'gemini-2.0-flash' as the primary model to avoid the 1.5-flash 404 errors
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash',
            safetySettings: [
                { category: 'HARM_CATEGORY_HARASSMENT' as any, threshold: 'BLOCK_NONE' as any },
                { category: 'HARM_CATEGORY_HATE_SPEECH' as any, threshold: 'BLOCK_NONE' as any },
                { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT' as any, threshold: 'BLOCK_NONE' as any },
                { category: 'HARM_CATEGORY_DANGEROUS_CONTENT' as any, threshold: 'BLOCK_NONE' as any },
            ]
        })

        const context = pastEntries.map(e =>
            `Date: ${e.date}, Mood: ${e.mood}, Entry: ${e.journal_entry}`
        ).join('\n\n')

        const prompt = `
      You are an Elite Marathon Performance Coach for the "Stride & Soul" app. 
      Your goal is to provide high-performance, tailored insights connecting physical movement (steps) and mental state (mood).
      
      CURRENT DATA:
      - Mood: ${currentEntry.mood}
      - Steps: ${currentEntry.steps}
      - Athlete's Thoughts: "${currentEntry.journal_entry}"

      HISTORICAL TRAINING CONTEXT:
      ${context || "No prior history found. Establish a baseline today."}

      INSTRUCTIONS:
      1. Detect the language of the "Athlete's Thoughts" and provide your response in that SAME language.
      2. Adopt a professional, punchy, and highly empathetic tone.
      3. Analyze the correlation between their steps and mood. 
      4. If steps are low but mood is high, focus on "active recovery." 
      5. If steps are high but mood is low, watch for "overtraining" or burnout.
      6. Reference past entries if they show a pattern (e.g., "This mood shift mirrors your recovery phase from last Tuesday").
      7. Provide exactly ONE actionable 'Pro-Tip' for a marathoner.
      8. Keep the total response under 3 concise sentences.
    `

        console.log('RAG DEBUG: Prompt prepared. Character count:', prompt.length)
        const result = await model.generateContent(prompt)

        if (!result.response || !result.response.candidates || result.response.candidates.length === 0) {
            console.error('RAG ERROR: No candidates returned from Gemini')
            return "Keep going! The silence is just a sign of a focused athlete."
        }

        const responseText = result.response.text()
        console.log('RAG DEBUG: Insight generated successfully.')
        return responseText
    } catch (error: any) {
        const errorMsg = error.message || ''
        console.error('RAG CRITICAL ERROR in generateInsight:', {
            message: errorMsg,
            model: 'gemini-2.0-flash',
            status: error.status,
            stack: error.stack
        })

        if (errorMsg.includes('429')) {
            return "Processing high athlete volume. Your tactical breakdown is queued. Stay focused on your pace."
        }

        if (errorMsg.includes('API_KEY_INVALID')) {
            return "Connection to Performance Coach lost. Please verify your API Key in environment settings."
        }

        if (errorMsg.includes('500') || errorMsg.includes('503')) {
            return "Training server is momentarily down. Maintain your momentum—I'll be back online soon."
        }

        return "Keep going! Your effort today is the foundation for tomorrow's performance."
    }
}
