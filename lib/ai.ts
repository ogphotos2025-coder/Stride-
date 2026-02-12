import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function generateEmbedding(text: string) {
    try {
        const model = genAI.getGenerativeModel({ model: 'text-embedding-004' })
        const result = await model.embedContent(text)
        return result.embedding.values
    } catch (error) {
        console.error('Error generating embedding:', error)
        throw error
    }
}

export async function generateInsight(
    currentEntry: { mood: string; journal_entry: string; steps: number },
    pastEntries: any[]
) {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

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
    } catch (error) {
        console.error('Error generating insight:', error)
        return "Keep going! Every step counts toward a better day."
    }
}
