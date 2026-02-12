import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  const { searchParams } = new URL(req.url)
  const startParam = searchParams.get('startTime')
  const endParam = searchParams.get('endTime')

  if (!session) {
    console.error('Google Fit API Trace: No session found.')
    return NextResponse.json({ error: 'No session found.' }, { status: 401 })
  }

  if (!session.accessToken) {
    console.error('Google Fit API Trace: Missing access tokens. Session user:', session.user?.email)
    return NextResponse.json({ error: 'Missing access token.' }, { status: 401 })
  }

  let now = endParam ? new Date(parseInt(endParam)) : new Date()
  let startTime = startParam ? new Date(parseInt(startParam)) : new Date()

  if (!startParam) {
    // Default to start of day 6 days ago (for a full 7-day week including today)
    startTime = new Date()
    startTime.setDate(startTime.getDate() - 6)
    startTime.setHours(0, 0, 0, 0)
  } else {
    // If a start time is provided, ensure it's aligned to start of that day
    startTime.setHours(0, 0, 0, 0)
  }

  if (!endParam) {
    // End time is now
    now = new Date()
  } else {
    // If an end time is provided, ensure it covers the whole end day
    now.setHours(23, 59, 59, 999)
  }

  console.log('Google Fit API Request Range:', {
    start: startTime.toISOString(),
    end: now.toISOString(),
    startMillis: startTime.getTime(),
    endMillis: now.getTime()
  })

  try {
    const response = await fetch('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        aggregateBy: [{
          dataTypeName: 'com.google.step_count.delta'
        }],
        bucketByTime: { durationMillis: 86400000 }, // 1 day in milliseconds
        startTimeMillis: startTime.getTime(),
        endTimeMillis: now.getTime(),
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Google Fit API Response Error:', response.status, errorText)
      return NextResponse.json({ error: `Google Fit API Error: ${response.statusText}`, details: errorText }, { status: response.status })
    }

    const data = await response.json()
    console.log('Google Fit API Success: Data received.')
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Google Fit API Critical Error:', error)
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 })
  }
}
