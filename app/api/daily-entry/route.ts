import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { addDailyEntry } from '@/lib/database'
import { DailyEntry } from '@/types'
import { format } from 'date-fns'
import { generateEmbedding } from '@/lib/ai'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const { mood, journal_entry, step_count } = await req.json()

    if (!mood || !step_count) {
      return NextResponse.json(
        { error: 'Mood and step count are required' },
        { status: 400 }
      )
    }

    const today = format(new Date(), 'yyyy-MM-dd')

    let embedding = null
    if (journal_entry && journal_entry.trim().length > 0) {
      console.log('Generating embedding for entry:', journal_entry.substring(0, 50) + '...')
      try {
        embedding = await generateEmbedding(journal_entry)
        console.log('Embedding generated successfully. Length:', embedding?.length)
      } catch (err: any) {
        console.error('Failed to generate embedding:', err.message)
      }
    } else {
      console.log('No journal entry provided, skipping embedding.')
    }

    const newEntry: any = {
      user_id: session.user.id as string,
      date: today,
      mood,
      journal_entry: journal_entry || null,
      step_count: parseInt(step_count, 10),
      embedding: embedding
    }

    const entry = await addDailyEntry(newEntry) as any
    console.log('Daily Entry Saved to Supabase:', {
      id: entry?.id,
      date: entry?.date,
      mood: entry?.mood,
      has_embedding: !!entry?.embedding
    })
    return NextResponse.json(entry, { status: 201 })
  } catch (error: any) {
    console.error('CRITICAL ERROR in /api/daily-entry:', error)
    return NextResponse.json(
      { error: 'Failed to save daily entry', details: error.message },
      { status: 500 }
    )
  }
}
