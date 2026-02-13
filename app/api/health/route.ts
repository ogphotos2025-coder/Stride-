import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { supabaseAdmin as supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
    const results: any = {
        timestamp: new Date().toISOString(),
        env: {
            has_gemini_key: !!process.env.GEMINI_API_KEY,
            has_supabase_url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
            has_supabase_role_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
            gemini_key_prefix: process.env.GEMINI_API_KEY?.substring(0, 8),
        },
        tests: {}
    }

    // Test 1: Gemini Connectivity
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
        const testResult = await model.generateContent("Say 'HEALTHY'")
        results.tests.gemini = {
            status: 'ok',
            response: testResult.response.text().trim()
        }
    } catch (e: any) {
        results.tests.gemini = {
            status: 'error',
            message: e.message,
            stack: e.stack?.split('\n').slice(0, 3)
        }
    }

    // Test 2: Supabase Table Access
    try {
        const { data, error } = await supabase.from('daily_entries').select('count', { count: 'exact', head: true })
        if (error) throw error
        results.tests.supabase = {
            status: 'ok',
            entry_count: data
        }
    } catch (e: any) {
        results.tests.supabase = {
            status: 'error',
            message: e.message
        }
    }

    return NextResponse.json(results)
}
