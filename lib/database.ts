import { supabase } from './supabase'
import { DailyEntry } from '@/types'

export const getDailyEntries = async (userId: string) => {
  const { data, error } = await supabase
    .from('daily_entries')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(7)

  if (error) {
    console.error('Error fetching daily entries:', error)
    throw new Error(error.message)
  }
  return data
}

export const addDailyEntry = async (entry: Omit<DailyEntry, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('daily_entries')
    .insert([entry])
    .select()

  if (error) {
    console.error('Error adding daily entry:', error)
    throw new Error(error.message)
  }
  return data[0]
}
