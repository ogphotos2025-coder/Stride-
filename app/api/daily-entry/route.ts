import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { addDailyEntry, getDailyEntries } from '@/lib/database'
import { DailyEntry } from '@/types'
import { format, parseISO } from 'date-fns'
import { generateEmbedding } from '@/lib/ai'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const { searchParams } = new URL(req.url)
  const start = searchParams.get('start')
  const end = searchParams.get('end')

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const startDate = start ? parseISO(start) : undefined
    const endDate = end ? parseISO(end) : undefined

    const entries = await getDailyEntries(session.user.id, startDate, endDate)
    return NextResponse.json(entries)
  } catch (error: any) {
    console.error('Error in GET /api/daily-entry:', error)
    return NextResponse.json(
      { error: 'Failed to fetch entries', details: error.message },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const { mood, journal_entry, step_count, date } = await req.json()

    if (mood === undefined || mood === null || step_count === undefined || step_count === null) {
      return NextResponse.json(
        { error: 'Mood and step count are required' },
        { status: 400 }
      )
    }

    const entryDate = date || format(new Date(), 'yyyy-MM-dd')

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
      date: entryDate,
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
