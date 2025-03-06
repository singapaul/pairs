export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Card {
  id: string
  content: string
}

export interface Database {
  public: {
    Tables: {
      decks: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string | null
          user_id: string
          is_public: boolean
          cards: Card[]
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description?: string | null
          user_id: string
          is_public?: boolean
          cards: Card[]
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string | null
          user_id?: string
          is_public?: boolean
          cards?: Card[]
        }
      }
      scores: {
        Row: {
          id: string
          created_at: string
          user_id: string
          deck_id: string
          time: number
          moves: number
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          deck_id: string
          time: number
          moves: number
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          deck_id?: string
          time?: number
          moves?: number
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
  }
} 