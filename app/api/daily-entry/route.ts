import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { addDailyEntry } from '@/lib/database'
import { DailyEntry } from '@/types'
import { format } from 'date-fns'

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

    const newEntry: Omit<DailyEntry, 'id' | 'created_at'> = {
      user_id: session.user.id as string,
      date: today,
      mood,
      journal_entry: journal_entry || null,
      step_count: parseInt(step_count, 10),
    }

    const entry = await addDailyEntry(newEntry)

    return NextResponse.json(entry, { status: 201 })
  } catch (error) {
    console.error('Error saving daily entry:', error)
    return NextResponse.json(
      { error: 'Failed to save daily entry' },
      { status: 500 }
    )
  }
}
