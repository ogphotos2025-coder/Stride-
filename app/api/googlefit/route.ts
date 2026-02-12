import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    console.error('Google Fit API Trace: No session found.')
    return NextResponse.json({ error: 'No session found.' }, { status: 401 })
  }

  if (!session.accessToken) {
    console.error('Google Fit API Trace: Missing access tokens. Session user:', session.user?.email)
    return NextResponse.json({ error: 'Missing access token.' }, { status: 401 })
  }

  console.log('Google Fit API Trace: Fetching data for user:', session.user?.email)

  const now = new Date()
  const startTime = new Date()
  startTime.setDate(now.getDate() - 7)

  try {
    const response = await fetch('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        aggregateBy: [{
          dataTypeName: 'com.google.step_count.delta',
          dataSourceId: 'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps'
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
