export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      daily_entries: {
        Row: {
          id: number
          user_id: string
          date: string
          mood: string
          journal_entry: string | null
          step_count: number
          embedding?: number[] | null
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          date: string
          mood: string
          journal_entry?: string | null
          step_count: number
          embedding?: number[] | null
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          date?: string
          mood?: string
          journal_entry?: string | null
          step_count?: number
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type DailyEntry = Database['public']['Tables']['daily_entries']['Row']
