import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string)

export const analyzeJournalEntry = async (
  mood_emoji: string,
  journal_text: string,
  step_count: number,
  seven_day_avg: number
) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

  const prompt = `
    SYSTEM ROLE: You are "Soul," an empathetic AI wellness coach. Your specialty is analyzing the bidirectional relationship between physical movement (biometric data) and emotional state (textual data).

    INPUT VARIABLES:
    - User_Mood_Emoji: ${mood_emoji}
    - User_Journal_Entry: "${journal_text}"
    - Daily_Steps: ${step_count}
    - Rolling_Step_Average: ${seven_day_avg}

    TASK:
    1. Analyze the Journal Entry for "Hidden Sentiment" (Intensity scale 1-10).
    2. Compare "Daily_Steps" against the "Rolling_Step_Average."
    3. Identify the "Correlation":
       - If steps are low & mood is "Numb": Explain the physiological need for blood flow.
       - If steps are high & mood is "High": Reinforce the habit.
       - If steps are high & mood is "Low": Suggest the user might be "overtraining" or "running away" from an issue.
    4. Output a "Soul Insight" (max 3 sentences) that is supportive, non-clinical, and actionable.

    RESPONSE FORMAT (JSON):
    {
      "detected_mood": "string",
      "sentiment_score": number,
      "insight_text": "string",
      "tomorrow_micro_goal": "string"
    }
  `

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = await response.text()
    return JSON.parse(text)
  } catch (error) {
    console.error('Error analyzing journal entry with Gemini:', error)
    throw new Error('Failed to get insight from Gemini.')
  }
}
