import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || !session.accessToken) {
    console.error('Google Fit API: Not authenticated or missing access token.')
    return NextResponse.json({ error: 'Not authenticated or missing access token.' }, { status: 401 })
  }

  console.log('Google Fit API: Access Token available.')

  const now = new Date()
  const startTime = new Date()
  startTime.setDate(now.getDate() - 7)

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
    let errorMessage = `Failed to fetch step count data: ${response.statusText}`
    try {
      const errorData = await response.json()
      console.error('Google Fit API Error (JSON):', errorData)
      errorMessage = `Failed to fetch step count data: ${errorData.message || response.statusText}`
    } catch (e) {
      const errorText = await response.text()
      console.error('Google Fit API Error (Raw Text):', errorText)
      errorMessage = `Failed to fetch step count data: ${errorText || response.statusText}`
    }
    return NextResponse.json({ error: errorMessage }, { status: response.status })
  }

  const data = await response.json()
  console.log('Google Fit API Response Data:', data)
  return NextResponse.json(data)
}
