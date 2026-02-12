import { supabase } from './supabase'
import { DailyEntry } from '@/types'
import { format, subDays } from 'date-fns'

export const getDailyEntries = async (userId: string, startDate?: Date, endDate?: Date) => {
  let query = supabase
    .from('daily_entries')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: true })

  if (startDate && endDate) {
    query = query.gte('date', format(startDate, 'yyyy-MM-dd'))
      .lte('date', format(endDate, 'yyyy-MM-dd'))
  } else {
    // Default to last 7 days if no date range is provided
    const defaultEndDate = new Date()
    const defaultStartDate = subDays(defaultEndDate, 6)
    query = query.gte('date', format(defaultStartDate, 'yyyy-MM-dd'))
      .lte('date', format(defaultEndDate, 'yyyy-MM-dd'))
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching daily entries:', error)
    throw new Error(error.message)
  }
  return data
}

export const addDailyEntry = async (entry: Omit<DailyEntry, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('daily_entries')
    .insert([entry]) // Use insert to allow multiple entries per day
    .select()

  if (error) {
    console.error('Error adding daily entry:', error)
    throw new Error(error.message)
  }
  return data[0]
}
