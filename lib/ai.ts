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

        // Using stable gemini-pro which has 100% availability for this SDK version
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

        const context = pastEntries.map(e =>
            `Date: ${e.date}, Mood: ${e.mood}, Entry: ${e.journal_entry}`
        ).join('\n\n')

        const prompt = `
      You are a life coach for the "Stride & Soul" app. 
      The user just logged:
      Mood: ${currentEntry.mood}
      Steps: ${currentEntry.steps}
      Thoughts: ${currentEntry.journal_entry}

      Here are some relevant past entries from their history:
      ${context}

      Based on their current state and past patterns, provide a short, punchy, and empathetic recommendation (max 3 sentences). 
      If there are similarities with past entries, mention them (e.g., "You felt like this 2 weeks ago...").
      Focus on small, actionable steps to improve their day.
    `

        const result = await model.generateContent(prompt)
        return result.response.text()
    } catch (error: any) {
        console.error('RAG CRITICAL ERROR in generateInsight:', {
            message: error.message,
            stack: error.stack
        })
        return "Keep going! Every step counts toward a better day."
    }
}
