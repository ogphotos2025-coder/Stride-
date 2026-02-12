import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { supabase } from '@/lib/supabase'
import { generateEmbedding, generateInsight } from '@/lib/ai'

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.id) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    try {
        // 1. Get the most recent daily entry for context
        const { data: latestEntries, error: latestError } = await supabase
            .from('daily_entries')
            .select('*')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false })
            .limit(1)

        if (latestError) {
            console.error('Supabase Query Error (latestEntries):', latestError)
            throw latestError
        }

        const latest = latestEntries?.[0] as any

        if (!latest) {
            return NextResponse.json({
                insight_text: "You haven't logged any entries yet. Start by dumping your thoughts to get personalized insights!",
                tomorrow_micro_goal: "Save your first entry today."
            })
        }

        // 2. Generate embedding for the latest entry if it exists
        let matchingMemories = []
        if (latest.journal_entry) {
            try {
                const embedding = await generateEmbedding(latest.journal_entry)

                // 3. Search for similar past entries using the RPC function we created
                const { data: matches, error: matchError } = await supabase.rpc('match_entries', {
                    query_embedding: embedding,
                    match_threshold: 0.5,
                    match_count: 3
                })

                if (matchError) {
                    console.error('Supabase RPC Error (match_entries):', matchError)
                } else {
                    // Filter out the current entry from matches
                    matchingMemories = (matches as any[] || []).filter((m: any) => m.id !== latest.id)
                }
            } catch (embedError) {
                console.error('Embedding Generation Error:', embedError)
                // Continue without memories if embedding fails
            }
        }

        // 4. Generate the personalized insight using Gemini
        const insightText = await generateInsight(
            {
                mood: latest.mood,
                journal_entry: latest.journal_entry || "",
                steps: latest.step_count
            },
            matchingMemories
        )

        return NextResponse.json({
            detected_mood: latest.mood,
            insight_text: insightText,
            tomorrow_micro_goal: latest.step_count < 5000
                ? "Try to hit 6,000 steps tomorrow for a mood boost."
                : "Keep up this momentum! You're crushing your step goals."
        })

    } catch (error: any) {
        console.error('CRITICAL ERROR in /api/ai/insights:', {
            message: error.message,
            stack: error.stack,
            details: error
        })
        return NextResponse.json(
            { error: 'Failed to generate insights', details: error.message },
            { status: 500 }
        )
    }
}
